<template>
  <div>
    <!-- Show a message when the question is being fetched -->
    <div v-if="isLoading" class="status-message">
      <p>Chargement de la question...</p>
    </div>

    <!-- Show an error message if there is an issue -->
    <div v-else-if="errorMessage" class="status-message error">
      <p>{{ errorMessage }}</p>
    </div>

    <!-- If the question is fetched and there is no error, display the question -->
    <div v-else-if="currentQuestion" id="container">
      <button @click="toggleFavoriteStatus" id="favorite">★</button>
      <h1>{{ currentQuestion.theme }}</h1>
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
    </div>

    <!-- Explanation of the stakes of the question -->
    <div v-if="showExplanation && currentQuestion" class="hidden">
      <p>{{ currentQuestion.explanation_concept }}</p>
      <button @click="goToNextQuestion">Next Question =></button>
    </div>
  </div>
</template>

<style scoped>
/* --- Main Card Container --- */
#container {
  max-width: 650px;
  margin: 3rem auto;
  padding: 2.5rem;
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  position: relative;
}

h1 {
  text-align: center;
  width: auto;
  margin: 3vw;
  padding: 0;
  border-bottom: 2px solid #f1f3f5;
  border-radius: 15px;
}
#container button:first-child {
  position: absolute;
  top: 0;
  right: 0;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #000;
  margin: 0;
  padding: 0;
}

#favorite {
  position: absolute;
  top: 0;
  right: 0;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #ffca28;
  margin: 0;
  padding: 0;
}

.Opinion_button {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.Opinion_button button {
  flex: 1;
  padding: 0.75rem 0.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #f8f9fa;
  color: #495057;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

/* Give a particular color to each opinion button */

.Opinion_button button:nth-child(1):hover {
  background-color: #ffe3e3;
  color: #dc3545;
  border-color: #dc3545;
}
.Opinion_button button:nth-child(2):hover {
  background-color: #fff0f6;
  color: #e64980;
  border-color: #e64980;
}
.Opinion_button button:nth-child(3):hover {
  background-color: #f1f3f5;
  color: #6c757d;
  border-color: #6c757d;
}
.Opinion_button button:nth-child(4):hover {
  background-color: #ebfbee;
  color: #40c057;
  border-color: #40c057;
}
.Opinion_button button:nth-child(5):hover {
  background-color: #e6fcf5;
  color: #0ca678;
  border-color: #0ca678;
}

/*Keep the color if the the button is selected */
.Opinion_button button.active-disagree {
  background-color: #ffe3e3;
  color: #dc3545;
  border-color: #dc3545;
  box-shadow: inset 0 0 0 1px #dc3545;
}
.Opinion_button button.active-p-disagree {
  background-color: #fff0f6;
  color: #e64980;
  border-color: #e64980;
  box-shadow: inset 0 0 0 1px #e64980;
}
.Opinion_button button.active-neutral {
  background-color: #f1f3f5;
  color: #6c757d;
  border-color: #6c757d;
  box-shadow: inset 0 0 0 1px #6c757d;
}
.Opinion_button button.active-p-agree {
  background-color: #ebfbee;
  color: #40c057;
  border-color: #40c057;
  box-shadow: inset 0 0 0 1px #40c057;
}
.Opinion_button button.active-agree {
  background-color: #e6fcf5;
  color: #0ca678;
  border-color: #0ca678;
  box-shadow: inset 0 0 0 1px #0ca678;
}

#Submit_button {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
  margin-top: 1.5rem;
}

#Submit_button button {
  padding: 0.85rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
}

#Submit_button button:first-child {
  background-color: #4361ee;
  color: white;
  border: none;
  box-shadow: 0 4px 12px rgba(67, 97, 238, 0.2);
}

#Submit_button button:first-child:hover {
  background-color: #3046c8;
  transform: translateY(-1px);
}

#Submit_button button:disabled {
  background-color: #a5b4fc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

#Submit_button button:last-child {
  background: none;
  border: 1px solid #ced4da;
  color: #6c757d;
}

#Submit_button button:last-child:hover {
  background-color: #f1f3f5;
  color: #343a40;
}

.hidden {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px dashed #e0e0e0;
  color: #666666;
  font-size: 0.9rem;
  line-height: 1.5;
}
</style>

<script setup>
import { ref, onMounted } from "vue";

const currentQuestion = ref(null); //The data about the question
const selectedOpinion = ref(null); //The opinion selected by the user
const showExplanation = ref(false); //Boolean to show or not the hidden explanation
const isLoading = ref(true); //Boolean depending of if the question has been fetched yet or not
const errorMessage = ref(""); //Error to display to the user when there is an issue
const isFavorite = ref(false); //Boolean allowing to toggle between making the question favorite or not

const selectOpinion = (value) => {
  selectedOpinion.value = value;
};

//Fetch a random question using the function in the controller
//If there is an issue, display error.
const fetchRandomQuestion = async () => {
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
    } else if (response.status === 404) {
      errorMessage.value = "Vous avez répondu à toutes les questions disponibles !";
      currentQuestion.value = null;
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
