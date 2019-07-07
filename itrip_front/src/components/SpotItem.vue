<template>
    <div class="spot-item px-0 py-0">
        <b-container>
            <b-row class="ml-0 my-0 px-0 py-0">
                <b-col class="ml-0 my-0 pl-0 py-0" cols="4">
                    <img class="ml-0 my-0 px-0 py-0 spot-picture" v-bind:src="spot.images[0]" alt="Picture">
                </b-col>
                <b-col class="mx-0 my-0 px-0 py-0">
                    <p class="mx-0 my-0 px-0 py-0 p-name">{{spot.name}}</p>
                    <p class="mx-0 my-0 px-0 py-0">{{ getAddress() }}</p>
                    <b-container>
                        <b-row>
                            <b-col><button><i src=""></i></button></b-col>
                            <b-col><button><i src=""></i></button></b-col>
                            <b-col ><img class="btn-add" v-on:click="$emit('add-spot', spot)"  src="./icons/add.svg" alt="ADD"></b-col>
                        </b-row>
                    </b-container>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
export default {
    name: "SpotItem",
    props: ["spot"],
    methods: {
        getAddress: function(){
            let address = '';
            let city = "";
            let suburb = "";
            let road = "";
            let number = "";
            // let comp = this.spot.address.state === "臺灣省";
            city = ((this.spot.address.state === "臺灣省") || (this.spot.address.state === undefined))? this.spot.address.county: this.spot.address.state;
            suburb = (this.spot.address.town === undefined)? this.spot.address.suburb: this.spot.address.town;
            road = (this.spot.address.road === undefined)? ((this.spot.address.pedestrian === undefined)? "": this.spot.address.pedestrian): this.spot.address.road;
            number = (this.spot.address.house_number === undefined)? "": this.spot.address.house_number;
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
        width: 20px;
    }
</style>
