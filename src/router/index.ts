import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue' 
import About from '../views/About.vue' 

const routes: Array<RouteRecordRaw> = [
 {
  path: '/',
  name: 'Home',
  component: Home,
  alias: ['/Login', '/Logout']
 },
 {
  path: '/about',
  name: 'About',
  component: About
 }
]

console.log("ROUTER INIT"); // Router wird vor main.ts ausgeführt!

const router = createRouter({
 history: createWebHistory(process.env.BASE_URL),
 routes
})

// Abfangen aller Abfragen (hier nur zu Protokollzwecken!)
router.beforeEach((to, from, next) => {
 console.log("--> router.beforeEach", from, to);
 next();
})

export default router