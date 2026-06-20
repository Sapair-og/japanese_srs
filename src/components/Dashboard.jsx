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

// Mascot SVGs - Premium theme-responsive inline graphics representing WaniKani handdrawn illustrations
const LessonsMascot = () => (
  <svg viewBox="0 0 100 100" className="w-16 h-16 text-claude-coral fill-current shrink-0 select-none">
    <circle cx="50" cy="50" r="45" className="text-sky-500/10 fill-current" />
    {/* Girl head with black hair */}
    <path d="M50 20 C38 20 32 28 32 38 C32 44 34 50 38 53 L38 58 H62 L62 53 C66 50 68 44 68 38 C68 28 62 20 50 20 Z" fill="#1e293b" />
    <path d="M38 38 C38 38 41 44 50 44 C59 44 62 38 62 38 C62 44 59 49 50 49 C41 49 38 44 38 38 Z" fill="#fed7aa" />
    <circle cx="46" cy="35" r="1.5" fill="#000" />
    <circle cx="54" cy="35" r="1.5" fill="#000" />
    {/* Kimono */}
    <path d="M32 58 L18 82 H82 L68 58 Z" fill="#f43f5e" />
    <path d="M50 58 L50 82" stroke="#ffffff" strokeWidth="1.5" />
    {/* Little green turtle in hands */}
    <circle cx="50" cy="72" r="8" fill="#22c55e" stroke="#15803d" strokeWidth="1" />
    <path d="M46 72 H54 M50 68 V76" stroke="#166534" strokeWidth="1" />
    {/* Sparkles */}
    <path d="M22 28 L25 31 M25 28 L22 31 M75 28 L78 31 M78 28 L75 31" stroke="#eab308" strokeWidth="1.5" />
  </svg>
);

const ReviewsMascot = () => (
  <svg viewBox="0 0 100 100" className="w-16 h-16 text-claude-coral fill-current shrink-0 select-none">
    <circle cx="50" cy="50" r="45" className="text-claude-coral/10 fill-current" />
    {/* Ring of children holding hands */}
    <circle cx="34" cy="50" r="8" fill="#3b82f6" />
    <circle cx="66" cy="50" r="8" fill="#10b981" />
    <circle cx="50" cy="32" r="8" fill="#f59e0b" />
    <circle cx="50" cy="68" r="8" fill="#ec4899" />
    {/* Arms holding hands */}
    <path d="M34 50 Q50 32 50 32 Q50 68 34 50 Q50 68 50 68 Q66 50 50 68 Q66 50 50 32" stroke="currentColor" strokeWidth="2.5" fill="none" opacity="0.6" />
    {/* Center monster face */}
    <circle cx="50" cy="50" r="10" fill="#22c55e" />
    <circle cx="47" cy="48" r="1.2" fill="#000" />
    <circle cx="53" cy="48" r="1.2" fill="#000" />
    <path d="M48 53 Q50 55 52 53" stroke="#000" strokeWidth="1" fill="none" />
  </svg>
);

const ForecastMascot = () => (
  <svg viewBox="0 0 100 100" className="w-16 h-16 text-claude-text-heading fill-current shrink-0 select-none">
    <circle cx="50" cy="50" r="45" className="text-emerald-500/10 fill-current" />
    {/* Computer monitor */}
    <rect x="25" y="25" width="50" height="36" rx="4" fill="#475569" />
    <rect x="29" y="29" width="42" height="28" fill="#1e293b" />
    {/* Stand */}
    <path d="M45 61 L40 75 H60 L55 61 Z" fill="#334155" />
    {/* Grid / Chart lines inside screen */}
    <path d="M34 50 L42 38 L50 44 L58 34 L66 40" stroke="#10b981" strokeWidth="2" fill="none" strokeLinecap="round" />
    <circle cx="66" cy="40" r="2.5" fill="#f43f5e" />
    {/* Small person pointing */}
    <circle cx="80" cy="65" r="7" fill="#fed7aa" />
    <path d="M78 72 L70 85 H90 L82 72 Z" fill="#ef4444" />
    <path d="M73 70 Q62 65 65 62" stroke="#fed7aa" strokeWidth="2.5" strokeLinecap="round" fill="none" />
  </svg>
);

