<template>
    <div class="spot-item px-0 py-0">
        <b-container>
            <b-row class="ml-0 my-0 px-0 py-0">
                <b-col class="ml-0 my-0 pl-0 py-0" cols="3.8">
                    <img class="ml-0 my-0 px-0 py-0 spot-picture" v-bind:src="spot.images[0]" alt="Picture">
                </b-col>
                <b-col cols="8" class="mx-0 my-0 px-0 py-0">
                    <p class="mx-0 my-0 px-0 py-0 p-name">{{spotIndex}}. {{spot.name}}</p>
                    <p class="mx-0 my-0 px-0 py-0">{{ getAddress() }}</p>
                    <button><i src=""></i></button>
                    <button><i src=""></i></button>
                </b-col>
                <b-col class="mx-0 my-0 px-0 py-0">
                    <i class="fas fa-plus-square" @click="$emit('add-spot', spot)"></i>
                </b-col>
            </b-row>
        </b-container>
    </div>
     <!-- <img class="btn-add" v-on:click=""  src="./icons/add.svg" alt="ADD"> -->
</template>

<script>
import {Checker} from '../../utils/checker.js'

export default {
    name: "SpotItem",
    props: {
        spot: Object,
        index: Number,
        perPage: Number,
        currentPage: Number
    },
    methods: {
        getAddress: function(){
            let address = '';
            let city = "";
            let suburb = "";
            let road = "";
            let number = "";
            city = Checker(this.spot.address, ['state', 'city', 'city_state', 'county']);
            suburb = Checker(this.spot.address, ['town', 'suburb', 'city_district', 'district']);
            road = Checker(this.spot.address, ['road', 'pedestrian', 'city_district', 'district']);
            number =  Checker(this.spot.address, ['house_number']);
            address = city.concat(suburb, road, number);
            return address;
        },
        Clicked: function(){
            console.log('clicked');
        }
    },
    computed: {
        spotIndex: function() {
            return (this.index + 1) + (this.perPage * (this.currentPage - 1));
        }
    }
}
</script>

<style scoped>
    .spot-item {
        margin-left: 10px;
        margin-top: 5px;
        width: 450px;
        height: 130px;
        background: #ffffff;
        padding: 10px;
        border-bottom: 1p #ccc dotted;
        color: #000000;

    }
    .spot-picture{
        width: 120px;
        height: 120px;
    }
    .p-name {
        font-size:20px;
    }
    .btn-add {
        z-index: 10;
        position: absolute;
        margin-left: 330px;
        margin-top: 10px;
        width: 20px;
        height: 20px;
        cursor: pointer;
    }
    .fa-plus-square {
        font-size: 25px;
        color:darkgray;
        cursor: pointer;
    }
</style>
