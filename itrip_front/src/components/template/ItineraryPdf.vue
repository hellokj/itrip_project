<template>
<div class="export-container">
    <table id="table">
        <thead>
        <tr>
            <th>出發時間</th>
            <th>景點</th>
            <th>交通方式/時間</th>
            <th>地址</th>
            <th>停留時間</th>
            <th>備忘錄</th>
        </tr>
        </thead>
    </table>
</div>

</template>

<script>
import jsPDF from 'jspdf'
import 'jspdf-autotable';
import font from '../../../utils/msyh-normal.js'
import {getAddress} from '../../../utils/checker.js'
import TogoItem from '../TogoItem'
import TravelTimeItem from '../TravelTimeItem'


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
        generate: function() {
            var doc = new jsPDF();

            // //不加這個中文會亂碼
            doc.addFileToVFS('mysh-normal.ttf', font);
            doc.addFont('mysh-normal.ttf', 'msyh', 'normal');
            doc.setFont('msyh');
            var head = [["時間", "景點", "交通方式/時間", "地址", "停留時間", "備忘錄"]];
            var body = this.makeBody();
            console.log(body);
            doc.autoTable({head: head, body: body, styles: { font: "msyh"}});
            // doc.autoTable({html: '#table', startY: 100});
            doc.output("dataurlnewwindow");
        },
        makeBody: function() {
            let wholeItinerary = [];
            let day = [];
            for(let j=0;j<this.togos[0].length;j++) {
                let spot = [];
                spot.push(" ");
                spot.push(this.togos[0][j].name);
                spot.push(" ");
                spot.push(getAddress(this.togos[0][j].address));
                spot.push(this.stopTimeFormat(this.togos[0][j].stopTime.hrs, this.togos[0][j].stopTime.mins));
                if(this.togos[0][j].memo !== undefined) {
                    spot.push(this.togos[0][j].memo);
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
                return hrs + "小時"
            }
            if (hrs == 'undefined' || hrs == 'null'){
                return mins + "分鐘"
            }
            return hrs + "小時" + mins + "分鐘";
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
        togos: function() {
            console.log(this.togos);
        }
    },
};
</script>

<style scoped>
 
</style>
