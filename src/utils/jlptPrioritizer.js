export const jlptHighFreqHiragana = [
  'おぼえます', 'わすれます', 'しらべます', 'なおします', 'さがします', 'おくれます', 
  'まにあいます', 'はしります', 'たちます', 'つかいます', 'つくります', 'すわります', 
  'やくにたちます', 'じゅんび', 'しんぱい', 'よてい', 'やくそく', 'ようじ', 'いみ', 
  'あんない', 'かいぎ', 'いけん', 'ばしょ', 'ほうほう', 'すばらしい', 'べんり', 
  'たいせつ', 'ひつよう', 'とくべつ', 'ふくざつ', 'きっと', 'たぶん', 'やっと', 
  'とくに', 'れんらく', 'かたづけます', 'そうだん', 'しょうかい', 'けいけん'
];

export const jlptHighFreqEnglish = [
  'memorize', 'forget', 'investigate', 'check', 'repair', 'correct', 'look for', 'search', 
  'late', 'in time', 'run', 'stand', 'use', 'make', 'produce', 'sit', 'useful', 'prepare', 
  'worry', 'schedule', 'appointment', 'promise', 'errand', 'meaning', 'guide', 'meeting', 
  'opinion', 'place', 'method', 'wonderful', 'convenient', 'important', 'necessary', 
  'special', 'complex', 'surely', 'probably', 'finally', 'especially', 'contact',
  'tidy', 'introduce', 'experience', 'consult'
];

export const getJlptPriority = (card) => {
  if (!card) return 0;
  let score = 0;
  
  // 1. Check if it's N4 lesson (Lesson 26, Lesson 27)
  const isN4Lesson = card.lesson && (
    card.lesson.includes('26') || 
    card.lesson.includes('27') || 
    card.lesson.toLowerCase().includes('n4')
  );
  if (isN4Lesson) {
    score += 100;
  }
  
  // 2. Check if it matches high frequency hiragana list
  const hiraganaMatch = jlptHighFreqHiragana.some(h => card.hiragana && card.hiragana.includes(h));
  if (hiraganaMatch) {
    score += 150;
  }
  
  // 3. Check if it matches high frequency english list
  const englishMatch = jlptHighFreqEnglish.some(e => card.english && card.english.toLowerCase().includes(e));
  if (englishMatch) {
    score += 150;
  }
  
  return score;
};

export const sortVocabByJlptPreference = (pool, randomSeed = Math.random) => {
  return pool
    .map(card => {
      const priority = getJlptPriority(card);
      // Add a random variance so that sorting is weighted but still has random variety
      const weight = priority + randomSeed() * 80;
      return { card, weight };
    })
    .sort((a, b) => b.weight - a.weight)
    .map(item => item.card);
};
