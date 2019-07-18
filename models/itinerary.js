const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// itinerary schema
const itinerarySchema = new Schema({
    _id: Number,
    memberIds: Array,
    startDate: Object,
    name: String,
    dayNum: Number,
    togos: Array,
    travelInfos: Array,
    popularity: Number,
});

module.exports = mongoose.model('Itinerary', itinerarySchema);