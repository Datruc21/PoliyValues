import express from "express";
import cors from "cors";
import db from "./config/db.js";
import { initDb } from "./database/initDb.js";
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send(
    "🚀 Backend Express pour PoliyValues opérationnel ! Accédez aux questions via /api/questions",
  );
});

app.use("/api/auth", authRoutes);

app.get(`${VUE_APP_API_URL}/users`, async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, name, email, admin, created_at FROM users",
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.get(`${VUE_APP_API_URL}/questions`, async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM questions");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.get(`${VUE_APP_API_URL}/user-status`, async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM user_question_status");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  await initDb();
  console.log(`🚀 Serveur lancé sur : http://localhost:${PORT}`);
});
