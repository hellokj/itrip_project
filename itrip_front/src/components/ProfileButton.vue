<template lang="pug">
  button(v-model="$store.state.isAuthorized" @click="$emit('button-click')") {{ logInLogOut() }}
</template>

<script>
export default {
  name: 'ProfileButton',
  props: {
    // isAuthorized: Boolean
  },
  data() {
    return {
      
    }
  },
  methods: {
    logInLogOut() {
      if (this.$store.state.isAuthorized){
        return "登出";
      }
      return "登入";
    }
  },
}
</script>

<style lang="sass" scope>
button
  width: 125px
  height: 40px
  border: 2px solid #ffffff
  border-radius: 20px
  display: flex
  align-items: center
  justify-content: center
  margin-right: 50px
</style>
