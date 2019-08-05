<template>
<div class="map" style="width: 50vw; height:60vh">
  <l-map ref="myMap" :zoom="zoom" :center="center" style="height: 100%;" :options="{zoomControl: false}" @update:center="centerUpdate" @update:zoom="zoomUpdate">
    <l-tile-layer :url="url" :attribution="attribution" dragging="false"></l-tile-layer>
    <l-control-zoom :position="zoomControlPosition"></l-control-zoom>
    <l-polyline
      v-for="(day, index) in travelInfos"
      :key="index"
      :lat-lngs="getDayRoutes(day)"
      :color="colors[index % 7]"
      :opacity="opacity"
      :weight="weight"
      :visible='true'>
    </l-polyline>
    <l-marker
      v-for="togo in getTotalTogos(togos)"
      :icon="icon"
      :key="togo._id"
      :lat-lng="getLatLng(togo.location.coordinates[1], togo.location.coordinates[0])">
    </l-marker>
  </l-map>
</div>
</template>

<script>
import { LMap, LTileLayer, LMarker, LIcon, LPolyline, LPopup, LTooltip, LControlZoom, LatLngBounds } from 'vue2-leaflet';
import { Icon, divIcon }  from 'leaflet'
import L from "leaflet"

export default {
  name: 'MemberMap',
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
      center: L.latLng(23.516144859563916, 120.99792480468751), // taiwan center point
      url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      icon: L.divIcon({
        html: '<i class="fas fa-map-pin" style="color: black;font-size:25px;text-shadow:-1px -1px 0 #FFF,1px -1px 0 #FFF,-1px 1px 0 #FFF,1px 1px 0 #FFF;"></i>',
        iconSize: [15, 45],
        className: 'myDivIcon'
      }),
      // polyline options
      color: "black",
      colors: ["#f7534a", "#f7bd4a", "#f7f74a", "#87f74a", "#4af1f7", "#4a5bf7", "#bd4af7"],
      opacity: 0.6,
      weight: 7,
      centerLatLng: [],
      routesArr: []
    }
  },
  props: {
    togos: Array,
    travelInfos: Array
  },
  created() {
    this.resetRoutesArr();
    this.centerRoutes();
    // this.centerLatLng = this.calculateCenterPoin(this.getTotalTogos(this.itinerary));
    // this.center = L.latLng(this.centerLatLng[1], this.centerLatLng[0]);
  },
  mounted() {
    // console.log("total togos", this.getTotalTogos(this.itinerary));
    const map = this.$refs.myMap.mapObject;
    map.addControl(new window.L.Control.Fullscreen());
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
      for (let i = 0; i < day.length; i++){
        dayRoutes = dayRoutes.concat(day[i].routes);
      }
      return dayRoutes;
    },
    getTotalTogos: function(togos){
      let totalTogos = [];
      // 天數
      for (let i = 0;  i < togos.length; i++){
        for (let j = 0; j < togos[i].length; j++){
          totalTogos.push(togos[i][j]);
        }
      }
      return totalTogos;
    },
    calculateCenterPoin: function(spots){
      let lng = 0.0;
      let lat = 0.0;
      for( let i = 0; i < spots.length; i++){
        lng = lng + parseFloat(spots[i].location.coordinates[0]);
        lat = lat + parseFloat(spots[i].location.coordinates[1]);
      }
      lng = lng / spots.length;
      lat = lat / spots.length;
      return [lng, lat];
    },
    resetRoutesArr: function(travelInfos){
      this.routesArr = [];
      for (let i = 0; i < travelInfos.length; i++){
        for (let j = 0; j < travelInfos[i].length; j++){
          this.routesArr = this.routesArr.concat(travelInfos[i][j].routes);
        }
      }
    },
    centerRoutes() {
      const map = this.$refs.myMap.mapObject;
      console.log("routesArr", this.routesArr);
      let myBounds = new L.LatLngBounds(this.routesArr);
      map.fitBounds(myBounds); //Centers and zooms the map around the bounds
    }
  },
  watch: {
    travelInfos: {
      handler: function(newVal, oldVal){
        this.resetRoutesArr(newVal);
        this.centerRoutes();
      },
      deep: true,
    }
  },
  computed: {
    
  },
}
</script>

<style scoped>
  .map {
    margin: 0px auto;
    width: 70%;
    height: 60vh;
    display:inline-block;
    background-color:#eee;
    box-shadow:0px 0px 9px #ffb061;
  }
</style>
