<template>
    <div id="exportBox">
        <div class="togoContainer sortable" :key="index" v-for="(togo,index) in togos" overflow:auto>
            <div class="big-container">
                <!-- <div class="trip-time-container">
                    <p class="my-0 startTime">{{getStartTime(index)}}</p>
                    <div class="circleNum"><b>{{index + 1}}</b></div>
                    <p class="my-0 endTime">{{getEndTime(index)}}</p>
                </div> -->
                <!-- <TogoItem :togo="togo"/> -->
                <h1>{{togo.name}}</h1>
                
            </div>
            <!-- <TravelTimeItem v-if="isTravelTimeShown(index)" v-bind="$attrs" v-on="$listeners" :index="index" :travelTime="travelInfos[index].duration"
                /> -->
        </div>
    </div>
</template>

<script>
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import TogoItem from '../TogoItem';
import TravelTimeItem from '../TravelTimeItem';

export default {
    name: 'ItineraryPdf',
    props: {
        togos: Array
    },
    data() {
        return {
            tripName: '我的旅行'
        }
    },
    methods: {
        handleExport(quality=1) {
            html2canvas(document.querySelector('#exportBox'), {scale: quality, useCORS: true, allowTaint : false}).then(canvas => {
                let pdf = new jsPDF('p', 'mm', 'a4');
                pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 211, 298);
                pdf.save(this.tripName + '.pdf');
            });
        }
    },
    watch: {
        togos: function() {
            //console.log(this.togos);
        }
    },
    created () {
        // [註冊監聽事件]
        this.$bus.$on('save-trip', event => {
            this.handleExport();
        });
    },
    beforeDestroy: function() {
      // [銷毀監聽事件]
      this.$bus.$off('save-trip');
    }
};
</script>

<style scoped>
 
</style>
