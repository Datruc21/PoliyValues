
<template>
    <h1>Welcome to PoliyValues </h1>
    <h2>Test yourself and discover new political concepts</h2>

    <div>
        <RouterLink to="/Quizz">
            <button>Start to Discover right now</button>
        </RouterLink>

        <RouterLink to="/Particular_concepts">
            <button>Discover precies themes about Politics</button>
        </RouterLink>
    </div>

</template>


<style scoped>
h1 {
  text-align: center;
  color: var(--primary-color);
  font-size: clamp(2rem, 5vw, 4rem);
  font-weight: 800; 
  margin-top: 4rem; 
  text-transform: uppercase;
}
h2 {
  text-align: center;
  color: var(--text-muted);
  font-size: clamp(1.2rem, 3vw, 2rem);
  font-weight: 500;
  margin: 1rem 0 3rem;
}
div {
  display: flex; flex-direction: column; align-items: center; gap: 1.5rem;
}
a { text-decoration: none; }
button {
  background-color: var(--primary-color);
  color: white;
  border: 2px solid var(--primary-color);
  padding: 1.2rem 2.5rem; font-size: 1.2rem; font-weight: bold;
  border-radius: 8px; cursor: pointer; transition: all 0.3s ease; min-width: 320px;
}
button:hover {
  background-color: var(--primary-hover);
  border-color: white; transform: translateY(-2px);
}
</style>