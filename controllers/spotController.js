const Spot = require('../models/spot');
const NilChecker = require('../utils/nilChecker');
const FieldChecker = require('../utils/fieldChecker');
const Response = require('../utils/responseHandler');
const errorHandler = require('../utils/errorHandler');


const getSpots = async(req, res, next) => {
    let place = req.query.place;
    let category = req.query.category;
    let name = req.query.name;
    let sortBy = req.query.sortBy;
    if(NilChecker(req.query, 4, ['category', 'name'])) {
        Response(errorHandler.REQUIRED_FIELD_IS_MISSING, null, res);
        return;
    }
    
    let spots = await Spot.getSpots(place, category, name, sortBy);
    Response(null, spots, res);
}

const getNearbySpots = async(req, res, next) => {
    // get spot's address from req and get region name
    let _id = req.query.id;
    let distance = req.query.distance;
    let spot = (await Spot.get(_id));
    let region = FieldChecker(spot.address, ['town', 'state_district', 'suburb']);
    if(region == null) {
        Response(errorHandler.REQUIRED_FIELD_IS_MISSING, null, res);
        return;
    }

    // get origin lon and lat
    let origin_lon = spot.location.coordinates[0];
    let origin_lat = spot.location.coordinates[1];

    let loc = {lon: origin_lon, lat: origin_lat};
    let nearby = await Spot.getNearby(loc, distance);

    //console.log(nearby);
    nearby.shift()
    Response(null, nearby, res);
}

module.exports = {
    getSpots,
    getNearbySpots
}