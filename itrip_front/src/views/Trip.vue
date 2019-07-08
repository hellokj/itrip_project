<template>
  <div  class="trip">
    <Togos v-bind:togos="togos" v-bind:page="page" v-on:del-togo="deleteTogo" v-on:change-page="changePage" />
    <Spots v-if="showSpots" v-bind:spots="spots" v-on:add-spot="addSpotToTrip" /> 
    <button class="btn-showSpots" @click=" showSpots = !showSpots "> {{showSpots?Close:Open}} </button>
    <button class="btn-showSpots" @click="AddFakeSpot()" > Add </button>
    <Map :spots="spots" :togos="togos[page]" :routes="routes"/>
  </div>
</template>

<script>
// @ is an alias to /src
import Togos from '../components/Togos'
import Spots from '../components/Spots'
import Map from '../components/Map'
import {apiGetSpots, apiGetRoutes} from '../api.js'

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
      togos: [],
      spots: [],
      routes: [],
      showSpots: true,
      // unused params
      Region: '',
      Type: '',
      Open: '>',
      Close: '<',
      page: 0
    }
  },
  methods: {
    deleteTogo(_id) {
      this.togos = this.togos.filter(togo => togo._id !== _id);
    },
    AddFakeSpot(){
      console.log(this.spots);
      let s = {name: 'text1'};
      this.spots.push(s);
    },
    addSpotToTrip(spot) {
      // this.togos = [...this.togos, spot];
      let stop = {
        id: spot._id,
        name: spot.name,
        location: spot.location.coordinates,
        memo: "",
      };
      if (this.togos[this.page] !== undefined){
        this.togos[this.page].push(stop);
      } else {
        for (var i = 0; i <= this.page; i++){
          if (this.togos[i] === undefined){
            let arr = [];
            this.togos.push(arr);
          }
        }
        
        this.togos[this.page].push(stop);
      }
    },
    changePage(p) {
      this.page = p;
    },
    created() {

    },
    updated: function(){

    },
  },
  watch: {
    region: function(newVal, oldVal) {
      console.log('Prop hanged: ', newVal, '| was: ', oldVal);
      let self = this;
      //place, category, name, sortBy, page, limit, order
      let params = 
        {
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
    togos: function() {
      let self = this;
      let length = this.togos[this.page].length;
      let coordinates = [];
      if(length > 1) {
        for(let i=0;i<length;i++) {
          let togo = this.togos[this.page][i];
          
          // get coordinates from togos
          let tmp = [togo.location.coordinates[0], togo.location.coordinates[1]];
          coordinates.push(tmp);

          // set index for togo in togos
          togo.index = i;
        }
      }
      let data = {
        'coordinates': coordinates 
      }
      // call get routes api
      apiGetRoutes(data, 'driving-car')
      .then(function (res) {
        let tmpCoordinates = res.data.features[0].geometry.coordinates;
        for (let i = 0; i < tmpCoordinates.length; i++) {
          // 反轉經緯度 for leaflet
          let tmp = tmpCoordinates[i][1];
          tmpCoordinates[i][1] = tmpCoordinates[i][0];
          tmpCoordinates[i][0] = tmp;
        }
        self.routes.push(tmpCoordinates);
      })
      .catch(function (error) {
        console.log(error);
      })
      .then(function () {
        // always executed
      });
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
    height: 60px;
    margin-top: 30px;
    display: block;
    background:rgb(96, 94, 109);
    color: #FFFFFF;
    outline: none;
  }

  body {
    font-family: Arial, Helvetica, sans-serif;
    line-height: 1.4;
  }

  .trip {
    margin: 0 0 0 0;
    height: 600px;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
  }
</style>