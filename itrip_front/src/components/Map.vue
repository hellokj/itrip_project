<template lang="pug">
#map(class="row map")
  //- h1 here is map
  //- h2 map {{$route.params}}
  //- h3(v-if="findSpot") you enter by id {{findSpot}}
  l-map(:zoom='zoom', :center='center', style='height: 90%'
    ,@update:center="centerUpdate"
    ,@update:zoom="zoomUpdate")
    l-tile-layer(:url="url", :attribution="attribution", dragging="false")
    l-marker(
      :icon="icons[index]"
      :key="index"
      v-for="(spot, index) in spots"
      :lat-lng="getLatLng(spot.location.coordinates[1], spot.location.coordinates[0])"
    )
    l-marker(
    :icon="togoIcon"
    :key="index"
    v-for="(togo, index) in togos"
    :lat-lng="getLatLng(togo.location.coordinates[1], togo.location.coordinates[0])"
    )
    //- l-marker(
    //-   v-for="(spot, index) in spots"
    //-   :key="index"
    //-   v-if="togos[0].includes(spot)"
    //-   :icon="togoIcon"
    //-   :lat-lng="getLatLng(spot.location.coordinates[1], spot.location.coordinates[0])"
    //- )

  //- div(v-for="spot in spots") 
  //-   h1 {{ spot }}

</template>

<script>
import {LMap, LTileLayer, LMarker, LIcon } from 'vue2-leaflet';
import { Icon }  from 'leaflet'
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
    spots: Array,
    togos: Array
  },
  mounted() {
    for( let i = 0; i < 10; i++){
      this.icons.push(L.icon({
        iconUrl: require('../assets/leaflet_marker/marker'+ (i+1) + '.png'),
        iconSize: [45, 45],
      }));
    }
  },
  methods: {
    getLatLng: function(lat, lng) {
      return L.latLng(lat, lng);
    },
    zoomUpdate(zoom) {
      this.currentZoom = zoom;
    },
    centerUpdate(center) {
      console.log(this.togos)
      this.currentCenter = center;
      console.log(this.togos);
    },
  },
  data() {
    return {
      zoom: 8,
      center: L.latLng(23.583234, 121.2825975),
      url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      // marker: {
      //   position: { lng: 121.219482, lat: 21.41322 },
      //   visible: true,
      //   draggable: false
      // }
      icons: [],
      togoIcon: L.icon({
        iconUrl: require('../assets/logo.png'),
        iconSize: [45, 45]
      })
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
    height: 100vh
    width: 100vh
</style>
