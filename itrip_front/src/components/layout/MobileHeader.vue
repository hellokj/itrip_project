<template>
    <div class="MobileHeader">
        <el-radio-group v-model="currentMode" style="margin-bottom: 20px;">
            <el-radio-button class="mb-0" :label="0">行程表</el-radio-button>
            <el-radio-button class="mb-0"  :label="1">列表模式</el-radio-button>
            <el-radio-button class="mb-0"  :label="2">地圖模式</el-radio-button>
        </el-radio-group>
    </div>
    
</template>

<script>

export default {
    name: "MobileHeader",
    data() {
        return {
            currentMode: 1,
        }
    },
    methods: {
       toggle: function(id) {
           this.$bus.$emit('toggle', {id: id});
       }
    },
    watch: {
        currentMode: function(newVal, oldVal) {
            switch(newVal) {
                case 0:
                    this.toggle('Togos');
                    break;
                case 1:
                    this.toggle('Spots');
                    break;
                case 2:
                    this.toggle('Map');
                    break;
            }
        }
    },
}
</script>

<style scoped>
    .MobileHeader {
        position: sticky;
        top: 120px;
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        margin-top: 5px;
        z-index: 5;
    }
</style>