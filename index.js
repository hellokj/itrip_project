const express = require('express');
const app = express();

// CORS: 前後端整合時需要: https://developer.mozilla.org/zh-TW/docs/Web/HTTP/CORS
// 在需要請求不同網域資源時要使用，express預設是禁止非同源的請求
const cors = require('cors');

const config = require('./config');
const router = require('./routes');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

app.use(function(req, res, next) {
    //replace localhost:8080 to the ip address:port of your server
    res.header("Access-Control-Allow-Origin", "https://www.itrip.ga");
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, x-access-token, Content-Type, Accept');
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header('Access-Control-Allow-Credentials', true);
    next(); 
});

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json({limit: '10mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}))

//enable pre-flight
// app.options('*', cors());

app.use('/api', router);

const SocketHandler = require('./utils/socketHandler');
var fs = require('fs');

// socket.io
const server = require('https').createServer({
    key: fs.readFileSync('/etc/letsencrypt/live/www.itrip.ga/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/www.itrip.ga/cert.pem')
}, app);

const io = require('socket.io')(server, { handlePreflightRequest: (req, res) => {
    const headers = {
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Origin": req.headers.origin, //or the specific origin you want to give access to,
        "Access-Control-Allow-Credentials": true
    };
    res.writeHead(200, headers);
    res.end();
}});
//const port = process.env.PORT||8000;
//io.origins('*:*');
// 網站監聽4000的socket server
server.listen(4000, function(){
    console.log('Server listening at port %d', 4000);
});

mongoose.connect(config.mongodb,{
    useNewUrlParser: true }).then(() => {
    // app.listen(config.port, ()=> {
    //     console.log('listening on ' + config.port);
    // });
}).catch((err) => {
    console.log(err);
})

// app.get('/', function(req, res){
//     res.json({id: 8888});
// });

socketHandler = new SocketHandler();
io.on('connection', (socket) => {
    // console.log(socket.id + ' has connected.');
    // console.log("on locked itineraries", socketHandler.lockedItineraries);
    // console.log("connected members", socketHandler.connectedMembers);
    // console.log("membersTable", socketHandler.membersTable);

    // 刪除垃圾行程表
    // socketHandler.getAllItinerary().exec((err, res) => {
    //     res.forEach((element) => {
    //         if(element.name.includes('我的旅行')) {
    //             //console.log(element.name)
    //             socketHandler.deleteItinerary(element._id);
    //         }
    //     })
    // })
    socket.on('QQ', (data) => {
        let token = data.token;
        // console.log("偷啃", token);
        if (token){
            socketHandler.connect(socket.id, token);
        }
    })
    // when member login
    socket.on('logIn', (data) => {
        let token = data.token;
        socketHandler.connect(socket.id, token);
        // console.log("socket id", socket.id);
        // console.log("membersTable", socketHandler.membersTable);
    });
    // when member logout
    socket.on('logOut', (data) => {
        socketHandler.disconnect(socket.id);
        // console.log("membersTable", socketHandler.membersTable);
    })

    socket.on("disconnect", () => {
        console.log("a user go out");
        socketHandler.disconnect(socket.id);
        console.log("membersTable", socketHandler.membersTable);
    });

    socket.on("checkItinerary", (data) => {
        let itineraryId = data.itineraryId;
        let token = data.token; // 此次發來的memberId
        let socketId = socket.id; // 此次發來的socketId
        // console.log("......", socketHandler.checkLockedItineraries(itineraryId, token));
        let isLocked = socketHandler.checkLockedItineraries(itineraryId, socketId);
        if (isLocked){
            io.emit('checkedReply', true);
        }else {
            io.emit('checkedReply', false); // locked
        }
        console.log("locked", socketHandler.lockedItineraries);
    });

    // socket.on("editRequest", async function(data){
    //     // console.log("data", data);
    //     let itineraryId = data.itineraryId;
    //     let token = data.token;
    //     let members = await socketHandler.lockItinerary(itineraryId, token);
    //     // console.log("members", members);
    //     io.to(members[0].socketId).emit('canEdit', "granted"); // 沒鎖 // editor
    //     // console.log("editor socket id", members[0].socketId);
    //     for (let i = 1; i < members.length; i++){
    //         io.to(members[i].socketId).emit('notifyLocked'); // 上鎖
    //     }
    // });

    socket.on("releaseEditMode", function(data){
        console.log("有人離開了");
        let itineraryId = data.itineraryId;
        let isLocked = data.isLocked;
        let socketId = socket.id;
        let nextEditor = socketHandler.releaseItinerary(itineraryId, isLocked, socketId);
        if (nextEditor !== null){
            io.to(nextEditor).emit("unlockNotification");
        }
        console.log("lockedItineraries", socketHandler.lockedItineraries);
        // let token = data.token;
        // let otherMembersSocketIds = await socketHandler.releaseItinerary(itineraryId, token);
        // console.log("通知這些人", otherMembersSocketIds);
        // console.log("release edit 剩下的鎖住行程", socketHandler.lockedItineraryIds);
        // if (otherMembersSocketIds.length > 0){ // 有人才通知第一個
        //     io.to(otherMembersSocketIds[0]).emit('unlockNotification');
        // }
        // for (let i = 0; i < otherMembersSocketIds.length; i++){
        //     console.log("人", otherMembersSocketIds[i]);
        //     io.to(otherMembersSocketIds[i]).emit('unlockNotification'); // 通知解鎖
        // }
    })

    socket.on("updateItinerary", async function(data){
        // console.log("updateItinerary", data);
        let itinerary = data.itinerary;
        let editorId = data.memberId;
        let onlineMembers = await socketHandler.updateItinerary(itinerary, editorId);
        // console.log("i'm here.");
        for (let i = 0; i < onlineMembers.length; i++){
            io.to(onlineMembers[i]).emit('updateNotification', itinerary); // 上鎖
        }
    });

    socket.on('SEND_MESSAGE', function(data) {
        console.log(data);
        io.emit('message', 'data');
    });
});

