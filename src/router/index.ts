import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

Vue.use(VueRouter)

  const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
      meta: {
          title: '板材网店'
      },
  },
  {
    path: '/order/add/:uid/:aid',
    name: 'order_add',
    component: () => import('../views/OrderAdd.vue'),
      meta: {
          title: '发货单-录入品名'
      }
  },
  {
      path: '/order/info',
      name: 'order_info',
      component: () => import('../views/OrderInfo.vue'),
      meta: {
          title: '发货单信息'
      }

  },
  {
      path: '/user/add',
      name: 'user_add',
      component: () => import('../views/UserAdd.vue'),
      meta: {
          title: '发货单-填写用户信息'
      }
  }
]

const router = new VueRouter({
  routes
})

export default router
