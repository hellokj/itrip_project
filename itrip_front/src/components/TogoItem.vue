<template>
    <div class="togo-item px-0 py-0">
        <b-container>
            <b-row>
                <b-col class="ml-0 my-0 pl-0 py-0" cols="4">
                    <img class="ml-0 my-0 px-0 py-0 spot-picture" :src="togo.images[0]" alt="Picture">
                </b-col>
                <b-col>
                    <b-row class="ml-0 my-0 px-0 py-0" align-h="start">
                        <p class="mx-0 my-0 px-0 py-0 p-name"> {{togo.name}}</p>
                        <!-- <p class="mx-0 my-0 px-0 py-0">{{ getAddress() }}</p> -->
                    </b-row>
                    <b-row align-h="center"></b-row>
                    <b-row class="">
                        <b-col><button><i src=""></i></button></b-col>
                        <b-col><button><i src=""></i></button></b-col>
                        <b-col align-self="end"><i class="fas fa-trash-alt" @click="$emit('deleteTogo', togo.index)"></i></b-col>
                    </b-row>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
export default {
    name: "TogoItem",
    props: {
        togo: Object
    },
    methods: {
        deleteTogo() {
            this.$emit('deleteTogo');
        }
    },
}
</script>

<style scoped>


  .fa-trash-alt {
      color:darkgray;
      border: none;
      padding: 5px 9px;
      border-radius: 50%;
      cursor: pointer;
      float: right;
      padding-top: 10px;
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
