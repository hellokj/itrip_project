<template>
<el-container style="height: 90vh; border: 1px solid #eee">
  <!-- 會員頁面側邊欄 -->
  <MobileMemberAside 
    v-if="($resize && !$mq.above(1025))"
    :incomingItineraries="incomingItineraries"
    :historyItineraries="historyItineraries"
    v-on:changeToCarousel="changeView('MobileMemberItineraryCarousel')"
    v-on:checkDetail="checkDetail"
    v-on:checkFollowing="changeView('MobileMemberFollowingList')"
    v-on:setMemberInfo="changeView('MobileMemberInfos')">
  </MobileMemberAside>
  <MemberAside
    v-if="($resize && $mq.above(1025))"
    :incomingItineraries="incomingItineraries"
    :historyItineraries="historyItineraries"
    v-on:changeToCarousel="changeView('MemberItineraryCarousel')"
    v-on:checkDetail="checkDetail"
    v-on:checkFollowing="changeView('MemberFollowingList')"
    v-on:setMemberInfo="changeView('MemberInfos')">
  </MemberAside>

  <component
    v-if="($resize && !$mq.above(1025))"
    :is="view" :title="title"
    :incomingItineraries="incomingItineraries" 
    :historyItineraries="historyItineraries" 
    :itinerary="itinerary"
    v-on:changeToCarousel="changeView('MobileMemberItineraryCarousel')"
    v-on:loading="loading"
    v-on:loadingComplete="loadingComplete"
    v-on:checkDetail="checkDetail">
  </component>

  <component
    v-if="($resize && $mq.above(1025))"
    :is="view" :title="title"
    :incomingItineraries="incomingItineraries" 
    :historyItineraries="historyItineraries" 
    :itinerary="itinerary"
    v-on:changeToCarousel="changeView('MemberItineraryCarousel')"
    v-on:loading="loading"
    v-on:loadingComplete="loadingComplete"
    v-on:checkDetail="checkDetail">
  </component>
  <loading :active.sync="isLoading" :is-full-page="true">
  </loading>
</el-container>
</template>

<script>
import VueLoading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'

import MemberAside from '../components/MemberAside'
import MobileMemberAside from '../components/MobileMemberAside'
import MemberItineraryCarousel from "../components/MemberItineraryCarousel"
import MobileMemberItineraryCarousel from "../components/MobileMemberItineraryCarousel"
import MemberDetailItinerary from '../components/MemberDetailItinerary'
import MobileMemberDetailItinerary from '../components/MobileMemberDetailItinerary'
import MemberInfos from '../components/MemberInfos'
import MemberFollowingList from '../components/MemberFollowingList'
import { apiGetItineraries } from '../../utils/api'
import { setTimeout } from 'timers';
export default {
  name: "Member",
  components: {
    MobileMemberAside: MobileMemberAside,
    MemberAside: MemberAside,
    MemberItineraryCarousel: MemberItineraryCarousel,
    MobileMemberItineraryCarousel: MobileMemberItineraryCarousel,
    MemberDetailItinerary: MemberDetailItinerary,
    MobileMemberDetailItinerary: MobileMemberDetailItinerary,
    MemberInfos: MemberInfos,
    MemberFollowingList: MemberFollowingList,
    loading: VueLoading
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
      view: 'MemberItineraryCarousel',
      itinerary: Object,
      title: "",
      isLoading: false,
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
        self.flag = true;
        // console.log("new date", currentDate);
        // console.log("history", self.historyItineraries);
        // console.log("incoming", self.incomingItineraries);
      })
      .catch(function (error) {
        console.log(error);
      });
      // 接收瀏覽所有行程資訊
      this.$bus.$on("changeToCarousel", event => {
        self.changeView("MemberItineraryCarousel");
      });
      // 接收開啟會員資訊
      this.$bus.$on("setMemberInfo", event => {
        self.changeView("MemberInfos");
      });
  },
  methods: {
    compareCurrentTime: function(currentDate){
      // 判斷行程 為 即將開始 或 過往行程
      for (let i = 0; i < this.myItineraries.length; i++){
        let date = new Date(Number(this.myItineraries[i].startDate.year), Number(this.myItineraries[i].startDate.month)-1, Number(this.myItineraries[i].startDate.day));
        let d = currentDate.getTime() - date.getTime();
        // console.log("date", date);
        // console.log("d", d);
        if (d > 0){
          this.historyItineraries.push(this.myItineraries[i]);
        }else {
          this.incomingItineraries.push(this.myItineraries[i]);
        }
      }
    },
    checkDetail: function(itinerary){
      let self = this;
      this.loading();
      this.itinerary = itinerary;
      if (this.historyItineraries.includes(this.itinerary)){
        this.title = "歷史行程";
      } else {
        this.title = "即將到來行程";
      }
      setTimeout(()=>{
        if (self.$resize && self.$mq.above(1025)){
          self.changeView('MemberDetailItinerary');
        }else {
          self.changeView('MobileMemberDetailItinerary');
        }
      }, 2000);
    },
    changeView: function(viewName){
      this.view = viewName;
    },
    loading: function(){
      this.isLoading = true;
    },
    loadingComplete: function(){
      this.isLoading = false;
    }
  },
  updated() {
    
  },
  beforeDestroy() {
    this.$bus.$off('setMemberInfo');
    this.$bus.$off('changeView');
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

</style>
