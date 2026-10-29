<template>
  <header class="navbar">
    <h1 class="logo">
      <router-link to="/Home" class="logo-link" style="font-size: 2rem">Values</router-link>
    </h1>
    <nav class="nav-bar">
      <router-link to="/home">Home</router-link>
      <router-link to="/quizz">Quizz</router-link>
      <router-link to="/favorite">My Favorites</router-link>
      <router-link to="/about">About us</router-link>

      <router-link to="/surprise">Suprise me</router-link>
      <router-link to="/settings">Settings</router-link>

      <span class="account-name">{{ accountName }}</span>
    </nav>
  </header>
</template>

<script>
export default {
  data() {
    return {
      accountName: "My account",
    };
  },
  mounted() {
    // Optionnel : Si tu stockes le nom de l'utilisateur dans le localStorage lors de la connexion
    const storedName = localStorage.getItem("user_name");
    if (storedName) {
      this.accountName = storedName;
    }
  },
};
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 40px;
  box-sizing: border-box;
  background-color: var(--header-bg);
  border-bottom: 1px solid var(--border-color);
}
.logo {
  font-size: 2rem;
  font-weight: bold;
  margin: 0;
}
.logo-link,
.nav-bar a,
.nav-bar span {
  color: white;
  text-decoration: none;
  font-size: 1.1rem;
}
.nav-bar {
  display: flex;
  gap: 30px;
  align-items: center;
}
.nav-bar a:hover {
  text-decoration: underline;
}
.nav-bar a.router-link-exact-active {
  font-weight: bold;
  text-decoration: underline;
}

.navbar .account-name {
  color: var(--header-bg);
  background-color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 50px;
}

@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    padding: 10px;
  }
  .nav-bar {
    flex-wrap: wrap;
    justify-content: center;
    gap: 15px;
    margin-top: 10px;
  }
}
</style>
