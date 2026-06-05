import { describe, it, expect } from 'vitest';
import { calculateSM2, getMaturityCategory } from './srsEngine';

describe('calculateSM2 Algorithm tests', () => {
  it('should reset parameters on rating 0 (Again)', () => {
    const prevInterval = 10;
    const prevRepetitions = 4;
    const prevEaseFactor = 2.5;

    const result = calculateSM2(0, prevInterval, prevRepetitions, prevEaseFactor);

    expect(result.interval).toBe(1);
    expect(result.repetitions).toBe(0);
    expect(result.easeFactor).toBe(2.3); // 2.5 - 0.2
    expect(result.nextReview).toBeInstanceOf(Date);
  });

  it('should set correct intervals for first repetition (repetitions === 1)', () => {
    // Quality: Hard (1)
    const resHard = calculateSM2(1, 0, 0, 2.5);
    expect(resHard.interval).toBe(1);
    expect(resHard.repetitions).toBe(1);
    expect(resHard.easeFactor).toBe(2.35); // 2.5 - 0.15

    // Quality: Good (2)
    const resGood = calculateSM2(2, 0, 0, 2.5);
    expect(resGood.interval).toBe(1);
    expect(resGood.repetitions).toBe(1);
    expect(resGood.easeFactor).toBe(2.5); // unchanged

    // Quality: Easy (3)
    const resEasy = calculateSM2(3, 0, 0, 2.5);
    expect(resEasy.interval).toBe(3);
    expect(resEasy.repetitions).toBe(1);
    expect(resEasy.easeFactor).toBe(2.65); // 2.5 + 0.15
  });

  it('should set correct intervals for second repetition (repetitions === 2)', () => {
    // Quality: Hard (1)
    const resHard = calculateSM2(1, 1, 1, 2.5);
    expect(resHard.interval).toBe(3);
    expect(resHard.repetitions).toBe(2);

    // Quality: Good (2)
    const resGood = calculateSM2(2, 1, 1, 2.5);
    expect(resGood.interval).toBe(6);
    expect(resGood.repetitions).toBe(2);

    // Quality: Easy (3)
    const resEasy = calculateSM2(3, 1, 1, 2.5);
    expect(resEasy.interval).toBe(8);
    expect(resEasy.repetitions).toBe(2);
  });

  it('should scale intervals for repetitions >= 3', () => {
    // Quality: Good (2)
    const resGood = calculateSM2(2, 6, 2, 2.5);
    expect(resGood.interval).toBe(15); // Math.ceil(6 * 2.5 * 1.0) = 15
    expect(resGood.repetitions).toBe(3);

    // Quality: Hard (1)
    const resHard = calculateSM2(1, 6, 2, 2.5);
    expect(resHard.interval).toBe(18); // Math.ceil(6 * 2.5 * 1.2) = 18
    expect(resHard.repetitions).toBe(3);
  });
});

describe('getMaturityCategory tests', () => {
  it('should return correct maturity category based on repetitions and interval', () => {
    expect(getMaturityCategory(0, 0)).toBe('new');
    expect(getMaturityCategory(1, 1)).toBe('learning');
    expect(getMaturityCategory(2, 3)).toBe('learning');
    expect(getMaturityCategory(3, 10)).toBe('review');
    expect(getMaturityCategory(3, 21)).toBe('mature');
    expect(getMaturityCategory(5, 45)).toBe('mature');
  });
});
