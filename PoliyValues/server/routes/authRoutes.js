const express = require("express");
const router = express.Router();
const { login, register } = require("../controllers/authController");

router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);
router.put("/password", verifyToken, changePassword);
router.delete("/me", verifyToken, deleteMe);
router.get("/me", verifyToken, getMe);
router.put("/me", verifyToken, updateMe);

moh.exports = router;
