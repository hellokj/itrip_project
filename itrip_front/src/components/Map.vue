<template lang="pug">
#map(class="row map")
  //- h1 here is map
  //- h2 map {{$route.params}}
  //- h3(v-if="findSpot") you enter by id {{findSpot}}
  button(type="button" @click="printSpots(spots)") 觸發
  l-map(:zoom='zoom', :center='center', style='height: 90%'
        ,@update:center="centerUpdate"
        ,@update:zoom="zoomUpdate")
    l-tile-layer(:url="url", :attribution="attribution", dragging="false")
    l-marker(
        :key="index"
        v-for="(spot, index) in spots"
        :lat-lng="getLatLng(spot.location.coordinates[1], spot.location.coordinates[0])")

  //- div(v-for="spot in spots") 
  //-   h1 {{ spot }}

</template>

<script>
import {LMap, LTileLayer, LMarker, LIcon } from 'vue2-leaflet';
import L from "leaflet";
// import MarkerPopup from "./MarkerPopup";

export default {
  name: 'Map',
    components: {
        LMap,
        LTileLayer,
        LMarker,
        LIcon
    },
  props: {
    spots: Array
  },
  methods: {
    printSpots: function(spots){
      console.log(spots);
    },
    getLatLng: function(lat, lng) {
          return L.latLng(lat, lng);
    },
    zoomUpdate(zoom) {
      this.currentZoom = zoom;
    },
    centerUpdate(center) {
      this.currentCenter = center;
    },
  },
  data() {
    return {
      zoom: 13,
      center: L.latLng(21.41322, 121.219482),
      url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      marker: {
        position: { lng: 121.219482, lat: 21.41322 },
        visible: true,
        draggable: false
      }
    }
  },
  watch: {
    location: function(newValue, oldValue){
      console.log(newValue[1] + 'map' + newValue[0]);
      // this.center = latLng(newValue[1], newValue[0]);
      console.log(this.center);
    }
  },
  computed: {
    findSpot(){
      return this.spots.find(spot=>spot.id==this.$route.params.num);
    }
  },
}
</script>

<style scope lang="sass">
.map
    height: 200vh
    width: 200vh
  
  

</style>
