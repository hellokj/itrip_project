<template>
  <div style="margin:0px; padding:0px;">

    <!-- Scroll to Top Button-->
    <button class="btn-scroll-to-top" @click="ScrollToTop" style="position: fixed; right: 50px; bottom: 50px; z-index: 20;">Top</button>
    
    <!-- Index Area -->
    <div class="index-area" style="width:100%; height:60vh; z-index: 10">
      <!-- nav region -->
      <b-container class="nav-bar mt-0 mb-3 mx-auto">
        <b-row style="height: 100px;">
          <b-col align-self="center" cols="2">
            <img href="/trip" class="bg" src="../assets/home/Logo.svg" style="width: 100px;" />
          </b-col>
          <b-col class="col-home text-start" offset="2" offset-sm="2"  offset-md="4" offset-lg="6" offset-xl="7" cols="2" sm="2" md="2" lg="1" style="white-space: nowrap; overflow: hidden;">
            <router-link class="btn-home" to="/">首頁</router-link>
          </b-col>
          <b-col class="col-trip text-start" cols="2" sm="2" md="2" lg="1" align-h="center" align-self="center" style="white-space: nowrap; overflow: hidden;">
            <router-link class="btn-trip" to="/trip">旅遊</router-link>
          </b-col>
          <b-col class="text-center" cols="2" sm="2" md="2" lg="1" align-h="center" align-self="center">
            <!-- <button class="btn-login">登入</button> -->
            <ProfileButton :type="'danger'" style="width:max-content"></ProfileButton>
          </b-col>
        </b-row>
      </b-container>

      <!-- big title -->
      <div class="container">
        <b-row align-h="center" align-v="center">
          <b-col class="p-0" cols="12" style="text-align: center;"><h1 style="margin: 0px; font-size: 40px; color: #FFF;">跟著IG的粉絲一起旅行吧!</h1></b-col>
          <b-col class="p-0" cols="12" style="text-align: center;"><p style="font-size: 23px; color: #FFF">打卡、分享、說走就走</p></b-col>
        </b-row>
      </div>

      <!-- search region -->
      <div class="container pt-3 pb-3" style=" border-radius: 10px; background-color: rgba(0, 0, 0, 30%); overflow: visible;">
        <b-container >
          <b-row align-h="center" align-v="center" >
            <b-col class="p-0" cols="12" sm="6" md="6" >
              <HomeSearch class="home-search" style="display: absolute; z-index: 1;"></HomeSearch>
            </b-col>
            <!-- <b-col class="p-0" cols="1" sm="1" md="1" style="align-self: flex-start" >
              <span class="search-icon" ><img style="width: 50px;" @click.native="handleSearch" 
              src="../assets/home/Search.svg"/></span>
            </b-col> -->
          </b-row>
          <b-row class="mt-2" align-h="center">
            <b-col cols="12" sm="6" md="6" >
              <p class="key-word" style="display: inline-block; margin-right: 2rem;" :key="keyWord" v-for="keyWord in keyWords" @click="sendNameToTripPage(keyWord)">{{ keyWord }}</p>
            </b-col>
          </b-row>
        </b-container>
      </div>
    </div>

    <!-- Recommend Area -->
    <div class="recommend-area" style="z-index: 0;">

      <!-- IG景點推薦 -->
      <b-container class="mt-3" style="position: relative">

        <!-- Scroll Button -->
        <button class="btn-ig-right" @click="ScrollIgRight">></button>
        <button class="btn-ig-left" @click="ScrollIgLeft">&lt;</button>

        <b-row class="mb-3">
          <p class="col title-ig mb-0" style="font-size: 28px">IG熱門景點</p>
        </b-row>
        <b-row v-if="ig_recommend[0] != null" class="ig-recommend-scroll flex-nowrap" ref="igRecommend" style="height: auto">
          
          <b-col :key="i" v-for="i in 10" class="spot-item mt-3 mb-3" cols="12" sm="6" md="6" lg="3">
            <div class="spot-item-up-down">
              <div class="spot-item-up" style="overflow: hidden;">
                <img class="spot-img" :src="ig_recommend[i - 1].images[0]" alt="pic">
                <button class="btn-spotItem-add" @click="addToTrip(ig_recommend[i - 1].name, ig_recommend[i - 1]._id)">加入行程</button><br>
              </div>
              <div class="spot-item-down">
                <p class="spot-item-title" style="font-size: 20px; color:#FFF; width: 100%;  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ ig_recommend[i - 1].name }}</p>
                <!-- <i style="display: inline-block; margin: auto;" class="fab fa-instagram fa-2x" ></i> -->
                <div v-for="(t, index) in ig_recommend[i - 1].ig_tag" :key="index" style="display: inline-block">
                  <el-tag
                    class="mx-1 el-tag"
                    effect="plain" size="medium" type="danger"
                    v-if="index <= 1" >
                    #{{t}}
                  </el-tag>
                </div>
              </div>
            </div>
          </b-col>
        </b-row>
      </b-container>
      <!-- 美食推薦 -->
      <b-container class="mt-3" style="position: relative">

        <!-- Scroll Button -->
        <button class="btn-ig-right" @click="ScrollFoodRight">></button>
        <button class="btn-ig-left" @click="ScrollFoodLeft">&lt;</button>

        <b-row class="mb-3">
          <p class="col title-food mb-0" style="font-size: 28px">人氣美食</p>
        </b-row>
        <b-row v-if="food_recommend[0] != null" class="food-recommend-scroll flex-nowrap" ref="foodRecommend" style="height: auto" >
          
          <b-col :key="i" v-for="i in 10" class="spot-item mt-3 mb-3" cols="12" sm="6" md="6" lg="3">
            <div class="spot-item-up-down">
              <div class="spot-item-up" style="overflow: hidden; z-index: 1;">
                <img class="spot-img" v-if="food_recommend[i - 1].images" :src="food_recommend[i - 1].images[0]" alt="pic">
                <button class="btn-spotItem-add" @click="addToTrip(food_recommend[i - 1].name, food_recommend[i - 1]._id)">加入行程</button><br>
              </div>
              <div class="spot-item-down">
                <p class="spot-item-title" style="font-size: 20px; color:#FFF; width: 100%;  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ food_recommend[i - 1].name }}</p>
                <!-- <i class="fab fa-instagram fa-2x" style="display: block; padding-top: 22px;"></i> -->
                <div v-for="(t, index) in food_recommend[i - 1].ig_tag" :key="index" style="display: inline-block">
                  <el-tag
                    class="mx-1 el-tag"
                    effect="plain" size="medium" type="danger"
                    v-if="index <= 1" >
                    #{{t}}
                  </el-tag>
                </div>
              </div>
            </div>
          </b-col>
        </b-row>
      </b-container>
    </div>


    <!-- Introduce Area -->
    <div class="intro-area" style="width:100%; height:100vh; overflow: hidden">
      <b-container fluid>
        <b-row class="mt-5 mb-5">
          <b-col class="mt-5" offset-md="0" offset-lg="4" offset-xl="3">
            <h1 class="intro-title" style="color: #DA8E8E; font-size: 60px;">簡單找到IG熱門景點，輕鬆規劃!</h1>
          </b-col>
        </b-row>
        <b-row>
          <b-col class="p-0 mb-5 text-center" cols="12" md="12" lg="4" xl="3">
            <router-link style="color: #FFF;" to="/trip"><button class="btn-intro" style="outline: none;">計畫出遊</button></router-link>
            
          </b-col>
          <b-col class="p-0 m-0" lg="8" xl="9">
            <img class="img-intro" src="../assets/home/webPageBig.svg" alt="pic">
          </b-col>

        </b-row>
      </b-container>
    </div>

    <!-- Footer -->
    <div class="footer">
      <b-container fluid>
        <b-row class="mt-5 footer-row">
          <b-col class="footer-col-one" sm="12" md="6" lg="6" style="align-content: flex-start;">
            <img src="../assets/home/itripLogoWhite.svg" @click="ScrollToTop" alt="logo" style="width: auto;">
          </b-col>
          <b-col class="footer-col-two" sm="12" md="3" lg="3">
            <router-link class="footer-home" to="/">首頁</router-link>
            <router-link class="footer-trip" to="/trip">旅遊</router-link>
            <router-link class="footer-login" to="/">登入</router-link>
          </b-col>
          <b-col class="footer-col-three" sm="12" md="3" lg="3">
            <p class="footer-login">聯絡我們</p>
          </b-col>
        </b-row>
      </b-container>
    </div>
    
  </div>

