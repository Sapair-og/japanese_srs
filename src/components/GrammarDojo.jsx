import { useState, useEffect } from 'react';
import { n5Lessons, n4Lessons } from '../utils/grammarData';

const wordMetadata = {
  '私': { kana: 'わたし', romaji: 'watashi' },
  'は': { kana: 'は', romaji: 'wa' },
  'が': { kana: 'が', romaji: 'ga' },
  'を': { kana: 'を', romaji: 'o' },
  'に': { kana: 'に', romaji: 'ni' },
  'へ': { kana: 'へ', romaji: 'e' },
  'で': { kana: 'で', romaji: 'de' },
  'も': { kana: 'も', romaji: 'mo' },
  'から': { kana: 'から', romaji: 'kara' },
  'まで': { kana: 'まで', romaji: 'made' },
  '学生': { kana: 'がくせい', romaji: 'gakusei' },
  'です': { kana: 'です', romaji: 'desu' },
  'でした': { kana: 'でした', romaji: 'deshita' },
  'ではありません': { kana: 'ではありません', romaji: 'dewa arimasen' },
  '水': { kana: 'みず', romaji: 'mizu' },
  '飲みます': { kana: 'のみます', romaji: 'nomimasu' },
  '学校': { kana: 'がっこう', romaji: 'gakkou' },
  '行きます': { kana: 'いきます', romaji: 'ikimasu' },
  'ここに': { kana: 'ここに', romaji: 'koko ni' },
  '寿司': { kana: 'すし', romaji: 'sushi' },
  'あります': { kana: 'あります', romaji: 'arimasu' },
  '友達': { kana: 'ともだち', romaji: 'tomodachi' },
  'います': { kana: 'います', romaji: 'imasu' },
  '飲んで': { kana: 'のんで', romaji: 'nonde' },
  '食べて': { kana: 'たべて', romaji: 'tabete' },
  'ください': { kana: 'ください', romaji: 'kudasai' },
  '一緒': { kana: 'いっしょ', meaning: 'together', reading: '一緒' },
  '食べませんか': { kana: 'たべませんか', romaji: 'tabemasenka' },
  '飲ん': { kana: 'のん', romaji: 'non' },
  'いけません': { kana: 'いけません', romaji: 'ikemasen' },
  '好き': { kana: 'すき', romaji: 'suki' },
  'ですから': { kana: 'ですから', romaji: 'desu kara' },
  '日本語': { kana: 'にほんご', romaji: 'nihongo' },
  '難しい': { kana: 'むずかしい', romaji: 'muzukashii' },
  'ですが': { kana: 'ですが', romaji: 'desu ga' },
  '面白い': { kana: 'おもしろい', romaji: 'omashiroi' },
  '食べます': { kana: 'たべます', romaji: 'tabemasu' },
  '行く': { kana: 'いく', romaji: 'iku' },
  'つもり': { kana: 'つもり', romaji: 'tsumori' },
  '食べたい': { kana: 'たべたい', romaji: 'tabetai' },
  '食べた': { kana: 'たべた', romaji: 'tabeta' },
  'こと': { kana: 'こと', romaji: 'koto' },
  'いい': { kana: 'いい', romaji: 'ii' },
  '行か': { kana: 'いか', romaji: 'ika' },
  'なければ': { kana: 'なければ', romaji: 'nakereba' },
  'すぎました': { kana: 'すぎました', romaji: 'sugimashita' },
  '食べる': { kana: 'たべる', romaji: 'taberu' },
  'できます': { kana: 'できます', romaji: 'dekimasu' },
  '飲み': { kana: 'のみ', romaji: 'nomi' },
  'ながら': { kana: 'ながら', romaji: 'nagara' },
  '勉強します': { kana: 'べんきょうします', romaji: 'benkyou shimasu' },
  '旅行': { kana: 'りょこう', romaji: 'ryokou' },
  'の': { kana: 'の', romaji: 'no' },
  '前に': { kana: 'まえに', romaji: 'mae ni' },
  'ホテル': { kana: 'ほてる', romaji: 'hoteru' },
  '予約して': { kana: 'よやくして', romaji: 'yoyaku shite' },
  'おきます': { kana: 'おきます', romaji: 'okimasu' },
  'しまいました': { kana: 'しまいました', romaji: 'shimaimashita' },
  '明日': { kana: 'あした', romaji: 'ashita' },
  'かも': { kana: 'かも', romaji: 'kamo' },
  'しれません': { kana: 'しれません', romaji: 'shiremasen' },
  '彼': { kana: 'かれ', romaji: 'kare' },
  '今日': { kana: 'きょう', romaji: 'kyou' },
  'はず': { kana: 'はず', romaji: 'hazu' },
  '薬': { kana: 'くすり', romaji: 'kusuri' },
  '飲んだ': { kana: 'のんだ', romaji: 'nonda' },
  'のに': { kana: 'のに', romaji: 'noni' },
  '風邪': { kana: 'かぜ', romaji: 'kaze' },
  '治りません': { kana: 'なおりません', romaji: 'naorimasen' },
  '降ったら': { kana: 'ふったら', romaji: 'futtara' },
  '行きません': { kana: 'いきません', romaji: 'ikimasen' },
  '安ければ': { kana: 'やすければ', romaji: 'yasukereba' },
  'あの': { kana: 'あの', romaji: 'ano' },
  '買います': { kana: 'かいます', romaji: 'kaimasu' },
  '春': { kana: 'はる', romaji: 'haru' },
  'なると': { kana: 'なると', romaji: 'naruto' },
  '桜': { kana: 'さくら', romaji: 'sakura' },
  '咲きます': { kana: 'さきます', romaji: 'sakimasu' },
  '電車': { kana: 'でんしゃ', romaji: 'densha' },
  '便利': { kana: 'べんり', romaji: 'benri' },
  '先生': { kana: 'せんせい', romaji: 'sensei' },
  '教えて': { kana: 'おしえて', romaji: 'oshiete' },
  'れました': { kana: 'れました', romaji: 'remashita' }
};

