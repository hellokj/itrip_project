const Member = require('../models/member');
const NilChecker = require('../utils/nilChecker');
const Response = require('../utils/responseHandler');
const errorHandler = require('../utils/errorHandler');

const getMember = (req, res, next) => {
  // 給予token 取得member資訊
  let memberDecoded = req.decoded;
  console.log("decoded", req.decoded);
  res.json({status: -1, msg:'success', data: memberDecoded});
}

const modifyProfile = async (req, res, next) => {
  console.log("?????", req.body);
  let _id = req.decoded.memberId;
  let email = req.body.memberInfo.account;
  let url = req.body.memberInfo.url;
  let name = req.body.memberInfo.name;
  let originPassword = req.body.memberInfo.originPassword;
  let newPassword = req.body.memberInfo.password;
  
  // 更改自己的會員資訊(密碼)
  let member = await Member.findMember(email, url, originPassword);
  if (member !== null){
    // 找到後更新
    let newMember = member;
    newMember._id = _id;
    newMember.email = email;
    newMember.name = name;
    newMember.url = url;
    newMember.password = newPassword;
    await Member.updateMemberInfo(_id, newMember);
    return res.json({status: -1, msg:'success', data: newMember});
  }else {
    // 沒找到
    if(user == null) {
      Response(errorHandler.INVALID_EMAIL_OR_PASSWORD, null, res);
      return;
    }
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
  getMember
}