<template>
  <div class="wrap">

    <!-- input area -->
    <div class="input-wrap">
      <label class="label-clear" for="search" @click="clearInputText"></label>
      <input name="search" @blur="inputTextFocus = false"  @focus="inputTextFocus = true" class="input-text" type="text" placeholder="想去哪裡? 輸入景點..." v-model="inputText">
      <img class="img-search" src="./icons/search.svg" alt="pic" @click="searchClick"/>
    </div>

    <!-- select panel -->
    <b-container class="select-panel-container" v-if="regionControl && (inputTextFocus || selectPanelHover)">
      <b-row class="select-panel" @mouseover="selectPanelHover = true"  @mouseleave="selectPanelHover = false" >

        <!-- type checkboxes -->
        <b-col class="col-left" md="3">
          <p style="font-size: 22px;">分類</p>
          <label class="containerCounty">全部
            <input type="checkbox" ref="refCheckAllTypes" checked name="type" @change="checkAllTypes">
            <span class="checkmark"></span>
          </label>
          <label :key="k" v-for="(v, k) in types" class="containerCounty">{{types[k].label}}
            <input type="checkbox" name="type" v-model="typesChecked" :value="types[k].id">
            <span class="checkmark"></span>
          </label>
        </b-col>

        <!-- region radios -->
        <b-col class="col-right" md="9">
          <p style="font-size: 22px;">地區</p>
          <label class="containerCounty" style="display: block;">全部
            <input type="radio" name="areas" v-model="countyChecked" :value="'全部'">
            <span class="checkmark"></span>
          </label>
          <label :key="k" v-for="(v, k) in areas" class="containerCounty">{{areas[k].label}}
            <input id="k" type="radio" name="areas" v-model="countyChecked" :value="v.label">
            <span class="checkmark"></span>
            <div class="regionCheckboxes" v-if="v.label === countyChecked">
              <label :key="ck" v-for="(cv, ck) in areas[k].children" class="containerRegion">{{cv.label}}
                <input type="checkbox" :value="cv.label" v-model="regionsChecked" name="areas">
                <span class="checkmarkRegion"></span>
              </label>
            </div>
          </label>
        </b-col>

      </b-row>
    </b-container>

    <!-- associative search -->
    <b-container class="container-ame-search" @mousemove="associativeHover = true" @mouseleave="associativeHover=false" v-if="associateControl && (inputTextFocus || associativeHover)">
      <b-row class="name-search" style="width: 70%;" >
        <b-col class="name-col p-0" cols="12" sm="12" md="12" lg="12">
            <div class="name-result" :key="k" v-for="(v, k) in searchResults">
              <p @click="searchResultClicked(v.name)" style="margin: 5px 20px;">{{v.name}}</p>
            </div>
            <!-- <p v-if="searchResults === []" style="font-size: 22px; margin: 0px; padding: 5px 20px;">沒有結果...</p> -->
        </b-col>
      </b-row>
    </b-container>

  </div>
</template>

<script>
  import {getTypes, getAreas, makeParams} from '../../utils/area.js'
  import {apiGetSpots} from '../../utils/api.js'

  export default {
    name: "HeaderSearch",
    components: {

    },
    data(){
      return {
        types: getTypes(),
        areas: getAreas(),
        searchResults: [],

        // input text
        inputText: '',
        inputTextFocus: false,

        // select panel
        regionControl: true,
        selectPanelHover: false,

        // associative search
        associateControl: false,
        associativeHover: false,

        // params to emit
        countyChecked: '全部',
        regionsChecked: [],
        typesChecked: ['gourmet', 'shopping', 'scenic spot', 'transportation', 'lodging', 'entertainment'],
      }
    },
    created() {
    },
    methods: {
      checkAllTypes(){
        if(this.$refs["refCheckAllTypes"].checked)
          for(var i = 0; i < 6; i++){
            this.typesChecked.push(this.types[i].id)
          }
        else this.typesChecked = [];
      },
      searchClick() {
        var county = null
        if (this.countyChecked !== '全部') county = this.countyChecked;
        this.$emit('header-search-btn-clicked', county, this.regionsChecked, this.typesChecked, this.inputText)
        this.$bus.$emit('typesChecked', {typesChecked: this.typesChecked});
      },
      searchResultClicked(name) {
        this.inputText = name;
        this.searchClick();
      },
      clearInputText() {
        this.inputText = '';
      }
    },
    watch: {
      countyChecked: function(newVal) {
        
        if (newVal){
          this.regionsChecked = [];
          var arr = []; 

          for(var i = 0; i < this.areas.length; i++){
            if(this.areas[i].label === newVal) arr = this.areas[i].children;
          }

          for(var j = 0; j < arr.length; j++ ){
            this.regionsChecked.push(arr[j].label)
          }
        } else if (newVal === '全部') {
          this.regionsChecked = [];
        }
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

        if( newVal === '' ) this.searchResults = null;
        if( newVal === '' ) this.associateControl = false;
        else this.associateControl = true;
      },
    }
  }
</script>

