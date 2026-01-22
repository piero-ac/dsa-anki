import {
  FSRS,
  Rating,
  Card,
  FSRSParameters,
  generatorParameters,
} from "ts-fsrs";

export type FSRSRating = Exclude<Rating, Rating.Manual>;

const params: FSRSParameters = generatorParameters({
  request_retention: 0.85,
  maximum_interval: 365,
  enable_fuzz: true,
});
const fsrs = new FSRS(params);

/**
 * Update a card using FSRS
 */
export function reviewCard(
  card: Card,
  rating: FSRSRating,
  now = new Date(),
): Card {
  const schedulingCards = fsrs.repeat(card, now);

  return schedulingCards[rating].card;
}
