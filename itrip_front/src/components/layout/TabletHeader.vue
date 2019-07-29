<template>
    <div class="TabletHeader">
        <el-button @click="toggle('Togos/Spots')">行程表/列表模式</el-button>
        <el-button @click="toggle('Map')">地圖模式</el-button>
    </div>
    
</template>

<script>

export default {
    name: "TabletHeader",
    data() {
      return {
        
      }
    },
    methods: {
       toggle: function(id) {
           this.$bus.$emit('toggle', {id: id});
       }
    },
}
</script>

<style scoped>
    .TabletHeader {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        margin-top: 5px;
    }
</style>