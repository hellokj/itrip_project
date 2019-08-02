<template>
  <div class="MyTrip">
    <div style="position: absolute; width: 150px; height: 40px; background-color: tomato; border:none; right: 0px; top: 0px;"></div>
    <div class="py-2 m-0 info-container">
      <div class="tripName">
        <div style="width:100%;">
          名稱
          <el-input class="iTripName" placeholder="我的旅行" v-model="tripName" @change="$emit('changeName', tripName)"></el-input>
        </div>
      </div>
      <div class="tripDate" style="display:flex;justify-content:space-between;">
        <div class="ml-0 row">
          <p class="px-0 mx-0 mb-0 mr-1 pTripDate" style="line-height:35px;">日期</p>
          <el-date-picker
          class="ml-0 iDatePicker"
          v-model="tripDate"
          @change="$emit('changeDate', tripDate)"
          type="date"
          placeholder="選擇日期"
          style="width:150px;"/>  
        </div>
        <div class="mt-2 mr-1 save-trip">
          <i title="編輯行程" id="edit" class="fas fa-edit" 
           @click="requestEdit"
           :style="[isLocked ? { cursor: 'not-allowed' }:{ cursor: 'pointer' }]"
           style="color:#8a8d91;font-size:25px;cursor: pointer;"></i>
          <!-- <i title="儲存行程" id="save" class="fas fa-save" @click="saveTrip" style="color:#8a8d91;font-size:25px;"></i> -->
          <i title="匯出成PDF" id="pdf" class="fas fa-file-pdf" @click="saveTripAsPdf" style="color:#8a8d91;font-size:25px;cursor: pointer;"></i>
          <AddMemberPopover id="pc-addMember-popover" v-model="memberEmail" :memberEmails="memberEmails"
          @getCurrentMembers="getCurrentMembers" @addMember="addMember" @removeMember="removeMember"/>
          <SharingLink id="pc-sharingLink" :shareUrl="shareUrl" :shareId="shareIdProp" @shareTrip="shareTrip"/>
        </div>
        <el-dropdown ref="dropdown" placement="bottom-start" trigger="click">
          <span>
            <i title="功能列" class="pr-2 fas fa-ellipsis-h" style="font-size:25px;color:#8a8d91;cursor: pointer;"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item >
              
              <i title="儲存行程" class="fas fa-save" @click="saveTrip" style="color:#8a8d91;font-size:15px;cursor:pointer;"> 儲存行程</i>
            </el-dropdown-item>
            <el-dropdown-item >
              <i title="匯出成PDF" class="fas fa-file-pdf" @click="saveTripAsPdf" style="color:#8a8d91;font-size:15px;cursor:pointer;"> 匯出成PDF</i>
            </el-dropdown-item>
            <el-dropdown-item >
              <div class="pl-3 row">
                <AddMemberPopover id="mobile-addMember-popover" v-model="memberEmail" :memberEmails="memberEmails"
                @getCurrentMembers="getCurrentMembers" @addMember="addMember" @removeMember="removeMember"/>加入旅伴 
              </div>
            </el-dropdown-item>
            <el-dropdown-item>
              <div class="pl-3 row">
                <SharingLink id="mobile-sharingLink" :shareUrl="shareUrl" :shareId="shareId" @shareTrip="shareTrip"/>分享行程
              </div>
            </el-dropdown-item>
          </el-dropdown-menu>         
        </el-dropdown>
      </div>
    </div>
    <div class="tab-container" style="height: 75vh;">
      <b-tabs content-class="mt-3" @input="changePage()" v-model="currentPage" style="width: 100%;" :key="update + 'o'">
          <template slot="tabs">
              <b-nav-item @click.prevent="newTab" href="#"><i class="fas fa-plus"></i></b-nav-item>
          </template>
          <div class="trip-time">
            <p class="mb-0 pt-1">出發時間:</p>
            <el-time-select
            class="ml-3 mr-4"
            v-model="startTime"
            :picker-options="{
              start: '00:00',
              step: '00:15',
              end: '23:45'
            }"
            :align="'center'"
            :size="'small'"
            placeholder="請輸入時間"
            style="width: 140px;"/>
          </div>
          <b-tab v-for="i in tabs" :key="'tab' + i" style="heigh: 55vh; overflow-Y: scroll;">
            <template slot="title">
                {{ 'Day ' + (i+1) }}<i v-if="i != 0" class="fas fa-times" @click="closeTab(i)"></i>
            </template>
            <div style="height: 65vh;">
            <draggable v-model="togos_prop" ghost-class="ghost" @end="onEnd">
                <transition-group type="transition" name="flip-list" :key="update">
                  <div class="togoContainer sortable" :key="index" v-for="(togo,index) in togos_prop"  overflow:auto>
                    <div class="pl-3 big-container">
                      <div class="trip-time-container">
                        <p class="my-0 startTime">{{getStartTime(index)}}</p>
                        <div class="circleNum"><b>{{index + 1}}</b></div>
                        <p class="my-0 endTime">{{getEndTime(index)}}</p>
                      </div>
                      <TogoItem :togo="togo"
                      @updateStopTime="updateStopTime"
                      @deleteTogo="$emit('deleteTogo', index)"
                      @getNearby="getNearby"/>
                    </div>
                    <TravelTimeItem v-if="isTravelTimeShown(index)" v-bind="$attrs" v-on="$listeners" :index="index" :travelTime="travelInfos[index].duration"/>
                  </div>
                </transition-group>
            </draggable> 
          </div>
        </b-tab>    
      </b-tabs>
    </div>
  </div>
