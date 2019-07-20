<template>
<el-container style="height: 90vh; border: 1px solid #eee">
  <!-- 側邊欄 -->
  <el-aside width="20%" style="background-color: rgb(238, 241, 246)">
    <el-menu :default-openeds="['']">
      <el-submenu>
        <template slot="title"><i class="el-icon-menu"></i>我的行程</template>
        <el-menu-item-group title="即將到來行程">
          <el-menu-item :index="1-i" v-for="(item, i) in incomingItineraries" :key="item.id">{{ item.name }}</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group title="過往行程">
          <el-menu-item :index="2-i" v-for="(item, i) in historyItineraries" :key="item.id">{{ item.name }}</el-menu-item>
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

  <!-- <MemberAside v-if="flag" :myItineraries="myItineraries"></MemberAside> -->
  
  <!-- 主顯示欄 -->
  <!-- <el-container>
    <el-main>
      <el-divider content-position="center">即將到來的行程</el-divider>
      <el-carousel :interval="4000" type="card" height="30vh">
        <el-carousel-item v-model="incomingItineraries" v-for="item in incomingItineraries" :key="item">
          <div style="width: auto; height: 100%;" @click="checkDetail">
            <img :fit="cover" :src='item.togos[0][0].images[0]' style="width: 100%; height: 100%;" class="card_img">
            <span class="card_text">{{ item.name }} {{ item.startDate.year }} - {{ item.startDate.month }} - {{ item.startDate.day }}</span>
          </div>
        </el-carousel-item>
      </el-carousel>
      <el-divider content-position="center">過往行程</el-divider>
      <el-carousel :interval="4000" type="card" height="30vh">
        <el-carousel-item v-model="historyItineraries" v-for="item in historyItineraries" :key="item">
          <div style="width: auto; height: 100%;" @click="checkDetail">
            <img :fit="cover" :src='item.togos[0][0].images[0]' style="width: 100%; height: 100%;" class="card_img">
            <span class="card_text">{{ item.name }} {{ item.startDate.year }} - {{ item.startDate.month }} - {{ item.startDate.day }}</span>
          </div>
        </el-carousel-item>
      </el-carousel>
    </el-main>
  </el-container> -->

  <!-- 詳細行程 -->
  <el-container>
    <el-main>
      <el-container style="margin-bottom: 20px;">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首頁</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/member' }">個人檔案</el-breadcrumb-item>
          <el-breadcrumb-item>我的行程</el-breadcrumb-item>
          <el-breadcrumb-item>我的旅行</el-breadcrumb-item>
          <el-breadcrumb-item>第一天</el-breadcrumb-item>
        </el-breadcrumb>
      </el-container>
      <el-tabs type="border-card">
        <el-tab-pane label="第一天">
          <el-divider content-position="left">我的行程</el-divider>
          <el-table
            :data="tableData"
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
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="第二天">
          <el-divider content-position="left">我的行程</el-divider>
          <el-table
            :data="tableData"
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
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="第三天">
          <el-divider content-position="left">我的行程</el-divider>
          <el-table
            :data="tableData"
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
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>

</el-container>
</template>

<script>
// import MemberAside from '../components/MemberAside'
import { apiGetItineraries } from '../../utils/api'
export default {
  components: {
    // MemberAside
  },
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
      flag: false,
      // test
      tableData: [{
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-08',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-06',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-07',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }],
        height: "65vh",
    }
  },
  created() {
    let token = this.$store.state.userToken;
    let self = this;
    apiGetItineraries(token)
      .then(function(res){
        console.log(res.data.data);
        // console.log(res.data.data[0].togos[0][0].images[0]);
        // console.log(res.data.data[0]);
        self.myItineraries = res.data.data; // 行程
        let currentDate = new Date();
        self.year = currentDate.getFullYear();
        self.month = currentDate.getMonth() + 1;
        self.day = currentDate.getDate();
        self.compareCurrentTime(currentDate);
        // self.flag = true;
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
    },
    checkDetail: function(){
      alert("???");
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
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    font-size: 16px;
    line-height: 20px;
    color: #fff;
    background-color: black;
    text-align: center;
  }

  .card_img {
    padding: 3px;
  }
</style>
