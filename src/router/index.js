import { createRouter, createWebHistory } from 'vue-router'
import { nextTick } from 'vue'
import HomeView from '../views/HomeView.vue'
import ServicePage from '../views/ServicePage.vue'
import { SERVICES } from '../constants'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/mobile',
    name: 'mobile',
    component: ServicePage,
    props: {
      service: SERVICES.mobile,
    },
  },
  {
    path: '/web',
    name: 'web',
    component: ServicePage,
    props: {
      service: SERVICES.web,
    },
  },
  {
    path: '/integration',
    name: 'integration',
    component: ServicePage,
    props: {
      service: SERVICES.integration,
    },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => false,
})

let resolveTransition = null

router.beforeEach((to, from) => {
  if (to.path === from.path && to.hash !== from.hash) return
  if (!document.startViewTransition || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  return new Promise(resolve => {
    document.startViewTransition(() => {
      resolve()
      return new Promise(innerResolve => {
        resolveTransition = innerResolve
      })
    })
  })
})

router.afterEach(() => {
  if (resolveTransition) {
    nextTick().then(resolveTransition)
    resolveTransition = null
  }
})

export default router
