/**
 * Spaced Repetition Scheduling Engine (SM-2 Algorithm)
 * 
 * Ratings map:
 * 0: Again (Forgotten)
 * 1: Hard (Recalled with major effort, shrink interval)
 * 2: Good (Standard SM-2 spacing, optimal progress)
 * 3: Easy (Recalled instantly, extend spacing)
 * 
 * Returns updated { interval, repetitions, easeFactor, nextReview }
 */
export function calculateSM2(rating, prevInterval = 0, prevRepetitions = 0, prevEaseFactor = 2.5) {
  let interval = 0;
  let repetitions = prevRepetitions;
  let easeFactor = prevEaseFactor;

  if (rating === 0) {
    // Again / Forgotten: Reset reps and interval to 1 day, reduce ease factor
    repetitions = 0;
    interval = 1;
    easeFactor = Math.max(1.3, prevEaseFactor - 0.2);
  } else {
    // Correct recall (Hard, Good, Easy)
    repetitions += 1;

    if (repetitions === 1) {
      interval = rating === 3 ? 3 : 1; // Easy starts with 3 days, others with 1 day
    } else if (repetitions === 2) {
      interval = rating === 3 ? 8 : (rating === 2 ? 6 : 3); // Hard starts with 3 days, Good with 6 days, Easy with 8 days
    } else {
      // Repetitions >= 3
      const multiplier = rating === 3 ? 1.5 : (rating === 1 ? 1.2 : 1.0);
      interval = Math.ceil(prevInterval * prevEaseFactor * multiplier);
    }

    // Adjust ease factor based on rating quality
    if (rating === 1) {
      easeFactor = Math.max(1.3, prevEaseFactor - 0.15);
    } else if (rating === 3) {
      easeFactor = Math.min(3.0, prevEaseFactor + 0.15);
    }
    // Good (rating === 2) keeps easeFactor unchanged
  }

  // Calculate next review date
  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + interval);

  return {
    interval,
    repetitions,
    easeFactor: parseFloat(easeFactor.toFixed(2)),
    nextReview
  };
}

/**
 * Determine card maturity category based on repetitions and intervals.
 * Categories: New (0 reps), Learning (1-2 reps), Review (3+ reps, interval < 21), Mature (interval >= 21)
 */
export function getMaturityCategory(repetitions, interval) {
  if (repetitions === 0) return 'new';
  if (repetitions <= 2) return 'learning';
  if (interval >= 21) return 'mature';
  return 'review';
}
