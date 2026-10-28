<template>
  <div>
    <!-- Show a message when the question is being fetched -->
    <div v-if="isLoading" class="status-message">
      <p>Chargement de la question...</p>
    </div>

    <!-- Show an error message if there is an issue -->
    <div v-else-if="errorMessage" class="status-message error">
      <p>{{ errorMessage }}</p>
      <button v-if="allDone" @click="resetAllQuestions" class="reset-button">Start over</button>
    </div>

    <!-- If the question is fetched and there is no error, display the question -->
    <div v-else-if="currentQuestion" id="container">
      <button @click="toggleFavoriteStatus" id="favorite">{{ isFavorite ? "★" : "☆" }}</button>      <h1>{{ currentQuestion.theme }}</h1>
      <h2>{{ currentQuestion.question_text }}</h2>

      <!-- Button to select the opinion -->
      <div class="Opinion_button">
        <button @click="selectOpinion(-2)" :class="{ 'active-disagree': selectedOpinion === -2 }">
          Completely Disagree
        </button>
        <button @click="selectOpinion(-1)" :class="{ 'active-p-disagree': selectedOpinion === -1 }">
          Partially Disagree
        </button>
        <button @click="selectOpinion(0)" :class="{ 'active-neutral': selectedOpinion === 0 }">
          Neutral
        </button>
        <button @click="selectOpinion(1)" :class="{ 'active-p-agree': selectedOpinion === 1 }">
          Partially Agree
        </button>
        <button @click="selectOpinion(2)" :class="{ 'active-agree': selectedOpinion === 2 }">
          Completly Agree
        </button>
      </div>

      <!-- Submit or don't answer -->
      <div id="Submit_button">
        <button @click="sendAnswerToDatabase" :disabled="selectedOpinion === null">Submit</button>
        <button @click="handleIdontKnow">I don't know</button>
      </div>


      <!-- Explanation of the stakes of the question -->
      <div v-if="showExplanation && currentQuestion" class="hidden">
        <p>{{ currentQuestion.explanation_concept }}</p>
        <ul v-if="currentQuestion.links && currentQuestion.links.length">
          <li v-for="(link, i) in currentQuestion.links" :key="i">
            <a :href="link.url" target="_blank" rel="noopener">{{ link.title }}</a>
          </li>
        </ul>
        <button @click="goToNextQuestion">Next Question =></button>
      </div>
    </div>
  </div>
</template>

