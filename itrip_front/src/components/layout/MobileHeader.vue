<template>
    <div class="MobileHeader">
        <el-button @click="toggle('Togos')">行程表</el-button>
        <el-button @click="toggle('Spots')">列表模式</el-button>
        <el-button @click="toggle('Map')">地圖模式</el-button>
    </div>
    
</template>

<script>

export default {
    name: "MobileHeader",
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
    .MobileHeader {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        margin-top: 5px;
    }
</style>