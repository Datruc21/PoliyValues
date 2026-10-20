import express from "express";
const router = express.Router();
import { getRandomQuestion, toggleFavorite, submitAnswer } from "../controllers/questionController.js"
import { verifyToken } from "../middlewares/authMiddleware.js";

router.get("/random",verifyToken, getRandomQuestion);
router.post("/answer", verifyToken, submitAnswer);
router.post("/favorite", verifyToken, toggleFavorite );


router.get("/random", verifyToken, getRandomQuestion);

export default router;
