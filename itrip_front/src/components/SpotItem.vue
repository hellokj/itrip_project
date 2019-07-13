<template>
    <div class="spot-item px-0 py-0" @mouseover="$emit('mouseOver', spot)">
        <b-container>
            <b-row class="ml-0 my-0 px-0 py-0">
                <b-col class="ml-0 my-0 pl-0 py-0" cols="3.8">
                    <img class="ml-0 my-1 px-0 py-0 spot-picture" :src="spot.images[0]" alt="Picture">
                </b-col>
                <b-col cols="7" class="mx-0 my-0 px-0 py-0">
                    <p class="mx-0 my-0 px-0 py-0 p-name">{{spotIndex}}. {{spot.name}}</p>
                    <p class="mx-0 my-1 px-0 py-0">{{ getAddress() }}</p>
                    <b-row class="mx-0 my-4 px-0 py-0">
                        <i class="mx-0 my-0 px-0 py-0 fas fa-blog"></i>
                        <i class="mx-3 my-0 px-0 py-0 fab fa-facebook-square"></i>
                        <img class="mx-1 my-0 px-0 py-0 instagram" src="../assets/instagram.png">
                    </b-row>
                </b-col>
                <b-col class="ml-4 my-0 px-0 py-0">
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
        },
    },
    computed: {
        spotIndex: function() {
            return (this.index + 1) + (this.perPage * (this.currentPage - 1));
        }
    }
}
</script>

<style scoped>
    .container {
        align-self: center;
        height: 130px;
    }
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
        margin-right: 10px;
    }
    .p-name {
        font-size:20px;
    }

    p {
        overflow:hidden;
        white-space:nowrap;
        -ms-text-overflow:ellipsis;
        text-overflow:ellipsis;
        width:270px;
        height:1.5em;
    }
    p:hover {
        overflow:visible;
    }
    .fa-blog {
        font-size: 25px;
        color:darkorange;
        cursor: pointer;
    }
    .fa-plus-square {
        font-size: 25px;
        color:darkgray;
        cursor: pointer;
    }
    .fa-facebook-square {
        font-size: 30px;
        color:#3b5998;
        cursor: pointer;
    }
    .instagram {
        width:30px;
        height:30px;
        cursor: pointer;
    }
</style>
