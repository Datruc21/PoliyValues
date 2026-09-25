<template>
  <h2>Test yourself and discover new political ideas</h2>
  <button>Start now</button>
  <input placeholder="Search for a concept" type="text" />
  <p>Number of concepts available : {{ conceptNumber }}</p>
</template>

<script>
export default {
  data() {
    conceptNumber: "foo";
  },
};
</script>
