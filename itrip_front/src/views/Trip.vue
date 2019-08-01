<template>
  <b-container class="trip" fluid>
    <b-row class="trip-row" fluid align-h="center">
      <b-col
        class="px-0" cols="12" sm="12" md="6" lg="4" xl="4"
        :style="[($resize && !$mq.above(1025) && selected != 0 && selected != 3) ? { display: 'none' }:{ display: 'flex'}]"
      :value="selected">
        <Togos
        id="togos"
        class="togos"
        :togos="togos[page]" :travelInfo="travelInfos[page]" :dayNum="dayNum" :itinerary="itinerary" :key="update" :shareId="qviewId"
        :page="page" @togos-changeOrder="updateTogos" @click-view-map="clickViewMap"
        @changeMode="changeMode" @resetRoutes="resetRoutes" @saveTrip="saveTrip" @getNearby="getNearby" @deleteTogo="deleteTogo" @change-page="changePage"
        @zoom-togos="zoomTogos" @add-new-day="addNewDay" @remove-day="removeDay" @changeBaseTimes="changeBaseTimes" @share="share" @updateShare="updateShare"/>
      </b-col>
      <b-col 
      class="px-0 spots-col" cols="12" sm="12" md="6" lg="5" xl="5"
      :style="[($resize && !$mq.above(1025) && selected != 1 && selected != 3) ? { display: 'none' }:{ display: 'flex'}]"
      :value="selected">
        <Spots
          id="spots"
          class="spots"
          :paginator="paginator" :spots="spots" :perPage="perPage" :togos="togos[page]" :isMapShown="isMapShown" :queryRegion="queryRegion" :queryCounty="queryCounty" :queryName="queryName"
          @filter-spot="filterSpot"
          @hoverSpotItem="hoverSpotItem"
          @add-spot="addSpotToTrip"
          @get-spot="getSpot"
          @get-nearby="getNearby"
          @sort-spot="sortSpot"
          @refresh="refresh"/> 
      </b-col>
      <b-col
      v-if="isMapShown"
      class="px-0 pl-3 map-col" order=displayOrders[2] order-md="3"
      :style="[($resize && !$mq.above(1025) && selected != 2) ? { display: 'none' }:{ display: 'block'}]"
      :value="selected" no-gutters fluid>
        <b-col class="px-0" style="height:100%;display:flex;flex-direction:column;justify-content:space-evenly;">
          <div class="big-image-container" :style="[($resize && !$mq.above(1025)) ? { display: 'none' }:{ display: 'block'}]">
            <el-carousel height="100%" :autoplay="false" trigger="click" style="height:100%;">
              <el-carousel-item v-for="item in getImages(selectedSpot)" :key="item">
                <vue-load-image  style="width:100%;height:100%;">
                  <img ref="image" class="big-image" slot="image" :src="item">
                  <img class="px-2 py-2 preloader" slot="preloader" src="../assets/image-loader.gif"/>
                  <div slot="error"><img class="px-2 py-2 picNotFound" src="../assets/picNotFound.jpg"></div>
                </vue-load-image>
              </el-carousel-item>
            </el-carousel>
          </div>
          <div class="row" style="display:flex;justify-content:center;">
            <el-checkbox-group v-model="checkList">
              <el-checkbox label="景點圖標"><i class="fas fa-map-marker-alt"> 景點圖標</i></el-checkbox>
              <el-checkbox label="路徑指示"><i class="fas fa-road"> 路徑指示</i></el-checkbox>
            </el-checkbox-group>
          </div>
          <Map 
            id="map"
            class="map"
            :key="updateMap"
            :spots="spots" :togos="togos[page]" :routes="routes" 
            :page="page" :perPage="perPage" :spotPage="spotPage" 
            :centerSpot="centerSpot" :selectedSpot="selectedSpot" :checkList="checkList"/>
        </b-col>
      </b-col>
    </b-row>
    <b-row>
      <ItineraryPdf :togos="togos" :travelInfos="travelInfos"/>
    </b-row>
  </b-container>
</template>

<script>
// @ is an alias to /src
import Vue from 'vue'
import Togos from '../components/Togos'
import Spots from '../components/Spots'
import Map from '../components/Map'
import MobileHeader from '../components/layout/MobileHeader'
import ItineraryPdf from '../components/template/ItineraryPdf'
import {TravelInfo} from '../../utils/dataClass'
import {apiGetSpots, apiGetRoutes, apiSaveTrip, apiGetNearby, apiShareTrip, apiGetSharedTrip, apiUpdateShare} from '../../utils/api'
import {makeParams} from '../../utils/area'
import VueLoadImage from 'vue-load-image'
import { Promise } from 'q';
import { Message } from 'element-ui';

