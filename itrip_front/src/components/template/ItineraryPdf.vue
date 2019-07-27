<template>
<div class="export-container">
    <table id="table">
        <thead>
        <tr>
            <th>出發時間</th>
            <th>出發時間</th>
            <th>出發時間</th>
            <th>景點</th>
            <th>交通方式/時間</th>
            <th>地址</th>
            <th>停留時間</th>
            <th>備忘錄</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td>1</td>
            <td>Donna</td>
            <td>Moore</td>
            <td>dmoore0@furl.net</td>
            <td>China</td>
            <td>211.56.242.221</td>
        </tr>
        <tr>
            <td>2</td>
            <td>Janice</td>
            <td>Henry</td>
            <td>jhenry1@theatlantic.com</td>
            <td>Ukraine</td>
            <td>38.36.7.199</td>
        </tr>
        </tbody>
    </table>
</div>

</template>

<script>
import jsPDF from 'jspdf';
import 'jspdf-autotable';
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
        generate: function() {
        var head = [["ID", "Country", "Rank", "Capital"]];
        var body = [
            [1, "Denmark", 7.526, "Copenhagen"],
            [2, "Switzerland", 	7.509, "Bern"],
            [3, "Iceland", 7.501, "Reykjavík"],
            [4, "Norway", 7.498, "Oslo"],
            [5, "Finland", 7.413, "Helsinki"]
        ];
        var doc = new jsPDF();
        doc.autoTable({head: head, body: body});
        doc.autoTable({html: '#table', startY: 100});
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
