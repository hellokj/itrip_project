<template>
  <b-container class="trip" fluid>
    <b-row class="trip-row" fluid align-h="center">
      <b-col
        class="px-0 togos-col" cols="12"  lg="5" xl="3"
        :style="[($resize && !$mq.above(769) && selected != 0) ? { display: 'none' }:{ display: 'flex'}]"
      :value="selected">
        <Togos
        id="togos"
        class="togos"
        :togos="togos[page]" :travelInfo="travelInfos[page]" :dayNum="dayNum" :itinerary="itinerary"
        :page="page" :togos-changeOrder="updateTogos" @click-view-map="clickViewMap"
        @changeMode="changeMode" @resetRoutes="resetRoutes" @saveTrip="saveTrip" @getNearby="getNearby" @deleteTogo="deleteTogo" @change-page="changePage"
        @zoom-togos="zoomTogos" @add-new-day="addNewDay" @remove-day="removeDay"
        :key="update"/>
      </b-col>
      <b-col 
      class="px-0 spots-col" cols="12" lg="6" xl="4"
      :style="[($resize && !$mq.above(769) && selected != 1) ? { display: 'none' }:{ display: 'flex'}]"
      :value="selected">
        <Spots
          id="spots"
          class="spots"
          :paginator="paginator" :spots="spots" :perPage="perPage" :togos="togos[page]" :isMapShown="isMapShown"
          @hoverSpotItem="hoverSpotItem"
          @add-spot="addSpotToTrip"
          @get-spot="getSpot"
          @get-nearby="getNearby"
          @sort-spot="sortSpot"
          @refresh="callGetSpotApi"/> 
      </b-col>
      <b-col
      v-if="isMapShown"
      class="px-0 map-col" cols="12" lg="4" xl="3" order=displayOrders[2] order-md="3"
      :style="[($resize && !$mq.above(769) && selected != 2) ? { display: 'none' }:{ display: 'block'}]"
      :value="selected">
        <b-col style="height:100%;display:flex;flex-direction:column;justify-content:space-evenly;">
          <div class="big-image-container" :style="[($resize && !$mq.above(769)) ? { display: 'none' }:{ display: 'block'}]">
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
          <Map 
            id="map"
            class="map"
            :key="updateMap"
            :spots="spots" :togos="togos[page]" :routes="routes" 
            :page="page" :perPage="perPage" :spotPage="spotPage" 
            :centerSpot="centerSpot" :selectedSpot="selectedSpot"/>
        </b-col>
      </b-col>
    </b-row>
    <b-row>
      <ItineraryPdf :togos="togos"/>
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
import {apiGetSpots, apiGetRoutes, apiSaveTrip, apiGetNearby} from '../../utils/api'
import VueLoadImage from 'vue-load-image'

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
      travelInfos: [],
      paginator: {},
      centerSpot: {},
      selected: 1,
      isMapShown: true,
      paramProp: '',
      selectedSpot: 0,
      update: 0,
      dayNum: 1,
      itinerary: {},
      updateMap:0,
    }
  },
  methods: {
    saveTrip(name, date) {
      // itinerary format:
      //{_id: Number, memberId: Number, startDate: {year: Number, month: Number, day: Number}, name: String, dayNum: Number, togos: Array, travelInfos: Array}
      //memberId, startDate, name, dayNum, togos, travelInfos
      let userId = this.$store.state.user.id;
      let token = this.$store.state.userToken;
      let _id = "";
      if (this.itinerary._id != undefined){
        _id = this.itinerary._id;
      }
      let self = this;
      // console.log("itinerary", this.itinerary);
      // console.log("_id", _id);
      apiSaveTrip(_id, date, name, this.togos.length, this.togos, this.travelInfos, token)
      .then((function (res) {
        console.log(res);
        alert("儲存成功");
      }))
      .catch(function (error) {
        console.log(error);
      });
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
    },
    addTravelInfo(startOb, destOb) {
      // initialize travelInfos
      if(this.travelInfos[this.page] === undefined) {
        this.travelInfos[this.page] = [];
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
    callGetSpotApi: function(data=null) {
      let self = this;
      if(data == null) {
        data=this.paramProp;
      }
      self.spotPage = data.page;
      
      // call get spots api
      apiGetSpots(data)
      .then(function (res) {
        self.spots = res.data.data.resultList;
        self.paginator = res.data.data.paginator;
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
      if(index === undefined && this.togos[this.page] !== undefined && this.togos[this.page].length > 0) {
        this.centerSpot = this.togos[this.page][0]
        this.centerSpot.zoom = 8;
        return;
      }
        this.centerSpot = spot;
        this.centerSpot.zoom = 15;
        this.$set(this.centerSpot, 'index', index);
        if(index != null) {
          this.selectedSpot = index;
        }
    },
    toggle: function(toggle) {
      let components = ['Togos', 'Spots', 'Map'];
      for(let i=0;i<components.length;i++) {
        if(toggle == components[i]) {
          this.selected = i;
          return;
        }
      }
    },
    clickViewMap: function() {
      this.isMapShown = !this.isMapShown;
    },
    getNearby: function(spot) {
      let data = {
        id: spot._id,
        distance: 1000,
        limit: 10,
        order: -1,
        sortBy: 'ig_post_num'
      }
      this.paramProp = data;
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
      this.centerSpot.zoom = 8;
    },
    sortSpot: function(sortBy) {
      this.paramProp.page = 1;
      this.paramProp.sortBy = sortBy;
    },
    getSpot: function(page) {
      this.paramProp.page = page;
    },
    getNearby: function(page) {
      this.paramProp.page = page;
    }
  },
  watch: {
    param: function(newVal) {
      this.paramProp = newVal;
    },
    paramProp: {
      handler: function(newVal, oldVal) {
        if(Object.keys(newVal).includes('distance')) {
          this.callNearbyApi(newVal);
          return;
        }
        this.callGetSpotApi(newVal);
      },
      deep: true,
    },
    selectedSpot: function(newVal, oldVal) {
      this.updateMap++;
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
      self.togos = event.itinerary.togos;
      self.travelInfos = event.itinerary.travelInfos;
    });
  },
  mounted() {
  },
  beforeDestroy: function() {
    // [銷毀監聽事件]
    this.$bus.$off('toggle');
    this.$bus.$off('modifyItinerary');
  }
}
</script>

<style scoped>
  .trip {
    height: 100%;
    background: rgb(250,250,250);
  }
  .map-col {
    height: 90vh;
  }
  .big-image-container {
    padding-top: 25px;
    padding-bottom: 25px;
    background: #f2f2f2;
    height: 50%;
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
@media screen and (min-width: 1680px) {
  .trip {
    padding-left: 100px;
    padding-right: 100px;
  }
}
@media screen and (min-width: 2560px) {
  .trip {
    padding-left: 400px;
    padding-right: 400px;
  }
}

</style>