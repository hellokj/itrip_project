<template>
    <div class="travelTime-item">
        <b-container>
            <b-row class="ml-0 my-0 px-0 py-0">
                <b-col class="mx-0 my-0 px-0 py-0">
                    <p class="mx-0 my-0 px-0 py-0 p-name">開車</p>
                </b-col>
                <b-col class="mx-0 my-0 px-0 py-0">
                    <p class="mx-0 my-0 px-0 py-0 p-name"></p>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
export default {
    name: "TravelTimeItem",
    props: {
        togo: Object
    },
    methods: {
        
    }
}
</script>

<style scoped>
  /* .togo-item {
      width: 355px;
      background: #ffffff;
      padding: 10px;
      border-bottom: 1p #ccc dotted;
      color: #000000;
  }

  .del {
      background: #ffffff;
      color: #515151;
      border: none;
      padding: 5px 9px;
      border-radius: 50%;
      cursor: pointer;
      float: right;
  } */
</style>
