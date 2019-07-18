<template>
    <div class="spot-item-container" @mouseover="$emit('mouseOver', spot)" @mouseout="$emit('mouseOut', spot)">
        <img ref="image" class="px-2 py-2 mt-1 spot-picture" :src="srcFunc" @error="error">
        <div class="info-col">
            <div class="name-container">
                <p class="my-2 p-name">{{spotIndex}}. <b>{{spot.name}}</b></p>
                <i class="pr-1 mt-1 fas fa-plus-square" @click="$emit('add-spot', spot)"></i>
            </div>
            <p class="address">{{ getAddress() }}</p>
            <div class="icons">
                <i @click="link('pixnet')" class="fas fa-blog"></i>
                <i @click="link('fb')" class="fab fa-facebook-square"></i>
                <img @click="link('ig')" class="instagram" src="../assets/instagram.png">
                <img @click="link('wiki')" class="wiki" src="../assets/wiki.png">
            </div>
        </div>
        
    </div>
</template>

<script>

import {getAddress} from '../../utils/checker.js'
export default {
    name: "SpotItem",
    components: {
        
    },
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
        link: function(type) {
            let Url = '';
            let arr = {
                'ig': "https://ingram.life/tag/",
                'pixnet': 'https://www.pixnet.net/tags/',
                'wiki': 'https://zh.wikipedia.org/wiki/',
                'fb': ['https://www.facebook.com/search/top/?q=', '&epa=SEARCH_BOX']
            }
            let url = arr[type];
            if (typeof url === "string") {
                Url = url.concat(this.spot.name);
                
            } else if (typeof url === "object") {
                Url = url[0].concat(this.spot.name, url[1]);
            }

            if (type === 'ig' && this.spot.ig_tag[0] !== undefined){
                let ig_tag = this.spot.ig_tag;
                Url = url.concat(ig_tag[0])
            }

            if (type === 'wiki' && this.spot.wiki_name !== null){
                Url = url.concat(this.spot.wiki_name);
            }

            if (type === 'wiki' && this.spot.wiki !== undefined){
                Url = this.spot.wiki;
            }

            this.$emit('show-link', Url);
        }
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
    .spot-item-container {
        display: flex;
        flex-direction: row;
        background: #ffffff;
        border-bottom: 2px dotted rgb(199, 199, 199);
        color: #000000;
        height: 150px;
    }
    .info-col {
        width: 310px;
        display:flex;
        flex-direction: column;
    }
    .name-container {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        flex-direction: row;
        justify-content: space-between;
    }
    .fa-blog {
        font-size: 25px;
        color:darkorange;
        cursor: pointer;
    }
    .icons {
        width: 250px;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        padding-top: 3px;
    }
    .fa-plus-square {
        font-size: 30px;
        color:darkgray;
        cursor: pointer;
    }
    .fa-plus-square:hover {
        color:dimgray;
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
        width: 90%;
        white-space:nowrap;
        overflow: hidden;
        text-overflow:ellipsis;
        height:1.5em;
    }
    p:hover {
        overflow:visible;
    }
    .spot-picture{
        width: 170px;
        height: 137px;
    }
    .p-name {
        font-size:20px;
    }
    .address {
        font-size:15px;
    }
    /*
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

    .instagram {
        width:20px;
        height:20px;
    }
    .wiki {
        width:20px;
        height:20px;
    }
  } */
  @media only screen and (max-width: 768px){
    .spot-item-container {
        height: 100px;
    }
    .p-name {
        font-size: 15px;
    }
    .address {
        font-size:10px;
    }
    .spot-picture {
        width: 100px;
        height: 90px;
        padding-top: 1;
    }
    .icons {
        width: 200px;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        padding: 0px;
    }
    .fa-plus-square {
        font-size: 20px;
        color:darkgray;
        cursor: pointer;
    }
    .fa-plus-square:hover {
        color:dimgray;
    }
    .fa-facebook-square {
        font-size: 20px;
        color:#3b5998;
        cursor: pointer;
    }
    .instagram {
        width:20px;
        height:20px;
        cursor: pointer;
    }
    .wiki {
        width:20px;
        height:20px;
        cursor: pointer;
    }
    .fa-blog {
        font-size: 18px;
        color:darkorange;
        cursor: pointer;
    }
}
</style>
