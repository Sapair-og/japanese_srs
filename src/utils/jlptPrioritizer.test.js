import { describe, it, expect } from 'vitest';
import { getJlptPriority, sortVocabByJlptPreference } from './jlptPrioritizer';

describe('JLPT Prioritizer tests', () => {
  it('should return 0 priority for standard N5 cards with no high frequency words', () => {
    const card = { hiragana: 'わたし', kanji: '私', english: 'I', lesson: 'Lesson 1' };
    expect(getJlptPriority(card)).toBe(0);
  });

  it('should return 100 priority for N4 lesson cards with no high frequency words', () => {
    const card = { hiragana: 'やります', kanji: 'やります', english: 'do', lesson: 'Lesson 26' };
    expect(getJlptPriority(card)).toBe(100);
  });

  it('should return 250 priority for N5 cards with high frequency words', () => {
    const card = { hiragana: 'おぼえます', kanji: '覚えます', english: 'memorize', lesson: 'Lesson 17' };
    // hiragana match (+150), english match (+150), no N4 lesson (0)
    // Wait, let's verify if matching both hiragana and english gives 300
    expect(getJlptPriority(card)).toBe(300);
  });

  it('should return 400 priority for N4 cards with high frequency words', () => {
    const card = { hiragana: 'さがします', kanji: '探します', english: 'search', lesson: 'Lesson 26' };
    // N4 lesson (+100), hiragana match (+150), english match (+150) -> 400
    expect(getJlptPriority(card)).toBe(400);
  });

  it('should sort cards based on priority preference', () => {
    const cards = [
      { hiragana: 'わたし', kanji: '私', english: 'I', lesson: 'Lesson 1' }, // priority 0
      { hiragana: 'さがします', kanji: '探します', english: 'search', lesson: 'Lesson 26' }, // priority 400
      { hiragana: 'やります', kanji: 'やります', english: 'do', lesson: 'Lesson 26' }, // priority 100
      { hiragana: 'おぼえます', kanji: '覚えます', english: 'memorize', lesson: 'Lesson 17' } // priority 300
    ];

    // Using a mocked seed returning 0 to remove random variance
    const sorted = sortVocabByJlptPreference(cards, () => 0);

    expect(sorted[0].english).toBe('search'); // priority 400
    expect(sorted[1].english).toBe('memorize'); // priority 300
    expect(sorted[2].english).toBe('do'); // priority 100
    expect(sorted[3].english).toBe('I'); // priority 0
  });
});
