<template>
    <div class="container">
        <Spots
          id="spots"
          class="spots"
          :paginator="paginator" :spots="spots" :perPage="perPage" 
          @hoverSpotItem="hoverSpotItem"
          @add-spot="addSpotToTrip"
          @get-spot="callGetSpotApi"
          @sort-spot="callGetSpotApi"/>
        <Map 
          id="map"
          class="map"
          bigMap="!showSpots" :spots="spots" :togos="togos[page]" :routes="routes" 
          :page="page" :perPage="perPage" :spotPage="spotPage" :centerSpot="centerSpot"/>
    </div>
</template>

<script>
import Vue from 'vue'
import Spots from '../components/Spots'
import Map from '../components/Map'

export default {
  name: 'MapView',
  components: {
    Spots, Map
  },
  data() {
    return {
      
    }
  },
  methods: {
    
  },
}
</script>

<style scoped>
    .container {
        display: flex;
        flex-direction: row;
    }
</style>
