const mongoose = require('mongoose');
const CheckSortBy = require('../utils/checkSortBy');
const Schema = mongoose.Schema;

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
},{
    collection: 'Places_from_fb'
}
);
// query for place search => shortening
const Place_query = (place) => {
    return [{"address.city": place}, {"address.state": place}, 
    {"address.county": place}, {"address.suburb": place}, {"address.town": place}, {"address.state_district": place}];
}

// create 2dsphere index. NEEDED for MongoDB built-in sort-by-distance functionality
spotSchema.indexes({location: '2dsphere'});

// sortBy => checkins, ig_post_num
spotSchema.statics.getSpots = function(place, category, name, sortBy) {
    if(name != undefined) {
        return this.find({$or:[{name:{$regex:name,$options:"$i"}}, {wiki_name:{$regex:name,$options:"$i"}}]}).sort({checkins: -1}).limit(10);
    }
    else if(category != undefined){
        return CheckSortBy(this, {$or: Place_query(place), category: category}, sortBy);
    }
    else {
        // return this.find({$or:[{"address.city": place}, {"address.state": place}, 
        //                 {"address.county": place}, {"address.suburb": place}, {"address.town": place}, {"address.state_district": place}]}).sort({checkins: -1}).limit(10);
        return CheckSortBy(this, {$or: Place_query(place)}, sortBy);
    }
}

// get spot info by its id
spotSchema.statics.get = function(_id) {
    let spot = this.find({_id:_id});
    return spot;
}

// get nearby places sort by distance
spotSchema.statics.getNearby = function(location, distance) {
    let x = this.aggregate([{
          $geoNear: {
             near: { 
               type: "Point",
               coordinates: [parseFloat(location['lon']), parseFloat(location['lat'])]
             },
             distanceField: "dist.calculated",
             maxDistance: distance,
             spherical: true
          }
        }
       ]).
       then(function (res) {
         return res;  
       });  
    return x;
}

module.exports = mongoose.model('Spot', spotSchema);