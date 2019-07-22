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
      <el-tabs type="border-card" v-model="itinerary">
        <el-tab-pane label="第一天" v-for="day in days" :key="day">
          <el-divider content-position="left">{{itinerary.name}} {{itinerary.startDate.year}}-{{itinerary.startDate.month}}-{{itinerary.startDate.day}}</el-divider>
          <el-table
            :data="day"
            height="400"
            border
            style="width: 100%">
            <el-table-column
              prop="time"
              label="出發時間"
              :width="auto"
              align="center">
            </el-table-column>
            <el-table-column
              prop="start"
              label="景點"
              :width="auto"
              align="center">
            </el-table-column>
            <el-table-column
              prop="address"
              label="地址"
              align="center">
            </el-table-column>
            <el-table-column
              prop="stayTime"
              label="停留時間"
              width="120"
              align="center">
            </el-table-column>
          </el-table>
        </el-tab-pane>
        
        <el-tab-pane label="查看地圖">
          
        </el-tab-pane>
      </el-tabs>
    </el-main>
</template>

<script>
export default {
  props: {
    itinerary: Object,
    title: String,
  },
  data() {
    return {
      days: [], // 每天的行程 裡面存放 景點object
      day: "第1天"
    }
  },
  methods: {
    changeToCarousel: function(){
      this.$emit("changeToCarousel", "MemberItineraryCarousel");
    },
  },
  created() {
    console.log("itinerary", this.itinerary);
    // console.log("length", this.itinerary.travelInfos.length);
    // console.log("travelInfos", this.itinerary.travelInfos);
    for (let i = 0; i < this.itinerary.travelInfos.length; i++){
      // 天數
      let tmpDay = [];
      for (let j = 0; j < this.itinerary.travelInfos[i].length; j++){
        // 每天的行程
        tmpDay.push(this.itinerary.travelInfos[i][j]);
      }
      this.days.push(tmpDay);
    }
    console.log("days", this.days);
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
</style>
