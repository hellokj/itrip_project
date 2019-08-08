<template>
<div class="export-container">

</div>

</template>

<script>
import jsPDF from 'jspdf'
import 'jspdf-autotable';
import font from '../../../utils/msyh-normal.js'
import {getAddress} from '../../../utils/checker.js'

export default {
    name: 'ItineraryPdf',
    props: {
        togos: Array,
        travelInfos: Array,
    },
    data() {
        return {
            tripName: '',
            tripDate: '',
            dateString: '',
        }
    },
    methods: {
        generate: function() {
            var doc = new jsPDF();

            // //不加這個中文會亂碼
            doc.addFileToVFS('mysh-normal.ttf', font);
            doc.addFont('mysh-normal.ttf', 'msyh', 'normal');
            doc.setFont('msyh');
            doc.text('旅行名稱: ' + this.tripName + '  出發日期: ' + this.dateString, 14, 10);
            for(let i=0;i<this.togos.length;i++) {
                let finalY;
                if(i > 0) {
                    finalY = doc.previousAutoTable.finalY;
                }
                else {
                    finalY = 20;
                }
                var head = [["時間", "景點", "地址",  "備忘錄"]];
                var body = this.makeBody(i);
                doc.text('-Day ' + (i + 1) + '-', 14, finalY + 15);
                doc.autoTable({
                    head: head, 
                    body: body, 
                    startY: finalY + 20, 
                    bodyStyles: {valign: 'top'},
                    styles: {overflow: 'linebreak', cellWidth: 'wrap', rowPageBreak: 'auto', halign: 'justify', font: 'msyh'},
                    columnStyles: {text: {cellWidth: 'auto'}}})
            }
            doc.output("dataurlnewwindow");
            let sec = Math.floor(Math.random()*10000)+1000
            let self = this;
            let memberId, memberName;
            if(this.$store.state.user == null) {
                memberId = 'guest';
                memberName = 'guest';
            }
            else {
                memberId = this.$store.state.user.id;
                memberName = this.$store.state.user.name;
            }
            setTimeout(() => {
              self.$socket.emit('notifyMessage',
               {name: self.tripName, memberId: memberId, memberName: memberName, sec: Math.floor(sec/1000), type: 'pdf'});
            }, sec);
        },
        makeBody: function(dayIndex) {
            let wholeItinerary = [];
            let day = [];
            for(let j=0;j<this.togos[dayIndex].length;j++) {
                let spot = [];
                let travelTime = [];
                spot.push(this.stayTimeFormat(dayIndex, j));
                spot.push(this.togos[dayIndex][j].name);
                spot.push(getAddress(this.togos[dayIndex][j].address));
                if(this.togos[dayIndex][j].memo !== undefined) {
                    spot.push(this.togos[dayIndex][j].memo);
                }
                else {
                    spot.push(" ");
                }
                day.push(spot);
                if(j < this.togos[dayIndex].length - 1) {
                    let travelInfo = this.travelInfos[dayIndex][j];
                    travelTime.push('');
                    travelTime.push('');
                    travelTime.push('↓' + this.trafficFormat(travelInfo.mode, travelInfo.duration) + '↓');
                    day.push(travelTime);
                }
            }
            return day;
        },
        stayTimeFormat: function(dayIndex, index) {
            let startTime = this.togos[dayIndex][index].startTime;
            let endTime = this.togos[dayIndex][index].endTime;
            
            return startTime.hr.toString().padStart(2, '0') + ':' + startTime.min.toString().padStart(2, 0) + 
            ' - ' + endTime.hr.toString().padStart(2, '0') + ':' + endTime.min.toString().padStart(2, 0)
        },
        carryTimeUnit(time) {
            return Math.floor(time / 60);
        },
        trafficTimeForamt: function(duration){
            // to mins
            let mins = this.carryTimeUnit(duration);
            let remainingSec = Math.floor(duration % mins);
            if(mins >= 60) {
                let hours = Math.floor(mins / 60);
                let remainingMins = Math.floor(mins % 60);
                return hours + '小時 ' + remainingMins + '分 ';  
            }
            else if(mins == 0) {
                return duration + '秒';
            }
            else {
                return mins + '分 ';
            }
        },
        trafficFormat: function(mode, duration){
            if (mode == "driving-car"){
                return "開車 / " + this.trafficTimeForamt(duration);
            }
            if (mode == "cycling-regular"){
                return "單車 / " + this.trafficTimeForamt(duration);
            }
            if (mode == "foot-walking"){
                return "走路 / " + this.trafficTimeForamt(duration);
            }
        },
        getDateString: function() {
            let date = new Date(Date.parse(this.tripDate));
            return date.getFullYear() + "-" +  (date.getMonth() + 1) + "-" + date.getDate();
        }
        
    },
    created() {
        this.$bus.$on('download', event => {
            this.tripName = event.tripName;
            this.tripDate = event.tripDate;
            this.dateString = this.getDateString();
            this.generate();
        })
    },
    beforeDestroy: function() {
        this.$bus.$off('download');
    },
};
</script>

<style scoped>
 
</style>
