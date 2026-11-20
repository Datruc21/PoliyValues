<template>
  <div id="favorites-page">
    <div class="page-header">
      <h1>My Library</h1>
      <p>Your personal political knowledge collection.</p>
    </div>

    <p v-if="isLoading" class="status-message">Loading...</p>

    <p v-else-if="errorMessage" class="status-message error-message">
      {{ errorMessage }}
    </p>

    <template v-else>
      <div class="stats-grid">
        <div class="stat-card">
          <span class="stat-number">{{ favorites.length }}</span>
          <span class="stat-label">Favorites</span>
        </div>

        <div class="stat-card">
          <span class="stat-number">{{ answeredCount }}</span>
          <span class="stat-label">Answered</span>
        </div>

        <div class="stat-card">
          <span class="stat-number">{{ reviewedCount }}</span>
          <span class="stat-label">Reviewed</span>
        </div>
      </div>

      <button v-if="favorites.length > 0" class="review-all-btn" @click="startReview">
        ↻ Review unlearned concepts
      </button>

      <div v-if="favorites.length > 0" class="toolbar">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search a question or concept..."
          class="search-input"
        />

        <select v-model="selectedTheme" class="theme-filter">
          <option value="">All themes</option>
          <option v-for="theme in themes" :key="theme" :value="theme">
            {{ theme }}
          </option>
        </select>

        <label class="review-filter">
          <input type="checkbox" v-model="showOnlyUnreviewed" />
          Not reviewed only
        </label>
      </div>

      <p v-if="favorites.length === 0" class="status-message">
        You have no favorites yet. Click on ☆ during a quiz to add one.
      </p>

      <p v-else-if="filteredFavorites.length === 0" class="status-message">
        No favorites match your search.
      </p>

      <ul v-else class="favorites-list">
        <li v-for="fav in filteredFavorites" :key="fav.id" class="favorite-card">
          <div class="card-header">
            <span class="theme-badge">
              {{ fav.theme }}
            </span>

            <button
              class="remove-btn"
              title="Remove from favorites"
              @click="removeFavorite(fav.id)"
            >
              ★
            </button>
          </div>

          <p class="question">
            {{ fav.question_text }}
          </p>

          <p class="concept-label">
            {{ fav.ideology || fav.theme }}
          </p>

          <div v-if="fav.is_completed" class="opinion-info">
            Your opinion:
            <strong>{{ getOpinionLabel(fav.opinion_value) }}</strong>
          </div>

          <div class="status-badges">
            <span class="status-badge" :class="fav.is_completed ? 'answered' : 'not-answered'">
              {{ fav.is_completed ? "Answered" : "Not answered" }}
            </span>

            <span class="status-badge" :class="fav.is_reviewed ? 'reviewed' : 'not-reviewed'">
              {{ fav.is_reviewed ? "✓ Reviewed" : "Not reviewed" }}
            </span>
          </div>

          <button class="toggle-btn" @click="toggleDetails(fav.id)">
            {{ openId === fav.id ? "Hide details" : "Explore concept" }}
          </button>

          <div v-if="openId === fav.id" class="details">
            <h3>Understanding the concept</h3>

            <p>{{ fav.explanation_concept }}</p>

            <div v-if="fav.links && fav.links.length">
              <h3>Learn more</h3>

              <ul class="links">
                <li v-for="(link, index) in fav.links" :key="index">
                  <a :href="link.url" target="_blank" rel="noopener noreferrer">
                    {{ link.title }}
                  </a>
                </li>
              </ul>
            </div>

            <button
              class="review-btn"
              :class="{ 'already-reviewed': fav.is_reviewed }"
              @click="updateReview(fav)"
            >
              {{ fav.is_reviewed ? "✓ Mark as not reviewed" : "✓ Mark as understood" }}
            </button>
          </div>
        </li>
      </ul>
    </template>
  </div>
</template>

