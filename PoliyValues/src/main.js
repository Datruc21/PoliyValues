import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";
import { router } from "./Router/index.js";

const app = createApp(App);
app.use(router);

app.config.globalProperties.$apiUrl = "http://localhost:3000/api";

app.mount("#app");


