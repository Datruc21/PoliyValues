import db from "../config/db.js";

const checkIsAdmin = async (userId) => {
  const [users] = await db.execute("SELECT Admin FROM users WHERE id = ?", [
    userId,
  ]);
  if (users.length === 0) return false;
  return Boolean(users[0].Admin);
};

// 1. Add a question
const addQuestion = async (req, res) => {
  try {
    const isAdmin = await checkIsAdmin(req.user.id || req.user.userId);
    if (!isAdmin) {
      return res
        .status(403)
        .json({ error: "Access denied. Administrator rights required." });
    }

    const { theme, question_text, explanation_concept, links } = req.body;

    if (!theme || !question_text || !explanation_concept) {
      return res.status(400).json({
        error:
          "All mandatory fields (theme, question_text, explanation_concept) must be filled.",
      });
    }

    const query = `
      INSERT INTO questions (theme, question_text, explanation_concept, links) 
      VALUES (?, ?, ?, ?)
    `;

    const linksValue = links ? JSON.stringify(links) : null;
    const [result] = await db.execute(query, [
      theme,
      question_text,
      explanation_concept,
      linksValue,
    ]);

    res.status(201).json({
      message: "Question added successfully",
      questionId: result.insertId,
    });
  } catch (error) {
    console.error("Error addQuestion:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// 2. Edit a question
const editQuestion = async (req, res) => {
  try {
    const isAdmin = await checkIsAdmin(req.user.id || req.user.userId);
    if (!isAdmin) {
      return res
        .status(403)
        .json({ error: "Access denied. Administrator rights required." });
    }

    const { id } = req.params;
    const { theme, question_text, explanation_concept, links } = req.body;

    const query = `
      UPDATE questions 
      SET theme = COALESCE(?, theme), 
          question_text = COALESCE(?, question_text), 
          explanation_concept = COALESCE(?, explanation_concept), 
          links = COALESCE(?, links)
      WHERE id = ?
    `;

    const linksValue = links ? JSON.stringify(links) : null;
    const [result] = await db.execute(query, [
      theme,
      question_text,
      explanation_concept,
      linksValue,
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Question not found." });
    }

    res.json({ message: "Question updated successfully." });
  } catch (error) {
    console.error("Error editQuestion:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// 3. Search questions (by theme or text)
const searchQuestion = async (req, res) => {
  try {
    const isAdmin = await checkIsAdmin(req.user.id || req.user.userId);
    if (!isAdmin) {
      return res
        .status(403)
        .json({ error: "Access denied. Administrator rights required." });
    }

    const { q, theme } = req.query;

    let query = "SELECT * FROM questions WHERE 1=1";
    let params = [];

    if (q) {
      query += " AND (question_text LIKE ? OR explanation_concept LIKE ?)";
      params.push(`%${q}%`, `%${q}%`);
    }

    if (theme) {
      query += " AND theme = ?";
      params.push(theme);
    }

    query += " ORDER BY created_at DESC";

    const [questions] = await db.execute(query, params);
    res.json(questions);
  } catch (error) {
    console.error("Error searchQuestion:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// 4. Delete a question
const deleteQuestion = async (req, res) => {
  try {
    const isAdmin = await checkIsAdmin(req.user.id || req.user.userId);
    if (!isAdmin) {
      return res
        .status(403)
        .json({ error: "Access denied. Administrator rights required." });
    }

    const { id } = req.params;

    const [result] = await db.execute("DELETE FROM questions WHERE id = ?", [
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Question not found." });
    }

    res.json({ message: "Question deleted successfully." });
  } catch (error) {
    console.error("Error deleteQuestion:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// --- USER MANAGEMENT ---

// 5. Search user (by name or email)
const searchUser = async (req, res) => {
  try {
    const isAdmin = await checkIsAdmin(req.user.id || req.user.userId);
    if (!isAdmin) {
      return res
        .status(403)
        .json({ error: "Access denied. Administrator rights required." });
    }

    const { q } = req.query;

    let query =
      "SELECT id, name, email, Admin, isBanned, created_at FROM users WHERE 1=1";
    let params = [];

    if (q) {
      query += " AND (name LIKE ? OR email LIKE ?)";
      params.push(`%${q}%`, `%${q}%`);
    }

    const [users] = await db.execute(query, params);
    res.json(users);
  } catch (error) {
    console.error("Error searchUser:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// 6. Ban a user
const banUser = async (req, res) => {
  try {
    const isAdmin = await checkIsAdmin(req.user.id || req.user.userId);
    if (!isAdmin) {
      return res
        .status(403)
        .json({ error: "Access denied. Administrator rights required." });
    }

    const { id } = req.params;

    const [result] = await db.execute(
      "UPDATE users SET isBanned = 1 WHERE id = ?",
      [id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    res.json({ message: "User banned successfully." });
  } catch (error) {
    console.error("Error banUser:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// 7. Unban a user
const unbanUser = async (req, res) => {
  try {
    const isAdmin = await checkIsAdmin(req.user.id || req.user.userId);
    if (!isAdmin) {
      return res
        .status(403)
        .json({ error: "Access denied. Administrator rights required." });
    }

    const { id } = req.params;

    const [result] = await db.execute(
      "UPDATE users SET isBanned = 0 WHERE id = ?",
      [id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    res.json({ message: "User unbanned successfully." });
  } catch (error) {
    console.error("Error unbanUser:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// 8. Make a user Admin
const makeAdmin = async (req, res) => {
  try {
    const isAdmin = await checkIsAdmin(req.user.id || req.user.userId);
    if (!isAdmin) {
      return res
        .status(403)
        .json({ error: "Access denied. Administrator rights required." });
    }

    const { id } = req.params;

    const [result] = await db.execute(
      "UPDATE users SET Admin = 1 WHERE id = ?",
      [id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    res.json({ message: "The user is now an administrator." });
  } catch (error) {
    console.error("Error makeAdmin:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// 9. Remove Admin rights
const undoAdmin = async (req, res) => {
  try {
    const isAdmin = await checkIsAdmin(req.user.id || req.user.userId);
    if (!isAdmin) {
      return res
        .status(403)
        .json({ error: "Access denied. Administrator rights required." });
    }

    const { id } = req.params;

    const [result] = await db.execute(
      "UPDATE users SET Admin = 0 WHERE id = ?",
      [id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    res.json({ message: "Administrator rights revoked successfully." });
  } catch (error) {
    console.error("Error undoAdmin:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// --- GLOBAL EXPORT ---
module.exports = {
  addQuestion,
  editQuestion,
  searchQuestion,
  deleteQuestion,
  searchUser,
  banUser,
  unbanUser,
  makeAdmin,
  undoAdmin,
};