<style scoped>
#container {
  max-width: 650px; margin: 3rem auto; padding: 2.5rem;
  background-color: var(--bg-card); color: var(--text-main);
  border-radius: 16px; border: 1px solid var(--border-color); position: relative;
}
h1 { text-align: center; margin: 3vw; padding: 0; border-bottom: 2px solid var(--border-color); }
#favorite {
  position: absolute; top: 0; right: 0; background: none; border: none;
  font-size: 1.5rem; cursor: pointer; color: #ffca28;
}
.Opinion_button { display: flex; gap: 0.5rem; margin-bottom: 2rem; }
.Opinion_button button {
  flex: 1; padding: 0.75rem 0.5rem;
  background-color: var(--input-bg); color: var(--text-main);
  border: 1px solid var(--border-color); border-radius: 8px; cursor: pointer;
}
/* Les couleurs spécifiques des boutons d'opinion sont conservées pour leur fonction visuelle */
.Opinion_button button:nth-child(1):hover, .Opinion_button button.active-disagree { background-color: #ffe3e3; color: #dc3545; border-color: #dc3545; }
.Opinion_button button:nth-child(2):hover, .Opinion_button button.active-p-disagree { background-color: #fff0f6; color: #e64980; border-color: #e64980; }
.Opinion_button button:nth-child(3):hover, .Opinion_button button.active-neutral { background-color: #f1f3f5; color: #6c757d; border-color: #6c757d; }
.Opinion_button button:nth-child(4):hover, .Opinion_button button.active-p-agree { background-color: #ebfbee; color: #40c057; border-color: #40c057; }
.Opinion_button button:nth-child(5):hover, .Opinion_button button.active-agree { background-color: #e6fcf5; color: #0ca678; border-color: #0ca678; }

#Submit_button { display: flex; flex-direction: column; gap: 0.75rem; margin-top: 1.5rem; }
#Submit_button button { padding: 0.85rem; font-weight: 600; border-radius: 10px; cursor: pointer; }
#Submit_button button:first-child { background-color: var(--primary-color); color: white; border: none; }
#Submit_button button:disabled { background-color: var(--text-muted); cursor: not-allowed; }
#Submit_button button:last-child { background: none; border: 1px solid var(--border-color); color: var(--text-muted); }
.hidden { margin-top: 2rem; padding-top: 1.5rem; border-top: 1px dashed var(--border-color); color: var(--text-main); }
.hidden button {
  display: block; margin: 1.5rem auto 0; padding: 0.85rem 2rem;
  background-color: var(--primary-color); color: white;
  border: 2px solid var(--primary-color); border-radius: 8px; cursor: pointer;
}
.hidden button:hover { background-color: var(--primary-hover); transform: translateY(-2px); }

.reset-button {
  margin-top: 1rem;
  padding: 0.85rem 1.5rem;
  border: none;
  border-radius: 10px;
  background-color: #4361ee;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.reset-button:hover {
  background-color: #3046c8;
}



@media (max-width: 600px) {
    
  #container {
    padding: 1rem;
    margin: 1rem;
  }
  
  .Opinion_button {
    flex-direction: column;
  }

}

</style>

<script setup>
import { ref, computed, onMounted } from "vue";

const currentQuestion = ref(null); //The data about the question
const selectedOpinion = ref(null); //The opinion selected by the user
const showExplanation = ref(false); //Boolean to show or not the hidden explanation
const isLoading = ref(true); //Boolean depending of if the question has been fetched yet or not
const errorMessage = ref(""); //Error to display to the user when there is an issue
const isFavorite = ref(false); //Boolean allowing to toggle between making the question favorite or not
const allDone = ref(false);

const selectOpinion = (value) => {
  selectedOpinion.value = value;
};

//Fetch a random question using the function in the controller
//If there is an issue, display error.
const fetchRandomQuestion = async () => {
  allDone.value = false;
  isLoading.value = true;
  errorMessage.value = "";
  const token = localStorage.getItem("poliyvalues_token");
  try {
    const response = await fetch("http://localhost:3000/api/questions/random", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      currentQuestion.value = data;
      isFavorite.value = Boolean(data.is_favorite);
    } else if (response.status === 404) {
      errorMessage.value = "Vous avez répondu à toutes les questions disponibles !";
      currentQuestion.value = null;
      allDone.value = true;
    } else {
      console.error("Erreur serveur lors de la récupération.");
    }
  } catch (error) {
    console.error("Erreur réseau :", error);
    errorMessage.value = "Impossible de se connecter au serveur.";
  } finally {
    isLoading.value = false;
  }
};

// Load a question when we load the page
onMounted(() => {
  fetchRandomQuestion();
});

//Check if there is an answer,
// send the data to the data base with the controller
// If the data is send correctly, show the hidden explanation
// Else, display error
const sendAnswerToDatabase = async () => {
  const token = localStorage.getItem("poliyvalues_token");
  if (!currentQuestion.value || selectedOpinion.value === null) return;

  try {
    const response = await fetch("http://localhost:3000/api/questions/answer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        questionId: currentQuestion.value.id,
        opinionValue: selectedOpinion.value,
      }),
    });

    if (response.ok) {
      console.log("Réponse sauvegardée !");
      showExplanation.value = true;
    } else {
      console.error("Erreur lors de l'enregistrement de la réponse.");
    }
  } catch (error) {
    console.error("Erreur de connexion :", error);
  }
};

const toggleFavoriteStatus = async () => {
  if (!currentQuestion.value) return;
  isFavorite.value = !isFavorite.value;
  const token = localStorage.getItem("poliyvalues_token");
  try {
    const response = await fetch("http://localhost:3000/api/questions/favorite", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        questId: currentQuestion.value.id,
      }),
    });

    if (!response.ok) {
      isFavorite.value = !isFavorite.value;
      console.log("Failed to update the favorite status");
    }
  } catch (error) {
    isFavorite.value = !isFavorite.value;
    console.error("There has been a problem when adding a question to favorite");
  }
};

const resetAllQuestions = async () => {
  if (!confirm("Start over? Your previous answers will be erased (your favorites are kept).")) return;

  const token = localStorage.getItem("poliyvalues_token");
  try {
    const response = await fetch("http://localhost:3000/api/questions/reset", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      fetchRandomQuestion();
    } else {
      errorMessage.value = "Could not reset your answers.";
    }
  } catch (error) {
    errorMessage.value = "Impossible de se connecter au serveur.";
  }
};

//Show the hidden explanation
const handleIdontKnow = () => {
  showExplanation.value = true;
};

//Reset variables and download a new question
const goToNextQuestion = () => {
  showExplanation.value = false;
  selectedOpinion.value = null;
  fetchRandomQuestion();
};
</script>
