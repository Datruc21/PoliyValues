<template>
  <div class="settings-container">
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

    <div class="setting-item">
      <h3>Update Profile</h3>
      <form @submit.prevent="updateProfile">
        <div class="form-group">
          <label>Name:</label>
          <input
            v-model="newUserName"
            type="text"
            placeholder="Enter new username"
          />
        </div>
        <div class="form-group">
          <label>Email:</label>
          <input
            v-model="newEmail"
            type="email"
            placeholder="Enter new email"
          />
        </div>
        <button type="submit">Update Profile</button>
      </form>
    </div>

    <!-- Formulaire Modifier Mot de passe -->
    <div class="setting-item">
      <h3>Change Password</h3>
      <form @submit.prevent="changePassword">
        <div class="form-group">
          <input
            v-model="oldPassword"
            type="password"
            placeholder="Current password"
            required
          />
        </div>
        <div class="form-group">
          <input
            v-model="newPassword"
            type="password"
            placeholder="New password (min. 6 characters)"
            required
          />
        </div>
        <button type="submit">Change Password</button>
      </form>
    </div>

    <!-- Messages de succès et d'erreur -->
    <p v-if="successMessage" style="color: green">{{ successMessage }}</p>
    <p v-if="message" class="error-message" style="color: red">{{ message }}</p>

    <button class="btn-danger" @click="logOut">Log out</button>
    <button class="btn-danger" @click="openModal = true">Delete account</button>


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
  </div>
</template>

<script>
import Modal from "./Modal.vue";

export default {
  components: {
    Modal,
  },
  data() {
    return {
      darkTheme: false,
      newUserName: "",
      newEmail: "",
      oldPassword: "",
      newPassword: "",
      fontSize: "normal",
      openModal: false,
      accountDeleted: false,
      message: "",
      successMessage: "",
    };
  },
  mounted() {
    // Récupérer les infos de l'utilisateur au chargement
    this.getMe();
  },
  methods: {
    async updateProfile() {
      this.message = "";
      this.successMessage = "";

      const payload = {};
      if (this.newUserName && this.newUserName.trim() !== "") {
        payload.name = this.newUserName;
      }
      if (this.newEmail && this.newEmail.trim() !== "") {
        payload.email = this.newEmail;
      }

      if (Object.keys(payload).length === 0) {
        this.message = "Please fill in at least one field to update.";
        return;
      }

      try {
        const token = localStorage.getItem("poliyvalues_token");
        const response = await fetch(`${this.$apiUrl}/auth/me`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (response.ok) {
          this.successMessage = "Profile updated successfully!";
          if (data.data.name) {
            localStorage.setItem("user_name", data.data.name);
          }
        } else {
          this.message = data.error || "Update failed";
        }
      } catch (error) {
        this.message = error.message;
      }
    },

    async changePassword() {
      this.message = "";
      this.successMessage = "";
      try {
        const token = localStorage.getItem("poliyvalues_token");
        const response = await fetch(`${this.$apiUrl}/auth/password`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            oldPassword: this.oldPassword,
            newPassword: this.newPassword,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          this.successMessage = "Password changed successfully!";
          this.oldPassword = "";
          this.newPassword = "";
        } else {
          this.message = data.error || "Change password failed";
        }
      } catch (error) {
        this.message = error.message;
      }
    },

    updateFontSize() {
      const sizes = {
        small: "14px",
        normal: "16px",
        big: "18px",
      };
      document.documentElement.style.fontSize = sizes[this.fontSize];
    },

    toggleDarkTheme() {
      this.darkTheme = !this.darkTheme;
      if (this.darkTheme) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    },

    async deleteAccount() {
      try {
        const token = localStorage.getItem("poliyvalues_token");
        const response = await fetch(`${this.$apiUrl}/auth/me`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.removeItem("poliyvalues_token");
          this.accountDeleted = true;
          setTimeout(() => {
            this.$router.push("/auth");
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
        const token = localStorage.getItem("poliyvalues_token");
        await fetch(`${this.$apiUrl}/auth/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        localStorage.removeItem("poliyvalues_token");
        localStorage.removeItem("is_admin");
        this.$router.push("/auth");
      } catch (error) {
        console.error("Logout error:", error);
      }
    },

    async getMe() {
      try {
        const token = localStorage.getItem("poliyvalues_token");
        const response = await fetch(`${this.$apiUrl}/auth/me`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          this.message = data.error || "Server error";
        } else {
          this.newUserName = data.name || "";
          this.newEmail = data.email || "";
        }
      } catch (error) {
        this.message = error.message;
      }
    },
  },
};
</script>


<style scoped>
.settings-container {
  max-width: 650px;
  margin: 3rem auto;
  padding: 2rem;
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 8px;
}
h1 {
  text-align: center;
  color: var(--primary-color);
  font-size: 2.2rem;
  text-transform: uppercase;
  border-bottom: 2px solid var(--primary-color);
  padding-bottom: 10px;
  margin-bottom: 20px;
}
h2 {
  color: var(--primary-color);
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 5px;
  margin: 2rem 0 1rem;
}
h3, li p, li span, label { color: var(--text-main); }
ul { list-style-type: none; padding: 0; margin: 0 0 2rem 0; }
li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid var(--border-color);
}
.setting-item {
  background-color: var(--bg-body);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}
.form-group { margin-bottom: 1rem; }
.form-group label { display: block; font-weight: bold; margin-bottom: 0.3rem; }
input, select {
  width: 100%;
  padding: 0.75rem;
  background-color: var(--input-bg);
  color: var(--text-main);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  box-sizing: border-box;
}
button {
  padding: 0.75rem 1.25rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: opacity 0.2s ease;
  margin: 0.5rem 0.5rem 0 0;
}
button:hover { opacity: 0.8; }
button.btn-danger {
  background-color: var(--danger-color);
}
.error-message {
  font-weight: bold; color: var(--danger-color) !important;
  background-color: var(--border-color); padding: 0.75rem; border-radius: 4px;
}
</style>