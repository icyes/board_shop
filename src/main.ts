import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import apis from "./apis"
Vue.config.productionTip = false
Vue.prototype.$apis = apis;

import "./plug-ins/vant"
import "./plug-ins/better-scroll"
router.beforeEach((to, from, next) => {
    /* 路由发生变化修改页面title */
    if (to.meta.title) {
        document.title = to.meta.title
    }
    next()
})


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
