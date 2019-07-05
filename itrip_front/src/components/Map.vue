<template lang="pug">
#map(class="row map")
  //- h1 here is map
  //- h2 map {{$route.params}}
  //- h3(v-if="findSpot") you enter by id {{findSpot}}
  l-map(:zoom='zoom', :center='center', style='height: 90%'
        ,@update:center="centerUpdate"
        ,@update:zoom="zoomUpdate")
    l-tile-layer(:url="url", :attribution="attribution", dragging="false")
</template>

<script>
import {LMap, LTileLayer, LMarker } from 'vue2-leaflet';
import { latLng } from "leaflet";
const marker = {
  position: { lng: 121.219482, lat: 21.41322 },
  visible: true,
  draggable: true,
}
// import MarkerPopup from "./MarkerPopup";

export default {
  name: 'MyAwesomeMap',
    components: {
        LMap,
        LTileLayer,
        LMarker
    },
  props: [
    "location"
  ],
  methods: {
    zoomUpdate(zoom) {
      this.currentZoom = zoom;
    },
    centerUpdate(center) {
      this.currentCenter = center;
    },
  },
  data() {
    return {
      spots: [
        { id: 1, name: '安平古堡'},
        { id: 2, name: '摸乳巷'}
      ],
      zoom: 13,
      center: latLng(47.41322, -1.219482),
      url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
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
    height: 50vh
    width: 50vh
  
  

</style>
