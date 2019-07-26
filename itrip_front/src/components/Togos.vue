<template>
  <div class="MyTrip">
    <div class="py-3 px-2 info-container">
      <div class="tripName">
        <div style="width:100%;">
          旅行名稱
          <el-input class="iTripName" placeholder="我的旅行" v-model="tripName"></el-input>
        </div>
        <div>
        </div>
      </div>
      <div class="tripDate">
        <p class="px-0 mx-0 mb-0 pt-2 mr-1 pTripDate">開始日期</p>
        <el-date-picker
        class="ml-0 iDatePicker"
        v-model="tripDate"
        type="date"
        placeholder="選擇日期"
        style="width:150px;"/>
      </div>
      <div class="mt-2 mr-1 save-trip">
        <el-button @click="saveTrip"><i class="fas fa-save">   儲存</i></el-button>
        <el-button @click="saveTripAsPdf"><i class="fas fa-file-pdf"></i>   另存為PDF</el-button>
      </div>
    </div>
    <div class="tab-container">
      <b-tabs content-class="mt-3" @input="changePage()" v-model="currentPage" style="width: 100%;" :key="update + 'o'">
          <template slot="tabs">
              <b-nav-item @click.prevent="newTab" href="#"><i class="fas fa-plus"></i></b-nav-item>
          </template>
          <div class="trip-time">
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
          </div>
          <b-tab v-for="i in tabs" :key="'tab' + i">
            <template slot="title">
                {{ 'Day' + (i+1) }}<i v-if="i != 0" class="fas fa-times" @click="closeTab(i)"></i>
            </template>
          <virtual-list :size="170" :remain="4">
            <draggable v-model="togos_prop" ghost-class="ghost" @end="onEnd">
                <transition-group type="transition" name="flip-list" :key="update">
                  <div class="togoContainer sortable" :key="index" v-for="(togo,index) in togos_prop"  overflow:auto>
                    <div class="pl-3 big-container">
                      <div class="trip-time-container">
                        <p class="my-0 startTime">{{getStartTime(index)}}</p>
                        <div class="circleNum"><b>{{index + 1}}</b></div>
                        <p class="my-0 endTime">{{getEndTime(index)}}</p>
                      </div>
                      <TogoItem :togo="togo"
                      @updateStopTime="updateStopTime"
                      @deleteTogo="$emit('deleteTogo', index)"
                      @getNearby="getNearby"/>
                    </div>
                    <TravelTimeItem v-if="isTravelTimeShown(index)" v-bind="$attrs" v-on="$listeners" :index="index" :travelTime="travelInfos[index].duration"
                      />
                  </div>
                </transition-group>
            </draggable> 
          </virtual-list>
        </b-tab>    
      </b-tabs>
    </div>
  </div>
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
        travelInfos: Array,
        tabCounter: 0,
        tabs: [0],
        currentPage: 0,
        tripName: '我的旅行',
        tripDate: new Date(),
        togos_prop: this.togos,
        startTime: '08:00',
        editMode: true,
        startTimeOb: {
          hr: 8,
          min: 0
        },
        isScrollbarShown: false,
        update: 0,
        viewMapString: '檢視地圖',
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
      dayNum: Number,
      itinerary: Object,
    },
    methods: {
      saveTrip() {
        if (this.$store.state.isAuthorized == false){
          // this.$message("請先登入");
          alert("請先登入");
          this.$store.dispatch("updateFormState", {
            isLogIn: true,
            isSignUp: false,
            isFbSignUp: false
          });
        }else{
          if (this.tripDate.date == ""){
            // 預設今天日期
            let date = new Date();
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate();
            this.tripDate = year + "-" + month + "-" + day;
          }else {
            let year = this.tripDate.getFullYear();
            let month = this.tripDate.getMonth() + 1;
            let day = this.tripDate.getDate();
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
        if(this.travelInfos == undefined || this.travelInfos.length == 0 || index >= this.travelInfos.length) {
          return false;
        }
        if(index < (this.togos.length-1) && this.travelInfos[index] != undefined) {
          return true;
        }
        return false;
      },
      onEnd: function(evt) {
        this.oldIndex = evt.oldIndex;
        this.newIndex = evt.newIndex;
        this.$emit('togos-changeOrder', this.togos_prop, this.oldIndex, this.newIndex);
      },
      newTab: function() {
        this.tabs.push(this.tabCounter++);
        this.$emit('add-new-day');
      },
      getStartTime: function(index) {
        if(index == 0) {
          return this.startTime;
        }
        let hr = this.startTimeOb.hr;
        let min = this.startTimeOb.min;

        for(let i=0;i<index;i++) {
          if(this.travelInfos[i] === undefined) continue;
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
        if(hr + this.togos[index].stopTime.hrs >= 24) {
          this.togos[index].stopTime.hrs = 1
          this.updateStopTime();
          this.$message.error('時間超出本日範圍!');
          throw 'DAY LIMIT EXCEEDED';
        }
        hr += this.togos[index].stopTime.hrs;
        
        return hr.toString().padStart(2, '0') + ':' + min.toString().padStart(2, 0);
      },
      closeTab: function(x) {
        for (let i = 0; i < this.tabs.length; i++) {
          if (x > 0 && this.tabs[i] === x) {
            this.tabs.splice(i, 1)
            this.tabCounter--;
          }
        }
        for(let i=1;i<this.tabCounter;i++) {
          if(this.tabs[i] != i) {
            this.tabs[i] = i;
          }
        }
        this.$emit('remove-day', x)
      },
      getNearby: function(togo, page) {
        this.$emit('getNearby', togo, null);
      },
      updateStopTime: function() {
        this.update++;
      },
      saveTripAsPdf: function() {
        this.$bus.$emit('save-trip');
      },
      clickViewMap() {
        this.$emit('click-view-map');
        if(this.viewMapString === '關閉地圖') this.viewMapString = '檢視地圖';
        else {
          this.viewMapString = '關閉地圖';
        }
      },
      updatePage: function(){
        this.update++;
      },
      updateTabs: async function(){
        let self = this;
        if (self.itinerary != undefined){
          await this.$nextTick(function() {
            if (self.itinerary.togos != undefined){
              for (let i = 0; i < self.itinerary.togos.length - 1; i++){
                self.newTab();
              };
              self.tripName = self.itinerary.name;
              self.tripDate = new Date(self.itinerary.startDate.year, self.itinerary.startDate.month - 1, self.itinerary.startDate.day);
            }
          });
        }
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
        this.$emit("changeBaseTimes", this.startTimeOb, this.currentPage);
      },
      togos: function() {
        this.togos_prop = this.togos;
      },
      startTime: function() {
        let tmp = this.startTime.split(':');
        this.startTimeOb.hr = parseInt(tmp[0]);
        this.startTimeOb.min = parseInt(tmp[1]);
        this.$emit("changeBaseTimes", this.startTimeOb, this.currentPage);
      },
    },
    created() {
      this.$emit("changeBaseTimes", this.startTimeOb, this.currentPage);
    },
    beforeMount() {
      for(let i = 1; i < this.dayNum; i++) {
        this.tabs.push(i);
      }
      this.currentPage = this.page;
      this.tabCounter = this.dayNum;
    },
    mounted() {
      this.updateTabs();
    },
}
</script>

<style lang="scss" scoped>
  .MyTrip {
    display: flex;
    flex-direction: column; 
    border: none;
    background: rgb(250,250,250);
    color:black;
    height:100%;
    width: 100%;
    border-left: 2px solid rgb(230, 230, 230);
  }
  .MyTrip .sortable-drag {
    opacity: 0;
  }
  .save-trip {
    text-align: right;
  }
  .info-container {
    border-bottom: 2px solid rgb(243, 243, 243);
  }
  .sortable {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .el-card {
    width: 100%;
  }
  .tripName {
    margin-right: 11px;
    margin-left: 11px;
    margin-top: 4px;
    display: flex;
    flex-direction: row;
    font-size: 16px;
    justify-content: space-between;
  }
  .tripDate {
    margin-left: 11px;
    margin-top: 4px;
    display: flex;
    flex-direction: row;
    font-size: 16px;
    justify-content: flex-start;
  }
  .iTripName {
    width:150px;
    text-align: center;
  }
  .trip-time-container {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    margin-left: 8px;
  }
  .trip-time {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }
  .big-container {
    display: flex;
    flex-direction: row;
    align-self: center;
    width: auto;
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
    width: 30px;
    height: 30px;
    padding: 1px;
    background: #fff;
    border: 2px solid #666;
    color: #666;
    text-align: center;
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
  .startTime {
    font-size: 12px;
  }
  .endTime {
    font-size: 12px;
  }
  b-tabs {
    color: #f2f2f2;
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
  .flip-list-move {
    transition: transform 0.5s;
  }
  .big-container {
    display: flex;
    flex-direction: row;
  }
  .view-map {
    height: 40px;
    align-self: center;
    margin-right: 10px;
  }
  .fa-map-marked-alt {
    font-size: 20px;
    cursor: pointer;
  }

  @media only screen and (max-width: 768px) {
    .MyTrip {
      width: 100%;
    }
  }
</style>