<template>
  <div :class="{ 'dark-theme': darkTheme }">
    <h1>Settings</h1>
    <h2>General</h2>
    <ul>
      <li>
        <p>Dark theme</p>
        <button @click="toggleDarkTheme">Toggle dark and bright theme</button>
      </li>
      <li>
        <span>Change font size</span>
        <select v-model="fontSize" @change="updateFontSize">
          <option value="small">Small (14px)</option>
          <option value="normal">Normal (16px)</option>
          <option value="big">Big (18px)</option>
        </select>
      </li>
    </ul>

    <h2>Account settings</h2>
    <ul>
      <li>Change username</li>
      <li>Change password</li>
      <li><button @click="logOut">Log out</button></li>
      <li><button @click="openModal = true">Delete account</button></li>
    </ul>

    <!-- Correction du Teleport : il doit envelopper la modale -->
    <teleport to="body">
      <Modal v-if="openModal">
        <h3>Delete account</h3>
        <p>
          Are you really sure you want to delete your account? This decision is
          irreversible.
        </p>
        <button
          @click="
            () => {
              deleteAccount();
              openModal = false;
            }
          "
        >
          Yes, I do
        </button>
        <button @click="openModal = false">I am not so sure anymore</button>
      </Modal>
    </teleport>

    <p v-if="accountDeleted">
      Congratulations you just successfully deleted your account!
    </p>
    <p v-if="message" class="error-message" style="color: red">{{ message }}</p>
  </div>
</template>

<script>
import Modal from "./Modal.vue";

const API_URL = "http://localhost:3000/api"; // Adaptez selon votre port backend

export default {
  components: {
    Modal,
  },
  data() {
    return {
      darkTheme: false,
      newPassword: "",
      newUserName: "",
      fontSize: "normal",
      openModal: false,
      accountDeleted: false,
      message: "",
    };
  },
  mounted() {
    // Optionnel : récupérer les infos de l'utilisateur au chargement
    this.getMe();
  },
  methods: {
    updateFontSize() {
      const sizes = {
        small: "14px",
        normal: "16px",
        big: "18px",
      };
      // Modification de la taille de police sur l'élément html racine (en rem)
      document.documentElement.style.fontSize = sizes[this.fontSize];
    },

    toggleDarkTheme() {
      this.darkTheme = !this.darkTheme;
      // Ajout/suppression d'une classe globale sur le body ou html pour le CSS
      if (this.darkTheme) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    },
    async deleteAccount() {
      try {
        const response = await fetch(`${API_URL}/users/me`, {
          method: "DELETE",
          credentials: "include", // Indispensable pour envoyer le cookie HTTP-only
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.removeItem("poliyvalues_token");
          this.accountDeleted = true;
          setTimeout(() => {
            this.$router.push("/login"); // Redirection vers la page de login
          }, 2000);
        } else {
          this.message = data.error || "Delete failed";
        }
      } catch (error) {
        this.message = error.message;
      }
    },
    async logOut() {
      try {
        // Appel au backend pour vider le cookie JWT
        await fetch(`${API_URL}/auth/logout`, {
          method: "POST",
          credentials: "include",
        });

        localStorage.removeItem("poliyvalues_token");
        localStorage.removeItem("is_admin");
        this.$router.push("/login");
      } catch (error) {
        console.error("Logout error:", error);
      }
    },
    async getMe() {
      try {
        const response = await fetch(`${API_URL}/users/me`, {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
          this.message = data.error || "Server error";
        } else {
          console.log("User data:", data);
        }
      } catch (error) {
        this.message = error.message;
      }
    },
  },
};
</script>
