const Spot = require('../models/spot');
const NilChecker = require('../utils/nilChecker');
const FieldChecker = require('../utils/fieldChecker');
const Geo = require('geo-nearby');

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
    let spot = (await Spot.get(name))[0];
    let region = FieldChecker(spot.address, ['town', 'state_district', 'suburb']);
    if(region == null) {
        res.json({status: 400, msg: 'BAD REQUEST'});
        return;
    }
    // get all spots in region
    let nearby = await Spot.getNearby(region);

    // get origin lat and lon
    let origin_lat = spot.location.lat;
    let origin_lon = spot.location.lon;
    
    const dataSet = Geo.createCompactSet(nearby, {id: '_id', lat: ['location', 'lat'], lon: ['location', 'lon']});
    const geo = new Geo(dataSet, {sorted: true });
 
    console.log(geo.nearBy(origin_lat, origin_lon, 5000));
    //console.log(nearby);
    res.json({status: -1, msg: 'success'});
}

module.exports = {
    getSpots,
    getNearbySpots
}