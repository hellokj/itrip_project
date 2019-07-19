<template>
    <div class="spot-item-container" @mouseover="$emit('mouseOver', spot)" @mouseout="$emit('mouseOut', spot)">
        <el-card class="el-card" :body-style="{ width: '100%', padding: '15px'}" shadow="hover">
            <div class="card-container">
                <i :class="markClass"  @click="clickAdd(spot)"></i>
                <img ref="image" class="px-2 py-2 spot-picture" :src="srcFunc" @error="error">
                <div class="info-col">
                    <div class="name-container">
                        <p class="my-2 p-name">{{spotIndex}}.<b>{{spot.name}}</b></p>
                    </div>
                    <p class="address">{{ getAddress() }}</p>
                    <div class="icons">
                        <i @click="link('pixnet')" class="fas fa-blog"></i>
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
export default {
    name: "SpotItem",
    components: {
        
    },
    data() {
        return {
            notFound: require('../assets/picNotFound.jpg'),
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
            
        },
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
        hasWiki: function() {

        }
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
        width: 190px;
        height: 150px;
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
    .fa-blog {
        font-size: 25px;
        color:darkorange;
        cursor: pointer;
    }
    .icons {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        padding-top: 3px;
        margin-top: 30px;
        align-self: flex-end;
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
        height: 150px;
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
        width: 120px;
        height: 110px;
        margin-top: 4px !important;
    }
    span {
        width: 85%;
    }
    .icons {
        width: 75%;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        padding: 0px;
        align-self:flex-end;
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
