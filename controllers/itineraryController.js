const Itinerary = require('../models/itinerary');
const NilChecker = require('../utils/nilChecker');
const Response = require('../utils/responseHandler');
const errorHandler = require('../utils/errorHandler');

const save = async (req, res, next) => {
    let memberIds = [req.decoded.memberId];
    let _id = req.body._id;
    let startDate = req.body.startDate;
    let name = req.body.name;
    let dayNum = req.body.dayNum;
    let togos = req.body.togos;
    let travelInfos = req.body.travelInfos;

    if(NilChecker(req.body, 7, [])) {
        Response(errorHandler.REQUIRED_FIELD_IS_MISSING, null, res);
    }

    // 先查詢資料庫有無相同_id的資料
    let target = await Itinerary.get(_id);
    let itinerary = new Itinerary({
        _id: _id,
        memberIds: memberIds,
        startDate: startDate,
        name: name,
        dayNum: dayNum,
        togos: togos,
        travelInfos: travelInfos
    });
    if (target == null){
        // 若無 新增
        itinerary.save().then(() => Response(null, togos, res));
    }else {
        // 若有 取出後更新
        Itinerary.updateItinerary(_id, itinerary).then(() => {
            Response(null, itinerary, res);
        });
    }
}

const getItineraries = async(req, res, next) => {
    // 藉由 memeberId 去查詢有包含此會員id的行程
    let memberId = req.decoded.memberId;
    console.log("memberId", memberId);
    let itineraries = await Itinerary.find({ memberIds: memberId});
    res.json({status: -1, msg:'success', data: itineraries});
};

module.exports = {
    save,
    getItineraries
}