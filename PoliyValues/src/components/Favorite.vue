<template>
  <div id="favorites-page">
    <h1>My favorites</h1>

    <p v-if="isLoading" class="status-message">Loading...</p>
    <p v-else-if="errorMessage" class="status-message">{{ errorMessage }}</p>
    <p v-else-if="favorites.length === 0" class="status-message">
      You have no favorites yet. Clik on ☆ during a quizz to add one.
    </p>

    <ul v-else class="favorites-list">
      <li v-for="fav in favorites" :key="fav.id" class="favorite-card">
        <div class="card-header">
          <h2>{{ fav.theme }}</h2>
          <button class="remove-btn" title="Remove form favories" @click="removeFavorite(fav.id)">
            ★
          </button>
        </div>

        <p class="question">{{ fav.question_text }}</p>

        <button class="toggle-btn" @click="toggleDetails(fav.id)">
          {{ openId === fav.id ? "Mask" : "To go deeper" }}
        </button>

        <div v-if="openId === fav.id" class="details">
          <p>{{ fav.explanation_concept }}</p>
          <ul v-if="fav.links && fav.links.length" class="links">
            <li v-for="(link, i) in fav.links" :key="i">
              <a :href="link.url" target="_blank" rel="noopener">{{ link.title }}</a>
            </li>
          </ul>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const favorites = ref([]);
const isLoading = ref(true);
const errorMessage = ref("");
const openId = ref(null);

const fetchFavorites = async () => {
  const token = localStorage.getItem("poliyvalues_token");
  try {
    const response = await fetch("http://localhost:3000/api/questions/favorites", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.ok) {
      favorites.value = await response.json();
    } else {
      errorMessage.value = "Impossible to load your favories.";
    }
  } catch (error) {
    errorMessage.value = "Impossible to connect to the network.";
  } finally {
    isLoading.value = false;
  }
};

const toggleDetails = (id) => {
  openId.value = openId.value === id ? null : id;
};

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
    }
  } catch (error) {
    console.error("Error :", error);
  }
};

onMounted(fetchFavorites);
</script>

<style scoped>
#favorites-page {
  max-width: 650px;
  margin: 3rem auto;
  padding: 0 1rem;
}
h1 {
  text-align: center;
  margin-bottom: 2rem;
}
.status-message {
  text-align: center;
  color: #6c757d;
}
.favorites-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.favorite-card {
  background: #fff;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.card-header h2 {
  margin: 0;
  font-size: 1.2rem;
}
.remove-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #ffca28;
  cursor: pointer;
}
.question {
  color: #495057;
}
.toggle-btn {
  background: none;
  border: 1px solid #ced4da;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  color: #4361ee;
  cursor: pointer;
}
.details {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px dashed #e0e0e0;
  color: #666;
  line-height: 1.5;
}
.links {
  padding-left: 1.2rem;
}
</style>
