const Spot = require('../models/spot');
const NilChecker = require('../utils/nilChecker');
const FieldChecker = require('../utils/fieldChecker');

const getSpots = async(req, res, next) => {
    let spot = req.query.spot;
    let category = req.query.category;
    let name = req.query.name;
    let sortBy = req.query.sortBy;
    if(NilChecker(req.query, 4, ['category', 'name', 'sortBy'])) {
        res.json({status: 400, msg: 'BAD REQUEST'})
        return;
    }
    let spots = await Spot.getSpots(spot, category, name, sortBy);
    res.json({status: -1, msg: 'success', data: spots});
}

const getNearbySpots = async(req, res, next) => {
    // get spot's address from req and get region name
    let name = req.query.name;
    let distance = req.query.distance;
    let spot = (await Spot.get(name))[0];
    let region = FieldChecker(spot.address, ['town', 'state_district', 'suburb']);
    if(region == null) {
        res.json({status: 400, msg: 'BAD REQUEST'});
        return;
    }

    // get origin lon and lat
    let origin_lon = spot.location.coordinates[0];
    let origin_lat = spot.location.coordinates[1];

    let loc = {lon: origin_lon, lat: origin_lat};
    let nearby = await Spot.getNearby(loc, distance);

    console.log(nearby);

    //console.log(nearby);
    res.json({status: -1, msg: 'success'});
}

module.exports = {
    getSpots,
    getNearbySpots
}