const Member = require('../models/member');
const NilChecker = require('../utils/nilChecker');
const Response = require('../utils/responseHandler');
const errorHandler = require('../utils/errorHandler');

const modify = (req, res, next) => {
  // 回傳當初包進token的資料 memberId (Member._id)
  // 用此id找到member 修改行程資訊
  Response(null, req.decoded.memberId, res);
} 

module.exports = {
  modify,
}