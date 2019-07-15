<template lang="pug">
#map(:class="{'map-big' : bigMap, 'map-small' : !bigMap}")
  //v-for="(route, index) in (routesArr)"
  l-map(:zoom='zoom', :center='center', style='height: 100%', :options="{zoomControl: false}"
    ,@update:center="centerUpdate"
    ,@update:zoom="zoomUpdate")
    l-tile-layer(:url="url", :attribution="attribution", dragging="false")
    l-control-zoom(:position="zoomControlPosition")
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
import { LMap, LTileLayer, LMarker, LIcon, LPolyline, LPopup, LTooltip, LControlZoom } from 'vue2-leaflet';
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
      LControlZoom,
      MarkerPopover
  },
  data() {
    return {
      zoom: 8,
      currentZoom: 8,
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
    bigMap: Boolean,
    perPage: Number,
    spotPage: Number,
    centerSpot: Object
  },
  mounted() {
    setTimeout(function() { window.dispatchEvent(new Event('resize')) }, 250);
    this.updateMarkers();
  },
  methods: {
    updateMarkers() {
      this.icons = [];
      for(let i = 0; i < this.spotsPerPage; i++){
        this.icons.push(L.AwesomeMarkers.icon({
          icon: '',
          markerColor: 'darkblue',
          prefix: 'fa',
          html: ((i+1) + ((this.spotPage-1) *  this.perPage))
        })
      );
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
      let spot = this.spots[0];
      this.center =  L.latLng(spot.location.coordinates[1], spot.location.coordinates[0]);
      this.zoom = 15;

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
      let newIndex = this.centerSpot.index;
      let location = this.centerSpot.location
      this.center =  L.latLng(location.coordinates[1], location.coordinates[0]);
      // reset old index color
      this.$set(this.icons[oldIndex].options, 'markerColor', 'darkblue');
      // change new index color
      this.$set(this.icons[newIndex].options, 'markerColor', 'red');
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

<style scope >
.map-big{
  width: calc(100vw - 365px);
  height: calc(100vh - 85px);
}
.map-small{
  width: calc(100vw - 730px);
  height: calc(100vh - 85px);
}
.icon::before {
  display: inline-block;
  font-style: normal;
  font-variant: normal;
  text-rendering: auto;
  -webkit-font-smoothing: antialiased;
}
  @media only screen and (max-width: 780px) {


    #map {
      display: none;
    }
  }
</style>
