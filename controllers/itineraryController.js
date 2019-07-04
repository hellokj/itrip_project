const Itinerary = require('../models/itinerary');
const NilChecker = require('../utils/nilChecker');
const Response = require('../utils/responseHandler');
const errorHandler = require('../utils/errorHandler');

const save = (req, res, next) => {
    let memberId = req.decoded.memberId;
    let _id = new Date().getTime();
    let userId = req.body.userId;
    let startDate = {
        year: req.body.year,
        month: req.body.month,
        day: req.body.day
    };
    let name = req.body.name;
    let dayNum = req.body.dayNum;
    let itiList = req.body.list;

    if(NilChecker(req.body, 7, [])) {
        Response(errorHandler.REQUIRED_FIELD_IS_MISSING, null, res);
    }
 
    let itinerary = new Itinerary({
        _id: _id,
        userId: userId,
        start_date: startDate,
        name: name,
        dayNum: dayNum,
        list: itiList
    });

    itinerary.save().then(() => Response(null, itiList, res));
} 

module.exports = {
    save,
}