<template lang="pug">
#map(class="row map")
  //- h1 here is map
  //- h2 map {{$route.params}}
  //- h3(v-if="findSpot") you enter by id {{findSpot}}
  //- h5(v-model="getRoutesData") {{ routes[0].coordinates }}
  l-map(:zoom='zoom', :center='center', style='height: 90%'
    ,@update:center="centerUpdate"
    ,@update:zoom="zoomUpdate")
    l-polyline(
      v-for="(route, index) in routes"
      :lat-lngs="routes[index].coordinates"
      :color="color")
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

</template>

<script>
import {LMap, LTileLayer, LMarker, LIcon, LPolyline } from 'vue2-leaflet';
import { Icon }  from 'leaflet'
import L from "leaflet";

export default {
  name: 'Map',
    components: {
        LMap,
        LTileLayer,
        LMarker,
        LIcon,
        LPolyline
    },
  props: {
    spots: Array,
    togos: Array,
    routes: Array
  },
  mounted() {
    console.log(this.routes);
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
      this.currentCenter = center;
    },
  },
  data() {
    return {
      zoom: 8,
      center: L.latLng(23.583234, 121.2825975), // taiwan center point
      url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      icons: [],
      togoIcon: L.icon({
        iconUrl: require('../assets/logo.png'),
        iconSize: [45, 45]
      }),
      // routes: [ // for each route
      //   { // first test route
      //     latlngs: [
      //       [47.2263299, -1.6222],
      //       [47.21024000000001, -1.6270065],
      //       [47.1969447, -1.6136169],
      //       [47.18527929999999, -1.6143036],
      //       [47.1794457, -1.6098404],
      //       [47.1775788, -1.5985107],
      //       [47.1676598, -1.5753365],
      //       [47.1593731, -1.5521622],
      //       [47.1593731, -1.5319061],
      //       [47.1722111, -1.5143967],
      //       [47.1960115, -1.4841843],
      //       [47.2095404, -1.4848709],
      //       [47.2291277, -1.4683914],
      //       [47.2533687, -1.5116501],
      //       [47.2577961, -1.5531921],
      //       [47.26828069, -1.5621185],
      //       [47.2657179, -1.589241],
      //       [47.2589612, -1.6204834],
      //       [47.237287, -1.6266632],
      //       [47.2263299, -1.6222]
      //     ],
      //     color: "#ff00ff"
      //   }
      // ],
      color: "#ff00ff",
    }
  },
  watch: {
    getRoutesData: function(){
      console.log("there are routes.")
      if (this.routes.length > 0){
        return true;
      }
      return false;
    }
  },
  computed: {
    findSpot(){
      return this.spots.find(spot=>spot.id==this.$route.params.num);
    },
  },
}
</script>

<style scope lang="sass">
.map
    height: 100vh
    width: 100vh
</style>
