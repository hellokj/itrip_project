<template>
  <el-main>
      <el-container style="margin-bottom: 20px;">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首頁</el-breadcrumb-item>
          <el-breadcrumb-item :to="{}" @click.native="changeToCarousel">個人檔案</el-breadcrumb-item>
          <el-breadcrumb-item>我的行程</el-breadcrumb-item>
          <el-breadcrumb-item>即將到來的行程</el-breadcrumb-item>
          <el-breadcrumb-item>我的旅行</el-breadcrumb-item>
          <el-breadcrumb-item>第一天</el-breadcrumb-item>
        </el-breadcrumb>
      </el-container>
      <el-tabs type="border-card">
        <el-tab-pane label="第一天">
          <el-divider content-position="left">{{itinerary.name}}</el-divider>
          <el-table
            :data="data"
            height="400"
            border
            style="width: 100%">
            <el-table-column
              prop="date"
              label="日期"
              width="120"
              align="center">
            </el-table-column>
            <el-table-column
              prop="name"
              label="景點"
              width="180"
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
  },
  methods: {
    changeToCarousel: function(){
      this.$emit("changeToCarousel", "MemberItineraryCarousel");
    }
  },
  created() {
    console.log("itinerary", this.itinerary);
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
