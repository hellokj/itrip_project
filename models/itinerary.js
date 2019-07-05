const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// itinerary schema
const itinerarySchema = new Schema({
    _id: Number,
    memberId: Number,
    startDate: {
        year: Number,
        month: Number,
        day: Number
    },
    name: String,
    dayNum: Number,
    list: Array
})


module.exports = mongoose.model('Itinerary', itinerarySchema);