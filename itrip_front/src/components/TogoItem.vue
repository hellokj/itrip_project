<template>
    <div class="togo-item px-0 py-0">
        <!-- <p>
             <input type="checkbox" v-on:change="markComplete"> -->
            <!-- {{togo.name}}
            {{togo.location.coordinates[0]}}
            {{togo.location.coordinates[1]}}
            <button @click="$emit('del-togo', togo._id)" class="del"><b>移除</b></button> -->
        <!-- </p> -->
        <!-- <b-container>
            <b-row class="ml-0 my-0 px-0 py-0">
                <b-col class="mx-0 my-0 px-0 py-0">
                    <p class="mx-0 my-0 px-0 py-0 p-name">{{togo.name}}</p>
                </b-col>
                <button @click="$emit('del-togo', togo._id)" class="del"><b>移除</b></button>
            </b-row>
        </b-container> -->

        <b-container>
            <b-row class="ml-0 my-0 px-0 py-0">
                <b-col class="ml-0 my-0 pl-0 py-0" cols="4">
                    <img class="ml-0 my-0 px-0 py-0 spot-picture" v-bind:src="togo.images[0]" alt="Picture">
                </b-col>
                <b-col class="mx-0 my-0 px-0 py-0">
                    <p class="mx-0 my-0 px-0 py-0 p-name"> {{togo.name}}</p>
                    <!-- <p class="mx-0 my-0 px-0 py-0">{{ getAddress() }}</p> -->
                    <b-container>
                        <b-row>
                            <b-col><button><i src=""></i></button></b-col>
                            <b-col><button><i src=""></i></button></b-col>
                            <button @click="$emit('del-togo', togo.id)" class="del"><b>移除</b></button>
                        </b-row>
                    </b-container>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
export default {
    name: "TogoItem",
    props: ["togo", "index"],
    methods: {
        
    }
}
</script>

<style scoped>


  .del {
      background: #ffffff;
      color: #515151;
      border: none;
      padding: 5px 9px;
      border-radius: 50%;
      cursor: pointer;
      float: right;
  }

      .togo-item {
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
