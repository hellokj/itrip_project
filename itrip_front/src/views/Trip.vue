<template>
  <div  class="trip">
    <Togos :key="update" :togos_prop="togos[page]" :travelInfo="travelInfos[page]" :page="page" v-on:deleteTogo="deleteTogo" v-on:change-page="changePage" v-on:togos-changeOrder="updateTogos" />
    <Spots v-if="showSpots" v-bind:spots="spots" v-on:add-spot="addSpotToTrip" /> 
    <button class="btn-showSpots" @click=" showSpots = !showSpots "> {{showSpots?Close:Open}} </button>
    <!-- <button class="btn-showSpots" @click="AddFakeSpot()" > Add </button> -->
    <Map :key="update" :spots="spots" :togos="togos[page]" :routes="routes"/>
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
      update: 0,
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
      this.togos[this.page].splice(index, 1);
      this.fixTravelInfo(index);
    },
    fixTravelInfo(index) {
      if(index == 0) {
        this.travelInfos[this.page].shift();
      }
      else if(index == this.travelInfos[this.page].length - 1) {
        this.travelInfos[this.page].pop();
      }
      else {
        this.travelInfos[this.page][index - 1].dest = this.travelInfos[this.page][index].dest;
        this.travelInfos[this.page].splice(index, 1);
      }
    },
    addSpotToTrip(spot) {
      if (this.togos[this.page] !== undefined){
        this.togos[this.page].push(spot);
      } 
      else {
        this.togos[this.page] = [];
        this.togos[this.page].push(spot);
      }
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
    travelInfoContains: function(start, dest) {
      for(let i=0;i<this.travelInfos[this.page].length;i++) {
        if(start === this.travelInfos[this.page][i].start && dest === this.travelInfos[this.page][i].dest) {
          return true;
        }
      }
      return false;
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
        this.update++;
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
    togos: function(newVal, oldVal) {
      // let self = this;
      // let thisPage = this.togos[this.page];
      // let length = thisPage.length;
      // if(length > 1) {
      //   for(let i=0;i<length-1;i++) {
      //     let start = thisPage[i].name;
      //     let dest = thisPage[i+1].name;
      //     let travelInfo = self.travelInfos[self.page];
      //     // check if travelInfo already exists
      //     if(travelInfo !== undefined) {
      //       let tmp = travelInfo[i];
      //       if(tmp !== undefined) {
      //         // skip if start and dest already exist
      //         if((tmp.start === start && tmp.dest === dest) || start === dest) continue;
      //         else if(tmp.start === start) tmp.dest = dest;
      //         else if(tmp.dest === dest) tmp.start = start;
      //       }
      //     }
      //     //console.log(start, dest);
      //     let coordinates = [[thisPage[i].location.coordinates[0], thisPage[i].location.coordinates[1]],
      //                        [thisPage[i+1].location.coordinates[0], thisPage[i+1].location.coordinates[1]]];
      //     // default mode: driving-car
      //     let mode = 'driving-car';
      //     let data = {
      //       'coordinates': coordinates 
      //     }
      //     let routes, duration, distance;
      //     // call get routes api
      //     apiGetRoutes(data, mode)
      //     .then(function (res) {
      //       let tmpCoordinates = res.data.features[0].geometry.coordinates;
      //       // reverse coordinates because leaflet uses inverted coordinates
      //       self.reverseCoordinates(tmpCoordinates);
      //       // assign routes to draw polyLine
      //       routes = tmpCoordinates;
      //       // Travel time
      //       let tmp = res.data.features[0].properties.segments[0];
      //       duration = tmp.duration;
      //       distance = tmp.distance;
      //       // create new travelInfo instance
      //       if(self.travelInfos[self.page] === undefined) {
      //         self.travelInfos[self.page] = [];
      //       }
      //       self.travelInfos[self.page].push(new TravelInfo(start, dest, mode, duration, distance, routes));
      //       // reset routes
      //       self.resetRoutes(self.page);
      //     })
      //     .catch(function (error) {
      //       //console.log(error);
      //     })
      //     .then(function () {
      //       // always executed
      //     });
      //   }
      //   console.log(self.travelInfos);
      // }
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