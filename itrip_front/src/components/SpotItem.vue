<template>
    <div class="spot-item px-0 py-0" @mouseover="$emit('mouseOver', spot)">
        <b-container>
            <b-row class="ml-0 my-0 px-0 py-0">
                <b-col class="ml-0 my-0 pl-0 py-0" cols="3.8">
                    <div class="pic">
                         <img ref="image" class="ml-0 my-1 px-0 py-0 spot-picture" :src="srcFunc" @error="error">
                    </div>
                </b-col>
                <b-col cols="6" class="ml-2 my-0 px-0 py-0">
                    <p class="mx-1 my-0 px-0 py-0 p-name">{{spotIndex}}.<b>{{spot.name}}</b></p>
                    <p class="mx-1 my-1 px-0 py-0">{{ getAddress() }}</p>
                    <b-row class="mx-2 my-4 px-0 py-0">
                        <i class="mx-0 my-0 px-0 py-0 fas fa-blog"></i>
                        <i class="mx-3 my-0 px-0 py-0 fab fa-facebook-square"></i>
                        <img class="mx-1 my-0 px-0 py-0 instagram" src="../assets/instagram.png">
                        <img class="mx-3 my-0 px-0 py-0 wiki" src="../assets/wiki.png">
                    </b-row>
                </b-col>
                <b-col cols="1" class="ml-5 my-0 pl-0 py-0">
                    <i class="fas fa-plus-square" @click="$emit('add-spot', spot)"></i>
                </b-col>
            </b-row>
        </b-container>
    </div>
     <!-- <img class="btn-add" v-on:click=""  src="./icons/add.svg" alt="ADD"> -->
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
    }
    .pic {
        width: 120px;
        height: 120px;
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
</style>
