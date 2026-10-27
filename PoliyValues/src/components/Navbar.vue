<template>
  <header class="navbar">
    <h1 class="logo">
      <router-link to="/Home" class="logo-link">Values</router-link>
    </h1>
    <nav class="nav-bar">
      <router-link to="/home">Home</router-link>
      <router-link to="/quizz">Quizz</router-link>
      <router-link to="/favorite">My Favorite</router-link>
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
}

.logo-link {
  color: white;
  text-decoration: none;
}

.nav-bar {
  display: flex;
  gap: 30px;
  flex-direction: row;
  align-items: center;
}

.nav-bar a,
.nav-bar span {
  color: white;
  text-decoration: none;
  font-size: 1.1rem;
  white-space: nowrap;
}

.nav-bar a:hover {
  text-decoration: underline;
}

/* Vue Router ajoute automatiquement cette classe sur le lien actif */
.nav-bar a.router-link-exact-active {
  font-weight: bold;
  text-decoration: underline;
}
</style>
<!--      <a href="#surprise">Surprise me</a>
      <a href="#favorites">My favorites</a>
      <a href="#about">About us</a>
to add in router link
      -->
