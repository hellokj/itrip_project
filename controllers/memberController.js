const Member = require('../models/member');
const NilChecker = require('../utils/nilChecker');
const Response = require('../utils/responseHandler');
const errorHandler = require('../utils/errorHandler');


const modifyItinerary = (req, res, next) => {
  // 回傳當初包進token的資料 memberId (Member._id)
  // 用此id找到itinerary 修改行程資訊
  Response(null, req.decoded.memberId, res);
};

const reviewItineraries = (req, res, next) => {
  let memeberId = req.decoded.memberId;
  // 查看自己的行程
  Response(null, memeberId, res);
}

const setProfile = (req, res, next) => {
  // 更改自己的會員資訊(密碼)
};

const followMember = (req, res, next) => {
  // 追蹤其他人
};

const removeFollowItem = (req, res, next) => {
  // 刪除追蹤的人或行程
};

module.exports = {
  modifyItinerary,
  setProfile,
  reviewItineraries
}