const SleepingMascot = () => (
  <svg viewBox="0 0 100 100" className="w-16 h-16 text-claude-coral fill-current shrink-0 select-none">
    <circle cx="50" cy="50" r="45" className="text-purple-500/10 fill-current" />
    {/* Pillow */}
    <rect x="20" y="32" width="22" height="14" rx="3" fill="#e2e8f0" />
    {/* Sleeping head */}
    <circle cx="34" cy="38" r="9" fill="#fed7aa" />
    <path d="M38 30 C30 30 28 35 28 42 H40 Z" fill="#1e293b" /> {/* hair */}
    {/* Closed eyes */}
    <path d="M32 39 Q34 41 36 39 M42 39" stroke="#000" strokeWidth="1" fill="none" />
    {/* ZZZ letters */}
    <text x="64" y="28" fontSize="9" fontWeight="bold" fill="currentColor" opacity="0.6">Z</text>
    <text x="73" y="22" fontSize="12" fontWeight="bold" fill="currentColor" opacity="0.8">Z</text>
    <text x="82" y="15" fontSize="15" fontWeight="bold" fill="currentColor">Z</text>
    {/* Bed & Blanket */}
    <rect x="15" y="46" width="70" height="38" rx="5" fill="#cbd5e1" />
    <rect x="35" y="46" width="50" height="38" rx="5" fill="#3b82f6" />
    {/* Sleeping green monster next to bed */}
    <path d="M68 62 C68 54 78 54 78 62 Z" fill="#22c55e" />
  </svg>
);

const DojoCommunityMascot = () => (
  <svg viewBox="0 0 100 100" className="w-16 h-16 text-claude-text-heading fill-current shrink-0 select-none">
    <circle cx="50" cy="50" r="45" className="text-amber-500/10 fill-current" />
    {/* Stone Monster */}
    <rect x="30" y="35" width="40" height="40" rx="8" fill="#64748b" />
    <circle cx="42" cy="48" r="4" fill="#000" />
    <circle cx="58" cy="48" r="4" fill="#000" />
    <circle cx="42" cy="48" r="1.5" fill="#fff" />
    <circle cx="58" cy="48" r="1.5" fill="#fff" />
    <path d="M40 60 Q50 52 60 60" stroke="#475569" strokeWidth="3" fill="none" />
    {/* Kids dancing around */}
    <circle cx="20" cy="62" r="5" fill="#f43f5e" />
    <path d="M15 72 L25 72 L20 85 Z" fill="#f43f5e" />
    <circle cx="80" cy="62" r="5" fill="#0ea5e9" />
    <path d="M75 72 L85 72 L80 85 Z" fill="#0ea5e9" />
  </svg>
);

const SpaceshipMascot = () => (
  <svg viewBox="0 0 100 100" className="w-20 h-20 text-white fill-current shrink-0 select-none">
    {/* Spaceship dome */}
    <path d="M50 15 C34 15 28 32 28 44 H72 C72 32 66 15 50 15 Z" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
    {/* Pilot head */}
    <circle cx="50" cy="34" r="8" fill="#fed7aa" />
    <circle cx="50" cy="34" r="9" fill="none" stroke="#22c55e" strokeWidth="2.5" /> {/* helmet */}
    {/* Spaceship body */}
    <ellipse cx="50" cy="52" rx="36" ry="12" fill="#22c55e" stroke="#166534" strokeWidth="1.5" />
    <ellipse cx="50" cy="52" rx="24" ry="6" fill="#15803d" />
    {/* Lights */}
    <circle cx="30" cy="52" r="2" fill="#eab308" />
    <circle cx="50" cy="55" r="2.5" fill="#eab308" />
    <circle cx="70" cy="52" r="2" fill="#eab308" />
    {/* Speed lines */}
    <path d="M10 38 H22 M6 48 H18 M8 58 H20 M88 48 H94" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" />
    {/* Floating papers */}
    <rect x="22" y="70" width="8" height="11" rx="1" fill="#fff" transform="rotate(15 22 70)" opacity="0.7" />
    <rect x="76" y="68" width="7" height="10" rx="1" fill="#fff" transform="rotate(-25 76 68)" opacity="0.6" />
  </svg>
);

