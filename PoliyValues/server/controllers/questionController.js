import db from "../config/db.js";

const getRandomQuestion = async (req, res) => {
  //Get user
  const id = req.user.id;

  try {
    //ask database for 1 random question not already answered by the user (we assume the attribute is_completed can't be NULL)
    const [questions] = await db.query(
      "SELECT q.*, COALESCE(uqs.is_favorite, FALSE) AS is_favorite \
                            FROM questions q\
                            LEFT JOIN user_question_status uqs \
                                ON q.id = uqs.question_id AND uqs.user_id = ?\
                            WHERE (uqs.is_completed = FALSE OR uqs.is_completed IS NULL)\
                            ORDER BY RAND() \
                            LIMIT 1",
      [id],
    ); //[userId] ??

    // In case there is no more available questions
    if (questions.length === 0) {
      return res.status(404).json({
        message: "You have already answered all available questions.",
      });
    }
    //Send the answer
    res.json(questions[0]);
  } catch (err) {
    //Keep the server from crashing if the database doesnt'answer
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const submitAnswer = async (req, res) => {
  const userId = req.user.id;

  const { questionId, opinionValue } = req.body;

  //Vérification de sécurité de base
  if (!questionId || opinionValue === undefined) {
    return res.status(400).json({ error: "questionId et opinionValue sont requis" });
  }
  if (opinionValue < -2 || opinionValue > 2) {
    return res.status(400).json({ error: "La valeur de l'opinion doit être entre -2 et 2" });
  }

  try {
    await db.query(
      `INSERT INTO user_question_status
        (user_id, question_id, is_completed, opinion_value, answered_at)
     VALUES (?, ?, TRUE, ?, CURRENT_TIMESTAMP)
     ON DUPLICATE KEY UPDATE
        is_completed = TRUE,
        opinion_value = VALUES(opinion_value),
        answered_at = CURRENT_TIMESTAMP`,
      [userId, questionId, opinionValue],
    );
    res.status(200).json({ message: "Réponse enregistrée avec succès !" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de l'enregistrement de la réponse" });
  }
};

const toggleFavorite = async (req, res) => {
  const userId = req.user.id;
  const questId = req.body.questId;

  try {
    const query =
      "INSERT INTO user_question_status (user_id, question_id, is_favorite)\
                    VALUES (?, ?, TRUE) \
                    ON DUPLICATE KEY UPDATE is_favorite = NOT is_favorite";

    await db.query(query, [userId, questId]);
    res.status(200).json({ message: "Favorite registered with success !" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error during favorite registering" });
  }
};

const getFavorites = async (req, res) => {
  const userId = req.user.id;

  try {
    const [rows] = await db.query(
      `SELECT q.id, q.theme, q.question_text, q.explanation_concept, q.links, uqs.opinion_value
       FROM user_question_status uqs
       JOIN questions q ON q.id = uqs.question_id
       WHERE uqs.user_id = ? AND uqs.is_favorite = TRUE
       ORDER BY q.theme`,
      [userId],
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error while fetching favorites" });
  }
};

const resetAnswers = async (req, res) => {
  const userId = req.user.id;

  try {
    await db.query(
      `UPDATE user_question_status
       SET is_completed = FALSE, opinion_value = NULL, answered_at = NULL
       WHERE user_id = ?`,
      [userId],
    );
    res.status(200).json({ message: "Answers reset successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error while resetting answers" });
  }
};

const getStats = async (req, res) => {
  const userId = req.user.id;

  try {
    const [rows] = await db.query(
      `SELECT q.id, q.theme, q.ideology, q.question_text, q.links, uqs.opinion_value,
              (SELECT COUNT(*)
                 FROM user_question_status o
                WHERE o.question_id = q.id
                  AND o.user_id <> uqs.user_id
                  AND o.is_completed = TRUE
                  AND o.opinion_value = uqs.opinion_value) AS same_count,
              (SELECT COUNT(*)
                 FROM user_question_status o
                WHERE o.question_id = q.id
                  AND o.user_id <> uqs.user_id
                  AND o.is_completed = TRUE
                  AND o.opinion_value IS NOT NULL) AS total_others
       FROM user_question_status uqs
       JOIN questions q ON q.id = uqs.question_id
       WHERE uqs.user_id = ?
         AND uqs.is_completed = TRUE
         AND uqs.opinion_value IS NOT NULL
       ORDER BY uqs.answered_at DESC`,
      [userId],
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error while fetching stats" });
  }
};

export { getRandomQuestion, submitAnswer, toggleFavorite, getFavorites, resetAnswers, getStats };
