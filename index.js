const express = require('express');
const app = express();
const config = require('./config');
const router = require('./routes');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use('/api', router);

mongoose.connect(config.mongodb,{
    useNewUrlParser: true }).then(() => {
    app.listen(config.port, ()=> {
        console.log('listening on ' + config.port);
    });
}).catch((err) => {
    console.log(err);
})