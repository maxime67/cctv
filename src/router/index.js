import { createRouter, createWebHistory } from 'vue-router'
import LocationView from '../views/LocationView.vue'

const routes = [
  { path: '/', redirect: '/fouesnant' },
  { path: '/:id', component: LocationView },
]

export default createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})
