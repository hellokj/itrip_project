const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// itinerary schema
const itinerarySchema = new Schema({
    _id: Number,
    memberId: Number,
    startDate: Object,
    name: String,
    dayNum: Number,
    togos: Array,
    travelInfos: Array
})


module.exports = mongoose.model('Itinerary', itinerarySchema);