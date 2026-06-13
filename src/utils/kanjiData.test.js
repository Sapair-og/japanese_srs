import { describe, test, expect } from 'vitest';
import { kanjiList } from './kanjiData';

describe('Kanji Data Validation', () => {
  test('should load correct number of kanji entries', () => {
    expect(kanjiList.length).toBeGreaterThanOrEqual(300);
  });

  test('each kanji should contain all required attributes', () => {
    kanjiList.forEach(item => {
      expect(item.character).toBeDefined();
      expect(typeof item.character).toBe('string');
      expect(item.character.length).toBe(1);

      expect(item.meaning).toBeDefined();
      expect(typeof item.meaning).toBe('string');

      expect(item.onyomi).toBeDefined();
      expect(typeof item.onyomi).toBe('string');

      expect(item.kunyomi).toBeDefined();
      expect(typeof item.kunyomi).toBe('string');

      expect(item.mnemonic).toBeDefined();
      expect(typeof item.mnemonic).toBe('string');

      expect(item.illustration).toBeDefined();
      expect(typeof item.illustration).toBe('string');

      expect(['n5', 'n4', 'daily']).toContain(item.level);
    });
  });

  test('should have representations for categories', () => {
    const n5Count = kanjiList.filter(k => k.level === 'n5').length;
    const n4Count = kanjiList.filter(k => k.level === 'n4').length;
    const dailyCount = kanjiList.filter(k => k.level === 'daily').length;

    expect(n5Count).toBe(103);
    expect(n4Count).toBe(167);
    expect(dailyCount).toBe(30);
  });
});
