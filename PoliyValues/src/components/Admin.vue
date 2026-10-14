<!--
This component handles everythign admin related
-search ban/ unban individuals
-search modify/add/delete question
-make/undo administration for someone



to modify, template-->

<template>
  <div class="admin-dashboard">
    <h1>Admin Panel</h1>
    <div class="admin-grid">
      <!-- ================= SECTION 1: QUESTION MANAGEMENT ================= -->
      <section class="admin-section">
        <h2>Question Management</h2>

        <!-- Add / Edit Form -->
        <div class="form-card">
          <h3>Add / Edit a Question</h3>
          <div class="form-group">
            <label>Question:</label>
            <input
              type="text"
              v-model="question_text"
              placeholder="Enter question text"
            />
          </div>

          <div class="form-group">
            <label>Explanation / Concept:</label>
            <textarea
              v-model="explanation_concept"
              placeholder="Explain the concept..."
            ></textarea>
          </div>

          <div class="form-group">
            <label>Theme:</label>
            <input
              type="text"
              v-model="theme"
              placeholder="e.g., Mathematics, History..."
            />
          </div>

          <div class="form-group">
            <label>Useful Links:</label>
            <input type="text" v-model="links" placeholder="Associated links" />
          </div>

          <div class="button-group">
            <button @click="addQuestion" class="btn btn-primary">Add</button>
            <button @click="editQuestion" class="btn btn-secondary">
              Edit
            </button>
          </div>
        </div>

        <!-- Search & Deletion -->
        <div class="action-card">
          <h3>Search & Delete</h3>
          <div class="search-box">
            <input
              type="text"
              v-model="name"
              placeholder="Search for a question..."
            />
            <button @click="searchQuestion" class="btn btn-info">Search</button>
          </div>
          <button @click="deleteQuestion" class="btn btn-danger mt-3">
            Delete Question
          </button>
        </div>
      </section>

      <!-- ================= SECTION 2: USER & ROLE MANAGEMENT ================= -->
      <section class="admin-section">
        <h2>User & Role Management</h2>

        <!-- Search User -->
        <div class="action-card">
          <h3>Search a User</h3>
          <div class="search-box">
            <input type="text" v-model="name" placeholder="Username..." />
            <button @click="searchUser" class="btn btn-info">Search</button>
          </div>
        </div>

        <!-- Ban / Unban -->
        <div class="action-card">
          <h3>Moderation (Banning)</h3>
          <p class="user-status">
            Current admin status:
            <strong>{{ isAdmin ? "Administrator" : "Standard User" }}</strong>
          </p>
          <div class="button-group">
            <button @click="banUser" class="btn btn-danger">Ban</button>
            <button @click="unbanUser" class="btn btn-success">Unban</button>
          </div>
        </div>

        <!-- Admin Roles -->
        <div class="action-card">
          <h3>Administrator Rights</h3>
          <div class="button-group">
            <button @click="makeAdmin" class="btn btn-primary">
              Make Admin
            </button>
            <button @click="undoAdmin" class="btn btn-warning">
              Remove Admin
            </button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      question_text: "",
      explanation_concept: "",
      theme: "",
      links: {},
      name: "",
      name: "",
      isAdmin: false,
    };
  },
  methods: {
    addQuestion,
    editQuestion,
    deleteQuestion,
    searchQuestion,
    banUser,
    unbanUser,
    searchUser,
    makeAdmin,
    undoAdmin,
  },
};
</script>

<style></style>
