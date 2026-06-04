import { useState } from 'react';

const lessons = [
  {
    id: 1,
    title: 'Topic Marker 「は」',
    concept: 'The particle は (pronounced "wa") marks the main topic of your sentence. It comes directly after the topic noun.',
    english: 'I am a student.',
    correctSequence: ['私', 'は', '学生', 'です'],
    shuffled: ['は', '学生', '私', 'です'],
    tip: 'Subject (私) + Topic Marker (は) + Description (学生) + Copula (です - is/am).'
  },
  {
    id: 2,
    title: 'Object Marker 「を」',
    concept: 'The particle を (pronounced "o") marks the direct object of the verb. It is placed after the noun that receives the action.',
    english: 'I drink water.',
    correctSequence: ['私', 'は', '水', 'を', '飲みます'],
    shuffled: ['を', '水', '飲みます', '私', 'は'],
    tip: 'Subject (私 は) + Object (水) + Object Marker (を) + Verb (飲みます - drink).'
  },
  {
    id: 3,
    title: 'Direction Marker 「に」',
    concept: 'The particle に (pronounced "ni") marks the destination, direction, or time of movement, translated as "to" or "at".',
    english: 'I go to school.',
    correctSequence: ['私', 'は', '学校', 'に', '行きます'],
    shuffled: ['学校', 'は', '行きます', 'に', '私'],
    tip: 'Subject (私 は) + Destination (学校) + Direction Marker (に) + Motion Verb (行きます - go).'
  },
  {
    id: 4,
    title: 'Desire Pattern 「〜たい」',
    concept: 'Replace the -masu ending of a verb with -tai to express "want to do" an action. Pair it with the object marker を or が.',
    english: 'I want to eat sushi.',
    correctSequence: ['私', 'は', '寿司', 'を', '食べたい', 'です'],
    shuffled: ['寿司', 'です', 'は', '私', 'を', '食べたい'],
    tip: 'Subject (私 は) + Object (寿司 を) + Desired Action (食べたい - want to eat) + Polite End (です).'
  }
];

const wordMetadata = {
  '私': { kana: 'わたし', romaji: 'watashi' },
  'は': { kana: 'は', romaji: 'wa' },
  'を': { kana: 'を', romaji: 'o' },
  'に': { kana: 'に', romaji: 'ni' },
  '学生': { kana: 'がくせい', romaji: 'gakusei' },
  'です': { kana: 'です', romaji: 'desu' },
  '水': { kana: 'みず', romaji: 'mizu' },
  '飲みます': { kana: 'のみます', romaji: 'nomimasu' },
  '学校': { kana: 'がっこう', romaji: 'gakkou' },
  '行きます': { kana: 'いきます', romaji: 'ikimasu' },
  '寿司': { kana: 'すし', romaji: 'sushi' },
  '食べたい': { kana: 'たべたい', romaji: 'tabetai' }
};