</template>

<script>
import TogoItem from './TogoItem'
import TravelTimeItem from './TravelTimeItem'
import virtualList from 'vue-virtual-scroll-list'
import draggable from 'vuedraggable'
import { async, resolve } from 'q'
import { Message } from 'element-ui'
import { apiFindMemberByMail, apiRemoveMember, apiSaveTrip } from '../../utils/api.js'
import AddMemberPopover from './AddMemberPopover'
import SharingLink from './SharingLink'

export default {
    name: "Togos",
    data() {
      return {
        tabtitle: '',
        oldIndex: '',
        newIndex: '',
        travelInfos: Array,
        tabCounter: 0,
        tabs: [0],
        currentPage: 0,
        tripName: '我的旅行',
        tripDate: new Date(),
        togos_prop: this.togos,
        startTime: '08:00',
        editMode: true,
        startTimeOb: {
          hr: 8,
          min: 0
        },
        isScrollbarShown: false,
        update: 0,
        viewMapString: '檢視地圖',
        itineraryLoaded: false,
        shareUrl: 'http://localhost:8080/#/trip?viewId=',
        memberEmail: '',
        memberEmails: [],
        newMemberId: '',
        shareIdProp: undefined,
        editMode: false,
      }
    },
    components: {
        TogoItem,
        TravelTimeItem,
        draggable,
        'virtual-list': virtualList,
        AddMemberPopover,
        SharingLink,
    },
    props: {
      togos: Array,
      travelInfo: Array,
      page: Number,
      dayNum: Number,
      shareId: Number,
      currentAccessId: String,
      isLocked: Boolean,
      itinerary: Object
    },
    methods: {
      saveTrip() {
        if (this.$store.state.isAuthorized == false){
           Message({
            type: 'warning',
            message: '請先登入!'
          });
          this.$store.dispatch("updateFormState", {
            isLogIn: true,
            isSignUp: false,
            isFbSignUp: false
          });
        }else{
          this.getDate();
          let token = this.$store.state.userToken;
          let _id = "";
          if (this.itinerary._id != undefined && typeof(this.itinerary._id) !== Object){
            _id = this.itinerary._id;
          }
          // console.log("itinerary", this.itinerary);
          // console.log("_id", _id);
          this.$emit('saveTrip', this.tripName, this.tripDate, this.memberEmail);
          this.memberEmail = '';
        }
      },
      shareTrip: function() {
        if(this.shareId === undefined && this.shareIdProp === undefined) {
          //console.log(this.shareIdProp)
          let self = this;
          this.getDate();
          this.$emit('share', this.tripName, this.tripDate);  
        }
        else {
          this.$emit('updateShare', this.shareIdProp, this.tripName, this.tripDate);
        }
      },
      changePage(){
        this.$emit('change-page', this.currentPage);
        this.$emit('resetRoutes');
      },
      isTravelTimeShown(index) {
        if(this.travelInfos == undefined || this.travelInfos.length == 0 || index >= this.travelInfos.length) {
          return false;
        }
        if(index < (this.togos.length-1) && this.travelInfos[index] != undefined) {
          return true;
        }
        return false;
      },
      onEnd: function(evt) {
        this.oldIndex = evt.oldIndex;
        this.newIndex = evt.newIndex;
        this.$emit('togos-changeOrder', this.togos_prop, this.oldIndex, this.newIndex);
      },
      newTab: function() {
        this.tabs.push(this.tabCounter++);
        this.$emit('add-new-day');
      },
      addMember: function() {
        if (this.$store.state.isAuthorized == false){
           Message({
            type: 'warning',
            message: '請先登入!'
          });
          this.$store.dispatch("updateFormState", {
            isLogIn: true,
            isSignUp: false,
            isFbSignUp: false
          });
          return;
        }
        if(!this.memberEmails.includes(this.memberEmail)) {
          this.memberEmails.push(this.memberEmail);
          // this.saveTrip();
          this.$emit('addMember', this.memberEmail);
          this.memberEmail = '';
          
        }
        else {
          this.$message.warning('該旅伴已在列表中!')
        }
        
      },
      removeMember: async function(index) {
        let token = this.$store.state.userToken;
        let mailToRemove = this.memberEmails[index];
        //this.memberEmails.splice(index, 1);
        await apiRemoveMember(this.itinerary.id, mailToRemove, token)
        .then((function (res) {
          console.log(res);
        }))
        .catch(function (error) {
          console.log(error);
        });

      },
      getStartTime: function(index) {
        // if(index == 0) {
        //   return this.startTime;
        // }
        let hr = this.startTimeOb.hr;
        let min = this.startTimeOb.min;

        for(let i=0;i<index;i++) {
          if(this.travelInfos[i] === undefined) continue;
          min += this.togos[i].stopTime.mins;
          if(i <= index - 1) {
            min += Math.floor(this.travelInfos[i].duration / 60);
          }
          if(min >= 60) {
            hr += Math.floor(min / 60);
            min %= 60;
          }
          hr += this.togos[i].stopTime.hrs;
        }
        if(hr >= 24) {
          this.togos.pop();
          this.travelInfos.pop();
          this.$message.error('時間超出本日範圍!');
          throw 'DAY LIMIT EXCEEDED';
        }
        if(this.togos[index].startTime === undefined) {
          this.togos[index].startTime = {};
        }
        this.togos[index].startTime.hr = hr;
        this.togos[index].startTime.min = min;
        return hr.toString().padStart(2, '0') + ':' + min.toString().padStart(2, 0)
      },
      getEndTime: function(index) {
        let tmp = this.getStartTime(index).split(':');
        let hr = parseInt(tmp[0]);
        let min = parseInt(tmp[1]);
        min += this.togos[index].stopTime.mins;
        if(min >= 60) {
            hr += Math.floor(min / 60);
            min %= 60;
        }
        if(hr + this.togos[index].stopTime.hrs >= 24) {
          this.togos[index].stopTime.hrs = 1
          this.updateStopTime();
          this.$message.error('時間超出本日範圍!');
          throw 'DAY LIMIT EXCEEDED';
        }
        hr += this.togos[index].stopTime.hrs;
        if(this.togos[index].endTime === undefined) {
          this.togos[index].endTime = {};
        }
        this.togos[index].endTime.hr = hr;
        this.togos[index].endTime.min = min;
        
        return hr.toString().padStart(2, '0') + ':' + min.toString().padStart(2, 0);
      },
      closeTab: function(x) {
        for (let i = 0; i < this.tabs.length; i++) {
          if (x > 0 && this.tabs[i] === x) {
            this.tabs.splice(i, 1)
            this.tabCounter--;
          }
        }
        for(let i=1;i<this.tabCounter;i++) {
          if(this.tabs[i] != i) {
            this.tabs[i] = i;
          }
        }
        this.$emit('remove-day', x)
      },
      getNearby: function(togo, page) {
        this.$emit('getNearby', togo, null);
      },
      updateStopTime: function() {
        this.update++;
      },
      saveTripAsPdf: function() {
        this.$bus.$emit('download', {tripName: this.tripName, tripDate: this.tripDate});
      },
      clickViewMap() {
        this.$emit('click-view-map');
        if(this.viewMapString === '關閉地圖') this.viewMapString = '檢視地圖';
        else {
          this.viewMapString = '關閉地圖';
        }
      },
      updatePage: function(){
        this.update++;
      },
      updateTabs: function(){
        let self = this;
        if (self.itinerary != undefined){ 
          if (self.itinerary.togos != undefined){
            for (let i = 0; i < self.itinerary.togos.length - 1; i++){
              self.tabs.push(this.tabCounter++);
            };
            self.tripName = self.itinerary.name;
            self.tripDate = new Date(self.itinerary.startDate.year, self.itinerary.startDate.month - 1, self.itinerary.startDate.day);
          }
        }
      },
      getCurrentMembers: function() {
        //console.log(this.itinerary);
        let self = this;
        this.memberEmails = []
         console.log(this.itinerary)
        //console.log(this.currentAccessId)
        let memberIds = this.itinerary.memberIds;
       
        //console.log(this.itinerary)
        memberIds.forEach((element) => {
          if(element !== self.$route.query.currentAccessId) {
            self.memberEmails.push(element)
          }
        });
      },
      requestEdit: async function() {
        if(!this.isLocked) {
          let self = this;
          this.$socket.emit('editRequest', {itineraryId: this.itinerary._id, memberId: this.currentAccessId, token: this.$store.state.userToken});
          await this.$socket.on('canEdit', (res) => {
            if(res === 'granted') {
              self.editMode = true;
              Message({
                showClose: true,
                duration: 0,
                type: 'success',
                message: '開始編輯'
              })
            }
            else {
              self.editMode = false;
            }
          })
        }
      },
      getDate() {
        if (this.tripDate.date == ""){
          // 預設今天日期
          let date = new Date();
          let year = date.getFullYear();
          let month = date.getMonth() + 1;
          let day = date.getDate();
          this.tripDate = year + "-" + month + "-" + day;
        }else {
          let date = new Date(Date.parse(this.tripDate));
          let year = date.getFullYear();
          let month = date.getMonth() + 1;
          let day = date.getDate();
          this.tripDate = year + "-" + month + "-" + day;
        }
      },
      stringifyStartDate(ob) {
        return ob.year + '-' + ob.month + '-' + ob.day;
      }
    },
    watch: {
      travelInfo: {
        handler: function() {
          this.travelInfos = this.travelInfo;
        },
        immediate: true,
      },
      itinerary: {
        handler: function() {
          if(!this.itineraryLoaded) {
            this.updateTabs();
            this.itineraryLoaded = true;
          }
          // get name and date from itinerary
          this.tripName = this.itinerary.name;
          this.tripDate = this.stringifyStartDate(this.itinerary.startDate);
          // console.log(this.itinerary)
        },
        deep: true
      },
      page: function(){
        this.currentPage = this.page;
      },
      togos: function() {
        this.togos_prop = this.togos;
      },
      startTime: function() {
        let tmp = this.startTime.split(':');
        this.startTimeOb.hr = parseInt(tmp[0]);
        this.startTimeOb.min = parseInt(tmp[1]);
      },
      shareId: function(newVal, oldVal) {
        if(oldVal == undefined) {
          this.shareUrl += newVal;
          this.shareIdProp = newVal;
        }
      },
      isLocked: function(newVal, oldVal) {
        if(newVal) {
          Message({
            duration: 0,
            showClose: true,
            message: '此行程正在編輯中...，請稍後',
            type: 'warning'
          });
        }
        else {
          Message({
            duration: 0,
            showClose: true,
            message: '行程可編輯!',
            type: 'success'
          });
        }
      },
    },
    created() {
      let self = this;
      //console.log("itinerary", this.itinerary);
      // 註冊監聽事件
      // get name and date from itinerary
      
    },
    beforeMount() {
      for(let i = 1; i < this.dayNum; i++) {
        this.tabs.push(i);
      }
      this.currentPage = this.page;
      this.tabCounter = this.dayNum;
    },
    mounted() {
      let self = this;
      if(this.isLocked) {
        Message({
          showClose: true,
          duration: 0,
          message: '此行程正在編輯中...，請稍後!',
          type: 'warning'
        });
      }
      // listen to locked notification
      this.$socket.on('notifyLocked', () => {
        self.isLocked = true;
      });
    }
}
</script>

