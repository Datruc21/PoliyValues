const express = require("express");
const router = express.Router();
import { getRandomQuestion } from "../controllers/questionController.js"
import { verifyToken } from "../middlewares/authMiddleware.js";

router.get("/random",verifyToken, getRandomQuestion);

export default router;