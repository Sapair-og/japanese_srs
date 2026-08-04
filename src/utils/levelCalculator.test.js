import { describe, it, expect } from 'vitest';
import { calculateLevelInfo } from './levelCalculator';

describe('Level Calculator tests', () => {
  it('should return default Level 1 stats for 0 correct reviews', () => {
    const info = calculateLevelInfo(0);
    expect(info).toEqual({
      level: 1,
      xp: 0,
      xpInCurrentLevel: 0,
      xpForNextLevel: 100,
      progressPercent: 0
    });
  });

  it('should handle undefined or null values by defaulting to 0', () => {
    expect(calculateLevelInfo(null)).toEqual({
      level: 1,
      xp: 0,
      xpInCurrentLevel: 0,
      xpForNextLevel: 100,
      progressPercent: 0
    });
    expect(calculateLevelInfo(undefined)).toEqual({
      level: 1,
      xp: 0,
      xpInCurrentLevel: 0,
      xpForNextLevel: 100,
      progressPercent: 0
    });
  });

  it('should return Level 1 with 50% progress for 5 correct reviews', () => {
    const info = calculateLevelInfo(5);
    expect(info).toEqual({
      level: 1,
      xp: 50,
      xpInCurrentLevel: 50,
      xpForNextLevel: 100,
      progressPercent: 50
    });
  });

  it('should level up to Level 2 at exactly 10 correct reviews (100 XP)', () => {
    const info = calculateLevelInfo(10);
    expect(info.level).toBe(2);
    expect(info.xp).toBe(100);
    expect(info.xpInCurrentLevel).toBe(0);
    expect(info.xpForNextLevel).toBe(200);
    expect(info.progressPercent).toBe(0);
  });

  it('should calculate Level 2 mid-progression correctly for 15 correct reviews', () => {
    const info = calculateLevelInfo(15);
    expect(info.level).toBe(2);
    expect(info.xp).toBe(150);
    expect(info.xpInCurrentLevel).toBe(50);
    expect(info.xpForNextLevel).toBe(200);
    expect(info.progressPercent).toBe(25); // 50 / 200 = 25%
  });

  it('should level up to Level 3 at 30 correct reviews (300 XP)', () => {
    const info = calculateLevelInfo(30);
    expect(info.level).toBe(3);
    expect(info.xp).toBe(300);
    expect(info.xpInCurrentLevel).toBe(0);
    expect(info.xpForNextLevel).toBe(300);
    expect(info.progressPercent).toBe(0);
  });
});
