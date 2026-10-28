import { createRouter, createWebHistory } from "vue-router";

//Import all components pages
import Settings from "../components/Settings.vue";
import Home from "../components/Home.vue";
import Auth from "../components/Auth.vue";
import Quizz from "../components/Quizz.vue";
import Admin from "../components/Admin.vue";
import About from "../components/About.vue";
import Favorite from "../components/Favorite.vue";
import Surprise from "../components/Surprise.vue";
import Stats from "../components/Stats.vue";

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
  {
    path: "/about",
    component: About,
    meta: { requiresAuth: true },
  },
  {
    path: "/surprise",
    component: Surprise,
    meta: { requiresAuth: true },
  },
  {
    path: "/favorite",
    component: Favorite,
    meta: { requiresAuth: true },
  },
  {
    path: "/",
    redirect: () => {
      const token = localStorage.getItem("poliyvalues_token");
      return token ? { path: "/home" } : { path: "/auth" };
    },
  },
  { path: "/home", component: Home, meta: { requiresAuth: true } },
  { path: "/quizz", component: Quizz, meta: { requiresAuth: true } },
  { path: "/admin", component: Admin, meta: { requiresAuth: true } },
  { path: "/stats", component: Stats, meta: { requiresAuth: true } },
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
