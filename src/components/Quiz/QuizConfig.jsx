import React from 'react';

export default function QuizConfig({
  bgCanvasRef,
  setShowShortcutsHelp,
  difficulty,
  setDifficulty,
  sessionLimit,
  setSessionLimit,
  filteredPoolSize,
  allCards,
  selectedLessons,
  setSelectedLessons,
  n5Lessons,
  n4Lessons,
  otherLessons,
  lessonCounts,
  handleSelectAllN5,
  handleDeselectAllN5,
  handleSelectAllN4,
  handleDeselectAllN4,
  handleSelectAllOthers,
  handleDeselectAllOthers,
  handleToggleLesson,
  onStartSession,
  srsOnly,
  setSrsOnly,
  autoSpeak,
  setAutoSpeak,
  answerMode,
  setAnswerMode,
  autoGrade,
  setAutoGrade,
  timerEnabled,
  setTimerEnabled,
  timePerCard,
  setTimePerCard,
  setActiveTab
}) {
  return (
    <>
      <canvas ref={bgCanvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-60 dark:opacity-40" />
      <div className="max-w-4xl mx-auto w-full px-4 py-6 md:py-10 animate-fade-in relative z-10">
        <div className="claude-panel border-claude-border rounded-3xl p-6 md:p-8 space-y-6 md:space-y-8 shadow-xs select-none">
          
          {/* Header Title */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pb-5 border-b border-claude-border/50 relative">
            <div className="hidden sm:block w-24"></div>
            <div className="text-center space-y-2 flex-1">
              <div className="inline-flex items-center gap-1.5 bg-claude-coral/10 text-claude-coral text-[10px] font-extrabold uppercase px-3 py-1 rounded-full border border-claude-coral/25 tracking-wider select-none mb-1">
                🕹️ Review Controls
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-claude-text-heading claude-serif">
                Configure Study Arena 🎛️
              </h2>
              <p className="text-xs text-claude-text-muted max-w-lg mx-auto leading-relaxed">
                Select your settings and launch your customized Japanese vocabulary review.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowShortcutsHelp(true)}
              className="bg-claude-card border border-claude-border hover:border-claude-coral hover:text-claude-coral rounded-xl px-2.5 py-1.5 flex items-center gap-1.5 shadow-sm text-[10px] font-bold transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              title="Keyboard Shortcuts (Press H)"
            >
              ⌨️ Shortcuts (H)
            </button>
          </div>

          {/* 2-Column Responsive Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Column 1: Scope & Difficulty (col-span-7) */}
            <div className="md:col-span-7 space-y-5">
              <div className="p-5 bg-claude-sidebar/20 border border-claude-border/60 rounded-2xl space-y-5">
                <h3 className="text-[10px] font-black uppercase text-claude-coral tracking-widest pb-2 border-b border-claude-border/30">
                  📋 Scope & Difficulty
                </h3>

                {/* Difficulty Level Settings */}
                <div className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <label className="text-[10px] uppercase font-bold text-claude-text-muted tracking-wider">
                      Difficulty Level
                    </label>
                    <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded transition-all duration-300 ${
                      difficulty === 'hard' 
                        ? 'bg-red-500/10 text-red-500 dark:text-red-400 border border-red-500/25' 
                        : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25'
                    }`}>
                      {difficulty === 'hard' ? 'Hard Mode' : 'Easy Mode'}
                    </span>
                  </div>
                  <div className="relative flex bg-claude-sidebar/40 p-1 rounded-xl border border-claude-border overflow-hidden select-none">
                    {/* Sliding indicator pill */}
                    <div 
                      className="absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-lg transition-all duration-300 ease-out shadow-xs border pointer-events-none"
                      style={{
                        transform: difficulty === 'hard' ? 'translateX(100%)' : 'translateX(0)',
                        backgroundColor: difficulty === 'hard' ? 'rgba(239, 68, 68, 0.12)' : 'rgba(16, 185, 129, 0.12)',
                        borderColor: difficulty === 'hard' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)',
                      }}
                    />
                    <button
                      onClick={() => setDifficulty('easy')}
                      className={`relative z-10 flex-1 py-2 text-xs font-bold rounded-lg transition-all duration-300 cursor-pointer ${
                        difficulty === 'easy'
                          ? 'text-emerald-600 dark:text-emerald-400 font-extrabold'
                          : 'text-claude-text-muted hover:text-claude-text'
                      }`}
                    >
                      🟢 Easy
                    </button>
                    <button
                      onClick={() => setDifficulty('hard')}
                      className={`relative z-10 flex-1 py-2 text-xs font-bold rounded-lg transition-all duration-300 cursor-pointer ${
                        difficulty === 'hard'
                          ? 'text-red-500 dark:text-red-400 font-extrabold'
                          : 'text-claude-text-muted hover:text-claude-text'
                      }`}
                    >
                      🔴 Hard
                    </button>
                  </div>
                </div>

                {/* Session Size slider & presets */}
                <div className="space-y-2.5">
                  <div className="flex justify-between items-baseline">
                    <label className="text-[10px] uppercase font-bold text-claude-text-muted tracking-wider">
                      Session Size
                    </label>
                    <span className="text-[10px] font-bold text-claude-coral bg-claude-coral/10 border border-claude-coral/20 px-2 py-0.5 rounded">
                      {Math.min(sessionLimit, filteredPoolSize || 1)} / {filteredPoolSize} Cards
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3 py-1.5">
                    <input
                      type="range"
                      min="1"
                      max={filteredPoolSize || 1}
                      value={Math.min(sessionLimit, filteredPoolSize || 1)}
                      onChange={(e) => setSessionLimit(parseInt(e.target.value))}
                      className="w-full h-1 bg-claude-border rounded-lg appearance-none cursor-pointer accent-claude-coral"
                    />
                  </div>

                  {/* Quick Size Presets */}
                  <div className="grid grid-cols-4 gap-2 select-none">
                    {Array.from(new Set([5, 10, 20, filteredPoolSize]))
                      .filter(num => num <= filteredPoolSize && num > 0)
                      .map((num) => {
                        const label = num === filteredPoolSize ? 'All' : num;
                        const isSelected = sessionLimit === num || (num === filteredPoolSize && sessionLimit > filteredPoolSize);
                        return (
                          <button
                            key={num}
                            onClick={() => setSessionLimit(num)}
                            className={`py-1.5 px-2 rounded-lg border text-[9px] font-black transition-all cursor-pointer ${
                              isSelected 
                                ? 'bg-claude-coral/10 border-claude-coral text-claude-coral' 
                                : 'bg-claude-card hover:bg-claude-sidebar border-claude-border text-claude-text-muted hover:text-claude-text-heading hover:scale-[1.02]'
                            }`}
                          >
                            {label} Cards
                          </button>
                        );
                      })}
                  </div>
                </div>
              </div>

              {/* Select Lessons filter */}
              <div className="pt-4 border-t border-claude-border/30 space-y-3.5">
                <div className="flex justify-between items-center pb-2 border-b border-claude-border/20">
                  <div className="space-y-0.5">
                    <label className="text-[10px] uppercase font-black text-claude-text-heading tracking-wider block">
                      Decks & Lessons <span className="text-[8px] text-claude-coral font-bold lowercase tracking-normal normal-case select-none">(more incoming)</span>
                    </label>
                    <span className="text-[8px] text-claude-text-muted block">Filter cards by JLPT level or custom uploads</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedLessons([])}
                      className={`px-2.5 py-1 rounded-lg border text-[8px] font-black transition-all cursor-pointer ${
                        selectedLessons.length === 0
                          ? 'bg-claude-coral/15 border-claude-coral text-claude-coral'
                          : 'bg-claude-card hover:bg-claude-sidebar border-claude-border text-claude-text-muted'
                      }`}
                    >
                      🌐 Select All ({allCards.length} Cards)
                    </button>
                  </div>
                </div>

                {/* Scroll Container for Groups */}
                <div className="space-y-3 max-h-[120px] overflow-y-auto pr-1 py-0.5">
                  
                  {/* JLPT N5 Group */}
                  {n5Lessons.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center bg-emerald-500/5 px-2.5 py-1.5 rounded-lg border border-emerald-500/10">
                        <span className="text-[9px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          💮 JLPT N5 Decks
                        </span>
                        <div className="flex gap-1 text-[8px]">
                          <button
                            type="button"
                            onClick={handleSelectAllN5}
                            className="px-1.5 py-0.5 font-bold hover:text-emerald-600 transition-colors cursor-pointer border border-emerald-500/25 hover:border-emerald-500 rounded bg-claude-card text-emerald-600/85"
                          >
                            Select All
                          </button>
                          <button
                            type="button"
                            onClick={handleDeselectAllN5}
                            className="px-1.5 py-0.5 font-bold hover:text-red-500 transition-colors cursor-pointer border border-red-500/25 hover:border-red-500 rounded bg-claude-card text-red-500/85"
                          >
                            Clear
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {n5Lessons.map((les) => {
                          const isSelected = selectedLessons.includes(les);
                          const count = lessonCounts[les] || 0;
                          return (
                            <button
                              key={les}
                              type="button"
                              onClick={() => handleToggleLesson(les)}
                              className={`px-2.5 py-1.5 rounded-lg border text-left flex justify-between items-center transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-claude-coral/10 border-claude-coral text-claude-coral'
                                  : 'bg-claude-card hover:bg-claude-sidebar border-claude-border text-claude-text-muted hover:text-claude-text-heading'
                              }`}
                            >
                              <span className="text-[10px] font-bold truncate max-w-[130px]" title={les}>
                                {isSelected ? '✓' : '📁'} {les}
                              </span>
                              <span className="text-[8px] font-bold opacity-75 bg-black/5 dark:bg-white/5 px-1.5 py-0.5 rounded-md">
                                {count} cards
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* JLPT N4 Group */}
                  {n4Lessons.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center bg-blue-500/5 px-2.5 py-1.5 rounded-lg border border-blue-500/10">
                        <span className="text-[9px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1">
                          ⛩️ JLPT N4 Decks
                        </span>
                        <div className="flex gap-1 text-[8px]">
                          <button
                            type="button"
                            onClick={handleSelectAllN4}
                            className="px-1.5 py-0.5 font-bold hover:text-blue-600 transition-colors cursor-pointer border border-blue-500/25 hover:border-blue-500 rounded bg-claude-card text-blue-600/85"
                          >
                            Select All
                          </button>
                          <button
                            type="button"
                            onClick={handleDeselectAllN4}
                            className="px-1.5 py-0.5 font-bold hover:text-red-500 transition-colors cursor-pointer border border-red-500/25 hover:border-red-500 rounded bg-claude-card text-red-500/85"
                          >
                            Clear
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {n4Lessons.map((les) => {
                          const isSelected = selectedLessons.includes(les);
                          const count = lessonCounts[les] || 0;
                          return (
                            <button
                              key={les}
                              type="button"
                              onClick={() => handleToggleLesson(les)}
                              className={`px-2.5 py-1.5 rounded-lg border text-left flex justify-between items-center transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-claude-coral/10 border-claude-coral text-claude-coral'
                                  : 'bg-claude-card hover:bg-claude-sidebar border-claude-border text-claude-text-muted hover:text-claude-text-heading'
                              }`}
                            >
                              <span className="text-[10px] font-bold truncate max-w-[130px]" title={les}>
                                {isSelected ? '✓' : '📁'} {les}
                              </span>
                              <span className="text-[8px] font-bold opacity-75 bg-black/5 dark:bg-white/5 px-1.5 py-0.5 rounded-md">
                                {count} cards
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Other Decks Group */}
                  {otherLessons.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center bg-claude-sidebar px-2.5 py-1.5 rounded-lg border border-claude-border/60">
                        <span className="text-[9px] font-extrabold uppercase tracking-wider text-claude-text-heading flex items-center gap-1">
                          📁 Other Lessons / Categories
                        </span>
                        <div className="flex gap-1 text-[8px]">
                          <button
                            type="button"
                            onClick={handleSelectAllOthers}
                            className="px-1.5 py-0.5 font-bold hover:text-claude-coral transition-colors cursor-pointer border border-claude-border hover:border-claude-coral/40 rounded bg-claude-card text-claude-text-muted"
                          >
                            Select All
                          </button>
                          <button
                            type="button"
                            onClick={handleDeselectAllOthers}
                            className="px-1.5 py-0.5 font-bold hover:text-red-500 transition-colors cursor-pointer border border-red-500/25 hover:border-red-500 rounded bg-claude-card text-red-500/85"
                          >
                            Clear
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {otherLessons.map((les) => {
                          const isSelected = selectedLessons.includes(les);
                          const count = lessonCounts[les] || 0;
                          return (
                            <button
                              key={les}
                              type="button"
                              onClick={() => handleToggleLesson(les)}
                              className={`px-2.5 py-1.5 rounded-lg border text-left flex justify-between items-center transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-claude-coral/10 border-claude-coral text-claude-coral'
                                  : 'bg-claude-card hover:bg-claude-sidebar border-claude-border text-claude-text-muted hover:text-claude-text-heading'
                              }`}
                            >
                              <span className="text-[10px] font-bold truncate max-w-[130px]" title={les}>
                                {isSelected ? '✓' : '📁'} {les}
                              </span>
                              <span className="text-[8px] font-bold opacity-75 bg-black/5 dark:bg-white/5 px-1.5 py-0.5 rounded-md">
                                {count} cards
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </div>

            {/* Column 2: Preferences & Modes (col-span-5) */}
            <div className="md:col-span-5 space-y-5">
              <div className="p-5 bg-claude-sidebar/20 border border-claude-border/60 rounded-2xl space-y-4 h-full flex flex-col justify-between">
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase text-claude-coral tracking-widest pb-2 border-b border-claude-border/30">
                    ⚙️ Preferences
                  </h3>

                  {/* SRS Mode toggle */}
                  <div className="flex items-center justify-between p-3.5 bg-claude-card/50 border border-claude-border rounded-xl">
                    <div className="space-y-0.5 text-left">
                      <span className="text-[11px] font-bold text-claude-text-heading block">Due Cards Only (SRS) 🧠</span>
                      <span className="text-[8px] text-claude-text-muted block">Review only cards scheduled for today</span>
                    </div>
                    <button
                      onClick={() => setSrsOnly(!srsOnly)}
                      className={`px-3 py-1.5 rounded-lg border text-[9px] font-black transition-all cursor-pointer ${
                        srsOnly 
                          ? 'bg-claude-coral/15 border-claude-coral text-claude-coral' 
                          : 'bg-claude-card border-claude-border text-claude-text-muted hover:text-claude-text-heading hover:scale-[1.02]'
                      }`}
                    >
                      {srsOnly ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>

                  {/* Auto-Speak setting option */}
                  <div className="flex items-center justify-between p-3.5 bg-claude-card/50 border border-claude-border rounded-xl">
                    <div className="space-y-0.5 text-left">
                      <span className="text-[11px] font-bold text-claude-text-heading block">Auto-Speak Vocab 🔊</span>
                      <span className="text-[8px] text-claude-text-muted block">Speak audio automatically on card display</span>
                    </div>
                    <button
                      onClick={() => setAutoSpeak(!autoSpeak)}
                      className={`px-3 py-1.5 rounded-lg border text-[9px] font-black transition-all cursor-pointer ${
                        autoSpeak 
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400' 
                          : 'bg-claude-card border-claude-border text-claude-text-muted hover:text-claude-text-heading hover:scale-[1.02]'
                      }`}
                    >
                      {autoSpeak ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>

                  {/* Answer Mode setting option */}
                  <div className="flex items-center justify-between p-3.5 bg-claude-card/50 border border-claude-border rounded-xl">
                    <div className="space-y-0.5">
                      <span className="text-[11px] font-bold text-claude-text-heading block">Quiz Answer Mode ✍️</span>
                      <span className="text-[8px] text-claude-text-muted block">Choose multiple choice or typing inputs</span>
                    </div>
                    <button
                      onClick={() => {
                        if (answerMode === 'mc') setAnswerMode('typed');
                        else setAnswerMode('mc');
                      }}
                      className={`px-3 py-1.5 rounded-lg border text-[9px] font-black transition-all cursor-pointer ${
                        answerMode !== 'mc' 
                          ? 'bg-claude-coral/15 border-claude-coral text-claude-coral' 
                          : 'bg-claude-card border-claude-border text-claude-text-muted hover:text-claude-text-heading hover:scale-[1.02]'
                      }`}
                    >
                      {answerMode === 'mc' ? 'Multiple Choice' : 'Typed Reading'}
                    </button>
                  </div>

                  {/* Auto-Grade toggle */}
                  <div className="flex items-center justify-between p-3.5 bg-claude-card/50 border border-claude-border rounded-xl">
                    <div className="space-y-0.5 text-left">
                      <span className="text-[11px] font-bold text-claude-text-heading block">Auto-grade Correct Answers ⚡</span>
                      <span className="text-[8px] text-claude-text-muted block">Auto-advance correct answers with 'Good' rating</span>
                    </div>
                    <button
                      onClick={() => setAutoGrade(!autoGrade)}
                      className={`px-3 py-1.5 rounded-lg border text-[9px] font-black transition-all cursor-pointer ${
                        autoGrade 
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400' 
                          : 'bg-claude-card border-claude-border text-claude-text-muted hover:text-claude-text-heading hover:scale-[1.02]'
                      }`}
                    >
                      {autoGrade ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>

                  {/* Timer settings configuration */}
                  <div className="p-3.5 bg-claude-card/50 border border-claude-border rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5 text-left">
                        <span className="text-[11px] font-bold text-claude-text-heading block">Session Timer ⏱️</span>
                        <span className="text-[8px] text-claude-text-muted block">Enforce a strict countdown limit per card</span>
                      </div>
                      <button
                        onClick={() => setTimerEnabled(!timerEnabled)}
                        className={`px-3 py-1.5 rounded-lg border text-[9px] font-black transition-all cursor-pointer ${
                          timerEnabled 
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400' 
                            : 'bg-claude-card border-claude-border text-claude-text-muted hover:text-claude-text-heading hover:scale-[1.02]'
                        }`}
                      >
                        {timerEnabled ? 'Enabled' : 'Disabled'}
                      </button>
                    </div>
                    {timerEnabled && (
                      <div className="pt-2 border-t border-claude-border space-y-2 select-none">
                        <div className="flex justify-between items-baseline">
                          <span className="text-[9px] font-bold text-claude-text-muted uppercase tracking-wider">Countdown Limit</span>
                          <span className="text-[9px] font-extrabold text-claude-coral">{timePerCard}s per card</span>
                        </div>
                        <input
                          type="range"
                          min="5"
                          max="30"
                          step="5"
                          value={timePerCard}
                          onChange={(e) => setTimePerCard(parseInt(e.target.value))}
                          className="w-full h-1 bg-claude-border rounded-lg appearance-none cursor-pointer accent-claude-coral"
                        />
                        <div className="flex justify-between text-[8px] font-bold text-claude-text-muted">
                          <span>5s (Hardcore)</span>
                          <span>15s (Standard)</span>
                          <span>30s (Relaxed)</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions Footer */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-claude-border/50">
            <button
              onClick={() => onStartSession(selectedLessons, srsOnly)}
              disabled={filteredPoolSize === 0}
              className={`flex-1 py-4 text-xs premium-btn-coral text-white font-black rounded-2xl text-center flex items-center justify-center gap-2 cursor-pointer ${
                filteredPoolSize === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Launch Study Session ⚡
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex-1 py-4 bg-claude-card border border-claude-border hover:border-claude-text-muted text-claude-text-heading font-bold rounded-2xl transition-all text-xs cursor-pointer text-center hover:scale-[1.01]"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
