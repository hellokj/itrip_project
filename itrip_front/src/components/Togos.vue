<template>
  <div class="MyTrip">
    <!-- <div style="position: fixed; right: 30vw; top: 0px; width: 400px; height: 200px; background-color: transparent; color:#AAA; z-index: 30; font-size: 30px;"><p>editMode: {{editMode}}</p><p>  isLockedProp: {{isLockedProp}}</p></div> -->
    <div v-if="lockIcon" style="position: absolute; background-color:rgb(250,250,250);right: 10px; top: 0px;"><div class="lds-facebook"><div></div><div></div><div></div></div></div>
    <div v-if="!isLocked" style="position: absolute; background-color:rgb(250,250,250);right: 10px; top: 0px;"><div style="position: absolute; right: 30px; top: 0px; width: 50px; color: lightblue;">編輯中</div><div class="lds-circle"><div></div></div></div>
    
    <div class="py-2 m-0 info-container">
      <div class="tripName">
        <div style="width:100%;">
          名稱
          <el-input class="iTripName" placeholder="我的旅行" v-model="tripName" @change="$emit('changeName', tripName)"></el-input>
        </div>
      </div>
      <div class="tripDate" style="display:flex;justify-content:space-between;">
        <div class="ml-0 row">
          <p class="px-0 mx-0 mb-0 mr-1 pTripDate" style="line-height:35px;">日期</p>
          <el-date-picker
          class="ml-0 iDatePicker"
          v-model="tripDate"
          @change="$emit('changeDate', tripDate)"
          type="date"
          placeholder="選擇日期"
          style="width:150px;"/>  
        </div>
        <div class="mt-2 mr-1 save-trip">
          <i title="匯出成PDF" id="pdf" class="fas fa-file-pdf" @click="saveTripAsPdf" style="color:#8a8d91;font-size:25px;cursor: pointer;"></i>
          <AddMemberPopover id="pc-addMember-popover" v-model="memberEmail" :memberEmails="memberEmails" :lockIcon="lockIcon"
          @getCurrentMembers="getCurrentMembers" @addMember="addMember" @removeMember="removeMember"/>
          <SharingLink id="pc-sharingLink" :shareUrl="shareUrl" :shareId="shareIdProp" @saveShare="saveShare"/>
          <i id="pc-navi" title="開啟導航" class="fas fa-map-marked-alt" style="color:#8a8d91;font-size:25px;cursor: pointer;" @click="navigate"></i>
        </div>
        <el-dropdown ref="dropdown" placement="bottom-start" trigger="click">
          <span>
            <i title="功能列" class="pr-2 fas fa-ellipsis-h" style="font-size:25px;color:#8a8d91;cursor: pointer;"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item >
            </el-dropdown-item>
            <el-dropdown-item >
              <i title="匯出成PDF" class="fas fa-file-pdf" @click="saveTripAsPdf" style="color:#8a8d91;font-size:15px;cursor:pointer;"> 匯出成PDF</i>
            </el-dropdown-item>
            <el-dropdown-item >
              <div class="pl-3 row">
                <AddMemberPopover id="mobile-addMember-popover" v-model="memberEmail" :memberEmails="memberEmails"
                @getCurrentMembers="getCurrentMembers" @addMember="addMember" @removeMember="removeMember"/>加入旅伴 
              </div>
            </el-dropdown-item>
            <el-dropdown-item>
              <div class="pl-3 row">
                <SharingLink id="mobile-sharingLink" @saveShare="saveShare" :shareUrl="shareUrl" :shareId="shareId"/>儲存及分享
              </div>
            </el-dropdown-item>
            <el-dropdown-item>
              <i id="mobile-navi" title="開啟導航" class="fas fa-map-marked-alt" style="color:#8a8d91;font-size:15px;cursor: pointer;" @click="navigate"> 開啟導航</i>
            </el-dropdown-item>
          </el-dropdown-menu>         
        </el-dropdown>
      </div>
    </div>
    <div class="tab-container" style="height: 75vh;">
      <b-tabs content-class="mt-3" @input="changePage()" v-model="currentPage" style="width: 100%;" :key="update + 'o'">
          <template slot="tabs">
              <b-nav-item @click.prevent="newTab" href="#"><i class="fas fa-plus"></i></b-nav-item>
          </template>
          <div class="trip-time">
            <p class="mb-0 pt-1">出發時間:</p>
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
          <b-tab v-for="i in tabs" :key="'tab' + i" style="heigh: 55vh; overflow-Y: scroll;">
            <template slot="title">
                {{ 'Day ' + (i+1) }}<i v-if="i != 0" class="fas fa-times" @click="closeTab(i)"></i>
            </template>
            <div style="height: 65vh;">
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
                      @getNearby="getNearby"
                      @mouseOver="$emit('hoverItem', 'togos', index)"/>
                    </div>
                    <TravelTimeItem v-if="isTravelTimeShown(index)" v-bind="$attrs" v-on="$listeners" :index="index" :travelTime="travelInfos[index].duration"/>
                  </div>
                </transition-group>
            </draggable> 
          </div>
        </b-tab>    
      </b-tabs>
    </div>
  </div>
