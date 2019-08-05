import Home from './views/Home.vue'

export default new VueRouter({
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
