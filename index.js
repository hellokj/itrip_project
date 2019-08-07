const express = require('express');
const app = express();

// CORS: 前後端整合時需要: https://developer.mozilla.org/zh-TW/docs/Web/HTTP/CORS
// 在需要請求不同網域資源時要使用，express預設是禁止非同源的請求
const cors = require('cors');

const config = require('./config');
const router = require('./routes');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

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
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!以下的CODE 打包的時候要記得貼回去!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
io.on('connection', (socket) => {
    console.log(socket.id + ' has connected.');
    console.log("on locked itineraries", socketHandler.lockedItineraries);
    // console.log("connected members", socketHandler.connectedMembers);
    console.log("membersTable", socketHandler.membersTable);
    // 刪除垃圾行程表
    // socketHandler.getAllItinerary().exec((err, res) => {
    //     res.forEach((element) => {
    //         if(!element.memberIds.includes('example@mail.com')) {
    //             console.log(element.name)
    //             //socketHandler.deleteItinerary(element._id);
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

    socket.on("notifyMessage", async function(data){
        let message = data.memberName[0] + '*'.repeat(data.memberName.length - 1) + '在' + data.sec + '前創建了' + data.name + '行程' + '在' + data.date.substring(0, 10) + '出發'
        let membersToNotify = socketHandler.notifyAll(data.memberId);
        membersToNotify.forEach(element => {
            io.to(element).emit("notifyCreateTripMessage", {message: message});
        });
    });

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

