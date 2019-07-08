<template>
    <div class="spot-item px-0 py-0">
        <img class="btn-add" v-on:click="$emit('add-spot', spot)"  src="./icons/add.svg" alt="ADD">
        <b-container>
            <b-row class="ml-0 my-0 px-0 py-0">
                <b-col class="ml-0 my-0 pl-0 py-0" cols="4">
                    <img class="ml-0 my-0 px-0 py-0 spot-picture" v-bind:src="spot.images[0]" alt="Picture">
                </b-col>
                <b-col class="mx-0 my-0 px-0 py-0">
                    <p class="mx-0 my-0 px-0 py-0 p-name">{{index + 1}}. {{spot.name}}</p>
                    <p class="mx-0 my-0 px-0 py-0">{{ getAddress() }}</p>
 
                            <button><i src=""></i></button>
                            <button><i src=""></i></button>
                            
    
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
import {Checker} from '../../utils/checker.js'

export default {
    name: "SpotItem",
    props: ["spot", "index"],
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
    }
}
</script>

<style scoped>
    .spot-item {
        margin-left: 4px;
        margin-top: 5px;
        width: 355px;
        height: 100px;
        background: #ffffff;
        padding: 10px;
        border-bottom: 1p #ccc dotted;
        color: #000000;

    }

    .spot-picture{
        
        width: 100px;
        height: 100px;
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
</style>
