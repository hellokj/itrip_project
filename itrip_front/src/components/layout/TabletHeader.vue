<template>
    <div class="TabletHeader">
        <el-radio-group v-model="currentMode" style="margin-bottom: 20px;">
            <el-radio-button class="mb-0" :label="3">行程表/列表模式</el-radio-button>
            <el-radio-button class="mb-0" :label="2">地圖模式</el-radio-button>
        </el-radio-group>
    </div>
    
</template>

<script>

export default {
    name: "TabletHeader",
    data() {
        return {
        currentMode: 3,
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
                case 3:
                    this.toggle('Togos/Spots');
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
    .TabletHeader {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        margin-top: 5px;
    }
</style>