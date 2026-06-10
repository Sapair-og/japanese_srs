import React from 'react';

export default function KeyboardShortcutsModal({ showShortcutsHelp, setShowShortcutsHelp, answerMode }) {
  if (!showShortcutsHelp) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[100] flex items-center justify-center p-4 animate-fade-in select-none">
      <div className="bg-claude-card border border-claude-border rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 relative overflow-hidden text-left">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="text-lg font-black text-claude-text-heading flex items-center gap-2">
              ⌨️ Keyboard Shortcuts
            </h3>
            <p className="text-[11px] text-claude-text-muted">
              Boost your study speed with these keyboard hotkeys.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowShortcutsHelp(false)}
            className="text-claude-text-muted hover:text-claude-text-heading text-lg p-1 hover:bg-claude-sidebar rounded-full transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Content / Shortcuts List */}
        <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-claude-coral">General</span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1.5 p-2 bg-claude-sidebar/55 rounded-xl border border-claude-border/40">
                <kbd className="px-1.5 py-0.5 bg-claude-bg border border-claude-border rounded font-mono text-[10px] shadow-xs text-claude-text-heading">H</kbd>
                <span className="text-claude-text-muted">or</span>
                <kbd className="px-1.5 py-0.5 bg-claude-bg border border-claude-border rounded font-mono text-[10px] shadow-xs text-claude-text-heading">?</kbd>
                <span className="text-claude-text-muted text-[10px] font-medium ml-auto">Toggle Shortcuts</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 bg-claude-sidebar/55 rounded-xl border border-claude-border/40">
                <kbd className="px-1.5 py-0.5 bg-claude-bg border border-claude-border rounded font-mono text-[10px] shadow-xs text-claude-text-heading">Q</kbd>
                <span className="text-claude-text-muted text-[10px] font-medium ml-auto">Quit Session</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-claude-coral">While Answering</span>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-1.5 p-2 bg-claude-sidebar/55 rounded-xl border border-claude-border/40">
                <kbd className="px-1.5 py-0.5 bg-claude-bg border border-claude-border rounded font-mono text-[10px] shadow-xs text-claude-text-heading">Space</kbd>
                <span className="text-claude-text-muted text-[10px] font-medium ml-auto">Hear Pronunciation</span>
              </div>
              {answerMode === 'mc' && (
                <div className="flex items-center gap-1.5 p-2 bg-claude-sidebar/55 rounded-xl border border-claude-border/40">
                  <kbd className="px-1.5 py-0.5 bg-claude-bg border border-claude-border rounded font-mono text-[10px] shadow-xs text-claude-text-heading">1</kbd>
                  <span className="text-claude-text-muted">to</span>
                  <kbd className="px-1.5 py-0.5 bg-claude-bg border border-claude-border rounded font-mono text-[10px] shadow-xs text-claude-text-heading">4</kbd>
                  <span className="text-claude-text-muted text-[10px] font-medium ml-auto">Select Choice</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-claude-coral">Once Card Flipped (Revealed)</span>
            <div className="space-y-2 text-xs">
              {/* Correct side */}
              <div className="p-2 bg-claude-sidebar/55 rounded-xl border border-claude-border/40 space-y-1.5 text-left">
                <span className="text-[9px] font-bold text-claude-success block">If Correct:</span>
                <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                  <div className="flex items-center gap-1.5">
                    <kbd className="px-1.5 py-0.5 bg-claude-bg border border-claude-border rounded font-mono text-[9px] shadow-xs text-claude-text-heading">1</kbd>
                    <span className="text-claude-text-muted text-[9px]">Forgot 😭</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <kbd className="px-1.5 py-0.5 bg-claude-bg border border-claude-border rounded font-mono text-[9px] shadow-xs text-claude-text-heading">2</kbd>
                    <span className="text-claude-text-muted text-[9px]">Hard 🤕</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <kbd className="px-1.5 py-0.5 bg-claude-bg border border-claude-border rounded font-mono text-[9px] shadow-xs text-claude-text-heading">3</kbd>
                    <span className="text-claude-text-muted text-[9px]">Good 😊</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <kbd className="px-1.5 py-0.5 bg-claude-bg border border-claude-border rounded font-mono text-[9px] shadow-xs text-claude-text-heading">4</kbd>
                    <span className="text-claude-text-muted text-[9px]">Easy 😎</span>
                  </div>
                </div>
              </div>

              {/* Incorrect side */}
              <div className="flex items-center gap-1.5 p-2 bg-claude-sidebar/55 rounded-xl border border-claude-border/40">
                <span className="text-[9px] font-bold text-claude-error block mr-2">If Incorrect:</span>
                <kbd className="px-1.5 py-0.5 bg-claude-bg border border-claude-border rounded font-mono text-[10px] shadow-xs text-claude-text-heading">Space</kbd>
                <span className="text-claude-text-muted">or</span>
                <kbd className="px-1.5 py-0.5 bg-claude-bg border border-claude-border rounded font-mono text-[10px] shadow-xs text-claude-text-heading">Enter</kbd>
                <span className="text-claude-text-muted text-[10px] font-medium ml-auto">Next Card</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer / Info */}
        <div className="pt-3 border-t border-claude-border/50 flex justify-between items-center text-[10px] text-claude-text-muted">
          <span>Press <kbd className="px-1 bg-claude-sidebar border border-claude-border rounded font-mono text-[9px]">Esc</kbd> to close</span>
          <button
            type="button"
            onClick={() => setShowShortcutsHelp(false)}
            className="px-4 py-2 bg-claude-coral hover:bg-claude-coral/90 text-white font-extrabold rounded-xl transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
}
