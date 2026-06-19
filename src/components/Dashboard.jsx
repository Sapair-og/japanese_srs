/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { kanjiList } from '../utils/kanjiData';
import Footer from './Footer';

const calculateLevelInfo = (totalCorrect) => {
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
};

// Mascot SVGs
// Mascot SVGs
const BookMascot = () => (
  <svg viewBox="0 0 100 100" className="w-20 h-20 text-claude-text-muted/15 absolute right-4 bottom-2 pointer-events-none transition-transform group-hover:scale-110">
    <path fill="currentColor" d="M12 25 Q12 18 20 18 H50 V82 H20 Q12 82 12 75 Z" />
    <path fill="currentColor" d="M88 25 Q88 18 80 18 H50 V82 H80 Q88 82 88 75 Z" opacity="0.8" />
    <path stroke="currentColor" strokeWidth="3" strokeLinecap="round" d="M22 30 H42 M22 42 H42 M22 54 H42" opacity="0.6" />
    <path stroke="currentColor" strokeWidth="3" strokeLinecap="round" d="M78 30 H58 M78 42 H58 M78 54 H58" opacity="0.6" />
    <circle cx="50" cy="50" r="8" className="text-claude-coral fill-current animate-pulse" />
  </svg>
);

const GateMascot = () => (
  <svg viewBox="0 0 100 100" className="w-20 h-20 text-claude-text-muted/15 absolute right-4 bottom-2 pointer-events-none transition-transform group-hover:scale-110">
    <path fill="currentColor" d="M10 25 Q50 35 90 25 L90 35 Q50 45 10 35 Z" />
    <path fill="currentColor" d="M20 50 H80 V58 H20 Z" />
    <path fill="currentColor" d="M30 35 L33 90 H43 L40 35 Z" />
    <path fill="currentColor" d="M70 35 L67 90 H57 L60 35 Z" />
    <rect x="27" y="85" width="10" height="5" rx="1" fill="currentColor" opacity="0.8" />
    <rect x="63" y="85" width="10" height="5" rx="1" fill="currentColor" opacity="0.8" />
  </svg>
);

const WelcomeMascot = () => (
  <svg viewBox="0 0 100 100" className="w-24 h-24 text-claude-coral fill-current shrink-0">
    <circle cx="50" cy="45" r="30" className="text-claude-coral/10 fill-current" />
    {/* Turtle Shell shape */}
    <path d="M50 15 C30 15 20 30 20 45 C20 48 30 52 50 52 C70 52 80 48 80 45 C80 30 70 15 50 15 Z" fill="#22c55e" />
    {/* Shell patterns */}
    <path d="M50 15 L50 52 M35 22 L50 35 L65 22 M25 35 L40 42 L60 42 L75 35" stroke="#166534" strokeWidth="2" fill="none" />
    {/* Flippers */}
    <ellipse cx="15" cy="50" rx="8" ry="4" transform="rotate(-20 15 50)" fill="#15803d" />
    <ellipse cx="85" cy="50" rx="8" ry="4" transform="rotate(20 85 50)" fill="#15803d" />
    {/* Head */}
    <circle cx="50" cy="65" r="14" fill="#16a34a" />
    {/* Eyes */}
    <circle cx="45" cy="63" r="2" fill="#000" />
    <circle cx="55" cy="63" r="2" fill="#000" />
    {/* Smile */}
    <path d="M47 70 Q50 73 53 70" stroke="#000" strokeWidth="1.5" fill="none" />
    {/* Cute cheeks */}
    <circle cx="41" cy="67" r="1.5" className="text-claude-coral fill-current" />
    <circle cx="59" cy="67" r="1.5" className="text-claude-coral fill-current" />
  </svg>
);