</template>

<script>
import {getAreas, getTypes, makeParams, getAreaPics} from '../../utils/area.js'
import {apiGetSpots, apiGetRoutes, apiSaveTrip, apiGetNearby} from '../../utils/api'
import HomeSearch from '../components/HomeSearch'
import ProfileButton from '../components/ProfileButton'
import ProfileDropDown from '../components/template/ProfileDropDown'

// path for images: ../assets/home/XXXX.svg
export default {
  name: 'home',
  components: {
    HomeSearch,
    ProfileButton,
    ProfileDropDown,
  
  },
  data() {
    return {
      slide: 0,
      sliding: null,
      selected: null,
      options: ["美食", "購物", "景點", "交通", "住宿", "娛樂"],
      types: {'美食':'gourmet', '購物':'shopping', '景點':'scenic spot', '交通':'transportation', '住宿':'lodging', '娛樂':'entertainment'},
      SearchHover: false,
      params: makeParams(undefined, undefined, 'scenic spot', undefined),
      ig_recommend: [],
      food_recommend: [],
      keyWords: [],
    }
  },
  created: function() {
    let params_ig = makeParams(undefined, undefined, 'scenic spot', undefined);
    let params_food = makeParams(undefined, undefined, 'gourmet', undefined);
    let self = this;
    this.callGetSpotApi(params_ig, "self.ig_recommend");  // result array will store in the 2nd parameter
    this.callGetSpotApi(params_food, "self.food_recommend");
    console.log(params_ig);
    console.log(params_food);
  },
  methods: {

    toggle: function(toggle){
      console.log(toggle);
    },
    handleSearch: function() {
      alert(this.selected);

      if (options.indexOf(this.selected) !== -1){
        this.params = makeParams(null, null, this.selected, null);  // type 
      } else {
        this.params = makeParams(null, null, null, this.selected);  // name
      }
      this.$router.push({path: '/trip'});
      this.$emit('search-click', this.params);
      
    },
    printRecommend: function(){
      console.log(this.ig_recommend);
    },
    // call get spots api
    callGetSpotApi: function(data, varString) {
      let self = this;
      // call get spots api
      apiGetSpots(data)
      .then(function (res) {
        eval(varString + '=' + "res.data.data.resultList");
        // self.paginator = res.data.data.paginator;
      })
      .catch(function (error) {
        console.log(error);
      })
      .then(function () {
        // always executed
      });
    },
    addToTrip(spot, id){
      this.$router.push("/trip/?qspot=" + spot + "&qid=" + id);
    },
    sendNameToTripPage(name){
        this.$router.push("/trip/?qname=" + name);
    },
    ScrollToTop: function(){
      window.scrollTo(0, 0);
    },
    ScrollIgRight: function(){
      var elem = this.$refs["igRecommend"];
      elem.scrollBy({
        top: 0,
        left: elem.clientWidth,   
        behavior: "smooth" 
      });
    },
    ScrollIgLeft: function(){
      var elem = this.$refs["igRecommend"];
      elem.scrollBy({
        top: 0,
        left: -elem.clientWidth,   
        behavior: "smooth" 
      });
    },
    ScrollFoodRight: function(){
      var elem = this.$refs["foodRecommend"];
      elem.scrollBy({
        top: 0,
        left: elem.clientWidth,   
        behavior: "smooth" 
      });
    },
    ScrollFoodLeft: function(){
      var elem = this.$refs["foodRecommend"];
      elem.scrollBy({
        top: 0,
        left: -elem.clientWidth,   
        behavior: "smooth" 
      });
    }
  },
  watch: {
    ig_recommend: function(){
      for(var i = 0; i < 4; i++)
      this.keyWords.push(this.ig_recommend[i].name);
    },
  }
}
</script>

