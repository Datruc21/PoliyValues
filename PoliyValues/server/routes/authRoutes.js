import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import {
  login,
  register,
  logout,
  changePassword,
  deleteMe,
  getMe,
  updateMe,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);
router.put("/password", verifyToken, changePassword);
router.delete("/me", verifyToken, deleteMe);
router.get("/me", verifyToken, getMe);
router.put("/me", verifyToken, updateMe);

export default router;
