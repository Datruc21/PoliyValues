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
              <label>Question ID (for Edit / Delete):</label>
              <input type="text" v-model="selectedQuestionId" />
          </div>

          <div class="form-group">
            <label>Ideology:</label>
            <input type="text" v-model="ideology" placeholder="Enter ideology's name" />
          </div>
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
      ideology: "",
      links: "",
      name: "",
      selectedUserId: null,
      isAdmin: false,
      questionResults: [],
      userResults: [],
    };
  },
  methods: {

    authFetch(path, options = {}) {
      const token = localStorage.getItem("poliyvalues_token");
      return fetch(`http://localhost:3000${path}`, {
        ...options,
        headers: { ...(options.headers || {}), Authorization: `Bearer ${token}` },
      });
    },

    // 1. Add a question
    async addQuestion() {
      try {
        let formattedLinks = this.links
          ? this.links
              .split(",")
              .map((l) => l.trim())
              .filter((l) => l)
              .map((l) => ({ title: l, url: l }))
          : null;

        const response = await this.authFetch("/api/admin/questions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question_text: this.question_text,
            explanation_concept: this.explanation_concept,
            theme: this.theme,
            links: formattedLinks,
            ideology: this.ideology,
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
          ? this.links
              .split(",")
              .map((l) => l.trim())
              .filter((l) => l)
              .map((l) => ({ title: l, url: l }))
          : null;

        const response = await this.authFetch(
          `/api/admin/questions/${this.selectedQuestionId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              question_text: this.question_text,
              explanation_concept: this.explanation_concept,
              theme: this.theme,
              links: formattedLinks,
              ideology: this.ideology,
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
        const response = await this.authFetch(
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
        const response = await this.authFetch(
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
        const response = await this.authFetch(
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
        const response = await this.authFetch(
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
        const response = await this.authFetch(
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
        const response = await this.authFetch(
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
        const response = await this.authFetch(
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
      this.ideology="";
    },
  },
};
</script>

<style scoped>
.admin-dashboard {
  max-width: 800px;
  margin: 2rem auto;
  padding: 1rem;
}
.admin-dashboard h1 {
  text-align: center;
  color: var(--primary-color);
  font-size: 2.2rem;
  text-transform: uppercase;
  border-bottom: 2px solid var(--primary-color);
  padding-bottom: 10px;
  margin-bottom: 20px;
}
.admin-grid { display: flex; flex-direction: column; gap: 2rem; }
.admin-section h2 {
  color: var(--primary-color);
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 5px; margin-bottom: 5px;
}
.form-card, .action-card {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  background-color: var(--bg-card);
}
.form-card h3, .action-card h3, .form-group label { color: var(--text-main); margin-top: 0; }
.form-group { margin-bottom: 1rem; }
.form-group label { display: block; font-weight: bold; margin-bottom: 0.3rem; }
input[type="text"], textarea {
  width: 100%; padding: 0.5rem;
  background-color: var(--input-bg);
  color: var(--text-main);
  border: 1px solid var(--border-color);
  border-radius: 4px; box-sizing: border-box;
}
.search-box { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
.search-box input { flex: 1; }
.button-group { display: flex; gap: 0.5rem; margin-top: 1rem; }
.btn {
  padding: 0.5rem 1rem; border: none; border-radius: 4px;
  cursor: pointer; color: white; font-weight: bold;
}
.btn:hover { opacity: 0.8; }
.btn-primary { background-color: var(--primary-color); }
.btn-secondary { background-color: var(--text-muted); }
.btn-info { background-color: #34495e; }
.btn-danger { background-color: var(--danger-color); }
.btn-success { background-color: #1a7132; }
.btn-warning { background-color: #495057; }
.user-status {
  background-color: var(--bg-body);
  padding: 0.5rem; border-radius: 4px; color: var(--text-main);
}
</style>