// Inline interactive vector Mascot
const MascotSensei = ({ mood = 'neutral' }) => {
  const isHappy = mood === 'happy';
  const isSad = mood === 'sad';
  
  return (
    <div className="flex flex-col items-center select-none animate-[bounce-slow_3s_ease-in-out_infinite]">
      <svg viewBox="0 0 120 120" className="w-16 h-16 md:w-20 md:h-20 transition-all duration-300 transform hover:scale-110 drop-shadow-md">
        {/* Ears */}
        <path d="M25 45 L15 15 L45 30 Z" fill="#b45309" stroke="#451a03" strokeWidth="2.5" />
        <path d="M28 42 L20 22 L40 33 Z" fill="#fef3c7" />
        <path d="M95 45 L105 15 L75 30 Z" fill="#b45309" stroke="#451a03" strokeWidth="2.5" />
        <path d="M92 42 L100 22 L80 33 Z" fill="#fef3c7" />
        
        {/* Tail */}
        <path d="M85 75 Q115 65 105 90 Q90 100 80 85 Z" fill="#451a03" stroke="#1c0a00" strokeWidth="2.5" />
        
        {/* Body & Head */}
        <circle cx="60" cy="70" r="42" fill="#b45309" stroke="#451a03" strokeWidth="2.5" />
        
        {/* Tanuki Belly Patch */}
        <ellipse cx="60" cy="85" rx="28" ry="20" fill="#fef3c7" stroke="#b45309" strokeWidth="1" strokeDasharray="3 3" />

        {/* Face Mask Patch */}
        <path d="M30 65 Q60 50 90 65 Q95 78 80 82 Q60 72 40 82 Q25 78 30 65 Z" fill="#451a03" />
        <ellipse cx="60" cy="68" rx="24" ry="16" fill="#fef3c7" />

        {/* Dynamic Eyes */}
        {isHappy ? (
          <>
            <path d="M42 66 Q48 59 54 66" stroke="#451a03" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M66 66 Q72 59 78 66" stroke="#451a03" strokeWidth="3" fill="none" strokeLinecap="round" />
          </>
        ) : isSad ? (
          <>
            <path d="M42 64 L52 68" stroke="#451a03" strokeWidth="3" strokeLinecap="round" />
            <path d="M68 68 L78 64" stroke="#451a03" strokeWidth="3" strokeLinecap="round" />
            {/* Tear drops */}
            <path d="M38 72 Q35 77 38 80 Q41 77 38 72" fill="#38bdf8" />
          </>
        ) : (
          <>
            <circle cx="48" cy="64" r="4.5" fill="#451a03" />
            <circle cx="46" cy="62" r="1.5" fill="white" />
            <circle cx="72" cy="64" r="4.5" fill="#451a03" />
            <circle cx="70" cy="62" r="1.5" fill="white" />
          </>
        )}

        {/* Nose */}
        <polygon points="57,71 63,71 60,75" fill="#451a03" />

        {/* Mouth */}
        {isHappy ? (
          <path d="M54 78 Q60 85 66 78" stroke="#451a03" strokeWidth="2.5" fill="#ef4444" strokeLinecap="round" />
        ) : isSad ? (
          <path d="M55 81 Q60 76 65 81" stroke="#451a03" strokeWidth="2" fill="none" strokeLinecap="round" />
        ) : (
          <path d="M55 79 Q60 82 65 79" stroke="#451a03" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        )}

        {/* Headband (Hachimaki) */}
        <rect x="34" y="43" width="52" height="8" fill="#ef4444" rx="2" />
        <circle cx="60" cy="47" r="1.8" fill="white" />
      </svg>
      {/* Decorative Pedestal shadow */}
      <div className="w-10 h-1.5 bg-black/10 dark:bg-black/40 rounded-full blur-xs mt-1" />
    </div>
  );
};

// Sleek feedback indicator icon for Duolingo-style drawers
const FeedbackIcon = ({ isCorrect }) => {
  return (
    <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-2xl bg-white shadow-md flex-shrink-0 animate-[scale-in_0.3s_ease-out_forwards]">
      {isCorrect ? (
        <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      )}
    </div>
  );
};

const findReplacement = (category, vocabList) => {
  if (!vocabList || vocabList.length === 0) return null;
  
  const keywords = {
    drink: ['water', 'tea', 'coffee', 'juice', 'milk', 'beer', 'soda'],
    food: ['sushi', 'apple', 'bread', 'rice', 'fish', 'meat', 'fruit', 'sashimi', 'curry'],
    place: ['school', 'park', 'station', 'house', 'home', 'restaurant', 'hospital', 'store', 'shop', 'office']
  };
  
  const categoryKeywords = keywords[category] || [];
  
  for (const card of vocabList) {
    const eng = (card.english || '').toLowerCase();
    for (const kw of categoryKeywords) {
      if (eng.includes(kw)) {
        return {
          japanese: card.word || card.kanji || card.hiragana,
          english: card.english
        };
      }
    }
  }
  return null;
};

const loadLesson = (lesson, vocabList) => {
  let repl = { ...lesson.defaultReplacements };
  
  if (lesson.category) {
    const found = findReplacement(lesson.category, vocabList);
    if (found) {
      const key = `{${lesson.category.toUpperCase()}}`;
      repl[key] = { japanese: found.japanese, english: found.english };
    }
  }
  
  let english = lesson.englishTemplate;
  Object.keys(repl).forEach(key => {
    english = english.replace(key, repl[key].english);
  });
  
  const correctSequence = lesson.sequenceTemplate.map(token => {
    if (repl[token]) {
      return repl[token].japanese;
    }
    return token;
  });
  
  const shuffled = [...correctSequence].sort(() => 0.5 - Math.random());
  
  return {
    ...lesson,
    english,
    correctSequence,
    shuffled
  };
};

