const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//姓名 電話 密碼 性別(數字) 職業
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

spotSchema.indexes({location: '2dsphere'});

// 靜態方法 => 通常多用在搜尋Table裡的內容
spotSchema.statics.getSpots = function(place, category, name, sortBy) {
    if(name != undefined) {
        return this.find({$or:[{name:{$regex:name,$options:"$i"}}, {wiki_name:{$regex:name,$options:"$i"}}]}).sort({checkins: -1}).limit(10);
    }
    else if(category != undefined){
        return this.find({$or:[{"address.city": place}, {"address.state": place}, 
                        {"address.county": place}, {"address.suburb": place}, {"address.town": place}, {"address.state_district": place}], category: category}).sort({sortBy: -1}).limit(10);
    }
    else {
        return this.find({$or:[{"address.city": place}, {"address.state": place}, 
                        {"address.county": place}, {"address.suburb": place}, {"address.town": place}, {"address.state_district": place}]}).sort({sortBy: -1}).limit(10);
    }
}

spotSchema.statics.get = function(name) {
    let spot = this.find({name:{$regex:name,$options:"$i"}});
    return spot;
}

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