<script setup lang="ts">
import Navbar from './components/Navbar.vue';

</script>

<template>
  <div id="layout">


    <Navbar />


    <footer>
      <h3>Contacts informations</h3>
      <h3>Our inspirations</h3>
      <h3>How we handle your data</h3>
    </footer>
  </div>
</template>



<style>
body, html {
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
