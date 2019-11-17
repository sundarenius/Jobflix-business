import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/home'
import Marknaden from '@/components/marknaden'
import Test from '@/components/test'
import Profil from '@/components/profil'
import Annonsera from '@/components/annonsera'
import Bevakningar from '@/components/bevakningar'
import Prisplaner from '@/components/prisplaner'
import Savedpresentations from '@/components/savedPresentations'
import AuthGuard from './auth-guard'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    { path: '/', name: 'Hem', component: Home },
    { path: '/marknaden', name: 'Marknaden', component: Marknaden },
    { path: '/test', name: 'Test', component: Test, beforeEnter: AuthGuard },
    { path: '/profil', name: 'Profil', component: Profil, beforeEnter: AuthGuard },
    { path: '/annonsera', name: 'Annonsera', component: Annonsera, beforeEnter: AuthGuard },
    { path: '/bevakningar', name: 'Bevakningar', component: Bevakningar, beforeEnter: AuthGuard },
    { path: '/prisplaner', name: 'Prisplaner', component: Prisplaner, beforeEnter: AuthGuard },
    { path: '/sparade', name: 'Sparade Pre.', component: Savedpresentations, beforeEnter: AuthGuard }
  ],
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
})
