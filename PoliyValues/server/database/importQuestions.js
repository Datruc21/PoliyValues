import "dotenv/config";
import db from "../config/db.js";
import seeder from "./seeder.json" with { type: "json" };

const run = async () => {
  let added = 0;
  let updated = 0;

  for (const q of seeder.questions) {
    const [existing] = await db.query(
      "SELECT id, ideology FROM questions WHERE question_text = ?",
      [q.question_text],
    );

    if (existing.length > 0) {
      if (!existing[0].ideology && q.ideology) {
        await db.query("UPDATE questions SET ideology = ? WHERE id = ?", [
          q.ideology,
          existing[0].id,
        ]);
        updated++;
      }
      continue;
    }

    await db.query(
      "INSERT INTO questions (theme, ideology, question_text, explanation_concept, links) VALUES (?, ?, ?, ?, ?)",
      [
        q.theme,
        q.ideology || null,
        q.question_text,
        q.explanation_concept,
        JSON.stringify(q.links || []),
      ],
    );
    added++;
  }

  console.log(`${added} question(s) added, ${updated} updated.`);
  process.exit(0);
};

run().catch((err) => {
  console.error("❌ Import failed:", err);
  process.exit(1);
});