<style scoped>
  .wrap {
    width: 100%;
    height: 100%;

    padding-top: 0px;
    align-items: flex-start;
    position: relative;
    flex-direction: row;
    flex-wrap: wrap;
  }

  .img-search {
    width: 40px; 
    height: auto; 
    margin-left: 5px;
    margin-top: 0px;
    transition: all 0.2s ease-out;
  }

  .img-search:hover {
    transform: translateY(-6px);
  }

  .input-wrap {
    display: block;
    position: relative;
    width: 100%;
  }

  .input-text {
    outline: none;
    width: 85%; 
    height: 40px;
    font-size: 20px;
    border: none;
    border-radius: 20px;
    box-shadow: 0 3px 6px rgba(9, 20, 45, 33%);
    padding: 20px;
    position: relative;
  }
  .label-clear::after {
    font-family: 'Nunito', sans-serif;
    font-size: 20px;
    content: 'X';
    text-align: center;
    padding-top: 1px;
    position: absolute;
    left: 75%;
    top: 5px;
    width: 30px;
    height: 30px;
    border-radius: 15px;
    background-color: transparent;
    z-index: 2;
  }

  .label-clear:hover::after {
    background-color: rgba(187, 135, 126, 0.596);
    color: #FFF;
  }

  .select-panel-container {
    position: absolute;
    top: 45px;
    left: 0px;
    width: 700px;
  }

  .select-panel {
    width: 100%;
    height: auto;
    background-color: #FFF;
    border-radius: 6px;
    box-shadow: 0 3px 10px rgba(9, 20, 45, 0.658);
    border: 5px solid #FFF;
  }
  
  .col-left {
    background-color: #FFF;
    padding-top: 10px;
  }
  .col-right {
    padding-top: 10px;
    background-color: #FFF;
    padding-bottom: 20px;
    border-left: 1px solid rgba(23, 26, 39, 21%);
  }

  .container-ame-search {
    position: absolute;
    top: 45px;
    left: 0px;
    width: 700px;
  }

  .regionCheckboxes {
    position: relative;
    margin-bottom: 10px;
    border: 1px solid rgba(23, 26, 39, 11%);
    border-radius: 5px;
    padding: 10px;
  }

  .name-col {
    background-color: #FFF;
    border: 5px solid #FFF;
    border-radius: 10px;
    box-shadow: 0 3px 10px rgba(9, 20, 45, 0.658);    
  }

  .name-result {
    font-size: 20px;
    width: 100%;
    border-bottom: 1px solid rgba(23, 26, 39, 21%);
  }

  .name-result:hover {
    background-color: rgb(255, 78, 78);
    color: #FFF;
  }


  @media only screen and (max-width: 770px) {
    .img-search {
      width: 30px; 
      height: auto; 
      margin-left: 5px;
    }
    .input-wrap {
      width: 95%;
      margin-top: 10px;
      margin-left: 10px;
    }
    .input-text {
      width: calc(90% - 10px);
      height: 30px;
      border-radius: 15px;
    }

    .label-clear::after {
      left: calc(80% - 10px);
    }
    
    .select-panel-container {
      width: 100%;
      font-size: 16px;
      height: 80vh;
      overflow-y: scroll; 
    }

    .containerCounty {
      font-size: 16px;
    }
    .containerRegion {
      font-size: 16px;
    }
    .container-ame-search {
      width: 350px;
    }
  }
</style>
<style>
  
   /* The container */
  .containerCounty {
    display: inline-block;
    position: relative;
    padding-left: 30px;
    margin-right: 15px;
    cursor: pointer;
    font-size: 20px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  /* Hide the browser's default checkbox */
  .containerCounty input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }

  /* Create a custom checkbox */
  .checkmark {
    position: absolute;
    top: 5px;
    left: 0px;
    height: 23px;
    width: 23px;
    border-radius: 5px;
    background-color: #eee;
  }
  /* On mouse-over, add a grey background color */
  .containerCounty:hover input ~ .checkmark {
    background-color: #ccc;
  }

  /* When the checkbox is checked, add a blue background */
  .containerCounty input:checked ~ .checkmark {
    background-color: #2196F3;
  }

  /* Create the checkmark/indicator (hidden when not checked) */
  .checkmark:after {
    content: "";
    position: absolute;
    display: none;
  }

  /* Show the checkmark when checked */
  .containerCounty input:checked ~ .checkmark:after {
    display: block;
  }

  /* Style the checkmark/indicator */
  .containerCounty .checkmark:after {
    left: 8px;
    top: 5px;
    width: 8px;
    height: 12px;
    border: solid white;
    border-width: 0 3px 3px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
  }
  
   /* for region                              */
  .containerRegion {
    display: inline-block;
    position: relative;
    padding-left: 30px;
    margin-right: 15px;
    cursor: pointer;
    font-size: 20px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  /* Hide the browser's default checkbox */
  .containerRegion input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }

  /* Create a custom checkbox */
  .checkmarkRegion {
    position: absolute;
    top: 5px;
    left: 0px;
    height: 23px;
    width: 23px;
    border-radius: 5px;
    background-color: #eee;
  }
    /* On mouse-over, add a grey background color */
  .containerRegion:hover input ~ .checkmarkRegion {
    background-color: #ccc;
  }

  /* When the checkbox is checked, add a blue background */
  .containerRegion input:checked ~ .checkmarkRegion {
    background-color: #2196F3;
  }

  /* Create the checkmark/indicator (hidden when not checked) */
  .checkmarkRegion:after {
    content: "";
    position: absolute;
    display: none;
  }

  /* Show the checkmark when checked */
  .containerRegion input:checked ~ .checkmarkRegion:after {
    display: block;
  }

  /* Style the checkmark/indicator */
  .containerRegion .checkmarkRegion:after {
    left: 8px;
    top: 5px;
    width: 8px;
    height: 12px;
    border: solid white;
    border-width: 0 3px 3px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
  }
</style>



