const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// itinerary schema
const itinerarySchema = new Schema({
    _id: Number,
    isPublic: Boolean,
    memberIds: Array,
    startDate: Object,
    name: String,
    dayNum: Number,
    togos: Array,
    startTimes: Array,
    travelInfos: Array,
    popularity: Number,
});

itinerarySchema.statics.get = function(_id){
    let itinerary;
    itinerary = this.findOne({_id: _id});
    return itinerary;
}

// update itinerary info
itinerarySchema.statics.updateItinerary = function(_id, changes) {
    return this.replaceOne({_id: _id}, changes);
}

module.exports = mongoose.model('Itinerary', itinerarySchema);