</template>

<script>
import TogoItem from './TogoItem'
import TravelTimeItem from './TravelTimeItem'
import virtualList from 'vue-virtual-scroll-list'
import draggable from 'vuedraggable'
import { async, resolve } from 'q'
import { Message } from 'element-ui'
import { apiFindMemberByMail, apiRemoveMember, apiSaveTrip } from '../../utils/api.js'
import { getUrl } from '../../utils/navigation.js'
import AddMemberPopover from './AddMemberPopover'
import SharingLink from './SharingLink'

export default {
    name: "Togos",
    data() {
      return {
        tabtitle: '',
        oldIndex: '',
        newIndex: '',
        travelInfos: Array,
        tabs: [0],
        currentPage: 0,
        tripName: '我的旅行',
        tripDate: new Date(),
        togos_prop: this.togos,
        startTime: '08:00',
        // editMode: true,
        startTimeOb: {
          hr: 8,
          min: 0
        },
        isScrollbarShown: false,
        update: 0,
        viewMapString: '檢視地圖',
        itineraryLoaded: false,
        shareUrl: 'http://localhost:8080/#/trip?viewId=',
        memberEmail: '',
        memberEmails: [],
        newMemberId: '',
        shareIdProp: undefined,
        editMode: false,
        message: null,
        googleMapUrl: '',
        newWin: null 
      }
    },
    components: {
        TogoItem,
        TravelTimeItem,
        draggable,
        'virtual-list': virtualList,
        AddMemberPopover,
        SharingLink,
    },
    props: {
      togos: Array,
      travelInfo: Array,
      page: Number,
      dayNum: Number,
      shareId: String,
      currentAccessId: String,
      isLockedProp: Boolean,
      isLocked: Boolean,
      itinerary: Object
    },
    computed: {
      lockIcon() {
        return this.isLocked || this.itinerary.memberIds === undefined || this.itinerary.memberIds.length === 0;
      }
    },
    methods: {
      saveShare: function() {
        if(this.shareId === undefined && this.shareIdProp === undefined) {
          //console.log(this.shareIdProp)
          let self = this;
          this.getDate();
          this.$emit('saveShare', this.tripName, this.tripDate);
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
        this.$emit('add-new-day');
      },
      addMember: function() {
        if (this.$store.state.isAuthorized == false){
           Message({
            type: 'warning',
            message: '請先登入!'
          });
          this.$store.dispatch("updateFormState", {
            isLogIn: true,
            isSignUp: false,
            isFbSignUp: false
          });
          return;
        }
        if(!this.memberEmails.includes(this.memberEmail)) {
          let self = this;
          // check if this member exists
          apiFindMemberByMail(this.memberEmail,this.$store.state.userToken)
          .then(function(res) {
            //console.log(res)
            if(res.data.data != null) {
              self.memberEmail = res.data.data._id;
              self.memberEmails.push(self.memberEmail);
              self.$emit('addMember', self.memberEmail);
            }
            else {
              this.$message.warning('找不到該旅伴的資料，確定Email沒有打錯嗎?')
            }
          });
        }
        else {
          this.$message.warning('該旅伴已在列表中!')
        }
        this.memberEmail = '';
      },
      removeMember: async function(index) {
        let mailToRemove = this.memberEmails[index];
        this.$emit('removeMember', mailToRemove);
        this.memberEmails.splice(index, 1);
      },
      getStartTime: function(index) {
        // if(index == 0) {
        //   return this.startTime;
        // }
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
        if(hr >= 24) {
          this.togos.pop();
          this.travelInfos.pop();
          this.$message.error('時間超出本日範圍!');
          //throw 'DAY LIMIT EXCEEDED';
        }
        if(this.togos[index].startTime === undefined) {
          this.togos[index].startTime = {};
        }
        this.togos[index].startTime.hr = hr;
        this.togos[index].startTime.min = min;
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
        if(this.togos[index].endTime === undefined) {
          this.togos[index].endTime = {};
        }
        this.togos[index].endTime.hr = hr;
        this.togos[index].endTime.min = min;
        
        return hr.toString().padStart(2, '0') + ':' + min.toString().padStart(2, 0);
      },
      closeTab: function(x) {
        this.tabs.splice(x, 1);
        for(let i=0;i<this.tabs.length;i++) {
          if(i != this.tabs[i]) {
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
        this.$bus.$emit('download', {tripName: this.tripName, tripDate: this.tripDate});
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
      getCurrentMembers: function() {
        //console.log(this.itinerary);
        let self = this;
        this.memberEmails = []
        //console.log(this.itinerary)
        //console.log(this.currentAccessId)
        let memberIds = this.itinerary.memberIds;
        //console.log(self.$store.state.user);
        //console.log(this.itinerary)
        memberIds.forEach((element) => {
          if(element != self.$store.state.user.id) {
            //console.log(JSON.parse(self.$store.state.user.id))
            self.memberEmails.push(element)
          }
        });
      },
      getDate() {
        if (this.tripDate.date == ""){
          // 預設今天日期
          let date = new Date();
          let year = date.getFullYear();
          let month = date.getMonth() + 1;
          let day = date.getDate();
          this.tripDate = year + "-" + month + "-" + day;
        }else {
          let date = new Date(Date.parse(this.tripDate));
          let year = date.getFullYear();
          let month = date.getMonth() + 1;
          let day = date.getDate();
          this.tripDate = year + "-" + month + "-" + day;
        }
      },
      stringifyStartDate(ob) {
        return ob.year + '-' + ob.month + '-' + ob.day;
      },
      navigate() {
        this.newWin = window.open();
        this.googleMapUrl = getUrl(this.togos_prop);
      }
    },
    watch: {
      travelInfo: {
        handler: function() {
          this.travelInfos = this.travelInfo;
        },
        immediate: true,
      },
      itinerary: {
        handler: function(newVal, oldVal) {
          //console.log(newVal);
          for(let i=this.tabs.length;i<newVal.dayNum;i++) {
            this.tabs.push(i);
          }
          //console.log(this.tabs)
          // get name and date from itinerary
          this.tripName = newVal.name;
          //console.log(newVal)
          this.tripDate = this.stringifyStartDate(newVal.startDate);
          // console.log(this.itinerary)
        },
        deep: true
      },
      page: function(){
        this.currentPage = this.page;
      },
      togos: function() {
        this.togos_prop = this.togos;
      },
      startTime: function() {
        let tmp = this.startTime.split(':');
        this.startTimeOb.hr = parseInt(tmp[0]);
        this.startTimeOb.min = parseInt(tmp[1]);
      },
      shareId: function(newVal, oldVal) {
        if(oldVal == undefined) {
          this.shareUrl += newVal;
          this.shareIdProp = newVal;
        }
      },
      isLocked: function(newVal, oldVal) {
        if(newVal) {
          this.message = Message({
            duration: 0,
            showClose: true,
            message: '此行程正在編輯中...，請稍後',
            type: 'warning'
          });
        }
        else {
          this.message.close()
          this.message = Message({
            duration: 3,
            showClose: true,
            message: '行程可編輯!',
            type: 'success'
          });
          
        }
      },
      editMode: function(newVal){
        if(newVal){
          this.$emit('edit-on')
        }
      },
      isLockedProp: function(newVal){
        if(newVal) this.isLocked = true;
        else this.isLocked = false;
      },
      googleMapUrl: function(newVal, oldVal) {
        if(newVal && this.newWin) {
          this.newWin.location.href = newVal;
          this.googleMapUrl = '';
          this.newWin = null;
        }
      }
    },
    created() {
      let self = this;
      //console.log("itinerary", this.itinerary);
      // 註冊監聽事件
      // get name and date from itinerary
    },
    beforeMount() {
      for(let i = 1; i < this.dayNum; i++) {
        this.tabs.push(i);
      }
      this.currentPage = this.page;
    },
    mounted() {
      let self = this;
      if(this.isLocked) {
        this.message = Message({
          showClose: true,
          duration: 0,
          message: '此行程正在編輯中...，請稍後!',
          type: 'warning'
        });
      }
      // listen to locked notification
      this.$socket.on('notifyLocked', () => {
        self.isLocked = true;
      });
    },
    beforeDestroy() {
      if(this.message != null) {
        console.log('!')
        this.message.close();
      }
    }

}
</script>

<style lang="scss" scoped>
  .MyTrip {
    position: relative;
    display: flex;
    flex-direction: column; 
    background: rgb(250,250,250);
    color:black;
    height:90vh;
    width: 100%;
    // border-left: 2px solid rgb(230, 230, 230);
    // border-width: 3px;
    // border-style: solid;
    // border-image: linear-gradient( to bottom, rgb(255, 255, 255), rgb(206, 206, 206), rgb(222, 222, 222), rgb(235, 235, 235)) 1 100%;
    // border-right: none;
  }
  .MyTrip .sortable-drag {
    opacity: 0;
  }
  .save-trip {
    width: 50%;
    display: flex;
    justify-content: space-around;
  }
  .info-container {
    height: 15vh;
    border-bottom: 3px solid rgb(243, 243, 243);
    z-index: 3;
    border-top: 3px solid transparent;
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
    cursor: pointer;
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
  .tab-container{
    height: 500px;
  }
  .fa-ellipsis-h {
    display: none;
  }
  #mobile-addMember-popover {
    display: none;
  }
  #mobile-sharingLink {
    display: none;
  }
  #mobile-nav {
    display: none;
  }
  .togoContainer {
    display: flex;
    flex-wrap: nowrap;
    justify-content:flex-start;
    align-items: center;
    margin: 0px;
  }

  @media only screen and (max-width: 768px) {
    .MyTrip {
      width: 100%;
    }
  }
 @media only screen and (max-width: 1200px) {
    #save {
      display: none;
    } 
    #pdf {
      display: none;
    }
    #mobile-sharingLink {
    display: block;
  }
    #mobile-addMember-popover {
      display: block;
    }
    #pc-addMember-popover {
      display: none;
    }
    #pc-sharingLink {
      display: none;
    }
    .fa-ellipsis-h {
      display: block
    }
    #pc-navi {
      display: none;
    }
    #mobile-nav {
      display: block;
    }
    .save-trip {
      width: 10%;
    }

  }
