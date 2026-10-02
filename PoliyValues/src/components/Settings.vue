<!-- This page is made to change different settings
 Parameters of account (delete, log out)
 personal informations
 potentially a dark them

Font size unit will be in rem and we shall modify it in the html element

For deleting an account, we will first use the modal component to create a popup, it is a component
that specifically appears on top of the current page


We need to implement all the logic for deleting, logging out and changing the css
 -->

<template>
  <div>
    <h1>Settings</h1>
    <h2>General</h2>
    <ul>
      <li>
        <p>Dark theme</p>
        <button @click="toggleDarkTheme">Toggle dark and bright theme</button>
      </li>
      <li>
        <span>Change font size</span>
        <select v-model="fontSize" @change="updateFontSize"></select>
        <option value="small">Small</option>
        <option value="normal">Normal</option>
        <option value="big">Big</option>
      </li>
    </ul>

    <h2>Account settings</h2>
    <ul>
      <li>Change username</li>
      <li>Change password</li>
      <li><button @click="logOut">Log out</button></li>
      <li><button @click="openModal = true">Delete account</button></li>
    </ul>

    <teleport to="body" />
    <Modal v-if="openModal">
      <h3>Delete account</h3>
      <p>
        Are you really sure you want to delete your account? This decision is
        irrversible.
      </p>
      <button v-on:click="deleteAccount">Yes, I do</button>
      <button v-on:click="openModal = false">I am not so sure anymore</button>
      <p v-if="accountDeleted">
        Congratulations you just successfully deleted your account!
      </p>
    </Modal>
  </div>
</template>

<script>
import Modal from "./Modal.vue";
export default {
  data() {
    return {
      darkTheme: false,
      newPassword: "",
      newUserName: "",
      fontSize: "normal",
      openModal: false,
      accountDeleted: false,
    };
  },
  methods: {
    updateFontSize() {
      const sizes = {
        small: "14px",
        normal: "16px",
        big: "18px",
      };
    },
    toggleDarkTheme() {
      this.darkTheme = !this.darkTheme;
    },
    logOut() {},
    deleteAccount() {},
  },
};
</script>
