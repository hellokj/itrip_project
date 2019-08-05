const config = require('../config');
const jwt = require('jsonwebtoken');
const Member = require('../models/member');
const NilChecker = require('../utils/nilChecker');
const Response = require('../utils/responseHandler');
const errorHandler = require('../utils/errorHandler');

let self = this;

const signUp = async(req, res, next) => {
    // Sign up date
    let today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();
    
    let name = req.body.name;
    let url = req.body.url;
    let email = req.body.email;
    let password = req.body.password;

    let m = await Member.findMember(email, url)
    if(m != null) {
        Response(errorHandler.EMAIL_OR_URL_ALREADY_EXISTS, null, res);
        return;
    }

    if(NilChecker(req.body, 4, [])) {
        Response(errorHandler.REQUIRED_FIELD_IS_MISSING, null, res);
        return;
    }

    if(!is_valid_password(password)) {
        Response(errorHandler.INVALID_PASSWORD, null, res);
        return;
    }

    let member = new Member({
        _id: email,
        signUpDate: {
            year: year,
            month: month,
            day: day
        },
        name: name,
        url: url,
        email: email,
        password: password,
    })

    member.save().then(() => res.json( {status: 200, member: member, msg: 'success'}));
}

const logIn = async(req, res, next) => {
    let email = req.body.email;
    let password = req.body.password;

    if(NilChecker(req.body, 2, [])) {
        Response(errorHandler.REQUIRED_FIELD_IS_MISSING, null, res);
        return;
    }

    if(!is_valid_password(password)) {
        Response(errorHandler.INVALID_PASSWORD, null, res);
    }
    let user = await Member.findMember(email, null, password);

    if(user == null) {
        Response(errorHandler.INVALID_EMAIL_OR_PASSWORD, null, res);
        return;
    }
    // login success!
    getToken(req, res);
}

const fbLogIn = async(req, res, next) => {
    // console.log('req.body', req.body);
    let name = req.body.name;
    let email = req.body.email;
    let member = await Member.findMember(email, null, null);
    // console.log('fbMember', member);
    if (member !== null){
        // 登入進去，給token回去
        let token = jwt.sign(
            {memberId: String(member._id),
            account: member.email,
            name: member.name,
            url: member.url}
            ,config.jwtSalt
            , {
            expiresIn: 60*60*24 //24 hrs
        });
        res.json({status: -1, msg: 'success!', data: token, memberId:String(member._id), memberName: member.name});
    }else {
        // 第一次登入，註冊一個新的，給token回去
        let _id = req.body.email;
        let name = req.body.name;
        let email = req.body.email;
        let today = new Date();
        let year = today.getFullYear();
        let month = today.getMonth() + 1;
        let day = today.getDate();
        let url = "";
        let password = "123QQQ"; // 預設fb登入的共通密碼

        let fbMember = new Member({
            _id: _id,
            signUpDate: {
                year: year,
                month: month,
                day: day
            },
            name: name,
            url: url,
            email: email,
            password: password,
        });
        fbMember.isThirdPartyAccount = true;
        // console.log('fbMember', fbMember);
        fbMember.save().then(function(){
            let token = jwt.sign(
                {memberId: String(fbMember._id),
                account: fbMember.email,
                name: fbMember.name,
                url: fbMember.url}
                ,config.jwtSalt, {
                expiresIn: 60*60*24 //24 hrs
            });
            res.json( {status: 200, member: fbMember, msg: 'hello, new member from fb', token: token})
        });
    }
}

const is_valid_password = (password) => {
    if(password.length < 6) {
        return false;
    }
    for(let i=0;i<password.length;i++) {
        if(password.charCodeAt(i) >= 65 && password.charCodeAt(i) <= 90) {
            return true;
        }
    }
    return false;
}

const getToken = (req, res, next) => {
    Member.findOne({email:req.body.email, password:req.body.password}, (err, member) => {
        if(err) {
            Response(err, null, res);
        }
        if(!member){
            Response(errorHandler.INVALID_EMAIL, null, res);
            return;
        }
        // first param: value returned by user every request, second: salt(private key), third: expireTime 
        let token = jwt.sign(
                {memberId: String(member._id),
                account: member.email,
                name: member.name,
                url: member.url}
                ,config.jwtSalt, {
            expiresIn: 60*60*24 //24 hrs
        });
        res.json({status: -1, msg: 'success!', data: token, memberId:String(member._id), memberName: member.name});
    });
};

const checkToken = (req, res, next) => {
    let token = req.headers['x-access-token'];
    if(token) {
        jwt.verify(token, config.jwtSalt, (err, decoded) => {
            if(err){
                Response(errorHandler.INVALID_ACCESS_TOKEN, null, res);
                return;
            }
            else {
                req.decoded = decoded;
                next();
            }
        });
    }
    else {
        Response(errorHandler.PERMISSION_DENIED, null, res);
        return;
    }
}

module.exports = {
    checkToken,
    signUp,
    logIn,
    fbLogIn
}