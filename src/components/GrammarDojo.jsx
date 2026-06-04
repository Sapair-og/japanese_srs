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
  // N4 Additional words
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
  const [gameState, setGameState] = useState('setup'); // 'setup', 'playing', 'finished'
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
  
  // Shoji sliding door transition state
  const [shojiActive, setShojiActive] = useState(false);

  // Concept Modal State
  const [showConceptModal, setShowConceptModal] = useState(false);

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

  // Shoji state transition wrapper
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
      setHardRevealEnglish(false);
      setShowConceptModal(false);
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
      let xp = 1;
      if (difficulty === 'medium') xp = 2;
      if (difficulty === 'hard') xp = 3;
      setTotalXpEarned(prev => prev + xp * 10);
      onGainXp(xp);
    } else {
      playIncorrectSound();
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const handleNext = () => {
    triggerStateChange(() => {
      setChecked(false);
      setIsCorrect(false);
      setAssembledSlots([]);
      setHardRevealEnglish(false);
      setShowConceptModal(false);

      if (currentLevel < sessionLessons.length - 1) {
        const nextLevel = currentLevel + 1;
        setCurrentLevel(nextLevel);
        setShuffledCards(sessionLessons[nextLevel].shuffled);
      } else {
        setGameState('finished');
      }
    });
  };

  const handleExit = () => {
    triggerStateChange(() => {
      setGameState('setup');
    });
  };

  // 1. SETUP GAME SCREEN RENDER HELPER (Spread over Dojo Arena space)
  const renderSetupScreen = () => {
    return (
      <div className="w-full max-w-xl flex flex-col gap-6 animate-fade-in z-10 text-[#191919] dark:text-[#f2f0ea]">
        <div className="space-y-1.5 text-center">
          <span className="text-[10px] font-black uppercase text-claude-coral tracking-widest block">文章道場</span>
          <h2 className="text-3xl font-black claude-serif tracking-wide text-claude-coral">JLPT Grammar Dojo</h2>
          <p className="text-xs text-claude-text-muted dark:text-claude-text-muted/95 leading-relaxed max-w-sm mx-auto font-medium">
            Test and revise your Japanese grammar rules for the JLPT N5 and N4 exams with custom layouts.
          </p>
        </div>

        <hr className="border-[#bca175]/35" />

        <div className="space-y-5">
          {/* Deck selector */}
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-wider text-[#7c6c57] dark:text-[#a09483] block pl-1">
              Select Grammar Level Deck
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setDeckLevel('N5')}
                className={`py-3.5 rounded-2xl border font-black text-xs uppercase tracking-widest cursor-pointer transition-all duration-300 ${
                  deckLevel === 'N5'
                    ? 'bg-claude-coral text-white border-transparent shadow-lg scale-[1.02] -translate-y-0.5'
                    : 'bg-[#eae4d8]/40 dark:bg-claude-sidebar/40 border-[#bca175]/35 text-claude-text-muted hover:text-claude-text'
                }`}
              >
                🍙 JLPT N5 (Basic)
              </button>
              <button
                onClick={() => setDeckLevel('N4')}
                className={`py-3.5 rounded-2xl border font-black text-xs uppercase tracking-widest cursor-pointer transition-all duration-300 ${
                  deckLevel === 'N4'
                    ? 'bg-claude-coral text-white border-transparent shadow-lg scale-[1.02] -translate-y-0.5'
                    : 'bg-[#eae4d8]/40 dark:bg-claude-sidebar/40 border-[#bca175]/35 text-claude-text-muted hover:text-claude-text'
                }`}
              >
                🌊 JLPT N4 (Exam Core)
              </button>
            </div>
          </div>

          {/* Session Size */}
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-wider text-[#7c6c57] dark:text-[#a09483] block pl-1">
              Select Deck Challenge Size
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[3, 5, 10, 15].map(size => (
                <button
                  key={size}
                  onClick={() => setSessionSize(size)}
                  className={`py-2.5 rounded-xl border font-extrabold text-[11px] cursor-pointer transition-all ${
                    sessionSize === size
                      ? 'bg-claude-coral text-white border-transparent shadow -translate-y-0.5'
                      : 'bg-[#eae4d8]/30 dark:bg-claude-sidebar/30 border-[#bca175]/30 text-claude-text-muted hover:text-claude-text'
                  }`}
                >
                  {size} Qs
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-wider text-[#7c6c57] dark:text-[#a09483] block pl-1">
              Select Dojo Difficulty Mode
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setDifficulty('easy')}
                className={`py-2.5 rounded-xl border font-extrabold text-[10px] uppercase tracking-wider cursor-pointer transition-all ${
                  difficulty === 'easy'
                    ? 'bg-emerald-600 border-transparent text-white shadow -translate-y-0.5'
                    : 'bg-[#eae4d8]/30 dark:bg-claude-sidebar/30 border-[#bca175]/30 text-claude-text-muted hover:text-[#22c55e]'
                }`}
              >
                🟢 Easy (Guides)
              </button>
              <button
                onClick={() => setDifficulty('medium')}
                className={`py-2.5 rounded-xl border font-extrabold text-[10px] uppercase tracking-wider cursor-pointer transition-all ${
                  difficulty === 'medium'
                    ? 'bg-amber-500 border-transparent text-[#191919] shadow -translate-y-0.5'
                    : 'bg-[#eae4d8]/30 dark:bg-claude-sidebar/30 border-[#bca175]/30 text-claude-text-muted hover:text-[#eab308]'
                }`}
              >
                🟡 Medium
              </button>
              <button
                onClick={() => setDifficulty('hard')}
                className={`py-2.5 rounded-xl border font-extrabold text-[10px] uppercase tracking-wider cursor-pointer transition-all ${
                  difficulty === 'hard'
                    ? 'bg-red-600 border-transparent text-white shadow -translate-y-0.5'
                    : 'bg-[#eae4d8]/30 dark:bg-claude-sidebar/30 border-[#bca175]/30 text-claude-text-muted hover:text-[#ef4444]'
                }`}
              >
                🔴 Hard (Blind)
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={startDojoSession}
          className="w-full py-4 mt-4 bg-claude-coral hover:bg-claude-coral/90 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-lg border border-[#e06847]/30 cursor-pointer transition-all active:scale-[0.98] hover:-translate-y-0.5 text-center"
        >
          Enter Sentence Dojo ⚔️
        </button>
      </div>
    );
  };

  // 2. FINISHED SESSION SCREEN RENDER HELPER (Spread over Dojo Arena space)
  const renderFinishedScreen = () => {
    return (
      <div className="w-full max-w-xl text-center space-y-6 animate-fade-in z-10 text-[#191919] dark:text-[#f2f0ea]">
        <div className="text-6xl animate-bounce">🏆</div>
        <h2 className="text-3xl font-black claude-serif tracking-wide text-claude-coral">Dojo Quest Completed!</h2>
        <p className="text-xs text-claude-text-muted dark:text-claude-text-muted/95 max-w-sm mx-auto leading-relaxed font-medium">
          Amazing study session! You successfully finished the customized **{deckLevel}** grammar deck and completed your training.
        </p>
        <div className="bg-[#ebdcb9]/40 dark:bg-[#1a1a18]/70 border-2 border-[#bca175]/45 rounded-2xl p-5 text-base font-black text-claude-coral max-w-xs mx-auto shadow-inner">
          🔥 Total Earned: +{totalXpEarned} XP!
        </div>
        <div className="flex gap-4 justify-center pt-2">
          <button
            onClick={startDojoSession}
            className="px-6 py-3 bg-[#eae4d8]/60 dark:bg-claude-sidebar/60 hover:bg-[#eae4d8]/80 hover:dark:bg-claude-card border border-[#bca175]/45 text-claude-text font-extrabold text-xs rounded-xl cursor-pointer transition-all hover:-translate-y-0.5 active:scale-95 shadow-sm"
          >
            Retry Deck
          </button>
          <button
            onClick={handleExit}
            className="px-7 py-3 bg-claude-coral hover:bg-claude-coral/90 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer transition-all hover:-translate-y-0.5 active:scale-95"
          >
            Back to Dojo Menu ⛩️
          </button>
        </div>
      </div>
    );
  };

  // 3. ACTIVE QUIZ PLAYING BOARD SCREEN RENDER HELPER (Duolingo Style Clean UI)
  const renderPlayingScreen = () => {
    return (
      <div className={`w-full max-w-3xl flex flex-col gap-6 animate-fade-in relative z-10 select-none text-[#191919] dark:text-[#f2f0ea] ${shake ? 'animate-shake' : ''}`}>
        
        {/* Sleek Duolingo Style Progress Header */}
        <div className="w-full flex items-center justify-between gap-4 py-2 z-10">
          <button
            onClick={handleExit}
            className="text-xs font-black text-claude-coral hover:text-red-500 cursor-pointer flex items-center gap-1 transition-colors"
          >
            🚪 Exit
          </button>
          
          {/* Progress bar */}
          <div className="flex-1 bg-[#ebdcb9]/40 dark:bg-[#2d2d2a] h-3.5 rounded-full overflow-hidden border border-[#bca175]/30">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${(currentLevel / sessionLessons.length) * 100}%` }}
            />
          </div>

          <span className="text-[10px] font-black text-claude-coral uppercase tracking-wider select-none">
            {currentLevel + 1} / {sessionLessons.length}
          </span>
        </div>

        {/* English Prompt & Concept Toggle */}
        <div className="w-full text-center py-4 flex flex-col items-center justify-center gap-1.5 z-10">
          <span className="text-[9px] font-black uppercase text-[#7c6c57] dark:text-[#92918b] tracking-widest">Translate this sentence</span>
          
          <div className="flex items-center justify-center gap-3 w-full max-w-xl">
            {difficulty === 'hard' && !hardRevealEnglish ? (
              <div className="space-y-2">
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
              <h3 className="text-xl md:text-2xl font-black text-[#191919] dark:text-[#f2f0ea] italic leading-tight">
                "{activeLesson.english}"
              </h3>
            )}
            
            {/* Concept overlay toggle */}
            <button
              onClick={() => setShowConceptModal(true)}
              className="p-1.5 rounded-full hover:bg-[#bca175]/15 dark:hover:bg-claude-sidebar/60 text-claude-coral cursor-pointer transition-colors"
              title="Show Grammar Concept"
            >
              📖
            </button>
          </div>
        </div>

        {/* Assembled Sentence Slots Zone (Tatami straw grid background) */}
        <div 
          className="w-full min-h-24 border-2 border-dashed border-[#bca175]/60 dark:border-[#524430]/90 rounded-2xl p-4 flex flex-wrap gap-3 items-center justify-center bg-[#eae4d8]/40 dark:bg-[#1a1a18]/70 shadow-inner z-10"
          style={{
            backgroundImage: `radial-gradient(circle, transparent 20%, rgba(188, 161, 117, 0.12) 20%, rgba(188, 161, 117, 0.12) 80%, transparent 80%, transparent), radial-gradient(circle, transparent 20%, rgba(188, 161, 117, 0.12) 20%, rgba(188, 161, 117, 0.12) 80%, transparent 80%, transparent)`,
            backgroundSize: '8px 8px',
            backgroundPosition: '0 0, 4px 4px'
          }}
        >
          {assembledSlots.length > 0 ? (
            assembledSlots.map((card, idx) => {
              const meta = getWordMeta(card);
              return (
                <button
                  key={idx}
                  onClick={() => handleCardClick(card, 'assembled')}
                  className="px-4 py-2.5 bg-[#fbf9f4] dark:bg-[#2b2a26] border-2 border-claude-coral text-claude-coral font-extrabold text-sm rounded-xl cursor-pointer hover:bg-white active:scale-95 transition-all shadow-sm flex flex-col items-center hover:-translate-y-0.5"
                >
                  {/* Easy mode displays Romaji hint inside slot button */}
                  {difficulty === 'easy' && meta && (
                    <span className="text-[7px] font-extrabold text-amber-600 dark:text-amber-500/80 tracking-wide uppercase -mb-0.5 select-none">
                      {meta.romaji}
                    </span>
                  )}
                  <span>{getCardDisplay(card)}</span>
                </button>
              );
            })
          ) : (
            <span className="text-xs font-bold text-[#7c6c57] dark:text-[#92918b]/80 italic select-none">
              Tap word cards from pool below to assemble...
            </span>
          )}
        </div>

        {/* Shuffled Word Cards Pool */}
        <div className="w-full flex flex-col gap-3 py-2 z-10">
          <div className="flex justify-between items-baseline px-1 flex-wrap gap-2">
            <span className="text-[8px] font-black uppercase text-[#7c6c57] dark:text-[#92918b]/85 tracking-widest block">Available Words Pool</span>
            
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
                        : 'text-claude-text-muted hover:text-claude-text'
                    }`}
                  >
                    {mode === 'kanji' ? '漢字' : mode === 'kana' ? 'かな' : 'Roma'}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2.5 justify-center min-h-[48px]">
            {shuffledCards.map((card, idx) => {
              const meta = getWordMeta(card);
              const dictMean = meta ? meta.meaning || card : card;
              
              return (
                <button
                  key={idx}
                  onClick={() => handleCardClick(card, 'shuffled')}
                  className="px-4 py-2.5 bg-[#f3ede0] hover:bg-[#fbf9f4] dark:bg-[#1e1e1c] hover:dark:bg-[#2b2a26] border border-[#bca175]/45 hover:border-[#bca175] text-[#191919] dark:text-[#f2f0ea] font-extrabold text-sm rounded-xl cursor-pointer transition-all active:scale-95 hover:scale-[1.03] shadow-xs flex flex-col items-center relative group hover:-translate-y-0.5"
                  title={difficulty === 'hard' ? `Definition: ${dictMean}` : undefined}
                >
                  {/* Tooltip for Hard mode detailing word dictionary meanings */}
                  {difficulty === 'hard' && (
                    <div className="absolute bottom-full mb-1.5 hidden group-hover:block bg-[#1e1e1c] border border-claude-border text-claude-text-muted text-[8px] font-extrabold px-2 py-1 rounded shadow-lg whitespace-nowrap z-50">
                      {dictMean}
                    </div>
                  )}

                  {/* Easy mode displays Romaji hint inside cards */}
                  {difficulty === 'easy' && meta && (
                    <span className="text-[7px] font-extrabold text-amber-600 dark:text-amber-500/80 tracking-wide uppercase -mb-0.5 select-none">
                      {meta.romaji}
                    </span>
                  )}
                  <span>{getCardDisplay(card)}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Standard bottom action buttons when unchecked */}
        {!checked && (
          <div className="w-full flex gap-3 pt-4 z-10">
            <button
              onClick={() => setShowTip(!showTip)}
              className="px-4 py-3 bg-[#eae4d8]/45 hover:bg-[#eae4d8]/85 dark:bg-claude-sidebar border border-[#bca175]/45 text-[#6b6a65] dark:text-[#92918b] hover:text-[#191919] dark:hover:text-[#f2f0ea] font-extrabold text-xs rounded-xl cursor-pointer transition-colors shadow-sm"
            >
              {showTip ? 'Hide Hint 👁️' : 'Show Hint 💡'}
            </button>
            <button
              onClick={handleCheck}
              disabled={assembledSlots.length === 0}
              className={`flex-1 py-3.5 bg-claude-coral hover:bg-claude-coral/90 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg border border-[#e06847]/30 cursor-pointer transition-all active:scale-[0.97] hover:-translate-y-0.5 flex items-center justify-center gap-1.5 ${
                assembledSlots.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Check Sentence 🔍
            </button>
          </div>
        )}

        {/* Bottom check drawer overlay (Duolingo Style slide-up drawer) */}
        {checked && (
          <div className={`absolute bottom-0 inset-x-0 p-6 z-30 flex flex-col md:flex-row md:items-center justify-between gap-4 border-t-2 overflow-hidden shadow-2xl rounded-b-2xl animate-[slide-up_0.25s_ease-out_forwards] ${
            isCorrect 
              ? 'bg-[#e8f7ed] dark:bg-[#112a18] border-emerald-500/35 text-emerald-800 dark:text-emerald-300' 
              : 'bg-[#fdf0f1] dark:bg-[#341718] border-red-500/35 text-red-800 dark:text-red-300'
          }`}>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xl">{isCorrect ? '🎉' : '⚠️'}</span>
                <h4 className="font-black text-sm uppercase tracking-wide">
                  {isCorrect ? 'Correct Assembly!' : 'Incorrect / Check Hint'}
                </h4>
              </div>
              
              {isCorrect ? (
                <div className="space-y-1 pl-7">
                  <p className="text-xs font-extrabold leading-normal opacity-90">
                    Sheesh, you cooked that sequence perfectly! +{difficulty === 'easy' ? '10' : difficulty === 'medium' ? '20' : '30'} XP awarded.
                  </p>
                  {activeLesson.pattern && (
                    <div className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      Formula: {activeLesson.pattern}
                    </div>
                  )}
                </div>
              ) : (
                <div className="pl-7">
                  <p className="text-xs font-extrabold leading-normal opacity-90">
                    Remember: {activeLesson.tip}
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={handleNext}
              className="py-3.5 px-8 bg-claude-coral hover:bg-claude-coral/90 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg border border-[#e06847]/30 cursor-pointer transition-all active:scale-[0.97] hover:-translate-y-0.5 flex items-center justify-center gap-1.5 self-stretch md:self-auto"
            >
              {currentLevel < sessionLessons.length - 1 ? 'Advance Level ➡️' : 'Complete Quest 🏆'}
            </button>
          </div>
        )}

        {/* Hint tip panel display */}
        {showTip && !checked && (
          <div className="bg-amber-500/5 border border-amber-500/25 text-amber-600 dark:text-amber-500 p-3.5 rounded-xl text-[11px] font-bold leading-normal animate-fade-in backdrop-blur-xs">
            💡 <strong>Hint:</strong> {activeLesson.tip}
          </div>
        )}

      </div>
    );
  };

  const sakuraPetals = [
    { id: 1, left: '5%', delay: '0s', duration: '8s', scale: 0.7 },
    { id: 2, left: '20%', delay: '2s', duration: '11s', scale: 1.0 },
    { id: 3, left: '35%', delay: '5s', duration: '9s', scale: 0.5 },
    { id: 4, left: '55%', delay: '1s', duration: '12s', scale: 0.8 },
    { id: 5, left: '70%', delay: '4s', duration: '7s', scale: 0.6 },
    { id: 6, left: '85%', delay: '3s', duration: '10s', scale: 0.9 },
  ];

  return (
    <div className="w-full min-h-[620px] flex-1 flex items-center justify-center relative p-4 sm:p-6 md:p-8 overflow-hidden rounded-2xl bg-[#faf8f2] dark:bg-[#0a0b0d] transition-all duration-300 w-full">
      {/* Traditional wood lattice framing lines overlay */}
      <div className="absolute inset-0 border-[10px] border-amber-950/5 dark:border-amber-500/[0.02] pointer-events-none z-20" />
      
      {/* Dojo background watercolor silhouette landscape (Mount Fuji, hills, tree branches - Hidden on mobile) */}
      <div className="absolute inset-0 pointer-events-none opacity-25 dark:opacity-15 z-0 hidden sm:flex items-end justify-center overflow-hidden">
        <svg viewBox="0 0 1000 500" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 w-full h-full pointer-events-none z-0 fill-amber-950 dark:fill-slate-100 transition-all duration-300">
          {/* Rising Sun (off-center) */}
          <circle cx="780" cy="190" r="95" className="opacity-15 dark:opacity-20 fill-[#cc5a37]" />
          
          {/* Far Mountains (Mount Fuji silhouette on the left) */}
          <path d="M 0,500 L 120,390 L 260,250 L 300,250 L 440,390 L 550,500 Z" className="fill-amber-950/10 dark:fill-slate-100/5" />
          <path d="M 252,258 L 260,250 L 300,250 L 308,258 Q 280,270 252,258 Z" className="fill-white dark:fill-slate-800 opacity-80" /> {/* Fuji snow cap */}
          
          {/* Rolling Hills across the whole bottom width */}
          <path d="M 0,500 Q 150,420 380,450 T 750,420 T 1000,460 L 1000,500 L 0,500 Z" className="fill-amber-950/15 dark:fill-slate-100/5" />
          <path d="M 0,500 Q 250,440 580,470 T 1000,450 L 1000,500 L 0,500 Z" className="fill-amber-950/10 dark:fill-slate-100/10" />

          {/* Cherry Blossom Branch hanging from top right corner */}
          <path d="M 1000,0 Q 820,40 760,140" strokeWidth="4" stroke="currentColor" fill="none" className="stroke-amber-950/20 dark:stroke-slate-100/15" />
          <path d="M 910,0 Q 840,70 890,110" strokeWidth="2.5" stroke="currentColor" fill="none" className="stroke-amber-950/20 dark:stroke-slate-100/15" />
          <circle cx="760" cy="140" r="3" className="fill-pink-300" />
          <circle cx="770" cy="130" r="2.5" className="fill-pink-300" />
          <circle cx="890" cy="110" r="3" className="fill-pink-300" />
          <circle cx="900" cy="100" r="2" className="fill-pink-300" />
          
          {/* Hanging Pagoda roof silhouette in the bottom right */}
          <path d="M 780,500 L 780,440 L 750,440 L 765,420 L 875,420 L 890,440 L 860,440 L 860,500 Z" className="fill-amber-950/15 dark:fill-slate-100/10" />
          <path d="M 750,440 Q 735,448 720,445 Q 735,435 750,440 Z" className="fill-amber-950/15 dark:fill-slate-100/10" />
          <path d="M 890,440 Q 905,448 920,445 Q 905,435 890,440 Z" className="fill-amber-950/15 dark:fill-slate-100/10" />
        </svg>
      </div>

      {/* Sakura petals floating background */}
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

      {/* Custom Styles Injection */}
      <style dangerouslySetInnerHTML={{__html: `
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
          100% { transform: translateY(620px) rotate(420deg); opacity: 0; }
        }
        @keyframes slide-up {
          0% { transform: translateY(100%); }
          100% { transform: translateY(0); }
        }
      `}} />

      {/* Shoji Sliding Doors Transition Overlay */}
      {shojiActive && (
        <div className="absolute inset-0 z-50 flex pointer-events-auto overflow-hidden rounded-2xl">
          {/* Left Shoji Panel */}
          <div className="w-1/2 h-full bg-[#f6f3eb] dark:bg-[#1f1e1c] border-r-[6px] border-amber-900/60 dark:border-amber-950 relative animate-[shoji-left_0.9s_ease-in-out_forwards] flex items-center justify-end pr-6">
            {/* Wooden lattice grid */}
            <div className="absolute inset-0 opacity-15 dark:opacity-20 pointer-events-none" style={{
              backgroundImage: `linear-gradient(to right, #78350f 1.5px, transparent 1.5px), linear-gradient(to bottom, #78350f 1.5px, transparent 1.5px)`,
              backgroundSize: '35px 50px'
            }} />
            {/* Handle handle plate */}
            <div className="w-3.5 h-20 bg-amber-950 dark:bg-black rounded-l-md border border-amber-900 shadow-md flex items-center justify-center">
              <div className="w-1 h-10 bg-amber-800 rounded-full" />
            </div>
          </div>
          {/* Right Shoji Panel */}
          <div className="w-1/2 h-full bg-[#f6f3eb] dark:bg-[#1f1e1c] border-l-[6px] border-amber-900/60 dark:border-amber-950 relative animate-[shoji-right_0.9s_ease-in-out_forwards] flex items-center justify-start pl-6">
            {/* Wooden lattice grid */}
            <div className="absolute inset-0 opacity-15 dark:opacity-20 pointer-events-none" style={{
              backgroundImage: `linear-gradient(to right, #78350f 1.5px, transparent 1.5px), linear-gradient(to bottom, #78350f 1.5px, transparent 1.5px)`,
              backgroundSize: '35px 50px'
            }} />
            {/* Handle handle plate */}
            <div className="w-3.5 h-20 bg-amber-950 dark:bg-black rounded-r-md border border-[#bca175]/60 shadow-md flex items-center justify-center">
              <div className="w-1 h-10 bg-amber-800 rounded-full" />
            </div>
          </div>
        </div>
      )}

      {/* Grammar Concept Modal (Floating Washi-Paper Sheet overlay) */}
      {showConceptModal && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-40 animate-fade-in rounded-2xl">
          <div className="bg-[#fcfaf2] dark:bg-[#1a1a19] border-4 border-[#bca175] dark:border-[#524430] p-6 rounded-2xl max-w-sm text-center relative shadow-2xl animate-[slide-up_0.2s_ease-out_forwards] text-[#191919] dark:text-[#f2f0ea]">
            <span className="text-[9px] font-black text-claude-coral uppercase tracking-widest block mb-1">文法解説 / Concept</span>
            <h4 className="font-black text-sm text-[#191919] dark:text-[#f2f0ea] mb-3">{activeLesson.title}</h4>
            <p className="text-xs text-[#6b6a65] dark:text-[#92918b] leading-relaxed mb-5 font-medium">{activeLesson.concept}</p>
            <button 
              onClick={() => setShowConceptModal(false)}
              className="w-full py-2.5 bg-claude-coral text-white font-black text-xs rounded-xl hover:bg-claude-coral/95 transition-all shadow-md cursor-pointer uppercase tracking-wider"
            >
              I Got It! 📖
            </button>
          </div>
        </div>
      )}

      {/* Actual Dojo Screen Router Content */}
      <div className="w-full flex justify-center items-center z-10 py-2">
        {gameState === 'setup' && renderSetupScreen()}
        {gameState === 'playing' && renderPlayingScreen()}
        {gameState === 'finished' && renderFinishedScreen()}
      </div>
    </div>
  );
}