export default {
  name: 'trip',
  components: {
      Togos,
      Spots,
      Map,
      MobileHeader,
      ItineraryPdf,
      'vue-load-image': VueLoadImage
  },
  props: {
    param: Object,
  },
  data() {
    return {
      togos: [],
      spots: [],
      // routes format: {
      // "0" : {
      //  "routes": // 2-d array
      //  "color": }}
      routes: {},
      showSpots: true,
      // unused params
      Region: '',
      Type: '',
      Open: '>',
      Close: '<',
      page: 0,
      spotPage: 1,
      perPage: 10,
      changedElementValue: null,
      // travelTime format:
      // { start: , dest: ,duration: , time: , mode:}
      baseTimes: [],
      travelInfos: [],
      paginator: {},
      centerSpot: {},
      selected: 3,
      isMapShown: true,
      paramProp: '',
      selectedSpot: 0,
      update: 0,
      dayNum: 1,
      itinerary: {},
      updateMap:0,
      windowWidth: 0,
      // query parameters
      qplace: this.$route.query.qplace,
      qname: this.$route.query.qname,
      qspot: this.$route.query.qspot,
      qid: this.$route.query.qid,
      qviewId: this.$route.query.viewId,
      qresult: null,
      qadded: false,
      updateMap: 0,
      checkList: ['景點圖標', '路徑指示'],
      queryCounty: '',
      queryRegion: [],
      queryName: '',
      isAddSpotLocked: false,
    }
  },
  methods: {
    saveTrip(name, date, memberId) {
      // itinerary format:
      //{_id: Number, memberId: Number, startDate: {year: Number, month: Number, day: Number}, name: String, dayNum: Number, togos: Array, travelInfos: Array}
      //memberId, startDate, name, dayNum, togos, travelInfos
      let userId = this.$store.state.user.id;
      let token = this.$store.state.userToken;
      let _id = "";
      if (this.itinerary._id != undefined && typeof(this.itinerary._id) !== Object){
        _id = this.itinerary._id;
      }
      let self = this;
      // console.log("itinerary", this.itinerary);
      // console.log("_id", _id);
      apiSaveTrip(_id, date, name, this.togos.length, this.baseTimes, this.togos, this.travelInfos, memberId, token)
      .then((function (res) {
        console.log(res);
        self.$message.success('行程儲存成功!');
      }))
      .catch(function (error) {
        console.log(error);
      });
    },
    share(name, date) {
      if(this.togos[0] === undefined) {
        this.$message.warning('你還沒排行程!');
        return;
      }
      let self = this;
      apiShareTrip(date, name, this.togos.length, this.togos, this.travelInfos)
      .then((function (res) {
        self.qviewId = res.data.data;
      }))
      .catch(function (error) {
        console.log(error);
      });
    },
    updateShare(id, name, date) {
      let self = this;
      apiUpdateShare(id, date, name, this.togos.length, this.togos, this.travelInfos)
      .then((function (res) {
        console.log(res);
      }))
      .catch(function (error) {
        console.log(error);
      });
    },
    getSharedTrip(id) {
      let self = this;
      apiGetSharedTrip(id)
      .then((function (res) {
        console.log("res", res);
        self.itinerary = res.data.data[0];
        self.itinerary._id = new Date().getTime();
        self.itinerary.memberIds = [];
      }))
      .catch(function (error) {
        console.log(error);
      });
    },
    addMember() {

    },
    deleteTogo(index) {
      if(this.travelInfos[this.page] != undefined) {
        this.fixTravelInfo(index);
      }
      this.togos[this.page].splice(index, 1);
    },
    addNewDay() {
      this.togos.push([]);
      this.dayNum++;
    },
    removeDay(index) {
      this.togos.splice(index, 1);
      this.dayNum--;
    },
    fixTravelInfo(index) {
      if(index == 0) {
        this.travelInfos[this.page].shift();
      }
      else if(index == this.togos[this.page].length - 1) {
        this.travelInfos[this.page].pop();
      }
      else {
        // get start and dest object
        let start = this.togos[this.page][index - 1];
        let dest = this.togos[this.page][index + 1];
        this.callGetRoutesApi(index - 1, start, dest, this.travelInfos[this.page][index - 1].mode);
        this.travelInfos[this.page].splice(index, 1);
        // reset routes
      }
      this.resetRoutes();
    },
    addSpotToTrip(spot) {
      if(!this.isAddSpotLocked) {
        if (this.togos[this.page] === undefined){
        this.togos.push([]);
        }
        spot.stopTime = {
          hrs: 1,
          mins: 0
        }
        this.togos[this.page].push(spot);
        let length = this.togos[this.page].length;
        // only need to get travelInfo if length > 2
        if(length > 1) {
          this.addTravelInfo(this.togos[this.page][length - 2], spot);
        }
        if(window.innerWidth <= 768) {
            this.$bus.$emit('toggle', {id: 'Togos'});
        }
        this.isAddSpotLocked = true;
      }
      
    },
    addTravelInfo(startOb, destOb) {
      // initialize travelInfos
      if(this.travelInfos[this.page] === undefined) {
        this.$set(this.travelInfos, this.page, []);
      }
      // call get routes api
      this.callGetRoutesApi(this.travelInfos[this.page].length, startOb, destOb, 'driving-car');
    },
    callGetRoutesApi: async function(index, startOb, destOb, mode) {
      let self = this;
      //console.log(start, dest);
      let coordinates = [[startOb.location.coordinates[0], startOb.location.coordinates[1]],
                        [destOb.location.coordinates[0], destOb.location.coordinates[1]]];
      let data = {
        'coordinates': coordinates 
      };
      // call get routes api
      await apiGetRoutes(data, mode)
      .then(function (res) {
        let tmpCoordinates = res.data.features[0].geometry.coordinates;
        // reverse coordinates because leaflet uses inverted coordinates
        self.reverseCoordinates(tmpCoordinates);
        // assign routes to draw polyLine
        let routes = tmpCoordinates;
        // Travel time
        let tmp = res.data.features[0].properties.segments[0];
        let duration = tmp.duration;
        let distance = tmp.distance;
        let start = startOb.name;
        let dest = destOb.name;
        let travelInfo = new TravelInfo(start, dest, mode, duration, distance, routes);
        self.$set(self.travelInfos[self.page], index, travelInfo);
        // reset routes
        self.resetRoutes();
      })
      .catch(function (error) {
        //console.log(error);
      })
      .then(function () {
        // always executed
      });
    },
    callGetSpotApi: function(data=null, byQuery=false) {
      let self = this;
      if(data == null) {
        data=this.paramProp;
      }
      self.spotPage = data.page;
      
      // call get spots api
      apiGetSpots(data)
      .then(function (res) {
        self.spots = res.data.data.resultList;
        if(self.spots.length == 0) {
          return;
        }
        self.paginator = res.data.data.paginator;
        if (byQuery) self.qresult = res.data.data.resultList;
      })
      .catch(function (error) {
        console.log(error);
      })
      .then(function () {
        // always executed
      });
    },
    callNearbyApi: function(data=null) {
      let self = this;
      if(data == null) data=this.paramProp;
      self.spotPage = data.page;
      // call get nearby api
      apiGetNearby(data)
      .then(function (res) {
        let tmp = res.data.data;
        self.spots = res.data.data.resultList;
        self.paginator = {
          "nearby": true,
          "spotCount": tmp["spotCount"],
          "perPage": tmp["perPage"],
          "currentPage": tmp["currentPage"],
          "pageCount": tmp["pageCount"],
          "slNo": tmp["slNo"],
          "hasPrevPage": tmp["hasPrevPage"],
          "hasNextPage": tmp["hasNextPage"],
          "prev": tmp["prev"],
          "next": tmp["next"]
        }
      })
      .catch(function (error) {
        console.log(error);
      })
      .then(function () {
        // always executed
      });
    },
    changeBaseTimes(startTimeOb, page){
      //console.log("startTimeOb", startTimeOb);
      //console.log("page", page);
      this.baseTimes[page] = startTimeOb;
      //console.log("baseTimes", this.baseTimes);
    },
    changeMode(index, mode) {
      this.callGetRoutesApi(index, this.togos[this.page][index], this.togos[this.page][index + 1], mode);
    },
    updateTogos(arr, oldIndex, newIndex){
      this.togos[this.page] = arr;
      //console.log(oldIndex, newIndex);
      let length = this.togos[this.page].length;
      //update old
      for(let i=newIndex-1;i<=newIndex;i++) {
        if(i < 0 || i == length) continue;
        let startOb = this.togos[this.page][i];
        let destOb = this.togos[this.page][i + 1];
        this.callGetRoutesApi(i, startOb, destOb, this.travelInfos[this.page][i].mode);
      }
      //update new
      for(let i=oldIndex-1;i<=oldIndex;i++) {
        if(i == newIndex || i < 0 || i == length) continue;
        let startOb = this.togos[this.page][i];
        let destOb = this.togos[this.page][i + 1];
        this.callGetRoutesApi(i, startOb, destOb, this.travelInfos[this.page][i].mode);
      }
    },
    changePage(p) {
      this.page = p;
    },
    reverseCoordinates: function(tmpCoordinates) {
      for (let i = 0; i < tmpCoordinates.length; i++) {
        // 反轉經緯度 for leaflet
        let tmp = tmpCoordinates[i][1];
        tmpCoordinates[i][1] = tmpCoordinates[i][0];
        tmpCoordinates[i][0] = tmp;
      }
    },
    resetRoutes: function() {
      if(this.travelInfos[this.page] !== undefined) {
        let length = this.travelInfos[this.page].length;
        if(length > 0) {
          let tmp = [];
          for(let i=0;i<length;i++) {
            tmp = tmp.concat((this.travelInfos[this.page][i]).routes);
          };
          this.$set(this.routes, this.page, {
            routes: tmp,
            color: "#FF0000"
          });
        }
        else {
          this.routes = {};
        }
      }
    },
    hoverSpotItem: function(index, spot) {
      if(this.checkList.includes('景點圖標')) {
        this.centerSpot = spot;
        this.$set(this.centerSpot, 'zoom', 12);
        this.$set(this.centerSpot, 'index', index);
      }
      else {
        if(this.togos[0] !== undefined) {
          this.centerSpot = this.togos[0];  
        }
        else {
          this.centerSpot = this.spots[0];
        }
        
      }
      if(index != null) {
        this.selectedSpot = index;
      }  
    },
    toggle: function(toggle) {
      let components = ['Togos', 'Spots', 'Map', 'Togos/Spots'];
      for(let i=0;i<components.length;i++) {
        if(toggle == components[i]) {
          this.selected = i;
        }
      }
    },
    clickViewMap: function() {
      this.isMapShown = !this.isMapShown;
    },
    getNearby: function(spot, page) {
      if(spot !== null) {
          let data = {
            id: spot._id,
            distance: 10000,
            limit: 10,
            order: -1,
            sortBy: 'ig_post_num',
            page: 1
          }
          this.paramProp = data;
      }
      else {
        this.paramProp.page = page;
      }
    },
    getImages: function(index) {
      if(this.spots[index] !== undefined && Object.keys(this.spots[index]).includes('images')) {
        return this.spots[index].images;
      }
      else {
        return ['111'];
      }
    },
    zoomTogos: function() {
      this.centerSpot = this.togos[this.page][0];
      this.$set( this.centerSpot, 'type', 'togos');
      this.$set( this.centerSpot, 'zoom', 10);
    },
    sortSpot: function(sortBy) {
      this.$set( this.paramProp, 'page', 1);
      this.$set( this.paramProp, 'sortBy', sortBy);
    },
    getSpot: function(page) {
      this.$set( this.paramProp, 'page', page);
    },
    refresh: function() {
      if(Object.keys(this.paramProp).includes('distance')) {
        this.callNearbyApi();
      }
      else {
        this.callGetSpotApi();
      }
    },
    filterSpot: function(checkedCategories) {
      this.$set(this.paramProp, 'categories', checkedCategories);
    },
    handleResize() {
      this.windowWidth = window.innerWidth;
    },
  },
  watch: {
    param: function(newVal) {
      this.paramProp = newVal;
    },
    paramProp: {
      handler: function(newVal, oldVal) {
        console.log(newVal);
        if(newVal.city) this.queryCounty = newVal.city;
        else this.queryCounty = null;

        if(newVal.region) this.queryRegion = newVal.region;
        else this.queryRegion = null;

        if(newVal.name) this.queryName = newVal.name;
        else this.queryName = name;
        
        // if(this.queryCounty === null && this.queryRegion === null)
        if(Object.keys(newVal).includes('distance')) {
          this.callNearbyApi(newVal);
        }
        else {
          this.callGetSpotApi(newVal);
        }
      },
      deep: true,
    },
    selectedSpot: function(newVal, oldVal) {
      this.updateMap++;
    },
    qresult: function(newVal) {
      if (newVal  && !this.qadded) {
        for(var i = 0; i < newVal.length; i++){
          if (newVal[i]._id == this.qid)
            this.addSpotToTrip(newVal[i])
            this.qadded = true;
        }
      }
    },
    itinerary: function(newVal, oldVal){
      for (let i=0;i<newVal.togos.length;i++){
        this.$set(this.togos, i, newVal.togos[i]);
        this.$set(this.travelInfos, i, newVal.travelInfos[i]);
        this.$set(this.routes, i, newVal.travelInfos[i].routes);
      };
    },
    isAddSpotLocked: function(newVal, oldVal) {
      if(newVal) {
        setTimeout(() => {
            this.isAddSpotLocked = false
        },2000)
      }
    },
    // watch window width
    windowWidth: function(newVal, oldVal) {
      if(newVal <= 768 && this.selected == 3) {
        this.selected = 1;
      }
      if(newVal > 768 && newVal <= 1024 && (this.selected == 1 || this.selected == 0)) {
        this.selected = 3;
      }
    }
  },
  created () {
    // [註冊監聽事件]
    let self = this;
    this.$bus.$on('toggle', event => {
      this.toggle(event.id);
    });
    this.$bus.$on('modifyItinerary', event => {
      self.itinerary = event.itinerary;
      console.log("trip get", self.itinerary);
      for (let i=0;i<self.itinerary.togos.length;i++){
        self.$set(self.togos, i, self.itinerary.togos[i]);
        self.$set(self.travelInfos, i, self.itinerary.travelInfos[i]);
        self.$set(self.routes, i, self.itinerary.travelInfos[i].routes);
        // this.routes.push(newVal.travelInfos[i].routes);
      };
    });
    if (this.qname !== undefined){
      this.callGetSpotApi(makeParams(null, null, null, this.qname));
    } 
    if (this.qplace !== undefined) {
      this.callGetSpotApi(makeParams(this.qplace));
    }
    if (this.qspot !== undefined && this.qid !== undefined) {
      alert(this.qspot + ", " + this.qid)
      this.qresult = this.callGetSpotApi(makeParams(null, null, null, this.qspot), true);
    }
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  },
  beforeMount() {
    if(this.qviewId !== undefined) {
      this.getSharedTrip(this.qviewId);
      this.qviewId = 0;
    }
  },
  mounted() {
    let data = {
      limit: 10,
      order: -1,
      page: 1,
      sortBy: 'ig_post_num'
    };

    if (this.qname !== undefined) {
      this.callGetSpotApi(makeParams(null, null, null, this.qname));
    } else if (this.qplace !== undefined) {
      this.callGetSpotApi(makeParams(null, this.qplace, null, null));
    } else if (this.qspot !== undefined && this.qid !== undefined) {
      alert(this.qspot + ", " + this.qid)
      this.qresult = this.callGetSpotApi(makeParams(null, null, null, this.qspot), true)
    } else {
      this.paramProp = data;
    }
  },
  beforeDestroy: function() {
    // [銷毀監聽事件]
    this.$bus.$off('toggle');
    this.$bus.$off('modifyItinerary');
  },
  destroy: function() {
     window.removeEventListener('resize', this.handleResize)
  }
}
</script>

