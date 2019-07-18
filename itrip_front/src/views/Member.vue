<template>
<el-container style="height: 90vh; border: 1px solid #eee">
  <el-aside width="20%" style="background-color: rgb(238, 241, 246)">
    <el-menu :default-openeds="['1', '3']">
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
          <el-menu-item index="3-1">更改密碼</el-menu-item>
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
      <el-carousel :interval="4000" type="card" height="200px">
        <!-- 即將到來行程陣列 -->
        <el-carousel-item v-for="item in 6" :key="item">
          <h3 class="medium">{{ item }}</h3>
        </el-carousel-item>
      </el-carousel>
      <el-divider content-position="center">過往行程</el-divider>
      <el-carousel :interval="4000" type="card" height="200px">
        <!-- 過去行程陣列 -->
        <el-carousel-item v-for="item in 6" :key="item">
          <h3 class="medium">{{ item }}</h3>
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
        console.log(res);
        self.myItineraries = res.data.data[0].togos[0];
      })
      .catch(function (error) {
        console.log(error);
      });
  },
  methods: {

  },
};
</script>


<style>
  .el-footer {
    background: rgb(255,208,129);
    background: linear-gradient(90deg, rgba(255,208,129,1) 0%, rgba(246,165,144,1) 60%, rgba(231,126,125,1) 100%);
    color: #333;
    line-height: 60px;
  }

  .el-aside {
    color: #333;
  }

  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
  }
  
  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }
  
  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
</style>
