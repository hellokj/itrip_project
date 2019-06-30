const Place = require('../models/place');
const NilChecker = require('../utils/nilChecker');

const getPlaces = async(req, res, next) => {
    let place = req.query.place;
    let category = req.query.category;
    let places = await Place.getPlaces(place, category).limit(10);
    console.log(places)
    res.json({status: -1, msg: 'success'});
}

module.exports = {
    getPlaces
}