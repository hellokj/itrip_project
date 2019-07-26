<template>
  <div class="map" id="map">
    <l-map :zoom="zoom" :center="center" style="height: 100%;" :options="{zoomControl: false}" @update:center="centerUpdate" @update:zoom="zoomUpdate">
      <l-tile-layer :url="url" :attribution="attribution" dragging="false"></l-tile-layer>
      <l-control-zoom :position="zoomControlPosition"></l-control-zoom>
      <l-polyline v-if="isRouteArr" :lat-lngs="routesArr" :color="color" :opacity="opacity" :weight="weight"></l-polyline>
      <l-marker ref="marker" :key="spot._id" @mouseover="mouseOver" @mouseout="mouseOut" @add="openPopup($event, index, selectedSpot)" :icon="icons[index]" v-for="(spot, index) in spots" :lat-lng="getLatLng(spot.location.coordinates[1], spot.location.coordinates[0])">
        <l-popup :options="{autoClose: false, closeOnClick: false}">
          <div class="name"><b>{{ spots[index].name }}</b></div>
          <div class="addr">{{ Address(index) }}</div>
        </l-popup>
        <l-tooltip>
          <MarkerPopover :name="spots[index].name" :address="spots[index].address"></MarkerPopover>
        </l-tooltip>
      </l-marker>
      <l-marker :key="togo._id" v-for="(togo, index) in togos" :icon="togoIcons[index]" :lat-lng="getLatLng(togo.location.coordinates[1], togo.location.coordinates[0])"></l-marker>
    </l-map>
  </div>
</template>
<script>
import { LMap, LTileLayer, LMarker, LIcon, LPolyline, LPopup, LTooltip, LControlZoom } from 'vue2-leaflet';
import { Icon, divIcon }  from 'leaflet'
import { AwesomeMarkers } from 'leaflet.awesome-markers'
import MarkerPopover from '../components/template/MarkerPopover' 
import Vue from 'vue'
import L from "leaflet"
import {getAddress} from '../../utils/checker.js'

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
      color: "#fc9d03",
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
    perPage: Number,
    spotPage: Number,
    centerSpot: Object,
    selectedSpot: Number,
    updateMap: Number
  },
  mounted() {
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
          text: ((i+1) + ((this.spotPage-1) *  this.perPage))
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
          event.target.openPopup();
        }
      });
    },
    getPopupContent(index) {
      return this.spots[index].name;
    },
    Address(index) {
      return getAddress(this.spots[index].address);
    },
    resetTogosIcon() {
      for(let i=0;i<this.togos.length;i++) {
        let togoIcon = L.divIcon({
          html: '<i class="fas fa-star" style="color: orange;font-size: 30px;"></i>',
          iconSize: [20, 20],
          className: 'myDivIcon'
        });
        this.togoIcons.push(togoIcon);
      }
    }
  },
  watch: {
    togos: function(newVal, oldVal) {
      let togoIcon = L.divIcon({
      html: '<i class="fas fa-star" style="color: orange;font-size: 30px;"></i>',
      iconSize: [20, 20],
      className: 'myDivIcon'
    });
      this.togoIcons.push(togoIcon);
      this.updateMarkers();
    },
    page: function(){
      this.currentPage = this.page;
      this.resetRoutesArr();
    },
    spots: function(){
      let spot = this.spots[0];
      this.center =  L.latLng(spot.location.coordinates[1], spot.location.coordinates[0]);
      this.zoom = 12;
    },
    routes: {
      handler() {
        this.resetRoutesArr();
      },
      deep: true
    },
    spotPage: function() {
      this.updateMarkers();
    },
    centerSpot: function(newVal, oldVal) {
      let oldIndex = oldVal.index;
      let newIndex = newVal.index;
      let location = newVal.location
      this.center =  L.latLng(location.coordinates[1], location.coordinates[0]);
      for(let i=0;i<this.icons.length;i++) {
        if(this.icons[i] !== undefined) {
          if(i == newIndex) {
          this.$set(this.icons[i].options, 'markerColor', 'red');
          }
          else {
            this.$set(this.icons[i].options, 'markerColor', 'darkblue');
          }
        }
      }
      this.zoom = this.centerSpot.zoom;
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
    height: 43vh;
  }
  .icon::before {
    display: inline-block;
    font-style: normal;
    font-variant: normal;
    text-rendering: auto;
    -webkit-font-smoothing: antialiased;
  }
  @media only screen and (max-width: 767px) {
    #map {
      width: 100%;
      height: 80%;
      margin-bottom: 70px;
    }
  }
</style>
