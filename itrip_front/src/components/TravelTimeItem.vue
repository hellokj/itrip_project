<template>
    <div class="travelTime-item">
        <b-row>
            <b-col class="select">
                <b-row>
                    <b-col cols="2" style="display:flex;justify-content:center;">
                        <i class="fas fa-angle-double-down"></i>
                    </b-col>
                    <b-col>
                        <b-row style="width:auto;">
                            <a-dropdown :trigger="['click']">
                                <a class="ant-dropdown-link">
                                <i :class="modes[current].class"></i>
                                <a-icon type="down" />
                                </a>
                                <a-menu slot="overlay">
                                    <a-menu-item :key="index" v-for="(mode, index) in modes" :value="mode.value" @click="onModesChange(index)">
                                        <i :class="modes[index].class"></i>
                                    </a-menu-item>
                                </a-menu>
                            </a-dropdown>
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
        onModesChange(index) {
            this.current = index;
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
        
    
</style>
