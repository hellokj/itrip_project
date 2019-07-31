const Itinerary = require('../models/itinerary');
const NilChecker = require('../utils/nilChecker');
const Response = require('../utils/responseHandler');
const errorHandler = require('../utils/errorHandler');

const save = async (req, res, next) => {
    let memberIds = [req.decoded.memberId];
    let memberId = req.body.memberId;
    if(memberId !== undefined) {
        memberIds.push(memberId);
    }
    let isPublic = req.body.isPublic;
    let _id = req.body._id;
    let startDate = req.body.startDate;
    let name = req.body.name;
    let dayNum = req.body.dayNum;
    let startTimes = req.body.startTimes;
    let togos = req.body.togos;
    let travelInfos = req.body.travelInfos;
    // console.log(memberIds, memberId, isPublic, _id, startDate, name, dayNum, startTimes, togos, travelInfos);

    // if(NilChecker(req.body, 8, [])) {
    //     Response(errorHandler.REQUIRED_FIELD_IS_MISSING, null, res);
    // }
    //console.log(memberIds);

    // 先查詢資料庫有無相同_id的資料
    let target = await Itinerary.get(_id);
    let itinerary = new Itinerary({
        _id: _id,
        isPublic: isPublic,
        memberIds: memberIds,
        startDate: startDate,
        name: name,
        dayNum: dayNum,
        startTimes: startTimes,
        togos: togos,
        travelInfos: travelInfos
    });
    
    if (target == null){
        // 若無 新增
        itinerary.save().then(() => res.json({status: -1, msg:'success', data: itinerary}));
    }else {
        // 若有 取出後更新
        Itinerary.updateItinerary(_id, itinerary).then(() => {
            res.json({status: -1, msg:'success', data: itinerary});
        });
    }
}

const getItineraries = async(req, res, next) => {
    // 藉由 memeberId 去查詢有包含此會員id的行程
    let memberId = req.decoded.memberId;
    //console.log("memberId", memberId);
    let itineraries = await Itinerary.find({ memberIds: memberId});
    //console.log(itineraries);
    res.json({status: -1, msg:'success', data: itineraries, currentAccessId: memberId});
};

const getItinerary = async(req, res, next) => {
    let id = req.body.itineraryId;
    let memberId = req.body.memberId;
    let memberIdToken = req.decoded.memberId;
    if(memberId !== memberIdToken) {
        console.log(memberId, memberIdToken)
        Response(errorHandler.ACCESS_TOKEN_EXPIRED, null, res);
        return;
    }
    //console.log(id);
    let itinerary = await Itinerary.findOne({_id: id});
    res.json({status: -1, msg:'success', data: itinerary, currentAccessId: memberId});
}

const removeMember = async(req, res, next) => {
    let id = req.body.id;
    let itinerary = await Itinerary.find({ _id: id});
    let memberId = req.body.memberId;
    console.log(itinerary);
}

const deleteItinerary = async(req, res, next) => {
    // get spot's address from req and get region name
    let _id = req.body.id;
    await Itinerary.deleteItinerary(_id);
    res.json({status: -1, msg:'success'});
}

module.exports = {
    save,
    getItineraries,
    removeMember,
    deleteItinerary,
    getItinerary
}