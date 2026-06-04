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

  const startDojoSession = () => {
    const rawDeck = deckLevel === 'N5' ? n5Lessons : n4Lessons;
    // Shuffle the lessons list to generate random challenges
    const shuffledLessons = [...rawDeck].sort(() => 0.5 - Math.random());
    const selected = shuffledLessons.slice(0, Math.min(sessionSize, shuffledLessons.length));
    
    // Parse vocabulary overrides
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
    setGameState('playing');
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
      // Award scaling XP (based on difficulty)
      let xp = 1;
      if (difficulty === 'medium') xp = 2; // +20 XP
      if (difficulty === 'hard') xp = 3;   // +30 XP
      setTotalXpEarned(prev => prev + xp * 10);
      onGainXp(xp);
    } else {
      playIncorrectSound();
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const handleNext = () => {
    setChecked(false);
    setIsCorrect(false);
    setAssembledSlots([]);
    setHardRevealEnglish(false);

    if (currentLevel < sessionLessons.length - 1) {
      const nextLevel = currentLevel + 1;
      setCurrentLevel(nextLevel);
      setShuffledCards(sessionLessons[nextLevel].shuffled);
    } else {
      setGameState('finished');
    }
  };

  const handleExit = () => {
    setGameState('setup');
  };

  // 1. SETUP GAME SCREEN
  if (gameState === 'setup') {
    return (
      <div className="w-full max-w-xl claude-panel p-6 sm:p-8 rounded-3xl relative overflow-hidden text-[#f2f0ea] bg-claude-card flex flex-col gap-6 animate-fade-in">
        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-amber-400 via-claude-coral to-amber-400" />
        
        <div className="space-y-1.5 text-center">
          <span className="text-[10px] font-black uppercase text-claude-coral tracking-widest block">文章道場</span>
          <h2 className="text-2xl font-black claude-serif">JLPT Grammar Dojo</h2>
          <p className="text-xs text-claude-text-muted leading-relaxed max-w-sm mx-auto">
            Test and revise your Japanese grammar rules for the JLPT N5 and N4 exams with custom layouts.
          </p>
        </div>

        <hr className="border-claude-border/50" />

        <div className="space-y-5">
          {/* Deck selector */}
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-wider text-claude-text-muted block pl-1">
              Select Grammar Level Deck
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setDeckLevel('N5')}
                className={`py-3.5 rounded-2xl border font-black text-xs uppercase tracking-widest cursor-pointer transition-all duration-300 ${
                  deckLevel === 'N5'
                    ? 'bg-claude-coral text-white border-transparent shadow-lg scale-[1.02]'
                    : 'bg-claude-sidebar/40 border-claude-border text-claude-text-muted hover:text-[#f2f0ea]'
                }`}
              >
                🍙 JLPT N5 (Basic)
              </button>
              <button
                onClick={() => setDeckLevel('N4')}
                className={`py-3.5 rounded-2xl border font-black text-xs uppercase tracking-widest cursor-pointer transition-all duration-300 ${
                  deckLevel === 'N4'
                    ? 'bg-claude-coral text-white border-transparent shadow-lg scale-[1.02]'
                    : 'bg-claude-sidebar/40 border-claude-border text-claude-text-muted hover:text-[#f2f0ea]'
                }`}
              >
                🌊 JLPT N4 (Exam Core)
              </button>
            </div>
          </div>

          {/* Session Size */}
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-wider text-claude-text-muted block pl-1">
              Select Deck Challenge Size
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[3, 5, 10, 15].map(size => (
                <button
                  key={size}
                  onClick={() => setSessionSize(size)}
                  className={`py-2.5 rounded-xl border font-extrabold text-[11px] cursor-pointer transition-all ${
                    sessionSize === size
                      ? 'bg-claude-coral text-white border-transparent shadow'
                      : 'bg-claude-sidebar/30 border-claude-border text-claude-text-muted hover:text-[#f2f0ea]'
                  }`}
                >
                  {size} Questions
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-wider text-claude-text-muted block pl-1">
              Select Dojo Difficulty Mode
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setDifficulty('easy')}
                className={`py-2.5 rounded-xl border font-extrabold text-[10px] uppercase tracking-wider cursor-pointer transition-all ${
                  difficulty === 'easy'
                    ? 'bg-emerald-600 border-transparent text-white shadow'
                    : 'bg-claude-sidebar/30 border-claude-border text-claude-text-muted hover:text-[#f2f0ea]'
                }`}
              >
                🟢 Easy (Guides)
              </button>
              <button
                onClick={() => setDifficulty('medium')}
                className={`py-2.5 rounded-xl border font-extrabold text-[10px] uppercase tracking-wider cursor-pointer transition-all ${
                  difficulty === 'medium'
                    ? 'bg-amber-500 border-transparent text-[#191919] shadow'
                    : 'bg-claude-sidebar/30 border-claude-border text-claude-text-muted hover:text-[#f2f0ea]'
                }`}
              >
                🟡 Medium (Toggles)
              </button>
              <button
                onClick={() => setDifficulty('hard')}
                className={`py-2.5 rounded-xl border font-extrabold text-[10px] uppercase tracking-wider cursor-pointer transition-all ${
                  difficulty === 'hard'
                    ? 'bg-red-600 border-transparent text-white shadow'
                    : 'bg-claude-sidebar/30 border-claude-border text-claude-text-muted hover:text-[#f2f0ea]'
                }`}
              >
                🔴 Hard (Blind)
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={startDojoSession}
          className="w-full py-4 mt-2 bg-claude-coral hover:bg-claude-coral/90 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-lg cursor-pointer transition-all active:scale-[0.98] text-center"
        >
          Enter Sentence Dojo ⚔️
        </button>
      </div>
    );
  }

  // 2. FINISHED SESSION SCREEN
  if (gameState === 'finished') {
    return (
      <div className="w-full max-w-xl claude-panel p-8 rounded-3xl text-center space-y-6 animate-fade-in relative overflow-hidden text-[#f2f0ea] bg-claude-card">
        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-amber-400 via-claude-coral to-amber-400" />
        <div className="text-5xl">🏆</div>
        <h2 className="text-2xl font-black claude-serif">Dojo Quest Completed!</h2>
        <p className="text-xs text-claude-text-muted max-w-sm mx-auto leading-relaxed">
          No cap, you successfully finished the customized **{deckLevel}** grammar deck!
        </p>
        <div className="bg-claude-sidebar/40 border border-claude-border/50 rounded-2xl p-4 text-xs font-black text-claude-coral max-w-xs mx-auto">
          🔥 Total Earned: +{totalXpEarned} XP!
        </div>
        <div className="flex gap-3 justify-center">
          <button
            onClick={startDojoSession}
            className="px-5 py-3 bg-claude-sidebar hover:bg-claude-card border border-claude-border text-[#f2f0ea] font-extrabold text-xs rounded-xl cursor-pointer"
          >
            Retry Deck
          </button>
          <button
            onClick={handleExit}
            className="px-6 py-3 bg-claude-coral hover:bg-claude-coral/90 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer transition-transform active:scale-95"
          >
            Back to Dojo Menu ⛩️
          </button>
        </div>
      </div>
    );
  }

  // 3. ACTIVE QUIZ PLAYING BOARD SCREEN
  return (
    <div className="w-full max-w-2xl flex flex-col gap-5 animate-fade-in relative z-10 select-none text-[#f2f0ea]">
      {/* Active Header Progress */}
      <div className="claude-panel p-4 rounded-2xl flex items-center justify-between bg-claude-card border border-claude-border shadow-md">
        <div className="space-y-1">
          <span className="text-[8px] font-black uppercase tracking-widest text-claude-coral block">
            Sentence Dojo / {deckLevel} Challenge
          </span>
          <h2 className="text-xs font-black flex items-center gap-2">
            <span>Stage {currentLevel + 1} of {sessionLessons.length}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-claude-border" />
            <span className="text-claude-text-muted capitalize text-[10px]">({difficulty} mode)</span>
          </h2>
        </div>

        {/* Display modes (except Easy, which locks into Guides) */}
        {difficulty !== 'easy' && (
          <div className="flex items-center gap-1 bg-claude-sidebar/40 border border-claude-border/60 p-1 rounded-xl shadow-inner">
            {['kanji', 'kana', 'romaji'].map(mode => (
              <button
                key={mode}
                onClick={() => setDisplayMode(mode)}
                className={`px-3 py-1.5 text-[9px] font-black uppercase rounded-lg transition-all cursor-pointer ${
                  displayMode === mode
                    ? 'bg-claude-coral text-white shadow-md'
                    : 'text-claude-text-muted hover:text-[#f2f0ea]'
                }`}
              >
                {mode === 'kanji' ? '漢字' : mode === 'kana' ? 'かな' : 'Roma'}
              </button>
            ))}
          </div>
        )}

        {/* Home exit button */}
        <button
          onClick={handleExit}
          className="p-2 bg-claude-sidebar border border-claude-border/75 rounded-lg hover:border-red-500/50 hover:text-red-500 cursor-pointer text-xs font-bold transition-colors"
          title="Exit Session"
        >
          🚪 Exit
        </button>
      </div>

      {/* Main Board Arena */}
      <div className={`claude-panel p-6 rounded-3xl bg-claude-card relative overflow-hidden flex flex-col gap-5 transition-all duration-300 border-2 ${
        checked ? (isCorrect ? 'border-emerald-600/60 shadow-emerald-950/10' : 'border-red-600/60 shadow-red-950/10') : 'border-claude-border/80'
      } ${shake ? 'animate-shake' : ''}`}>
        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-transparent via-claude-coral/50 to-transparent" />
        
        {/* Concept description box */}
        <div className="bg-claude-sidebar/40 border border-claude-border/40 rounded-2xl p-4 space-y-1">
          <div className="flex items-baseline justify-between flex-wrap gap-2">
            <span className="text-[9px] font-black uppercase text-amber-500 tracking-wider">Concept / 文法解説</span>
            <span className="text-[9px] font-extrabold text-claude-text-muted italic">{activeLesson.title}</span>
          </div>
          <p className="text-xs leading-relaxed text-claude-text-muted font-medium">
            {activeLesson.concept}
          </p>
        </div>

        {/* English Prompt (Hidden in Hard difficulty, unless revealed) */}
        <div className="text-center space-y-1.5 py-2 min-h-[64px] flex flex-col items-center justify-center bg-claude-sidebar/10 rounded-2xl border border-dashed border-claude-border/30">
          <span className="text-[8px] font-black uppercase text-claude-text-muted tracking-widest block">English Translate Prompt</span>
          
          {difficulty === 'hard' && !hardRevealEnglish ? (
            <div className="space-y-2">
              <div className="text-[10px] font-black text-amber-500/80 bg-amber-500/5 px-3 py-1.5 rounded-lg border border-amber-500/20 max-w-sm leading-normal">
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
            <h3 className="text-base md:text-lg font-extrabold text-[#f2f0ea] italic max-w-md px-4">
              "{activeLesson.english}"
            </h3>
          )}
        </div>

        {/* Assembled Sentence Slots Zone */}
        <div className="min-h-16 border-2 border-dashed border-claude-border/80 rounded-2xl p-3 flex flex-wrap gap-2.5 items-center justify-center bg-claude-sidebar/20 shadow-inner">
          {assembledSlots.length > 0 ? (
            assembledSlots.map((card, idx) => {
              const meta = getWordMeta(card);
              return (
                <button
                  key={idx}
                  onClick={() => handleCardClick(card, 'assembled')}
                  className="px-4 py-2.5 bg-claude-card border-2 border-claude-coral text-claude-coral font-extrabold text-sm rounded-xl cursor-pointer hover:bg-claude-coral/5 active:scale-95 transition-all shadow-sm flex flex-col items-center"
                >
                  {/* Easy mode displays Romaji hint inside slot button */}
                  {difficulty === 'easy' && meta && (
                    <span className="text-[7px] font-extrabold text-amber-500/80 tracking-wide uppercase -mb-0.5 select-none">
                      {meta.romaji}
                    </span>
                  )}
                  <span>{getCardDisplay(card)}</span>
                </button>
              );
            })
          ) : (
            <span className="text-xs font-bold text-claude-text-muted/65 italic select-none">
              Tap word cards from pool below to assemble...
            </span>
          )}
        </div>

        {/* Shuffled Word Cards Pool */}
        <div className="space-y-3">
          <div className="flex justify-between items-baseline px-1 flex-wrap gap-2">
            <span className="text-[8px] font-black uppercase text-claude-text-muted tracking-widest block">Available Words Pool</span>
            {difficulty === 'hard' && (
              <span className="text-[7px] font-black uppercase text-claude-coral/80 bg-claude-coral/5 px-2 py-0.5 rounded border border-claude-coral/10">
                Word definition tooltips active on cards
              </span>
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
                  className="px-4 py-2.5 bg-claude-sidebar hover:bg-claude-card border border-claude-border hover:border-claude-coral/45 text-[#f2f0ea] font-extrabold text-sm rounded-xl cursor-pointer transition-all active:scale-95 hover:scale-[1.03] shadow-xs flex flex-col items-center relative group"
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
                    <span className="text-[7px] font-extrabold text-amber-500/80 tracking-wide uppercase -mb-0.5 select-none">
                      {meta.romaji}
                    </span>
                  )}
                  <span>{getCardDisplay(card)}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Correct Grammar Formula Banner display */}
        {checked && isCorrect && activeLesson.pattern && (
          <div className="bg-amber-500/5 border border-amber-500/25 p-3 rounded-2xl text-center animate-fade-in">
            <span className="text-[8px] font-black uppercase text-amber-500/80 tracking-wider block">Grammar Pattern Formula</span>
            <span className="font-extrabold text-xs text-amber-500">
              {activeLesson.pattern}
            </span>
          </div>
        )}

        {/* Feedback Messages Panel */}
        {checked && (
          <div className={`p-4 rounded-2xl border flex items-start gap-3 animate-fade-in ${
            isCorrect 
              ? 'bg-emerald-600/5 border-emerald-600/35 text-emerald-500' 
              : 'bg-red-600/5 border-red-600/35 text-red-500'
          }`}>
            <span className="text-lg">{isCorrect ? '🔥' : '⚠️'}</span>
            <div className="flex-1 space-y-1">
              <span className="text-[9px] font-black uppercase tracking-wider block">
                {isCorrect ? 'Correct Assembly!' : 'Study Help / 文法解説'}
              </span>
              <p className="text-xs font-bold leading-normal">
                {isCorrect 
                  ? `Sheesh, you cooked that sequence perfectly! +${difficulty === 'easy' ? '10' : difficulty === 'medium' ? '20' : '30'} XP awarded.` 
                  : `Incorrect sequence order. Remember: ${activeLesson.tip}`}
              </p>
            </div>
          </div>
        )}

        {/* Control Action Buttons */}
        <div className="flex gap-3 pt-1">
          {/* Tip Button */}
          {!checked && (
            <button
              onClick={() => setShowTip(!showTip)}
              className="px-4 py-3 bg-claude-sidebar border border-claude-border hover:bg-claude-card text-claude-text-muted hover:text-[#f2f0ea] font-extrabold text-xs rounded-xl cursor-pointer transition-colors"
            >
              {showTip ? 'Hide Hint 👁️' : 'Show Hint 💡'}
            </button>
          )}

          {/* Check / Next Button */}
          {!checked ? (
            <button
              onClick={handleCheck}
              disabled={assembledSlots.length === 0}
              className={`flex-1 py-3 bg-claude-coral hover:bg-claude-coral/95 text-white font-black text-xs rounded-xl shadow-md cursor-pointer transition-transform active:scale-95 flex items-center justify-center gap-1.5 ${
                assembledSlots.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Check Sentence 🔍
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex-1 py-3 bg-claude-coral hover:bg-claude-coral/95 text-white font-black text-xs rounded-xl shadow-md cursor-pointer transition-transform active:scale-95 flex items-center justify-center gap-1.5"
            >
              {currentLevel < sessionLessons.length - 1 ? 'Advance Level ➡️' : 'Complete Quest 🏆'}
            </button>
          )}
        </div>

        {/* Hint tip panel display */}
        {showTip && (
          <div className="bg-amber-500/5 border border-amber-500/25 text-amber-500 p-3.5 rounded-xl text-[11px] font-bold leading-normal animate-fade-in">
            💡 <strong>Hint:</strong> {activeLesson.tip}
          </div>
        )}

      </div>
    </div>
  );
}
