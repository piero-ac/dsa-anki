import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const reviewCards = sqliteTable("reviewCards", {
  problemId: text("problem_id").primaryKey(),
  problemNumber: integer("problem_number").notNull(),
  due: text("due").notNull(),
  stability: real("stability").notNull(),
  difficulty: real("difficulty").notNull(),
  scheduled_days: real("scheduled_days").notNull(),
  reps: integer("reps").notNull(),
  lapses: integer("lapses").notNull(),
  state: integer("state").notNull(),
  last_review: text("last_review"),
});
