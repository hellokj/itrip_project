const Itinerary = require('../models/itinerary');
const NilChecker = require('../utils/nilChecker');
const Response = require('../utils/responseHandler');
const errorHandler = require('../utils/errorHandler');

const save = (req, res, next) => {
    let memberIds = [req.decoded.memberId];
    let _id = new Date().getTime();
    let startDate = req.body.startDate;
    let name = req.body.name;
    let dayNum = req.body.dayNum;
    let togos = req.body.togos;
    let travelInfos = req.body.travelInfos;

    if(NilChecker(req.body, 6, [])) {
        Response(errorHandler.REQUIRED_FIELD_IS_MISSING, null, res);
    }

    let itinerary = new Itinerary({
        _id: _id,
        memberIds: memberIds,
        startDate: startDate,
        name: name,
        dayNum: dayNum,
        togos: togos,
        travelInfos: travelInfos
    });

    itinerary.save().then(() => Response(null, togos, res));
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