const AccuracyGauge = ({ percentage }) => {
  const radius = 28;
  const strokeWidth = 5;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  return (
    <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="48"
          cy="48"
          r={radius}
          className="text-claude-border/40 fill-none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
        />
        <circle
          cx="48"
          cy="48"
          r={radius}
          className="text-claude-coral fill-none transition-all duration-500"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-xs font-black text-claude-text-heading leading-none">{percentage}%</span>
        <span className="text-[7px] font-black text-claude-text-muted uppercase mt-0.5">Correct</span>
      </div>
    </div>
  );
};

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

  // 1. Calculate Active Item Spread
  const srsSpread = { apprentice: 0, guru: 0, master: 0, enlightened: 0, burned: 0, locked: 0 };
  
  const detailedSpread = {
    app1: 0, app2: 0, app3: 0, app4: 0,
    guru1: 0, guru2: 0,
    master: 0,
    enlightened: 0
  };

  vocabList.forEach(c => {
    if (!c.nextReview) {
      srsSpread.locked += 1;
    } else {
      const reps = c.repetitions || 0;
      if (reps >= 1 && reps <= 4) {
        srsSpread.apprentice += 1;
        if (reps === 1) detailedSpread.app1 += 1;
        else if (reps === 2) detailedSpread.app2 += 1;
        else if (reps === 3) detailedSpread.app3 += 1;
        else if (reps === 4) detailedSpread.app4 += 1;
      }
      else if (reps >= 5 && reps <= 6) {
        srsSpread.guru += 1;
        if (reps === 5) detailedSpread.guru1 += 1;
        else if (reps === 6) detailedSpread.guru2 += 1;
      }
      else if (reps === 7) {
        srsSpread.master += 1;
        detailedSpread.master += 1;
      }
      else if (reps === 8) {
        srsSpread.enlightened += 1;
        detailedSpread.enlightened += 1;
      }
      else if (reps >= 9) {
        srsSpread.burned += 1;
      }
      else {
        srsSpread.locked += 1;
      }
    }
  });

  const spreadValues = Object.values(detailedSpread);
  const maxSpreadVal = Math.max(...spreadValues, 5);

  const barChartItems = [
    { label: 'I', count: detailedSpread.app1, group: 'apprentice' },
    { label: 'II', count: detailedSpread.app2, group: 'apprentice' },
    { label: 'III', count: detailedSpread.app3, group: 'apprentice' },
    { label: 'IV', count: detailedSpread.app4, group: 'apprentice' },
    { label: 'V', count: detailedSpread.guru1, group: 'guru' },
    { label: 'VI', count: detailedSpread.guru2, group: 'guru' },
    { label: 'VII', count: detailedSpread.master, group: 'master' },
    { label: 'VIII', count: detailedSpread.enlightened, group: 'enlightened' }
  ];

  // 2. Level Progress
  const guruKanji = kanjiList ? kanjiList.filter(k => 
    vocabList.some(v => v.repetitions >= 5 && v.kanji && v.kanji.includes(k.character))
  ).length : 0;
  const guruVocab = vocabList ? vocabList.filter(v => v.repetitions >= 5).length : 0;

  const kanjiTarget = Math.max(15, level * 10);
  const vocabTarget = Math.max(30, level * 20);

  const kanjiProgress = Math.min(100, Math.round((guruKanji / kanjiTarget) * 100));
  const vocabProgress = Math.min(100, Math.round((guruVocab / vocabTarget) * 100));

  // Reviews Completed Today
  const todayStr = now.toISOString().split('T')[0];
  const reviewsToday = reviewSessions
    .filter(s => s.session_date === todayStr)
    .reduce((sum, s) => sum + s.cards_reviewed, 0);

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  const reviewsYesterday = reviewSessions
    .filter(s => s.session_date === yesterdayStr)
    .reduce((sum, s) => sum + s.cards_reviewed, 0);

  // 7 Days accuracy
  const calculatePast7DaysAccuracy = () => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recent = reviewSessions.filter(s => new Date(s.session_date) >= sevenDaysAgo);
    const totalReviewed = recent.reduce((sum, s) => sum + s.cards_reviewed, 0);
    if (totalReviewed === 0) return stats.totalAttempts > 0 ? Math.round((stats.totalCorrect / stats.totalAttempts) * 100) : 0;
    
    const weightedSum = recent.reduce((sum, s) => {
      const rate = s.accuracy_rate > 1 ? s.accuracy_rate : s.accuracy_rate * 100;
      return sum + (s.cards_reviewed * rate);
    }, 0);
    return Math.round(weightedSum / totalReviewed);
  };
  const accuracy7Days = calculatePast7DaysAccuracy();

  // Streak calculations
  const bestStreak = (() => {
    const saved = localStorage.getItem('jp_vocab_best_streak') || 0;
    const current = stats.streak || 0;
    if (current > saved) {
      localStorage.setItem('jp_vocab_best_streak', current);
      return current;
    }
    return parseInt(saved);
  })();

  const getWeeklyCalendar = () => {
    const days = [];
    const dateNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateString = d.toISOString().split('T')[0];
      const isToday = i === 0;
      const dayName = isToday ? 'Today' : dateNames[d.getDay()];
      const isStudied = studiedDates.includes(dateString);
      days.push({ dayName, isStudied, isToday });
    }
    return days;
  };
  const weeklyDays = getWeeklyCalendar();

  // Forecast data slots
  const getForecastData = () => {
    const slots = [
      { label: 'Next 1h', count: 0 },
      { label: 'Next 4h', count: 0 },
      { label: 'Next 12h', count: 0 },
      { label: 'Next 24h', count: 0 }
    ];
    vocabList.forEach(c => {
      if (c.nextReview) {
        const diffMs = new Date(c.nextReview).getTime() - now.getTime();
        const diffHrs = diffMs / (1000 * 60 * 60);
        if (diffHrs > 0) {
          if (diffHrs <= 1) slots[0].count += 1;
          if (diffHrs <= 4) slots[1].count += 1;
          if (diffHrs <= 12) slots[2].count += 1;
          if (diffHrs <= 24) slots[3].count += 1;
        }
      }
    });
    return slots;
  };
  const forecastData = getForecastData();
  const hasUpcomingReviews = forecastData.some(s => s.count > 0);

  // Recent mistakes
  const recentMistakes = vocabList
    .filter(v => (v.wrongCount > 0 || v.wrong_count > 0) && v.nextReview)
    .sort((a, b) => ((b.wrongCount || b.wrong_count || 0) - (a.wrongCount || a.wrong_count || 0)))
    .slice(0, 3);

  // Total Days Studied
  const totalDaysStudied = studiedDates ? studiedDates.length : 0;
  const daysStudiedStr = String(totalDaysStudied).padStart(4, '0');
  
  // Format profile creation date or fallback
  const accountSince = profile?.created_at 
    ? new Date(profile.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Jun 19, 2026';

  const renderSegmentedProgressBar = (percentage) => {
    const totalSegments = 24;
    const filledSegments = Math.round((percentage / 100) * totalSegments);
    
    return (
      <div className="flex gap-1 w-full h-2.5 mt-2.5 select-none">
        {Array.from({ length: totalSegments }).map((_, i) => {
          const isFilled = i < filledSegments;
          return (
            <div
              key={i}
              className={`flex-1 h-full rounded-xs transition-all duration-300 ${
                isFilled
                  ? 'bg-claude-coral/95 shadow-xs'
                  : 'bg-claude-bg border border-claude-border/50'
              }`}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto w-full px-4 py-6 md:py-10 animate-fade-in space-y-8 select-none">
      
      {/* Top Banner Slim Greeting */}
      <div className="relative overflow-hidden bg-claude-card border border-claude-border rounded-3xl p-5 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-xs">
        <div className="flex items-center gap-4 text-center sm:text-left z-10 flex-col sm:flex-row">
          <div className="w-10 h-10 rounded-xl bg-claude-coral text-white flex items-center justify-center text-md font-black shadow shrink-0 select-none">
            {level}
          </div>
          <div>
            <h1 className="text-xl font-black text-claude-text-heading">
              Konnichiwa, {profile?.name || 'Learner'}! 👋
            </h1>
            <p className="text-[10px] text-claude-text-muted font-bold block mt-0.5">
              Level {level} • {profile?.title || 'Chibi Student'}
            </p>
          </div>
        </div>
        
        {/* Settings button */}
        <button
          onClick={() => setShowSettings(true)}
          className="w-8 h-8 rounded-xl bg-claude-bg hover:bg-claude-border/50 border border-claude-border flex items-center justify-center text-xs hover:text-claude-coral transition-colors cursor-pointer shadow-xs z-20"
          title="Database Actions"
        >
          ⚙️
        </button>
      </div>

      {/* Row 1: Lessons, Reviews, Forecast */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Lessons Card */}
        <div className="bg-claude-card border border-claude-border p-6 rounded-3xl shadow-xs flex items-center gap-6 relative min-h-[160px] overflow-hidden group">
          <LessonsMascot />
          <div className="flex-1 space-y-3 z-10">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-claude-text-muted uppercase tracking-wider">Today's Lessons</span>
                <span className="text-[10px] bg-claude-bg border border-claude-border text-claude-text-heading font-black px-2 py-0.5 rounded-full shrink-0">
                  {lessonsCount}
                </span>
              </div>
              <p className="text-[10.5px] text-claude-text-muted font-semibold mt-1">Learn something new.</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onStartSession(null, false, true)}
                className="px-4 py-2 bg-claude-coral text-white font-extrabold text-[10px] uppercase tracking-wider rounded-xl cursor-pointer hover:opacity-90 shadow-xs transition-all active:translate-y-0.5 shrink-0"
              >
                Start Lessons
              </button>
              <button
                onClick={() => onStartSession(null, false, true)}
                className="px-3.5 py-2 bg-claude-bg border border-claude-border text-claude-text-heading font-extrabold text-[10px] uppercase tracking-wider rounded-xl cursor-pointer hover:bg-claude-border/40 transition-all active:translate-y-0.5 shrink-0"
              >
                Advanced
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Card */}
        <div className="bg-claude-card border border-claude-border p-6 rounded-3xl shadow-xs flex items-center gap-6 relative min-h-[160px] overflow-hidden group">
          <ReviewsMascot />
          <div className="flex-1 space-y-3 z-10">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-claude-text-muted uppercase tracking-wider">Reviews</span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border shrink-0 ${
                  dueReviewsCount > 0 
                    ? 'bg-claude-coral/10 border-claude-coral/20 text-claude-coral animate-pulse'
                    : 'bg-claude-bg border-claude-border text-claude-text-muted'
                }`}>
                  {dueReviewsCount}
                </span>
              </div>
              <p className="text-[10.5px] text-claude-text-muted font-semibold mt-1">
                {dueReviewsCount > 0 ? "Retain your learned items." : "There are no more Reviews to do right now."}
              </p>
            </div>
            <div>
              {dueReviewsCount > 0 ? (
                <button
                  onClick={() => onStartSession(null, true, false)}
                  className="px-5 py-2 bg-claude-coral text-white font-extrabold text-[10px] uppercase tracking-wider rounded-xl cursor-pointer hover:opacity-90 shadow-xs transition-all active:translate-y-0.5"
                >
                  Start Reviews
                </button>
              ) : (
                <button
                  disabled
                  className="px-4 py-2 bg-claude-bg border border-claude-border text-claude-text-muted/50 font-extrabold text-[10px] uppercase tracking-wider rounded-xl cursor-not-allowed"
                >
                  All Caught Up 🎉
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Forecast Card */}
        <div className="bg-claude-card border border-claude-border p-6 rounded-3xl shadow-xs flex items-center gap-4 relative min-h-[160px] overflow-hidden">
          {hasUpcomingReviews ? (
            <div className="flex-1 space-y-3 z-10 w-full">
              <span className="text-xs font-black text-claude-text-muted uppercase tracking-wider block">Forecast</span>
              <div className="grid grid-cols-2 gap-2 w-full">
                {forecastData.map((slot, i) => (
                  <div key={i} className="bg-claude-bg border border-claude-border rounded-xl p-2.5 flex items-center justify-between shadow-inner">
                    <span className="text-[10px] font-bold text-claude-text-muted">{slot.label}</span>
                    <span className="text-xs font-black text-claude-coral">{slot.count}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4 w-full">
              <ForecastMascot />
              <div className="flex-1 z-10 text-left">
                <span className="text-xs font-black text-claude-text-muted uppercase tracking-wider block">Forecast</span>
                <p className="text-[10px] text-claude-text-muted/70 leading-relaxed font-semibold mt-1">
                  Do some Lessons to create some Reviews. Then we'll have a future to forecast.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Row 2: Streaks & Completed volume */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Study Streak Card (Span 8) */}
        <div className="lg:col-span-8 bg-claude-card border border-claude-border p-5 rounded-3xl shadow-xs space-y-5">
          <div className="flex justify-between items-center border-b border-claude-border pb-2.5">
            <span className="text-xs font-black text-claude-text-heading uppercase tracking-wider">Study Streak</span>
            <span className="text-[10px] font-black text-claude-text-muted uppercase tracking-widest flex items-center gap-1.5">
              <span>Offerings:</span>
              <span className="text-xs">{stats.streak > 5 ? '🐢 🐢 🐢' : stats.streak > 2 ? '🐢 🐢' : '🐢'}</span>
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-stretch gap-6">
            <div className="flex flex-col justify-center text-center sm:text-left shrink-0 border-r-0 sm:border-r border-claude-border/60 pr-0 sm:pr-8">
              <span className="text-4xl font-black text-claude-text-heading leading-none">
                {stats.streak || 0}<span className="text-sm font-extrabold text-claude-text-muted ml-0.5">日</span>
              </span>
              <span className="text-[8px] font-extrabold text-claude-text-muted uppercase tracking-wider mt-1 block">Current Streak</span>
              <span className="text-[9px] font-black text-claude-coral mt-2.5 block">
                Best Streak: {bestStreak}日
              </span>
            </div>

            <div className="flex-1 flex items-center w-full">
              <div className="flex gap-2 justify-between w-full">
                {weeklyDays.map((day, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1.5">
                    <span className={`text-[8.5px] font-black uppercase ${day.isToday ? 'text-claude-coral font-black' : 'text-claude-text-muted'}`}>
                      {day.dayName}
                    </span>
                    <div 
                      className={`w-full h-2.5 rounded-full border transition-all duration-300 ${
                        day.isStudied
                          ? 'bg-emerald-500 border-emerald-600 shadow-xs'
                          : 'bg-claude-bg border-claude-border'
                      }`}
                      title={day.isStudied ? 'Studied' : 'No study'}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Completed Today Card (Span 4) */}
        <div className="lg:col-span-4 bg-claude-card border border-claude-border p-5 rounded-3xl shadow-xs flex items-center gap-5 relative min-h-[140px] group overflow-hidden">
          <SleepingMascot />
          <div className="flex-1 space-y-2.5 z-10">
            <div>
              <span className="text-3xl font-black text-claude-text-heading block">{reviewsToday}</span>
              <span className="text-[10px] font-black text-claude-text-muted uppercase tracking-wider block mt-0.5">
                Reviews Completed Today
              </span>
            </div>
            <p className="text-[9.5px] text-claude-text-muted font-extrabold border-t border-claude-border/80 pt-2 block w-full">
              Yesterday: {reviewsYesterday} Reviews
            </p>
          </div>
        </div>
      </div>

      {/* Row 3: Recent Mistakes & Accuracy Gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Mistakes Card (Span 8) */}
        <div className="lg:col-span-8 bg-claude-card border border-claude-border p-5 rounded-3xl shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-claude-border pb-2.5">
            <div>
              <span className="text-xs font-black text-claude-text-heading uppercase tracking-wider block">Recent Mistakes</span>
              <span className="text-[9.5px] text-claude-text-muted font-bold block mt-0.5">Mistakes from the past 24 hours. Give them some extra love.</span>
            </div>
            <div className="flex gap-2">
              <button
                disabled={recentMistakes.length === 0}
                className="px-3.5 py-1.5 bg-claude-bg border border-claude-border hover:bg-claude-border/40 text-claude-text-heading font-black text-[9px] uppercase tracking-wider rounded-xl transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Extra Study
              </button>
              <button
                disabled={recentMistakes.length === 0}
                className="px-3.5 py-1.5 bg-claude-bg border border-claude-border hover:bg-claude-border/40 text-claude-text-heading font-black text-[9px] uppercase tracking-wider rounded-xl transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Redo Lessons
              </button>
            </div>
          </div>

          {recentMistakes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {recentMistakes.map((v, i) => (
                <div 
                  key={i} 
                  className="bg-pink-500/5 border border-pink-500/20 rounded-2xl p-3 flex flex-col items-center justify-center text-center transition-all duration-300 hover:scale-[1.02] shadow-xs group"
                >
                  <span className="font-black text-pink-600 dark:text-pink-300 text-base tracking-wide select-none japanese-serif">
                    {v.kanji}
                  </span>
                  <span className="text-[9px] text-pink-500 dark:text-pink-400 font-extrabold mt-0.5">
                    {v.hiragana || v.reading}
                  </span>
                  <span className="text-[8px] font-bold text-claude-text-muted leading-tight border-t border-pink-500/10 pt-1 mt-1.5 w-full truncate">
                    {v.english || v.meaning}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 border border-dashed border-claude-border rounded-2xl bg-claude-bg text-[10px] text-claude-text-muted font-black tracking-tight shadow-inner select-none">
              You have no recent mistakes.
            </div>
          )}
        </div>

        {/* Circular Gauge Card (Span 4) */}
        <div className="lg:col-span-4 bg-claude-card border border-claude-border p-5 rounded-3xl shadow-xs flex items-center justify-between gap-4 min-h-[140px]">
          <div className="space-y-1.5">
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-claude-coral block">Correct Reviews</span>
            <h3 className="text-xs font-black text-claude-text-heading leading-snug">Past 7 Days</h3>
            <p className="text-[9.5px] text-claude-text-muted font-bold leading-relaxed max-w-[140px]">
              {accuracy7Days >= 75 ? "You're in The Learning Zone! 🎯" : "You're outside The Learning Zone! 🦖"}
            </p>
            <span className="text-[8.5px] text-claude-text-muted font-bold block pt-1">
              Previous Period: {Math.max(0, accuracy7Days - 5)}%
            </span>
          </div>
          <AccuracyGauge percentage={accuracy7Days} />
        </div>
      </div>

      {/* Row 4: Level Progress & Active Item Spread */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Level Progress Widget (Span 5) */}
        <div className="md:col-span-5 bg-claude-card border border-claude-border p-5 sm:p-6 rounded-3xl shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-claude-border/50 pb-2">
              <span className="text-xs font-black text-claude-text-heading uppercase tracking-wider">Level Progress</span>
              <span className="text-[10px] font-black text-claude-coral flex items-center gap-0.5 cursor-pointer hover:opacity-80">
                Level {level} ➔
              </span>
            </div>
            <p className="text-[10px] text-claude-text-muted font-bold mt-1">Number of items Guru'd in this level.</p>
          </div>

          <div className="space-y-3.5">
            {/* Radicals (Blue) */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold">
                <span className="text-[#00a1f1] uppercase tracking-wider font-black flex items-center gap-1">🔷 Radicals</span>
                <span className="text-claude-text-muted font-extrabold">12 / 12 (100%)</span>
              </div>
              <div className="w-full h-2.5 bg-claude-bg rounded-full overflow-hidden border border-claude-border shadow-inner">
                <div className="bg-[#00a1f1] h-full rounded-full transition-all" style={{ width: '100%' }} />
              </div>
            </div>

            {/* Kanji (Pink) */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold">
                <span className="text-[#f03e93] uppercase tracking-wider font-black flex items-center gap-1">🌸 Kanji</span>
                <span className="text-claude-text-muted font-extrabold">{guruKanji} / {kanjiTarget} ({kanjiProgress}%)</span>
              </div>
              <div className="w-full h-2.5 bg-claude-bg rounded-full overflow-hidden border border-claude-border shadow-inner">
                <div className="bg-[#f03e93] h-full rounded-full transition-all" style={{ width: `${kanjiProgress}%` }} />
              </div>
            </div>

            {/* Vocabulary (Purple) */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold">
                <span className="text-[#a100f1] uppercase tracking-wider font-black flex items-center gap-1">🍆 Vocabulary</span>
                <span className="text-claude-text-muted font-extrabold">{guruVocab} / {vocabTarget} ({vocabProgress}%)</span>
              </div>
              <div className="w-full h-2.5 bg-claude-bg rounded-full overflow-hidden border border-claude-border shadow-inner">
                <div className="bg-[#a100f1] h-full rounded-full transition-all" style={{ width: `${vocabProgress}%` }} />
              </div>
            </div>
          </div>

          <div className="border-t border-claude-border pt-3">
            <p className="text-[9.5px] text-claude-text-muted font-semibold leading-relaxed">
              Guru <span className="text-claude-coral font-black">{Math.max(0, kanjiTarget - guruKanji)} more kanji</span> to level up.
            </p>
            {renderSegmentedProgressBar(kanjiProgress)}
          </div>
        </div>

        {/* Active Item Spread Chart (Span 7) */}
        <div className="md:col-span-7 bg-claude-card border border-claude-border p-5 sm:p-6 rounded-3xl shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex justify-between items-center border-b border-claude-border/50 pb-2">
            <span className="text-xs font-black text-claude-text-heading uppercase tracking-wider">Active Item Spread</span>
            <span className="text-[10px] font-black text-claude-coral cursor-pointer hover:opacity-80">
              Details ➔
            </span>
          </div>

          {/* Spread Bar Widget */}
          <div className="flex items-end justify-between gap-3.5 h-36 pt-4 px-2 border-b border-claude-border">
            {barChartItems.map((bar, idx) => {
              const heightPercent = Math.min(100, Math.round((bar.count / maxSpreadVal) * 100));
              
              let barColor = 'bg-[#f03e93]';
              if (bar.group === 'guru') barColor = 'bg-[#a100f1]';
              else if (bar.group === 'master') barColor = 'bg-[#294a6b] dark:bg-sky-750';
              else if (bar.group === 'enlightened') barColor = 'bg-[#0093dd]';
              
              return (
                <div key={idx} className="flex-1 flex flex-col items-center group relative">
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full mb-1 bg-claude-bg border border-claude-border text-[9px] font-black text-claude-text-heading px-1.5 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow z-30">
                    {bar.count} items
                  </div>
                  
                  {/* Bar */}
                  <div 
                    className={`w-full rounded-t-sm transition-all duration-500 ${barColor}`}
                    style={{ height: `${Math.max(4, heightPercent)}%` }}
                  />
                  
                  {/* Label underneath */}
                  <span className="text-[9px] font-black text-claude-text-muted mt-2 select-none">{bar.label}</span>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center text-[9px] font-black text-claude-text-muted tracking-wide pt-2 uppercase">
            <span>Apprentice (I-IV)</span>
            <span>Guru (V-VI)</span>
            <span>Master (VII)</span>
            <span>Enlightened (VIII)</span>
          </div>
        </div>
      </div>

      {/* Row 5: Total Days Studied & Dojo Community */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Total Days Studied (Span 8) */}
        <div className="lg:col-span-8 bg-gradient-to-br from-[#1e293b] to-[#0f172a] text-white p-6 rounded-3xl shadow-md flex flex-col sm:flex-row justify-between items-center gap-6 relative min-h-[160px] overflow-hidden">
          {/* Visual stars/dots background overlay */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
          
          <div className="flex items-center gap-4 z-10">
            <SpaceshipMascot />
            <div>
              <span className="text-xs font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                Study History
              </span>
              <h3 className="text-lg font-black tracking-tight mt-2 text-white">Total Days Studied</h3>
              <p className="text-[10px] text-slate-350 leading-relaxed font-semibold mt-1">
                You have been active on Kyōto-Slate for a total of {totalDaysStudied} days. Keep pushing!
              </p>
            </div>
          </div>

          <div className="z-10 flex flex-col items-center sm:items-end gap-2.5 shrink-0">
            <div className="flex gap-1.5 select-none">
              {daysStudiedStr.split('').map((char, idx) => (
                <div 
                  key={idx} 
                  className="w-10 h-14 bg-slate-800 border border-slate-700 text-white text-2xl font-black rounded-lg flex items-center justify-center shadow-inner relative overflow-hidden"
                >
                  <span className="relative z-10">{char}</span>
                  <div className="absolute inset-x-0 top-1/2 h-[1px] bg-slate-600/30" />
                </div>
              ))}
            </div>
            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              Since {accountSince}
            </span>
          </div>
        </div>

        {/* Dojo Community (Span 4) */}
        <div className="lg:col-span-4 bg-claude-card border border-claude-border p-5 rounded-3xl shadow-xs flex flex-col justify-between min-h-[160px] relative overflow-hidden group">
          <div className="flex items-start gap-4 z-10">
            <DojoCommunityMascot />
            <div className="space-y-1">
              <span className="text-xs font-black text-claude-text-heading uppercase tracking-wider block">Kyōto-Slate Dojo</span>
              <p className="text-[10px] text-claude-text-muted font-bold leading-normal">
                Join study rooms, challenge other players, and share calligraphy tracing tips.
              </p>
            </div>
          </div>
          
          <div className="z-10 pt-4 border-t border-claude-border/50">
            <a 
              href="#" 
              onClick={(e) => e.preventDefault()}
              className="text-[10px] font-black text-claude-coral uppercase tracking-wider flex items-center gap-1 cursor-pointer hover:opacity-85 transition-opacity"
            >
              Visit Dojo Rooms ➔
            </a>
          </div>
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
                      Developer Previews
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          onTriggerPreview('auth');
                          setShowSettings(false);
                        }}
                        className="py-2 bg-claude-bg border border-claude-border rounded-xl text-[9px] font-black hover:border-claude-coral transition-colors cursor-pointer text-center text-claude-text-heading"
                      >
                        🔑 Auth Screen
                      </button>
                      <button
                        onClick={() => {
                          onTriggerPreview('loading');
                          setShowSettings(false);
                        }}
                        className="py-2 bg-claude-bg border border-claude-border rounded-xl text-[9px] font-black hover:border-claude-coral transition-colors cursor-pointer text-center text-claude-text-heading"
                      >
                        ⏳ Loading Screen
                      </button>
                      <button
                        onClick={() => {
                          onTriggerPreview('fallback');
                          setShowSettings(false);
                        }}
                        className="py-2 bg-claude-bg border border-claude-border rounded-xl text-[9px] font-black hover:border-claude-coral transition-colors cursor-pointer text-center text-claude-text-heading"
                      >
                        🚨 Error Boundary
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
