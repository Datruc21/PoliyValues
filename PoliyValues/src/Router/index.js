import {createRouter, createWebHistory} from 'vue-router'

//Import all components pages
import Settings from '../components/Settings.vue'
import Home from '../components/Home.vue'

const routes = [{
  path: '/settings',
  component: Settings
}, 
{path:'/Home',
 component: Home
}]

export const router = createRouter({
  history: createWebHistory(),
  routes
})
