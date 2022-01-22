import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue' // Sprint4
import Login from '../views/Login.vue'
import About from '../views/About.vue' // Sprint4
import { AppState } from '@/services/AppState';

const routes: Array<RouteRecordRaw> = [
 { // Sprint4
  path: '/login',
  name: 'Login',
  alias: ['/register', '/logout'], // statt zweiter Route zur gleichen Komponente: Dann geht Routing nicht mehr.
  component: Login,
 },
 {
  path: '/',
  name: 'Home',
  component: Home,
  // component: () => import(
  //                  /* webpackChunkName: "home" */ 
  //                 '@/views/Home.vue'),
  alias: ['/home'],
  meta: { requiresAuth: true } // Sprint4
 },
 {
  path: '/about',
  name: 'About',
  component: About
  // component: () => import(
  //                  /* webpackChunkName: "about" */    
  //                  '@/views/About.vue')
 }
]

console.log("ROUTER INIT"); // Router wird vor main.ts ausgeführt!

const router = createRouter({
 history: createWebHistory(process.env.BASE_URL),
 routes
})

// Abfangen aller Abfragen
router.beforeEach((to, from, next) => {
 console.log("--> router.beforeEach", (AppState.Authenticated ? "Authenticated" : "NOT AUTHENTICATED"), from, to);
 if (to.matched.some(record => record.meta.requiresAuth)) {
  if (AppState.Authenticated) {
   next()
   return
  }
  next('/login')
 } else {
  next()
 }
})

export default router