<template>
    <div class="togo-item">
        <p>
            <!-- <input type="checkbox" v-on:change="markComplete"> -->
            {{togo.name}}
            {{togo.location.coordinates[0]}}
            {{togo.location.coordinates[1]}}
            <button @click="$emit('del-togo', togo._id)" class="del"><b>移除</b></button>
        </p>
    </div>
</template>

<script>
export default {
    name: "TogoItem",
    props: ["togo"],
    methods: {
        
    }
}
</script>

<style scoped>

  .togo-item {
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
  }
</style>