<style lang="scss" scoped>
  .MyTrip {
    position: relative;
    display: flex;
    flex-direction: column; 
    border: 4px solid tomato;
    background: rgb(250,250,250);
    color:black;
    height:90vh;
    width: 100%;
    // border-left: 2px solid rgb(230, 230, 230);
    // border-width: 3px;
    // border-style: solid;
    // border-image: linear-gradient( to bottom, rgb(255, 255, 255), rgb(206, 206, 206), rgb(222, 222, 222), rgb(235, 235, 235)) 1 100%;
    // border-right: none;
  }
  .MyTrip .sortable-drag {
    opacity: 0;
  }
  .save-trip {
    width: 50%;
    display: flex;
    justify-content: space-around;
  }
  .info-container {
    height: 15vh;
    border-bottom: 3px solid rgb(243, 243, 243);
    z-index: 3;
    border-top: 3px solid transparent;
  }
  .sortable {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .el-card {
    width: 100%;
  }
  .tripName {
    margin-right: 11px;
    margin-left: 11px;
    margin-top: 4px;
    display: flex;
    flex-direction: row;
    font-size: 16px;
    justify-content: space-between;
  }
  .tripDate {
    margin-left: 11px;
    margin-top: 4px;
    display: flex;
    flex-direction: row;
    font-size: 16px;
    justify-content: flex-start;
  }
  .iTripName {
    width:150px;
    text-align: center;
  }
  .trip-time-container {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    margin-left: 8px;
  }
  .trip-time {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }
  .big-container {
    display: flex;
    flex-direction: row;
    align-self: center;
    width: auto;
  }
  .fa-times {
    padding-left: 20px;
    color: #DCDCDC;
  }
  .fa-times:hover { 
    color:#696969;
  }
  .circleNum {
    border-radius: 50%;
    width: 30px;
    height: 30px;
    padding: 1px;
    background: #fff;
    border: 2px solid #666;
    color: #666;
    text-align: center;
  }
  .ghost {
    border-left: 6px solid rgb(0, 183, 255);
    box-shadow: 10px 10px 5px -1px rgba(0,0,0,0.14);
    opacity: .7;

    &::before {
      content: " ";
      position: absolute;
      width: 20px;
      height: 20px;
      margin-left: -50px;
      // background-image: url('../assets/drag.svg')
    }
  }
  .startTime {
    font-size: 12px;
  }
  .endTime {
    font-size: 12px;
  }
  b-tabs {
    color: #f2f2f2;
    font-size: 20px;
    border: none;
    background: #333555;
  }
  .fa-save {
    cursor: pointer;
  }
  .flip-list-move {
    transition: transform 0.5s;
  }
  .big-container {
    display: flex;
    flex-direction: row;
  }
  .view-map {
    height: 40px;
    align-self: center;
    margin-right: 10px;
  }
  .fa-map-marked-alt {
    font-size: 20px;
    cursor: pointer;
  }
  .tab-container{
    height: 500px;
  }
  .fa-ellipsis-h {
    display: none;
  }
  #mobile-addMember-popover {
    display: none;
  }
  #mobile-sharingLink {
    display: none;
  }
  .togoContainer {
    display: flex;
    flex-wrap: nowrap;
    justify-content:flex-start;
    align-items: center;
    margin: 0px;
  }

  @media only screen and (max-width: 768px) {
    .MyTrip {
      width: 100%;
    }
  }
 @media only screen and (max-width: 1200px) {
    #save {
      display: none;
    } 
    #pdf {
      display: none;
    }
    #mobile-sharingLink {
    display: block;
  }
    #mobile-addMember-popover {
      display: block;
    }
    #pc-addMember-popover {
      display: none;
    }
    #pc-sharingLink {
      display: none;
    }
    .fa-ellipsis-h {
      display: block
    }
    .save-trip {
      width: 10%;
    }

  }
</style>