export default function GrammarDojo({ onGainXp }) {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [shuffledCards, setShuffledCards] = useState(lessons[0].shuffled);
  const [assembledSlots, setAssembledSlots] = useState([]);
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const [shake, setShake] = useState(false);
  const [finished, setFinished] = useState(false);
  const [displayMode, setDisplayMode] = useState('kanji'); // 'kanji', 'kana', 'romaji'

  const activeLesson = lessons[currentLevel];

  const getCardDisplay = (word) => {
    const meta = wordMetadata[word];
    if (!meta) return word;
    if (displayMode === 'kana') return meta.kana;
    if (displayMode === 'romaji') return meta.romaji;
    return word;
  };

  const handleCardClick = (card, source) => {
    if (checked) return; // disable during feedback
    setShowTip(false);

    if (source === 'shuffled') {
      // Move from shuffled pile to assembled slots
      setAssembledSlots([...assembledSlots, card]);
      // Remove first occurrence from shuffled cards
      const idx = shuffledCards.indexOf(card);
      if (idx !== -1) {
        const nextShuffled = [...shuffledCards];
        nextShuffled.splice(idx, 1);
        setShuffledCards(nextShuffled);
      }
    } else {
      // Return from assembled slots to shuffled cards
      setShuffledCards([...shuffledCards, card]);
      // Remove first occurrence from slots
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
      // Award XP via callback (worth 2 correct answers = +20 XP)
      onGainXp(2);
    } else {
      // Trigger card shake animation
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const handleNext = () => {
    setChecked(false);
    setIsCorrect(false);
    setAssembledSlots([]);

    if (currentLevel < lessons.length - 1) {
      const nextLevel = currentLevel + 1;
      setCurrentLevel(nextLevel);
      setShuffledCards(lessons[nextLevel].shuffled);
    } else {
      setFinished(true);
    }
  };

  const handleReset = () => {
    setCurrentLevel(0);
    setShuffledCards(lessons[0].shuffled);
    setAssembledSlots([]);
    setChecked(false);
    setIsCorrect(false);
    setShowTip(false);
    setFinished(false);
  };

  if (finished) {
    return (
      <div className="w-full max-w-xl claude-panel p-8 rounded-3xl text-center space-y-6 animate-fade-in relative overflow-hidden text-[#f2f0ea]">
        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-amber-400 via-claude-coral to-amber-400" />
        <div className="text-5xl">🏆</div>
        <h2 className="text-2xl font-black claude-serif">Sentence Dojo Mastered!</h2>
        <p className="text-xs text-claude-text-muted max-w-sm mx-auto leading-relaxed">
          No cap, you cooked the entire sentence grammar board! You now have a solid grip on basic Japanese word ordering and particles.
        </p>
        <div className="bg-claude-sidebar/40 border border-claude-border/50 rounded-2xl p-4 text-[11px] font-black text-claude-coral">
          🔥 Earned +80 XP total from all Dojo stages!
        </div>
        <button
          onClick={handleReset}
          className="px-6 py-3 bg-claude-coral hover:bg-claude-coral/90 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer transition-transform active:scale-95"
        >
          Restart Dojo Challenge
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl flex flex-col gap-5 animate-fade-in relative z-10 select-none text-[#f2f0ea]">
      {/* Lesson Progress Header */}
      <div className="claude-panel p-4 rounded-2xl flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-[8px] font-black uppercase tracking-widest text-claude-coral block">
            Sentence Dojo / 文章道場
          </span>
          <h2 className="text-xs font-black">
            Level {activeLesson.id}: {activeLesson.title}
          </h2>
        </div>

        {/* Display Mode Toggle Toolbar */}
        <div className="flex items-center gap-1 bg-claude-sidebar/40 border border-claude-border/60 p-1 rounded-xl shadow-inner select-none">
          <button
            onClick={() => setDisplayMode('kanji')}
            className={`px-3 py-1.5 text-[9px] font-black uppercase rounded-lg transition-all cursor-pointer ${
              displayMode === 'kanji'
                ? 'bg-claude-coral text-white shadow-md'
                : 'text-claude-text-muted hover:text-[#f2f0ea]'
            }`}
            title="Show Kanji card spelling"
          >
            漢字
          </button>
          <button
            onClick={() => setDisplayMode('kana')}
            className={`px-3 py-1.5 text-[9px] font-black uppercase rounded-lg transition-all cursor-pointer ${
              displayMode === 'kana'
                ? 'bg-claude-coral text-white shadow-md'
                : 'text-claude-text-muted hover:text-[#f2f0ea]'
            }`}
            title="Show Kana (Hiragana) card spelling"
          >
            かな
          </button>
          <button
            onClick={() => setDisplayMode('romaji')}
            className={`px-3 py-1.5 text-[9px] font-black uppercase rounded-lg transition-all cursor-pointer ${
              displayMode === 'romaji'
                ? 'bg-claude-coral text-white shadow-md'
                : 'text-claude-text-muted hover:text-[#f2f0ea]'
            }`}
            title="Show Romaji English spelling helpers"
          >
            Romaji
          </button>
        </div>

        {/* Progress Dots */}
        <div className="flex gap-1.5">
          {lessons.map((_, idx) => (
            <div
              key={idx}
              className={`w-3.5 h-1.5 rounded-full transition-all duration-300 ${
                idx === currentLevel
                  ? 'bg-claude-coral w-6'
                  : idx < currentLevel
                    ? 'bg-emerald-500'
                    : 'bg-claude-border'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main Board Arena */}
      <div className={`claude-panel p-6 rounded-3xl bg-claude-card relative overflow-hidden flex flex-col gap-6 transition-all ${
        checked ? (isCorrect ? 'border-emerald-600/60 shadow-emerald-950/10' : 'border-red-600/60 shadow-red-950/10') : 'border-claude-border'
      } ${shake ? 'animate-shake' : ''}`}>
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-claude-coral/50 to-transparent" />
        
        {/* Concept description box */}
        <div className="bg-claude-sidebar/40 border border-claude-border/40 rounded-2xl p-4 space-y-1.5">
          <span className="text-[9px] font-black uppercase text-amber-500 tracking-wider">Concept / 概念</span>
          <p className="text-xs leading-relaxed text-claude-text-muted">
            {activeLesson.concept}
          </p>
        </div>

        {/* English Prompt Prompt */}
        <div className="text-center space-y-1 py-1">
          <span className="text-[8px] font-black uppercase text-claude-text-muted tracking-widest block">English Translate Prompt</span>
          <h3 className="text-lg md:text-xl font-extrabold text-[#f2f0ea] italic">
            "{activeLesson.english}"
          </h3>
        </div>

        {/* Assembled Sentence Slots Zone */}
        <div className="min-h-16 border-2 border-dashed border-claude-border/70 rounded-2xl p-3 flex flex-wrap gap-2.5 items-center justify-center bg-claude-sidebar/10">
          {assembledSlots.length > 0 ? (
            assembledSlots.map((card, idx) => (
              <button
                key={idx}
                onClick={() => handleCardClick(card, 'assembled')}
                className="px-4 py-2.5 bg-claude-card border-2 border-claude-coral text-claude-coral font-extrabold text-sm rounded-xl cursor-pointer hover:bg-claude-coral/5 active:scale-95 transition-all shadow-sm"
              >
                {getCardDisplay(card)}
              </button>
            ))
          ) : (
            <span className="text-xs font-bold text-claude-text-muted/65 italic select-none">
              Tap word cards below to assemble...
            </span>
          )}
        </div>

        {/* Shuffled Word Cards Pool */}
        <div className="space-y-2.5">
          <span className="text-[8px] font-black uppercase text-claude-text-muted tracking-widest block text-center">Available Words Pool</span>
          <div className="flex flex-wrap gap-2.5 justify-center min-h-[48px]">
            {shuffledCards.map((card, idx) => (
              <button
                key={idx}
                onClick={() => handleCardClick(card, 'shuffled')}
                className="px-4 py-2.5 bg-claude-sidebar border border-claude-border hover:border-claude-coral/50 text-[#f2f0ea] font-extrabold text-sm rounded-xl cursor-pointer transition-all active:scale-95 hover:scale-[1.03] shadow-xs"
              >
                {getCardDisplay(card)}
              </button>
            ))}
          </div>
        </div>

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
                {isCorrect ? 'No Cap, Clean Assemble!' : 'Study Help / 文法解説'}
              </span>
              <p className="text-xs font-bold leading-normal">
                {isCorrect 
                  ? 'Sheesh, you cooked that sequence perfectly! +20 XP awarded.' 
                  : `Incorrect ordering. Remember: ${activeLesson.tip}`}
              </p>
            </div>
          </div>
        )}

        {/* Control Action Buttons */}
        <div className="flex gap-3 pt-2">
          {/* Tip Button */}
          {!checked && (
            <button
              onClick={() => setShowTip(!showTip)}
              className="px-4 py-3 bg-claude-sidebar border border-claude-border hover:bg-claude-card text-claude-text-muted hover:text-[#f2f0ea] font-extrabold text-xs rounded-xl cursor-pointer transition-colors"
            >
              {showTip ? 'Hide Hint 👁️' : 'Show Hint 💡'}
            </button>
          )}

          {/* Evaluate / Check Button */}
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
              {currentLevel < lessons.length - 1 ? 'Advance Level ➡️' : 'Complete Quest 🏆'}
            </button>
          )}
        </div>

        {/* Simple inline hint box display */}
        {showTip && (
          <div className="bg-amber-500/5 border border-amber-500/25 text-amber-500 p-3.5 rounded-xl text-[11px] font-bold leading-normal animate-fade-in">
            💡 <strong>Hint:</strong> {activeLesson.tip}
          </div>
        )}

      </div>
    </div>
  );
}
