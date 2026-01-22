import { db } from "db/client";
import { reviewCards } from "db/schema";
import { Card as FSRSCard, createEmptyCard, State } from "ts-fsrs";
import { eq } from "drizzle-orm";

export interface CardWithProblem extends FSRSCard {
  problemId: string;
  problemNumber: number;
}

/**
 * Convert DB row -> FSRS card
 */

// Only FSRS card (for FSRS functions)
export function rowToFSRSCard(row: typeof reviewCards.$inferSelect): FSRSCard {
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

// FSRS + problem info (for frontend/display)
export function rowToCardWithProblem(
  row: typeof reviewCards.$inferSelect,
): CardWithProblem {
  return {
    problemId: row.problemId,
    problemNumber: row.problemNumber,
    ...rowToFSRSCard(row),
  };
}

/**
 * Get a review card by problem_id
 */
export function getReviewCard(problemId: string): FSRSCard | null {
  const row = db
    .select()
    .from(reviewCards)
    .where(eq(reviewCards.problemId, problemId))
    .get();

  if (!row) return null;

  return rowToFSRSCard(row); // only FSRSCard
}

/**
 * Create a fresh card if missing
 */
export function getOrCreateReviewCard(problemId: string): FSRSCard {
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

export function saveReviewCard(problemId: string, card: FSRSCard) {
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

export function getAllCards(): CardWithProblem[] {
  const rows = db.select().from(reviewCards).all();
  return rows.map(rowToCardWithProblem);
}
