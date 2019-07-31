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



// socket.io
const server = require('http').createServer(app);
const io = require('socket.io')(server);
//const port = process.env.PORT||8000;

// 開啟server監聽


mongoose.connect(config.mongodb,{
    useNewUrlParser: true }).then(() => {
    // app.listen(config.port, ()=> {
    //     console.log('listening on ' + config.port);
    // });
    server.listen(config.port, function(){
        console.log('Server listening at port %d', config.port);
    });
}).catch((err) => {
    console.log(err);
})

// app.get('/', function(req, res){
//     res.json({id: 8888});
// });

io.on('connection', (socket) => {
    console.log(socket.id + ' has connected.')
    socket.on('SEND_MESSAGE', function(data) {
        console.log(data);
        io.emit('message', 'data');
    });

    socket.on("disconnect", () => {
      console.log("a user go out");
    });
  
});
