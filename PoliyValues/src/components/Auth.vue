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
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: "",
      //The boolean for toggling between sign in and sign up
      accountCreated: true,
    };
  },
  methods: {
    handleAuthSubmit() {
      //Must sent same informations: but not to the same route whether we
      //create a new account or just log in
      console.log(`Test : you just entered ${this.email} and ${this.password}`);
    },
  },
};
</script>
