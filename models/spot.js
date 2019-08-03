const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');
const mongooseHelper = require('../utils/mongooseHelper');
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate-v2');
const Options = mongooseHelper.Options;
const Place_query_shortener = mongooseHelper.Place_query;

//Spot schema
const spotSchema = new Schema({
    _id: String,
    name: String,
    checkins: Number,
    location: Object,
    category: String,
    hours: Array,
    price_range: String,
    about: String,
    to_be_deleted: Boolean,
    address: Object,
    is_permanently_closed: Boolean,
    images: Array,
    ig_post_num: Number,
    ig_tag: Array
    },
    { collection: 'Places_from_fb'});

// plug in pagination module to schema
spotSchema.plugin(mongoosePaginate);
spotSchema.plugin(mongooseAggregatePaginate);

// create 2dsphere index. NEEDED for MongoDB built-in sort-by-distance functionality
spotSchema.indexes({location: '2dsphere'});

// sortBy => checkins, ig_post_num
spotSchema.statics.getSpots = function(city, region, category, name, sortBy, page, limit, order) {
    return Place_query_shortener(this, city, region, category, name, sortBy, page, limit, order);
}

// get spot info by its id
spotSchema.statics.get = function(_id) {
    let spot = this.findOne({_id:_id});
    return spot;
}

// update spot info
spotSchema.statics.updateSpot = function(changes) {
    return this.replaceOne({_id: changes._id}, changes);
}

// delete spot
spotSchema.statics.deleteSpot = function(_id) {
    return this.deleteOne({_id: _id});
}

// get nearby places sort by distance
spotSchema.statics.getNearby = function(location, categories, distance, sortBy, page, limit, order) {
    let aggregate;
    if(categories == null) {
        aggregate = this.aggregate([{
            $geoNear: {
               near: { 
                 type: "Point",
                 coordinates: [parseFloat(location['lon']), parseFloat(location['lat'])]
               },
               distanceField: "dist.calculated",
               maxDistance: distance,
               spherical: true
            }},
            {"$sort":{ [sortBy]: -1, "distance": 1 }}]);
    }
    else {
        aggregate = this.aggregate([{
            $geoNear: {
               near: { 
                 type: "Point",
                 coordinates: [parseFloat(location['lon']), parseFloat(location['lat'])]
               },
               distanceField: "dist.calculated",
               maxDistance: distance,
               spherical: true,
               query: {'category': {$in: categories}}
            }
        },{"$sort": { [sortBy]: -1, "distance": 1, }}]);
    }
    return this.aggregatePaginate(aggregate, Options(null, page, limit, order, 'nearby'), 
            function(err, results) {
                return results;
            });
}

module.exports = mongoose.model('Spot', spotSchema);