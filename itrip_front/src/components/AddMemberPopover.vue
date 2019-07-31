<template>
     <el-popover
        placement="bottom-start"
        width="300"
        trigger="click"
        @click.native="$emit('getCurrentMembers')">
        <i title="加入旅伴" class="fas fa-user-plus" style="color:#8a8d91;cursor: pointer;" slot="reference"></i>
        <el-input
        placeholder="旅伴的E-mail"
        v-model="content"
        @input="handleInput"
        clearable>
        </el-input>
        <div class="mt-1 pr-3 row" style="float:right;">
            <el-button type="success" icon="el-icon-plus" size="mini" @click="$emit('addMember')" circle></el-button>
        </div>
        <div class="mt-2 px-0 col" style="display:flex;flex-direction:column;width:70%;">
            <el-tag
                class="my-1"
                closable
                v-for="(email, index) in memberEmails"
                :key="index"
                type="info"
                effect="plain"
                @close="$emit('removeMember',index)"
                style="width:100%;display:flex;justify-content:space-between;">
                 {{ email }}
            </el-tag>  
        </div>
    </el-popover>
</template>

<script>
export default {
  name: "AddMemberPopover",
  props: ['memberEmail', 'memberEmails'],
  data() {
    return {
        content: this.memberEmail,
    }
  },
  model: {
      prop: 'memberEmail',
      event: 'input'
  },
  methods: {
   handleInput (e) {
      this.$emit('input', this.content)
    }
  },
}
</script>

<style scoped>
.fa-user-plus {
        font-size:25px;
    }
@media only screen and (max-width: 1200px) {
    .fa-user-plus {
        font-size:15px;
    }
}
</style>

