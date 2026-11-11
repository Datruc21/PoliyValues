<template>
  <div class="auth-container">
    <h1 v-if="accountCreated">Welcome to PoliyValues, sign in to proceed</h1>
    <h1 v-else>Welcome to PoliyValues, sign up to proceed</h1>
    <form v-on:submit.prevent="handleAuthSubmit">
      <input v-if="!accountCreated" v-model="name" placeholder="Please enter your name" required />
      <input v-model="email" type="text" placeholder="Please enter your email address" required />
      <input v-model="password" type="password" placeholder="Please enter your password" required />
      <button type="submit">
        {{ accountCreated ? "Sign In" : "Sign Up" }}
      </button>
    </form>
    <div class="google-btn-container">
      <div id="buttonDiv"></div>
    </div>
    <a v-if="accountCreated" @click="accountCreated = false">No account ? Sign up here</a>
    <a v-else @click="accountCreated = true">Already have an account ? Sign in here</a>
    <span v-if="message" v-text="message" :style="{ color: error ? 'red' : 'green' }"></span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      error: false,
      password: "",
      name: "",
      message: "",
      //The boolean for toggling between sign in and sign up
      accountCreated: true,
    };
  },
  mounted() {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => this.initGoogleSingleSignOn();
    document.head.appendChild(script);
  },
  methods: {
    initGoogleSingleSignOn() {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: this.handleGoogleResponse,
        });
        window.google.accounts.id.renderButton(document.getElementById("buttonDiv"), {
          theme: "outline",
          size: "large",
          width: "100%",
        });
      }
    },

    async handleGoogleResponse(response) {
      try {
        const answer = await fetch(`${this.$apiUrl}/auth/google`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ credential: response.credential }),
        });

        const data = await answer.json();
        if (answer.ok) {
          this.error = false;
          this.message = "Successfully logged in with Google!";
          localStorage.setItem("poliyvalues_token", data.token);
          localStorage.setItem("is_admin", data.data.user.Admin);
          localStorage.setItem("user_name", data.data.user.name);
          setTimeout(() => {
            this.$router.push("/Home"); // ou window.location.href = "/" selon ton router
          }, 1000);
        } else {
          this.error = true;
          this.message = "Error: " + data.error;
        }
      } catch (error) {
        this.error = true;
        this.message = "Error connecting with Google server";
        console.error("Google auth error:", error);
      }
    },
    async handleLogin() {
      if (!this.email || !this.password) return; //Must add an error message
      try {
        const answer = await fetch(`${this.$apiUrl}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: this.email, password: this.password }),
        });

        const data = await answer.json();
        if (answer.ok) {
          this.email = "";
          this.password = "";
          this.error = false;
          this.message = "Welcome back";
          localStorage.setItem("poliyvalues_token", data.token);
          localStorage.setItem("is_admin", data.data.user.Admin); //This is only for UI purposes, changing its value wont affected backend
          localStorage.setItem("user_name", data.data.user.name);
          setTimeout(() => {
            this.$router.push("/Home");
          }, 2000);

          //Add in the if adding the cookie in localStorage
        } else {
          this.error = true;
          this.message = "Error: " + data.error;
        }
      } catch (error) {
        this.error = true;
        this.message = "Error, cannot connect with the server";
        console.error("Error: " + error);
      }
    },
    async handleRegister() {
      if (!this.email || !this.password || !this.name) return; //Also must add an error message
      try {
        const answer = await fetch(`${this.$apiUrl}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: this.email,
            password: this.password,
            name: this.name,
          }),
        });

        const data = await answer.json();
        if (answer.ok) {
          this.accountCreated = true;
          this.email = "";
          this.password = "";
          this.name = "";
          this.message = "Successful account creation, welcome to Poliyvalues";
          this.error = false;
          localStorage.setItem("poliyvalues_token", data.token);
          localStorage.setItem("is_admin", data.data.user.Admin);
          localStorage.setItem("user_name", data.data.user.name);
          setTimeout(() => {
            window.location.href = "/";
          }, 2000);
        } else {
          this.error = true;
          this.message = "Error: " + data.error;
        }
      } catch (error) {
        this.error = true;
        this.message = "Error, cannot connect with the server";
        console.error("Error: " + error);
      }
    },

    handleAuthSubmit() {
      //Must sent same informations: but not to the same route whether we
      //create a new account or just log in
      if (this.accountCreated) {
        this.handleLogin();
      } else {
        this.handleRegister();
      }
    },
  },
};
</script>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: 4rem auto;
  padding: 2rem;
  font-family: sans-serif;
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 8px;
}
h1 {
  text-align: center;
  color: var(--primary-color);
  font-size: 1.5rem;
  border-bottom: 2px solid var(--primary-color);
  padding-bottom: 10px;
  margin-bottom: 20px;
}
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
input {
  width: 100%;
  padding: 0.75rem;
  background-color: var(--input-bg);
  color: var(--text-main);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  box-sizing: border-box;
}
button {
  padding: 0.75rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
}
button:hover {
  opacity: 0.8;
}
a {
  display: block;
  text-align: center;
  margin-top: 1.5rem;
  color: var(--text-muted);
  cursor: pointer;
  text-decoration: none;
  font-weight: bold;
}
a:hover {
  color: var(--primary-color);
  text-decoration: underline;
}
span {
  display: block;
  text-align: center;
  margin-top: 1rem;
  padding: 0.5rem;
  font-weight: bold;
  color: var(--danger-color);
  background-color: var(--border-color);
  border-radius: 4px;
}
</style>
