<template>
  <div class="wrap">
    <!-- input region -->

    <b-container>
        <!-- {{searchResults}} -->
        <input @blur="inputTextFocus = false"  @focus="inputTextFocus = true" class="search-input" v-model="inputText" placeholder="輸入想去的地方、景點" type="text">

        <!-- region with pics -->
        <div class="container box-container region-auto" v-if="regionControl && (inputTextFocus || blockRegionBlur)">
          <b-row class=" p-0">

            <b-col class="col-left p-0" md="3">
              <button class="btn-region" @mouseover="pick = 0" @click="mobileClickFocus=true">北部</button><br>
              <button class="btn-region" @mouseover="pick = 1" @click="pick=1">中部</button><br>
              <button class="btn-region" @mouseover="pick = 2" @click="pick=2">南部</button><br>
              <button class="btn-region" @mouseover="pick = 3" @click="pick=3">東部</button><br>
              <button class="btn-region" @mouseover="pick = 4" @click="pick=4">離島</button><br>
            </b-col>

            <b-col class=" p-0" md="9">
              <div class="col-right" style="position: relative;">
                <button @mouseover="blockRegionBlur = true" @mouseleave="blockRegionBlur = false" :key="index" v-for="(i, index) in areaPics[regions[pick]]" class="btn-county" @click="sendPlaceToTripPage(index)">
                  <p class="county-text">{{index}}</p>
                  <img class="img-county" style="opacity: 0.8" :src="i">
                </button>
              </div>
            </b-col>

          </b-row>
        </div>

        <!-- associative search -->
        <div class="container" v-if="associateControl && (inputTextFocus || blockAssociateBlur)">
          <b-row>
            <b-col cols="12 m-0 p-0" style="height: auto;" :key="k" v-for="(v, k) in searchResults">
              <div class="searchResultItem"  @mouseover="blockAssociateBlur = true" @mouseleave="blockAssociateBlur = false" @click="sendNameToTripPage(v.name)">
                  <p class="searchName">{{ v.name }}</p>
                  <p class="searchTags" :key="_k" v-for='(_t, _k) in v["ig_tag"]'>{{"#" + _t}}</p>
              </div>
            </b-col>
          </b-row>
        </div>
    </b-container>


  </div>
</template>
<script>
import {getAreaPics, makeParams} from '../../utils/area.js'
import {apiGetSpots} from '../../utils/api.js'

export default {
    name: "HomeSearch",
    data(){
      return {
        areaPics: getAreaPics(),
        regions: Object.keys(getAreaPics()),
        pick: 0,
        inputText: '',
        inputTextFocus: false,
        mobileClickFocus: false,
        isMobile: false,
        regionControl: true,
        associateControl: false,
        blockRegionBlur: false,
        blockAssociateBlur: false,
        params: {},
        searchResults: [],

      }
    },
    methods: {
      sendPlaceToTripPage(place){
        var p = place;
        if (place.indexOf('台') == 0) p = '臺' + place.substr(1, 2);
        this.$router.push("/trip/?qplace=" + p);
      },
      sendNameToTripPage(name){
        this.$router.push("/trip/?qname=" + name);
      }
    },
    created(){
      if (window.matchMedia("(max-width: 767px)").matches) {
        this.isMobile = true;
      }
    },
    watch: {
      areaPics: function(){
        this.regions = this.areaPics.keys();
      },
      inputText: function( newVal, oldVal ){
        if( newVal ) this.regionControl = false;
        else this.regionControl = true;

        let self = this;
        if( newVal && newVal != oldVal ){
          var params = makeParams(null, null, null, newVal);
          apiGetSpots(params)
          .then(function (res) {
            self.searchResults = res.data.data.resultList;
            if( newVal === '' ) self.searchResults = [];
          })
          .catch(function (error) {
            console.log(error);
          })
          .then(function () {
            // always executed
          });
        }

        if( newVal === '' ) this.associateControl = false;
        else this.associateControl = true;
      },

    }
}

window
</script>
<style scoped>

 /* custom scroll bar */
  ::-webkit-scrollbar {
    width: 5px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: rgb(189, 189, 189); 
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
  .box-container {
    width: 600px;
    height: 250px;
    background-color: #FFF;
    border-radius: 10px 10px 5px 5px;
  }

  .btn-region {
    width: 100%;
    height: 50px;
    border: none;
    border-bottom: 1px solid rgb(192, 192, 192);
    background-color: #FFF;
    text-align: start;
    padding-left: 15px;
    font-size: 16px;
    position: relative;
    outline: none;
  }

  .btn-region::after {
    display: none;
  }

  .btn-region:hover {
    background-color: rgb(255, 109, 72);
    color: #FFF;
    border: none;
    
  } 
  .btn-region:hover.btn-region::after {
    display: block;
    position: absolute;
    content: "";
    width: 0;
    height: 0;
    border-top: 10px solid transparent;
    border-left: 15px solid rgb(255, 109, 72);
    border-bottom: 10px solid transparent;
    left: 100%;
    top: 16px;
    z-index: 1;
  }
  .col-right {
    width: 100%;
    height: 250px;
    overflow-y: scroll;
    display: flex;
    flex-wrap: wrap;
    background-color: #FFF;
  }

  @media only screen and (max-width: 560px) {
  .box-container {
      width: 400px;
      background-color: #FFF;
      border-radius: 10px 10px 5px 5px;
    }
  }
  .btn-county {
    width: 160px;
    height: 100px;
    padding: 0;
    overflow: hidden;
    border: none;
    border-radius: 5px;
    margin: 10px 10px;
    background-color: transparent;
    position: relative;
  }

  .img-county {
    width: 100%;
    height: auto;
    z-index: -1;
  }

  .county-text {
    position: absolute;
    left: 35%;
    top: 75px;
    font-size: 16px;
    z-index: 1;
    color: #FFF;
  }


  .btn-county:hover {
    box-shadow: 0px 0px 5px rgba(1,7,43,74%);    
  }

  .btn-county:hover .county-text {
    text-shadow: 0 0 10px rgb(56, 64, 75);
  }

  .search-input {
    width: 100%;
    height: 40px;
    padding-left: 15px;
    border-radius: 10px;
    font-size: 20px;
    border: none;
    background-color: #FFF;
    box-shadow: 0px 0px 5px rgba(1,7,43,74%);    
    position: relative;
    outline: none;
  }

  /* .region-auto {
    display: none;
  }
  
 
  .search-input:focus + .region-auto {
    display: block;
  } */

  .searchResultItem {
    width: 100%;
    height: 100%;
    border-bottom: 1px solid rgb(221, 210, 210);
    border-right: 3px solid transparent;
    border-left: 3px solid transparent;
    background-color: #FFF;
    padding-left: 15px;
    display: flex;
    align-items: center;
    justify-content: start;
  }

  .searchName {
    color: rgb(31, 31, 34);
    margin: 0px;
    font-size: 20px;
    flex-grow: 12;
  }

  .searchTags {
    padding: 2px;
    border: 1px solid tomato;
    border-radius: 5px;
    margin: 2px;
    font-size: 15px;
    color: rgb(31, 31, 34);
  }

  .searchResultItem:hover {
    background-color: rgb(255, 125, 78);
    color: #FFF;
  }

  .searchResultItem:hover .searchTags {
    border: 1px solid #FFF;
    color: #FFF;
  }

  .search-input::after {
    content: "";
    position: absolute;
    
    width: 15px;
    height: 15px;
    color: #000;
  }

</style>


