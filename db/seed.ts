import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { reviewCards } from "./schema.ts";
import { createEmptyCard } from "ts-fsrs";

// 1 open or create the database
const sqlite = new Database("./db/database.sqlite");
const db = drizzle(sqlite);

// CREATE TABLE IF NOT EXISTS
db.run(`
  CREATE TABLE IF NOT EXISTS reviewCards (
    problem_id TEXT PRIMARY KEY,
    problem_number INTEGER NOT NULL,
    due TEXT NOT NULL,
    stability REAL NOT NULL,
    difficulty REAL NOT NULL,
    scheduled_days REAL NOT NULL,
    reps INTEGER NOT NULL,
    lapses INTEGER NOT NULL,
    state INTEGER NOT NULL,
    last_review TEXT
  )
`);

// 2 initial problems
const problems = [
  { number: 1, slug: "two-sum" },
  { number: 20, slug: "valid-parentheses" },
  { number: 53, slug: "maximum-subarray" },
  { number: 70, slug: "climbing-stairs" },
  { number: 121, slug: "best-time-to-buy-sell-stock" },
  { number: 133, slug: "clone-graph" },
  { number: 200, slug: "number-of-islands" },
  { number: 206, slug: "reverse-linked-list" },
  { number: 207, slug: "course-schedule" },
  { number: 102, slug: "binary-tree-level-order-traversal" },
];

for (const problem of problems) {
  const card = createEmptyCard(new Date());

  db.insert(reviewCards)
    .values({
      problemId: problem.slug,
      problemNumber: problem.number,
      due: card.due.toISOString(),
      stability: card.stability,
      difficulty: card.difficulty,
      scheduled_days: card.scheduled_days,
      reps: card.reps,
      lapses: card.lapses,
      state: card.state,
      last_review: card.last_review ? card.last_review.toISOString() : null,
    })
    .onConflictDoNothing()
    .run();
}
