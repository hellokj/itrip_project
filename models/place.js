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
placeSchema.statics.findByCity = function(city) {
    return this.find({"address.city": city});
}   


module.exports = mongoose.model('Place', placeSchema);