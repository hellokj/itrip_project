<template>
  <div  class="trip">
    <Togos v-bind:togos="togos" v-on:del-togo="deleteTogo" />
    <h1>{{ region }}</h1>
    <h1>{{ type }}</h1>

  </div>
</template>

<script>
// @ is an alias to /src
import Togos from '../components/Togos'
import axios from 'axios';

export default {
  name: 'trip',
  components: {
      Togos
  },
  props: ["region", "type"],
  data() {
    return {
      togos: [],
      Region: '',
      Type: ''
    }
  },
  methods: {
    deleteTogo(_id) {
      this.togos = this.togos.filter(togo => togo._id !== _id);
    }
  },
  created() {
    Region = region;
    Type = type;
    // axios.get('http://35.194.247.229:3000/api/poi/get?place=萬華區&sortBy=checkins')
    //   .then(res => this.togos = res.data.data)
    //   .catch(err => console.log(err));
  },
  updated: function(){
    Region = region;
    Type = type;
      alert("updated");
      axios.get('http://35.194.247.229:3000/api/poi/get?place='+ region +'&sortBy=checkins')
      .then(res => this.togos = res.data.data)
      .catch(err => console.log(err));
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

  body {
    font-family: Arial, Helvetica, sans-serif;
    line-height: 1.4;
  }

  .trip {
    margin: 0 0 0 0;
    height: 600px;
  }


</style>