import { useState } from 'react';
import { supabase } from '../utils/supabaseClient';

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both email and password.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        // Sign Up
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password: password.trim(),
          options: {
            data: {
              full_name: fullName.trim() || 'Chibi Student',
            }
          }
        });

        if (error) throw error;
        setSuccessMsg('Sign up successful! Please check your email inbox for the confirmation link ✉️');
        // Auto-switch to login after some delay or let user read success message
      } else {
        // Log In
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password.trim(),
        });

        if (error) throw error;
      }
    } catch (err) {
      console.error('Authentication error:', err);
      setErrorMsg(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-claude-bg px-4 select-none animate-fade-in relative overflow-hidden">
      {/* Decorative ambient background blur blobs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-claude-coral/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      {/* Main Auth Container Panel */}
      <div className="claude-panel rounded-3xl p-8 sm:p-10 w-full max-w-md shadow-lg bg-claude-card relative z-10 space-y-6">
        
        {/* Header section with cute mascot */}
        <div className="text-center space-y-2.5">
          <div className="w-20 h-20 bg-claude-sidebar border border-claude-border/80 rounded-full flex items-center justify-center overflow-hidden shrink-0 shadow-sm mx-auto select-none">
            <img 
              src="https://api.dicebear.com/7.x/adventurer/svg?seed=Luna" 
              className="w-14 h-14 object-cover scale-110" 
              alt="Mascot character Luna" 
            />
          </div>
          <h1 className="text-3xl font-extrabold text-claude-text-heading tracking-tight claude-serif">
            Kyōto-Slate SRS ✒️
          </h1>
          <p className="text-xs text-claude-text-muted max-w-[280px] mx-auto leading-relaxed">
            {isSignUp 
              ? 'Create a personal study account to sync your vocabulary stats across devices.'
              : 'Log in to access your custom Japanese vocabulary cards and study progress.'
            }
          </p>
        </div>

        {/* Input Forms */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {isSignUp && (
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-claude-text-muted tracking-wider block pl-0.5">Display Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-claude-text-muted text-xs">👤</span>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Luna-chan"
                  className="w-full pl-9 pr-4 py-2.5 bg-claude-sidebar/40 border border-claude-border focus:border-claude-coral/70 rounded-xl text-xs text-claude-text focus:outline-none transition-all font-semibold"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-claude-text-muted tracking-wider block pl-0.5">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-claude-text-muted text-xs">✉️</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-4 py-2.5 bg-claude-sidebar/40 border border-claude-border focus:border-claude-coral/70 rounded-xl text-xs text-claude-text focus:outline-none transition-all font-semibold"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-claude-text-muted tracking-wider block pl-0.5">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-claude-text-muted text-xs">🔒</span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-10 py-2.5 bg-claude-sidebar/40 border border-claude-border focus:border-claude-coral/70 rounded-xl text-xs text-claude-text focus:outline-none transition-all font-semibold"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-claude-text-muted hover:text-claude-text-heading text-xs cursor-pointer focus:outline-none"
              >
                {showPassword ? '👁️' : '🙈'}
              </button>
            </div>
          </div>

          {/* Feedback Messages */}
          {errorMsg && (
            <div className="text-xs text-red-600 bg-red-950/10 border border-red-900/10 rounded-xl p-3 flex items-start gap-2 animate-shake">
              <span>⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="text-xs text-emerald-600 bg-emerald-950/10 border border-emerald-900/10 rounded-xl p-3 flex items-start gap-2">
              <span>✅</span>
              <span>{successMsg}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 mt-2 bg-claude-coral hover:bg-claude-coral/95 text-white font-bold rounded-xl shadow-md transition-all text-xs cursor-pointer flex justify-center items-center gap-1.5 ${
              loading ? 'opacity-50 cursor-not-allowed animate-pulse' : ''
            }`}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
                <span>Processing...</span>
              </>
            ) : (
              <span>{isSignUp ? 'Create Study Account ⚡' : 'Sign In to Arena ⚡'}</span>
            )}
          </button>
        </form>

        {/* Auth Toggle Footer */}
        <div className="text-center border-t border-claude-border/50 pt-4">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className="text-xs text-claude-text-muted hover:text-claude-coral font-bold transition-colors cursor-pointer"
          >
            {isSignUp 
              ? 'Already have an account? Log In' 
              : 'Need a personal study workspace? Create Account'
            }
          </button>
        </div>
      </div>
    </div>
  );
}
