<template>
  <b-container class="text-center MyTrip" style="height:100%;" fluid>
      <b-row class="px-0">
        <p class="px-0 mx-0 mb-0 pt-2 ml-1 mr-2 TripName">旅行名稱</p>
        <b-col cols="4" offset-xs="3" sm="4" md="4" lg="7" xl="7"><el-input class="iTripName" placeholder="我的旅行" v-model="tripName"></el-input></b-col>
      </b-row>
      <b-row>
        <p class="px-0 mx-0 mb-0 pt-2 ml-1 mr-2 pTripDate">開始日期</p>
        <b-col  cols="3" sm="3" md="3" lg="4" xl="6">
          <el-date-picker
          class="ml-0 iDatePicker"
          v-model="tripDate"
          type="date"
          placeholder="選擇日期"
          style="width:200px;"/>
        </b-col>
      </b-row>
      <b-row align-h="end" class="mr-1">
        <el-button><i class="fas fa-save" @click="saveTrip">  儲存</i></el-button>
      </b-row>
      <b-row>
        <b-tabs content-class="mt-3" @input="changePage()" v-model="currentPage" style="width: 100%;">
          <template slot="tabs">
              <b-nav-item @click.prevent="newTab" href="#"><i class="fas fa-plus"></i></b-nav-item>
          </template>
          <b-row align-h="end">
            <p>出發時間:</p>
            <el-time-select
              class="ml-3 mr-4"
              v-model="startTime"
              :picker-options="{
                start: '00:00',
                step: '00:15',
                end: '23:45'
              }"
              :align="'center'"
              :size="'small'"
              placeholder="請輸入時間"
              style="width: 140px;"/>
          </b-row>
          <b-tab v-for="i in tabs" :key="'tab' + i">
            <template slot="title"> 
                {{ 'Day' + (i+1) }}<i class="fas fa-times" @click="closeTab(i)"></i>
            </template>
            
              <draggable v-model="togos_prop" ghost-class="ghost" @end="onEnd">
                 <virtual-list :size="150" :remain="4">
                  <transition-group type="transition" name="flip-list">
                      <b-container class="togoContainer sortable" :key="index" v-for="(togo,index) in togos_prop" overflow:auto>
                        <b-row>
                          <div class="px-0 tripTime" style="display:flex;flex-direction:column;justify-content:space-between;">
                            <p class="my-0 startTime">{{getStartTime(index)}}</p>
                            <div class="circleNum"><b>{{index + 1}}</b></div>
                            <p class="my-0 endTime">{{getEndTime(index)}}</p>
                          </div>
                          <b-col class="px-0">
                            <TogoItem :togo="togo" @deleteTogo="$emit('deleteTogo', index)"/>
                          </b-col>
                          
                        </b-row>
                        <b-row style="height: 100%;">
                          <TravelTimeItem v-bind="$attrs" v-on="$listeners" :index="index" :travelTime="travelInfos[index].duration"
                          v-if="isTravelTimeShown(index)"/>
                        </b-row>
                      </b-container>
                  </transition-group>
                </virtual-list>
              </draggable> 
          </b-tab>
        </b-tabs>
      </b-row>
  </b-container>
</template>

<script>
import TogoItem from './TogoItem';
import TravelTimeItem from './TravelTimeItem';
import virtualList from 'vue-virtual-scroll-list'
import draggable from 'vuedraggable'

