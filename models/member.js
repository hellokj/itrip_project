const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// member schema
const memberSchema = new Schema({
    _id: String,
    signUpDate: {
        year: Number,
        month: Number,
        day: Number
    },
    name: String,
    url: String,
    email: String,
    password: String,
    isThirdPartyAccount: false
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

// update member info
memberSchema.statics.updateMemberInfo = function(_id, changes) {
    return this.replaceOne({_id: _id}, changes);
}

module.exports = mongoose.model('Member', memberSchema);