<template>
  <div id="app">
    <Header v-on:search-click="Search"/>
    <div id="nav">

    </div>
    <router-view v-bind:region="region" v-bind:type="type"/>
  </div>
</template>

<script>
import Header from './components/layout/Header'


export default {
  name:'app',
  components: {
    Header
  },
  data() {
    return {
      togos: [],
      region: '',
      type: '',
      param: {}
    }
  },
  methods: {
    Search(t, r) {
      let r_length = r.length;
      let _r = '';
      if (r.charAt(0) === "台"){
        _r = _r.concat("臺", r.slice(1, r_length));
      } else {
        _r = r;
      }
      this.region = _r;
      this.type = t;
      alert(this.region+", "+this.type);
    }
  },
  created() {
    
  }
}
</script>
<style>

* {
    box-sizing: border-box;
    margin: 0;
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


</style>
