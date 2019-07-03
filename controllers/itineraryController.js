const Itinerary = require('../models/itinerary');
const NilChecker = require('../utils/nilChecker');

const save = (req, res, next) => {
    let userId = req.body.userId;
    let _id = new Date().getTime();
    let startDate = {
        year: req.body.year,
        month: req.body.month,
        day: req.body.day
    };
    let name = req.body.name;
    let dayNum = req.body.dayNum;
    let itiList = req.body.list;

    if(NilChecker(req.body, 7, [])) {
        res.json({status: 400, msg: 'BAD REQUEST'})
    }

    console.log(itiList);
 
    let itinerary = new Itinerary({
        _id: _id,
        userId: userId,
        start_date: startDate,
        name: name,
        dayNum: dayNum,
        list: itiList
    });

    itinerary.save().then(() => res.json( {status: 200, data: itiList, msg: 'success'}));
} 

module.exports = {
    save,
}