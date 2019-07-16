<template>
    <div class="MobileHeader">
        <el-button>行程表</el-button>
        <el-button>列表模式</el-button>
        <el-button>地圖模式</el-button>
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
       
    },
}
</script>

<style scoped>
    .MobileHeader {
        display: flex;
        flex-wrap:wrap;
        justify-content: center;
        margin-top: 5px;
    }
</style>