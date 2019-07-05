<template>
    <div class="row map">
        <l-map :zoom="zoom" :center="center">
            <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
            <l-marker 
                :key="index"
                v-for="(brew, index) in brews"
                :lat-lng="latLng(brew.latitude, brew.longitude)">
            </l-marker>
        </l-map>
    </div>
</template>

<script>
import L from 'leaflet'
import * as Vue2Leaflet from 'vue2-leaflet'
import Vue from 'vue';

Vue.component('l-map', Vue2Leaflet.LMap)
Vue.component('l-tile-layer', Vue2Leaflet.LTileLayer)
Vue.component('l-marker', Vue2Leaflet.LMarker)

export default {
    name: "Map",
    data: function() {
        return {
            zoom:13,
            center: L.latLng(47.413220, -1.219482),
            url:'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
            attribution:'&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
            marker: L.latLng(47.413220, -1.219482),
        }
    },
    methods: {
        latLng: function(lat, lng) {
            return L.latLng(lat, lng);
        }
    }
}
</script>
<style scoped>
    .map {
        height: 70vh;
        width: 70vh
    }
</style>
