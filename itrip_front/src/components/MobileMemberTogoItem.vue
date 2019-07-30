<template>
  <div class="px-2 py-2 togo-item">
    <el-card :body-style="{ padding: '0px' }" shadow="hover"> 
      <div class="card-container">
        <div class="picture-container">
          <vue-load-image>
            <img ref="image" class="spot-picture" slot="image" :src="srcFunc">
            <img class="px-2 py-2 preloader" slot="preloader" src="../assets/image-loader.gif"/>
            <div slot="error"><img class="px-2 py-2 picNotFound" src="../assets/picNotFound.jpg"></div>
          </vue-load-image>
        </div>
        <div class="info-col">
          <div class="name-container" style="text-align:left;"><b>{{togo.name}}</b></div>
          <div style="text-align:left; margin-right: 5px; word-break: break-all;">{{ getAddress()}}</div>
          <div style="text-align:left; margin-right: 5px; word-break: break-all;">{{ stayTimeFormat(togo.startTime, togo.endTime)}}</div>
        </div>
      </div>
    </el-card> 
  </div>
</template>

<script>
import Vue from 'vue'
import {getAddress} from '../../utils/checker.js'
import VNumberSmarty from 'vue-number-smarty'
import moment from 'moment'
import VueLoadImage from 'vue-load-image'

export default {
    name: "MobileMemberTogoItem",
    components: {
        VNumberSmarty,
        'vue-load-image': VueLoadImage
    },
    props: {
        togo: Object,
    },
    data() {
        return {
            hrs: this.togo.stopTime.hrs,
            mins: this.togo.stopTime.mins,
            editMode: true,
            stopTime:''
        }
    },
  methods: {
    startTimeFormat: function(startTime){
      if (startTime.min.toString().length == 1){
        return startTime.hr + "：0" + startTime.min;
      }
      return startTime.hr + "：" + startTime.min;
    },
    stayTimeFormat: function(startTime, endTime){
      return String(this.startTimeFormat(startTime) + " ~ " + this.startTimeFormat(endTime));
    },
    getAddress() {
      return getAddress(this.togo.address);
    },
    onChange(time, timeString){
      this.hrs = parseInt(timeString.split(':')[0]);
      this.mins = parseInt(timeString.split(':')[1]);
      this.togo.stopTime.hrs = this.hrs;
      this.togo.stopTime.mins = this.mins;
      this.$emit('updateStopTime');
    },
    showMemo() {
      return this.togo.memo;
    },
  },
    computed: {
        srcFunc: function() {
            let src;
            if(!Object.keys(this.togo).includes('images') || this.togo.images.length == 0) {
                src = this.notFound
            }
            else {
                src = this.togo.images[0]
            }
            return src  
        },
        stopTimeString: function() {
            let string = '';
            string = this.togo.stopTime.hrs.toString().padStart(2, '0') + ':' + this.togo.stopTime.mins.toString().padStart(2, 0);
            return string;
        },
        memo: function() {
            if(Object.keys(this.togo).includes('memo') && this.togo.memo.length > 0) {
                return this.togo.memo;
            }
            return null;
        },
        placeholder: function() {
            return '在『' + this.togo.name + '』一定要做的事';
        },
        stayTime: function(){
          return this.togo.startTime.hr + ":" + this.togo.startTime.min;
        }
    },
    created() {
      console.log("???", this.togo);
    },
}
</script>

<style scoped>
    .togo-item {
        width: auto;
        padding-top: 2px;
        color: #000000;
    }
    .el-card {
        border:none;
        box-shadow: 0 0 15px #d8cece;
    }
    .el-card:hover {
        box-shadow: none;
        border: 2px solid #ebb134;
        box-shadow: 0 0 5px #ebb134;
    }
    .card-container {
        height: 130px;
        width: 100%;
        display: flex;
        flex-direction: row;
    }
    .picture-container {
      height: 100%;
      width: 130px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .info-col {
      padding-bottom: 10px;
      width: auto;
      display: flex;
      flex-direction: column;
      padding-left: 5px;
      justify-content: center;
      /* overflow: hidden; */
    }
    .name-container {
        width: 95%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        overflow: hidden;
    }
    .iNumber-container {
        display: flex;
        flex-direction: row;
        width: 100%;
        padding-top: 5px;
        justify-content: space-between;
    }
    .row {
        display: flex;
        flex-direction: row;
        width: 100%;
        padding-top: 5px;
        padding-left: 10px;
        justify-content: space-between;
    }
    p {
        width:80%;
        overflow:hidden;
        white-space:nowrap;
        text-overflow:ellipsis;
        height:1.5em;
    }
    p:hover {
        overflow:visible;
    }
    .time-picker {
        width: 50%;
        margin-bottom: 5px;
    }
    .fa-times {
        color:darkgray;
        border: none;
        padding: 5px 9px;
        border-radius: 50%;
        cursor: pointer;
    }
    .fa-times:hover {
        color:dimgray;
    }
    .spot-picture {
        width: 120px;
        height: 120px;
        padding: 8px;
        margin-top: 4px;
        margin-left: 4px;
    }
    .p-name {
        font-size: 15px;
    }
    .address {
        margin:0px;
        font-size: 12px;
        margin-left: 3px;
    }
    .stopTime {
        font-size: 12px;
    }
    .fa-ellipsis-h {
        padding-right: 20px;
        margin-top: 20px;
        font-size: 12px;
        cursor: pointer;
    }
    .fa-comment-alt {
        cursor: pointer;
    }
    @media only screen and (max-width: 768px) {
    .picture-container {
        width: 100px;
    }
    .spot-picture{
        width: 100px;
        height: 90px;
    }
    p {
        width: 75%;
    }
    .p-name {
        font-size: 15px;
    }
    .fa-times {
        padding: 0px;
        padding-right: 5px;
    }
    .address {
        font-size:10px;
    }
    .stopTime {
        font-size: 10px;
    }
  }

</style>
