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
    category_list: Array,
    hours: Array,
    price_range: String,
    about: String,
    to_be_deleted: Boolean,
    address: Object,
    is_permanently_closed: Boolean,
    images: Array
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

// get nearby places sort by distance
spotSchema.statics.getNearby = function(location, distance, sortBy, page, limit, order) {
    let aggregate = this.aggregate([{
        $geoNear: {
            near: { 
            type: "Point",
            coordinates: [parseFloat(location['lon']), parseFloat(location['lat'])]
        },
        distanceField: "dist.calculated",
        maxDistance: distance,
        spherical: true
        }
    }]);
    return this.aggregatePaginate(aggregate, Options(sortBy, page, limit, order), 
            function(err, results) {
                return results;
            });
}

module.exports = mongoose.model('Spot', spotSchema);