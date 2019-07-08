<template>
    <div class="travelTime-item">
        <b-container>
            <b-row class="ml-0 my-0 px-0 py-0">
                <b-col class="mx-0 my-0 px-0 py-0">
                    <select v-model="current" v-on:change="onModesChange">
                        <option :key="index" v-for="(mode, index) in modes" :value="mode.value">
                            {{mode.text}}
                        </option>
                    </select>
                </b-col>
                <b-col class="mx-0 my-0 px-0 py-0">
                    <p class="mx-0 my-0 px-0 py-0">{{formatTime(travelTime)}}</p>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
export default {
    name: "TravelTimeItem",
    props: {
        togo: Object,
        travelTime: Object
    },
    data() {
        return {
            modes: [
                {value: 0, text: '開車'},
                {value: 1, text: '步行'},
                {value: 2, text: '自行車'} 
            ],
            current: 0
        }
    },
    methods: {
        onModesChange() {
            console.log(this.modes[this.current].text)
        },
        carryTimeUnit(time) {
            return Math.floor(time / 60);
        },
        formatTime(sec) {
            // to mins
            let mins = this.carryTimeUnit(sec);
            let remainingSec = Math.floor(sec % mins);

            if(mins >= 60) {
                let hours = mins / 60;
                let remainingMins = Math.floor(mins % hours);
                return hours + '小時 ' + remainingMins + '分 ' + remainingSec + '秒';  
            }
            else if(mins == 0) {
                return sec + '秒';
            }
            else {
                return mins + '分 ' + remainingSec + '秒';
            }
        }
    },
}
</script>

<style scoped>
  /* .togo-item {
      width: 355px;
      background: #ffffff;
      padding: 10px;
      border-bottom: 1p #ccc dotted;
      color: #000000;
  }

  .del {
      background: #ffffff;
      color: #515151;
      border: none;
      padding: 5px 9px;
      border-radius: 50%;
      cursor: pointer;
      float: right;
  } */
</style>
