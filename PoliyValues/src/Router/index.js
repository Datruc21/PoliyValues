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

// Le Guard de navigation pour intercepter les changements de page
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("poliyvalues_token"); // Ou ta méthode pour récupérer le token

  // Si la route demande une authentification et qu'il n'y a pas de token
  if (to.meta.requiresAuth && !token) {
    next("/auth"); // Redirection vers la page de connexion
  } else {
    next(); // Laisse passer
  }
});
