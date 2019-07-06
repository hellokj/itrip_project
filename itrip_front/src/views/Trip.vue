<template>
  <div  class="trip">
    <Togos v-bind:togos="togos" v-bind:page="page" v-on:del-togo="deleteTogo" v-on:change-page="changePage" />
    <Spots v-if="showSpots" v-bind:spots="spots" v-on:add-spot="addSpotToTrip" /> 
    <button class="btn-showSpots" @click=" showSpots = !showSpots "> {{showSpots?Close:Open}} </button>
    <button class="btn-showSpots" @click="AddFakeSpot()" > Add </button>
    <Map/>
  </div>
</template>

<script>
// @ is an alias to /src
import Togos from '../components/Togos'
import Spots from '../components/Spots'
import Map from '../components/Map'
import axios from 'axios';

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
      showSpots: tue,
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
      let s = {name: 'text1'};
      this.spots.push(s);
    },
    addSpotToTrip(spot) {
      // this.togos = [...this.togos, spot];
      
      if (this.togos[this.page] !== undefined){
        this.togos[this.page].push(spot);
      } else {

        for (var i = 0; i <= this.page; i++){
          if (this.togos[i] === undefined){
            let arr = [];
            this.togos.push(arr);
          }
        }
        
        this.togos[this.page].push(spot);
      }

      // let arr = [];
      // arr.push(spot);
      // alert(arr);
      // this.togos.push(arr);
      alert(this.togos[this.page]);



    },
    changePage(p) {
      this.page = p;
      alert("app.vue: page=" + p);
    }
  },
  created() {

  },
  updated: function(){

  },
  watch: {
    region: function(newVal, oldVal) {
      console.log('Prop hanged: ', newVal, '| was: ', oldVal);
      let self = this;
      //place, category, name, sortBy, page, limit, order
      // axios.get('http://35.194.247.229:3000/api/poi/get?place='+ newVal +'&sortBy=checkins')
      // .then(res => this.spots = res.data.data)
      // .catch(err => console.log(err));

      axios.get('http://35.194.247.229:3000/api/spot/get', {
        params: {
          place: newVal,
          category: "gourmet",
          sortBy: "checkins",
          page: 1,
          limit: 10,
          order: -1
        }
      })
      .then(function (res) {
        //console.log(res.data.data.resultList);
        self.spots = res.data.data.resultList;
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