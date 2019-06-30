const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//姓名 電話 密碼 性別(數字) 職業
const placeSchema = new Schema({
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

// 靜態方法 => 通常多用在搜尋Table裡的內容
placeSchema.statics.getPlaces = function(place, category) {
    if(category == undefined) {
        return this.find({$or:[{"address.city": place}, {"address.state": place}, 
                        {"address.county": place}, {"address.suburb": place}, {"address.town": place}]}).sort({checkins: -1});
    }
    else {
        return this.find({$or:[{"address.city": place}, {"address.state": place}, 
                        {"address.county": place}, {"address.suburb": place}, {"address.town": place}], category: category}).sort({checkins: -1});
    }
    
}

module.exports = mongoose.model('Place', placeSchema);