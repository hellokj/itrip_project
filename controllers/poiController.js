const Place = require('../models/place');
const NilChecker = require('../utils/nilChecker');

const getPlaceByCity = async(req, res, next) => {
    let place = req.query.place;
    let places = await Place.findByPlace(place).limit(10);
    console.log(places)
    res.json({status: -1, msg: 'success'});
}

module.exports = {
    getPlaceByCity
}