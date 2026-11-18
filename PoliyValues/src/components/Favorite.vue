<template>
  <div id="favorites-page">
    <!-- Header -->
    <div class="page-header">
      <h1>My Library</h1>
      <p>Your personal political knowledge collection.</p>
    </div>

    <!-- Loading / Error -->
    <p v-if="isLoading" class="status-message">Loading...</p>
    <p v-else-if="errorMessage" class="status-message">
      {{ errorMessage }}
    </p>

    <template v-else>
      <!-- Statistics -->
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

      <!-- Review button -->
      <button v-if="favorites.length > 0" class="review-all-btn" @click="startReview">
        <span>↻</span> Review unlearned concepts
      </button>

      <!-- Search -->
      <div class="toolbar" v-if="favorites.length > 0">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search a question or concept..."
          class="search-input"
        />

        <!-- Theme filter -->
        <select v-model="selectedTheme" class="theme-filter">
          <option value="">All themes</option>
          <option v-for="theme in themes" :key="theme" :value="theme">
            {{ theme }}
          </option>
        </select>

        <!-- Review filter -->
        <label class="review-filter">
          <input type="checkbox" v-model="showOnlyUnreviewed" />
          Not reviewed only
        </label>
      </div>

      <!-- Empty favorites -->
      <p v-if="favorites.length === 0" class="status-message">
        You have no favorites yet. Click on ☆ during a quiz to add one.
      </p>

      <!-- No search results -->
      <p v-else-if="filteredFavorites.length === 0" class="status-message">
        No favorites match your search.
      </p>

      <!-- Favorites list -->
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

          <!-- Question -->
          <p class="question">
            {{ fav.question_text }}
          </p>

          <!-- Concept -->
          <p class="concept-label">
            {{ fav.ideology || fav.theme }}
          </p>

          <!-- User opinion -->
          <div v-if="fav.is_completed" class="opinion-info">
            Your opinion:
            <strong>{{ getOpinionLabel(fav.opinion_value) }}</strong>
          </div>

          <!-- Status -->
          <div class="status-badges">
            <span class="status-badge" :class="fav.is_completed ? 'answered' : 'not-answered'">
              {{ fav.is_completed ? "Answered" : "Not answered" }}
            </span>

            <span class="status-badge" :class="fav.is_reviewed ? 'reviewed' : 'not-reviewed'">
              {{ fav.is_reviewed ? "✓ Reviewed" : "Not reviewed" }}
            </span>
          </div>

          <!-- Details button -->
          <button class="toggle-btn" @click="toggleDetails(fav.id)">
            {{ openId === fav.id ? "Hide details" : "Explore concept" }}
          </button>

          <!-- Explanation -->
          <div v-if="openId === fav.id" class="details">
            <h3>Understanding the concept</h3>

            <p>{{ fav.explanation_concept }}</p>

            <!-- Links -->
            <div v-if="fav.links && fav.links.length">
              <h3>Learn more</h3>

              <ul class="links">
                <li v-for="(link, i) in fav.links" :key="i">
                  <a :href="link.url" target="_blank" rel="noopener noreferrer">
                    {{ link.title }}
                  </a>
                </li>
              </ul>
            </div>

            <!-- Review action -->
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

<script setup>
import { ref, computed, onMounted } from "vue";

const favorites = ref([]);
const isLoading = ref(true);
const errorMessage = ref("");
const openId = ref(null);

const searchQuery = ref("");
const selectedTheme = ref("");
const showOnlyUnreviewed = ref(false);

// Fetch favorites
const fetchFavorites = async () => {
  const token = localStorage.getItem("poliyvalues_token");

  try {
    const response = await fetch("http://localhost:3000/api/questions/favorites", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      favorites.value = await response.json();
    } else {
      errorMessage.value = "Impossible to load your favorites.";
    }
  } catch (error) {
    errorMessage.value = "Impossible to connect to the network.";
  } finally {
    isLoading.value = false;
  }
};

// Statistics
const answeredCount = computed(() => favorites.value.filter((f) => f.is_completed).length);

const reviewedCount = computed(() => favorites.value.filter((f) => f.is_reviewed).length);

// Available themes
const themes = computed(() => [...new Set(favorites.value.map((f) => f.theme))].sort());

