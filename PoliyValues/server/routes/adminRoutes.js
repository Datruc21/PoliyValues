const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/authMiddleware");

const {
  addQuestion,
  editQuestion,
  searchQuestion,
  deleteQuestion,
  searchUser,
  banUser,
  unbanUser,
  makeAdmin,
  undoAdmin,
} = require("../controllers/adminController");

router.post("/questions", verifyToken, addQuestion);
router.put("/questions/:id", verifyToken, editQuestion);
router.get("/questions/search", verifyToken, searchQuestion);
router.delete("/questions/:id", verifyToken, deleteQuestion);

router.get("/users/search", verifyToken, searchUser);
router.post("/users/:id/ban", verifyToken, banUser);
router.post("/users/:id/unban", verifyToken, unbanUser);
router.patch("/users/:id/make-admin", verifyToken, makeAdmin);
router.patch("/users/:id/undo-admin", verifyToken, undoAdmin);

module.exports = router;
