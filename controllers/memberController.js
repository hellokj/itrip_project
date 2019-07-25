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

const modifyProfile = (req, res, next) => {
  // 更改自己的會員資訊(密碼)
  res.json({status: -1, msg:'success', data: "??"});
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