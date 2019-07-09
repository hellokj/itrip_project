<template lang="pug">
<<<<<<< HEAD
#map(class="map")
  //- h6 {{ routes[page].routes }}
=======
#map(class=" map")
>>>>>>> 25a5c0163d3a4151854e2a35812048da51356a27
  l-map(:zoom='zoom', :center='center', style='height: 90%'
    ,@update:center="centerUpdate"
    ,@update:zoom="zoomUpdate")
    l-tile-layer(:url="url", :attribution="attribution", dragging="false")
    l-polyline(
    v-for="(route, index) in (routes[page])"
    :lat-lngs="route"
    :color="color"
    :opacity="opacity"
    :weight="weight")
    l-marker(
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
<<<<<<< HEAD

    l-marker(
      :icon="togoIcon"
      v-for="(togo, index) in togos"
      :lat-lng="getLatLng(togo.location.coordinates[1], togo.location.coordinates[0])"
=======
    //- MyMarker
    //- l-marker(
    //-   :icon="chosenIcons[chosenIndex]"
    //-   v-show="false"
    //-   v-for="(spot, chosenIndex) in spots"
    //-   :lat-lng="getLatLng(spot.location.coordinates[1], spot.location.coordinates[0])"
    //- )
    l-marker(
    :icon="togoIcon"
    :key="index"
    v-for="(togo, index) in togos"
    :lat-lng="getLatLng(togo.location.coordinates[1], togo.location.coordinates[0])"
>>>>>>> 25a5c0163d3a4151854e2a35812048da51356a27
    )
</template>

<script>
import { LMap, LTileLayer, LMarker, LIcon, LPolyline, LPopup, LTooltip } from 'vue2-leaflet';
import { Icon }  from 'leaflet'
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
      chosenIcons: [],
      isShow: [],
      togoIcon: L.icon({
        iconUrl: require('../assets/itineraryMarker.png'),
        iconSize: [80, 80]
      }),
       // polyline options
      color: "#FF0000",
      opacity: 0.4,
      weight: 8
    }
  },
  props: {
    spots: Array,
    togos: Array,
    routes: Object,
    page: String
  },
  mounted() {
    for(let i = 0; i < 10; i++){
      this.icons.push(L.icon({
        iconUrl: require('../assets/leaflet_marker/marker'+ (i+1) + '.png'),
        iconSize: [50, 50],
      }));
      this.chosenIcons.push(L.icon({
        iconUrl: require('../assets/leaflet_marker/chosen'+ (i+1) + '.png'),
        iconSize: [45, 45],
      }))
      this.isShow.push(false);
    }
  },
  methods: {
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
      
    }
  },
  watch: {
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
      // 計算 zoom-in
      // this.zoom = 14;
      // var featureGroup = new L.FeatureGroup([
      //   new L.Marker([0,-45]),
      //   new L.Marker([0,45])
      // ]);
      // var zoom = L.Map.getBoundsZoom(featureGroup.getBounds());
      // this.zoom = zoom;
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
  width: calc(100vw - 730px)
  height: calc(100vh - 85px)
</style>
