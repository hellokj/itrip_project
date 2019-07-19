<template>
<el-container style="height: 90vh; border: 1px solid #eee">
  <el-aside width="20%" style="background-color: rgb(238, 241, 246)">
    <el-menu :default-openeds="['']">
      <el-submenu index="2">
        <template slot="title"><i class="el-icon-menu"></i>我的行程</template>
        <el-menu-item-group title="即將到來行程">
          <!-- <template slot="title">歷史行程</template> -->
          <!-- 行程列表可以用 v-for 跑 -->
          <el-menu-item index="2-1">行程1</el-menu-item>
          <el-menu-item index="2-2">行程2</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group title="過往行程">
          <el-menu-item index="2-3">行程3</el-menu-item>
        </el-menu-item-group>        
      </el-submenu>
      <el-submenu index="3">
        <template slot="title"><i class="el-icon-setting"></i>設定</template>
        <el-menu-item-group title="帳戶安全">
          <el-menu-item index="3-1">會員資訊</el-menu-item>
          <el-menu-item index="3-2">更改密碼</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group title="社群網路">
          <el-menu-item index="3-3">我的追蹤清單</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </el-aside>
  
  <el-container>
    <el-main>
      <el-divider content-position="center">即將到來的行程</el-divider>
      <el-carousel :interval="4000" type="card" height="30vh">
        <!-- 即將到來行程陣列 -->
        <el-carousel-item v-model="incomingItineraries" v-for="item in incomingItineraries" :key="item">
          <div style="width: auto; height: 100%;">
            <img :fit="cover" :src='item.togos[0][0].images[0]' style="width: 100%; height: 100%;">
            <span class="card_text">{{ item.name }} {{ item.startDate.year }} - {{ item.startDate.month }} - {{ item.startDate.day }}</span>
          </div>
        </el-carousel-item>
      </el-carousel>
      <el-divider content-position="center">過往行程</el-divider>
      <el-carousel :interval="4000" type="card" height="30vh">
        <!-- 過去行程陣列 -->
        <el-carousel-item v-model="historyItineraries" v-for="item in historyItineraries" :key="item">
          <div style="width: auto; height: 100%;">
            <img :fit="cover" :src='item.togos[0][0].images[0]' style="width: 100%; height: 100%;">
            <span class="card_text">{{ item.name }} {{ item.startDate.year }} - {{ item.startDate.month }} - {{ item.startDate.day }}</span>
          </div>
        </el-carousel-item>
      </el-carousel>
    </el-main>
  </el-container>

</el-container>
</template>

<script>
import { apiGetItineraries } from '../../utils/api'
export default {
  data() {
    return {
      date: { // 判定 行程時間 現在時間
        year: "",
        month: "",
        day: ""
      },
      myItineraries: [],
      incomingItineraries: [],
      historyItineraries: [],
    }
  },
  created() {
    let token = this.$store.state.userToken;
    let self = this;
    apiGetItineraries(token)
      .then(function(res){
        // console.log(res.data.data);
        // console.log(res.data.data[0].togos[0][0].images[0]);
        // console.log(res.data.data[0]);
        self.myItineraries = res.data.data; // 行程
        let currentDate = new Date();
        self.year = currentDate.getFullYear();
        self.month = currentDate.getMonth() + 1;
        self.day = currentDate.getDate();
        self.compareCurrentTime(currentDate);
      })
      .catch(function (error) {
        console.log(error);
      });
  },
  methods: {
    compareCurrentTime: function(currentDate){
      // 判斷行程 為 即將開始 或 過往行程
      for (let i = 0; i < this.myItineraries.length; i++){
        let date = new Date(Number(this.myItineraries[i].startDate.year), Number(this.myItineraries[i].startDate.month), Number(this.myItineraries[i].startDate.day));
        let d = currentDate.getTime() - date.getTime();
        if (d > 0){
          this.historyItineraries.push(this.myItineraries[i]);
        }else {
          this.incomingItineraries.push(this.myItineraries[i]);
        }
      }
    }
  },

};
</script>


<style>
  .el-aside {
    color: #333;
  }
  
  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }
  
  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }

  .card_text {
    z-index: 2;
    display: block;
    padding: 0 16px 16px;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    font-size: 16px;
    line-height: 20px;
    color: #fff;
  }
</style>
