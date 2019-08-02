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

const SocketHandler = require('./utils/socketHandler');

// socket.io
const server = require('http').createServer(app);
const io = require('socket.io')(server);
//const port = process.env.PORT||8000;

// 網站監聽4000的socket server
server.listen(4000, function(){
    console.log('Server listening at port %d', 4000);
});

mongoose.connect(config.mongodb,{
    useNewUrlParser: true }).then(() => {
    app.listen(config.port, ()=> {
        console.log('listening on ' + config.port);
    });
}).catch((err) => {
    console.log(err);
})

// app.get('/', function(req, res){
//     res.json({id: 8888});
// });

socketHandler = new SocketHandler();
io.on('connection', (socket) => {
    console.log(socket.id + ' has connected.');
    console.log("on locked itineraries", socketHandler.lockedItineraryIds);
    console.log("connected members", socketHandler.connectedMembers);
    socket.on('QQ', (data) => {
        let token = data.token;
        console.log("偷啃", token);
        if (token){
            socketHandler.connect(socket.id, token);
        }
    })

    // when member login
    socket.on('logIn', (data) => {
        let token = data.token;
        socketHandler.connect(socket.id, token);
        console.log("socket id", socket.id);
        // console.log("connected members", socketHandler.connectedMembers);
    });
    // when member logout
    socket.on('logOut', (data) => {
        socketHandler.disconnect(socket.id);
        // console.log('connected members', socketHandler.connectedMembers);
    })

    socket.on("disconnect", () => {
        console.log("a user go out");
        socketHandler.disconnect(socket.id);
        // console.log("connected members", socketHandler.connectedMembers);
    });

    socket.on("checkItinerary", (data) => {
        let itineraryId = data.itineraryId;
        if (socketHandler.checkLockedItineraries(itineraryId) == -1){
            io.emit('checkedReply', false); // locked
        }else {
            io.emit('checkedReply', true); // unlocked
        }
        console.log("locked", socketHandler.lockedItineraryIds);
    });

    socket.on("editRequest", async function(data){
        console.log("data", data);
        let itineraryId = data.itineraryId;
        let token = data.token;
        let members = await socketHandler.lockItinerary(itineraryId, token);
        console.log("members", members);
        io.to(members[0].socketId).emit('canEdit', "granted"); // 沒鎖 // editor
        console.log("editor socket id", members[0].socketId);
        for (let i = 1; i < members.length; i++){
            io.to(members[i].socketId).emit('notifyLocked'); // 上鎖
        }
    });

    socket.on("updateItinerary", function(data){
        console.log("updateItinerary", data);
        let itinerary = data.itinerary;
        let editorId = data.memberId;
        socketHandler.updateItinerary(itinerary, editorId);
    });

    socket.on('SEND_MESSAGE', function(data) {
        console.log(data);
        io.emit('message', 'data');
    });
});

