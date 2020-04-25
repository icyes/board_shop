import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

Vue.use(VueRouter)

  const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/order/add',
    name: 'order_add',
    component: () => import('../views/OrderAdd.vue')
  },
  {
      path: '/order/info',
      name: 'order_info',
      component: () => import('../views/OrderInfo.vue')
  },
  {
      path: '/goods/add',
      name: 'goods_add',
      component: () => import('../views/GoodsAdd.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
