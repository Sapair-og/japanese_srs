import React from 'react';
import { getMaturityCategory } from '../utils/srsEngine';

export default function Stats({ stats, vocabList = [], reviewSessions = [] }) {
  const accuracy = stats.totalAttempts > 0 
    ? Math.round((stats.totalCorrect / stats.totalAttempts) * 100) 
    : 0;

  // 1. Calculate Mastery Progression (Card Categories)
  const categoryCounts = { new: 0, learning: 0, review: 0, mature: 0 };
  vocabList.forEach(c => {
    const category = getMaturityCategory(c.repetitions || 0, c.interval || 0);
    categoryCounts[category] += 1;
  });

  const totalCards = vocabList.length || 1;
  const newPct = Math.round((categoryCounts.new / totalCards) * 100);
  const learningPct = Math.round((categoryCounts.learning / totalCards) * 100);
  const reviewPct = Math.round((categoryCounts.review / totalCards) * 100);
  const maturePct = Math.round((categoryCounts.mature / totalCards) * 100);

  // 2. Daily Review Volumes for last 14 days
  const lastDays = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateString = d.toISOString().split('T')[0];
    lastDays.push(dateString);
  }

  const reviewsByDay = lastDays.map(dateStr => {
    const daySessions = reviewSessions.filter(s => s.session_date === dateStr);
    const totalReviewed = daySessions.reduce((sum, s) => sum + s.cards_reviewed, 0);
    return {
      date: dateStr,
      label: new Date(dateStr).toLocaleDateString([], { month: 'short', day: 'numeric' }),
      count: totalReviewed
    };
  });

  const maxReviewCount = Math.max(...reviewsByDay.map(d => d.count), 5);

  const statItems = [
    {
      label: 'Current Streak',
      value: `${stats.streak} Days`,
      icon: '🔥',
      colorClass: 'text-claude-coral border-claude-coral/20 bg-claude-coral/5',
    },
    {
      label: 'Lifetime Accuracy',
      value: `${accuracy}%`,
      icon: '🎯',
      colorClass: 'text-emerald-700 dark:text-emerald-400 border-emerald-600/20 bg-emerald-500/5',
    },
    {
      label: 'Total Vocabulary',
      value: `${vocabList.length} Words`,
      icon: '📚',
      colorClass: 'text-amber-700 dark:text-amber-400 border-amber-600/20 bg-amber-500/5',
    },
    {
      label: 'Cards Reviewed',
      value: stats.totalCorrect,
      icon: '✅',
      colorClass: 'text-rose-700 dark:text-rose-400 border-rose-600/20 bg-rose-500/5',
    },
  ];

  return (
    <div className="space-y-6 w-full select-none">
      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {statItems.map((item, idx) => (
          <div 
            key={idx} 
            className={`claude-panel border p-5 rounded-2xl flex flex-col justify-between items-start hover:scale-[1.01] transition-transform duration-200 ${item.colorClass}`}
          >
            <div className="flex justify-between items-center w-full mb-3">
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-claude-text-muted">{item.label}</span>
              <span className="text-xl">{item.icon}</span>
            </div>
            <span className="text-2xl font-bold tracking-tight text-claude-text-heading claude-serif">{item.value}</span>
          </div>
        ))}
      </div>

      {/* Analytics Charts Grid */}
      {vocabList.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2">
          {/* Mastery Progression Card (5 cols) */}
          <div className="md:col-span-5 claude-panel border border-claude-border/70 p-5 sm:p-6 rounded-3xl flex flex-col justify-between space-y-5 bg-claude-card shadow-xs">
            <div>
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-claude-coral block">
                Maturity Distribution
              </span>
              <h3 className="text-sm font-bold text-claude-text-heading mt-1">
                Vocab Mastery Progression
              </h3>
            </div>

            <div className="space-y-4">
              {/* Stacked Progress Bar */}
              <div className="w-full h-4 bg-claude-sidebar rounded-full overflow-hidden flex border border-claude-border/30">
                {categoryCounts.mature > 0 && (
                  <div 
                    style={{ width: `${maturePct}%` }} 
                    className="bg-indigo-500 h-full transition-all duration-300" 
                    title={`Mature: ${categoryCounts.mature} words (${maturePct}%)`}
                  />
                )}
                {categoryCounts.review > 0 && (
                  <div 
                    style={{ width: `${reviewPct}%` }} 
                    className="bg-emerald-500 h-full transition-all duration-300" 
                    title={`Review: ${categoryCounts.review} words (${reviewPct}%)`}
                  />
                )}
                {categoryCounts.learning > 0 && (
                  <div 
                    style={{ width: `${learningPct}%` }} 
                    className="bg-amber-500 h-full transition-all duration-300" 
                    title={`Learning: ${categoryCounts.learning} words (${learningPct}%)`}
                  />
                )}
                {categoryCounts.new > 0 && (
                  <div 
                    style={{ width: `${newPct}%` }} 
                    className="bg-claude-text-muted/20 h-full transition-all duration-300" 
                    title={`New: ${categoryCounts.new} words (${newPct}%)`}
                  />
                )}
              </div>

              {/* Legend Grid */}
              <div className="grid grid-cols-2 gap-3.5 text-xs text-left">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shrink-0" />
                  <div>
                    <span className="font-bold text-claude-text-heading block">Mature ({categoryCounts.mature})</span>
                    <span className="text-[9px] text-claude-text-muted">Interval &ge; 21d</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                  <div>
                    <span className="font-bold text-claude-text-heading block">Review ({categoryCounts.review})</span>
                    <span className="text-[9px] text-claude-text-muted">Interval &lt; 21d</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                  <div>
                    <span className="font-bold text-claude-text-heading block">Learning ({categoryCounts.learning})</span>
                    <span className="text-[9px] text-claude-text-muted">1-2 repetitions</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-claude-text-muted/30 shrink-0" />
                  <div>
                    <span className="font-bold text-claude-text-heading block">New ({categoryCounts.new})</span>
                    <span className="text-[9px] text-claude-text-muted">0 repetitions</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-[10px] text-claude-text-muted/70 text-center border-t border-claude-border/30 pt-3 italic">
              Mature cards are committed to long-term memory!
            </div>
          </div>

          {/* Daily Review Volumes (7 cols) */}
          <div className="md:col-span-7 claude-panel border border-claude-border/70 p-5 sm:p-6 rounded-3xl flex flex-col justify-between space-y-5 bg-claude-card shadow-xs">
            <div className="flex justify-between items-baseline">
              <div className="text-left">
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-claude-coral block">
                  Study Load
                </span>
                <h3 className="text-sm font-bold text-claude-text-heading mt-1">
                  Daily Review Volumes (Last 14 Days)
                </h3>
              </div>
              <span className="text-[9px] text-claude-text-muted font-bold">
                Max: {maxReviewCount} cards
              </span>
            </div>

            {/* Custom SVG Bar Chart */}
            <div className="h-32 w-full flex items-end justify-between gap-1.5 pt-2">
              {reviewsByDay.map((day, idx) => {
                const heightPct = (day.count / maxReviewCount) * 100;
                return (
                  <div key={day.date} className="flex-1 flex flex-col items-center h-full group relative">
                    {/* Tooltip */}
                    <div className="absolute -top-7 scale-0 group-hover:scale-100 transition-all bg-claude-text-heading text-claude-card text-[9px] font-black px-2 py-0.5 rounded shadow-sm z-30 pointer-events-none whitespace-nowrap">
                      {day.count} reviewed
                    </div>
                    {/* Bar */}
                    <div className="w-full flex-grow flex items-end">
                      <div 
                        style={{ height: `${Math.max(heightPct, day.count > 0 ? 5 : 0)}%` }} 
                        className={`w-full rounded-t-md transition-all duration-500 ${
                          day.count > 0 
                            ? 'bg-gradient-to-t from-claude-coral to-claude-coral/70 hover:opacity-90 shadow-xs' 
                            : 'bg-claude-sidebar/30 border-t border-dashed border-claude-border/40'
                        }`}
                      />
                    </div>
                    {/* Date label */}
                    <span className="text-[7px] font-bold text-claude-text-muted mt-2 rotate-45 origin-top-left whitespace-nowrap">
                      {day.label}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="text-[10px] text-claude-text-muted/70 text-center pt-5 italic">
              Daily reviews maintain optimal spaced intervals.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
