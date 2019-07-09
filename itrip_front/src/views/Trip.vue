<template>
  <div class="trip">
    <Togos :key="togoUpdate" :togos_prop="togos[page]" :travelInfo="travelInfos[page]" :page="page" v-on:deleteTogo="deleteTogo" v-on:change-page="changePage" v-on:togos-changeOrder="updateTogos" />
    <Spots v-if="showSpots" :spots="spots" v-on:add-spot="addSpotToTrip" /> 
    <button class="btn-showSpots" @click=" showSpots = !showSpots "> {{showSpots?Close:Open}} </button>
    <!-- <button class="btn-showSpots" @click="AddFakeSpot()" > Add </button> -->
    <Map :key="mapUpdate" :spots="spots" :togos="togos[page]" :routes="routes"/>
  </div>
</template>

<script>
// @ is an alias to /src
import Togos from '../components/Togos'
import Spots from '../components/Spots'
import Map from '../components/Map'
import {TravelInfo} from '../../utils/dataClass'
import {apiGetSpots, apiGetRoutes} from '../../utils/api'
import _ from 'lodash'

export default {
  name: 'trip',
  components: {
      Togos,
      Spots,
      Map
  },
  props: ["region", "type"],
  data() {
    return {
      togoUpdate: 0,
      mapUpdate: 200,
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
      changedElementValue: null,
      // travelTime format
      // { start: , dest: ,duration: , time: , mode:}
      travelInfos: [],
    }
  },
  methods: {
    deleteTogo(index) {
      //this.togos[this.page] = this.togos[this.page].filter(togo => togo.id !== id);
      this.fixTravelInfo(index);
      this.togos[this.page].splice(index, 1);
      //console.log(this.togos, this.travelInfos[this.page]);
      console.log(this.travelInfos);
      
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
        this.resetRoutes();
      }
    },
    addSpotToTrip(spot) {
      if (this.togos[this.page] !== undefined){
        this.togos[this.page].push(spot);
      } 
      else {
        this.togos.push([]);
        this.togos[this.page].push(spot);
      }
      let length = this.togos[this.page].length;
      // only need to get travelInfo if length > 2
      if(length > 1) {
        this.addTravelInfo(this.togos[this.page][length - 2], spot);
      }
      // // add this to refresh component
      // this.togoUpdate++;
    },
    addTravelInfo(startOb, destOb) {
      // initialize travelInfos
      if(this.travelInfos[this.page] === undefined) {
        this.travelInfos[this.page] = [];
      }
      // call get routes api
      this.callGetRoutesApi(this.travelInfos[this.page].length, startOb, destOb, 'driving-car');
      
      // reset routes
      this.resetRoutes();
    },
    callGetRoutesApi(index, startOb, destOb, mode) {
      let self = this;
      //console.log(start, dest);
      let coordinates = [[startOb.location.coordinates[0], startOb.location.coordinates[1]],
                        [destOb.location.coordinates[0], destOb.location.coordinates[1]]];
      let data = {
        'coordinates': coordinates 
      };
      // call get routes api
      apiGetRoutes(data, mode)
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
        let travelInfo = new TravelInfo(start, dest, mode, duration, distance, routes)
        self.travelInfos[self.page].splice(index, 1, travelInfo);
      })
      .catch(function (error) {
        //console.log(error);
      })
      .then(function () {
        // always executed
      });
    },
    updateTogos(arr){
      this.togos[this.page] = arr;
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
      //console.log(this.travelInfos[0]);
      if(this.travelInfos.length > 0) {
        let tmp = [];
        for(let i=0;i<this.travelInfos[this.page].length;i++) {
          tmp = tmp.concat((this.travelInfos[this.page][i]).routes);
        };
        this.routes[this.page] = {
          routes: tmp,
          color: "#FF0000"
        };
        this.mapUpdate++;
      }
    }
  },
  
  watch: {
    region: function(newVal, oldVal) {
      //console.log('Prop hanged: ', newVal, '| was: ', oldVal);
      let self = this;
      //place, category, name, sortBy, page, limit, order
      let params = {
          place: newVal,
          category: "gourmet",
          sortBy: "checkins",
          page: 1,
          limit: 10,
          order: -1
      }
      // call get spots api
      apiGetSpots(params)
      .then(function (res) {
        self.spots = res.data.data.resultList;
      })
      .catch(function (error) {
        console.log(error);
      })
      .then(function () {
        // always executed
      });
    },
    togo: function(){
      this.togoUpdate++;
    }
  }
}
</script>

<style>
  * {
    box-sizing: border-box;
    padding: 0;
  }
  .btn {
    display: inline-block;
    border: none;
    background: #555;
    color:#fff;
    padding: 7px 20px;
    cursor: pointer;
  }

  .btn-showSpots {
    border-style: none;
    width: 30px;
    height: 40px;
    margin-right: 0px;
    margin-left: -30px;
    z-index: 100;
    font-size: 30px;
    margin-top: 10px;
    display: block;
    background:rgb(96, 94, 109);
    color: #FFFFFF;
    outline: none;
    justify-content: center;
  }

  body {
    font-family: Arial, Helvetica, sans-serif;
    line-height: 1.4;
  }

  .trip {
    margin: 0 0 0 0;
    height: auto;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;

  }
</style>