const Place = require('../models/place');

const getPlaces = async(req, res, next) => {
    let place = req.query.place;
    let category = req.query.category;
    let name = req.query.category;
    let places = await Place.getPlaces(place, category, name).limit(10);
    console.log(places)
    res.json({status: -1, msg: 'success'});
}

module.exports = {
    getPlaces
}