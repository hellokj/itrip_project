const config = require('../config');
const jwt = require('jsonwebtoken');
const Itinerary = require('../models/itinerary');
const HashMap = require('./hashmap');

class SocketHandler {
  constructor() {
    this.membersTable = new HashMap(); // { 'memberId' : [socketIds]}
    this.lockedItineraries = new HashMap(); // 存放 被鎖定的行程們與想要編輯的小夥伴們 { 'itineraryId' : [ socketIds ]  } Object
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
  }

  disconnect(socketId){
    for (var key in this.membersTable.obj){
      // console.log("???????????????", key);
      for(let j = 0; j < this.membersTable.obj[key].length; j++){
        if (socketId == this.membersTable.obj[key][j]){
          this.membersTable.obj[key].splice(j, 1);
          if (this.membersTable.obj[key].length == 0){
            this.membersTable.remove(key);
          }
          return;
        }
      }
    }
  }

  // 確認行程是否上鎖
  // 此次發來確認請求的人，表示想要加入此編輯行程佇列
  checkLockedItineraries(itineraryId, socketId){
    let isLocked = false; // 沒被lock
    let lockedKeySet = this.lockedItineraries.keySet(); // ItineraryId
    console.log("keySet", lockedKeySet);
    if (lockedKeySet.includes(String(itineraryId))){
      this.lockedItineraries.get(itineraryId).push(socketId); // waiting socketIds
      isLocked = true;
    }else {
      this.lockedItineraries.put(itineraryId, [socketId]);
    }
    return isLocked; // 0表示被lock住
  }

  async lockItinerary(itineraryId, socketId, token){
    let itinerary = await Itinerary.get(itineraryId); // 找出這個行程並lock
    this.lockedItineraries.put(itinerary._id, [socketId]);
    // console.log("我要鎖住", itineraryId);
    // let itinerary = await Itinerary.get(itineraryId); // 找出這個行程並lock
    // // console.log("itinerary", itinerary);
    // if (itinerary !== null && !this.lockedItineraries.includes(itinerary._id)){
    //   console.log("我鎖住了", itineraryId);
    //   this.lockedItineraries.push(itinerary._id);
    //   let editorId = this.verifyToken(token); // 編輯者id
    //   console.log("token editor id", editorId);
    //   return this.getNotifiedMembers(itinerary, editorId);
    // }else {
    //   // 沒找到 抱錯
    //   return null;
    // }
  }

  getNotifiedMembers(itinerary, editorId){
    console.log("editor id", editorId);
    let editor = itinerary.memberIds.filter(function(value, index, arr){
      return value == editorId;
    })
    let othersId = itinerary.memberIds.filter(function(value, index, arr){
      return value !== editorId;
    });
    // 再由此ids去找到各自對應的socketIds
    let membersSocketIds = []; // 裡面是 { socketId: xxx, memberId: xxx} Object
    console.log("editor handler", editor);
    console.log("members", this.membersTable);
    for (let i = 0; i < othersId.length; i++){
      let socketIds = [];
      if (this.membersTable.containsKey(othersId[i])){
        socketIds = this.membersTable.get(othersId[i]);
        for (let j = 0; j < socketIds.length; j++){
          membersSocketIds.push(socketIds[j]);
        }
      }
    }
    console.log("handler membersSocketIds", membersSocketIds);
    return membersSocketIds;
  }

  releaseItinerary(itineraryId, isLocked, socketId){
    if (isLocked){
      let socketIds = this.lockedItineraries.get(itineraryId);
      for (let i = 0; i < socketIds.length; i++){
        if (socketIds[i] == socketId){
          this.lockedItineraries.get(itineraryId).splice(i, 1);
          break;
        }
      }
      return null;
    }else {
      if (this.lockedItineraries.get(itineraryId) !== null){
        if (this.lockedItineraries.get(itineraryId).length !== 0){
          this.lockedItineraries.get(itineraryId).shift();
        }
        // shift完判斷
        let socketIds = this.lockedItineraries.get(itineraryId);
        if (socketIds.length == 0){
          this.lockedItineraries.remove(itineraryId);
          return null;
        }else {
          return socketIds[0]; // 下一個人
        }
      }else {
        return null;
      }
    }
  }

  // 改成membersTable 

  async updateItinerary(itinerary, editorId){
    console.log("update itinerary", itinerary);
    console.log("update editor", editorId);
    let _id = itinerary._id;
    let onlineMembers = [];
    let self = this;
    // console.log("self", self);
    await Itinerary.updateItinerary(_id, itinerary).then(function(res){
      let itineraryMembers = itinerary.memberIds;
      // 其他人
      console.log("itineraryMembers", itineraryMembers);
      if (itineraryMembers !== undefined){
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