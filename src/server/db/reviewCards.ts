import { db } from "db/client";
import { reviewCards } from "db/schema";
import { Card, createEmptyCard, State } from "ts-fsrs";
import { eq } from "drizzle-orm";

/**
 * Convert DB row -> FSRS card
 */

function rowToCard(row: typeof reviewCards.$inferSelect): Card {
  return {
    due: new Date(row.due),
    stability: row.stability,
    difficulty: row.difficulty,
    scheduled_days: row.scheduled_days,
    reps: row.reps,
    lapses: row.lapses,
    state: row.state as State,
    last_review: row.last_review ? new Date(row.last_review) : undefined,
    elapsed_days: 0,
    learning_steps: 0,
  };
}

/**
 * Get a review card by problem_id
 */
export function getReviewCard(problemId: string): Card | null {
  const row = db
    .select()
    .from(reviewCards)
    .where(eq(reviewCards.problemId, problemId))
    .get();

  if (!row) return null;

  return rowToCard(row);
}

/**
 * Create a fresh card if missing
 */
export function getOrCreateReviewCard(problemId: string): Card {
  const existing = getReviewCard(problemId);
  if (existing) return existing;

  const card = createEmptyCard(new Date());

  db.insert(reviewCards)
    .values({
      problemId,
      problemNumber: -1, // placeholder if created dynamically
      due: card.due.toISOString(),
      stability: card.stability,
      difficulty: card.difficulty,
      scheduled_days: card.scheduled_days,
      reps: card.reps,
      lapses: card.lapses,
      state: card.state,
      last_review: null,
    })
    .run();

  return card;
}

/**
 * Save updated FSRS card back to DB
 */

export function saveReviewCard(problemId: string, card: Card) {
  db.update(reviewCards)
    .set({
      due: card.due.toISOString(),
      stability: card.stability,
      difficulty: card.difficulty,
      scheduled_days: card.scheduled_days,
      reps: card.reps,
      lapses: card.lapses,
      state: card.state,
      last_review: card.last_review ? card.last_review.toISOString() : null,
    })
    .where(eq(reviewCards.problemId, problemId))
    .run();
}
