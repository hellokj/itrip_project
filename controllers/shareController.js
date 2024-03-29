const Itinerary = require('../models/itinerary');
const NilChecker = require('../utils/nilChecker');
const Response = require('../utils/responseHandler');
const errorHandler = require('../utils/errorHandler');

const getSharedItineraries = async(req, res, next) => {
    let id = req.query.id;
    let itineraries = await Itinerary.find({ _id: id});
    res.json({status: -1, msg:'success', data: itineraries});
};

const shareItineraries = async (req, res, next) => {
    let id = req.body.id;
    let startDate = req.body.startDate;
    let name = req.body.name;
    let dayNum = req.body.dayNum;
    let togos = req.body.togos;
    let travelInfos = req.body.travelInfos;

    if(NilChecker(req.body, 6, [])) {
        Response(errorHandler.REQUIRED_FIELD_IS_MISSING, null, res);
    }

    let itinerary = new Itinerary({
        _id: id,
        startDate: startDate,
        name: name,
        dayNum: dayNum,
        togos: togos,
        travelInfos: travelInfos
    });
    itinerary.save().then(() => res.json({status: -1, msg:'success', data: itinerary}));
}

const update = async (req, res, next) => {
    let _id = req.body._id;
    let startDate = req.body.startDate;
    let name = req.body.name;
    let dayNum = req.body.dayNum;
    let startTimes = req.body.startTimes;
    let togos = req.body.togos;
    let travelInfos = req.body.travelInfos;

    let itinerary = new Itinerary({
        _id: _id,
        startDate: startDate,
        name: name,
        dayNum: dayNum,
        startTimes: startTimes,
        togos: togos,
        travelInfos: travelInfos
    });
 
    Itinerary.updateItinerary(_id, itinerary).then(() => {
        Response(null, itinerary, res);
    });
}

module.exports = {
    shareItineraries,
    getSharedItineraries,
    update,
}