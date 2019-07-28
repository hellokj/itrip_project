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
            tripName: '我的旅行',
        }
    },
    methods: {
        generate: function() {
            var doc = new jsPDF();

            // //不加這個中文會亂碼
            doc.addFileToVFS('mysh-normal.ttf', font);
            doc.addFont('mysh-normal.ttf', 'msyh', 'normal');
            doc.setFont('msyh');
            for(let i=0;i<this.togos.length;i++) {
                let finalY;
                if(i > 0) {
                    finalY = doc.previousAutoTable.finalY;
                }
                else {
                    finalY = 0;
                }
                var head = [["時間", "景點", "交通方式/時間", "地址", "停留時間", "備忘錄"]];
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
            
            // doc.autoTable({html: '#table', styles: { font: "msyh"}});
            doc.output("dataurlnewwindow");
        },
        makeBody: function(dayIndex) {
            let wholeItinerary = [];
            let day = [];
            for(let j=0;j<this.togos[dayIndex].length;j++) {
                let spot = [];
                spot.push(" ");
                spot.push(this.togos[dayIndex][j].name);
                spot.push(" ");
                spot.push(getAddress(this.togos[dayIndex][j].address));
                spot.push(this.stopTimeFormat(this.togos[dayIndex][j].stopTime.hrs, this.togos[dayIndex][j].stopTime.mins));
                if(this.togos[dayIndex][j].memo !== undefined) {
                    spot.push(this.togos[dayIndex][j].memo);
                }
                else {
                    spot.push(" ");
                }
                day.push(spot);
            }
            return day;
        },
        stopTimeFormat: function(hrs, mins) {
            if (mins == 'undefined' || mins == 'null'){
                return hrs
            }
            if (hrs == 'undefined' || hrs == 'null'){
                return mins
            }
            if(hrs > 0) return hrs + ' hr ' + mins + ' mins';
            return mins + ' mins';
        },
    },
    created() {
        this.$bus.$on('download', event => {
            this.generate();
        })
    },
    beforeDestroy: function() {
        this.$bus.$off('download');
    },
    watch: {
        travelInfos: function() {
            console.log(this.travelInfos);
        }
    },
};
</script>

<style scoped>
 
</style>
