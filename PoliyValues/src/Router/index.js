import { createRouter, createWebHistory } from "vue-router";

//Import all components pages
import Settings from "../components/Settings.vue";
import Home from "../components/Home.vue";
import Auth from "../components/Auth.vue";
import Quizz from "../components/Quizz.vue";
import Admin from "../components/Admin.vue";



const routes = [
  {
    path: "/settings",
    component: Settings,
    meta: { requiresAuth: true },
  },
  {
    path: "/auth",
    component: Auth,
  },
  // {                        Deactivated until the component exist 
  //   path: "/about",
  // },
  // {
  //   path: "/suprise",
  //   meta: { requiresAuth: true },
  // },
  // {
  //   path: "/favorite",
  //   meta: { requiresAuth: true },
  // },
  {
    path: "/",
    redirect: () => {
      const token = localStorage.getItem("poliyvalues_token");
      return token ? { path: "/Home" } : { path: "/auth" };
    },
  },
  { path: "/Home", component: Home, meta: { requiresAuth: true } },
  { path: "/Quizz", component: Quizz, meta: { requiresAuth: true } },
  { path: "/Admin", component: Admin, meta: { requiresAuth: true }},
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});


router.beforeEach((to) => {
  const token = localStorage.getItem("poliyvalues_token");

  if (to.meta.requiresAuth && !token) {
    return "/auth";
  }
});