<style scoped>

  /* smoothly scroll */
  * {
    padding-top: 0px;
  }

  /* custom scroll bar */
  ::-webkit-scrollbar {
    height: 5px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: #fff; 
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: #888; 
    border-radius: 2.5px;
    width: 10%;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: rgb(117, 117, 117); 
  }
  .spot-img {
    display: block;
    width: auto;
    height: 120%;
    opacity: 0.8;
  }
  .nav-bar a {
    color: white;
    font-size: 1.2em;
  }

  .index-area {
    background-image: url("../assets/home/homeBg04.jpg");
    background-repeat: no-repeat;
    background-size: cover;
    position: relative;
  }

  button.btn-login {
    font-size: 1.2em;
    color: rgb(247, 247, 247);
    border: 2px solid rgb(247, 247, 247);
    height: 40px;
    width: 80px;
    border-radius: 10px;
    background-color: transparent;
  }
  .btn-login:hover {
    background-color: rgb(247, 247, 247);
    color: rgb(134, 175, 170);
  }
  .col-home, .col-trip {
    align-self: center;
    transition: all 0.4s ease;
  }
  .col-home:hover, .col-trip:hover {
    transform: translateX(7px);
    text-shadow: 0 0 15px #999;
  }

  .key-word {
    color: rgb(30, 206, 162);
    cursor: pointer;
  }

  .search-icon{
    cursor: pointer;
  }

  .recommend-area {
    /* background-image: linear-gradient(to bottom right, rgba(255,255,255,26%), rgba(119,149,160,10%), rgba(116,247,116,13%)); */
    background-image: linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%);
    width:100%; 
    height:auto; 
    overflow: hidden;
    position: relative;
  }

  .ig-recommend-scroll {
    overflow-y: visible;
    overflow-x: scroll;
  }

  .food-recommend-scroll {
    overflow-y: visible;
    overflow-x: scroll;
  }
  .spot-item-up {
    position: relative;
    border: none;
    border-radius: 10px 10px 0px 0px;
    width: 100%;
    height: 250px;
    transition: all 0.4s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    /* opacity: 0.8; */
  }

  .spot-item-down {
    position: relative;
    border: none;
    border-radius: 0px 0px 10px 10px;
    width: 100%;
    height: 60px;
    padding-left: 10px;
    background-image: linear-gradient(to bottom right, rgba(255,194,132,100%), rgba(255,131,59,100%), rgba(255,108,113,100%));
    overflow: hidden;
    transition: all 0.4s ease;
  }

  .spot-item-up-down:hover {
    border-radius: 10px 10px 10px 10px;
    box-shadow: 0px 3px 15px rgba(1,7,43,74%);
    align-self: flex-start;
  }

  .spot-item-up-down:hover .spot-item-down {
    height: 120px;
  }

  .spot-item-up-down:hover .spot-item-up {
    height: 190px;
    opacity: 0.5;
  }
  .spot-item-up-down:hover .spot-img {
    opacity: 0.7;
  }
  .spot-item-up-down:hover .spot-item-title {
    margin-bottom: 12px;
  }

  .spot-item-title {
    padding-left: 10px;
    margin-bottom: 16px;
    margin-top: 15px;
  }

  .btn-spotItem-add {
    position: absolute;
    bottom: -70px;
    right: calc(50% - 70px);
    float: right;
    width: 140px;
    height: 60px;
    font-size: 22px;
    border: 2px solid #FFF;
    color: #FFF;
    border-radius: 30px;
    background-color: transparent;
    transition: all 0.4s ease;
    z-index: 25;
  }

  .spot-item-up-down:hover .btn-spotItem-add {
    bottom: 50px;
  }

  .btn-spotItem-add:hover {
    color: rgb(141, 45, 48);
    background-color: #FFF;
    box-shadow: 0px 0px 15px rgb(24, 24, 24);
  }

  .el-tag {
    display: inline-block;
    font-size: 15px;
    height:auto;
    width: auto;
  }

  .intro-area {
    background-image: linear-gradient(to bottom right, rgba(255,255,255,100%), rgba(238,224,224,55%), rgba(218,183,142,17%));

  }

  .btn-intro {
    width: 80%;
    height: 60px;
    text-align: center;
    font-size: 36px;
    border: none;
    color: #FFFFFF;
    border-radius: 30px;
    background-color: #DA8E8E;
    box-shadow: 0px 3px 6px rgba(1,7,43,74%);
  }

  .btn-intro:hover {
    box-shadow: 0px 3px 15px rgba(1,7,43,74%);
  }

  .img-intro {
    width: 160%; 
    height: auto;
  }

  .footer {
    background-image: linear-gradient(to left, rgba(253,153,116,100%), rgba(255,210,151,58%));
    width:100%; 
    height:40vh; 
    overflow: hidden;
  }

  .footer-home, .footer-trip, .footer-login {
    display: block;
    color: #fff;
    font-size: 22px;
    margin-bottom: 5%;
  }
  .footer-home:hover, .footer-trip:hover, .footer-login:hover {
    text-shadow: 0px 0px 20px rgba(55,55,55,100%);

  } 
  .footer-col-one {
    padding-left: 10%;
  }

  /* Scroll Bottom */
  .btn-scroll-to-top {
    width: 60px;
    height: 60px;
    border: none;
    border-radius: 30px;
    color: #FFF;
    background-color: rgba(255, 111, 75, 40%);
    box-shadow: 0 0 5px rgb(73, 72, 72);
    font-size: 20px;
    outline: none;
  }

  .btn-scroll-to-top:hover {
    background-color: rgba(255, 111, 75, 100%);
  }

  .btn-ig-right {
    border: none;
    background-color: rgba(29, 27, 36, 0.226);
    width: 40px;
    height: 40px;
    border-radius: 25px;
    color: rgb(206, 206, 206);
    font-size: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute; 
    right: -30px; 
    top: 50%; 
    z-index: 20;
  }

  .btn-ig-right:hover {
    background-color: rgba(29, 27, 36, 0.479);
    color: rgb(212, 212, 212);
  }

  .btn-ig-left {
    border: none;
    background-color: rgba(29, 27, 36, 0.226);
    width: 40px;
    height: 40px;
    border-radius: 25px;
    color: rgb(206, 206, 206);
    font-size: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute; 
    left: -30px; 
    top: 50%; 
    z-index: 20;
  }

  .btn-ig-left:hover {
    background-color: rgba(29, 27, 36, 0.479);
    color: rgb(212, 212, 212);
  }
  /* Scroll Bottom */


  @media only screen and (max-width: 770px) {
    .spot-img {
      width: 140%;
      height: auto;
    }
    .recommend-area {
    
      height: auto;
      overflow: hidden;
    }

    .btn-intro {
      margin: 30px 0px;
    }

    .img-intro {
      width: 100%; 
      height: auto;
    }

    .footer {
      height: auto;
      padding-bottom: 10%;
    }

    .footer-col-one, .footer-col-two, .footer-col-three {
      text-align: center;
      padding: 0;
    }

    .btn-scroll-to-top {
      background-color: rgba(255, 111, 75, 100%);
    }

    .btn-ig-right {
      right: 20px;
    }

    .btn-ig-left {
      left: 20px;
    }

    .col-home a, .col-trip a {
      font-family: 'Noto Sans TC', sans-serif;
      color: rgb(77, 60, 60);

    }
  }

</style>
