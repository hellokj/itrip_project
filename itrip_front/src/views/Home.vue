<template>
  <div>

    <!-- Index Area -->
    <div class="index-area" style="width:100%; height:100vh; overflow: hidden">
      <b-container class="nav-bar mt-5 mb-3 mx-auto">
        <b-row >
          <b-col cols="2">
            <img href="/trip" class="bg" src="../assets/home/Logo.svg" style="width: auto;" />
          </b-col>
          <b-col class="text-center" offset="2" offset-sm="2"  offset-md="4" offset-lg="6" offset-xl="7" cols="2" sm="2" md="2" lg="1" align-self="center">
            <router-link class="btn-home" to="/">首頁</router-link>
          </b-col>
          <b-col class="text-center" cols="2" sm="2" md="2" lg="1" align-h="center" align-self="center">
            <router-link class="btn-trip" to="/trip">旅遊</router-link>
          </b-col>
          <b-col class="text-center" cols="2" sm="2" md="2" lg="1" align-h="center" align-self="center">
            <button class="btn-login">登入</button>
          </b-col>
        </b-row>
      </b-container>
      
      <b-container class="mt-5">
        <b-row align-h="center" align-v="center" style="margin-top: 20vh;">
          <b-col class="p-0" cols="10" sm="6" md="6" >
            <b-form-input class="form-input" v-model="selected" list="input-list" id="input-with-list" placeholder="輸入想去的地方"></b-form-input>
            <b-form-datalist id="input-list" v-bind:options="options"></b-form-datalist>
          </b-col>
          <b-col class="p-0" cols="1" sm="1" md="1" >
            <span class="search-icon" width="30px;"><img @click.native="handleSearch" 
             src="../assets/home/Search.svg" /><a href="http://google.com.tw" /></span>
          </b-col>
        </b-row>
        <b-row class="mt-2" align-h="center">
          <b-col cols="11" sm="7" md="7" >
            <p class="key-word" style="display: inline-block; margin-right: 2rem;"  :key="keyWord" v-for="keyWord in keyWords">{{ keyWord }}</p>
          </b-col>
        </b-row>
      </b-container>
    </div>

    <!-- Recommend Area -->
    <div class="recommend-area">
      <b-container class="mt-3">
        <b-row class="mb-3">
          <p class="title-ig mb-0" style="font-size: 28px">IG熱門景點</p>
        </b-row>
        <b-row class="ig-recommend-scroll" style="height: 90vh;">
          
          <b-col :key="i" v-for="i in 10" class="spot-item mb-3" cols="12" sm="6" md="6" lg="3">
            <div class="spot-item-up" style="overflow: hidden;">
              <img class="spot-img" :src="ig_recommend[i - 1].images[0]" alt="pic">
            </div>
            <div class="spot-item-down p-3">
              <p class="mb-2" style="display: inline-block; font-size: 22px; color:#FFF;">{{ ig_recommend[i - 1].name }}</p>
              <button class="btn-spotItem-add">加入行程</button><br>
              <i style="display: inline-block;" class="fab fa-instagram fa-2x"></i>
              <el-tag
                class="mx-1 el-tag"
          
                v-for="(t, index) in ig_recommend[i - 1].ig_tag"
                :key="index" effect="plain" size="medium" type="danger">
                #{{t}}
              </el-tag>
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
            <h1 class="intro-title" style="color: #DA8E8E; font-size: 60px;">跟著ＩＧ的粉絲一起去旅行！</h1>
          </b-col>
        </b-row>
        <b-row>
          <b-col class="p-0 mb-5 text-center" cols="12" md="12" lg="4" xl="3">
            <button class="btn-intro">開始規劃</button>
          </b-col>
          <b-col class="p-0 m-0" lg="8" xl="9">
            <img class="img-intro" src="../assets/home/webPageBig.svg" alt="pic">
          </b-col>

        </b-row>
      </b-container>
    </div>

    <!-- Footer -->
    <div class="footer" style="width:100%; height:50vh; overflow: hidden">
      <b-container fluid>
        <b-row class="mt-5 footer-row">
          <b-col class="footer-col-one" sm="12" md="6" lg="6" style="align-content: flex-start;">
            <img src="../assets/home/itripLogoWhite.svg" alt="logo" style="width: auto;">
          </b-col>
          <b-col class="footer-col-two" sm="12" md="3" lg="3">
            <p class="footer-home">首頁</p>
            <p class="footer-trip">旅遊</p>
            <p class="footer-login">登入</p>
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
import {getAreas, getTypes, makeParams} from '../../utils/area.js'
import {apiGetSpots, apiGetRoutes, apiSaveTrip, apiGetNearby} from '../../utils/api'
// path for images: ../assets/home/XXXX.svg
export default {
  name: 'home',

  data() {
    return {
      slide: 0,
      sliding: null,
      selected: null,
      options: ["美食", "購物", "景點", "交通", "住宿", "娛樂"],
      types: {'美食':'gourmet', '購物':'shopping', '景點':'scenic spot', '交通':'transportation', '住宿':'lodging', '娛樂':'entertainment'},
      keyWords: ["雙心石滬", "老梅石槽", "九份"],
      SearchHover: false,
      params: makeParams(undefined, undefined, 'scenic spot', undefined),
      ig_recommend: [],
      food_recommend: [],
      paginator: undefined,
      window: {
        width: 0,
        height: 0
      },
      arr: ["日月潭", "日月潭纜車"],

    }
  },
  created: function() {

    this.callGetSpotApi(this.params);
    console.log(this.params);
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
    callGetSpotApi: function(data) {
      let self = this;
      // call get spots api
      apiGetSpots(data)
      .then(function (res) {
        self.ig_recommend = res.data.data.resultList;
        self.paginator = res.data.data.paginator;
      })
      .catch(function (error) {
        console.log(error);
      })
      .then(function () {
        // always executed
      });
    },
  },
}
</script>

