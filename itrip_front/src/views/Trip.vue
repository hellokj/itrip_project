<template>
  <div class="trip">
    <Togos :togos="togos[page]" :travelInfo="travelInfos[page]" 
    :page="page" v-on:deleteTogo="deleteTogo" v-on:change-page="changePage" 
    v-on:togos-changeOrder="updateTogos" @changeMode="changeMode" @resetRoutes="resetRoutes" @saveTrip="saveTrip"/>
    <Spots v-if="showSpots" :paginator="paginator" :spots="spots" :perPage="perPage" 
    @hoverSpotItem="hoverSpotItem"
    @add-spot="addSpotToTrip"
    @get-spot="callGetSpotApi"
    @sort-spot="callGetSpotApi" /> 
    <button class="btn-showSpots" @click="showSpots = !showSpots"> {{showSpots?Close:Open}} </button>
    <!-- <button class="btn-showSpots" @click="AddFakeSpot()" > Add </button> -->
    <Map class="ml-2" :bigMap="!showSpots" :spots="spots" :togos="togos[page]" :routes="routes" 
    :page="page" :perPage="perPage" :spotPage="spotPage" :centerSpot="centerSpot"/>
  </div>
</template>

<script>
// @ is an alias to /src
import Togos from '../components/Togos'
import Spots from '../components/Spots'
import Map from '../components/Map'
import {TravelInfo} from '../../utils/dataClass'
import {apiGetSpots, apiGetRoutes, apiSaveTrip} from '../../utils/api'

export default {
  name: 'trip',
  components: {
      Togos,
      Spots,
      Map,
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
      centerSpot: {}
    }
  },
  methods: {
    saveTrip(name, date) {
      // itinerary format:
      //{_id: Number, memberId: Number, startDate: {year: Number, month: Number, day: Number}, name: String, dayNum: Number, togos: Array, travelInfos: Array}
      //memberId, startDate, name, dayNum, togos, travelInfos
      console.log(this.togos);
      console.log(this.travelInfos);
      console.log(name, date);
      apiSaveTrip(123, date, name, this.togos.length, this.togos, this.travelInfos)
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
    },
    fixTravelInfo(index) {
      if(index == 0) {
        console.log(this.travelInfos)
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
      }
    },
    hoverSpotItem: function(index, spot) {
      this.centerSpot = spot;
      this.$set(this.centerSpot, 'index', index);
    }
  },
  
  watch: {
    param: function(newVal) {
      this.callGetSpotApi(newVal);
    },
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
    display: inline-block;
  }

</style>