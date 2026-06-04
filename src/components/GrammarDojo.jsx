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
      <svg viewBox="0 0 120 120" className="w-16 h-16 md:w-20 md:h-20 transition-all duration-300 transform hover:scale-110 drop-shadow-lg">
        {/* Ears */}
        <path d="M25 45 L15 15 L45 30 Z" fill="#654321" stroke="#321e08" strokeWidth="3.5" />
        <path d="M28 42 L20 22 L40 33 Z" fill="#bca175" />
        <path d="M95 45 L105 15 L75 30 Z" fill="#654321" stroke="#321e08" strokeWidth="3.5" />
        <path d="M92 42 L100 22 L80 33 Z" fill="#bca175" />
        
        {/* Tail */}
        <path d="M85 75 Q115 65 105 90 Q90 100 80 85 Z" fill="#4a3014" stroke="#321e08" strokeWidth="3.5" />
        <path d="M92 73 Q108 68 102 83 Q92 90 87 81 Z" fill="#654321" />

        {/* Body & Head */}
        <circle cx="60" cy="70" r="42" fill="#654321" stroke="#321e08" strokeWidth="3.5" />
        
        {/* Tanuki Belly Patch */}
        <ellipse cx="60" cy="85" rx="28" ry="20" fill="#f7f3e9" />

        {/* Face Mask Patch */}
        <path d="M30 65 Q60 50 90 65 Q95 78 80 82 Q60 72 40 82 Q25 78 30 65 Z" fill="#4a3014" />
        <ellipse cx="60" cy="68" rx="24" ry="16" fill="#f7f3e9" />

        {/* Dynamic Eyes */}
        {isHappy ? (
          <>
            <path d="M42 66 Q48 59 54 66" stroke="#321e08" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            <path d="M66 66 Q72 59 78 66" stroke="#321e08" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          </>
        ) : isSad ? (
          <>
            <path d="M42 64 L52 68" stroke="#321e08" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M68 68 L78 64" stroke="#321e08" strokeWidth="3.5" strokeLinecap="round" />
            {/* Tear drops */}
            <path d="M38 72 Q35 77 38 80 Q41 77 38 72" fill="#38bdf8" />
          </>
        ) : (
          <>
            <circle cx="48" cy="64" r="5" fill="#321e08" />
            <circle cx="46" cy="62" r="1.8" fill="white" />
            <circle cx="72" cy="64" r="5" fill="#321e08" />
            <circle cx="70" cy="62" r="1.8" fill="white" />
          </>
        )}

        {/* Nose */}
        <polygon points="57,71 63,71 60,75" fill="#321e08" />

        {/* Mouth */}
        {isHappy ? (
          <path d="M54 78 Q60 85 66 78" stroke="#321e08" strokeWidth="3.5" fill="#e16847" strokeLinecap="round" />
        ) : isSad ? (
          <path d="M55 81 Q60 76 65 81" stroke="#321e08" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        ) : (
          <path d="M55 79 Q60 82 65 79" stroke="#321e08" strokeWidth="2" fill="none" strokeLinecap="round" />
        )}

        {/* Headband (Hachimaki) */}
        <rect x="34" y="43" width="52" height="8" fill="#e16847" rx="2.5" />
        <circle cx="60" cy="47" r="2" fill="white" />
      </svg>
      {/* Decorative Pedestal shadow */}
      <div className="w-10 h-1.5 bg-black/20 dark:bg-black/45 rounded-full blur-xs mt-1" />
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
  
  // Shoji sliding door transition state
  const [shojiActive, setShojiActive] = useState(false);

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
    setShojiActive(true);
    setTimeout(() => {
      changeCallback();
    }, 450);
    setTimeout(() => {
      setShojiActive(false);
    }, 900);
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
      setMascotSpeech("The arena awaits. Assemble the sentence blocks in their proper order!");
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
      return `${base} bg-blue-50 dark:bg-[#1a2c42] border-[#4ba3f7]/50 text-blue-700 dark:text-blue-300 shadow-[0_4px_0_0_#2b5797] hover:bg-blue-100/50 hover:dark:bg-[#203752]`;
    }
    if (wClass === 'verb') {
      // Green tint
      return `${base} bg-emerald-50 dark:bg-[#153a26] border-[#4ade80]/50 text-emerald-700 dark:text-emerald-300 shadow-[0_4px_0_0_#0f766e] hover:bg-emerald-100/50 hover:dark:bg-[#1b4830]`;
    }
    if (wClass === 'particle') {
      // Crimson / Rose tint
      return `${base} bg-rose-50 dark:bg-[#3f191b] border-[#fda4af]/50 text-rose-700 dark:text-rose-300 shadow-[0_4px_0_0_#be123c] hover:bg-rose-100/50 hover:dark:bg-[#4d2023]`;
    }
    // Helper / Copulas / Adjectives (Amber/Gold tint)
    return `${base} bg-amber-50 dark:bg-[#3d2715] border-[#fde047]/50 text-amber-800 dark:text-amber-300 shadow-[0_4px_0_0_#b45309] hover:bg-amber-100/50 hover:dark:bg-[#4c311a]`;
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
      setMascotSpeech("Masterful precision! You mapped the sentence structures perfectly. Review the flowchart below.");
      
      let xp = 1;
      if (difficulty === 'medium') xp = 2;
      if (difficulty === 'hard') xp = 3;
      setTotalXpEarned(prev => prev + xp * 10);
      onGainXp(xp);
    } else {
      playIncorrectSound();
      setMascotMood('sad');
      setMascotSpeech("Incorrect! Your sequence doesn't follow the syntactic rule. Check the hint!");
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
      setGameState('setup');
    });
  };

  // 1. SETUP GAME SCREEN RENDER HELPER (Quest Scroll Selection)
  const renderSetupScreen = () => {
    return (
      <div className="w-full max-w-4xl flex flex-col items-center gap-8 animate-fade-in z-10 text-[#191919] dark:text-[#f2f0ea] px-4 md:px-8">
        
        {/* Title and Mascot layout */}
        <div className="flex flex-col md:flex-row items-center gap-6 justify-center text-center md:text-left max-w-2xl">
          <MascotSensei mood={mascotMood} />
          <div className="relative bg-white dark:bg-[#1a1a19]/90 border-2 border-[#bca175] dark:border-[#524430] p-4.5 rounded-2xl shadow-md max-w-md">
            <span className="text-[10px] font-black uppercase text-claude-coral tracking-widest block mb-0.5">文章道場 / Dojo Master</span>
            <p className="text-xs font-semibold leading-relaxed text-[#5c5b56] dark:text-[#92918b]">
              "{mascotSpeech}"
            </p>
            {/* Speech bubble pointer */}
            <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-4 h-4 bg-white dark:bg-[#1a1a19] border-l-2 border-b-2 border-[#bca175] dark:border-[#524430] rotate-45 hidden md:block" />
          </div>
        </div>

        <hr className="w-full max-w-2xl border-[#bca175]/30" />

        {/* Quest scrolls */}
        <div className="w-full space-y-3 max-w-2xl">
          <label className="text-[10px] font-black uppercase tracking-widest text-[#7c6c57] dark:text-[#a09483] block pl-1 text-center md:text-left">
            🏮 Select Training Level Scroll
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setDeckLevel('N5')}
              className={`p-6 rounded-3xl border-2 text-left cursor-pointer transition-all duration-300 flex flex-col gap-2 relative overflow-hidden group ${
                deckLevel === 'N5'
                  ? 'bg-gradient-to-br from-[#c8b6ff]/35 to-[#bca175]/25 border-claude-coral shadow-lg scale-[1.02] -translate-y-1'
                  : 'bg-[#eae4d8]/40 dark:bg-[#1a1a19]/50 border-[#bca175]/35 text-[#7c6c57] dark:text-[#92918b]'
              }`}
            >
              <div className="flex justify-between items-center w-full">
                <span className="text-xs font-black uppercase tracking-wider text-claude-coral">🍙 LEVEL 01</span>
                <span className="text-lg">🍙</span>
              </div>
              <h3 className="text-xl font-extrabold text-[#191919] dark:text-[#faf8f2]">JLPT N5 Scroll</h3>
              <p className="text-xs opacity-80 leading-relaxed font-semibold">
                Perfect for beginners. Covers basic particle markers (は, を, に, も) and standard existence patterns.
              </p>
              {/* Decorative design highlight */}
              <div className="absolute right-0 bottom-0 w-24 h-24 bg-claude-coral/5 rounded-full translate-x-8 translate-y-8 group-hover:scale-110 transition-transform duration-300" />
            </button>

            <button
              onClick={() => setDeckLevel('N4')}
              className={`p-6 rounded-3xl border-2 text-left cursor-pointer transition-all duration-300 flex flex-col gap-2 relative overflow-hidden group ${
                deckLevel === 'N4'
                  ? 'bg-gradient-to-br from-[#a5ffd6]/35 to-[#bca175]/25 border-claude-coral shadow-lg scale-[1.02] -translate-y-1'
                  : 'bg-[#eae4d8]/40 dark:bg-[#1a1a19]/50 border-[#bca175]/35 text-[#7c6c57] dark:text-[#92918b]'
              }`}
            >
              <div className="flex justify-between items-center w-full">
                <span className="text-xs font-black uppercase tracking-wider text-claude-coral">🌊 LEVEL 02</span>
                <span className="text-lg">🌊</span>
              </div>
              <h3 className="text-xl font-extrabold text-[#191919] dark:text-[#faf8f2]">JLPT N4 Exam Scroll</h3>
              <p className="text-xs opacity-80 leading-relaxed font-semibold">
                Core grammar formulas tested in past exams. Focuses on conditional forms (たら, ば, と, なら) and favors.
              </p>
              <div className="absolute right-0 bottom-0 w-24 h-24 bg-claude-coral/5 rounded-full translate-x-8 translate-y-8 group-hover:scale-110 transition-transform duration-300" />
            </button>
          </div>
        </div>

        {/* Configuration settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
          {/* Deck challenge size */}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#7c6c57] dark:text-[#a09483] block pl-1">
              ⚡ Challenge Length
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[5, 10, 30, 60].map(size => (
                <button
                  key={size}
                  onClick={() => setSessionSize(size)}
                  className={`py-3 rounded-2xl border-2 font-extrabold text-xs cursor-pointer active:translate-y-[2px] transition-all ${
                    sessionSize === size
                      ? 'bg-claude-coral text-white border-transparent shadow-[0_3px_0_0_#9f4124]'
                      : 'bg-[#eae4d8]/30 dark:bg-[#1a1a19]/30 border-[#bca175]/30 text-[#7c6c57] dark:text-[#92918b] shadow-[0_3px_0_0_#bca175]/20 hover:text-claude-text'
                  }`}
                >
                  {size} Qs
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty mode */}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#7c6c57] dark:text-[#a09483] block pl-1">
              ⚔️ Difficulty Mode
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setDifficulty('easy')}
                className={`py-3 rounded-2xl border-2 font-extrabold text-[10px] uppercase tracking-wider cursor-pointer active:translate-y-[2px] transition-all ${
                  difficulty === 'easy'
                    ? 'bg-emerald-600 border-transparent text-white shadow-[0_3px_0_0_#065f46]'
                    : 'bg-[#eae4d8]/30 dark:bg-[#1a1a19]/30 border-[#bca175]/30 text-[#7c6c57] dark:text-[#92918b] shadow-[0_3px_0_0_#bca175]/20 hover:text-emerald-500'
                }`}
              >
                🟢 Easy
              </button>
              <button
                onClick={() => setDifficulty('medium')}
                className={`py-3 rounded-2xl border-2 font-extrabold text-[10px] uppercase tracking-wider cursor-pointer active:translate-y-[2px] transition-all ${
                  difficulty === 'medium'
                    ? 'bg-amber-500 border-transparent text-[#191919] shadow-[0_3px_0_0_#92400e]'
                    : 'bg-[#eae4d8]/30 dark:bg-[#1a1a19]/30 border-[#bca175]/30 text-[#7c6c57] dark:text-[#92918b] shadow-[0_3px_0_0_#bca175]/20 hover:text-amber-500'
                }`}
              >
                🟡 Medium
              </button>
              <button
                onClick={() => setDifficulty('hard')}
                className={`py-3 rounded-2xl border-2 font-extrabold text-[10px] uppercase tracking-wider cursor-pointer active:translate-y-[2px] transition-all ${
                  difficulty === 'hard'
                    ? 'bg-red-600 border-transparent text-white shadow-[0_3px_0_0_#991b1b]'
                    : 'bg-[#eae4d8]/30 dark:bg-[#1a1a19]/30 border-[#bca175]/30 text-[#7c6c57] dark:text-[#92918b] shadow-[0_3px_0_0_#bca175]/20 hover:text-red-500'
                }`}
              >
                🔴 Hard
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic primary buttons - Study mode side-by-side with practice dojo */}
        <div className="flex flex-col sm:flex-row gap-3.5 w-full max-w-2xl mt-4">
          <button
            onClick={() => setGameState('study')}
            className="flex-1 py-4.5 bg-[#eae4d8]/60 dark:bg-claude-sidebar/60 hover:bg-[#eae4d8]/80 hover:dark:bg-claude-card border-2 border-[#bca175]/45 text-claude-text font-black text-sm uppercase tracking-widest rounded-2xl cursor-pointer active:translate-y-[2px] transition-all text-center"
          >
            Study Scroll Rules 📜
          </button>
          
          <button
            onClick={startDojoSession}
            className="flex-1 py-4.5 bg-claude-coral hover:bg-claude-coral/95 text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-[0_5px_0_0_#9f4124] hover:shadow-[0_4px_0_0_#9f4124] active:translate-y-[4px] active:shadow-none border border-[#e06847]/30 cursor-pointer transition-all text-center"
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
      <div className="w-full max-w-4xl flex flex-col gap-6 animate-fade-in z-10 text-[#191919] dark:text-[#f2f0ea] px-4 md:px-8">
        
        {/* Header navigation */}
        <div className="w-full flex items-center justify-between border-b border-[#bca175]/25 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📜</span>
            <div>
              <h2 className="text-xl font-black text-claude-coral uppercase tracking-wide">
                {deckLevel} Scroll Codex
              </h2>
              <p className="text-[10px] text-[#7c6c57] dark:text-[#92918b] font-bold">
                Reviewing all {rawDeck.length} grammar principles for JLPT {deckLevel}
              </p>
            </div>
          </div>
          
          <button
            onClick={handleExit}
            className="px-5 py-2.5 bg-[#eae4d8]/60 dark:bg-claude-sidebar/60 hover:bg-[#eae4d8]/80 hover:dark:bg-claude-card border-2 border-[#bca175]/45 text-claude-text font-black text-xs rounded-xl cursor-pointer active:translate-y-[2px] transition-all"
          >
            ⛩️ Exit Study
          </button>
        </div>

        {/* Mascot Advice */}
        <div className="bg-white dark:bg-[#1a1a19]/90 border-2 border-[#bca175] dark:border-[#524430] p-4.5 rounded-2xl shadow-sm flex items-center gap-4.5 max-w-2xl mx-auto w-full">
          <MascotSensei mood="neutral" />
          <div>
            <span className="text-[9px] font-black uppercase text-claude-coral tracking-widest block mb-0.5">Dojo Sensei / Advice</span>
            <p className="text-xs font-semibold leading-relaxed text-[#5c5b56] dark:text-[#92918b]">
              "A true warrior studies the principles before entering the arena. Examine each grammar scroll, its formula, and the example sentence to prepare your mind!"
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
                className="bg-[#eae4d8]/20 dark:bg-[#161618]/50 border-2 border-[#bca175]/25 hover:border-[#bca175]/60 p-5 rounded-3xl transition-all duration-300 flex flex-col justify-between hover:scale-[1.01] hover:shadow-md"
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
                  
                  <h4 className="text-base font-extrabold text-[#191919] dark:text-[#faf8f2]">
                    {lesson.title}
                  </h4>
                  
                  <div className="text-[10px] font-bold text-amber-700 dark:text-amber-500 bg-amber-500/5 px-2.5 py-1.5 rounded-lg border border-amber-500/10 font-mono">
                    Formula: {lesson.pattern}
                  </div>
                  
                  <p className="text-xs font-semibold leading-relaxed text-[#6b6a65] dark:text-[#92918b]">
                    {lesson.concept}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#bca175]/15 space-y-1">
                  <span className="text-[8px] font-black text-[#7c6c57] dark:text-[#92918b] uppercase tracking-widest block pl-0.5">Example Sentence:</span>
                  <div className="bg-[#fcfaf4]/80 dark:bg-[#0c0c0e]/80 p-2.5 rounded-xl border border-[#bca175]/15 space-y-0.5">
                    <div className="text-xs font-black text-[#191919] dark:text-[#f2f0ea]">
                      {japaneseExample}
                    </div>
                    <div className="text-[9px] text-[#6b6a65] dark:text-[#92918b] font-medium leading-relaxed italic">
                      "{sampleReplacement.english}"
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // 2. FINISHED STATE SCREEN
  const renderFinishedScreen = () => {
    return (
      <div className="w-full max-w-xl text-center space-y-6 animate-fade-in z-10 text-[#191919] dark:text-[#f2f0ea] px-4">
        <div className="text-6xl animate-bounce">🏆</div>
        <h2 className="text-3xl font-black tracking-wide text-claude-coral font-sans">Dojo Quest Completed!</h2>
        
        {/* Mascot Tanuki celebrates */}
        <div className="flex justify-center py-2">
          <MascotSensei mood="happy" />
        </div>

        <p className="text-xs text-[#6b6a65] dark:text-[#92918b] max-w-sm mx-auto leading-relaxed font-semibold">
          "{mascotSpeech}"
        </p>

        <div className="bg-[#ebdcb9]/40 dark:bg-[#1a1a18]/70 border-2 border-[#bca175]/45 rounded-3xl p-5 text-base font-black text-claude-coral max-w-xs mx-auto shadow-inner">
          🔥 Quest Score: +{totalXpEarned} XP!
        </div>

        <div className="flex gap-4 justify-center pt-2">
          <button
            onClick={startDojoSession}
            className="px-6 py-3.5 bg-[#eae4d8]/60 dark:bg-claude-sidebar/60 hover:bg-[#eae4d8]/80 hover:dark:bg-claude-card border-2 border-[#bca175]/45 text-claude-text font-extrabold text-xs rounded-2xl cursor-pointer active:translate-y-[2px] transition-all shadow-sm"
          >
            Re-run Quest
          </button>
          <button
            onClick={handleExit}
            className="px-7 py-3.5 bg-claude-coral hover:bg-claude-coral/90 text-white font-extrabold text-xs rounded-2xl shadow-[0_4px_0_0_#9f4124] active:translate-y-[4px] active:shadow-none cursor-pointer transition-all"
          >
            Dojo Dashboard ⛩️
          </button>
        </div>
      </div>
    );
  };

  // 3. DEFEAT / FAILED SCREEN
  const renderFailedScreen = () => {
    return (
      <div className="w-full max-w-xl text-center space-y-6 animate-fade-in z-10 text-[#191919] dark:text-[#f2f0ea] px-4">
        <div className="text-6xl animate-pulse">💀</div>
        <h2 className="text-3xl font-black tracking-wide text-red-600 dark:text-red-500 font-sans">Dojo Defeat!</h2>
        
        {/* Mascot Tanuki sweats / cries */}
        <div className="flex justify-center py-2">
          <MascotSensei mood="sad" />
        </div>

        <p className="text-xs text-[#6b6a65] dark:text-[#92918b] max-w-sm mx-auto leading-relaxed font-semibold">
          "{mascotSpeech}"
        </p>

        <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-5 text-sm font-black text-red-600 dark:text-red-400 max-w-xs mx-auto shadow-inner">
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
            className="px-6 py-3.5 bg-[#eae4d8]/60 dark:bg-claude-sidebar/60 hover:bg-[#eae4d8]/80 hover:dark:bg-claude-card border-2 border-[#bca175]/45 text-claude-text font-extrabold text-xs rounded-2xl cursor-pointer active:translate-y-[2px] transition-all"
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
      <div className={`w-full max-w-4xl flex flex-col gap-6 animate-fade-in relative z-10 select-none text-[#191919] dark:text-[#f2f0ea] px-4 md:px-8 ${shake ? 'animate-shake' : ''}`}>
        
        {/* Arena status header (Lives, Combo streak, progress bar) */}
        <div className="w-full flex items-center justify-between gap-4 py-2 z-10 border-b border-[#bca175]/25 pb-4">
          <button
            onClick={handleExit}
            className="text-xs font-black text-claude-coral hover:text-red-500 cursor-pointer flex items-center gap-1 transition-colors"
          >
            🚪 Leave Arena
          </button>
          
          {/* Progress bar and combo streak */}
          <div className="flex-1 flex items-center gap-3">
            <div className="flex-1 bg-[#ebdcb9]/40 dark:bg-[#2d2d2a] h-3.5 rounded-full overflow-hidden border border-[#bca175]/30 relative shadow-inner">
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
          
          <div className="relative bg-white dark:bg-[#1a1a19]/90 border-2 border-[#bca175] dark:border-[#524430] p-4.5 rounded-2xl shadow-md max-w-xl w-full">
            <span className="text-[9px] font-black uppercase text-[#7c6c57] dark:text-[#92918b]/90 tracking-widest block mb-0.5">Dojo Topic / Sentence Translate</span>
            
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
              <h3 className="text-lg md:text-xl font-extrabold text-[#191919] dark:text-[#f2f0ea] italic leading-tight">
                "{activeLesson.english}"
              </h3>
            )}
            
            {/* Speech bubble pointer */}
            <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-4 h-4 bg-white dark:bg-[#1a1a19] border-l-2 border-b-2 border-[#bca175] dark:border-[#524430] rotate-45 hidden md:block" />
          </div>
        </div>

        {/* Assembled sentence Tatami Grid arena */}
        <div 
          className="w-full min-h-28 border-2 border-dashed border-[#bca175]/60 dark:border-[#524430]/90 rounded-3xl p-5 flex flex-wrap gap-3.5 items-center justify-center bg-[#eae4d8]/40 dark:bg-[#1a1a18]/70 shadow-inner z-10 animate-fade-in"
          style={{
            backgroundImage: `radial-gradient(circle, transparent 20%, rgba(188, 161, 117, 0.12) 20%, rgba(188, 161, 117, 0.12) 80%, transparent 80%, transparent), radial-gradient(circle, transparent 20%, rgba(188, 161, 117, 0.12) 20%, rgba(188, 161, 117, 0.12) 80%, transparent 80%, transparent)`,
            backgroundSize: '10px 10px',
            backgroundPosition: '0 0, 5px 5px'
          }}
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
            <span className="text-xs font-extrabold text-[#7c6c57] dark:text-[#92918b]/80 italic select-none">
              ⚔️ Select cards from pool below to assemble sequence...
            </span>
          )}
        </div>

        {/* Shuffled Word Pool with Spelling selectors */}
        <div className="w-full flex flex-col gap-3 py-2 z-10">
          <div className="flex justify-between items-baseline px-1 flex-wrap gap-2">
            <span className="text-[9px] font-black uppercase text-[#7c6c57] dark:text-[#92918b]/85 tracking-widest block">Available Cards</span>
            
            {/* Display modes (except Easy, which locks into Guides) */}
            {difficulty !== 'easy' && (
              <div className="flex items-center gap-1 bg-[#eae4d8]/40 dark:bg-claude-sidebar/40 border border-[#bca175]/35 p-1 rounded-xl shadow-inner">
                {['kanji', 'kana', 'romaji'].map(mode => (
                  <button
                    key={mode}
                    onClick={() => setDisplayMode(mode)}
                    className={`px-3 py-1 text-[8px] font-black uppercase rounded-lg transition-all cursor-pointer ${
                      displayMode === mode
                        ? 'bg-claude-coral text-white shadow-xs'
                        : 'text-[#6b6a65] dark:text-[#92918b] hover:text-[#191919] dark:hover:text-[#f2f0ea]'
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
                    <div className="absolute bottom-full mb-2.5 hidden group-hover:block bg-[#1e1e1c] border border-claude-border text-claude-text-muted text-[8px] font-extrabold px-2 py-1 rounded shadow-lg whitespace-nowrap z-50">
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
              className="px-5 py-3.5 bg-[#eae4d8]/45 hover:bg-[#eae4d8]/85 dark:bg-claude-sidebar border border-[#bca175]/45 text-[#6b6a65] dark:text-[#92918b] hover:text-[#191919] dark:hover:text-[#f2f0ea] font-extrabold text-xs rounded-xl cursor-pointer active:translate-y-[2px] transition-colors"
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
          <div className={`absolute bottom-0 inset-x-0 p-6 z-30 flex flex-col md:flex-row md:items-center justify-between gap-4 border-t-2 overflow-hidden shadow-2xl rounded-b-2xl animate-[slide-up_0.25s_ease-out_forwards] ${
            isCorrect 
              ? 'bg-[#e8f7ed] dark:bg-[#112a18] border-emerald-500/35 text-emerald-800 dark:text-emerald-300' 
              : 'bg-[#fdf0f1] dark:bg-[#341718] border-red-500/35 text-red-800 dark:text-red-300'
          }`}>
            <div className="flex-1 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xl">{isCorrect ? '🎉' : '⚠️'}</span>
                <h4 className="font-black text-xs uppercase tracking-wider">
                  {isCorrect ? 'Subarashii! Correct Sequence' : 'Sequence Broken'}
                </h4>
              </div>
              
              {isCorrect ? (
                <div className="space-y-2 pl-7 w-full">
                  <p className="text-xs font-semibold leading-normal opacity-90">
                    Your block ordering aligns perfectly with native syntax. +{difficulty === 'easy' ? '10' : difficulty === 'medium' ? '20' : '30'} XP awarded.
                  </p>
                  
                  {activeLesson.pattern && (
                    <div className="text-[11px] font-black text-[#5c5b56] dark:text-[#a09483] font-mono w-full">
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
                <div className="pl-7">
                  <p className="text-xs font-semibold leading-normal opacity-90">
                    Remember: {activeLesson.tip}
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={handleNext}
              className="py-3.5 px-8 bg-claude-coral hover:bg-claude-coral/95 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-[0_4px_0_0_#9f4124] active:translate-y-[4px] active:shadow-none border border-[#e06847]/30 cursor-pointer transition-all self-stretch md:self-auto flex items-center justify-center gap-1.5"
            >
              {currentLevel < sessionLessons.length - 1 ? 'Next Question ➡️' : 'Complete Quest 🏆'}
            </button>
          </div>
        )}

        {/* In-game live hint box */}
        {showTip && !checked && (
          <div className="bg-amber-500/5 border border-amber-500/25 text-amber-600 dark:text-amber-500 p-3.5 rounded-xl text-[11px] font-bold leading-normal animate-fade-in backdrop-blur-xs">
            💡 <strong>Grammar Tip:</strong> {activeLesson.tip}
          </div>
        )}

      </div>
    );
  };

  const sakuraPetals = [
    { id: 1, left: '5%', delay: '0s', duration: '9s', scale: 0.7 },
    { id: 2, left: '22%', delay: '2s', duration: '12s', scale: 1.1 },
    { id: 3, left: '38%', delay: '5s', duration: '10s', scale: 0.6 },
    { id: 4, left: '56%', delay: '1s', duration: '13s', scale: 0.8 },
    { id: 5, left: '72%', delay: '4s', duration: '8s', scale: 0.7 },
    { id: 6, left: '88%', delay: '3s', duration: '11s', scale: 1.0 },
  ];

  return (
    <div className="w-full min-h-screen flex items-center justify-center relative p-4 sm:p-6 md:p-8 overflow-hidden bg-[#faf8f2] dark:bg-[#0a0b0d] transition-all duration-300 font-sans">
      
      {/* Traditional wood lattice framing overlay */}
      <div className="absolute inset-0 border-[12px] border-amber-950/5 dark:border-amber-500/[0.02] pointer-events-none z-20" />
      
      {/* Parallax silhouetted landscape */}
      <div className="absolute inset-0 pointer-events-none z-0 hidden sm:flex items-end justify-center overflow-hidden">
        <svg viewBox="0 0 1000 500" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 w-full h-full pointer-events-none z-0 transition-all duration-300">
          <defs>
            <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#e16847" stopOpacity="0.4" />
              <stop offset="60%" stopColor="#e16847" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#e16847" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="fujiGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#221e2d" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#0a080f" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id="hillGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#15131f" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#08070b" stopOpacity="1" />
            </linearGradient>
            <linearGradient id="hillGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#251f33" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#100b1a" stopOpacity="0.95" />
            </linearGradient>
          </defs>

          {/* Glowing Sun */}
          <circle cx="800" cy="180" r="170" fill="url(#sunGlow)" />
          <circle cx="800" cy="180" r="75" className="fill-[#e16847]/35 dark:fill-[#e16847]/60" />
          
          {/* Mount Fuji */}
          <path d="M 0,500 L 120,380 L 260,220 L 320,220 L 460,380 L 580,500 Z" fill="url(#fujiGrad)" />
          <path d="M 252,229 L 260,220 L 320,220 L 328,229 Q 290,244 252,229 Z" fill="#f7f3e9" className="opacity-90 dark:opacity-30" />
          
          {/* Background hills */}
          <path d="M 0,500 Q 150,400 380,430 T 750,400 T 1000,440 L 1000,500 L 0,500 Z" fill="url(#hillGrad2)" />
          {/* Foreground hills */}
          <path d="M 0,500 Q 250,420 580,450 T 1000,430 L 1000,500 L 0,500 Z" fill="url(#hillGrad1)" />

          {/* Cherry Blossom Branch */}
          <path d="M 1000,0 Q 820,30 740,150" strokeWidth="5" stroke="currentColor" fill="none" className="stroke-[#4a3014] dark:stroke-[#ebdcb9]/20" />
          <path d="M 910,0 Q 830,80 870,120" strokeWidth="3" stroke="currentColor" fill="none" className="stroke-[#4a3014] dark:stroke-[#ebdcb9]/20" />
          
          <circle cx="740" cy="150" r="5" className="fill-pink-400 dark:fill-pink-500 opacity-90 animate-pulse" />
          <circle cx="748" cy="142" r="3.5" className="fill-pink-300 dark:fill-pink-400 opacity-90" />
          <circle cx="752" cy="155" r="4.5" className="fill-pink-400 dark:fill-pink-500 opacity-90" />
          <circle cx="870" cy="120" r="5" className="fill-pink-400 dark:fill-pink-500 opacity-90 animate-pulse" />
          <circle cx="862" cy="115" r="4" className="fill-pink-300 dark:fill-pink-400 opacity-90" />
          <circle cx="878" cy="125" r="3" className="fill-pink-400 dark:fill-pink-500 opacity-90" />
          
          {/* Pagoda Silhouette */}
          <path d="M 760,500 L 760,420 L 730,420 L 745,400 L 855,400 L 870,420 L 840,420 L 840,500 Z" fill="#15131f" className="opacity-95" />
          <path d="M 730,420 Q 715,428 700,425 Q 715,415 730,420 Z" fill="#e16847" className="opacity-75" />
          <path d="M 870,420 Q 885,428 900,425 Q 885,415 870,420 Z" fill="#e16847" className="opacity-75" />
          
          {/* Pagoda tier 2 */}
          <path d="M 770,400 L 770,350 L 745,350 L 755,335 L 825,335 L 835,350 L 810,350 L 810,400 Z" fill="#1d1926" className="opacity-95" />
          <path d="M 745,350 Q 735,356 725,354 Q 735,346 745,350 Z" fill="#e16847" className="opacity-75" />
          <path d="M 835,350 Q 845,356 855,354 Q 845,346 835,350 Z" fill="#e16847" className="opacity-75" />

          {/* Pagoda Spire */}
          <line x1="790" y1="335" x2="790" y2="290" stroke="#bca175" strokeWidth="3.5" />
          <circle cx="790" cy="285" r="4.5" fill="#e16847" />
        </svg>
      </div>

      {/* Floating Sakura petals */}
      {sakuraPetals.map(petal => (
        <span
          key={petal.id}
          className="absolute pointer-events-none w-2.5 h-3.5 bg-pink-300 dark:bg-pink-400 rounded-[50%_0_50%_50%] origin-center animate-[blossom-fall_infinite_linear] opacity-0 z-10"
          style={{
            left: petal.left,
            animationDelay: petal.delay,
            animationDuration: petal.duration,
            transform: `scale(${petal.scale}) rotate(15deg)`,
            top: '-20px'
          }}
        />
      ))}

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
          background: rgba(188, 161, 117, 0.3);
          border-radius: 9px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(188, 161, 117, 0.6);
        }

        @keyframes shoji-left {
          0% { transform: translateX(-100%); }
          40%, 60% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        @keyframes shoji-right {
          0% { transform: translateX(100%); }
          40%, 60% { transform: translateX(0); }
          100% { transform: translateX(100%); }
        }
        @keyframes blossom-fall {
          0% { transform: translateY(-10px) rotate(0deg); opacity: 0; }
          10% { opacity: 0.7; }
          90% { opacity: 0.7; }
          100% { transform: translateY(650px) rotate(420deg); opacity: 0; }
        }
        @keyframes slide-up {
          0% { transform: translateY(100%); }
          100% { transform: translateY(0); }
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

      {/* Shoji Sliding Doors Transition Overlay */}
      {shojiActive && (
        <div className="absolute inset-0 z-50 flex pointer-events-auto overflow-hidden">
          <div className="w-1/2 h-full bg-[#f6f3eb] dark:bg-[#1f1e1c] border-r-[6px] border-amber-900/60 dark:border-amber-950 relative animate-[shoji-left_0.9s_ease-in-out_forwards] flex items-center justify-end pr-6">
            <div className="absolute inset-0 opacity-15 dark:opacity-20 pointer-events-none" style={{
              backgroundImage: `linear-gradient(to right, #78350f 1.5px, transparent 1.5px), linear-gradient(to bottom, #78350f 1.5px, transparent 1.5px)`,
              backgroundSize: '35px 50px'
            }} />
            <div className="w-3.5 h-20 bg-amber-950 dark:bg-black rounded-l-md border border-amber-900 shadow-md flex items-center justify-center">
              <div className="w-1 h-10 bg-amber-800 rounded-full" />
            </div>
          </div>
          <div className="w-1/2 h-full bg-[#f6f3eb] dark:bg-[#1f1e1c] border-l-[6px] border-amber-900/60 dark:border-amber-950 relative animate-[shoji-right_0.9s_ease-in-out_forwards] flex items-center justify-start pl-6">
            <div className="absolute inset-0 opacity-15 dark:opacity-20 pointer-events-none" style={{
              backgroundImage: `linear-gradient(to right, #78350f 1.5px, transparent 1.5px), linear-gradient(to bottom, #78350f 1.5px, transparent 1.5px)`,
              backgroundSize: '35px 50px'
            }} />
            <div className="w-3.5 h-20 bg-amber-950 dark:bg-black rounded-r-md border border-[#bca175]/60 shadow-md flex items-center justify-center">
              <div className="w-1 h-10 bg-amber-800 rounded-full" />
            </div>
          </div>
        </div>
      )}

      {/* Screen Router Content */}
      <div className="w-full flex justify-center items-center z-10 py-4">
        {gameState === 'setup' && renderSetupScreen()}
        {gameState === 'study' && renderStudyScreen()}
        {gameState === 'playing' && renderPlayingScreen()}
        {gameState === 'finished' && renderFinishedScreen()}
        {gameState === 'failed' && renderFailedScreen()}
      </div>
    </div>
  );
}
