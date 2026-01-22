import { getOrCreateReviewCard, saveReviewCard } from "../db/reviewCards";
import { reviewCard } from "../review/fsrs";
import { type FSRSRating } from "../review/fsrs";

export interface ReviewProblemInput {
  problemId: string;
  rating: FSRSRating;
}

export interface ReviewProblemOutput {
  problemId: string;
  due: string;
  stability: number;
  difficulty: number;
  reps: number;
  lapses: number;
  state: number;
}

/**
 * Review a LeetCode problem
 */
export function reviewProblem(input: ReviewProblemInput): ReviewProblemOutput {
  const { problemId, rating } = input;

  // 1 Load card from DB (or create if missing)
  const card = getOrCreateReviewCard(problemId);

  // 2 Update card using FSRS
  const updatedCard = reviewCard(card, rating);

  // 3 Persist updated card to DB
  saveReviewCard(problemId, updatedCard);

  // 4 Return updated info for frontend
  return {
    problemId,
    due: updatedCard.due.toISOString(),
    stability: updatedCard.stability,
    difficulty: updatedCard.difficulty,
    reps: updatedCard.reps,
    lapses: updatedCard.lapses,
    state: updatedCard.state,
  };
}