export default {
    name: "Togos",
    data() {
      return {
        tabtitle: '',
        oldIndex: '',
        newIndex: '',
        travelInfos: this.travelInfo,
        tabCounter: 0,
        tabs: [0],
        currentPage: 0,
        tripName: '我的旅行',
        tripDate: {
          date: ""
        },
        togos_prop: this.togos,
        startTime: '08:00',
        editMode: true,
        startTimeOb: {
          hr: 8,
          min: 0
        },
        isScrollbarShown: false,
      }
    },
    components: {
        TogoItem,
        TravelTimeItem,
        draggable,
        'virtual-list': virtualList
    },
    props: {
      togos: Array,
      travelInfo: Array,
      page: Number,
    },
    methods: {
      saveTrip() {
        if (this.$store.state.isAuthorized == false){
          this.$modal.show('auth');
        }else{
          if (this.tripDate.date == ""){
            // 預設今天日期
            let date = new Date();
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate();
            this.tripDate = year + "-" + month + "-" + day;
          }
          this.$emit('saveTrip', this.tripName, this.tripDate);
        }
      },
      changePage(){
        this.$emit('change-page', this.currentPage);
        this.$emit('resetRoutes');
      },
      isTravelTimeShown(index) {
        if(index < (this.togos.length-1) && this.travelInfos[index] != undefined) {
          return true;
        }
        return false;
      },
      // child method
      deleteTogo(){
        this.$emit('deleteTogo');
      },
      onEnd: function(evt) {
        this.oldIndex = evt.oldIndex;
        this.newIndex = evt.newIndex;
        this.$emit('togos-changeOrder', this.togos_prop, this.oldIndex, this.newIndex);
      },
      newTab: function() {
        this.tabs.push(++this.tabCounter);
      },
      getStartTime: function(index) {
        if(index == 0) {
          return this.startTime;
        }
        let hr = this.startTimeOb.hr;
        let min = this.startTimeOb.min;

        for(let i=0;i<index;i++) {
          min += this.togos[i].stopTime.mins;
          if(i <= index - 1) {
            min += Math.floor(this.travelInfos[i].duration / 60);
          }
          if(min >= 60) {
            hr += Math.floor(min / 60);
            min %= 60;
          }
          hr += this.togos[i].stopTime.hrs;
        }
        return hr.toString().padStart(2, '0') + ':' + min.toString().padStart(2, 0)
      },
      getEndTime: function(index) {
        let tmp = this.getStartTime(index).split(':');
        let hr = parseInt(tmp[0]);
        let min = parseInt(tmp[1]);
        min += this.togos[index].stopTime.mins;
        if(min >= 60) {
            hr += Math.floor(min / 60);
            min %= 60;
        }
        hr += this.togos[index].stopTime.hrs;
        return hr.toString().padStart(2, '0') + ':' + min.toString().padStart(2, 0)
      },
       closeTab: function(x) {
        for (let i = 0; i < this.tabs.length; i++) {
          if (x > 0 && this.tabs[i] === x) {
            this.tabs.splice(i, 1)
            this.tabCounter--;
          }
        }
      },
    },
    watch: {
      travelInfo: {
        handler: function() {
          this.travelInfos = this.travelInfo;
        },
        immediate: true,
      },
      page: function(){
        this.currentPage = this.page;
      },
      togos: function() {
        this.togos_prop = this.togos;
        console.log(this.togos)
      },
      startTime: function() {
        let tmp = this.startTime.split(':')
        this.startTimeOb.hr = parseInt(tmp[0])
        this.startTimeOb.min = parseInt(tmp[1])
      },
     
    },
}
</script>

<style lang="scss" scoped>
  .MyTrip {
    border: none;
    /* background: #F1F0F0; */
    background: #F1F0F0;
    color: #515151;
  }
  .fa-times {
    padding-left: 20px;
    color: #DCDCDC;
  }
  .fa-times:hover { 
    color:#696969;
  }
  .circleNum {
    border-radius: 50%;
    width: 36px;
    height: 36px;
    padding: 2px;
    background: #fff;
    border: 2px solid #666;
    color: #666;
    text-align: center;
  }

  // .container {
  //   display: flex;
  //   flex-direction: column;
  // }
  // .save-div {
  //   text-align: right;
  // }

  // .el-time-picker {
  //   margin-bottom: 5px;
  // }

  // .travelTimeDiv {
  //   width: 100%;
  //   display: flex;
  //   flex-direction: row;
  //   justify-content: flex-start;
  // }

 

  // .tripData {
  //   background: #F1F0F0;
  // }

  // .tripName, .tripDate {
  //   margin-left: 11px;
  //   margin-top: 4px;
  //   display: flex;
  //   flex-direction: row;
  //   font-size: 16px;
  // }
  // .iTripName {
  //    width:200px;
  //    text-align: center;
  // }

  // b-tabs {
  //   color: #707070;
  //   font-size: 20px;
  //   border: none;
  //   background: #333555;
  // }

  // .fa-save {
  //   border:darkgray;
  //   color:darkred;
  //   cursor: pointer;
  //   font-size: 15px;
  // }
  // .sortable {
  //   width: 100%;
  //   display: flex;
  //   flex-direction: row;
  // }
  // .MyTrip .sortable-drag {
  //   opacity: 0;

  // }

  // .flip-list-move {
  //   transition: transform 0.5s;
  // }
  
  // .ghost {
  //   border-left: 6px solid rgb(0, 183, 255);
  //   box-shadow: 10px 10px 5px -1px rgba(0,0,0,0.14);
  //   opacity: .7;

  //   &::before {
  //     content: " ";
  //     position: absolute;
  //     width: 20px;
  //     height: 20px;
  //     margin-left: -50px;
  //     // background-image: url('../assets/drag.svg')
  //   }
  // }

  // .lineContainer {
  //   width: 2px;
  //   height: 40px;
  // }

  // hr.vertical {
  //   width: 2px;
  //   height: 50px; /* or height in PX */
  //   background:dimgray;
  //   border: none;
  //   margin: 0px;
  //   margin-left: 20px;
  //   margin-right: 30px;
  // }



  // .startTimePicker {
  //   display: flex;
  //   flex-direction: row;
  //   width: 100%;
  // }

  // .tripTime {
  //   display: flex;
  //   flex-direction: column;
  //   width: 10%;
  //   justify-content: space-evenly;
  // }

  // @media only screen and (max-width: 780px) {
  //   .container {
  //     padding: 0px;
  //   }
  // }
</style>