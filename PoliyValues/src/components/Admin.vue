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
      selectedQuestionId: null,
      question_text: "",
      explanation_concept: "",
      theme: "",
      links: "",
      name: "",
      selectedUserId: null,
      isAdmin: false,
      questionResults: [],
      userResults: [],
    };
  },
  methods: {
    // 1. Add a question
    async addQuestion() {
      try {
        let formattedLinks = this.links
          ? this.links.split(",").map((link) => link.trim())
          : null;

        const response = await fetch("/api/admin/questions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question_text: this.question_text,
            explanation_concept: this.explanation_concept,
            theme: this.theme,
            links: formattedLinks,
          }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Server error");

        alert("✅ " + data.message);
        this.resetQuestionForm();
      } catch (error) {
        console.error("Error addQuestion:", error);
        alert("❌ " + error.message);
      }
    },

    // 2. Edit a question
    async editQuestion() {
      if (!this.selectedQuestionId) {
        alert("Please select or specify the ID of a question to edit.");
        return;
      }
      try {
        let formattedLinks = this.links
          ? this.links.split(",").map((link) => link.trim())
          : null;

        const response = await fetch(
          `/api/admin/questions/${this.selectedQuestionId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              question_text: this.question_text,
              explanation_concept: this.explanation_concept,
              theme: this.theme,
              links: formattedLinks,
            }),
          },
        );

        const data = await response.json();
        if (!response.ok) throw new Error(data.error);

        alert("✅ " + data.message);
      } catch (error) {
        console.error("Error editQuestion:", error);
        alert("❌ " + error.message);
      }
    },

    // 3. Search a question
    async searchQuestion() {
      try {
        const response = await fetch(
          `/api/admin/questions/search?q=${encodeURIComponent(this.name)}`,
        );
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);

        this.questionResults = data;
        alert(`🔍 ${this.questionResults.length} question(s) found.`);
      } catch (error) {
        console.error("Error searchQuestion:", error);
        alert("❌ Error while searching for questions.");
      }
    },

    // 4. Delete a question
    async deleteQuestion() {
      if (!this.selectedQuestionId) {
        alert("Please specify the ID of the question to delete.");
        return;
      }
      if (!confirm("Are you sure you want to delete this question?")) return;

      try {
        const response = await fetch(
          `/api/admin/questions/${this.selectedQuestionId}`,
          {
            method: "DELETE",
          },
        );
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);

        alert("✅ " + data.message);
        this.selectedQuestionId = null;
      } catch (error) {
        console.error("Error deleteQuestion:", error);
        alert("❌ Error during deletion.");
      }
    },

    // 5. Search a user
    async searchUser() {
      try {
        const response = await fetch(
          `/api/admin/users/search?q=${encodeURIComponent(this.name)}`,
        );
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);

        this.userResults = data;
        alert(`🔍 ${this.userResults.length} user(s) found.`);
      } catch (error) {
        console.error("Error searchUser:", error);
        alert("❌ Error while searching for users.");
      }
    },

    // 6. Ban a user
    async banUser() {
      if (!this.selectedUserId) {
        alert("Please select a user ID.");
        return;
      }
      try {
        const response = await fetch(
          `/api/admin/users/${this.selectedUserId}/ban`,
          {
            method: "POST",
          },
        );
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);

        alert("✅ " + data.message);
      } catch (error) {
        console.error("Error banUser:", error);
        alert("❌ Error while banning the user.");
      }
    },

    // 7. Unban a user
    async unbanUser() {
      if (!this.selectedUserId) {
        alert("Please select a user ID.");
        return;
      }
      try {
        const response = await fetch(
          `/api/admin/users/${this.selectedUserId}/unban`,
          {
            method: "POST",
          },
        );
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);

        alert("✅ " + data.message);
      } catch (error) {
        console.error("Error unbanUser:", error);
        alert("❌ Error while unbanning the user.");
      }
    },

    // 8. Make a user Admin
    async makeAdmin() {
      if (!this.selectedUserId) {
        alert("Please select a user ID.");
        return;
      }
      try {
        const response = await fetch(
          `/api/admin/users/${this.selectedUserId}/make-admin`,
          {
            method: "PATCH",
          },
        );
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);

        alert("✅ " + data.message);
      } catch (error) {
        console.error("Error makeAdmin:", error);
        alert("❌ Error while granting admin rights.");
      }
    },

    // 9. Remove Admin rights
    async undoAdmin() {
      if (!this.selectedUserId) {
        alert("Please select a user ID.");
        return;
      }
      try {
        const response = await fetch(
          `/api/admin/users/${this.selectedUserId}/undo-admin`,
          {
            method: "PATCH",
          },
        );
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);

        alert("✅ " + data.message);
      } catch (error) {
        console.error("Error undoAdmin:", error);
        alert("❌ Error while revoking admin rights.");
      }
    },

    resetQuestionForm() {
      this.question_text = "";
      this.explanation_concept = "";
      this.theme = "";
      this.links = "";
      this.selectedQuestionId = null;
    },
  },
};
</script>

<style></style>
