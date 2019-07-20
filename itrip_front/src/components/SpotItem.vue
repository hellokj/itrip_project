<template>
    <div class="spot-item-container" @mouseover="$emit('mouseOver', spot)" @mouseout="$emit('mouseOut', spot)">
        <el-card class="el-card" :body-style="{ width: '100%', padding: '10px'}" shadow="hover">
            <div class="card-container">
                <i :class="markClass"  @click="clickAdd(spot)"></i>
                <div class="picture-container">
                    <vue-load-image>
                        <img ref="image" class="px-2 py-2 spot-picture" slot="image" :src="srcFunc">
                        <img class="px-2 py-2 preloader" slot="preloader" src="../assets/image-loader.gif"/>
                        <div slot="error"><img class="px-2 py-2 picNotFound" src="../assets/picNotFound.jpg"></div>

                    </vue-load-image>
                </div>
                <div class="info-col">
                    <div class="name-container">
                        <p class="my-2 p-name">{{spotIndex}}.<b>{{spot.name}}</b></p>
                    </div>
                    <p class="address">{{ getAddress() }}</p>
                    <div class="tags">
                        <el-tag
                            class="mx-1"
                            v-for="(t, index) in spot.ig_tag"
                            :key="index" effect="plain" size="mini">
                            #{{t}}
                        </el-tag>
                    </div>
                    <div class="icons">
                        <i @click="link('pixnet')" class="fab fa-blogger"></i>
                        <img @click="link('ig')" class="instagram" src="../assets/instagram.png">
                        <img @click="link('wiki')" class="wiki" src="../assets/wiki.png">
                    </div>
                </div> 
            </div>
        </el-card>
    </div>
</template>

<script>

import {getAddress} from '../../utils/checker.js'
import VueLoadImage from 'vue-load-image'
export default {
    name: "SpotItem",
    components: {
        'vue-load-image': VueLoadImage
    },
    data() {
        return {
            markClass: 'far fa-bookmark'
        }
    },
    props: {
        spot: Object,
        index: Number,
        perPage: Number,
        currentPage: Number,
    },
    methods: {
        clickAdd: function(spot) {
            this.$emit('add-spot', spot);
            this.markClass = 'fas fa-bookmark';
            console.log(this.spot);
        },
        getAddress: function(){
           return getAddress(this.spot.address)
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
        color: #000000;
        height: 180px;
        margin-bottom: 10px;
        margin-left: 10px;
        margin-right: 10px;
    }
    .picture-container {
        width: 160px;
        height: 160px;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    .card-container {
        display: flex;
        flex-direction: row;
        width: 100%;
        height: 200px;
    }
    .el-card {
        height: 100%;
        display: flex;
        width: 100%;
    }
    .spot-picture{
        width: 160px;
        height: 150px;
    }
    .preloader {
        width: 160px;
        height: 150px;
    }
    .picNotFound {
        width: 160px;
        height: 150px;
    }
    .tags {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        overflow: hidden;
    }
    .p-name {
        font-size:18px;
    }
    .name-container {
        width: 100%;
        display: flex;
        flex-wrap: nowrap;
        flex-direction: row;
        justify-content: space-between;
        align-self: flex-start;
    }
    .info-col {
        width: 65%;
        height: 100%;
        overflow: hidden;
        display:flex;
        flex-direction: column;
    }
    .fa-plus-square {
        font-size: 25px;
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
    .fa-bookmark {
        font-size: 25px;
        cursor: pointer;
        padding-right: 5px;
    }
    .fa-bookmark:hover {
        color:dimgray;
    }
    .fa-blogger {
        font-size: 25px;
        color:darkorange;
        cursor: pointer;
    }
    .icons {
        width: 50%;
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
        padding-top: 3px;
        margin-top: 5px;
        
    }
   
    .wiki {
        width:30px;
        height:30px;
        cursor: pointer;
    }
    p {
        width: 100%;
        white-space:nowrap;
        overflow: hidden;
        text-overflow:ellipsis;
        height:1.5em;
    }
    p:hover {
        overflow:visible;
    }
    
    .address {
        font-size:12px;
    }
    
  @media only screen and (max-width: 768px){
    .card-container {
        width: 100%;
        height: 100%;
    }
    .spot-item-container {
        height: 130px;
    }
    .info-col {
        width: 100%;
    }
    .name-container {
        width: 95%;
    }
    .p-name {
        font-size: 15px;
    }
    .address {
        font-size:10px;
        margin: 0px;
    }
    .spot-picture {
        width: 100px;
        height: 90px;
    }
    .preloader {
        width: 100px;
        height: 90px;
    }
    .picNotFound {
        width: 100px;
        height: 90px;
    }
    span {
        width: 85%;
    }
    .icons {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        padding: 0px;
        align-self:flex-end;
    }
    .fa-bookmark {
        font-size: 15px;
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
    .picture-container {
        height: 100px;
    }
}
</style>
