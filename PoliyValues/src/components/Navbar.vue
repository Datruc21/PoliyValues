<template>
  <header class="navbar">
    <h1 class="logo">Values</h1>
    <nav class="nav-bar">
      <a href="#surprise">Surprise me</a>
      <a href="#favorites">My favorites</a>
      <a href="#about">About us</a>
      <a href="#parameters">Parameters</a>
      <span>{{ accountName }}</span>
    </nav>
  </header>
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
.navbar {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  box-sizing: border-box;

  background-color: #075707;
  border-bottom: 1px solid black;
  padding: 15px 40px;
}

.logo {
  font-size: 2rem;
  font-weight: bold;
  margin: 0;
  color: white;
}

.nav-bar {
  display: flex;
  gap: 30px;
  flex-direction: row;
  align-items: center;
}

.nav-bar a, .nav-bar span {
  color: white;
  text-decoration: none;
  font-size: 1.1rem;
  white-space: nowrap;
}

.nav-bar a:hover {
  text-decoration: underline;
}
</style>