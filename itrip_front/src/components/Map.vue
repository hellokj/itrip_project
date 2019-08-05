<template>
  <div class="map" id="map">
    <l-map ref="myMap" :zoom="zoom" :center="center" style="height: 100%;" :options="{zoomControl: false}" @update:center="centerUpdate" @update:zoom="zoomUpdate">
      <l-tile-layer :url="url" :attribution="attribution" dragging="false"></l-tile-layer>
      <l-control-zoom :position="zoomControlPosition"></l-control-zoom>
      <l-polyline
      v-if="isRouteArr && checkList.includes('路徑指示')"
      :lat-lngs="routesArr" :color="colors[0 % 7]" :opacity="opacity" :weight="weight"></l-polyline>
      <div class="spot-marker" :key="spot._id" v-for="(spot, index) in spots">
        <l-marker ref="marker"  v-if="checkList.includes('景點圖標')"
        :icon="icons[index]" :lat-lng="getLatLng(spot.location.coordinates[1], spot.location.coordinates[0])"
        @mouseover="mouseOver" @mouseout="mouseOut" @add="openPopup($event, index, selectedSpot)">
          <l-popup :options="{autoClose: false, closeOnClick: false}" style="width:auto;height:10px;">
            <div class="name"><b>{{ spots[index].name }}</b></div>
          </l-popup>
        </l-marker>
      </div>
      <div class="route-marker" :key="index" v-for="(togo, index) in togos" >
        <l-marker v-if="checkList.includes('路徑指示')"
        :icon="togoIcons[index]" :lat-lng="getLatLng(togo.location.coordinates[1], togo.location.coordinates[0])"
        @add="openTogosPopup($event)">
        </l-marker>
      </div>
    </l-map>
  </div>
</template>
<script>
import { LMap, LTileLayer, LMarker, LIcon, LPolyline, LPopup, LTooltip, LControlZoom, LatLngBounds } from 'vue2-leaflet';
import { Icon, divIcon }  from 'leaflet'
import { AwesomeMarkers } from 'leaflet.awesome-markers'
import MarkerPopover from '../components/template/MarkerPopover' 
import Vue from 'vue'
import L from "leaflet"
import { getAddress } from '../../utils/checker.js'

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
      LControlZoom,
      MarkerPopover
  },
  data() {
    return {
      zoom: 15,
      currentZoom: 15,
      zoomControlPosition: "topright",
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
      className: 'my_polyline',
      color: "black",
      colors: ["#f7534a", "#f7bd4a", "#f7f74a", "#87f74a", "#4af1f7", "#4a5bf7", "#bd4af7"],
      opacity: 1,
      weight: 8,
      routesArr: [],
      currentPage: 0,
      currentTogoNum: 0,
    }
  },
  props: {
    spots: Array,
    togos: Array,
    routes: Object,
    page: Number,
    perPage: Number,
    spotPage: Number,
    centerSpot: Object,
    selectedSpot: Number,
    updateMap: Number,
    isSpotIconShown: Boolean,
    checkList: Array,
  },
  mounted() {
    const map = this.$refs.myMap.mapObject;
    map.addControl(new window.L.Control.Fullscreen());
    this.updateMarkers();
    this.resetTogosIcon();
    this.resetRoutesArr();
  },
  methods: {
    updateMarkers() {
      this.icons = [];
      for(let i = 0; i < this.spotsPerPage; i++){
        this.icons.push(L.AwesomeMarkers.icon({
          icon: '',
          markerColor: 'darkblue',
          prefix: 'fa',
          text: ((i+1) + ((this.spotPage-1) *  this.perPage)),
        }));
      }
    },
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
    resetRoutesArr: function(){
      if(this.routes[this.currentPage] === undefined) {
        this.routesArr = [];
        return;
      }
      this.routesArr = this.routes[this.currentPage].routes;
    },
    openPopup: function(event, index, selectedSpot) {
      this.$nextTick( ()=> {
        if(index === selectedSpot) {
          setTimeout(() => {
             event.target.openPopup();
          }, 500);
        }
      });
    },
    openTogosPopup: function(event) {
      this.$nextTick( ()=> {
          setTimeout(() => {
             event.target.openPopup();
          }, 500);
      });
    },
    getPopupContent(index) {
      return this.spots[index].name;
    },
    Address(index) {
      return getAddress(this.spots[index].address);
    },
    resetTogosIcon() {
      this.togoIcons = [];
      if(this.togos !== undefined) {
        for(let i=0;i<this.togos.length;i++) {
          let togoIcon = L.divIcon({
            html: '<i class="fas fa-map-pin" style="color: black;font-size:25px;text-shadow:-1px -1px 0 #FFF,1px -1px 0 #FFF,-1px 1px 0 #FFF,1px 1px 0 #FFF;">' + (i+1) + '</i>',
            iconSize: [15, 45],
            className: 'myDivIcon'
           });
          this.togoIcons.push(togoIcon);
        }
      }
    },
    centerRoutes() {
      //console.log(this.routesArr);
      if(this.routesArr.length != 0) {
        const map = this.$refs.myMap.mapObject;
        let myBounds = new L.LatLngBounds(this.routesArr);
        map.fitBounds(myBounds); //Centers and zooms the map around the bounds
      }
      
    }
  },
  watch: {
    togos: function(newVal, oldVal) {
      if(newVal !== undefined) {
        this.resetTogosIcon();
        this.updateMarkers();
        //this.resetRoutesArr();
        //this.centerRoutes();
      }
    },
    page: function(){
      this.currentPage = this.page;
      this.resetRoutesArr();
    },
    spots: function(newVal, oldVal){
      if(newVal[0] !== undefined) {
        let spot = this.spots[0];
        this.center =  L.latLng(spot.location.coordinates[1], spot.location.coordinates[0]);
        this.zoom = 12;
      }
    },
    routes: {
      handler(newVal, oldVal) {
        this.resetRoutesArr();
        this.centerRoutes()
      },
      deep: true
    },
    spotPage: function() {
      this.updateMarkers();
    },
    centerSpot: {
      handler(newVal, oldVal) {
        this.resetRoutesArr();
        let oldIndex = oldVal.index;
        let newIndex = newVal.index;
        let location = newVal.location
        this.center =  L.latLng(location.coordinates[1], location.coordinates[0]);
        this.zoom = this.centerSpot.zoom;
      },
      deep: true
    },
  },
  computed: {
    isRouteArr() {
      if(this.routesArr.length == 0) return false;
      else {
        return true;
      }
    },
  },
}
</script>

<style scoped>
  .map{
    width: auto;
    height: 50%;
  }
  .icon::before {
    display: inline-block;
    font-style: normal;
    font-variant: normal;
    text-rendering: auto;
    -webkit-font-smoothing: antialiased;
  }
  .my_polyline {
    stroke: white;
    fill: white;
    stroke-dasharray: 10,10; 
    stroke-width: 10;  
  }
 
  @media only screen and (max-width: 1024px) {
    #map {
      width: 100%;
      height: 80%;
      margin-bottom: 70px;
    }
  }
</style>
