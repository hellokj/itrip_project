<template>
<div class="map">
  <l-map :zoom="zoom" :center="center" style="height: 100%;" :options="{zoomControl: false}" @update:center="centerUpdate" @update:zoom="zoomUpdate">
    <l-tile-layer :url="url" :attribution="attribution" dragging="false"></l-tile-layer>
    <l-control-zoom :position="zoomControlPosition"></l-control-zoom>
    <l-polyline
      v-for="(day, index) in itinerary.travelInfos"
      :key="index"
      :lat-lngs="getDayRoutes(day)"
      :color="colors[index % 7]"
      :opacity="opacity"
      :weight="weight"
      :visible='true'>
    </l-polyline>
    <l-marker
      v-for="togo in getTotalTogos(itinerary)"
      :icon="icon"
      :key="togo._id"
      :lat-lng="getLatLng(togo.location.coordinates[1], togo.location.coordinates[0])">
    </l-marker>
  </l-map>
</div>
</template>

<script>
import { LMap, LTileLayer, LMarker, LIcon, LPolyline, LPopup, LTooltip, LControlZoom } from 'vue2-leaflet';
import { Icon, divIcon }  from 'leaflet'
import L from "leaflet"

export default {
  name: 'Map',
  components: {
      LMap,
      LTileLayer,
      LMarker,
      LPolyline,
      LControlZoom,
  },
  data() {
    return {
      zoom: 8,
      zoomControlPosition: "topright",
      visible: false,
      center: L.latLng(23.583234, 121.2825975), // taiwan center point
      url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      icon: L.divIcon({
        html: '<i class="fas fa-star" style="color: orange;font-size: 30px;"></i>',
        iconSize: [20, 20],
        className: 'myDivIcon'
      }),
      // polyline options
      color: "black",
      colors: ["#f7534a", "#f7bd4a", "#f7f74a", "#87f74a", "#4af1f7", "#4a5bf7", "#bd4af7"],
      opacity: 0.6,
      weight: 7,
    }
  },
  props: {
    itinerary: Object,
    travelInfos: Array
  },
  mounted() {
  },
  methods: {
    getLatLng: function(lat, lng) {
      return L.latLng(lat, lng);
    },
    zoomUpdate(zoom) {
      this.zoom = zoom;
    },
    centerUpdate(center) {
      this.center = center;
    },
    getDayRoutes: function(day){
      let dayRoutes = [];
      for(let i = 0; i < day[0].routes.length; i++){
        dayRoutes.push(day[0].routes[i]);
      }
      return dayRoutes;
    },
    getTotalTogos: function(itinerary){
      let totalTogos = [];
      // 天數
      for (let i = 0;  i < itinerary.togos.length; i++){
        for (let j = 0; j < itinerary.togos[i].length; j++){
          totalTogos.push(itinerary.togos[i][j]);
        }
      }
      return totalTogos;
    }
  },
  watch: {
    travelInfos: function(){
    },
  },
  computed: {
    
  },
}
</script>

<style scoped>
  .map{
    width: auto;
    height: 100vh;
  }
</style>
