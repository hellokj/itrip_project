const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// member schema
const memberSchema = new Schema({
    signUpDate: {
        year: Number,
        month: Number,
        day: Number
    },
    name: String,
    url: String,
    email: String,
    password: String,
});

memberSchema.statics.findMember = function(email, url, password) {
    let member;
    if(password == undefined) {
        member = this.findOne({$or:[{email:email}, {url:url}]});
    }
    else {
        member = this.findOne({email: email, password: password});
    }
    return member;
}


module.exports = mongoose.model('Member', memberSchema);