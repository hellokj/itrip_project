<template>
  <div class="MyTrip">
    <div class="tripData  mx-0 my-0 px-0 py-0">
      <div class="tripName">
        <p class="pTripName  mx-2 my-2 px-0 py-0">旅行名稱</p>
        <!-- <input type="text" v-model="tripName" :placeholder="'我的旅行'"> -->
        <el-input class="iTripName" placeholder="我的旅行" v-model="tripName"></el-input>
      </div>
      <div class="tripDate">
        <p class="pTripDate  mx-2 my-2 px-0 py-0" >開始日期</p>
        <!-- <input type="date" v-model="tripDate"> -->
        <el-date-picker
          class="iDatePicker"
          v-model="tripDate"
          type="date"
          placeholder="選擇日期"
          style="width:200px;">
        </el-date-picker>
      </div>
      
    </div>
    <b-container class="save-div" fluid>
      <el-button><i class="fas fa-save" @click="saveTrip"> 儲存行程</i></el-button> 
    </b-container> 
    <div>
      <b-tabs content-class="mt-3" @input="changePage()" v-model="currentPage">
        <b-container>
          <b-row class="mx-0 my-0 px-0 py-0"> 
            <b-col cols="5" class="ml-5 mb-2 pl-2 pt-1">
              <p class="ml-0 my-0 px-0 py-0" style="text-align:right;width:200px;">出發時間:</p>
            </b-col>
            <b-col cols="1" class="ml-5 mb-2 pl-2 py-0">
              <el-time-select
              v-model="startTime"
              :picker-options="{
                start: '00:00',
                step: '00:15',
                end: '23:45'
              }"
              :align="'center'"
              :size="'small'"
              placeholder="請輸入時間"
              style="width: 130px;">
              </el-time-select>
            </b-col>
          </b-row>
        </b-container>
        <b-tab v-for="i in tabs" :key="'tab' + i" :title="'Day' + (i+1)">
          <draggable v-model="togos_prop" ghost-class="ghost" @end="onEnd">
            <transition-group type="transition" name="flip-list">
              <div class="togoContainer sortable" :key="index" v-for="(togo,index) in togos_prop" overflow:auto>
                <!-- TogoItem -->
                <b-row class="mx-0 my-0 px-0 py-0">
                  <b-col cols="1" class="mx-2 my-0 px-0 py-0">
                    <div class="startTime">{{getStartTime(index)}}</div>
                    <div class="mx-0 my-0 pt-4 py-0 order">
                      <div class="circleNum"><b>{{index + 1}}</b></div>
                    </div>
                    <div class="mx-0 my-0 pt-5 py-0 endTime">{{getEndTime(index)}}</div>
                  </b-col>
                  <b-col cols="9" class="ml-0 my-0 px-0 py-0">
                    <TogoItem class="mx-0 my-0" :togo="togo" @deleteTogo="$emit('deleteTogo', index)"/>
                  </b-col>
                </b-row>
                <!-- Travel time -->
                <b-row class="ml-0 my-0 px-0 py-0">
                  <b-col cols="1" class="ml-0 my-0 px-0 py-0">
                    <div v-if="isTravelTimeShown(index)" class="ml-3 mb-0 px-1 pb-0 lineContainer">
                      <hr class="mt-0 mb-0 ml-2 px-0 pb-0 vertical"/>
                    </div>
                  </b-col>
                  <b-col class="ml-0 my-0 px-0 py-0">
                    <TravelTimeItem v-bind="$attrs" v-on="$listeners" :index="index" class="ml-0 pt-1 px-0 py-0" v-if="isTravelTimeShown(index)" :travelTime="travelInfos[index].duration"/>
                  </b-col>
                </b-row>
              </div>
            </transition-group>
          </draggable>
        </b-tab>
        <template slot="tabs">
          <b-nav-item @click.prevent="newTab" href="#"><i class="fas fa-plus"></i></b-nav-item>
        </template>
      </b-tabs>
    </div>
  </div>
</template>

<script>
import TogoItem from './TogoItem';
import TravelTimeItem from './TravelTimeItem';
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
        }
      }
    },
    components: {
        TogoItem,
        TravelTimeItem,
        draggable,
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
      }
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
      }
    },
}
</script>

<style lang="scss" scoped>
  .save-div {
    text-align: right;
  }

  .el-time-picker {
    margin-bottom: 5px;
  }
  .order {
    margin: 10px;
  }
  .order div{
    font-size: 20px;
    margin: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-right: -50%;
    transform: translate(-50%, -50%)
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

  .MyTrip {
    margin: 0px;
    padding: 0px;
    width: 600px;
    border: none;
    /* background: #F1F0F0; */
    background: #F1F0F0;
    color: #515151;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
  }

  .tripData {
    background: #F1F0F0;
  }

  .tripName, .tripDate {
    margin-left: 11px;
    margin-top: 4px;
    display: flex;
    flex-direction: row;
    font-size: 16px;
  }
  .iTripName {
     width:200px;
     text-align: center;
  }

  b-tabs {
    color: #707070;
    font-size: 20px;
    border: none;
    background: #333555;
  }

  .fa-save {
    border:darkgray;
    color:darkred;
    cursor: pointer;
    font-size: 15px;
  }

  .MyTrip .sortable-drag {
    opacity: 0;
  }


  .flip-list-move {
    transition: transform 0.5s;
  }
  
  .ghost {
    border-left: 6px solid rgb(0, 183, 255);
    box-shadow: 10px 10px 5px -1px rgba(0,0,0,0.14);
    opacity: .7;

    &::before {
      content: " ";
      position: absolute;
      width: 20px;
      height: 20px;
      margin-left: -50px;
      // background-image: url('../assets/drag.svg')
    }
  }

  .lineContainer {
    width: 2px;
    height: 40px;
  }

  hr.vertical {
    width: 2px;
    height: 50px; /* or height in PX */
    background:dimgray;
    border: none;
  }

  // @media only screen and (max-width: 780px) {
  //   .MyTrip {
  //     display: none;
  //   }
  // }
</style>