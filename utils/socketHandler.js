const config = require('../config');
const jwt = require('jsonwebtoken');
const Itinerary = require('../models/itinerary');
const HashMap = require('./hashmap');

class SocketHandler {
  constructor() {
    this.membersTable = new HashMap();
    // this.connectedMembers = []; // 存放 { socketId: xxx, memberId: xxx} Object
    this.lockedItineraryIds = []; // 存放 被鎖定的行程id們
  }

  verifyToken(token){
    let memberId;
    jwt.verify(token, config.jwtSalt, (err, decoded) => {
      if(err){
        console.log("error", err);
        return -1;
      }
      else {
        memberId = decoded.memberId;
        console.log("success", memberId);
      }
    });
    return memberId;
  }

  connect(socketId, token){
    let memberId;
    if(token) {
      memberId = this.verifyToken(token);
      if (memberId == -1){
        console.log("error");
        return;
      }
      console.log("memberId", memberId);
    }
    else {
      console.log("error");
      return;
    }
    let socketIds;
    if (this.membersTable.containsKey(memberId)){
      socketIds = this.membersTable.get(memberId);
      socketIds.push(socketId);
    }else {
      if (memberId !== undefined){
        this.membersTable.put(memberId, [socketId]);
      }
    }
    console.log("memberTable", this.membersTable);
    // let connectedMember = { socketId : socketId, memberId: memberId };
    // console.log("connected member", connectedMember);
    // this.connectedMembers.push(connectedMember);
    // console.log("connected members", this.connectedMembers);
  }

  disconnect(socketId){
    for (var key in this.membersTable.obj){
      // console.log("???????????????", key);
      for(let j = 0; j < this.membersTable.obj[key].length; j++){
        if (socketId == this.membersTable.obj[key][j]){
          this.membersTable.obj[key].splice(j, 1);
          if (this.membersTable.obj[key].length == 0){
            this.membersTable.remove(this.membersTable.obj[key]);
          }
          return;
        }
      }
    }
  }  

    // let target = -1;
    // for (let i = 0; i < this.connectedMembers.length; i++){
    //   if (socketId == this.connectedMembers[i].socketId){
    //     target = i;
    //   }
    // }
    // if (target !== -1){
    //   this.connectedMembers.splice(target, 1);
    // }
  

  // 確認行程是否上鎖
  checkLockedItineraries(itineraryId){
    let target = -1; // 沒被lock
    console.log("全部的鎖住", this.lockedItineraryIds);
    for (let i = 0; i < this.lockedItineraryIds.length; i++){
      if (itineraryId == this.lockedItineraryIds[i]){
        target = i;
      }
    }
    return target; // 在第幾個行程
  }

  async lockItinerary(itineraryId, token){
    console.log("我要鎖住", itineraryId);
    let itinerary = await Itinerary.get(itineraryId); // 找出這個行程並lock
    // console.log("itinerary", itinerary);
    if (itinerary !== null && !this.lockedItineraryIds.includes(itinerary._id)){
      console.log("我鎖住了", itineraryId);
      this.lockedItineraryIds.push(itinerary._id);
      let editorId = this.verifyToken(token); // 編輯者id
      console.log("token editor id", editorId);
      return this.notify(itinerary, editorId);
    }else {
      // 沒找到 抱錯
      return null;
    }
  }

  notify(itinerary, editorId){
    console.log("editor id", editorId);
    let editor = itinerary.memberIds.filter(function(value, index, arr){
      return value == editorId;
    })
    let othersId = itinerary.memberIds.filter(function(value, index, arr){
      return value !== editorId;
    });
    // 再由此ids去找到各自對應的socketIds
    let members = []; // 裡面是 connectedMember { socketId: xxx, memberId: xxx} Object
    console.log("editor handler", editor);
    console.log("connected members handler", this.membersTable);
    for (let i = 0; i < othersId.length; i++){
      if (this.membersTable.containsKey(othersId[i])){
        members.push(othersId[i]);
      }
    }
    console.log("handler members", members);
    return members;
  }

  async releaseItinerary(itineraryId, token){
    let editorId = this.verifyToken(token); // 編輯者id
    let itinerary = await Itinerary.get(itineraryId); // 找出這個行程
    // 去除掉本次要解鎖的行程
    this.lockedItineraryIds = this.lockedItineraryIds.filter(function(value, index, arr){
      return value !== itineraryId;
    });
    // 要通知剩餘其他人解鎖
    let othersId = itinerary.memberIds.filter(function(value, index, arr){
      return value !== editorId;
    });
    let members = []; // 裡面是 members { socketId: xxx, memberId: xxx} Object
    for (let i = 0; i < othersId.length; i++){
      if (this.membersTable.containsKey(othersId[i])){
        members.push(othersId[i]);
      }
    }
    console.log("我要通知這些人", members);
    return members;
  }

  // 改成membersTable 

  async updateItinerary(itinerary, editorId){
    // console.log("update itinerary", itinerary);
    // console.log("update editor", editorId);
    let _id = itinerary._id;
    let onlineMembers = [];
    let self = this;
    // console.log("self", self);
    await Itinerary.updateItinerary(_id, itinerary).then(function(res){
      let itineraryMembers = itinerary.memberIds;
      // 其他人
      itineraryMembers = itineraryMembers.filter(function(value, index, arr){
        return value !== editorId;
      });
      for (let i = 0; i < itineraryMembers.length; i++){
        if (self.membersTable.containsKey(itineraryMembers[i])){
          for (let j = 0; j < self.membersTable.get(itineraryMembers[i]).length; j++){
            onlineMembers.push(self.membersTable.get(itineraryMembers[i])[j]);
          }
        }
      }
    });
    console.log("online members", onlineMembers);
    return onlineMembers;
  }

  getAllItinerary() {
    return Itinerary.find({});
  }
  deleteItinerary(id) {
    Itinerary.deleteOne({ _id: id}, function (err) {});
  }
}

module.exports = SocketHandler;