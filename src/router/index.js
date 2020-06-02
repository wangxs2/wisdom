import Vue from 'vue'
import VueRouter from 'vue-router'
import layout from '../views/layout/index.vue'
import realTimeMonitoring from '../views/realTimeMonitoring/index.vue'//车辆信息
import addressManagement from '../views/addressManagement/index.vue'//地址管理
import addressRecord from '../views/addressRecord/index.vue'//地址记录
import login from '../views/login/index.vue'
import trajectory from '../views/trajectory/index.vue'//轨迹查询
import error from '../views/error/index.vue'//轨迹查询
Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'layout',
    component: layout,
    children: [
      {
        path: '/realTimeMonitoring',
        name: 'realTimeMonitoring',
        component: realTimeMonitoring
      },
      {
        path: '/trajectory',
        name: 'trajectory',
        component: trajectory
      },
      {
        path: '/addressManagement',
        name: '地址管理',
        component: addressManagement
      },
      {
        path: '/addressRecord',
        name: '地址记录',
        component: addressRecord
      },
      {
        path: '/error',
        name: '开发中',
        component: error
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
