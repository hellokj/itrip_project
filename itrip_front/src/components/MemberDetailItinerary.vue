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
            <el-link icon="el-icon-edit modify_button" @click="modifyItinerary(itinerary)">編輯行程</el-link>
            <!-- <el-button class="modify_button" @click="modifyItinerary(itinerary)">編輯行程 <i class="fas fa-pencil-alt"></i></el-button> -->
          </el-container>
          <el-table
            :data="day"
            height="400"
            border
            style="width: 100%">
            <el-table-column
              prop="time"
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
          </el-table>
        </el-tab-pane>
        
        <el-tab-pane label="查看地圖" v-model="itinerary.travelInfos[0]">
          <!-- 第一天旅遊資訊 -->
          <MemberMap :travelInfos="itinerary.travelInfos[0]" :itinerary='itinerary'></MemberMap>
        </el-tab-pane>
      </el-tabs>
    </el-main>
</template>

<script>
import {getAddress} from "../../utils/checker"
import MemberMap from '../components/MemberMap'
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
    }
  },
  methods: {
    changeToCarousel: function(){
      this.$emit("changeToCarousel", "MemberItineraryCarousel");
    },
    dayFormat: function(index){
      return "day " + (index+1);
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
    resetDetailInfo: function(){
      this.days = [];
      console.log("itinerary", this.itinerary);
      // console.log("length", this.itinerary.travelInfos.length);
      // console.log("travelInfos", this.itinerary.travelInfos);

      for (let i = 0; i < this.itinerary.togos.length; i++){
        // 天數
        let tmpDay = [];
        for (let j = 0; j < this.itinerary.togos[i].length; j++){
          // 每天的行程
          let name = this.itinerary.togos[i][j].name;
          let address = this.addressFormat(this.itinerary.togos[i][j].address);
          let stopTime = this.stopTimeFormat(this.itinerary.togos[i][j].stopTime.hrs, this.itinerary.togos[i][j].stopTime.mins);
          let tmpTogo = {
            stopTime: stopTime,
            name: name,
            address: address
          };
          tmpDay.push(tmpTogo);
        }
        this.days.push(tmpDay);
      }
      // console.log("days", this.days);
    },
    modifyItinerary: function(itinerary){
      this.$router.push({path: '/trip'});
    },
  },
  created() {
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
  }
</style>
