
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
    font-size: 5vw;
    margin-top: 2rem;
}

h2 {
    text-align: center;
    font-size: 3vw;
    margin-top: 1rem;
}

RouterLink {
    display: flex;
    justify-content: center;
    margin-top: 2rem;
}

div {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

button {
    background-color: #3498db;
    color: white;
    border: 2px solid black;
    padding: 1vw 2vw;
    margin: 1vw;
    font-size: 1.5vw;
    border-radius: 5px;
}

button:hover {
    background-color: rgb(15, 78, 119);    
    cursor: pointer;
    transition: background-color 0.3s ease;
}

</style>