export default function GrammarDojo({ onGainXp, vocabList }) {
  // Configuration settings (Dojo Menu)
  const [deckLevel, setDeckLevel] = useState('N5'); // 'N5' or 'N4'
  const [sessionSize, setSessionSize] = useState(5);
  const [difficulty, setDifficulty] = useState('medium'); // 'easy', 'medium', 'hard'
  const [displayMode, setDisplayMode] = useState('kanji'); // 'kanji', 'kana', 'romaji'

  // Playing session state variables
  const [gameState, setGameState] = useState('setup'); // 'setup', 'study', 'playing', 'finished', 'failed'
  const [sessionLessons, setSessionLessons] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [shuffledCards, setShuffledCards] = useState([]);
  const [assembledSlots, setAssembledSlots] = useState([]);
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const [shake, setShake] = useState(false);
  const [totalXpEarned, setTotalXpEarned] = useState(0);
  const [hardRevealEnglish, setHardRevealEnglish] = useState(false);
  
  // Lives / Hearts (Survival Mode)
  const [hearts, setHearts] = useState(3);
  const [streak, setStreak] = useState(0);

  // Pop-out Modal for Study Rules
  const [activeModalLesson, setActiveModalLesson] = useState(null);

  // Mascot interactions
  const [mascotMood, setMascotMood] = useState('neutral');
  const [mascotSpeech, setMascotSpeech] = useState("Welcome to the Dojo! Select a training scroll below to test your grammar skills.");

  // Sync displayMode for Easy difficulty
  useEffect(() => {
    if (difficulty === 'easy') {
      setDisplayMode('romaji');
    } else {
      setDisplayMode('kanji');
    }
  }, [difficulty]);

  const playCorrectSound = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const now = ctx.currentTime;
      
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, now); // C5
      gain1.gain.setValueAtTime(0.06, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.3);
      
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(659.25, now + 0.08); // E5
      gain2.gain.setValueAtTime(0.06, now + 0.08);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.08);
      osc2.stop(now + 0.38);

      const osc3 = ctx.createOscillator();
      const gain3 = ctx.createGain();
      osc3.type = 'sine';
      osc3.frequency.setValueAtTime(783.99, now + 0.16); // G5
      gain3.gain.setValueAtTime(0.06, now + 0.16);
      gain3.gain.exponentialRampToValueAtTime(0.001, now + 0.46);
      osc3.connect(gain3);
      gain3.connect(ctx.destination);
      osc3.start(now + 0.16);
      osc3.stop(now + 0.46);
    } catch (e) {
      console.warn("Web Audio Context blocked/unsupported:", e);
    }
  };

  const playIncorrectSound = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const now = ctx.currentTime;
      
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(125.00, now); // Low note
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(129.00, now); // Detune buzz
      
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.4);
      
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      
      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.4);
      osc2.stop(now + 0.4);
    } catch (e) {
      console.warn("Web Audio Context blocked/unsupported:", e);
    }
  };

  const triggerStateChange = (changeCallback) => {
    changeCallback();
  };

  const startDojoSession = () => {
    triggerStateChange(() => {
      const rawDeck = deckLevel === 'N5' ? n5Lessons : n4Lessons;
      const shuffledLessons = [...rawDeck].sort(() => 0.5 - Math.random());
      const selected = shuffledLessons.slice(0, Math.min(sessionSize, shuffledLessons.length));
      const parsed = selected.map(lesson => loadLesson(lesson, vocabList));
      
      setSessionLessons(parsed);
      setCurrentLevel(0);
      setShuffledCards(parsed[0].shuffled);
      setAssembledSlots([]);
      setChecked(false);
      setIsCorrect(false);
      setShowTip(false);
      setTotalXpEarned(0);
      setHearts(3);
      setStreak(0);
      setHardRevealEnglish(false);
      setMascotMood('neutral');
      setMascotSpeech("Assemble the sentence blocks in their proper order!");
      setGameState('playing');
    });
  };

  const activeLesson = sessionLessons[currentLevel];

  const getWordMeta = (word) => {
    let meta = wordMetadata[word] || wordMetadata[word.replace(/\{.*\}/, '')];
    if (!meta && vocabList) {
      const cleanWord = word.replace(/\{.*\}/, '');
      const foundInVocab = vocabList.find(c => 
        (c.kanji === cleanWord || c.hiragana === cleanWord || c.romaji === cleanWord)
      );
      if (foundInVocab) {
        meta = {
          kana: foundInVocab.hiragana,
          romaji: foundInVocab.romaji || '',
          meaning: foundInVocab.english
        };
      }
    }
    return meta;
  };

  const getCardDisplay = (word) => {
    const meta = getWordMeta(word);
    if (!meta) return word;
    if (displayMode === 'kana') return meta.kana;
    if (displayMode === 'romaji') return meta.romaji;
    return word;
  };

  // Determine Noun, Verb, Particle, Helper classes dynamically
  const getWordClass = (word) => {
    const cleanWord = word.replace(/\{.*\}/, '');
    
    // Core Japanese Particles
    const particles = ['は', 'が', 'を', 'に', 'へ', 'で', 'も', 'から', 'まで', 'の', 'のに', 'ながら', 'ですが', 'ですから', 'たら', 'ば', 'と', 'なら', 'かも', 'しれません'];
    if (particles.includes(cleanWord)) return 'particle';
    
    // Core Copulas/Adjectives/Helping phrases
    const helpers = ['です', 'でした', 'ではありません', 'ください', '好き', '難しい', '面白い', 'いい', '安ければ', 'あの', '便利'];
    if (helpers.includes(cleanWord)) return 'helper';
    
    // Verb forms and stem indicators
    const verbEndings = ['ます', 'した', 'ません', 'んで', 'て', 'たい', 'た', 'る', 'く', 'か', 'う', 'おきます', 'しまいました', '咲きます', '買います', '行きます', '勉強します', '教えて', 'れました', '行く', '食べる', '飲む'];
    const hasVerbEnding = verbEndings.some(ending => cleanWord.endsWith(ending));
    if (hasVerbEnding && cleanWord !== '学生') return 'verb';
    
    // Default to Noun
    return 'noun';
  };

  const getCardClassStyles = (word) => {
    const wClass = getWordClass(word);
    
    // 3D push down style base
    const base = "relative px-4.5 py-3 text-sm font-extrabold rounded-2xl cursor-pointer active:translate-y-[4px] active:shadow-none transition-all duration-75 select-none border-t border-l border-r";
    
    if (wClass === 'noun') {
      // Blue tint
      return `${base} bg-blue-50/90 dark:bg-[#1a2c42]/90 border-[#4ba3f7]/50 text-blue-700 dark:text-blue-300 shadow-[0_4px_0_0_#2b5797] hover:bg-blue-100/50 hover:dark:bg-[#203752]`;
    }
    if (wClass === 'verb') {
      // Green tint
      return `${base} bg-emerald-50/90 dark:bg-[#153a26]/90 border-[#4ade80]/50 text-emerald-700 dark:text-emerald-300 shadow-[0_4px_0_0_#0f766e] hover:bg-emerald-100/50 hover:dark:bg-[#1b4830]`;
    }
    if (wClass === 'particle') {
      // Crimson / Rose tint
      return `${base} bg-rose-50/90 dark:bg-[#3f191b]/90 border-[#fda4af]/50 text-rose-700 dark:text-rose-300 shadow-[0_4px_0_0_#be123c] hover:bg-rose-100/50 hover:dark:bg-[#4d2023]`;
    }
    // Helper / Copulas / Adjectives (Amber/Gold tint)
    return `${base} bg-amber-50/90 dark:bg-[#3d2715]/90 border-[#fde047]/50 text-amber-800 dark:text-amber-300 shadow-[0_4px_0_0_#b45309] hover:bg-amber-100/50 hover:dark:bg-[#4c311a]`;
  };

  const handleCardClick = (card, source) => {
    if (checked) return;
    setShowTip(false);

    if (source === 'shuffled') {
      setAssembledSlots([...assembledSlots, card]);
      const idx = shuffledCards.indexOf(card);
      if (idx !== -1) {
        const nextShuffled = [...shuffledCards];
        nextShuffled.splice(idx, 1);
        setShuffledCards(nextShuffled);
      }
    } else {
      setShuffledCards([...shuffledCards, card]);
      const idx = assembledSlots.indexOf(card);
      if (idx !== -1) {
        const nextSlots = [...assembledSlots];
        nextSlots.splice(idx, 1);
        setAssembledSlots(nextSlots);
      }
    }
  };

  const handleCheck = () => {
    const isMatched = JSON.stringify(assembledSlots) === JSON.stringify(activeLesson.correctSequence);
    setChecked(true);
    setIsCorrect(isMatched);

    if (isMatched) {
      playCorrectSound();
      setStreak(prev => prev + 1);
      setMascotMood('happy');
      setMascotSpeech("Masterful precision! You mapped the sentence structures perfectly.");
      
      let xp = 1;
      if (difficulty === 'medium') xp = 2;
      if (difficulty === 'hard') xp = 3;
      setTotalXpEarned(prev => prev + xp * 10);
      onGainXp(xp);
    } else {
      playIncorrectSound();
      setMascotMood('sad');
      setMascotSpeech("Incorrect! Your sequence doesn't follow the grammar rules.");
      setShake(true);
      setStreak(0);
      setTimeout(() => setShake(false), 500);

      // Heart reduction (survival mechanics)
      setHearts(prev => {
        const nextHearts = prev - 1;
        if (nextHearts <= 0) {
          setTimeout(() => {
            setGameState('failed');
            setMascotMood('sad');
            setMascotSpeech("Dojo defeat! Your shields broke. Let us recover and try the quest again.");
          }, 1200);
        }
        return nextHearts;
      });
    }
  };

  const handleNext = () => {
    triggerStateChange(() => {
      setChecked(false);
      setIsCorrect(false);
      setAssembledSlots([]);
      setHardRevealEnglish(false);
      setMascotMood('neutral');
      setMascotSpeech("Keep it up! Translate the new prompt using the cards below.");

      if (currentLevel < sessionLessons.length - 1) {
        const nextLevel = currentLevel + 1;
        setCurrentLevel(nextLevel);
        setShuffledCards(sessionLessons[nextLevel].shuffled);
      } else {
        setMascotMood('happy');
        setMascotSpeech("Sensational! You completed the challenge deck! All scrolls have been conquered.");
        setGameState('finished');
      }
    });
  };

  const handleExit = () => {
    triggerStateChange(() => {
      setMascotMood('neutral');
      setMascotSpeech("Welcome to the Dojo! Select a training scroll below to test your grammar skills.");
      setActiveModalLesson(null);
      setGameState('setup');
    });
  };

  // 1. SETUP GAME SCREEN RENDER HELPER (Modern Deck Selection)
  const renderSetupScreen = () => {
    return (
      <div className="w-full max-w-3xl flex flex-col items-center gap-8 animate-fade-in z-10 text-claude-text px-4 md:px-6">
        
        {/* Title and Mascot layout */}
        <div className="flex flex-col md:flex-row items-center gap-6 justify-center text-center md:text-left max-w-2xl w-full">
          <MascotSensei mood={mascotMood} />
          <div className="relative bg-claude-card border border-claude-border p-5 rounded-2xl shadow-lg max-w-md w-full">
            <span className="text-[10px] font-black uppercase text-claude-coral tracking-widest block mb-0.5">文章道場 / Dojo Master</span>
            <p className="text-xs font-semibold leading-relaxed text-claude-text-muted">
              "{mascotSpeech}"
            </p>
            {/* Speech bubble pointer */}
            <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-4 h-4 bg-claude-card border-l border-b border-claude-border rotate-45 hidden md:block" />
          </div>
        </div>

        <hr className="w-full max-w-2xl border-claude-border/50" />

        {/* Quest selection cards */}
        <div className="w-full space-y-3 max-w-2xl">
          <label className="text-[10px] font-black uppercase tracking-widest text-claude-text-muted block text-center md:text-left">
            🏮 Select Training Level
          </label>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
            {/* N5 Card */}
            <button
              onClick={() => setDeckLevel('N5')}
              className={`flex flex-col relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 text-left w-full max-w-sm mx-auto border-2 ${
                deckLevel === 'N5'
                  ? 'border-emerald-500 bg-emerald-500/5 dark:bg-emerald-500/10 shadow-lg -translate-y-1'
                  : 'border-claude-border bg-claude-card hover:border-claude-coral/45 hover:-translate-y-0.5'
              }`}
            >
              <div className="p-6 flex flex-col justify-between h-full min-h-[190px] w-full">
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center w-full">
                    <span className="text-[9px] font-black tracking-widest uppercase text-emerald-600 dark:text-emerald-400 font-mono">LEVEL 01</span>
                    <span className="text-lg">🍙</span>
                  </div>
                  <h3 className="text-xl font-bold text-claude-text">
                    JLPT N5 Codex
                  </h3>
                  <p className="text-xs text-claude-text-muted leading-relaxed font-medium">
                    Perfect for beginners. Covers basic particle markers (は, を, に, も) and standard existence patterns.
                  </p>
                </div>
                
                <div className="pt-3 border-t border-claude-border/60 flex justify-between items-center mt-4">
                  <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">
                    60 Concepts
                  </span>
                  {deckLevel === 'N5' && (
                    <span className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[10px] font-bold">✓</span>
                  )}
                </div>
              </div>
            </button>

            {/* N4 Card */}
            <button
              onClick={() => setDeckLevel('N4')}
              className={`flex flex-col relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 text-left w-full max-w-sm mx-auto border-2 ${
                deckLevel === 'N4'
                  ? 'border-indigo-500 bg-indigo-500/5 dark:bg-indigo-500/10 shadow-lg -translate-y-1'
                  : 'border-claude-border bg-claude-card hover:border-claude-coral/45 hover:-translate-y-0.5'
              }`}
            >
              <div className="p-6 flex flex-col justify-between h-full min-h-[190px] w-full">
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center w-full">
                    <span className="text-[9px] font-black tracking-widest uppercase text-indigo-600 dark:text-indigo-400 font-mono">LEVEL 02</span>
                    <span className="text-lg">🌊</span>
                  </div>
                  <h3 className="text-xl font-bold text-claude-text">
                    JLPT N4 Exam Codex
                  </h3>
                  <p className="text-xs text-claude-text-muted leading-relaxed font-medium">
                    Core grammar formulas tested in past exams. Focuses on conditional forms (たら, ば, と, なら) and causative constructs.
                  </p>
                </div>
                
                <div className="pt-3 border-t border-claude-border/60 flex justify-between items-center mt-4">
                  <span className="text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-wider">
                    60 Concepts
                  </span>
                  {deckLevel === 'N4' && (
                    <span className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center text-white text-[10px] font-bold">✓</span>
                  )}
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Configuration settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
          {/* Deck challenge size */}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-claude-text-muted block pl-1">
              ⚡ Challenge Length
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[5, 10, 30, 60].map(size => (
                <button
                  key={size}
                  onClick={() => setSessionSize(size)}
                  className={`py-3 rounded-2xl border-2 font-extrabold text-xs cursor-pointer active:translate-y-[2px] transition-all ${
                    sessionSize === size
                      ? 'bg-claude-coral border-transparent text-white shadow-md'
                      : 'bg-claude-card border-claude-border text-claude-text-muted hover:text-claude-text'
                  }`}
                >
                  {size} Qs
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty mode */}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-claude-text-muted block pl-1">
              ⚔️ Difficulty Mode
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setDifficulty('easy')}
                className={`py-3 rounded-2xl border-2 font-extrabold text-[10px] uppercase tracking-wider cursor-pointer active:translate-y-[2px] transition-all ${
                  difficulty === 'easy'
                    ? 'bg-emerald-600 border-transparent text-white shadow-md'
                    : 'bg-claude-card border-claude-border text-claude-text-muted hover:text-emerald-500'
                }`}
              >
                🟢 Easy
              </button>
              <button
                onClick={() => setDifficulty('medium')}
                className={`py-3 rounded-2xl border-2 font-extrabold text-[10px] uppercase tracking-wider cursor-pointer active:translate-y-[2px] transition-all ${
                  difficulty === 'medium'
                    ? 'bg-amber-500 border-transparent text-[#191919] shadow-md'
                    : 'bg-claude-card border-claude-border text-claude-text-muted hover:text-amber-500'
                }`}
              >
                🟡 Medium
              </button>
              <button
                onClick={() => setDifficulty('hard')}
                className={`py-3 rounded-2xl border-2 font-extrabold text-[10px] uppercase tracking-wider cursor-pointer active:translate-y-[2px] transition-all ${
                  difficulty === 'hard'
                    ? 'bg-red-600 border-transparent text-white shadow-md'
                    : 'bg-claude-card border-claude-border text-claude-text-muted hover:text-red-500'
                }`}
              >
                🔴 Hard
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic primary buttons */}
        <div className="flex flex-col sm:flex-row gap-3.5 w-full max-w-2xl mt-4">
          <button
            onClick={() => setGameState('study')}
            className="flex-1 py-4 bg-claude-sidebar hover:bg-claude-card border border-claude-border text-claude-text font-bold text-xs uppercase tracking-widest rounded-2xl cursor-pointer active:translate-y-[2px] transition-all text-center"
          >
            Study Scroll Rules 📜
          </button>
          
          <button
            onClick={startDojoSession}
            className="flex-1 py-4 bg-claude-coral hover:bg-claude-coral/95 text-white font-bold text-xs uppercase tracking-widest rounded-2xl shadow-md cursor-pointer transition-all active:translate-y-[2px]"
          >
            Enter Sentence Dojo ⚔️
          </button>
        </div>
      </div>
    );
  };

  // 5. INTERACTIVE STUDY RULES SCREEN (Browsing scrolls)
  const renderStudyScreen = () => {
    const rawDeck = deckLevel === 'N5' ? n5Lessons : n4Lessons;
    
    return (
      <div className="w-full max-w-4xl flex flex-col gap-6 animate-fade-in z-10 text-claude-text px-4 md:px-8">
        
        {/* Header navigation */}
        <div className="w-full flex items-center justify-between border-b border-claude-border pb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📜</span>
            <div>
              <h2 className="text-xl font-black text-claude-coral uppercase tracking-wide font-sans">
                {deckLevel} Grammar Rules
              </h2>
              <p className="text-[10px] text-claude-text-muted font-bold">
                Reviewing all {rawDeck.length} grammar principles for JLPT {deckLevel}
              </p>
            </div>
          </div>
          
          <button
            onClick={handleExit}
            className="px-5 py-2.5 bg-claude-sidebar hover:bg-claude-card border border-claude-border text-claude-text font-black text-xs rounded-xl cursor-pointer active:translate-y-[2px] transition-all"
          >
            ← Exit Study
          </button>
        </div>

        {/* Mascot Advice */}
        <div className="bg-claude-card border border-claude-border p-4.5 rounded-2xl shadow-md flex items-center gap-4.5 max-w-2xl mx-auto w-full">
          <MascotSensei mood="neutral" />
          <div>
            <span className="text-[9px] font-black uppercase text-claude-coral tracking-widest block mb-0.5">Sensei Tip</span>
            <p className="text-xs font-semibold leading-relaxed text-claude-text-muted">
              "Review these grammar formulas and example sentences before starting the challenge to prepare your mind!"
            </p>
          </div>
        </div>

        {/* Scrollable list of rules */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
          {rawDeck.map((lesson, idx) => {
            const sampleReplacement = loadLesson(lesson, vocabList);
            const japaneseExample = sampleReplacement.correctSequence.join('');
            
            return (
              <div 
                key={lesson.id} 
                onClick={() => setActiveModalLesson({ lesson, idx, japaneseExample })}
                className="bg-claude-card border border-claude-border p-5 rounded-2xl transition-all duration-300 flex flex-col justify-between hover:scale-[1.02] hover:shadow-md cursor-pointer hover:bg-claude-sidebar/35"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black text-claude-coral uppercase tracking-widest">
                      Principle {idx + 1}
                    </span>
                    <span className="px-2 py-0.5 bg-claude-coral/10 text-claude-coral border border-claude-coral/20 rounded-lg text-[9px] font-black font-mono">
                      {deckLevel}
                    </span>
                  </div>
                  
                  <h4 className="text-base font-extrabold text-claude-text">
                    {lesson.title}
                  </h4>
                  
                  <div className="text-[10px] font-bold text-amber-700 dark:text-amber-500 bg-amber-500/5 px-2.5 py-1.5 rounded-lg border border-amber-500/10 font-mono">
                    Formula: {lesson.pattern}
                  </div>
                  
                  <p className="text-xs font-semibold leading-relaxed text-claude-text-muted">
                    {lesson.concept}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-claude-border/50 space-y-1">
                  <span className="text-[8px] font-black text-claude-text-muted uppercase tracking-widest block pl-0.5">Example Sentence:</span>
                  <div className="bg-claude-bg p-2.5 rounded-xl border border-claude-border/40 space-y-0.5">
                    <div className="text-xs font-black text-claude-text">
                      {japaneseExample}
                    </div>
                    <div className="text-[9px] text-claude-text-muted font-medium leading-relaxed italic">
                      "{sampleReplacement.english}"
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pop-out Modal for Rule Detail */}
        {activeModalLesson && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-fade-in">
            {/* Backdrop click to close */}
            <div className="absolute inset-0 cursor-pointer" onClick={() => setActiveModalLesson(null)} />
            
            {/* Modal Content Card */}
            <div className="bg-claude-card border border-claude-border rounded-3xl p-8 max-w-xl w-full shadow-2xl relative z-10 flex flex-col gap-6 animate-[scale-in_0.25s_ease-out_forwards] select-none text-left">
              <button 
                onClick={() => setActiveModalLesson(null)}
                className="absolute top-5 right-5 text-claude-text-muted hover:text-claude-text-heading text-lg font-bold p-1 cursor-pointer transition-colors"
              >
                ✕
              </button>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-claude-coral uppercase tracking-widest">
                    Principle {activeModalLesson.idx + 1}
                  </span>
                  <span className="px-3 py-1 bg-claude-coral/10 text-claude-coral border border-claude-coral/20 rounded-lg text-xs font-black font-mono">
                    {deckLevel}
                  </span>
                </div>
                
                <h3 className="text-2xl font-black text-claude-text leading-tight">
                  {activeModalLesson.lesson.title}
                </h3>
                
                <div className="text-xs font-bold text-amber-700 dark:text-amber-500 bg-amber-500/5 px-4 py-2.5 rounded-xl border border-amber-500/15 font-mono">
                  Formula: {activeModalLesson.lesson.pattern}
                </div>
                
                <p className="text-sm font-semibold leading-relaxed text-claude-text-muted pt-2 border-t border-claude-border/50">
                  {activeModalLesson.lesson.concept}
                </p>
              </div>

              <div className="space-y-2.5 pt-2">
                <span className="text-[10px] font-black text-claude-text-muted uppercase tracking-widest block pl-0.5">Example Sentence:</span>
                <div className="bg-claude-bg p-4.5 rounded-2xl border border-claude-border/50 space-y-1.5 shadow-inner">
                  <div className="text-lg font-black text-claude-text leading-tight">
                    {activeModalLesson.japaneseExample}
                  </div>
                  <div className="text-xs text-claude-text-muted font-medium leading-relaxed italic">
                    "{activeModalLesson.lesson.english}"
                  </div>
                </div>
              </div>

              {activeModalLesson.lesson.tip && (
                <div className="bg-amber-500/5 border border-amber-500/15 text-amber-600 dark:text-amber-500 p-4 rounded-2xl text-xs font-bold leading-normal">
                  💡 <strong>Grammar Tip:</strong> {activeModalLesson.lesson.tip}
                </div>
              )}

              <button
                onClick={() => setActiveModalLesson(null)}
                className="w-full py-4 bg-claude-coral hover:bg-claude-coral/95 text-white font-extrabold text-xs uppercase tracking-widest rounded-2xl shadow-[0_4px_0_0_#9f4124] active:translate-y-[4px] active:shadow-none border border-[#e06847]/30 transition-all cursor-pointer text-center mt-2"
              >
                I Understand! 👍
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // 2. FINISHED STATE SCREEN
  const renderFinishedScreen = () => {
    return (
      <div className="w-full max-w-xl text-center space-y-6 animate-fade-in z-10 text-claude-text px-4">
        <div className="text-6xl animate-bounce">🏆</div>
        <h2 className="text-3xl font-black tracking-wide text-claude-coral font-sans">Quest Completed!</h2>
        
        {/* Mascot Tanuki celebrates */}
        <div className="flex justify-center py-2">
          <MascotSensei mood="happy" />
        </div>

        <p className="text-xs text-claude-text-muted max-w-sm mx-auto leading-relaxed font-semibold">
          "{mascotSpeech}"
        </p>

        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5 text-base font-black text-emerald-600 dark:text-emerald-400 max-w-xs mx-auto shadow-sm">
          🔥 Score: +{totalXpEarned} XP!
        </div>

        <div className="flex gap-4 justify-center pt-2">
          <button
            onClick={startDojoSession}
            className="px-6 py-3.5 bg-claude-sidebar hover:bg-claude-card border border-claude-border text-claude-text font-extrabold text-xs rounded-2xl cursor-pointer active:translate-y-[2px] transition-all shadow-sm"
          >
            Re-run Quest
          </button>
          <button
            onClick={handleExit}
            className="px-7 py-3.5 bg-claude-coral hover:bg-claude-coral/90 text-white font-extrabold text-xs rounded-2xl shadow-[0_4px_0_0_#9f4124] active:translate-y-[4px] active:shadow-none cursor-pointer transition-all"
          >
            Exit to Dashboard
          </button>
        </div>
      </div>
    );
  };

  // 3. DEFEAT / FAILED SCREEN
  const renderFailedScreen = () => {
    return (
      <div className="w-full max-w-xl text-center space-y-6 animate-fade-in z-10 text-claude-text px-4">
        <div className="text-6xl animate-pulse">💀</div>
        <h2 className="text-3xl font-black tracking-wide text-red-600 dark:text-red-500 font-sans">Defeat!</h2>
        
        {/* Mascot Tanuki sweats / cries */}
        <div className="flex justify-center py-2">
          <MascotSensei mood="sad" />
        </div>

        <p className="text-xs text-claude-text-muted max-w-sm mx-auto leading-relaxed font-semibold">
          "{mascotSpeech}"
        </p>

        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5 text-sm font-black text-red-600 dark:text-red-400 max-w-xs mx-auto shadow-sm">
          Your protective shields broke completely during the training sequence.
        </div>

        <div className="flex gap-4 justify-center pt-2">
          <button
            onClick={startDojoSession}
            className="px-8 py-3.5 bg-claude-coral hover:bg-claude-coral/90 text-white font-extrabold text-xs rounded-2xl shadow-[0_4px_0_0_#9f4124] active:translate-y-[4px] active:shadow-none cursor-pointer transition-all"
          >
            Restart Quest ⚔️
          </button>
          <button
            onClick={handleExit}
            className="px-6 py-3.5 bg-claude-sidebar hover:bg-claude-card border border-claude-border text-claude-text font-extrabold text-xs rounded-2xl cursor-pointer active:translate-y-[2px] transition-all shadow-sm"
          >
            Leave Dojo
          </button>
        </div>
      </div>
    );
  };

  // 4. ACTIVE GAMEPLAY ARENA SCREEN
  const renderPlayingScreen = () => {
    return (
      <div className={`w-full max-w-4xl flex flex-col gap-6 animate-fade-in relative z-10 select-none text-claude-text px-4 md:px-8 pb-32 ${shake ? 'animate-shake' : ''}`}>
        
        {/* Arena status header (Lives, Combo streak, progress bar) */}
        <div className="w-full flex items-center justify-between gap-4 py-2 z-10 border-b border-claude-border pb-4">
          <button
            onClick={handleExit}
            className="text-xs font-black text-claude-coral hover:text-red-500 cursor-pointer flex items-center gap-1 transition-colors"
          >
            ← Exit Dojo
          </button>
          
          {/* Progress bar and combo streak */}
          <div className="flex-1 flex items-center gap-3">
            <div className="flex-1 bg-claude-sidebar h-3.5 rounded-full overflow-hidden border border-claude-border relative shadow-inner">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${(currentLevel / sessionLessons.length) * 100}%` }}
              />
            </div>
            {streak >= 2 && (
              <div className="flex items-center gap-1 bg-amber-500/15 border border-amber-500/35 px-2.5 py-0.5 rounded-full animate-bounce">
                <span className="text-[10px] animate-pulse">🔥</span>
                <span className="text-[9px] font-black text-amber-600 dark:text-amber-500 uppercase tracking-wider font-mono">
                  {streak}x Combo!
                </span>
              </div>
            )}
          </div>

          {/* Survival Hearts tracker */}
          <div className="flex items-center gap-1 pl-2">
            {[1, 2, 3].map(h => (
              <span 
                key={h} 
                className={`text-base transition-all duration-300 ${
                  h <= hearts 
                    ? 'text-red-500 scale-100 filter drop-shadow-[0_0_4px_#ef4444]' 
                    : 'text-slate-300 dark:text-slate-700 scale-90 opacity-40'
                }`}
              >
                ❤️
              </span>
            ))}
          </div>
        </div>

        {/* Translation Speech Bubble */}
        <div className="w-full flex flex-col md:flex-row items-center gap-4 justify-center py-2 z-10">
          <MascotSensei mood={mascotMood} />
          
          <div className="relative bg-claude-card border border-claude-border p-4.5 rounded-2xl shadow-lg max-w-xl w-full">
            <span className="text-[9px] font-black uppercase text-claude-coral tracking-widest block mb-0.5">Translate the Sentence</span>
            
            {difficulty === 'hard' && !hardRevealEnglish ? (
              <div className="space-y-2 py-1">
                <div className="text-[10px] font-black text-amber-700 dark:text-amber-500 bg-amber-500/5 px-3 py-1.5 rounded-lg border border-amber-500/20 max-w-sm leading-normal">
                  🕵️ Prompt Hidden! Build using the definitions of the available words.
                </div>
                <button
                  onClick={() => setHardRevealEnglish(true)}
                  className="text-[9px] font-black text-claude-coral bg-claude-coral/5 hover:bg-claude-coral/10 border border-claude-coral/20 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                >
                  Reveal English Prompt (-5 XP penalty)
                </button>
              </div>
            ) : (
              <h3 className="text-lg md:text-xl font-extrabold text-claude-text italic leading-tight">
                "{activeLesson.english}"
              </h3>
            )}
            
            {/* Speech bubble pointer */}
            <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-4 h-4 bg-claude-card border-l border-b border-claude-border rotate-45 hidden md:block" />
          </div>
        </div>

        {/* Assembled sentence Arena */}
        <div 
          className="w-full min-h-28 border-2 border-dashed border-claude-border rounded-2xl p-5 flex flex-wrap gap-3.5 items-center justify-center bg-claude-sidebar/50 backdrop-blur-md shadow-inner z-10 animate-fade-in"
        >
          {assembledSlots.length > 0 ? (
            assembledSlots.map((card, idx) => {
              const meta = getWordMeta(card);
              return (
                <button
                  key={idx}
                  onClick={() => handleCardClick(card, 'assembled')}
                  className={getCardClassStyles(card)}
                >
                  {difficulty === 'easy' && meta && (
                    <span className="text-[8px] font-black text-amber-600 dark:text-amber-500 tracking-wide uppercase -mt-0.5 select-none font-mono block">
                      {meta.romaji}
                    </span>
                  )}
                  <span>{getCardDisplay(card)}</span>
                </button>
              );
            })
          ) : (
            <span className="text-xs font-extrabold text-claude-text-muted italic select-none">
              Select cards from the pool below to assemble the sentence...
            </span>
          )}
        </div>

        {/* Shuffled Word Pool with Spelling selectors */}
        <div className="w-full flex flex-col gap-3 py-2 z-10">
          <div className="flex justify-between items-baseline px-1 flex-wrap gap-2">
            <span className="text-[9px] font-black uppercase text-claude-text-muted tracking-widest block">Available Cards</span>
            
            {/* Display modes (except Easy, which locks into Guides) */}
            {difficulty !== 'easy' && (
              <div className="flex items-center gap-1 bg-claude-sidebar border border-claude-border p-1 rounded-xl shadow-inner">
                {['kanji', 'kana', 'romaji'].map(mode => (
                  <button
                    key={mode}
                    onClick={() => setDisplayMode(mode)}
                    className={`px-3 py-1 text-[8px] font-black uppercase rounded-lg transition-all cursor-pointer ${
                      displayMode === mode
                        ? 'bg-claude-coral text-white shadow-xs'
                        : 'text-claude-text-muted hover:text-claude-text'
                    }`}
                  >
                    {mode === 'kanji' ? '漢字' : mode === 'kana' ? 'かな' : 'Roma'}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Blocks container */}
          <div className="flex flex-wrap gap-3 justify-center min-h-[56px]">
            {shuffledCards.map((card, idx) => {
              const meta = getWordMeta(card);
              const dictMean = meta ? meta.meaning || card : card;
              
              return (
                <button
                  key={idx}
                  onClick={() => handleCardClick(card, 'shuffled')}
                  className={getCardClassStyles(card)}
                  title={difficulty === 'hard' ? `Definition: ${dictMean}` : undefined}
                >
                  {difficulty === 'hard' && (
                    <div className="absolute bottom-full mb-2.5 hidden group-hover:block bg-claude-card border border-claude-border text-claude-text-muted text-[8px] font-extrabold px-2 py-1 rounded shadow-lg whitespace-nowrap z-50">
                      {dictMean}
                    </div>
                  )}

                  {difficulty === 'easy' && meta && (
                    <span className="text-[8px] font-black text-amber-600 dark:text-amber-500 tracking-wide uppercase -mt-0.5 select-none font-mono block">
                      {meta.romaji}
                    </span>
                  )}
                  <span>{getCardDisplay(card)}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Verify buttons */}
        {!checked && (
          <div className="w-full flex gap-3 pt-4 z-10">
            <button
              onClick={() => setShowTip(!showTip)}
              className="px-5 py-3.5 bg-claude-sidebar hover:bg-claude-card border border-claude-border text-claude-text-muted hover:text-claude-text font-extrabold text-xs rounded-xl cursor-pointer active:translate-y-[2px] transition-colors"
            >
              {showTip ? 'Hide Hint 👁️' : 'Show Hint 💡'}
            </button>
            <button
              onClick={handleCheck}
              disabled={assembledSlots.length === 0}
              className={`flex-1 py-4 bg-claude-coral hover:bg-claude-coral/95 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-[0_4px_0_0_#9f4124] active:translate-y-[4px] active:shadow-none border border-[#e06847]/30 cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
                assembledSlots.length === 0 ? 'opacity-50 cursor-not-allowed active:translate-y-0 active:shadow-[0_4px_0_0_#9f4124]' : ''
              }`}
            >
              Verify Sequence 🔍
            </button>
          </div>
        )}

        {/* Dynamic slide drawer */}
        {checked && (
          <div className={`fixed bottom-0 left-0 right-0 p-6 z-40 flex flex-col md:flex-row md:items-center justify-between gap-6 border-t-2 shadow-2xl animate-[slide-up_0.25s_ease-out_forwards] ${
            isCorrect 
              ? 'bg-[#e8f7ed] dark:bg-[#112a18] border-emerald-500/35 text-emerald-800 dark:text-emerald-300' 
              : 'bg-[#fdf0f1] dark:bg-[#341718] border-red-500/35 text-red-800 dark:text-red-300'
          }`}>
            <div className="max-w-4xl mx-auto w-full flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start md:items-center gap-4 flex-1">
                <FeedbackIcon isCorrect={isCorrect} />
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-sm md:text-base uppercase tracking-wider">
                      {isCorrect ? 'Correct Sequence!' : 'Sequence Broken'}
                    </h4>
                  </div>
                  
                  {isCorrect ? (
                    <div className="space-y-2 w-full">
                      <p className="text-xs font-semibold leading-normal opacity-90">
                        Your block ordering aligns perfectly with native syntax. +{difficulty === 'easy' ? '10' : difficulty === 'medium' ? '20' : '30'} XP awarded.
                      </p>
                      
                      {activeLesson.pattern && (
                        <div className="text-[11px] font-black text-claude-text-muted font-mono w-full">
                          <span className="uppercase text-[9px] tracking-wider block mb-1">Visual Grammar Flowchart Map:</span>
                          
                          {/* Flowchart Formula Nodes */}
                          <div className="flex flex-wrap items-center gap-2 mt-2 bg-white/35 dark:bg-black/25 p-3 rounded-2xl border border-emerald-500/20 max-w-full overflow-x-auto">
                            {activeLesson.pattern.split('+').map((part, idx, arr) => {
                              const cleanPart = part.trim();
                              let bgClass = "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700";
                              if (cleanPart.toLowerCase().includes('noun') || cleanPart.toLowerCase().includes('名詞')) {
                                bgClass = "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/40";
                              } else if (cleanPart.toLowerCase().includes('verb') || cleanPart.toLowerCase().includes('動詞')) {
                                bgClass = "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/40";
                              } else if (cleanPart.toLowerCase().includes('(particle)') || cleanPart.includes('wa') || cleanPart.includes('o') || cleanPart.includes('ni') || cleanPart.includes('ga') || cleanPart.includes('mo')) {
                                bgClass = "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/40";
                              } else if (cleanPart.toLowerCase().includes('desu') || cleanPart.toLowerCase().includes('helper') || cleanPart.toLowerCase().includes('masu') || cleanPart.toLowerCase().includes('stem')) {
                                bgClass = "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/40";
                              }
                              
                              return (
                                <div key={idx} className="flex items-center gap-2">
                                  <span className={`px-2.5 py-1 text-[10px] font-black tracking-wide rounded-lg border uppercase ${bgClass}`}>
                                    {cleanPart}
                                  </span>
                                  {idx < arr.length - 1 && (
                                    <span className="text-emerald-500/50 dark:text-emerald-400/40 text-xs font-black select-none">
                                      ➔
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {activeLesson.meaning && (
                        <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 pl-1">
                          💡 <strong>This rule means</strong> {activeLesson.meaning}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="pl-1">
                      <p className="text-xs font-semibold leading-normal opacity-90">
                        {activeLesson.tip}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={handleNext}
                className="py-3.5 px-8 bg-claude-coral hover:bg-claude-coral/95 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-[0_4px_0_0_#9f4124] active:translate-y-[4px] active:shadow-none border border-[#e06847]/30 cursor-pointer transition-all self-stretch md:self-auto flex items-center justify-center gap-1.5"
              >
                {currentLevel < sessionLessons.length - 1 ? 'Next Question ➡️' : 'Complete Quest 🏆'}
              </button>
            </div>
          </div>
        )}

        {/* In-game live hint box */}
        {showTip && !checked && (
          <div className="bg-amber-500/5 border border-amber-500/25 text-amber-600 dark:text-amber-500 p-3.5 rounded-xl text-[11px] font-bold leading-normal animate-fade-in">
            💡 <strong>Grammar Tip:</strong> {activeLesson.tip}
          </div>
        )}

      </div>
    );
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-claude-bg text-claude-text p-4 sm:p-6 md:p-8 relative transition-all duration-300 font-sans">
      {/* Global CSS Styles Injection */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
        
        .font-sans {
          font-family: 'Outfit', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--color-claude-border, rgba(0, 0, 0, 0.15));
          border-radius: 9px;
        }

        @keyframes slide-up {
          0% { transform: translateY(100%); }
          100% { transform: translateY(0); }
        }
        @keyframes scale-in {
          0% { transform: scale(0.9); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-8px); }
          40%, 80% { transform: translateX(8px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}} />

      {/* Screen Router Content */}
      <div className="w-full max-w-4xl flex justify-center items-center z-10 py-4">
        {gameState === 'setup' && renderSetupScreen()}
        {gameState === 'study' && renderStudyScreen()}
        {gameState === 'playing' && renderPlayingScreen()}
        {gameState === 'finished' && renderFinishedScreen()}
        {gameState === 'failed' && renderFailedScreen()}
      </div>
    </div>
  );
}
