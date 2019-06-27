const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let places = mongoose.model("Places_from_fb", new Schema({})); 

var action = function (err, collection) {
    
};

mongoose.connection.db.collection('question', action);