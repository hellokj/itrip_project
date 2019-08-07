<template>
  <el-main v-model="update">
    <el-container style="margin-bottom: 0px;">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首頁</el-breadcrumb-item>
        <el-breadcrumb-item :to="{}" @click.native="changeToCarousel">個人檔案</el-breadcrumb-item>
        <el-breadcrumb-item>我的行程</el-breadcrumb-item>
        <el-breadcrumb-item>{{ title }}</el-breadcrumb-item>
        <el-breadcrumb-item>{{ itinerary.name }}</el-breadcrumb-item>
      </el-breadcrumb>
    </el-container>
    <div style="height: 7vh; margin: 0px auto;">
      <el-popover
        placement="left-start"
        width="160"
        v-model="visible">
        <p>確定要刪除此行程？</p>
        <div style="text-align: right; margin: 0">
          <el-button type="text" size="mini" @click="confirmDeleteOrNot(true, itinerary)">確定</el-button>
          <el-button size="mini" type="primary" @click="confirmDeleteOrNot(false, itinerary)">取消</el-button>
        </div>
        <el-button slot="reference" icon='el-icon-delete' round style="height: min-content; float: right;">刪除行程</el-button>
      </el-popover>
    </div>
      <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane :label='dayFormat(index)' v-for="(day, index) in days" :key="index + 'QQ' ">
          <el-container style="display: flex">
            <el-container style="width: 70%">
              <el-divider 
                content-position="center">
                {{itinerary.name}} {{itinerary.startDate.year}}-{{itinerary.startDate.month}}-{{itinerary.startDate.day}}
              </el-divider>
            </el-container>
            <el-container style="width: 30%; ">
              <!-- <i class="el-icon-lock lock" style="float: right"></i> -->
              <el-link 
                v-model="itinerary.isPublic" 
                :icon="getLockIcon()" 
                @click="changeLockStatus" 
                style="padding: 5px; margin:0px auto;">
                {{ getLockStatus() ? "設為不公開" : "設為公開" }}
              </el-link>
              <el-link icon="el-icon-edit" style="padding: 5px; margin:0px auto;" @click="modifyItinerary(itinerary)">編輯行程</el-link>
              <!-- <el-link icon="el-icon-delete" style="padding: 5px; margin:0px auto;" @click="confirmDeleteOrNot(true, itinerary)">刪除行程</el-link> -->
            </el-container>
          </el-container>
          <el-table
            :data="day"
            height="385"
            border
            style="width: 100%">
            <el-table-column
              prop="index"
              label="No."
              width="50"
              align="center">
            </el-table-column>
            <el-table-column
              prop="stayTimeFormat"
              label="出發時間"
              width="80"
              align="center">
            </el-table-column>
            <el-table-column
              prop="name"
              label="景點"
              width="200"
              align="center">
            </el-table-column>
            <el-table-column
              prop="traffic"
              label="交通方式/時間"
              width="130"
              align="center">
            </el-table-column>
            <el-table-column
              prop="address"
              label="地址"
              align="center">
            </el-table-column>
            <el-table-column
              prop='stopTimeFormat'
              label="停留時間"
              width="100"
              align="center">
            </el-table-column>
            <el-table-column
              prop="memo"
              label="備忘錄"
              width="70"
              align="center">
              <template slot-scope="scope" class="memo_popover">
                <el-popover
                placement="top-end"
                width="200"
                trigger="click"
                :ref="`popover-${scope.$index}`">
                <div class="popover-title" v-html="getTitle(scope.row)"></div>
                <div class="popover-content" v-html="getContent(scope.row)"></div>
                <i class="far fa-comment-alt memo" 
                  v-if="!hasMemo(scope.row)" 
                  slot="reference" 
                  @click.native.prevent="scope._self.$refs[`popover-${scope.$index}`].doClose()">
                </i>
              </el-popover>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane name="myMap" label="查看地圖" v-model="itinerary.travelInfos[0]">
          <el-container style="display: flex">
            <el-container style="width: 70%">
              <el-divider 
                content-position="center">
                {{itinerary.name}} {{itinerary.startDate.year}}-{{itinerary.startDate.month}}-{{itinerary.startDate.day}}
              </el-divider>
            </el-container>
            <el-container style="width: 30%; ">
              <!-- <i class="el-icon-lock lock" style="float: right"></i> -->
              <el-link 
                v-model="itinerary.isPublic" 
                :icon="getLockIcon()" 
                @click="changeLockStatus" 
                style="padding: 5px; margin:0px auto;">
                {{ getLockStatus() ? "設為不公開" : "設為公開" }}
              </el-link>
              <el-link icon="el-icon-edit" style="padding: 5px; margin:0px auto;" @click="modifyItinerary(itinerary)">編輯行程</el-link>
            </el-container>
          </el-container>
          <el-container>
            <MemberMap v-if="activeName=='myMap'" :travelInfos="itinerary.travelInfos" :togos="itinerary.togos"></MemberMap>
          </el-container>
        </el-tab-pane>
      </el-tabs>
    </el-main>
