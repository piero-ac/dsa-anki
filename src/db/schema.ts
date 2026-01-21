import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";


export const reviewCards = sqliteTable("reviewCards", {
  problemId: text("problemId").primaryKey(),
   due: text("due"),
  stability: real("stability"),
  difficulty: real("difficulty"),
  elapsed_days: real("elapsed_days"),
  scheduled_days: real("scheduled_days"),
  reps: integer("reps"),
  lapses: integer("lapses"),
  state: integer("state"),
  last_review: text("last_review"),
})