import Vue from 'vue'
import VueRouter from 'vue-router'
import layout from '../views/layout/index.vue'
import realTimeMonitoring from '../views/realTimeMonitoring/index.vue'//车辆信息
import login from '../views/login/index.vue'
import trajectory from '../views/trajectory/index.vue'//轨迹查询
Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'layout',
    component: layout,
    children: [
      {
        path: '/realTimeMonitoring',
        name: '实时监控',
        component: realTimeMonitoring
      },
      {
        path: '/trajectory',
        name: '轨迹查询',
        component: trajectory
      },
      
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: login,
  },
  
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
