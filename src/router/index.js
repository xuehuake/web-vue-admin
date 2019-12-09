import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '首页', icon: 'home' }
      }
    ]
  },
  {
    path: '/webkit',
    component: Layout,
    name: 'Webkit',
    meta: { title: '工具箱', icon: 'toolkit' },
    children: [
      {
        path: 'encryption',
        name: 'Encryption',
        component: () => import('@/views/webkit/encryption'),
        meta: { title: '加解密', icon: 'password' }
      }, {
        path: 'table',
        name: 'Table',
        component: () => import('@/views/webkit/table'),
        meta: { title: '代码生成', icon: 'excel' }
      }, {
        path: 'cronExpression',
        name: 'CronExpression',
        component: () => import('@/views/webkit/cron'),
        meta: { title: 'cron表达式', icon: 'cron' }
      }, {
        path: 'quotation',
        name: 'Quotation',
        component: () => import('@/views/webkit/quotation'),
        meta: { title: '行情', icon: 'cron' }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () =>
  new Router({
    mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
