<template>
    <div class="travelTime-item">
        <b-row >
            <b-col class="select">
                <b-row>
                    <b-col cols="2" style="display:flex;justify-content:center;">
                        <i class="fas fa-angle-double-down"></i>
                    </b-col>
                    <b-col>
                        <b-row style="width:auto;">
                            <i id="modes" :class="getIcon(mode)"></i>
                            <p class="ml-2 py-0 my-0" style="font-size:15px;padding-top:10px;text-align:left;">約 {{formatTime(travelTime)}}</p>
                        </b-row>
                    </b-col>
                    <b-col cols="2" class="pl-0" style="display:flex;justify-content:center;">
                        <i class="fas fa-angle-double-down"></i>
                    </b-col>
                </b-row> 
            </b-col>
        </b-row>
    </div>
</template>

<script>
export default {
  name: "MobileTravelTimeItem",
  props: {
      travelTime: Number,
      index: Number,
      mode: String
  },
  data() {
    return {

    }
  },
  methods: {
    getIcon: function(mode){
      if (mode == 'driving-car'){
        return 'fas fa-car-alt';
      }
      if (mode == 'cycling-regular'){
        return 'fas fa-biking';
      }
      if (mode == 'foot-walking'){
        return 'fas fa-walking';
      }
    },
    carryTimeUnit(time) {
      return Math.floor(time / 60);
    },
    formatTime(sec) {
      // to mins
      let mins = this.carryTimeUnit(sec);
      let remainingSec = Math.floor(sec % mins);

      if(mins >= 60) {
        let hours = Math.floor(mins / 60);
        let remainingMins = Math.floor(mins % 60);
        return hours + '小時 ' + remainingMins + '分 ';  
      }
      else if(mins == 0) {
        return sec + '秒';
      }
      else {
        return mins + '分 ';
      }
    }
  },
}
</script>

<style scoped>
    .travelTime-item {
        display: flex;
        flex-direction: row;
        justify-content: center;     
    }
    .fa-car-alt {
        font-size: 25px;
    }
    .fa-biking {
        font-size: 25px;
    }
    .fa-walking {
        font-size: 25px;
    }
    .fa-angle-double-down {
        font-size: 23px;
    }
    #modes:hover {
        border: 1px solid #34c0eb;
        box-shadow: 0 0 5px #34c0eb;
    }
</style>
