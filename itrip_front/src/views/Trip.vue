<template>
  <div  class="trip">
    <Togos v-bind:togos="togos" v-on:del-togo="deleteTogo"/>
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
      showSpots: true,
      // unused params
      Region: '',
      Type: '',
      Open: '>',
      Close: '<'
    }
  },
  methods: {
    deleteTogo(_id) {
      this.togos = this.togos.filter(togo => togo._id !== _id);
    },
    AddFakeSpot(){
      let s = {name: 'text1', location:{coordinates:[1.001, 2.002]}};
      this.spots.push(s);
    },
    addSpotToTrip(spot) {
      this.togos = [...this.togos, spot];
    }
  },
  created() {

  },
  updated: function(){

  },
  watch: {
    region: function(newVal, oldVal) {
      console.log('Prop hanged: ', newVal, '| was: ', oldVal);
      axios.get('http://35.194.247.229:3000/api/poi/get?place='+ newVal +'&sortBy=checkins')
      // axios.get('https://jsonplaceholder.typicode.com/todos')
      .then(res => this.spots = res.data.data)
      .catch(err => console.log(err));
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