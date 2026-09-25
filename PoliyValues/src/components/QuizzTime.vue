<template>
  <div>
    <p>Question number {{ questionNumber }}</p>
    <img
      src="../assets/heart-svgrepo-com.svg"
      alt="click here to add this concept to your favorites"
    />
    <img :src="imgURL" :alt="imgAlt" />
    <input placeholder="Search for a concept" type="text" />
  </div>
  <div>
    <button>Add 1 question</button>
    <button>Add 5 questions</button>
    <button>Add 10 questions</button>
    <button>Add 20 questions</button>
  </div>
  <div id="progressBar"></div>
</template>

<script>
export default {
  data() {
    questionNumber: "foo";
    imgURL: "nothing here";
    imgAlt: "still nothing";
  },
};
</script>
