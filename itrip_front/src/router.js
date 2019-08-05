import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Trip from './views/Trip.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/trip',
      name: 'trip',
      component: () => import(/* webpackChunkName: "about" */ './views/Trip.vue'),
    },
    {
      path: '/member',
      name: 'member',
      component: () => import(/* webpackChunkName: "about" */ './views/Member.vue')
    },
  ]
})
