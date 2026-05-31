/* eslint-disable */
import React, { useState, useEffect } from 'react';
import Stats from './Stats';

export default function Dashboard({ 
  stats, 
  vocabList, 
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
  const [showSettings, setShowSettings] = useState(false);
  const hasCards = vocabList && vocabList.length > 0;

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

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const bgUrl = supabaseUrl
    ? `${supabaseUrl.endsWith('/') ? supabaseUrl.slice(0, -1) : supabaseUrl}/storage/v1/object/public/assets/cat%20neko%20GIF.gif`
    : 'https://i.giphy.com/A4N46RUTt3fQ4.gif';

  // Calculate study tips
  const tips = [
    "Recall is active testing. Instead of re-reading words, challenge yourself with flashcards!",
    "Spaced repetition works best when practiced daily. Practice 5 minutes every single day.",
    "Try matching Hiragana with Kanji shapes. Visual cues help associative memory.",
    "Making mistakes is a shortcut to learning! Incorrect words are repeated until they stick.",
    "Say the Japanese word out loud when reviewing to train muscle memory and pronunciation."
  ];
  const randomTip = tips[Math.abs((stats.totalCorrect + stats.streak) % tips.length)];

  return (
    <div className="max-w-6xl mx-auto w-full px-2 py-4 md:py-8 animate-fade-in space-y-6">
      
      {/* Top Banner Greeting with welcome chibi illustration */}
      <div className="relative overflow-hidden claude-panel border-claude-border rounded-3xl p-5 md:p-8 flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6 bg-gradient-to-r from-claude-coral/5 to-transparent">
        {/* Aesthetic Animated Background Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.08] dark:opacity-[0.1] pointer-events-none transition-opacity duration-300"
          style={{
            backgroundImage: `url('${bgUrl}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="space-y-2 text-center md:text-left z-10 flex-1">
          <div className="inline-flex items-center gap-1.5 bg-claude-coral/10 text-claude-coral text-[10px] font-extrabold uppercase px-3 py-1 rounded-full border border-claude-coral/25 tracking-wider">
            🌸 Study Room
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-claude-text-heading claude-serif">
            Konnichiwa, {profile?.name || 'Learner'}! 👋
          </h1>
          <p className="text-xs md:text-sm text-claude-text-muted max-w-xl">
            Welcome back to your personalized Japanese learning space. Test your retrieval, keep up your daily streak, and master vocabulary.
          </p>
        </div>
        
        {/* Banner Decorative Chibi Sticker */}
        <div className="w-20 h-20 md:w-24 md:h-24 bg-claude-coral/5 border border-claude-border/60 rounded-2xl flex items-center justify-center overflow-hidden shrink-0 shadow-inner z-10">
          <img 
            src="https://api.dicebear.com/7.x/adventurer/svg?seed=Lucky" 
            className="w-16 h-16 md:w-20 md:h-20 object-cover scale-110" 
            alt="Welcome chibi mascot"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-2 z-10 w-full md:w-auto">
          {!hasCards && isAdmin && (
            <>
              <button
                onClick={onLoadDemo}
                className="px-5 py-3 text-xs bg-claude-sidebar border border-claude-border hover:border-claude-coral text-claude-text-heading font-semibold rounded-2xl transition-all w-full sm:w-auto text-center cursor-pointer"
              >
                Load Demo Words 📚
              </button>
              <button
                onClick={() => setActiveTab('vocab')}
                className="px-5 py-3 text-xs bg-claude-coral text-white hover:bg-claude-coral/90 font-semibold rounded-2xl transition-all w-full sm:w-auto text-center cursor-pointer"
              >
                Import Custom JSON 📝
              </button>
            </>
          )}
        </div>

        {/* Settings Gear Button inside Banner */}
        <button
          onClick={() => setShowSettings(true)}
          className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-claude-card hover:bg-claude-sidebar border border-claude-border flex items-center justify-center text-xs hover:text-claude-coral transition-colors cursor-pointer shadow-sm z-20"
          title="App Database & Reset Settings"
        >
          ⚙️
        </button>
      </div>

      {/* Main Dashboard Layout */}
      <div className="space-y-6">
        
        {/* Stats Bar */}
        <Stats stats={stats} vocabCount={vocabList.length} />

        {/* Simplified Study Call-to-action Card */}
        {hasCards ? (
          <div className="claude-panel border-claude-border p-5 md:p-8 rounded-3xl relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 bg-gradient-to-br from-claude-coral/5 to-transparent shadow-xs">
            <div className="space-y-1 text-center sm:text-left">
              <h2 className="text-xl font-bold text-claude-text-heading claude-serif">Ready to review Japanese vocabulary?</h2>
              <p className="text-xs text-claude-text-muted max-w-lg">
                Enter the Study Arena to customize your session size, set your difficulty mode (Easy or Hard), and test your memory.
              </p>
            </div>
            <button
              onClick={() => {
                onResetConfig(); // Ensure session launcher is shown
                setActiveTab('quiz');
              }}
              className="px-8 py-3.5 premium-btn-coral text-white font-extrabold rounded-2xl w-full sm:w-auto text-center cursor-pointer flex items-center justify-center gap-2 text-xs"
            >
              Enter Study Arena ✒️
            </button>
          </div>
        ) : (
          <div className="claude-panel border-claude-border p-5 sm:p-8 rounded-3xl text-center space-y-4">
            <p className="text-xs text-claude-text-muted">
              {isAdmin 
                ? "You don't have any vocabulary cards in your library yet! Load the JLPT demo set or import custom cards to start studying."
                : "No vocabulary cards are available in the shared library yet. Please ask the administrator to upload cards."
              }
            </p>
            {isAdmin && (
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <button
                  onClick={onLoadDemo}
                  className="px-5 py-3 text-xs bg-claude-sidebar border border-claude-border hover:border-claude-coral text-claude-text-heading font-semibold rounded-xl transition-all cursor-pointer"
                >
                  Load Demo Words 📚
                </button>
                <button
                  onClick={() => setActiveTab('vocab')}
                  className="px-5 py-3 text-xs bg-claude-coral text-white hover:bg-claude-coral/90 font-semibold rounded-xl transition-all cursor-pointer"
                >
                  Import Custom JSON 📝
                </button>
              </div>
            )}
          </div>
        )}

        {/* Clean Row of Encouragement & Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Streak Widget Card */}
          <div className="claude-panel border-claude-border rounded-3xl p-4 sm:p-6 relative overflow-hidden flex flex-col justify-between items-center text-center shadow-xs">
            <div className="text-4xl mb-2 animate-pulse-subtle">🔥</div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-claude-coral">Daily Streak</span>
              <span className="text-2xl font-extrabold text-claude-text-heading mt-1 block claude-serif">{stats.streak} Days</span>
            </div>
            <p className="text-[10px] text-claude-text-muted mt-2 leading-relaxed max-w-[200px]">
              {stats.streak > 0 
                ? "Keep up the awesome momentum! Practice tomorrow to preserve this streak."
                : "Complete a correct review to kickstart your daily streak tracker!"
              }
            </p>
          </div>

          {/* Weekly Heatmap Tracker Widget [Anki/GitHub inspired] */}
          <div className="claude-panel border-claude-border rounded-3xl p-4 sm:p-6 flex flex-col justify-between space-y-4 shadow-xs select-none">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-claude-coral block">
                Activity Heatmap
              </span>
              <span className="text-[8px] font-bold text-claude-text-muted">
                Last 7 Days reviews
              </span>
            </div>
            
            <div>
              <h4 className="text-xs font-bold text-claude-text-heading mb-3">Weekly Consistency Tracker</h4>
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
                      <span className="text-[8px] font-bold text-claude-text-muted">{day.dayName}</span>
                      <div 
                        className={`w-full aspect-square rounded-lg border flex items-center justify-center text-[10px] font-extrabold transition-all duration-300 ${
                          day.isStudied
                            ? 'bg-claude-coral/20 border-claude-coral text-claude-coral font-black shadow-xs scale-105'
                            : 'bg-claude-card border-claude-border text-claude-text-muted/60 hover:border-claude-text-muted/50'
                        }`}
                      >
                        {day.dayNum}
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </div>
            
            <p className="text-[10px] text-claude-text-muted leading-relaxed text-center pt-1 border-t border-claude-border/30">
              {stats.streak > 0 
                ? `🔥 You studied! Keep the streak going!` 
                : `📅 Complete a study session today to start your consistency map!`}
            </p>
          </div>

          {/* Learning Tip Card */}
          <div className="claude-panel border-claude-border rounded-3xl p-4 sm:p-6 flex flex-col justify-between space-y-3 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-claude-text-heading">
              <span>💡</span>
              <span className="claude-serif">Learning Tip</span>
            </div>
            <p className="text-xs text-claude-text-muted leading-relaxed flex-1 flex items-center justify-center text-center py-2 italic">
              "{randomTip}"
            </p>
            <div className="text-[9px] text-center text-claude-text-muted/60 font-bold uppercase tracking-wider">
              Memory Associates
            </div>
          </div>
        </div>

        {/* Recent Study Sessions Logs Panel */}
        <div className="claude-panel border-claude-border rounded-3xl p-4 sm:p-8 space-y-4 shadow-xs">
          <div className="flex justify-between items-center select-none">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-claude-coral">Performance History</span>
              <h3 className="text-lg font-bold text-claude-text-heading claude-serif mt-0.5">Recent Study Sessions</h3>
            </div>
            {sessionHistory.length > 0 && (
              <button
                onClick={handleClearHistory}
                className="text-[10px] font-bold text-claude-text-muted hover:text-red-500 bg-claude-sidebar border border-claude-border hover:border-red-900/30 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
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
                
                // Humorous Gen Z style comment based on performance
                let genzComment = "bestie did the work 💅";
                if (session.timeouts === 0) {
                  if (session.avgSpeed < 2.5) {
                    genzComment = "bro speedran that, cracked! ⚡🔥";
                  } else {
                    genzComment = "flawless clean run, zero notes 💅";
                  }
                } else if (session.timeouts > 3) {
                  genzComment = "bestie fell asleep, wake up! ⏰🦖";
                } else if (session.timeouts > 0) {
                  genzComment = "almost perfect, but wifi or brain lag occurred 🔌";
                }

                return (
                  <div
                    key={session.id}
                    className="p-3 sm:p-4 bg-claude-sidebar/20 border border-claude-border/60 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 hover:border-claude-border transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-claude-coral/10 border border-claude-coral/25 flex items-center justify-center text-sm">
                        ⏱️
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-claude-text-heading">
                            Reviewed {session.totalCards} Words
                          </span>
                          <span className={`text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded border ${
                            session.difficulty === 'hard'
                              ? 'bg-red-500/10 border-red-500/20 text-red-500'
                              : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                          }`}>
                            {session.difficulty === 'hard' ? 'Hard' : 'Easy'}
                          </span>
                        </div>
                        <span className="text-[9px] text-claude-text-muted block mt-0.5">
                          {dateString} at {timeString} • {genzComment}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-right justify-between sm:justify-end border-t sm:border-t-0 border-claude-border/20 pt-2 sm:pt-0">
                      <div>
                        <span className="text-[8px] uppercase font-bold text-claude-text-muted block">Duration</span>
                        <span className="text-xs font-extrabold text-claude-text-heading">{session.duration}s</span>
                      </div>
                      <div>
                        <span className="text-[8px] uppercase font-bold text-claude-text-muted block">Avg Speed</span>
                        <span className="text-xs font-extrabold text-claude-text-heading">{session.avgSpeed}s</span>
                      </div>
                      <div>
                        <span className="text-[8px] uppercase font-bold text-claude-text-muted block">Timeouts</span>
                        <span className={`text-xs font-extrabold ${session.timeouts > 0 ? 'text-red-500' : 'text-claude-text-heading'}`}>
                          {session.timeouts}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center text-claude-text-muted border border-dashed border-claude-border/80 rounded-2xl select-none space-y-2">
              <span className="text-2xl block animate-bounce-subtle">📊</span>
              <p className="text-xs font-bold text-claude-text-heading">No Study Logs Yet</p>
              <p className="text-[10px] text-claude-text-muted leading-relaxed max-w-xs mx-auto">
                Finish your first vocabulary review session in the Study Arena to track your duration, average speed, and timeout stats.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Dashboard Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[100] flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0" onClick={() => setShowSettings(false)} />
          <div className="claude-panel w-full max-w-sm rounded-2xl p-6 relative z-10 flex flex-col gap-4 animate-fade-in shadow-2xl">
            <div className="flex justify-between items-center border-b border-claude-border pb-2.5">
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-claude-text-heading claude-serif">
                Database Management Settings
              </h3>
              <button 
                onClick={() => setShowSettings(false)}
                className="text-claude-text-muted hover:text-claude-text-heading text-xs font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-[9px] text-claude-text-muted leading-relaxed uppercase tracking-wider font-extrabold">
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
                      className="w-full text-left px-4 py-3 bg-claude-card hover:bg-claude-sidebar rounded-xl border border-claude-border transition-colors flex items-center justify-between cursor-pointer group"
                    >
                      <div>
                        <span className="text-xs font-bold text-claude-text-heading block">Load Demo Vocabulary</span>
                        <span className="text-[9px] text-claude-text-muted block mt-0.5">Populate database with 20 JLPT cards</span>
                      </div>
                      <span className="text-sm group-hover:translate-x-0.5 transition-transform">📚</span>
                    </button>

                    <button
                      onClick={() => {
                        onClearAll();
                        setShowSettings(false);
                      }}
                      className="w-full text-left px-4 py-3 bg-red-950/10 hover:bg-red-950/20 rounded-xl border border-red-900/10 transition-colors flex items-center justify-between cursor-pointer group"
                    >
                      <div>
                        <span className="text-xs font-bold text-red-500 block">Reset All Lists & Stats</span>
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
                  className="w-full text-left px-4 py-3 bg-amber-500/10 hover:bg-amber-500/20 rounded-xl border border-amber-500/10 transition-colors flex items-center justify-between cursor-pointer group"
                >
                  <div>
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-500 block">Reset My Study Progress & Heatmap</span>
                    <span className="text-[9px] text-amber-500/80 block mt-0.5">Resets your personal score stats and learning dates to zero</span>
                  </div>
                  <span className="text-sm group-hover:scale-110 transition-transform">🔄</span>
                </button>

                <button
                  onClick={() => {
                    handleClearHistory();
                    setShowSettings(false);
                  }}
                  className="w-full text-left px-4 py-3 bg-red-950/5 hover:bg-red-950/10 rounded-xl border border-red-900/5 transition-colors flex items-center justify-between cursor-pointer group"
                >
                  <div>
                    <span className="text-xs font-bold text-red-400 block">Clear Study Logs</span>
                    <span className="text-[9px] text-red-400/80 block mt-0.5">Deletes all previous study performance history records</span>
                  </div>
                  <span className="text-sm group-hover:scale-110 transition-transform">🗑️</span>
                </button>

                {isAdmin && (
                  <>
                    <p className="text-[9px] text-claude-text-muted leading-relaxed uppercase tracking-wider font-extrabold mt-3 border-t border-claude-border/30 pt-3">
                      Gen Z Error Page Previews 💀
                    </p>
                    
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => {
                          onTriggerPreview('404');
                          setShowSettings(false);
                        }}
                        className="py-2 bg-claude-sidebar border border-claude-border rounded-xl text-[9px] font-bold hover:border-claude-coral transition-colors cursor-pointer text-center text-claude-text-heading"
                      >
                        🪦 404
                      </button>
                      <button
                        onClick={() => {
                          onTriggerPreview('offline');
                          setShowSettings(false);
                        }}
                        className="py-2 bg-claude-sidebar border border-claude-border rounded-xl text-[9px] font-bold hover:border-claude-coral transition-colors cursor-pointer text-center text-claude-text-heading"
                      >
                        🦖 Offline
                      </button>
                      <button
                        onClick={() => {
                          onTriggerPreview('database');
                          setShowSettings(false);
                        }}
                        className="py-2 bg-claude-sidebar border border-claude-border rounded-xl text-[9px] font-bold hover:border-claude-coral transition-colors cursor-pointer text-center text-claude-text-heading"
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
                className="w-full px-4 py-2 bg-claude-sidebar border border-claude-border hover:bg-claude-card rounded-xl text-[10px] font-bold text-claude-text-heading transition-colors cursor-pointer text-center"
              >
                Close Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
