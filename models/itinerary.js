const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// itinerary schema
const itinerarySchema = new Schema({
    _id: Number,
    userId: Number,
    startDate: {
        year: Number,
        month: Number,
        day: Number
    },
    name: String,
    dayNum: Number,
    list: Array
})

// get itinerary
const getItinerary = (userId, token) => {
    // check token to see if the user is valid
    //if(checkToken(token))
    this.find
}

module.exports = mongoose.model('Itinerary', itinerarySchema);