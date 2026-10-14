<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import Navbar from "./components/Navbar.vue";
import Auth from "./components/Auth.vue";
import Settings from "./components/Settings.vue";
import Quizz from './components/Quizz.vue'
import Footer from "./components/Footer.vue";

const route = useRoute();

// Propriété calculée pour savoir si on est sur la page d'authentification
const isAuthPage = computed(() => route.path === "/auth");

// Gestion des classes du body selon le token
const token = localStorage.getItem("poliyvalues_token");
const isAdmin = localStorage.getItem("is_admin");

if (token) {
  document.body.classList.add("authenticated");
  if (isAdmin === "1" || isAdmin === "true") {
    document.body.classList.add("admin-user"); //Body en admin uniquement pour certains elements niveau visibilité
  }
}
</script>

<template>
  <div id="layout">
    <!-- On affiche la Navbar et le Footer uniquement si on n'est PAS sur /auth -->
    <Navbar v-if="!isAuthPage" />

    <main>
      <RouterView />
    </main>

    <Footer v-if="!isAuthPage" />
  </div>
</template>

<style>
body,
html {
  margin: 0;
  padding: 0;
  width: 100%;
}

#app {
  margin: 0;
  padding: 0;
  max-width: 100%;
  width: 100%;
}
</style>
