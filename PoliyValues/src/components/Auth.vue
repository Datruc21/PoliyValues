<template>
  <div class="auth-container">
    <!-- SCREEN 1: SIGN IN OR SIGN UP -->
    <template v-if="!isVerifying">
      <h1 v-if="accountCreated">Welcome to PoliyValues, sign in to proceed</h1>
      <h1 v-else>Welcome to PoliyValues, sign up to proceed</h1>

      <form v-on:submit.prevent="handleAuthSubmit">
        <input
          v-if="!accountCreated"
          v-model="name"
          placeholder="Please enter your name"
          required
        />
        <input v-model="email" type="text" placeholder="Please enter your email address" required />
        <input
          v-model="password"
          type="password"
          placeholder="Please enter your password"
          required
        />
        <button type="submit">
          {{ accountCreated ? "Sign In" : "Sign Up" }}
        </button>
      </form>

      <div class="google-btn-container" v-if="accountCreated">
        <div id="buttonDiv"></div>
      </div>

      <a v-if="accountCreated" @click="accountCreated = false">No account ? Sign up here</a>
      <a v-else @click="accountCreated = true">Already have an account ? Sign in here</a>
    </template>

    <!-- SCREEN 2: EMAIL VERIFICATION -->
    <template v-else>
      <h1>Email Verification</h1>
      <p class="subtitle">
        A 6-digit code has been sent to <b>{{ email }}</b>
      </p>

      <form v-on:submit.prevent="handleVerifyEmail">
        <input
          v-model="verificationCode"
          type="text"
          maxlength="6"
          placeholder="Enter the 6-digit code"
          required
        />
        <button type="submit">Verify Code</button>
      </form>

      <a @click="handleResendCode">Resend Code</a>
      <a @click="isVerifying = false">Back to Sign In</a>
    </template>

    <span v-if="message" v-text="message" :style="{ color: error ? 'red' : 'green' }"></span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: "",
      name: "",
      verificationCode: "",
      error: false,
      message: "",
      accountCreated: true,
      isVerifying: false,
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
        const btnContainer = document.getElementById("buttonDiv");
        if (btnContainer) {
          window.google.accounts.id.renderButton(btnContainer, {
            theme: "outline",
            size: "large",
            width: "100%",
          });
        }
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
            this.$router.push("/Home");
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
      if (!this.email || !this.password) return;
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
          localStorage.setItem("is_admin", data.data.user.Admin);
          localStorage.setItem("user_name", data.data.user.name);
          setTimeout(() => {
            this.$router.push("/Home");
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

    async handleRegister() {
      if (!this.email || !this.password || !this.name) return;
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
          this.error = false;
          this.message = "Account created! Please enter the code sent to your email.";
          this.isVerifying = true;
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

    async handleVerifyEmail() {
      if (!this.verificationCode) return;
      try {
        const answer = await fetch(`${this.$apiUrl}/auth/verify-email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: this.email,
            code: this.verificationCode,
          }),
        });

        const data = await answer.json();
        if (answer.ok) {
          this.error = false;
          this.message = "Email verified successfully! You can now sign in.";
          this.isVerifying = false;
          this.accountCreated = true;
          this.verificationCode = "";
          this.password = "";
        } else {
          this.error = true;
          this.message = "Error: " + data.error;
        }
      } catch (error) {
        this.error = true;
        this.message = "Server connection error";
        console.error("Verification error:", error);
      }
    },

    async handleResendCode() {
      try {
        const answer = await fetch(`${this.$apiUrl}/auth/resend-code`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: this.email }),
        });
        const data = await answer.json();
        if (answer.ok) {
          this.error = false;
          this.message = "New verification code sent to your email!";
        } else {
          this.error = true;
          this.message = "Error: " + data.error;
        }
      } catch (error) {
        this.error = true;
        this.message = "Error connecting to server";
      }
    },

    handleAuthSubmit() {
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
.subtitle {
  text-align: center;
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-bottom: 1rem;
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
  text-align: center;
  font-size: 1rem;
  letter-spacing: 2px;
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
/* Style spécifique pour les boutons de suppression en rouge */
.btn-danger,
button.delete-btn {
  background-color: #dc3545 !important;
}
.btn-danger:hover,
button.delete-btn:hover {
  background-color: #b02a37 !important;
}
.google-btn-container {
  margin-top: 1.5rem;
  display: flex;
  justify-content: center;
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
  border-radius: 4px;
}
</style>
