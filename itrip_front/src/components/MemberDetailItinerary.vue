<template>
  <el-main>
      <el-container style="margin-bottom: 20px;">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首頁</el-breadcrumb-item>
          <el-breadcrumb-item :to="{}" @click.native="changeToCarousel">個人檔案</el-breadcrumb-item>
          <el-breadcrumb-item>我的行程</el-breadcrumb-item>
          <el-breadcrumb-item>{{ title }}</el-breadcrumb-item>
          <el-breadcrumb-item>{{ itinerary.name }}</el-breadcrumb-item>
        </el-breadcrumb>
      </el-container>
      <el-tabs type="border-card" v-model="index">
        <el-tab-pane :label='dayFormat(index)' v-for="(day, index) in days" :key="index + 'QQ' ">
          <el-container>
            <el-divider content-position="left">{{itinerary.name}} {{itinerary.startDate.year}}-{{itinerary.startDate.month}}-{{itinerary.startDate.day}}</el-divider>
            <el-link icon="el-icon-edit" @click="modifyItinerary(itinerary)">編輯行程</el-link>
          </el-container>
          <el-table
            :data="day"
            height="400"
            border
            style="width: 100%">
            <el-table-column
              prop="startTimeFormat"
              label="出發時間"
              width="120"
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
              align="center">
            </el-table-column>
            <el-table-column
              prop="address"
              label="地址"
              align="center">
            </el-table-column>
            <el-table-column
              prop='stopTime'
              label="停留時間"
              width="120"
              align="center">
            </el-table-column>
            <el-table-column
              prop="memo"
              label="備忘錄"
              width="70"
              align="center">
              
              <el-popover
                placement="topright"
                title="文字筆記"
                width="200"
                trigger="click"
                v-model="showMemo"
                content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
                <i class="far fa-comment-alt memo" v-if="true" slot="reference" @click.native="showMemo = true"></i>
                gtd
              </el-popover>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="查看地圖" v-model="itinerary.travelInfos[0]">
          <el-container>
            <el-divider content-position="left">{{itinerary.name}} {{itinerary.startDate.year}}-{{itinerary.startDate.month}}-{{itinerary.startDate.day}}</el-divider>
            <el-link icon="el-icon-edit" @click="modifyItinerary(itinerary)">編輯行程</el-link>
          </el-container>
          <MemberMap :travelInfos="itinerary.travelInfos[0]" :itinerary='itinerary'></MemberMap>
        </el-tab-pane>
      </el-tabs>
    </el-main>
</template>

<script>
import {getAddress} from "../../utils/checker"
import MemberMap from '../components/MemberMap'
import { duration } from 'moment';
export default {
  components: {
    MemberMap,
  },
  props: {
    itinerary: Object,
    title: String,
  },
  data() {
    return {
      days: [], // 每天的行程 裡面存放 景點object
      showMemo: false,
    }
  },
  methods: {
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
      if (startTime.min == 'undefined' || startTime.min == 'null'){
        return startTime.hr + "點" + 0 + "分";
      }
      return startTime.hr + "點" + startTime.min + "分";
    },
    resetDetailInfo: function(){
      this.days = [];
      for (let i = 0; i < this.itinerary.togos.length; i++){ // 天數 3
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
        for (let j = 0; j < this.itinerary.togos[i].length; j++){ // 每天景點 2 3 3
          // 每天的行程
          let name = this.itinerary.togos[i][j].name;
          let address = this.addressFormat(this.itinerary.togos[i][j].address);
          let stopTime = this.stopTimeFormat(this.itinerary.togos[i][j].stopTime.hrs, this.itinerary.togos[i][j].stopTime.mins);
          let memo = this.itinerary.togos[i][j].memo;
          // let memo = "lalalalal";
          let startTime = baseTime;
          if (j !== 0){
            startTime = this.calculateStartTime(tmpDay[0].startTime, this.itinerary.travelInfos[i][0].duration, this.itinerary.togos[i][j].stopTime);
          }
          let tmpTogo = {
            startTime: startTime,
            stopTime: stopTime,
            name: name,
            address: address,
            memo: memo
          };
          console.log("tmpTogo", tmpTogo);
          tmpDay.push(tmpTogo);
        }
        for (let j = 0; j < this.itinerary.travelInfos[i].length; j++){ // 0 1 1
          tmpDay[j+1].traffic = this.trafficFormat(this.itinerary.travelInfos[i][j].mode, this.itinerary.travelInfos[i][j].duration);
          tmpDay[j+1].startTime = this.calculateStartTime(tmpDay[j].startTime, this.itinerary.travelInfos[i][j].duration, this.itinerary.togos[i][j+1].stopTime);
        }
        for (let j = 0; j < this.itinerary.togos[i].length; j++){
          tmpDay[j].startTimeFormat = this.startTimeFormat(tmpDay[j].startTime);
        }
        this.days.push(tmpDay);
      }
      console.log("days", this.days);
    },
    modifyItinerary: function(itinerary){
      this.$router.push({path: '/trip'});
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
    },
    showMemo: function(){
      alert("???");
    }
  },
  created() {
    console.log("itinerary", this.itinerary);
    this.resetDetailInfo();
  },
  beforeDestroy() {
    this.$bus.$emit('modifyItinerary', {itinerary: this.itinerary});
  },
  watch: {
    itinerary: function(){
      this.resetDetailInfo();
    }
  },
}
</script>

<style>
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
    display: block;
    height: 1px;
    width: 90%;
    margin: 24px 0;
  }

  .modify_button {
    margin: auto;
    text-align: center;
    float: right;
  }

  .memo:hover {
    cursor: pointer;
  }
</style>