export default function Dashboard({ 
  stats, 
  vocabList = [], 
  reviewSessions = [],
  onStartSession, 
  onLoadDemo, 
  onClearAll, 
  onClearStats,
  setActiveTab,
  difficulty,
  setDifficulty,
  sessionLimit,
  setSessionLimit,
  profile,
  onResetConfig,
  studiedDates = [],
  onTriggerPreview,
  isAdmin
}) {
  const now = new Date();
  const dueReviewsCount = vocabList ? vocabList.filter(c => c.nextReview && new Date(c.nextReview) <= now).length : 0;
  const lessonsCount = vocabList ? vocabList.filter(c => !c.nextReview).length : 0;
  const [showSettings, setShowSettings] = useState(false);
  const hasCards = vocabList && vocabList.length > 0;
  
  const { level, xp, xpInCurrentLevel, xpForNextLevel, progressPercent } = calculateLevelInfo(stats?.totalCorrect || 0);

  const [sessionHistory, setSessionHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('jp_vocab_session_history');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    const handleUpdate = () => {
      try {
        const saved = localStorage.getItem('jp_vocab_session_history');
        setSessionHistory(saved ? JSON.parse(saved) : []);
      } catch (e) {
        setSessionHistory([]);
      }
    };
    window.addEventListener('jp_vocab_history_updated', handleUpdate);
    return () => {
      window.removeEventListener('jp_vocab_history_updated', handleUpdate);
    };
  }, []);

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear your study session logs? This cannot be undone.")) {
      localStorage.removeItem('jp_vocab_session_history');
      setSessionHistory([]);
      window.dispatchEvent(new Event('jp_vocab_history_updated'));
    }
  };

  // 1. Calculate Active Item Spread (Apprentice, Guru, Master, Enlightened, Burned)
  const srsSpread = { apprentice: 0, guru: 0, master: 0, enlightened: 0, burned: 0, locked: 0 };
  vocabList.forEach(c => {
    if (!c.nextReview) {
      srsSpread.locked += 1;
    } else {
      const reps = c.repetitions || 0;
      if (reps >= 1 && reps <= 4) srsSpread.apprentice += 1;
      else if (reps >= 5 && reps <= 6) srsSpread.guru += 1;
      else if (reps === 7) srsSpread.master += 1;
      else if (reps === 8) srsSpread.enlightened += 1;
      else if (reps >= 9) srsSpread.burned += 1;
      else srsSpread.locked += 1;
    }
  });

  // 2. Level Progress (Guru completion counts inside the database)
  const guruKanji = kanjiList ? kanjiList.filter(k => 
    vocabList.some(v => v.repetitions >= 5 && v.kanji && v.kanji.includes(k.character))
  ).length : 0;
  const guruVocab = vocabList ? vocabList.filter(v => v.repetitions >= 5).length : 0;

  // Level Progression targets (scale dynamically)
  const kanjiTarget = Math.max(15, level * 10);
  const vocabTarget = Math.max(30, level * 20);

  const kanjiProgress = Math.min(100, Math.round((guruKanji / kanjiTarget) * 100));
  const vocabProgress = Math.min(100, Math.round((guruVocab / vocabTarget) * 100));

  // Reviews Completed Today (completed since 12:00 AM)
  const todayStr = now.toISOString().split('T')[0];
  const reviewsToday = reviewSessions
    .filter(s => s.session_date === todayStr)
    .reduce((sum, s) => sum + s.cards_reviewed, 0);

  return (
    <div className="max-w-6xl mx-auto w-full px-4 py-6 md:py-10 animate-fade-in space-y-8 select-none">
      
      {/* Top Banner Greeting (WaniKani Style) */}
      <div className="relative overflow-hidden bg-claude-card border border-claude-border rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-xs">
        <div className="flex items-center gap-6 text-center md:text-left z-10 flex-1 flex-col md:flex-row">
          <WelcomeMascot />
          <div className="space-y-1">
            <h1 className="text-3xl font-black tracking-tight text-claude-text-heading">
              Konnichiwa, {profile?.name || 'Learner'}! 👋
            </h1>
            <p className="text-xs md:text-sm text-claude-text-muted font-bold max-w-xl">
              Level {level} • {profile?.title || 'Chibi Student'}
            </p>
            <p className="text-xs text-claude-text-muted/80 max-w-xl pt-1.5">
              Welcome back to your personalized Japanese spaced-repetition study panel.
            </p>
          </div>
        </div>

        {/* Level Widget */}
        <div className="z-10 bg-claude-bg border border-claude-border p-4 rounded-2xl flex items-center gap-3.5 min-w-[240px] w-full sm:w-auto shadow-inner shrink-0">
          <div className="w-12 h-12 rounded-xl bg-claude-coral text-white flex items-center justify-center text-xl font-black shadow shrink-0 select-none">
            {level}
          </div>
          <div className="flex-1 space-y-1 min-w-0">
            <div className="flex justify-between items-baseline gap-2">
              <span className="text-[9px] font-black text-claude-coral uppercase tracking-widest truncate">Level Progress</span>
              <span className="text-[9px] font-bold text-claude-text-muted shrink-0">{xpInCurrentLevel}/{xpForNextLevel} XP</span>
            </div>
            <div className="w-full h-2.5 bg-claude-card rounded-full overflow-hidden border border-claude-border">
              <div 
                className="h-full bg-claude-coral rounded-full transition-all duration-500 shadow-xs" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-[8px] text-claude-text-muted font-bold block select-none">
              {xpForNextLevel - xpInCurrentLevel} XP to Level {level + 1}
            </span>
          </div>
        </div>

        {/* Settings Gear Button inside Banner */}
        <button
          onClick={() => setShowSettings(true)}
          className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-claude-bg hover:bg-claude-border/50 border border-claude-border flex items-center justify-center text-xs hover:text-claude-coral transition-colors cursor-pointer shadow-xs z-20"
          title="Database Actions"
        >
          ⚙️
        </button>
      </div>

      {/* Grid: Lessons & Reviews panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Lessons Panel */}
        {lessonsCount > 0 ? (
          <div className="group relative bg-claude-card text-claude-text-heading rounded-3xl p-6 flex flex-col justify-between min-h-[160px] shadow hover:shadow-lg transition-all border border-claude-border/80 overflow-hidden">
            <BookMascot />
            <div className="z-10">
              <span className="text-5xl font-black block tracking-tight text-sky-500">{lessonsCount}</span>
              <h2 className="text-lg font-black tracking-tight mt-1">Lessons</h2>
              <p className="text-[10px] text-claude-text-muted font-bold max-w-[200px] mt-0.5">
                New vocabulary items waiting to be learned.
              </p>
            </div>
            <button
              onClick={() => onStartSession(null, false, true)}
              className="z-10 w-full sm:w-auto px-5 py-2.5 bg-sky-500 hover:bg-sky-655 text-white font-extrabold text-[11px] uppercase tracking-wider rounded-xl cursor-pointer border border-sky-400/50 transition-colors text-center mt-4 self-start shadow"
            >
              Start Lessons ✒️
            </button>
          </div>
        ) : (
          <div className="relative bg-claude-card text-claude-text-muted rounded-3xl p-6 flex flex-col justify-between min-h-[160px] border border-claude-border/80 overflow-hidden opacity-60">
            <BookMascot />
            <div>
              <span className="text-5xl font-black block tracking-tight text-claude-text-muted/40">0</span>
              <h2 className="text-lg font-black tracking-tight mt-1 text-claude-text-muted">Lessons</h2>
              <p className="text-[10px] font-bold max-w-[240px] mt-0.5 text-claude-text-muted/70">
                You are completely caught up! No new items to learn.
              </p>
            </div>
            <button
              disabled
              className="w-full sm:w-auto px-5 py-2.5 bg-claude-bg text-claude-text-muted/50 font-extrabold text-[11px] uppercase tracking-wider rounded-xl border border-claude-border text-center mt-4 self-start cursor-not-allowed"
            >
              No Lessons
            </button>
          </div>
        )}

        {/* Reviews Panel */}
        {dueReviewsCount > 0 ? (
          <div className="group relative bg-claude-card text-claude-text-heading rounded-3xl p-6 flex flex-col justify-between min-h-[160px] shadow hover:shadow-lg transition-all border border-claude-border/80 overflow-hidden">
            <GateMascot />
            <div className="z-10">
              <span className="text-5xl font-black block tracking-tight text-claude-coral">{dueReviewsCount}</span>
              <h2 className="text-lg font-black tracking-tight mt-1">Reviews</h2>
              <p className="text-[10px] text-claude-text-muted font-bold max-w-[200px] mt-0.5">
                SRS learning cards due for memory retrieval.
              </p>
            </div>
            <button
              onClick={() => onStartSession(null, true, false)}
              className="z-10 w-full sm:w-auto px-5 py-2.5 bg-claude-coral hover:opacity-90 text-white font-extrabold text-[11px] uppercase tracking-wider rounded-xl cursor-pointer border border-claude-coral/45 transition-colors text-center mt-4 self-start shadow"
            >
              Start Reviews ⏱️
            </button>
          </div>
        ) : (
          <div className="relative bg-claude-card text-claude-text-muted rounded-3xl p-6 flex flex-col justify-between min-h-[160px] border border-claude-border/80 overflow-hidden opacity-60">
            <GateMascot />
            <div>
              <span className="text-5xl font-black block tracking-tight text-claude-text-muted/40">0</span>
              <h2 className="text-lg font-black tracking-tight mt-1 text-claude-text-muted">Reviews</h2>
              <p className="text-[10px] font-bold max-w-[240px] mt-0.5 text-claude-text-muted/70">
                Nice job! You have cleared all reviews currently due.
              </p>
            </div>
            <button
              disabled
              className="w-full sm:w-auto px-5 py-2.5 bg-claude-bg text-claude-text-muted/50 font-extrabold text-[11px] uppercase tracking-wider rounded-xl border border-claude-border text-center mt-4 self-start cursor-not-allowed"
            >
              All Caught Up 🎉
            </button>
          </div>
        )}
      </div>
           {/* Grid: Streak Consistency & Reviews Completed Today */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Weekly Consistency Streaks with Turtle icons */}
        <div className="bg-claude-card border border-claude-border p-5 rounded-3xl shadow-xs space-y-4 md:col-span-2">
          <div className="flex justify-between items-center border-b border-claude-border pb-2">
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-claude-coral block">
              Consistency Streak
            </span>
            <span className="text-[9px] font-black text-claude-text-muted uppercase tracking-widest">
              🐢 weekly consistency
            </span>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {(() => {
              const dateNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
              const days = [];
              for (let i = 6; i >= 0; i--) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                const dateString = d.toISOString().split('T')[0];
                const dayName = dateNames[d.getDay()];
                const dayNum = d.getDate();
                const isStudied = studiedDates.includes(dateString);
                days.push({ dateString, dayName, dayNum, isStudied });
              }
              return days.map((day) => (
                <div 
                  key={day.dateString}
                  className="flex flex-col items-center gap-1.5"
                  title={day.isStudied ? `Studied on ${day.dateString}` : `No reviews on ${day.dateString}`}
                >
                  <span className="text-[8px] font-extrabold text-claude-text-muted uppercase">{day.dayName}</span>
                  <div 
                    className={`w-full aspect-square rounded-xl border flex flex-col items-center justify-center transition-all duration-300 relative ${
                      day.isStudied
                        ? 'bg-emerald-500/10 border-emerald-500/35 text-emerald-600 dark:text-emerald-450 font-black shadow-xs scale-105'
                        : 'bg-claude-bg border-claude-border text-claude-text-muted'
                    }`}
                  >
                    <span className="text-xs font-bold leading-none">{day.dayNum}</span>
                    {day.isStudied && (
                      <span className="text-[9px] absolute -bottom-1 -right-1" title="Studied! 🐢">
                        🐢
                      </span>
                    )}
                  </div>
                </div>
              ));
            })()}
          </div>
          <p className="text-[10px] text-claude-text-muted font-bold text-center">
            {stats.streak > 0 
              ? `🔥 Current Streak: ${stats.streak} Days! Keep it up!` 
              : `📅 Study today to start your weekly consistency map!`}
          </p>
        </div>

        {/* Reviews Completed Today */}
        <div className="bg-claude-card border border-claude-border p-5 rounded-3xl shadow-xs flex flex-col justify-between min-h-[140px]">
          <div className="flex justify-between items-center border-b border-claude-border pb-2">
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-claude-coral block">
              Today's Volume
            </span>
            <span className="text-[8px] font-black text-claude-text-muted uppercase">accuracy: {stats.totalAttempts > 0 ? Math.round((stats.totalCorrect / stats.totalAttempts) * 100) : 0}%</span>
          </div>

          <div className="py-2 text-center">
            <span className="text-4xl font-black text-claude-text-heading block">{reviewsToday}</span>
            <span className="text-[10px] font-black text-claude-text-muted uppercase tracking-wide block mt-1">
              Reviews completed today
            </span>
          </div>

          <p className="text-[9px] text-claude-text-muted leading-relaxed text-center pt-2 border-t border-claude-border">
            Every correct session builds stable recall paths!
          </p>
        </div>

      </div>

      {/* Row: Level Progress & Active Item Spread */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

        {/* Level Progress Bars (Radicals/Kanji/Vocabulary) (5 columns) */}
        <div className="md:col-span-5 bg-claude-card border border-claude-border p-5 sm:p-6 rounded-3xl shadow-xs flex flex-col justify-between space-y-5">
          <div>
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-claude-coral block">
              Current Level Progress
            </span>
            <h3 className="text-sm font-black text-claude-text-heading mt-0.5">
              Guru Completion Rate
            </h3>
          </div>

          <div className="space-y-3.5">
             <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold">
                <span className="text-sky-500 uppercase tracking-wider">🔷 Radicals</span>
                <span className="text-claude-text-muted">12 / 12 (100%)</span>
              </div>
              <div className="w-full h-3 bg-claude-bg rounded-full overflow-hidden border border-claude-border shadow-inner">
                <div className="bg-[#00a1f1] h-full rounded-full transition-all" style={{ width: '100%' }} />
              </div>
            </div>

            {/* Kanji (Pink) */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold">
                <span className="text-pink-500 uppercase tracking-wider">🌸 Kanji</span>
                <span className="text-claude-text-muted">{guruKanji} / {kanjiTarget} ({kanjiProgress}%)</span>
              </div>
              <div className="w-full h-3 bg-claude-bg rounded-full overflow-hidden border border-claude-border shadow-inner">
                <div className="bg-claude-coral h-full rounded-full transition-all" style={{ width: `${kanjiProgress}%` }} />
              </div>
            </div>

            {/* Vocabulary (Purple) */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold">
                <span className="text-purple-500 uppercase tracking-wider">🍆 Vocabulary</span>
                <span className="text-claude-text-muted">{guruVocab} / {vocabTarget} ({vocabProgress}%)</span>
              </div>
              <div className="w-full h-3 bg-claude-bg rounded-full overflow-hidden border border-claude-border shadow-inner">
                <div className="bg-[#a100f1] h-full rounded-full transition-all" style={{ width: `${vocabProgress}%` }} />
              </div>
            </div>
          </div>

          <p className="text-[8px] text-claude-text-muted font-bold border-t border-claude-border pt-3 text-center">
            Promote Kanji and Vocabulary to Guru stage to advance level!
          </p>
        </div>

        {/* Active SRS Spread Stage Chart (7 columns) */}
        <div className="md:col-span-7 bg-claude-card border border-claude-border p-5 sm:p-6 rounded-3xl shadow-xs flex flex-col justify-between space-y-5">
          <div>
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-claude-coral block">
              SRS Stage Spread
            </span>
            <h3 className="text-sm font-black text-claude-text-heading mt-0.5">
              Active Item Distribution
            </h3>
          </div>

          {/* Spread Bar Widget */}
          <div className="grid grid-cols-5 gap-2 select-none text-center">
            {/* Apprentice */}
            <div className="bg-pink-500/10 border border-pink-500/25 p-2.5 rounded-2xl flex flex-col justify-between hover:scale-[1.01] transition-transform">
              <span className="text-lg font-black text-[#f03e93] block">{srsSpread.apprentice}</span>
              <span className="text-[8px] font-black uppercase text-claude-text-muted tracking-wide mt-1 block">Apprentice</span>
              <div className="w-full h-1 bg-[#f03e93] rounded-full mt-2" />
            </div>

            {/* Guru */}
            <div className="bg-purple-500/10 border border-purple-500/25 p-2.5 rounded-2xl flex flex-col justify-between hover:scale-[1.01] transition-transform">
              <span className="text-lg font-black text-[#9834e2] block">{srsSpread.guru}</span>
              <span className="text-[8px] font-black uppercase text-claude-text-muted tracking-wide mt-1 block">Guru</span>
              <div className="w-full h-1 bg-[#9834e2] rounded-full mt-2" />
            </div>

            {/* Master */}
            <div className="bg-blue-500/10 border border-blue-500/25 p-2.5 rounded-2xl flex flex-col justify-between hover:scale-[1.01] transition-transform">
              <span className="text-lg font-black text-[#294a6b] dark:text-sky-350 block">{srsSpread.master}</span>
              <span className="text-[8px] font-black uppercase text-claude-text-muted tracking-wide mt-1 block">Master</span>
              <div className="w-full h-1 bg-[#294a6b] dark:bg-sky-400 rounded-full mt-2" />
            </div>

            {/* Enlightened */}
            <div className="bg-sky-500/10 border border-sky-500/25 p-2.5 rounded-2xl flex flex-col justify-between hover:scale-[1.01] transition-transform">
              <span className="text-lg font-black text-[#0093dd] block">{srsSpread.enlightened}</span>
              <span className="text-[8px] font-black uppercase text-claude-text-muted tracking-wide mt-1 block">Enlightened</span>
              <div className="w-full h-1 bg-[#0093dd] rounded-full mt-2" />
            </div>

            {/* Burned */}
            <div className="bg-claude-bg border border-claude-border p-2.5 rounded-2xl flex flex-col justify-between hover:scale-[1.01] transition-transform">
              <span className="text-lg font-black text-claude-text-heading block">{srsSpread.burned}</span>
              <span className="text-[8px] font-black uppercase text-claude-text-muted tracking-wide mt-1 block">Burned</span>
              <div className="w-full h-1 bg-[#434343] dark:bg-zinc-500 rounded-full mt-2" />
            </div>
          </div>

          <p className="text-[8px] text-claude-text-muted font-bold border-t border-claude-border pt-3 text-center italic">
            Locked / unstudied library items: <span className="text-claude-text-heading font-black">{srsSpread.locked} items</span>
          </p>
        </div>

      </div>

      {/* Recent Study Sessions Logs Panel */}
      <div className="bg-claude-card border border-claude-border rounded-3xl p-5 sm:p-8 space-y-4 shadow-xs">
        <div className="flex justify-between items-center border-b border-claude-border pb-2.5">
          <div>
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-claude-coral">Performance History</span>
            <h3 className="text-lg font-black text-claude-text-heading mt-0.5">Recent Study Sessions</h3>
          </div>
          {sessionHistory.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="text-[9px] font-extrabold text-claude-text-muted hover:text-red-500 bg-claude-bg border border-claude-border px-3.5 py-1.5 rounded-xl transition-all cursor-pointer"
            >
              Clear Logs 🗑️
            </button>
          )}
        </div>

        {sessionHistory.length > 0 ? (
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
            {sessionHistory.map((session) => {
              const date = new Date(session.timestamp);
              const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              const dateString = date.toLocaleDateString([], { month: 'short', day: 'numeric' });
              
              let commentText = "Study completed! 💅";
              if (session.timeouts === 0) {
                if (session.avgSpeed < 2.5) commentText = "Insanely fast session! Cracked! ⚡🔥";
                else commentText = "Clean run, zero timeouts 🌸";
              } else if (session.timeouts > 3) {
                commentText = "A few timeouts occurred, stay focused! 🦖";
              }

              return (
                <div
                  key={session.id}
                  className="p-4 bg-claude-bg border border-claude-border rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:opacity-95 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-claude-coral/10 border border-claude-coral/25 flex items-center justify-center text-sm shadow-xs shrink-0">
                      ⏱️
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-black text-claude-text-heading">
                          Reviewed {session.totalCards} Words
                        </span>
                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded border ${
                          session.difficulty === 'hard'
                            ? 'bg-red-500/10 border-red-500/20 text-red-500'
                            : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                        }`}>
                          {session.difficulty === 'hard' ? 'Hard' : 'Easy'}
                        </span>
                      </div>
                      <span className="text-[9px] text-claude-text-muted font-bold block mt-0.5">
                        {dateString} at {timeString} • {commentText}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-right justify-between sm:justify-end border-t sm:border-t-0 border-claude-border pt-2 sm:pt-0">
                    <div>
                      <span className="text-[8px] uppercase font-black text-claude-text-muted block">Duration</span>
                      <span className="text-xs font-black text-claude-text-heading">{session.duration}s</span>
                    </div>
                    <div>
                      <span className="text-[8px] uppercase font-black text-claude-text-muted block">Avg Speed</span>
                      <span className="text-xs font-black text-claude-text-heading">{session.avgSpeed}s</span>
                    </div>
                    <div>
                      <span className="text-[8px] uppercase font-black text-claude-text-muted block">Timeouts</span>
                      <span className={`text-xs font-black ${session.timeouts > 0 ? 'text-red-500' : 'text-claude-text-heading'}`}>
                        {session.timeouts}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center text-claude-text-muted border border-dashed border-claude-border rounded-2xl select-none space-y-2">
            <span className="text-2xl block">📊</span>
            <p className="text-xs font-black text-claude-text-heading">No Study Logs Yet</p>
            <p className="text-[10px] text-claude-text-muted/80 leading-relaxed max-w-xs mx-auto">
              Finish your first vocabulary review session in the Study Arena to track your duration, average speed, and timeout stats.
            </p>
          </div>
        )}
      </div>

      {/* Dashboard Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[100] flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0" onClick={() => setShowSettings(false)} />
          <div className="bg-claude-card border border-claude-border w-full max-w-sm rounded-3xl p-6 relative z-10 flex flex-col gap-4 animate-fade-in shadow-2xl">
            <div className="flex justify-between items-center border-b border-claude-border pb-2.5">
              <h3 className="font-black text-xs uppercase tracking-wider text-claude-text-heading">
                Database Settings
              </h3>
              <button 
                onClick={() => setShowSettings(false)}
                className="text-claude-text-muted hover:text-claude-text-heading text-xs font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-[9px] text-claude-text-muted leading-relaxed uppercase tracking-wider font-black">
                Vocabulary Database Actions
              </p>
              
              <div className="space-y-2.5">
                {isAdmin && (
                  <>
                    <button
                      onClick={() => {
                        onLoadDemo();
                        setShowSettings(false);
                      }}
                      className="w-full text-left px-4 py-3 bg-claude-bg hover:opacity-90 rounded-xl border border-claude-border transition-colors flex items-center justify-between cursor-pointer group"
                    >
                      <div>
                        <span className="text-xs font-black text-claude-text-heading block">Load Demo Vocabulary</span>
                        <span className="text-[9px] text-claude-text-muted block mt-0.5">Populate database with 20 JLPT cards</span>
                      </div>
                      <span className="text-sm group-hover:translate-x-0.5 transition-transform">📚</span>
                    </button>

                    <button
                      onClick={() => {
                        onClearAll();
                        setShowSettings(false);
                      }}
                      className="w-full text-left px-4 py-3 bg-red-500/5 hover:bg-red-500/10 rounded-xl border border-red-500/20 transition-colors flex items-center justify-between cursor-pointer group"
                    >
                      <div>
                        <span className="text-xs font-black text-red-500 block">Reset All Lists & Stats</span>
                        <span className="text-[9px] text-red-400 block mt-0.5">Deletes all vocabulary and statistics permanently</span>
                      </div>
                      <span className="text-sm group-hover:scale-110 transition-transform">⚠️</span>
                    </button>
                  </>
                )}

                {/* Progress reset for current user */}
                <button
                  onClick={() => {
                    onClearStats();
                    setShowSettings(false);
                  }}
                  className="w-full text-left px-4 py-3 bg-amber-500/5 hover:bg-amber-500/10 rounded-xl border border-amber-500/20 transition-colors flex items-center justify-between cursor-pointer group"
                >
                  <div>
                    <span className="text-xs font-black text-amber-600 dark:text-amber-500 block">Reset My Study Progress & Heatmap</span>
                    <span className="text-[9px] text-amber-500/70 block mt-0.5">Resets your personal score stats and learning dates to zero</span>
                  </div>
                  <span className="text-sm group-hover:scale-110 transition-transform">🔄</span>
                </button>

                <button
                  onClick={() => {
                    handleClearHistory();
                    setShowSettings(false);
                  }}
                  className="w-full text-left px-4 py-3 bg-red-500/5 hover:bg-red-500/10 rounded-xl border border-red-500/20 transition-colors flex items-center justify-between cursor-pointer group"
                >
                  <div>
                    <span className="text-xs font-black text-red-400 block">Clear Study Logs</span>
                    <span className="text-[9px] text-red-400/70 block mt-0.5">Deletes all previous study performance history records</span>
                  </div>
                  <span className="text-sm group-hover:scale-110 transition-transform">🗑️</span>
                </button>

                {isAdmin && (
                  <>
                    <p className="text-[9px] text-claude-text-muted leading-relaxed uppercase tracking-wider font-black mt-3 border-t border-claude-border pt-3">
                      Error Page Previews 💀
                    </p>
                    
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => {
                          onTriggerPreview('404');
                          setShowSettings(false);
                        }}
                        className="py-2 bg-claude-bg border border-claude-border rounded-xl text-[9px] font-black hover:border-claude-coral transition-colors cursor-pointer text-center text-claude-text-heading"
                      >
                        🪦 404
                      </button>
                      <button
                        onClick={() => {
                          onTriggerPreview('offline');
                          setShowSettings(false);
                        }}
                        className="py-2 bg-claude-bg border border-claude-border rounded-xl text-[9px] font-black hover:border-claude-coral transition-colors cursor-pointer text-center text-claude-text-heading"
                      >
                        🦖 Offline
                      </button>
                      <button
                        onClick={() => {
                          onTriggerPreview('database');
                          setShowSettings(false);
                        }}
                        className="py-2 bg-claude-bg border border-claude-border rounded-xl text-[9px] font-black hover:border-claude-coral transition-colors cursor-pointer text-center text-claude-text-heading"
                      >
                        👻 DB Error
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-claude-border">
              <button
                onClick={() => setShowSettings(false)}
                className="w-full px-4 py-2 bg-claude-bg border border-claude-border hover:opacity-90 rounded-xl text-[10px] font-black text-claude-text-heading transition-colors cursor-pointer text-center"
              >
                Close Settings
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
