<template lang="pug">
#map(:class="{'map-big' : bigMap, 'map-small' : !bigMap}")
  //v-for="(route, index) in (routesArr)"
  l-map(:zoom='zoom', :center='center'
    ,@update:center="centerUpdate"
    ,@update:zoom="zoomUpdate")
    l-tile-layer(:url="url", :attribution="attribution", dragging="false")
    l-polyline(
    v-if="isRouteArr"
    :lat-lngs="routesArr"
    :color="color"
    :opacity="opacity"
    :weight="weight")
    l-marker(
      @mouseover="mouseOver"
      @mouseout="mouseOut"
      :icon="icons[index]"
      v-for="(spot, index) in spots"
      :lat-lng="getLatLng(spot.location.coordinates[1], spot.location.coordinates[0])"
    )
      l-tooltip
        MarkerPopover(
          :name="spots[index].name"
          :address="spots[index].address"
          :images="spots[index].images"
        )

    l-marker(
      v-for="(togo, index) in togos"
      :icon="togoIcons[index]"
      :lat-lng="getLatLng(togo.location.coordinates[1], togo.location.coordinates[0])"
    )
</template>

<script>
import { LMap, LTileLayer, LMarker, LIcon, LPolyline, LPopup, LTooltip } from 'vue2-leaflet';
import { Icon, divIcon }  from 'leaflet'
import { AwesomeMarkers } from 'leaflet.awesome-markers'
import MarkerPopover from '../components/template/MarkerPopover'
import Vue from 'vue'
import L from "leaflet"

export default {
  name: 'Map',
  components: {
      LMap,
      LTileLayer,
      LMarker,
      LIcon,
      LPolyline,
      LPopup,
      LTooltip,
      MarkerPopover
  },
  data() {
    return {
      zoom: 8,
      currentZoom: 8,
      visible: false,
      currentCenter: L.latLng(23.583234, 121.2825975),
      center: L.latLng(23.583234, 121.2825975), // taiwan center point
      url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      icons: [],
      togoIcons: [],
      spotsPerPage: 10,
       // polyline options
      color: "#FF0000",
      opacity: 0.6,
      weight: 7,
      routesArr: [],
      currentPage: 0,
      currentTogoNum: 0
    }
  },
  props: {
    spots: Array,
    togos: Array,
    routes: Object,
    page: Number,
    bigMap: Boolean
  },
  mounted() {
    setTimeout(function() { window.dispatchEvent(new Event('resize')) }, 250);
    for(let i = 0; i < this.spotsPerPage; i++){
      this.icons.push(L.AwesomeMarkers.icon({
        icon: '',
        markerColor: 'darkblue',
        prefix: 'fa',
        html: (i+1)
      })
        // iconUrl: require('../assets/leaflet_marker/marker'+ (i+1) + '.png'),
        // iconSize: [50, 50],
      );
    }
  },
  methods: {
    mouseOver(evt) {
      this.$set(evt.target.options.icon.options, 'markerColor', 'red');
    },
    mouseOut(evt) {
      this.$set(evt.target.options.icon.options, 'markerColor', 'darkblue');
    },
    visbleUpdate(visible){
      this.visible = visible;
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
    showSpot: function(spotIndex) {
      alert(this.spots[spotIndex].name);
    },
    getDistance: function(point1, point2){ // 兩座標點求實際距離

    },
    calculateCenterPoin: function(spots){
      let lng = 0.0;
      let lat = 0.0;
      for( let i = 0; i < spots.length; i++){
        lng = lng + parseFloat(spots[i][0]);
        lat = lat + parseFloat(spots[i][1]);
      }
      lng = lng / spots.length;
      lat = lat / spots.length;
      return [lng, lat];
    },
    calculateZoom: function(){

    },
    setZoom: function(){
      
    },
    resetRoutesArr: function(){
      if(this.routes[this.currentPage] === undefined) {
        this.routesArr = [];
        return;
      }
      this.routesArr = this.routes[this.currentPage].routes;
    }
  },
  // updated() {
  //   //this.routesArr = this.routes[this.page].routes;
  // },
  watch: {
    togos: function() {
      let togoIcon = L.AwesomeMarkers.icon({
        icon: '',
        markerColor: 'red',
        prefix: 'fa',
        html: this.togos.length
      });
      this.togoIcons.push(togoIcon);
    },
    page: function(){
      this.currentPage = this.page;
      this.resetRoutesArr();
    },
    spots: function(){
      // 計算搜尋出的景點中心點位置
      let lng = 0.0;
      let lat = 0.0;
      // 用以計算地圖縮放 確保每一景點都會呈現在地圖中
      let maxLng = 0.0;
      let maxLat = 0.0;
      let minLng = 0.0;
      let minLat = 0.0;
      for( let i = 0; i < this.spots.length; i++){
        let currentLng = parseFloat(this.spots[i].location.coordinates[0]);
        let currentLat = parseFloat(this.spots[i].location.coordinates[1]);
        if (currentLng > maxLng){
          maxLng = currentLng;
        }
        if (currentLat > maxLat){
          maxLat = currentLat;
        }
        if (currentLng < minLng){
          minLng = currentLng;
        }
        if (currentLat < minLat){
          minLat = currentLat;
        }
        lng = lng + currentLng;
        lat = lat + currentLat;
      }
      lng = lng / this.spots.length;
      lat = lat / this.spots.length;
      this.center = L.latLng(lat, lng);
      this.zoom = 13;
      // 計算 zoom-in
      // this.zoom = 14;
      // var featureGroup = new L.FeatureGroup([
      //   new L.Marker([0,-45]),
      //   new L.Marker([0,45])
      // ]);
      // var zoom = L.Map.getBoundsZoom(featureGroup.getBounds());
      // this.zoom = zoom;
    },
    routes: {
      handler() {
        this.resetRoutesArr();
      },
      deep: true
    }
  },
  computed: {
    findSpot(){
      return this.spots.find(spot=>spot.id==this.$route.params.num);
    },
    isRouteArr() {
      if(this.routesArr.length == 0) return false;
      else {
        return true;
      }
    }
  },
}
</script>

<style scope lang="sass">
.map-big
  width: calc(100vw - 365px)
  height: calc(100vh - 85px)
.map-small
  width: calc(100vw - 730px)
  height: calc(100vh - 85px)
.icon::before 
  display: inline-block
  font-style: normal
  font-variant: normal
  text-rendering: auto
  -webkit-font-smoothing: antialiased
</style>