<style scoped>
  .trip {
    height: 90vh;
    overflow: hidden;
    background: rgb(250,250,250);
  }
  .map-col {
    height: 90vh;
    border-width: 3px;
    border-style: solid;
    border-image: linear-gradient( to bottom, rgb(255, 255, 255), rgb(206, 206, 206), rgb(222, 222, 222), rgb(235, 235, 235)) 1 100%;
  }
  .big-image-container {
    padding-top: 40px;
    padding-bottom: 40px;
    background: #f2f2f2;
    height: 45%;
    width: 100%;
  }
  .big-image {
    width: 100%;
    height: 100%;
  }
  .preloader {
    width: 100%;
    height: 100%;
  }
  .picNotFound {
    width: 100%;
    height: auto;
  }
@media screen and (max-width: 768px) {
  .trip {
    -webkit-overflow-scrolling: touch;
    overflow-x: auto;
    padding-left: 0px;
    padding-right: 0px;
  }
  .trip-row {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    margin-left: 0px;
    margin-right: 0px;
  }
}
@media screen and (min-width: 1280px) {
  .trip {
    padding-left: 50px;
    padding-right: 50px;
  }
}
@media screen and (min-width: 2560px) {
  .trip {
    padding-left: 400px;
    padding-right: 400px;
  }
}
</style>
<style>
  /* custom scroll bar */
  ::-webkit-scrollbar {
    width: 5px;
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
</style>
