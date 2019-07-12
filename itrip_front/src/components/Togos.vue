<template>
  <div class="MyTrip">
    <div class="tripData  mx-0 my-0 px-0 py-0">
      <div class="tripName">
        <p class="pTripName  mx-0 my-0 px-0 py-0">旅行名稱</p>
        <input type="text" v-model="tripName" :placeholder="'我的旅行'">
      </div>
      <div class="tripDate">
        <p class="pTripDate  mx-0 my-0 px-0 py-0">開始日期</p>
        <input type="date" v-model="tripDate">
      </div>
      
    </div>
    <b-container class="save-div" fluid>
      <i class="fas fa-save" @click="saveTrip"> 儲存行程</i>  
    </b-container> 
    <div>
      <b-tabs content-class="mt-3" @input="changePage()" v-model="currentPage">
        <b-tab v-for="i in tabs" :key="'tab' + i" :title="'Day' + (i+1)">
          <draggable v-model="togos_prop" ghost-class="ghost" @end="onEnd">
            <transition-group type="transition" name="flip-list">
              <div class="togoContainer sortable" :key="index" v-for="(togo,index) in togos_prop" overflow:auto>
                <!-- TogoItem -->
                <TogoItem class="mx-0 my-0" :togo="togo" v-on:deleteTogo="$emit('deleteTogo', index)"/>
                <!-- Travel time -->
                <TravelTimeItem v-bind="$attrs" v-on="$listeners" :index="index" class="mx-0 my-0" v-if="isTravelTimeShown(index)" :travelTime="travelInfos[index].duration"/>
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
        tripName: '',
        tripDate: {
          date: ''
        },
        togos_prop: this.togos
      }
    },
    components: {
        TogoItem,
        TravelTimeItem,
        draggable
    },
    props: {
      togos: Array,
      travelInfo: Array,
      page: Number,
    },
    methods: {
      saveTrip() {
        this.$emit('saveTrip', this.tripName, this.tripDate);
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
      },
    },
}
</script>

<style lang="scss" scoped>
  .save-div {
    text-align: right;
  }

  .MyTrip {
    margin: 0px;
    padding: 0px;
    width: 365px;
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
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-size: 16px;
    
  }
  .inputTripName, .inputTripDate {
    margin: 0;
    width: 200px;
    height: 20px;
    border: none;
    border-bottom: 1px solid #707070;
    text-align: center;
    outline: none;
    background: #F1F0F0;
    
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
</style>