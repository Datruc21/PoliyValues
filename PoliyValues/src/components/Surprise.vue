<template>
  <div id="surprise-page">
    <h1>To go deeper</h1>

    <div class="card">
      <p>
        Curious about political ideas you've never heard of? Press the button below
        and we'll open a random Wikipedia page about a political ideology,
        movement or system of government.
      </p>
      <p>
        It could be something familiar or something very niche. Read it, make up
        your own mind, then come back and try again.
      </p>

      <button class="btn" @click="goToRandomIdeology">Surprise me!</button>

      <p class="note">
        The page opens in a new tab. Appearing in this list doesn't mean we
        endorse an ideology.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ideologies } from "../data/ideologies.js";

const goToRandomIdeology = () => {
  const pick = ideologies[Math.floor(Math.random() * ideologies.length)];
  window.open(pick.url, "_blank", "noopener");
};
</script>

<style scoped>
#surprise-page {
  max-width: 650px;
  margin: 3rem auto;
  padding: 0 1rem;
  text-align: center;
}
.card {
  background: #fff;
  border-radius: 16px;
  padding: 2.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  line-height: 1.5;
  color: #495057;
}
.card p {
  margin: 0;
}
.btn {
  margin-top: 0.5rem;
  padding: 0.85rem;
  border: none;
  border-radius: 10px;
  background: #4361ee;
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(67, 97, 238, 0.2);
  transition: all 0.2s ease;
}
.btn:hover {
  background: #3046c8;
  transform: translateY(-1px);
}
.note {
  font-size: 0.85rem;
  color: #6c757d;
}
</style>
