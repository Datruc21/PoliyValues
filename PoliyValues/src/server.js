/*This code is to create an express server that will handle connexion with vue (front end) and database*/

import express from "express";
import cors from "cors";

const app = express();

app.use(cors()); // Allow Vue to contact Express
app.use(express.json()); // Enables data reading sent by Vue

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server launched on : http://localhost:${PORT}`);
});
