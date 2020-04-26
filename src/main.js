import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './stores'
import ElementUI from 'element-ui';
import "babel-polyfill";
import NProgress from 'nprogress' // 进度条
import 'animate.css/animate.css'; // 动画
import 'element-ui/lib/theme-chalk/index.css';
Vue.config.productionTip = false
Vue.use(ElementUI);










router.beforeEach((to, from, next) => {
  NProgress.start() // 进度条开始
  if(to.path == '/'){
    next("/login")
  }
  next()
 
})

router.afterEach((to, from) => {
  NProgress.done()
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
