import express from "express";
const router = express.Router();
import { getRandomQuestion, toggleFavorite, submitAnswer, getFavorites, resetAnswers, getStats } from "../controllers/questionController.js"
import { verifyToken } from "../middlewares/authMiddleware.js";

router.get("/random",verifyToken, getRandomQuestion);
router.get("/favorites", verifyToken, getFavorites);
router.post("/answer", verifyToken, submitAnswer);
router.post("/favorite", verifyToken, toggleFavorite );
router.post("/reset", verifyToken, resetAnswers);
router.get("/stats", verifyToken, getStats);


export default router;