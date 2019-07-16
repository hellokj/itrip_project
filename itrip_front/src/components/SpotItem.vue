<template>
    <b-container class="px-0 mb-2 spot-item" @mouseover="$emit('mouseOver', spot)">
        <b-row align-h="start">
            <b-col xs="3" sm="3" md="4" lg="4" xl="3" class="mr-1 pr-0">
                <img ref="image" class="spot-picture" :src="srcFunc" @error="error" style="width:120px; height:120px;">
            </b-col>
            <b-col class="pl-1">
                <b-row align-h="between" fluid>
                    <p class="p-name">{{spotIndex}}. <b>{{spot.name}}</b></p>
                    <i class="pr-4 fas fa-plus-square" @click="$emit('add-spot', spot)"></i>
                </b-row>
                <p>{{ getAddress() }}</p>
                <b-row align-h="around" fluid>
                    <i class="fas fa-blog"></i>
                    <i class="fab fa-facebook-square"></i>
                    <img class="instagram" src="../assets/instagram.png">
                    <img class="wiki" src="../assets/wiki.png">
                </b-row>
            </b-col>
        </b-row>

    </b-container>
</template>

<script>
import {getAddress} from '../../utils/checker.js'

export default {
    name: "SpotItem",
    data() {
        return {
            notFound: require('../assets/picNotFound.jpg')
        }
    },
    props: {
        spot: Object,
        index: Number,
        perPage: Number,
        currentPage: Number,
    },
    methods: {
        getAddress: function(){
           return getAddress(this.spot.address)
        },
        error: function(){
            this.$refs.image.src = this.notFound
        },
    },
    computed: {
        spotIndex: function() {
            return (this.index + 1) + (this.perPage * (this.currentPage - 1));
        },
        srcFunc: function() {
            let src;
            if(!Object.keys(this.spot).includes('images') || this.spot.images.length == 0) {
                src = this.notFound
            }
            else {
                src = this.spot.images[0]
            }
            return src  
        },
    }
}
</script>

<style scoped>
    .spot-item {
        background: #ffffff;
        border-bottom: 1p #ccc dotted;
        color: #000000;
    }
    .fa-blog {
        font-size: 25px;
        color:darkorange;
        cursor: pointer;
    }
    .fa-plus-square {
        font-size: 30px;
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
    .wiki {
        width:30px;
        height:30px;
        cursor: pointer;
    }
    p {
        width:200px;
        overflow:hidden;
        white-space:nowrap;
        text-overflow:ellipsis;
        height:1.5em;
    }
    p:hover {
        overflow:visible;
    }
    /* .container {
        align-self: center;
        height: 130px;
    }
    
    .spot-picture{
        width: 120px;
        height: 120px;
    }
    .p-name {
        font-size:20px;
        display: flex;
        flex: 1 1 auto;
    }

    
    
    .nameRow {
        width: 100%;
        display: flex;
        justify-content: space-between;
    }
    .infoCol {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        flex: 1 1 auto;
    }
    .iconRow {
        display: flex;
        flex-direction: row;
        width: 100%;
        justify-content: space-evenly;
        min-width: 130px;
        max-width: 200px;
    }

    @media only screen and (max-width: 780px) {
    .spot-picture {
        width: 30%;
        height: 100%;
        min-width: 100px;
    }
    .container {
        align-self: center;
        height: 100px;
    }
    .spot-item {
        height: 100px;

    }
    .p-name {
        font-size:12px;
        display: flex;
        flex: 0 1 auto;
        margin-top:0px;
        max-width: 180px;
    }
    p {
        font-size:12px;
        height:1.5em;
        margin: 0px;
    }
    .fa-blog {
        margin-top: 1px;
        font-size: 18px;
    }
    .fa-plus-square {
        font-size: 20px;
    }
    .fa-facebook-square {
        font-size: 20px;
    }
    .instagram {
        width:20px;
        height:20px;
    }
    .wiki {
        width:20px;
        height:20px;
    }
    .infoCol {
        padding-right: 10px;
        padding-left: 10px;
    }
  } */
</style>
