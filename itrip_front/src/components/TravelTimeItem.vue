<template>
    <div class="travelTime-item">
        <b-container>
            <b-row class="ml-0 my-0 px-0 py-0">
                <b-col class="mx-0 my-0 px-0 py-0">
                    <div class="select">
                        <select v-model="current" v-on:change="onModesChange">
                            <option :key="index" v-for="(mode, index) in modes" :value="mode.value">
                                {{mode.text}}
                            </option>
                        </select>
                    </div>
                </b-col>
                <b-col class="mx-0 my-0 px-0 py-0">
                    <p class="mx-0 my-0 px-0 py-0">約 {{formatTime(travelTime)}}</p>
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
        travelTime: Number,
        index: Number
    },
    data() {
        return {
            modes: [
                {value: 0, class: 'fas fa-car-alt', text: '\uf5de', apiName: 'driving-car'},
                {value: 1, class: 'fas fa-biking', text: '\uf84a', apiName: 'cycling-regular'},
                {value: 2, class: 'fas fa-walking', text: '\uf554', apiName: 'foot-walking'} 
            ],
            current: 0
        }
    },
    methods: {
        onModesChange() {
            this.$emit('changeMode', this.index, this.modes[this.current].apiName);
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

<style scoped lang="sass">
select 
  option 
    font-family: 'Font Awesome\ 5 Free', monospace
    font-weight: 900
  font-family: 'Font Awesome\ 5 Free', monospace
  font-weight: 900
    

</style>
