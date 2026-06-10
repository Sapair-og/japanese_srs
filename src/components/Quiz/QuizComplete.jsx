import React from 'react';

export default function QuizComplete({
  bgCanvasRef,
  successGif,
  totalSessionCards,
  correctHistory,
  timeouts,
  elapsedTimes,
  sessionDuration,
  setActiveTab,
  onRestartSession,
  speakJapanese
}) {
  const progressPercent = totalSessionCards > 0 ? 100 : 0;
  
  // Calculate average response speed
  const averageTime = elapsedTimes.length > 0 
    ? Math.round((elapsedTimes.reduce((a, b) => a + b, 0) / elapsedTimes.length) * 10) / 10 
    : 0;

  // Calculate success rate
  const correctCount = correctHistory.filter(h => h.wasCorrectFirstTry).length;
  const accuracyRate = totalSessionCards > 0 
    ? Math.round((correctCount / totalSessionCards) * 100) 
    : 0;

  return (
    <>
      <canvas ref={bgCanvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-60 dark:opacity-40" />
      <div className="max-w-xl mx-auto w-full px-4 py-12 animate-fade-in text-center select-none relative z-10">
        <div className="claude-panel border-claude-border rounded-3xl p-10 space-y-6 relative overflow-hidden">
          
          <div className="space-y-3">
            {/* Celebrating Chibi Anime Dancing GIF Sticker (Randomized Custom Local GIF) */}
            <div className="w-32 h-32 flex items-center justify-center shrink-0 mx-auto overflow-hidden rounded-2xl border border-claude-border">
              <img 
                src={successGif} 
                className="w-full h-full object-cover" 
                alt="Celebrating randomized user custom GIF success mascot" 
              />
            </div>
            
            <h1 className="text-3xl font-extrabold text-claude-text-heading claude-serif mt-4">Session Complete!</h1>
            <p className="text-sm text-claude-text-muted max-w-sm mx-auto">
              Outstanding effort! You have reviewed all vocabulary cards in the active study queue.
            </p>
          </div>

          {/* Stats Summary Grid */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-claude-border/50 text-left">
            <div className="bg-claude-sidebar/40 border border-claude-border p-3.5 rounded-2xl text-center space-y-1">
              <span className="text-[9px] uppercase font-bold text-claude-text-muted tracking-wider block">Reviewed</span>
              <span className="text-xl font-extrabold text-claude-text-heading block">{totalSessionCards} Cards</span>
            </div>
            
            <div className="bg-claude-sidebar/40 border border-claude-border p-3.5 rounded-2xl text-center space-y-1">
              <span className="text-[9px] uppercase font-bold text-claude-text-muted tracking-wider block">Accuracy</span>
              <span className="text-xl font-extrabold text-claude-coral block">{accuracyRate}%</span>
            </div>
            
            <div className="bg-claude-sidebar/40 border border-claude-border p-3.5 rounded-2xl text-center space-y-1">
              <span className="text-[9px] uppercase font-bold text-claude-text-muted tracking-wider block">Speed</span>
              <span className="text-xl font-extrabold text-claude-text-heading block">{averageTime}s/c</span>
            </div>
          </div>

          {/* Additional details */}
          <div className="flex justify-between items-center bg-claude-sidebar/25 border border-claude-border/50 rounded-xl px-4 py-2.5 text-[10px] text-claude-text-muted">
            <span>⏱️ Session Duration: <strong>{sessionDuration} seconds</strong></span>
            <span>🚨 Timed Out: <strong>{timeouts} cards</strong></span>
          </div>

          {/* Correct Session Card Logs list for review */}
          <div className="space-y-2.5 text-left pt-2">
            <h3 className="text-[10px] font-black uppercase text-claude-text-heading tracking-widest px-1">
              📝 Session Summary List
            </h3>
            
            <div className="border border-claude-border rounded-2xl overflow-hidden max-h-48 overflow-y-auto divide-y divide-claude-border bg-claude-card">
              {correctHistory.map((historyItem, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 hover:bg-claude-sidebar/25 transition-all">
                  <div className="space-y-0.5 min-w-0 flex-1 pr-3">
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-claude-text-heading text-sm sm:text-base">
                        {historyItem.kanji || historyItem.hiragana}
                      </span>
                      {historyItem.kanji && (
                        <span className="text-[10px] text-claude-text-muted bg-claude-sidebar px-1.5 py-0.5 rounded-md font-bold">
                          {historyItem.hiragana}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-claude-text-muted block truncate capitalize">
                      {historyItem.english}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2.5 shrink-0">
                    <span className={`text-[8px] font-extrabold uppercase px-2 py-0.5 rounded ${
                      historyItem.wasCorrectFirstTry
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        : 'bg-red-500/10 text-red-500 dark:text-red-400 border border-red-500/20'
                    }`}>
                      {historyItem.wasCorrectFirstTry ? '✓ First Try' : '✗ Incorrect'}
                    </span>
                    
                    <button
                      type="button"
                      onClick={() => speakJapanese(historyItem.hiragana)}
                      className="p-2 hover:bg-claude-sidebar border border-claude-border text-claude-text-heading hover:text-claude-coral rounded-lg transition-all cursor-pointer hover:scale-105 active:scale-95"
                      title="Speak word pronunciation"
                    >
                      🔊
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action triggers */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-claude-border/50">
            <button
              onClick={onRestartSession}
              className="py-3.5 premium-btn-coral text-white font-extrabold rounded-2xl text-xs transition-all cursor-pointer"
            >
              Study Again 🔄
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className="py-3 bg-claude-card border border-claude-border hover:border-claude-text-muted text-claude-text-heading font-semibold rounded-2xl transition-all text-xs cursor-pointer"
            >
              Dashboard 📊
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