<style scoped>

  .spot-img {
    width: auto; 
    height: 120%;
  }
  .nav-bar a {
    color: white;
    font-size: 1.2em;
  }

  .index-area {
    background-image: url("../assets/home/homeBg04.jpg");
    background-repeat: no-repeat;
    background-size: cover;
  }

  .form-input {
    height: 48px;
    border: none;
    border-radius: 24px;
    box-shadow: 0px 5px 5px #00102927;
  }

  button.btn-login {
    color: rgb(255, 241, 241);
    border: 2px solid #FFF;
    height: 40px;
    width: 100px;
    border-radius: 20px;
    background-color: transparent;
  }

  .key-word {
    color: rgb(30, 206, 162);
    cursor: pointer;
  }

  .search-icon{
    cursor: pointer;
  }

  .recommend-area {
    background-image: linear-gradient(to bottom right, rgba(255,255,255,26%), rgba(119,149,160,10%), rgba(116,247,116,13%));
    width:100%; 
    height:100vh; 
    overflow: hidden
  }

  .ig-recommend-scroll {
    overflow-x: scroll;
  }
  .spot-item-up {
    border: none;
    border-radius: 10px 10px 0px 0px;
    width: 100%;
    height: 230px;
    box-shadow: 0px 3px 6px rgba(1,7,43,74%);

  }

  .spot-item-down {
    border: none;
    border-radius: 0px 0px 10px 10px;
    width: 100%;
    background-image: linear-gradient(to bottom right, rgba(255,194,132,100%), rgba(255,131,59,100%), rgba(255,108,113,100%));
    box-shadow: 0px 3px 6px rgba(1,7,43,74%);
  }

  .btn-spotItem-add {
    float: right;
    width: 80px;
    height: 36px;
    border: 2px solid #FFF;
    color: #FFF;
    border-radius: 18px;
    background-color: transparent;
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

  .img-intro {
    width: 160%; 
    height: auto;
  }

  .footer {
    background-image: linear-gradient(to left, rgba(253,153,116,100%), rgba(255,210,151,58%));
  }

  .footer-home, .footer-trip, .footer-login {
    color: #fff;
    font-size: 22px;
  }

  .footer-col-one {
    padding-left: 10%;
  }
  @media only screen and (max-width: 770px) {
    .spot-img {
      width: 100%;
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

    .footer-col-one, .footer-col-two, .footer-col-three {
      text-align: center;
    }
  }


</style>
