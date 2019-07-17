<template>

    <b-container class="px-0 mb-2 spot-item" @mouseover="$emit('mouseOver', spot)">
        <b-row align-h="stretch" flex-wrap="wrap">
            <b-col cols="4" sm="3" md="3" lg="4" xl="4" class="mr-1">
                <img ref="image" class="spot-picture" :src="srcFunc" @error="error" style="width:100%;height:100%;max-height:120px;max-width:120px;">
            </b-col>
            <b-col cols="7" sm="8" md="7" lg="7" xl="7" class="pl-1">
                <b-row align-h="between" fluid>
                    <b-col class="pl-0 pr-0" cols="8" sm="9" md="4" lg="4" xl="9">
                        <p class="p-name" style="font-size:18px;">{{spotIndex}}. <b>{{spot.name}}</b></p>
                    </b-col>
                    <b-col class="pl-0" cols="2" sm="1" offset-sm="2" md="2" lg="3" xl="1">
                        <i class="pr-1 fas fa-plus-square" @click="$emit('add-spot', spot)"></i>
                    </b-col>
                    <b-col class="px-0">
                        <p style="font-size:12px;">{{ getAddress() }}</p>
                    </b-col>
                </b-row>
                <b-row align-h="around" fluid>
                    <i @click="link('pixnet')" class="fas fa-blog"></i>
                    <i @click="link('fb')" class="fab fa-facebook-square"></i>
                    <img @click="link('ig')" class="instagram" src="../assets/instagram.png">
                    <img @click="link('wiki')" class="wiki" src="../assets/wiki.png">
                </b-row>
            </b-col>
        </b-row>
    </b-container>
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
    .spot-item {
        background: #ffffff;
        border-bottom: 1p #ccc dotted;
        color: #000000;
        height: 110px;
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
        width:150px;
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
  @media only screen and (max-width: 768px) and (min-width: 576px){
    p {
        width: 300px;
   } 
}
</style>
