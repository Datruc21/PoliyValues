<script setup lang="ts">
import Navbar from "./components/Navbar.vue";
import Auth from "./components/Auth.vue";
import Settings from "./components/Settings.vue";
import Footer from './components/Footer.vue';
import Quizz from './components/Quizz.vue'
</script>

<template>
  <div id="layout">


    <Navbar /> 

    <main>
      <RouterView />
    </main>

    <Footer />
    
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

/* template {
  display: flex;
  flex-direction: column;
} */
</style>
