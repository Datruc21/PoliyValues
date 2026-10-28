<template>
  <div id="stats-page">
    <h1>My stats</h1>

    <p v-if="isLoading" class="status">Loading...</p>
    <p v-else-if="answers.length === 0" class="status">
      No answers yet. Go to the quiz and give your opinion on a few ideas!
    </p>

    <div v-else class="columns">
      <section v-for="col in columns" :key="col.value" class="column">
        <h2 :style="{ color: col.color, borderColor: col.color }">
          {{ col.label }} ({{ itemsFor(col.value).length }})
        </h2>

        <p v-if="itemsFor(col.value).length === 0" class="empty">Nothing here</p>

        <div v-for="a in itemsFor(col.value)" :key="a.id" class="item">
          <strong>{{ a.ideology || a.theme }}</strong>
          <small v-if="a.ideology">{{ a.theme }}</small>
          <a v-if="firstLink(a)" :href="firstLink(a)" target="_blank" rel="noopener">Learn more</a>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const answers = ref([]);
const isLoading = ref(true);

const columns = [
  { value: -2, label: "Completely disagree", color: "#dc3545" },
  { value: -1, label: "Partially disagree", color: "#e64980" },
  { value: 0, label: "Neutral", color: "#6c757d" },
  { value: 1, label: "Partially agree", color: "#40c057" },
  { value: 2, label: "Completely agree", color: "#0ca678" },
];

const itemsFor = (value) => answers.value.filter((a) => a.opinion_value === value);
const firstLink = (a) => (a.links && a.links.length ? a.links[0].url : null);

onMounted(async () => {
  const token = localStorage.getItem("poliyvalues_token");
  try {
    const response = await fetch("http://localhost:3000/api/questions/stats", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.ok) answers.value = await response.json();
  } catch (error) {
    console.error("Network error:", error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
#stats-page { max-width: 1100px; margin: 3rem auto; padding: 0 1rem; }
h1 { text-align: center; margin-bottom: 2rem; }
.status { text-align: center; color: #6c757d; }
.columns { display: grid; grid-template-columns: repeat(5, 1fr); gap: 1rem; align-items: start; }
.column h2 { font-size: 0.95rem; text-align: center; padding-bottom: 0.5rem; border-bottom: 2px solid; margin: 0 0 0.75rem; }
.item { background: #fff; border-radius: 12px; padding: 0.75rem; margin-bottom: 0.75rem; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); display: flex; flex-direction: column; gap: 0.25rem; }
.item small { color: #6c757d; }
.item a { color: #4361ee; font-size: 0.85rem; }
.empty { text-align: center; color: #adb5bd; font-size: 0.85rem; }
@media (max-width: 800px) {
  .columns { grid-template-columns: 1fr; }
}
</style>