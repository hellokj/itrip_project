const Place = require('../models/place');

const getPlaceByCity = async(req, res, next) => {
    let city = req.params.city;
    let places = await Place.findByCity(city).limit(10);
    res.json({status: -1, msg: places});
}

module.exports = {
    getPlaceByCity
}