// Search and filters
const filteredFavorites = computed(() => {
  return favorites.value.filter((fav) => {
    const query = searchQuery.value.toLowerCase();

    const matchesSearch =
      fav.question_text.toLowerCase().includes(query) ||
      fav.explanation_concept.toLowerCase().includes(query) ||
      (fav.ideology || "").toLowerCase().includes(query);

    const matchesTheme = !selectedTheme.value || fav.theme === selectedTheme.value;

    const matchesReview = !showOnlyUnreviewed.value || !fav.is_reviewed;

    return matchesSearch && matchesTheme && matchesReview;
  });
});

// Toggle explanation
const toggleDetails = (id) => {
  openId.value = openId.value === id ? null : id;
};

// Remove favorite
const removeFavorite = async (id) => {
  const token = localStorage.getItem("poliyvalues_token");

  try {
    const response = await fetch("http://localhost:3000/api/questions/favorite", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ questId: id }),
    });

    if (response.ok) {
      favorites.value = favorites.value.filter((f) => f.id !== id);

      if (openId.value === id) {
        openId.value = null;
      }
    }
  } catch (error) {
    console.error("Error removing favorite:", error);
  }
};

// Update review status
const updateReview = async (fav) => {
  const token = localStorage.getItem("poliyvalues_token");
  const newStatus = !fav.is_reviewed;

  try {
    const response = await fetch("http://localhost:3000/api/questions/review", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        questionId: fav.id,
        isReviewed: newStatus,
      }),
    });

    if (response.ok) {
      fav.is_reviewed = newStatus;
    }
  } catch (error) {
    console.error("Error updating review:", error);
  }
};

// Start review session
const startReview = () => {
  showOnlyUnreviewed.value = true;

  if (filteredFavorites.value.length > 0) {
    openId.value = filteredFavorites.value[0].id;
  }
};

// Opinion label
const getOpinionLabel = (value) => {
  const labels = {
    "-2": "Strongly disagree",
    "-1": "Disagree",
    0: "Neutral",
    1: "Agree",
    2: "Strongly agree",
  };

  return labels[value] || "Unknown";
};

onMounted(fetchFavorites);
</script>

<style scoped>
#favorites-page {
  max-width: 750px;
  margin: 3rem auto;
  padding: 0 1rem;
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.page-header h1 {
  margin-bottom: 0.5rem;
}

.page-header p {
  color: var(--text-secondary, #888);
}

.status-message {
  text-align: center;
  color: #6c757d;
  margin: 2rem 0;
}

/* Statistics */

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  background: var(--bg-card);
  padding: 1.2rem;
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
  color: var(--text-main);
}

.stat-label {
  font-size: 0.85rem;
  color: var(--text-secondary, #888);
}

/* Review button */

.review-all-btn {
  width: 100%;
  padding: 0.9rem;
  margin-bottom: 1.5rem;
  border: none;
  border-radius: 10px;
  background: #4361ee;
  color: white;
  font-weight: 600;
  cursor: pointer;
}

/* Toolbar */

.toolbar {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin-bottom: 1.5rem;
}

.search-input,
.theme-filter {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ced4da;
  border-radius: 8px;
  background: var(--bg-card);
  color: var(--text-main);
}

.review-filter {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--text-main);
}

/* Favorites */

.favorites-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.favorite-card {
  background: var(--bg-card);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.theme-badge {
  background: rgba(67, 97, 238, 0.12);
  color: #4361ee;
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
}

.question {
  color: var(--text-main);
  font-weight: 600;
  line-height: 1.5;
}

.concept-label {
  color: var(--text-secondary, #888);
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

/* Details */

.toggle-btn {
  background: none;
  border: 1px solid #ced4da;
  border-radius: 8px;
  padding: 0.6rem 1rem;
  color: #4361ee;
  cursor: pointer;
}

.details {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px dashed #e0e0e0;
  color: var(--text-main);
  line-height: 1.6;
}

.details h3 {
  font-size: 1rem;
}

.links {
  padding-left: 1.2rem;
}

.links a {
  color: #4361ee;
}

/* Review */

.review-btn {
  margin-top: 1rem;
  padding: 0.7rem 1rem;
  width: 100%;
  border: none;
  border-radius: 8px;
  background: #16a34a;
  color: white;
  cursor: pointer;
  font-weight: 600;
}

.review-btn.already-reviewed {
  background: #64748b;
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
}
</style>