<script>
export default {
  name: "FavoritesPage",

  data() {
    return {
      favorites: [],
      isLoading: true,
      errorMessage: "",
      openId: null,
      searchQuery: "",
      selectedTheme: "",
      showOnlyUnreviewed: false,
    };
  },

  computed: {
    answeredCount() {
      return this.favorites.filter((fav) => fav.is_completed).length;
    },

    reviewedCount() {
      return this.favorites.filter((fav) => fav.is_reviewed).length;
    },

    themes() {
      return [...new Set(this.favorites.map((fav) => fav.theme))].sort();
    },

    filteredFavorites() {
      return this.favorites.filter((fav) => {
        const query = this.searchQuery.toLowerCase();

        const question = (fav.question_text || "").toLowerCase();
        const explanation = (fav.explanation_concept || "").toLowerCase();
        const ideology = (fav.ideology || "").toLowerCase();

        const matchesSearch =
          question.includes(query) || explanation.includes(query) || ideology.includes(query);

        const matchesTheme = !this.selectedTheme || fav.theme === this.selectedTheme;

        const matchesReview = !this.showOnlyUnreviewed || !fav.is_reviewed;

        return matchesSearch && matchesTheme && matchesReview;
      });
    },
  },

  methods: {
    getToken() {
      return localStorage.getItem("poliyvalues_token");
    },

    async fetchFavorites() {
      this.isLoading = true;
      this.errorMessage = "";

      try {
        const response = await fetch("http://localhost:3000/api/questions/favorites", {
          headers: {
            Authorization: `Bearer ${this.getToken()}`,
          },
        });

        if (!response.ok) {
          throw new Error("Impossible to load your favorites.");
        }

        this.favorites = await response.json();
      } catch (error) {
        this.errorMessage =
          error.message === "Failed to fetch"
            ? "Impossible to connect to the network."
            : error.message;
      } finally {
        this.isLoading = false;
      }
    },

    toggleDetails(id) {
      this.openId = this.openId === id ? null : id;
    },

    async removeFavorite(id) {
      try {
        const response = await fetch("http://localhost:3000/api/questions/favorite", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.getToken()}`,
          },
          body: JSON.stringify({
            questId: id,
          }),
        });

        if (!response.ok) {
          throw new Error("Unable to remove favorite.");
        }

        this.favorites = this.favorites.filter((fav) => fav.id !== id);

        if (this.openId === id) {
          this.openId = null;
        }
      } catch (error) {
        console.error("Error removing favorite:", error);
      }
    },

    async updateReview(fav) {
      const newStatus = !fav.is_reviewed;

      try {
        const response = await fetch("http://localhost:3000/api/questions/review", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.getToken()}`,
          },
          body: JSON.stringify({
            questionId: fav.id,
            isReviewed: newStatus,
          }),
        });

        if (!response.ok) {
          throw new Error("Unable to update review status.");
        }

        fav.is_reviewed = newStatus;
      } catch (error) {
        console.error("Error updating review:", error);
      }
    },

    startReview() {
      this.showOnlyUnreviewed = true;

      if (this.filteredFavorites.length > 0) {
        this.openId = this.filteredFavorites[0].id;
      }
    },

    getOpinionLabel(value) {
      const labels = {
        "-2": "Strongly disagree",
        "-1": "Disagree",
        0: "Neutral",
        1: "Agree",
        2: "Strongly agree",
      };

      return labels[value] || "Unknown";
    },
  },

  mounted() {
    this.fetchFavorites();
  },
};
</script>

<style scoped>
#favorites-page {
  max-width: 750px;
  margin: 3rem auto;
  padding: 0 1rem;
  color: var(--text-main);
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.page-header h1 {
  margin-bottom: 0.5rem;
  color: var(--text-main);
}

.page-header p {
  color: var(--text-muted);
}

.status-message {
  text-align: center;
  color: var(--text-muted);
  margin: 2rem 0;
}

.error-message {
  color: var(--danger-color);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  background: var(--bg-card);
  color: var(--text-main);
  padding: 1.2rem;
  border: 1px solid var(--border-color);
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
}

.stat-number {
  font-size: 1.8rem;
  font-weight: bold;
  color: var(--primary-color);
}

.stat-label {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.review-all-btn {
  width: 100%;
  padding: 0.9rem;
  margin-bottom: 1.5rem;
  border: none;
  border-radius: 10px;
  background: var(--primary-color);
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;
}

.review-all-btn:hover {
  background: var(--primary-hover);
}

.toolbar {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin-bottom: 1.5rem;
}

.search-input,
.theme-filter {
  width: 100%;
  box-sizing: border-box;
  padding: 0.8rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--input-bg);
  color: var(--text-main);
}

.search-input:focus,
.theme-filter:focus {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

.review-filter {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--text-main);
}

.favorites-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.favorite-card {
  background: var(--bg-card);
  color: var(--text-main);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  transition:
    background 0.3s ease,
    color 0.3s ease;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.theme-badge {
  background: var(--primary-color);
  color: white;
  padding: 0.35rem 0.7rem;
  border-radius: 20px;
  font-size: 0.8rem;
}

.remove-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--danger-color);
  cursor: pointer;
  transition: color 0.3s ease;
}

.remove-btn:hover {
  color: var(--danger-hover);
}

.question {
  color: var(--text-main);
  font-weight: 600;
  line-height: 1.5;
}

.concept-label {
  color: var(--text-muted);
  font-size: 0.85rem;
}

.opinion-info {
  font-size: 0.85rem;
  margin: 0.8rem 0;
  color: var(--text-main);
}

.status-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 1rem 0;
}

.status-badge {
  font-size: 0.75rem;
  padding: 0.35rem 0.65rem;
  border-radius: 20px;
}

.answered,
.reviewed {
  background: #dcfce7;
  color: #166534;
}

.not-answered,
.not-reviewed {
  background: #fef3c7;
  color: #92400e;
}

.toggle-btn {
  background: var(--input-bg);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 0.6rem 1rem;
  color: var(--primary-color);
  cursor: pointer;
}

.toggle-btn:hover {
  border-color: var(--primary-color);
}

.details {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px dashed var(--border-color);
  color: var(--text-main);
  line-height: 1.6;
}

.details h3 {
  font-size: 1rem;
  color: var(--primary-color);
}

.links {
  padding-left: 1.2rem;
}

.links a {
  color: var(--primary-color);
}

.links a:hover {
  color: var(--primary-hover);
}

.review-btn {
  margin-top: 1rem;
  padding: 0.7rem 1rem;
  width: 100%;
  border: none;
  border-radius: 8px;
  background: var(--primary-color);
  color: white;
  cursor: pointer;
  font-weight: 600;
}

.review-btn:hover {
  background: var(--primary-hover);
}

.review-btn.already-reviewed {
  background: var(--text-muted);
}

@media (max-width: 450px) {
  .stats-grid {
    gap: 0.5rem;
  }

  .stat-card {
    padding: 0.8rem 0.4rem;
  }

  .stat-number {
    font-size: 1.4rem;
  }

  .stat-label {
    font-size: 0.75rem;
  }

  .favorite-card {
    padding: 1rem;
  }
}
</style>
