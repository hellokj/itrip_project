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
        console.log(doc.getFontList())
        doc.addFileToVFS('mysh-normal.ttf', font);
        doc.addFont('mysh-normal.ttf', 'msyh', 'normal');
        doc.setFont('msyh');
        var head = [["出發時間", "景點", "交通方式/時間", "地址", "停留時間", "備忘錄"]];
        var body = [
            [1, "出發時間", 7.526, "Copenhagen"],
            [2, "Switzerland", 	7.509, "Bern"],
            [3, "Iceland", 7.501, "Reykjavík"],
            [4, "Norway", 7.498, "Oslo"],
            [5, "Finland", 7.413, "Helsinki"]
        ];
        doc.autoTable({head: head, body: body, styles: { font: "msyh"}});
        // doc.autoTable({html: '#table', startY: 100});
        doc.output("dataurlnewwindow");
    }
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