</style>

// 編輯模式下的style
<style scoped>
.Mytrip {
  border: 4px solid tomato;
}
</style>

// 被lock住的style
<style scoped>

</style>
// editing animation
<style scoped>
.lds-facebook {
  display: inline-block;
  position: relative;
  width: 64px;
  height: 64px;
}
.lds-facebook div {
  display: inline-block;
  position: absolute;
  left: 6px;
  width: 13px;
  background: lightgray;
  animation: lds-facebook 1.2s cubic-bezier(0, 0.5, 0.5, 1) infinite;
}
.lds-facebook div:nth-child(1) {
  left: 6px;
  animation-delay: -0.24s;
}
.lds-facebook div:nth-child(2) {
  left: 26px;
  animation-delay: -0.12s;
}
.lds-facebook div:nth-child(3) {
  left: 45px;
  animation-delay: 0;
}
@keyframes lds-facebook {
  0% {
    top: 6px;
    height: 51px;
  }
  50%, 100% {
    top: 19px;
    height: 26px;
  }
}
</style>


// editing animation
<style scoped>


  .lds-circle {
    display: inline-block;
    position: absolute;
    right: 0px;
    top: 0px;
    transform: translateZ(1px);
  }
  .lds-circle > div {
    display: inline-block;
    width: 25px;
    height: 25px;
    margin: 0px;
    border-radius: 50%;
    background: lightblue;
    animation: lds-circle 2.4s cubic-bezier(0, 0.2, 0.8, 1) infinite;
  }
  @keyframes lds-circle {
    0%, 100% {
      animation-timing-function: cubic-bezier(0.5, 0, 1, 0.5);
    }
    0% {
      transform: rotateY(0deg);
    }
    50% {
      transform: rotateY(1800deg);
      animation-timing-function: cubic-bezier(0, 0.5, 0.5, 1);
    }
    100% {
      transform: rotateY(3600deg);
    }
  }

</style>



