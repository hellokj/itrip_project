import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Trip from './views/Trip.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
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
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    {
      path: '/member',
      name: 'member',
      component: () => import(/* webpackChunkName: "about" */ './views/Member.vue')
    },
    {
      path: '/test',
      name: 'testSocketIo',
      component: () => import(/* webpackChunkName: "about" */ './views/Chat.vue')
    },
  ]
})
