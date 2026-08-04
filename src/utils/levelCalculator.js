/**
 * Calculates user level, total XP, current level XP, XP needed for next level,
 * and the level progress percentage based on the number of correct reviews.
 * 
 * Each correct review yields 10 XP.
 * XP threshold for each level increases dynamically: Level 1 requires 100 XP,
 * Level 2 requires 200 XP, Level 3 requires 300 XP, etc.
 * 
 * @param {number} totalCorrect - The total number of correct answers.
 * @returns {object} Level metadata including level, xp, progressPercent, etc.
 */
export function calculateLevelInfo(totalCorrect) {
  const xp = (totalCorrect || 0) * 10;
  let level = 1;
  let xpForNextLevel = 100;
  let accumulatedXp = 0;
  
  while (xp >= accumulatedXp + xpForNextLevel) {
    accumulatedXp += xpForNextLevel;
    level += 1;
    xpForNextLevel = level * 100;
  }
  
  const xpInCurrentLevel = xp - accumulatedXp;
  const progressPercent = Math.min(100, Math.floor((xpInCurrentLevel / xpForNextLevel) * 100));
  
  return {
    level,
    xp,
    xpInCurrentLevel,
    xpForNextLevel,
    progressPercent
  };
}