</template>

<script>
import {getAddress} from "../../utils/checker"
import { apiDeleteItinerary } from '../../utils/api'
import MemberMap from '../components/MemberMap'
import { start } from 'repl';
import { setTimeout } from 'timers';
import { async } from 'q';
export default {
  components: {
    MemberMap,
    VueLoading: 'loading'
  },
  props: {
    itinerary: Object,
    title: String,
    currentAccessId: String,
  },
  data() {
    return {
      days: [], // 每天的行程 裡面存放 景點object
      index: 0,
      update: 0,
      visible: false,
      isConfirmed: false, // check wheather delete or not
      isLocked: false, // check if itinerary is locked by server
      activeName: '0',
    }
  },
  methods: {
    handleClick(tab, event) {
      if(tab.name=='myMap'){
        this.activeName = "myMap";
      }else {
        this.activeName = "1";
      }
    },
    confirmDeleteOrNot: function(state, itinerary){
      this.visible = false;
      this.isConfirmed = state;
      this.deleteItinerary(itinerary);
    },
    deleteItinerary: async function(itinerary){
      if (this.isConfirmed){
        await apiDeleteItinerary(itinerary._id, this.$store.state.userToken);
        this.$emit("reloadItineraries");
        this.$emit("changeToCarousel");
      }
    },
    changeLockStatus: function(){
      this.itinerary.isPublic = !this.itinerary.isPublic;
    },
    getLockIcon: function(){
      if (this.itinerary.isPublic == undefined || this.itinerary.isPublic == true){
        // 預設公開
        return "el-icon-lock";
      }
      return "el-icon-unlock";
    },
    hasMemo: function(rowData){
      // 目前都還沒有memo 所以上面寫反
      if (rowData.memo == undefined){
        return false;
      }
      return true;
    },
    getTitle: function(rowData){
      return '<div style="font-weight: bold;">' + rowData.name + '</div>';
    },
    getContent: function(rowData){
      // return '<div>' + rowData.memo + '</div>'
      return '<div>' + "這邊的OOXX很好吃，必吃" + '</div>'
    },
    changeToCarousel: function(){
      this.$emit("changeToCarousel", "MemberItineraryCarousel");
    },
    dayFormat: function(index){
      return "day " + (index+1);
    },
    trafficFormat: function(mode, duration){
      if (mode == "driving-car"){
        return "開車 / " + this.trafficTimeForamt(duration);
      }
      if (mode == "cycling-regular"){
        return "單車 / " + this.trafficTimeForamt(duration);
      }
      if (mode == "foot-walking"){
        return "走路 / " + this.trafficTimeForamt(duration);
      }
    },
    carryTimeUnit(time) {
      return Math.floor(time / 60);
    },
    trafficTimeForamt: function(duration){
      // to mins
      let mins = this.carryTimeUnit(duration);
      let remainingSec = Math.floor(duration % mins);
      if(mins >= 60) {
          let hours = Math.floor(mins / 60);
          let remainingMins = Math.floor(mins % 60);
          return hours + '小時 ' + remainingMins + '分 ';  
      }
      else if(mins == 0) {
          return duration + '秒';
      }
      else {
          return mins + '分 ';
      }
    },
    addressFormat: function(address){
      return getAddress(address);
    },
    stopTimeFormat: function(hrs, mins){
      if (mins == 'undefined' || mins == 'null'){
        return hrs + "小時"
      }
      if (hrs == 'undefined' || hrs == 'null'){
        return mins + "分鐘"
      }
      return hrs + "小時" + mins + "分鐘";
    },
    startTimeFormat: function(startTime){
      if (startTime.min.toString().length == 1){
        return startTime.hr + "：0" + startTime.min;
      }
      return startTime.hr + "：" + startTime.min;
    },
    stayTimeFormat: function(startTime, stopTime){
      let endTime = {
        hr: startTime.hr + stopTime.hrs,
        min: startTime.min + stopTime.mins
      };
      return this.startTimeFormat(startTime) + " ~ " + this.startTimeFormat(endTime);
    },
    resetDetailInfo: function(){
      // 修改一下，應該改成dayNum，debug........
      this.days = [];
      for (let i = 0; i < this.itinerary.dayNum; i++){ // 天數 3
        let tmpDay = [];
        let baseTime;
        if (this.itinerary.startTimes !== undefined){
          baseTime = this.itinerary.startTimes[i];
        }else {
          baseTime = {
            hr: 8,
            min: 0
          };
        }
        if (this.itinerary.togos.length !== 0){
          for (let j = 0; j < this.itinerary.togos[i].length; j++){ // 每天景點 2 3 3 0 0 0 ...
            // 每天的行程
            let tmpTogo = {};
            let index = j + 1;
            let name = this.itinerary.togos[i][j].name;
            let address = this.addressFormat(this.itinerary.togos[i][j].address);
            let stopTime = this.itinerary.togos[i][j].stopTime;
            let memo = this.itinerary.togos[i][j].memo;
            // let memo = "lalalalal";
            let startTime = baseTime;
            if (j !== 0 && this.itinerary.travelInfos[i] !== null){
              if (this.itinerary.travelInfos[i] !== undefined){
                startTime = 
                  this.calculateStartTime(tmpDay[0].startTime, this.itinerary.travelInfos[i][0].duration, this.itinerary.togos[i][j].stopTime);
              }
            }
            tmpTogo = {
              index: index,
              startTime: startTime,
              stopTime: stopTime,
              name: name,
              address: address,
              memo: memo
            };
            // console.log("tmpTogo", tmpTogo);
            tmpDay.push(tmpTogo);
          }
        }
        if (this.itinerary.travelInfos[i] !== null){
          if (this.itinerary.travelInfos[i] !== undefined){
            for (let j = 0; j < this.itinerary.travelInfos[i].length; j++){ // 0 1 1
              tmpDay[j+1].traffic = this.trafficFormat(this.itinerary.travelInfos[i][j].mode, this.itinerary.travelInfos[i][j].duration);
              tmpDay[j+1].startTime = 
                this.calculateStartTime(tmpDay[j].startTime, this.itinerary.travelInfos[i][j].duration, this.itinerary.togos[i][j+1].stopTime);
            }
            for (let j = 0; j < this.itinerary.togos[i].length; j++){
              tmpDay[j].stopTimeFormat = this.stopTimeFormat(tmpDay[j].stopTime.hrs, tmpDay[j].stopTime.mins)
              tmpDay[j].startTimeFormat = this.startTimeFormat(tmpDay[j].startTime);
              tmpDay[j].stayTimeFormat = this.stayTimeFormat(tmpDay[j].startTime, tmpDay[j].stopTime);
            }
          }
        }
        this.days.push(tmpDay);
      }
      // console.log("days", this.days);
    },
    // 修改過後的取出資料方式
    resetItineraryData: function(itinerary){
      //console.log('itinerary', itinerary);
      this.days = [];
      for (let i = 0; i < itinerary.dayNum; i++){ // 天數
        var tmpDay = [];
        if (itinerary.togos.length !== 0){
          for (let j = 0; j < itinerary.togos[i].length; j++){
            let togo = itinerary.togos[i][j];
            let index = j + 1;
            let name = togo.name;
            let address = this.addressFormat(togo.address);
            let stopTime = togo.stopTime;
            let stopTimeFormat = this.stopTimeFormat(togo.stopTime.hrs, togo.stopTime.mins);
            let startTime = togo.startTime;
            let endTime = togo.endTime;
            let stayTimeFormat = this.stayTimeFormat(startTime, stopTime);
            let memo = togo.memo;
            let traffic = "";
            
            let tmpTogo = {
              index: index, // No.
              name: name, // 景點名稱
              address: address, // 地址
              stopTime: stopTime, 
              stopTimeFormat: stopTimeFormat, // 停留時間
              startTime: startTime, 
              endTime: endTime,
              stayTimeFormat: stayTimeFormat, // 開始時間
              memo: memo, // 備忘錄
              traffic: traffic // 交通時間
            }
            tmpDay.push(tmpTogo);
          }
        }
        if (this.itinerary.travelInfos[i] !== undefined){
          for (let j = 0; j < itinerary.travelInfos[i].length; j++){ // 0 1 1
            tmpDay[j+1].traffic = this.trafficFormat(itinerary.travelInfos[i][j].mode, itinerary.travelInfos[i][j].duration);
          }
        }
        this.days.push(tmpDay);
      }
    },
    checkItineraryStatus: function (timeout = 10000) {
      let self = this;
      return new Promise((resolve, reject) => {
          let timer;
          self.$socket.emit('checkItinerary', {itineraryId: this.itinerary._id, token: self.$store.state.userToken});
          function responseHandler(checkedReply) {
              // resolve promise with the value we got
              //console.log(checkedReply)
              resolve(checkedReply);
              clearTimeout(timer);
          }
        self.$socket.on('checkedReply', responseHandler); 
          // set timeout so if a response is not received within a 
          // reasonable amount of time, the promise will reject
          timer = setTimeout(() => {
              reject(new Error("timeout waiting for msg"));
            self.$socket.removeListener('checkedReply', responseHandler);
          }, timeout);

        });
    },
    loading() {
      this.isLoading = true;
    },
    modifyItinerary: async function(){
      let self = this;
      this.checkItineraryStatus()
      .then((checkedReply) => {
        self.isLocked = checkedReply;
        //console.log(checkedReply)
        self.$bus.$emit('modifyItinerary', {itinerary: self.itinerary, currentAccessId: self.currentAccessId, isLocked: self.isLocked});
      })
      this.$bus.$emit('loading');
      setTimeout(() => {
          self.$router.push('/trip?currentAccessId=' + this.currentAccessId + '&itineraryId=' + this.itinerary._id);
      }, 2000);
    },
    getLockStatus: function(){
      if (this.itinerary.isPublic == undefined || this.itinerary.isPublic == true){
        return true;
      }
      return false;
    },
    calculateStartTime: function(lastStartTime, trafficDuration, stopTime){
      let hr = 0;
      let min = 0;
      // 處理上一開始時間
      if (lastStartTime.hr !== 'undefined' && lastStartTime.hr !== 'null'){
        hr = hr + lastStartTime.hr;
      }
      if (lastStartTime.min !== 'undefined' && lastStartTime.min !== 'null'){
        min = min + lastStartTime.min;
      }
      // 處理本次交通時間
      let mins = this.carryTimeUnit(trafficDuration);
      let hours = Math.floor(mins / 60);
      let remainingMins = Math.floor(mins % 60);
      if (hours !== 'undefined' && hours !== 'null'){
        hr = hr + hours;
      }
      if (remainingMins !== 'undefined' && remainingMins !== 'null'){
        min = min + remainingMins;
      }
      if (stopTime.hrs !== 'undefined' && stopTime.hrs !== 'null'){
        hr = hr + Number(stopTime.hrs);
      }
      if (stopTime.mins !== 'undefined' && stopTime.mins !== 'null'){
        min = min + Number(stopTime.mins);
      }
      // 處理超過的時間
      if (min > 60){
        hr = hr + Math.floor(min / 60);
        min = min % 60;
      }
      let nextStartTime = {
        hr: hr,
        min: min
      };
      return nextStartTime;
    }
  },
  created() {
    console.log("itinerary create", this.itinerary);
    // this.resetDetailInfo();
    this.resetItineraryData(this.itinerary);
  },
  mounted() {
    let self = this;
    this.$emit("loadingComplete");
  },
  watch: {
    itinerary: function(newVal, oldVal){
      this.$emit("loadingComplete");
      this.resetItineraryData(this.itinerary);
      this.activeName = "0";
    }
  },
  beforeUpdate() {
    this.$emit("loadingComplete");
  },
}
</script>

<style>
  el-main {
    width: 100vw;
  }

  .memo_popover {
    border-radius: 50px;
  }

  .is-link:hover {
    color: #409EFF;
    cursor: pointer;
  }

  .is-link {
    font-weight: 700;
    text-decoration: none;
    -webkit-transition: color .2s cubic-bezier(.645,.045,.355,1);
    transition: color .2s cubic-bezier(.645,.045,.355,1);
    color: #303133;
  }

  .el-divider--horizontal {
    display: flex;
    height: 1px;
    width: 100%;
    margin: 24px 0;
  }

  .modify_button {
    margin: auto;
    text-align: center;
    float: right;
  }

  .lock:hover {
    cursor: pointer;
  }

  .memo:hover {
    cursor: pointer;
  }
</style>
