const Itinerary = require('../models/itinerary');
const NilChecker = require('../utils/nilChecker');
const Response = require('../utils/responseHandler');
const errorHandler = require('../utils/errorHandler');

const save = (req, res, next) => {
    let memberIds = req.body.memberIds;
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
        start_date: startDate,
        name: name,
        dayNum: dayNum,
        togos: togos,
        travelInfos: travelInfos
    });

    itinerary.save().then(() => Response(null, togos, res));
} 

module.exports = {
    save,
}