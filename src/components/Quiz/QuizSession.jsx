import React from 'react';

export default function QuizSession({
  bgCanvasRef,
  canvasRef,
  floatingXps,
  onResetConfig,
  setShowShortcutsHelp,
  queueLength,
  totalSessionCards,
  progressPercent,
  timerEnabled,
  correctHistory,
  historyIndex,
  handleHistoryBack,
  handleHistoryForward,
  cardToRender,
  timeLeft,
  timePerCard,
  showFurigana,
  setShowFurigana,
  showRomaji,
  setShowRomaji,
  useSerif,
  setUseSerif,
  isChecking,
  isHistoryFlipped,
  setIsHistoryFlipped,
  speakJapanese,
  generateMnemonic,
  answerMode,
  typedAnswer,
  setTypedAnswer,
  handleTypedSubmit,
  toKana,
  displayChoices,
  selectedChoice,
  handleChoiceClick,
  answeredCorrectly,
  submitAnswer,
  isShake,
  renderFurigana,
  formatJapanese
}) {
  return (
    <>
      <canvas ref={bgCanvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-60 dark:opacity-40" />
      <div className="max-w-xl mx-auto w-full px-4 py-8 animate-fade-in relative z-10">
        <div className="space-y-6">
          {/* Header/Stats overlay */}
          <div className="flex justify-between items-center text-xs font-semibold text-claude-text-muted px-1 select-none">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (window.confirm("Are you sure you want to quit this study session? Your progress in this session will be lost.")) {
                    onResetConfig();
                  }
                }}
                className="bg-claude-card border border-claude-border hover:border-red-500 hover:text-red-500 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                title="Quit study session"
              >
                🚪 Quit
              </button>
              <button
                type="button"
                onClick={() => setShowShortcutsHelp(true)}
                className="bg-claude-card border border-claude-border hover:border-claude-coral hover:text-claude-coral rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 shadow-sm transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                title="Keyboard Shortcuts (Press H)"
              >
                ⌨️ <span className="hidden sm:inline">Shortcuts</span>
              </button>
            </div>
            <span className="bg-claude-card border border-claude-border rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-claude-coral animate-ping"></span>
              Queue: {queueLength} left
            </span>
            <span className="bg-claude-card border border-claude-border rounded-lg px-2.5 py-1.5 shadow-sm">
              Progress: {progressPercent}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-claude-sidebar border border-claude-border h-2 rounded-full overflow-hidden shadow-inner">
            <div 
              className="h-full bg-claude-coral transition-all duration-300 ease-out" 
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* History Navigation Bar */}
          {!timerEnabled && correctHistory.length > 0 && (
            <div className="flex justify-between items-center bg-claude-card border border-claude-border rounded-2xl px-4 py-2.5 text-xs font-bold text-claude-text select-none shadow-sm animate-fade-in">
              <button
                type="button"
                onClick={handleHistoryBack}
                disabled={historyIndex === 0}
                className={`px-3 py-1.5 rounded-lg border border-claude-border bg-claude-sidebar transition-all flex items-center justify-center gap-1 cursor-pointer text-[10px] ${
                  historyIndex === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:border-claude-coral hover:text-claude-coral hover:scale-[1.02]'
                }`}
                title="Previous correct card"
              >
                ◀ Back
              </button>
              <span className="text-claude-text-muted">
                {historyIndex === -1 ? '🔴 Live Session' : `📖 Reviewing History (${historyIndex + 1}/${correctHistory.length})`}
              </span>
              <button
                type="button"
                onClick={handleHistoryForward}
                disabled={historyIndex === -1}
                className="px-3 py-1.5 rounded-lg border border-claude-border bg-claude-sidebar hover:border-claude-coral hover:text-claude-coral hover:scale-[1.02] transition-all flex items-center justify-center gap-1 cursor-pointer text-[10px]"
                title="Next card"
              >
                Forward ▶
              </button>
            </div>
          )}

          <div 
            onClick={() => {
              if (historyIndex !== -1) {
                setIsHistoryFlipped(!isHistoryFlipped);
              }
            }}
            className={`claude-panel border-claude-border rounded-3xl p-6 sm:p-8 space-y-6 sm:space-y-8 shadow-sm text-center relative overflow-hidden select-none transition-all duration-300 ${
              isShake ? 'animate-shake' : ''
            } ${
              historyIndex !== -1 ? 'cursor-pointer hover:border-claude-coral/50 hover:shadow-md' : ''
            }`}
          >
            {/* Floating XP indicators when answered correctly */}
            {floatingXps && floatingXps.map(fx => (
              <span
                key={fx.id}
                className="absolute z-50 text-[10px] font-extrabold text-amber-500 bg-amber-400/10 border border-amber-400/30 px-2 py-0.5 rounded-full shadow-xs floating-xp-text"
                style={{
                  left: `calc(50% + ${fx.x}px)`,
                  top: `calc(50% + ${fx.y}px)`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                ✨ +10 XP
              </span>
            ))}

            {/* Transparent Canvas for Sakura Particle Burst */}
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full pointer-events-none z-30"
            />
            {/* Countdown timer circle */}
            {timerEnabled && historyIndex === -1 && !isChecking && (
              <div className="absolute right-4 top-4 flex items-center justify-center">
                <svg className="w-10 h-10 transform -rotate-90">
                  <circle
                    cx="20"
                    cy="20"
                    r="16"
                    className="stroke-claude-border"
                    strokeWidth="3.5"
                    fill="transparent"
                  />
                  <circle
                    cx="20"
                    cy="20"
                    r="16"
                    className={`transition-all duration-1000 ease-linear ${
                      timeLeft <= 3 ? 'stroke-red-500' : 'stroke-claude-coral'
                    }`}
                    strokeWidth="3.5"
                    fill="transparent"
                    strokeDasharray={100}
                    strokeDashoffset={100 - (timeLeft / timePerCard) * 100}
                  />
                </svg>
                <span className={`absolute text-[11px] font-black ${
                  timeLeft <= 3 ? 'text-red-500 animate-pulse' : 'text-claude-text-heading'
                }`}>
                  {timeLeft}
                </span>
              </div>
            )}

            {/* Display deck/lesson badge */}
            <div className="text-left">
              <span className="inline-block bg-claude-sidebar border border-claude-border/80 text-claude-text-muted text-[8px] font-extrabold uppercase px-2 py-0.5 rounded-full select-none tracking-wider">
                🏷️ {cardToRender.lesson || 'General'}
              </span>
            </div>

            {/* Top Toolbar (Display controls) */}
            <div className="flex justify-center items-center gap-1.5 pt-1.5 select-none">
              <button
                type="button"
                onClick={() => setShowFurigana(!showFurigana)}
                className={`px-2 py-1 rounded-md border text-[8px] font-black transition-all cursor-pointer ${
                  showFurigana 
                    ? 'bg-claude-coral/10 border-claude-coral text-claude-coral' 
                    : 'bg-claude-card border-claude-border text-claude-text-muted'
                }`}
                title="Toggle Furigana guide"
              >
                ふりがな: {showFurigana ? 'ON' : 'OFF'}
              </button>
              
              <button
                type="button"
                onClick={() => setShowRomaji(!showRomaji)}
                className={`px-2 py-1 rounded-md border text-[8px] font-black transition-all cursor-pointer ${
                  showRomaji 
                    ? 'bg-claude-coral/10 border-claude-coral text-claude-coral' 
                    : 'bg-claude-card border-claude-border text-claude-text-muted'
                }`}
                title="Toggle Romaji reading guidance"
              >
                Romaji: {showRomaji ? 'ON' : 'OFF'}
              </button>
              
              <button
                type="button"
                onClick={() => setUseSerif(!useSerif)}
                className={`px-2 py-1 rounded-md border text-[8px] font-black transition-all cursor-pointer ${
                  useSerif 
                    ? 'bg-claude-coral/10 border-claude-coral text-claude-coral' 
                    : 'bg-claude-card border-claude-border text-claude-text-muted'
                }`}
                title="Toggle Serif/Mincho font"
              >
                Font: {useSerif ? 'Serif' : 'Sans'}
              </button>
            </div>

            {/* Card Content display */}
            <div className="space-y-4 pt-4 min-h-[160px] flex flex-col justify-center items-center">
              {/* Question: Japanese text */}
              {(!isChecking && historyIndex === -1) || (historyIndex !== -1 && !isHistoryFlipped) ? (
                // FRONT OF CARD
                <div className="space-y-3 select-all w-full">
                  <span className="text-[10px] uppercase font-bold text-claude-text-muted tracking-widest block">
                    How do you read this?
                  </span>
                  
                  <h1 className={`text-4xl sm:text-5xl font-black text-claude-text-heading leading-tight ${
                    useSerif ? 'claude-serif' : ''
                  }`}>
                    {showFurigana && cardToRender.kanji 
                      ? renderFurigana(cardToRender.kanji, cardToRender.hiragana)
                      : formatJapanese(cardToRender.kanji || cardToRender.hiragana)
                    }
                  </h1>

                  {showRomaji && cardToRender.romaji && (
                    <span className="text-xs font-semibold text-claude-text-muted/80 tracking-wider block">
                      {cardToRender.romaji}
                    </span>
                  )}

                  {historyIndex !== -1 && (
                    <div className="flex gap-2 pt-4 justify-center max-w-[240px] mx-auto select-none">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          speakJapanese(cardToRender.hiragana);
                        }}
                        className="flex-1 py-2.5 px-4 bg-claude-sidebar hover:bg-claude-sidebar/85 border border-claude-border hover:border-claude-text-muted text-claude-text-heading font-bold rounded-xl transition-all text-xs cursor-pointer flex items-center justify-center gap-1.5 animate-fade-in"
                      >
                        🔊 Play
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsHistoryFlipped(!isHistoryFlipped);
                        }}
                        className="flex-1 py-2.5 px-4 bg-claude-card hover:bg-claude-sidebar border border-claude-border text-claude-text font-bold rounded-xl transition-all text-xs cursor-pointer animate-fade-in"
                      >
                        🎴 Flip
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                // BACK OF CARD (Answer revealed)
                <div className="space-y-4 w-full select-text animate-fade-in">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-claude-text-muted tracking-widest block">
                      Vocabulary Card Back
                    </span>
                    
                    <h1 className={`text-3xl sm:text-4xl font-black text-claude-text-heading leading-tight ${
                      useSerif ? 'claude-serif' : ''
                    }`}>
                      {showFurigana && cardToRender.kanji 
                        ? renderFurigana(cardToRender.kanji, cardToRender.hiragana)
                        : formatJapanese(cardToRender.kanji || cardToRender.hiragana)
                      }
                    </h1>

                    <div className="flex justify-center items-center gap-2 mt-1">
                      <span className="text-sm font-bold text-claude-coral bg-claude-coral/10 border border-claude-coral/20 px-2 py-0.5 rounded-lg">
                        {cardToRender.hiragana}
                      </span>
                      {cardToRender.romaji && (
                        <span className="text-xs font-semibold text-claude-text-muted">
                          ({cardToRender.romaji})
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Translation meaning */}
                  <div className="bg-claude-sidebar/40 border border-claude-border/80 rounded-2xl p-4 space-y-1 text-center">
                    <span className="text-[9px] uppercase font-bold text-claude-text-muted tracking-wider block">English Definition</span>
                    <p className="text-base sm:text-lg font-black text-claude-text-heading capitalize">
                      {cardToRender.english}
                    </p>
                  </div>

                  {/* Mnemonics explanation */}
                  {cardToRender.mnemonic && (
                    <div className="bg-amber-500/5 border border-amber-500/15 rounded-2xl p-4 text-left space-y-1">
                      <span className="text-[9px] uppercase font-extrabold text-amber-600 dark:text-amber-400 tracking-wider block">💡 Mnemonic device</span>
                      <p className="text-xs text-claude-text-heading font-medium leading-relaxed">
                        {generateMnemonic(cardToRender.mnemonic)}
                      </p>
                    </div>
                  )}

                  {/* Context sentence display */}
                  {cardToRender.context_jp && (
                    <div className="bg-claude-sidebar/20 border border-claude-border/50 rounded-2xl p-4 text-left space-y-2">
                      <span className="text-[9px] uppercase font-bold text-claude-text-muted tracking-wider block">💬 Context sentence</span>
                      <p className={`text-sm sm:text-base font-extrabold text-claude-text-heading leading-relaxed ${
                        useSerif ? 'claude-serif' : ''
                      }`}>
                        {cardToRender.context_jp}
                      </p>
                      {cardToRender.context_en && (
                        <p className="text-xs text-claude-text-muted italic border-l-2 border-claude-border pl-2.5">
                          {cardToRender.context_en}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Audio Vocal controls */}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => speakJapanese(cardToRender.hiragana)}
                      className="flex-1 py-3 bg-claude-sidebar hover:bg-claude-sidebar/85 border border-claude-border hover:border-claude-text-muted text-claude-text-heading font-bold rounded-2xl transition-all text-xs cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      🔊 Play audio
                    </button>
                    {historyIndex !== -1 && (
                      <button
                        type="button"
                        onClick={() => setIsHistoryFlipped(!isHistoryFlipped)}
                        className="py-3 px-4 bg-claude-card hover:bg-claude-sidebar border border-claude-border text-claude-text font-bold rounded-2xl transition-all text-xs cursor-pointer"
                      >
                        🎴 Flip Card
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Answer Input Panel */}
            <div className="pt-4 border-t border-claude-border/50 flex flex-col justify-center items-center">
              {historyIndex !== -1 ? (
                // HISTORY VIEW: Simply show a badge
                <div className="text-xs font-black text-claude-coral animate-pulse select-none">
                  📖 Reviewing past correct response logs.
                </div>
              ) : isChecking ? (
                // REVEAL BACK: Show SRS rating choices or error progress buttons
                answeredCorrectly === true ? (
                  <div className="space-y-4 animate-fade-in w-full text-left">
                    <div className="text-center text-[10px] font-black text-claude-success uppercase tracking-widest">
                      🎉 Correct Response! Rate Difficulty:
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 select-none">
                      <button
                        type="button"
                        onClick={() => submitAnswer(0, cardToRender)}
                        className="py-3.5 px-2.5 border-2 border-claude-error/35 bg-claude-card hover:bg-claude-error/10 text-claude-error font-extrabold rounded-2xl text-[11px] sm:text-xs transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer shadow-sm active:scale-95"
                      >
                        <span className="text-lg">😭</span>
                        <span>Forgot (1)</span>
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => submitAnswer(1, cardToRender)}
                        className="py-3.5 px-2.5 border-2 border-amber-500/35 bg-claude-card hover:bg-amber-500/10 text-amber-600 dark:text-amber-400 font-extrabold rounded-2xl text-[11px] sm:text-xs transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer shadow-sm active:scale-95"
                      >
                        <span className="text-lg">🤕</span>
                        <span>Hard (2)</span>
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => submitAnswer(2, cardToRender)}
                        className="py-3.5 px-2.5 border-2 border-claude-coral/35 bg-claude-card hover:bg-claude-coral/10 text-claude-coral font-extrabold rounded-2xl text-[11px] sm:text-xs transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer shadow-sm active:scale-95"
                      >
                        <span className="text-lg">😊</span>
                        <span>Good (3)</span>
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => submitAnswer(3, cardToRender)}
                        className="py-3.5 px-2.5 border-2 border-claude-success/35 bg-claude-card hover:bg-claude-success/10 text-claude-success font-extrabold rounded-2xl text-[11px] sm:text-xs transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer shadow-sm active:scale-95"
                      >
                        <span className="text-lg">😎</span>
                        <span>Easy (4)</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 animate-fade-in w-full">
                    <div className="text-center text-[10px] font-black text-claude-error uppercase tracking-widest">
                      😢 Incorrect or timed out!
                    </div>
                    <button
                      type="button"
                      onClick={() => submitAnswer(0, cardToRender)}
                      className="w-full py-4 px-6 border-2 border-claude-error/50 bg-claude-card hover:bg-claude-error/10 text-claude-error font-extrabold rounded-2xl text-base transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm transform hover:scale-[1.01] active:scale-[0.98]"
                    >
                      <span>Incorrect! Next Card ➡️</span>
                      <span className="text-[10px] font-bold opacity-60 bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded-md">
                        Enter / Space / 1
                      </span>
                    </button>
                  </div>
                )
              ) : answerMode === 'typed' ? (
                <form onSubmit={handleTypedSubmit} className="w-full space-y-3">
                  <div className="relative">
                    <input
                      type="text"
                      value={typedAnswer}
                      disabled={isChecking}
                      onChange={(e) => setTypedAnswer(toKana(e.target.value, { IMEMode: true }))}
                      placeholder={isChecking ? "Reviewing..." : "Type reading in Hiragana... (e.g. neko)"}
                      autoFocus
                      className={`w-full py-4 px-6 border rounded-2xl font-bold text-base sm:text-lg focus:outline-none transition-all duration-150 shadow-sm text-center ${
                        isChecking
                          ? typedAnswer.toLowerCase().trim() === cardToRender.hiragana.toLowerCase().trim() || (cardToRender.romaji && typedAnswer.toLowerCase().trim() === cardToRender.romaji.toLowerCase().trim())
                            ? 'bg-claude-success border-claude-success text-white'
                            : 'bg-claude-error border-claude-error text-white'
                          : 'bg-claude-card border-claude-border focus:border-claude-coral text-claude-text-heading'
                      }`}
                    />
                    {!isChecking && typedAnswer && (
                      <button
                        type="button"
                        onClick={() => setTypedAnswer('')}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-claude-text-muted hover:text-claude-text-heading text-sm p-1 hover:bg-claude-sidebar rounded-full cursor-pointer"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isChecking || !typedAnswer.trim()}
                    className={`w-full py-3.5 premium-btn-coral text-white font-bold rounded-2xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      isChecking || !typedAnswer.trim() ? 'opacity-60 cursor-not-allowed' : ''
                    }`}
                  >
                    Submit Answer ⚡
                  </button>
                </form>
              ) : (
                <div className="grid grid-cols-1 gap-2.5 w-full select-none">
                  {displayChoices.map((choice, index) => {
                    const isSelected = selectedChoice === choice;
                    const isCorrectDefinition = choice.toLowerCase().trim() === cardToRender.english.toLowerCase().trim();

                    // Set dynamic styles for option feedback states
                    let buttonClass = 'bg-claude-card border-claude-border hover:border-claude-coral/55 text-claude-text hover:text-claude-text-heading';
                    
                    if (isChecking) {
                      if (isCorrectDefinition) {
                        buttonClass = 'bg-claude-success border-claude-success text-white scale-[1.01]';
                      } else if (isSelected) {
                        buttonClass = 'bg-claude-error border-claude-error text-white scale-[0.99]';
                      } else {
                        buttonClass = 'bg-claude-card/25 border-claude-border/25 text-claude-text-muted/40 cursor-not-allowed scale-[0.98]';
                      }
                    }

                    return (
                      <button
                        key={index}
                        disabled={isChecking}
                        onClick={() => handleChoiceClick(choice)}
                        className={`w-full py-4 px-6 border text-left rounded-2xl font-bold text-sm sm:text-base flex justify-between items-center transition-all duration-150 shadow-sm cursor-pointer ${buttonClass}`}
                      >
                        <div className="flex items-center gap-3">
                          {!isChecking && (
                            <span className="text-[9px] font-black border border-claude-border bg-claude-sidebar text-claude-text-muted px-1.5 py-0.5 rounded shadow-xs select-none">
                              {index + 1}
                            </span>
                          )}
                          <span>{choice}</span>
                        </div>
                        {isChecking && isCorrectDefinition && (
                          <span className="text-xl animate-fade-in">✓</span>
                        )}
                        {isChecking && isSelected && !isCorrectDefinition && (
                          <span className="text-xl animate-fade-in">✗</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
