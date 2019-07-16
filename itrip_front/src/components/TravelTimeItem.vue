<template>
    <div class="travelTime-item">
        <div class="select">
            <select v-model="current" v-on:change="onModesChange">
                <option :key="index" v-for="(mode, index) in modes" :value="mode.value">
                    {{mode.text}}
                </option>
            </select>
        </div>
        <p style="font-size: 18px; padding-left: 20px; padding-top: 10px;">約 {{formatTime(travelTime)}}</p>
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

<style scoped lang="sass">
    .travelTime-item
        width: 100%
        display: flex
        flex-direction: row
    select 
        option
            font-family: 'Font Awesome\ 5 Free', monospace
            font-weight: 900
        font-family: 'Font Awesome\ 5 Free', monospace
        font-weight: 900
        font-size: 25px
        margin-top: 10px
    
    

</style>
