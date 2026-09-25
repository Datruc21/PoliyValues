<template>
  <div id="layout">
    <header>
      <h1>Values</h1>
      <nav>
        <ul id="nav-list">
          <li href="#surprise">Surprise me</li>
          <li href="#favorites">My favorites</li>
          <li href="#about">About us</li>
          <li href="parameters">Parameters</li>
          <li>{{ accountName }}</li>
        </ul>
      </nav>
    </header>
    <footer>
      <h3>Contacts informations</h3>
      <h3>Our inspirations</h3>
      <h3>How we handle your data</h3>
    </footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      accountName: "lorem ipsum",
    };
  },
};
</script>

<style scoped>
header,
ul {
  display: flex;
  flex-direction: row;
}

template {
  display: flex;
  flex-direction: column;
}
</style>
