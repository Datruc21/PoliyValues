import db from "../config/db.js";
import seeder from "./seeder.json" with { type: "json" };

export async function seedDB() {
  try {
    // 1. Seeding Users
    const [userRows] = await db.query("SELECT COUNT(*) FROM users");
    if (userRows[0]["COUNT(*)"] === 0 && seeder.users?.length > 0) {
      for (const user of seeder.users) {
        await db.query(
          "INSERT INTO users (name, email, password, admin) VALUES (?, ?, ?, ?)",
          [user.name, user.email, user.password, user.admin || false],
        );
      }
      console.log("🌱 Utilisateurs de test insérés !");
    }

    // 2. Seeding Questions
    const [questionRows] = await db.query("SELECT COUNT(*) FROM questions");
    if (questionRows[0]["COUNT(*)"] === 0 && seeder.questions?.length > 0) {
      for (const q of seeder.questions) {
        await db.query(
          "INSERT INTO questions (theme, question_text, explanation_concept, links) VALUES (?, ?, ?, ?)",
          [
            q.theme,
            q.question_text,
            q.explanation_concept,
            JSON.stringify(q.links || []),
          ],
        );
      }
      console.log("🌱 Questions de test insérées !");
    }

    // 3. Seeding User Question Status
    const [statusRows] = await db.query(
      "SELECT COUNT(*) FROM user_question_status",
    );
    if (
      statusRows[0]["COUNT(*)"] === 0 &&
      seeder.user_question_status?.length > 0
    ) {
      const [firstUser] = await db.query("SELECT id FROM users LIMIT 1");
      const [firstQuestion] = await db.query(
        "SELECT id FROM questions LIMIT 1",
      );

      if (firstUser.length > 0 && firstQuestion.length > 0) {
        const validUserId = firstUser[0].id;
        const validQuestionId = firstQuestion[0].id;

        for (const st of seeder.user_question_status) {
          await db.query(
            `INSERT INTO user_question_status 
             (user_id, question_id, opinion_value, is_completed, is_favorite, answered_at) 
             VALUES (?, ?, ?, ?, ?, NOW())`,
            [
              validUserId,
              validQuestionId,
              st.opinion_value,
              st.is_completed || true,
              st.is_favorite || false,
            ],
          );
        }
        console.log("🌱 Statuts de test insérés !");
      }
    }
  } catch (error) {
    console.error("❌ Erreur lors du seeding :", error);
  }
}
