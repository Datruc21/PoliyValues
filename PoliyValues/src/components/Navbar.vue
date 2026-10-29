<template>
  <header class="navbar">
    <h1 class="logo">
      <router-link to="/Home" class="logo-link"> Values </router-link>
    </h1>

    <!-- Bouton burger visible sur mobile -->
    <button
      class="burger"
      @click="menuOpen = !menuOpen"
      :aria-expanded="menuOpen"
      aria-label="Ouvrir ou fermer le menu"
      aria-controls="main-navigation"
    >
      <span></span>
      <span></span>
      <span></span>
    </button>

    <!-- Navigation -->
    <nav id="main-navigation" class="nav-bar" :class="{ 'nav-open': menuOpen }">
      <router-link to="/home" @click="closeMenu"> Home </router-link>

      <router-link to="/quizz" @click="closeMenu"> Quizz </router-link>

      <router-link to="/favorite" @click="closeMenu"> My Favorites </router-link>

      <router-link to="/about" @click="closeMenu"> About us </router-link>

      <router-link to="/surprise" @click="closeMenu"> Surprise me </router-link>

      <router-link to="/settings" @click="closeMenu"> Settings </router-link>

      <span class="account-name">
        {{ accountName }}
      </span>
    </nav>
  </header>
</template>

<script>
export default {
  data() {
    return {
      accountName: "My account",
      menuOpen: false,
    };
  },

  mounted() {
    const storedName = localStorage.getItem("user_name");

    if (storedName) {
      this.accountName = storedName;
    }
  },

  methods: {
    closeMenu() {
      this.menuOpen = false;
    },
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

.logo-link {
  font-size: 2rem;
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

/* Bouton burger caché sur ordinateur */
.burger {
  display: none;
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 8px;
}

.burger span {
  display: block;
  width: 26px;
  height: 3px;
  margin: 5px 0;
  border-radius: 2px;
  background: white;
}

/* Version mobile */
@media (max-width: 768px) {
  .navbar {
    position: relative;
    flex-wrap: wrap;
    padding: 12px 16px;
  }

  .burger {
    display: block;
  }

  .nav-bar {
    display: none;
    flex-direction: column;
    align-items: stretch;
    width: 100%;
    gap: 0;
    padding-top: 12px;
  }

  .nav-bar.nav-open {
    display: flex;
  }

  .nav-bar a {
    padding: 12px 8px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  }

  .navbar .account-name {
    margin-top: 12px;
    align-self: flex-start;
  }
}
</style>
