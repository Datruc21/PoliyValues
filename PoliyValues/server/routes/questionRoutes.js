import express from "express";
import { getRandomQuestion } from "../controllers/questionController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/random", verifyToken, getRandomQuestion);

export default router;
