import db from "../config/db.js";
import { seedDB } from "./seeder.js";

export async function initDb() {
  try {
    // 1. Table users
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        admin BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);

    // 2. Table questions
    await db.query(`
      CREATE TABLE IF NOT EXISTS questions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        theme VARCHAR(100) NOT NULL,
        question_text TEXT NOT NULL,
        explanation_concept TEXT NOT NULL,
        links JSON NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);

    // 3. Table user_question_status
    await db.query(`
      CREATE TABLE IF NOT EXISTS user_question_status (
        user_id INT NOT NULL,
        question_id INT NOT NULL,
        is_completed BOOLEAN DEFAULT FALSE,
        is_favorite BOOLEAN DEFAULT FALSE,
        opinion_value TINYINT NULL CHECK (opinion_value BETWEEN -2 AND 2),
        answered_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, question_id),
        CONSTRAINT fk_uqs_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        CONSTRAINT fk_uqs_question FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);

    console.log("✅ Tables MySQL créées / vérifiées avec succès !");

    // Lancement du seeding
    await seedDB();
  } catch (error) {
    console.error("❌ Erreur lors de l'initialisation de la DB :", error);
  }
}
