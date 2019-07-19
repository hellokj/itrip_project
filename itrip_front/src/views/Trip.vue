<template>
  <b-container class="trip" fluid>
    <b-row class="trip-row" fluid>
      <!-- :style="[(isMobile && (selected != 0)) ? { display: none }:{ display: flex}]" -->
      <b-col 
      class="px-0 togos-col" cols="12" lg="5" xl="3"
      :style="[$resize && (!$mq.above(768) && (selected != 0)) ? { display: 'none' }:{ display: 'flex'}]"
      :value="selected">
        <Togos
        id="togos"
        class="togos"
        :togos="togos[page]" :travelInfo="travelInfos[page]" 
        :page="page" v-on:deleteTogo="deleteTogo" v-on:change-page="changePage" 
        v-on:togos-changeOrder="updateTogos" @changeMode="changeMode" @resetRoutes="resetRoutes" @saveTrip="saveTrip"/>
      </b-col>
      <b-col 
      class="px-0 spots-col" cols="12" lg="4" xl="4"
      :style="[$resize && (!$mq.above(768) && (selected != 1)) ? { display: 'none' }:{ display: 'flex'}]"
      :value="selected">
        <Spots
          id="spots"
          class="spots"
          :paginator="paginator" :spots="spots" :perPage="perPage" 
          @hoverSpotItem="hoverSpotItem"
          @add-spot="addSpotToTrip"
          @get-spot="callGetSpotApi"
          @sort-spot="callGetSpotApi"
          @show-map="showMap"/> 
      </b-col>
      <b-col 
      class="px-0 map-col" cols="12" lg="5" order=displayOrders[2] order-md="3"
      :style="[($resize && !$mq.above(768) && selected != 2) ? { display: 'none' }:{ display: 'block'}]"
      :value="selected">
        <Map 
          id="map"
          class="map"
          :spots="spots" :togos="togos[page]" :routes="routes" 
          :page="page" :perPage="perPage" :spotPage="spotPage" :centerSpot="centerSpot"/>
      </b-col>
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
import {TravelInfo} from '../../utils/dataClass'
import {apiGetSpots, apiGetRoutes, apiSaveTrip} from '../../utils/api'

export default {
  name: 'trip',
  components: {
      Togos,
      Spots,
      Map,
      MobileHeader
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
    }
  },
  methods: {
    saveTrip(name, date) {
      // itinerary format:
      //{_id: Number, memberId: Number, startDate: {year: Number, month: Number, day: Number}, name: String, dayNum: Number, togos: Array, travelInfos: Array}
      //memberId, startDate, name, dayNum, togos, travelInfos
      let userId = this.$store.state.user.id;
      let token = this.$store.state.userToken;
      apiSaveTrip(date, name, this.togos.length, this.togos, this.travelInfos, token)
      .then((function (res) {
        console.log(res);
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
      console.log(document.getElementsByClassName("togos-col").style);
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
    callGetSpotApi: async function(data=null, page=1, sort='checkins') {
      let self = this;
      if(data == null) data=this.param;
      data.page = page;
      data.sortBy = sort;
      self.spotPage = page;
      
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
          this.routes = [];
        }
      }
    },
    hoverSpotItem: function(index, spot) {
      if(index === undefined && this.togos[this.page].length > 0) {
        this.centerSpot = this.togos[this.page][0]
        return;
      }
      this.centerSpot = spot;
      this.$set(this.centerSpot, 'index', index);
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
    showMap: function() {
        
    }
  },
  watch: {
    param: function(newVal) {
      this.callGetSpotApi(newVal);
    },
 },
  created () {
    // [註冊監聽事件]
    this.$bus.$on('toggle', event => {
        this.toggle(event.id)
    });
    console.log($mq);
 },

  beforeDestroy: function() {
    // [銷毀監聽事件]
    this.$bus.$off('toggle');
    
  }
}
</script>

<style scoped>
  .trip {
    height: 100%;
 
    background: rgb(250,250,250);
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
</style>