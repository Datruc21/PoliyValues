<!-- 
This component handles the sign in and the sign up of user
You should see it only if no session cookie has been found in your web browser
Simple toggle between sign in and sign up
To Do : -add potentially google account
        -handleLogin and backend
-->

<template>
  <div>
    <h1 v-if="accountCreated">Welcome to PoliyValues, sign in to proceed</h1>
    <h1 v-else>Welcome to PoliyValues, sign up to proceed</h1>
    <form v-on:submit.prevent="handleAuthSubmit">
      <input
        v-if="!accountCreated"
        v-model="name"
        placeholder="Please enter your name"
        required
      />
      <input
        v-model="email"
        type="text"
        placeholder="Please enter your email address"
        required
      />
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
    <a v-if="accountCreated" @click="accountCreated = false"
      >No account ? Sign up here</a
    >
    <a v-else @click="accountCreated = true"
      >Already have an account ? Sign in here</a
    >
    <span v-if="message" v-text="message"></span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: "",
      name: "",
      message: "",
      //The boolean for toggling between sign in and sign up
      accountCreated: true,
    };
  },
  methods: {
    async handleLogin() {
      if (!this.email || !this.password) return; //Must add an error message
      try {
        const answer = await fetch(`${this.$apiUrl}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: this.email, password: this.password }),
        });

        const data = await answer.json();
        if (answer.ok) {
          this.email = "";
          this.password = "";
          this.message = "Welcome back";
          localStorage.setItem("poliyvalues_token", data.token);
          localStorage.setItem("is_admin", data.data.user.isAdmin); //This is only for UI purposes, changing its value wont affected backend
          setTimeout(() => {
            window.location.href = "/";
          }, 2000);

          //Add in the if adding the cookie in localStorage
        } else {
          this.message = "Error: " + data.error;
        }
      } catch (error) {
        this.message = "Error, cannot connect with the server";
        console.error("Error: " + error);
      }
    },
    async handleRegister() {
      if (!this.email || !this.password || !this.name) return; //Also must add an error message
      try {
        const answer = await fetch(`${this.$apiUrl}/register`, {
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
          localStorage.setItem("poliyvalues_token", data.token);
          localStorage.setItem("is_admin", data.data.user.isAdmin);
          setTimeout(() => {
            window.location.href = "/";
          }, 2000);
        } else {
          this.message = "Error: " + data.error;
        }
      } catch (error) {
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
