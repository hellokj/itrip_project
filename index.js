const express = require('express');
const app = express();

// CORS: 前後端整合時需要: https://developer.mozilla.org/zh-TW/docs/Web/HTTP/CORS
// 在需要請求不同網域資源時要使用，express預設是禁止非同源的請求
const cors = require('cors');

const config = require('./config');
const router = require('./routes');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json({limit: '10mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}))

app.use(cors());
app.use('/api', router);

mongoose.connect(config.mongodb,{
    useNewUrlParser: true }).then(() => {
    app.listen(config.port, ()=> {
        console.log('listening on ' + config.port);
    });
}).catch((err) => {
    console.log(err);
})
