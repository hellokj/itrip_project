const Place = require('../models/poiBank');

const getAllPlaces = (req, res, next) => {
    
    res.json({status: -1, msg: "Success"})
}

module.exports = {
    getAllPlaces
}