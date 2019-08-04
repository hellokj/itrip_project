const config = require('../config');
const jwt = require('jsonwebtoken');
const Member = require('../models/member');
const NilChecker = require('../utils/nilChecker');
const Response = require('../utils/responseHandler');
const errorHandler = require('../utils/errorHandler');

const getMember = (req, res, next) => {
  // 給予token 取得member資訊
  let memberDecoded = req.decoded;
  //console.log("decoded", req.decoded);
  res.json({status: -1, msg:'success', data: memberDecoded});
}

const findMemberByMail = async (req, res, next) => {
  let email = req.body.email;
  let member = await Member.findMember(email, null, null);
  //console.log(member);
  res.json({status: -1, msg:'success', data: member});
}

const modifyProfile = async (req, res, next) => {
  // console.log("req body", req.body);
  let _id = req.decoded.memberId;
  let email = req.body.memberInfo.account;
  let url = req.body.memberInfo.url;
  let name = req.body.memberInfo.name;
  let originPassword = req.body.memberInfo.originPassword;
  let newPassword = req.body.memberInfo.password;
  
  // 更改自己的會員資訊(密碼)
  let member = await Member.findMember(email, url, originPassword);
  //console.log("found member", member);
  if (member !== null){
    // 找到後更新
    let newMember = member;
    newMember._id = _id;
    newMember.email = email;
    newMember.name = name;
    newMember.url = url;
    if (newPassword == ""){
      newMember.password = originPassword;
    }else {
      newMember.password = newPassword;
    }
    // console.log("newMember", newMember);
    await Member.updateMemberInfo(_id, newMember);
    let token = jwt.sign(
      {memberId: String(newMember._id),
        account: newMember.email,
        name: newMember.name,
        url: newMember.url}
      ,config.jwtSalt, {
      expiresIn: 60*60*24 //24 hrs
      });
    return res.json({status: -1, msg:'success', data: newMember, token: token});
  }else {
    // 沒找到
    Response(errorHandler.INVALID_EMAIL_OR_PASSWORD, null, res);
    return;
  }
};

const followMember = (req, res, next) => {
  // 追蹤其他人
};

const removeFollowingItem = (req, res, next) => {
  // 刪除追蹤的人或行程
};

module.exports = {
  modifyProfile,
  getMember,
  findMemberByMail
}