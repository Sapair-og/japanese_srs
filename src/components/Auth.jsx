import { useState, useEffect, useRef } from 'react';
import { supabase } from '../utils/supabaseClient';

export default function Auth() {
  // Auth modes: 'login', 'signup', 'forgot', 'verify-otp', 'reset-password'
  const [authMode, setAuthMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpType, setOtpType] = useState('signup'); // 'signup' or 'recovery'
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const canvasRef = useRef(null);

  // 1. System theme adaptive matching for login screen
  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleThemeChange = (e) => {
      const regionClasses = [
        'theme-liyue', 'theme-mondstadt', 'theme-inazuma', 'theme-sumeru', 
        'theme-fontaine', 'theme-natlan', 'theme-snezhnaya', 'theme-khaenriah', 'theme-abyss'
      ];
      regionClasses.forEach(c => root.classList.remove(c));
      root.classList.add('theme-liyue');
      root.classList.toggle('dark', e.matches);
    };

    // Apply on mount
    handleThemeChange(mediaQuery);

    // Listen to theme preferences changes
    mediaQuery.addEventListener('change', handleThemeChange);

    return () => {
      mediaQuery.removeEventListener('change', handleThemeChange);
    };
  }, []);

  // 2. Interactive magnifying Japanese character background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const charPool = 'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんアイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン学習日本語漢字書道練習記憶単語美道心和'.split('');

    let gridItems = [];
    const spacing = 48; 

    const initGrid = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      gridItems = [];

      const cols = Math.ceil(width / spacing) + 1;
      const rows = Math.ceil(height / spacing) + 1;

      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          gridItems.push({
            x: c * spacing + (Math.random() - 0.5) * 8,
            y: r * spacing + (Math.random() - 0.5) * 8,
            char: charPool[Math.floor(Math.random() * charPool.length)],
            baseSize: 11 + Math.random() * 4,
            angle: (Math.random() - 0.5) * 0.15
          });
        }
      }
      requestDraw();
    };

    let drawPending = false;

    const draw = () => {
      drawPending = false;
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      const isDark = document.documentElement.classList.contains('dark');
      const baseColor = isDark ? '148, 163, 184' : '100, 116, 139'; // slate-400 / slate-500

      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';

      for (let i = 0; i < gridItems.length; i++) {
        const item = gridItems[i];
        const dx = mouse.x - item.x;
        const dy = mouse.y - item.y;
        const dist = Math.hypot(dx, dy);

        const radius = 170;
        const maxScale = 2.6;

        let scale = 1;
        let opacity = isDark ? 0.07 : 0.11;

        if (dist < radius) {
          const factor = 1 - dist / radius; 
          const easeFactor = Math.sin(factor * Math.PI / 2);
          scale = 1 + (maxScale - 1) * easeFactor;
          opacity = (isDark ? 0.07 : 0.11) + (0.42 - (isDark ? 0.07 : 0.11)) * easeFactor; 
        }

        ctx.save();
        ctx.translate(item.x, item.y);
        ctx.rotate(item.angle);
        
        ctx.font = `bold ${item.baseSize * scale}px "Hiragino Kaku Gothic Pro", "MS Gothic", sans-serif`;
        ctx.fillStyle = `rgba(${baseColor}, ${opacity})`;
        
        if (scale > 1.25) {
          ctx.shadowBlur = (scale - 1) * 7;
          ctx.shadowColor = `rgba(${baseColor}, ${opacity * 0.75})`;
        }

        ctx.fillText(item.char, 0, 0);
        ctx.restore();
      }
    };

    const requestDraw = () => {
      if (!drawPending) {
        drawPending = true;
        requestAnimationFrame(draw);
      }
    };

    initGrid();
    window.addEventListener('resize', initGrid);

    const mouse = { x: -1000, y: -1000 };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      requestDraw();
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
      requestDraw();
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleMediaQueryChange = () => {
      requestDraw();
    };
    mediaQuery.addEventListener('change', handleMediaQueryChange);

    return () => {
      window.removeEventListener('resize', initGrid);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      mediaQuery.removeEventListener('change', handleMediaQueryChange);
    };
  }, []);

  // 3. Email & Password Signin/Signup Submit handler
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

    try {
      if (authMode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password: password.trim(),
          options: {
            data: {
              full_name: fullName.trim() || 'Chibi Student',
            }
          }
        });

        if (error) throw error;

        // Check if email confirmation is required and code was sent
        if (data?.user && !data.session) {
          setSuccessMsg('Registration successful! Enter the 6-digit confirmation code sent to your email ✉️');
          setOtpType('signup');
          setAuthMode('verify-otp');
        } else {
          setSuccessMsg('Account created successfully! Connecting...');
        }
      } else {
        // Log In
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password.trim(),
        });
        if (error) throw error;
      }
    } catch (err) {
      console.error('Auth error:', err);
      setErrorMsg(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // 4. Send Recovery OTP code for Forgot Password
  const handleSendResetCode = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email.trim()) {
      setErrorMsg('Please enter your email address first.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: window.location.origin
      });
      if (error) throw error;
      setSuccessMsg('Reset code sent! Enter the 6-digit recovery OTP code sent to your email ✉️');
      setOtpType('recovery');
      setAuthMode('verify-otp');
    } catch (err) {
      console.error('Password reset request error:', err);
      setErrorMsg(err.message || 'Failed to send reset code.');
    } finally {
      setLoading(false);
    }
  };

  // 5. Verify OTP code (Signup or Recovery)
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!otpCode.trim() || otpCode.trim().length !== 6) {
      setErrorMsg('Please enter a valid 6-digit code.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: otpCode.trim(),
        type: otpType // 'signup' or 'recovery'
      });
      if (error) throw error;

      if (otpType === 'recovery') {
        setSuccessMsg('Code verified successfully! Choose your new password.');
        setAuthMode('reset-password');
      } else {
        setSuccessMsg('Email verified successfully! Welcome to your study workspace 🎉');
      }
    } catch (err) {
      console.error('OTP Verification error:', err);
      setErrorMsg(err.message || 'Invalid or expired verification code.');
    } finally {
      setLoading(false);
    }
  };

  // 6. Update Password (after verified recovery OTP)
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!newPassword.trim() || newPassword.trim().length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword.trim()
      });
      if (error) throw error;
      setSuccessMsg('Password updated successfully! Connecting to study arena...');
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      console.error('Update password error:', err);
      setErrorMsg(err.message || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  // 7. Google OAuth Sign-in Handler
  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (err) {
      console.error('Google Sign-In error:', err);
      setErrorMsg(err.message || 'Google authentication failed.');
      setLoading(false);
    }
  };

  // 8. Microsoft OAuth Sign-in Handler
  const handleMicrosoftSignIn = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'microsoft',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (err) {
      console.error('Microsoft Sign-In error:', err);
      setErrorMsg(err.message || 'Microsoft authentication failed.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-claude-bg px-4 select-none animate-fade-in relative overflow-hidden">
      {/* Interactive magnifying Japanese character background */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />

      {/* Decorative ambient background blur blobs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-claude-coral/10 blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none z-0" />

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
          <p className="text-xs text-claude-text-muted max-w-[300px] mx-auto leading-relaxed">
            {authMode === 'login' && 'Log in to access your custom Japanese vocabulary cards and study progress.'}
            {authMode === 'signup' && 'Create a personal study account to sync your vocabulary stats across devices.'}
            {authMode === 'forgot' && 'Reset your password. We will send a 6-digit recovery code to your registered email.'}
            {authMode === 'verify-otp' && `Enter the 6-digit verification code sent to ${email || 'your email'}.`}
            {authMode === 'reset-password' && 'Enter your new secure account password.'}
          </p>
        </div>

        {/* Dynamic Forms based on authMode */}
        {authMode === 'verify-otp' ? (
          /* OTP VERIFICATION FORM */
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-claude-text-muted tracking-wider block pl-0.5">6-Digit Verification Code</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-claude-text-muted text-xs">🔑</span>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 123456"
                  className="w-full pl-9 pr-4 py-2.5 bg-claude-sidebar/40 border border-claude-border focus:border-claude-coral/70 rounded-xl text-xs text-claude-text tracking-[0.25em] text-center focus:outline-none transition-all font-bold"
                />
              </div>
            </div>

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

            <button
              type="submit"
              disabled={loading || otpCode.length !== 6}
              className={`w-full py-3 bg-claude-coral hover:bg-claude-coral/95 text-white font-bold rounded-xl shadow-md transition-all text-xs cursor-pointer flex justify-center items-center gap-1.5 ${
                loading || otpCode.length !== 6 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
                  <span>Verifying...</span>
                </>
              ) : (
                <span>Confirm Code ⚡</span>
              )}
            </button>
          </form>
        ) : authMode === 'reset-password' ? (
          /* RESET PASSWORD FORM */
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-claude-text-muted tracking-wider block pl-0.5">New Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-claude-text-muted text-xs">🔒</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
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

            <button
              type="submit"
              disabled={loading || newPassword.length < 6}
              className={`w-full py-3 bg-claude-coral hover:bg-claude-coral/95 text-white font-bold rounded-xl shadow-md transition-all text-xs cursor-pointer flex justify-center items-center gap-1.5 ${
                loading || newPassword.length < 6 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save New Password 💾</span>
              )}
            </button>
          </form>
        ) : authMode === 'forgot' ? (
          /* FORGOT PASSWORD REQUEST FORM */
          <form onSubmit={handleSendResetCode} className="space-y-4">
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

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 bg-claude-coral hover:bg-claude-coral/95 text-white font-bold rounded-xl shadow-md transition-all text-xs cursor-pointer flex justify-center items-center gap-1.5 ${
                loading ? 'opacity-50 cursor-not-allowed animate-pulse' : ''
              }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
                  <span>Sending...</span>
                </>
              ) : (
                <span>Send Reset Code ✉️</span>
              )}
            </button>
          </form>
        ) : (
          /* STANDARD SIGN-IN / SIGN-UP FORMS */
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {authMode === 'signup' && (
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
              <div className="flex justify-between items-baseline">
                <label className="text-[10px] uppercase font-bold text-claude-text-muted tracking-wider block pl-0.5">Password</label>
                {authMode === 'login' && (
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('forgot');
                      setErrorMsg(null);
                      setSuccessMsg(null);
                    }}
                    className="text-[9px] font-bold text-claude-text-muted hover:text-claude-coral transition-colors focus:outline-none cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
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
                <span>{authMode === 'signup' ? 'Create Study Account ⚡' : 'Sign In to Arena ⚡'}</span>
              )}
            </button>

            {/* Google & Microsoft OAuth Buttons */}
            <div className="space-y-4 pt-1">
              <div className="relative flex items-center justify-center my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-claude-border/60"></div>
                </div>
                <div className="relative px-3 bg-claude-card text-[9px] uppercase font-bold text-claude-text-muted select-none">
                  Or continue with
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="py-2.5 border border-claude-border hover:border-claude-text-muted hover:bg-claude-sidebar/30 text-claude-text-heading font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-xs"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                  </svg>
                  <span>Google</span>
                </button>

                <button
                  type="button"
                  onClick={handleMicrosoftSignIn}
                  className="py-2.5 border border-claude-border hover:border-claude-text-muted hover:bg-claude-sidebar/30 text-claude-text-heading font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-xs"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 23 23" fill="currentColor">
                    <path d="M0 0h11v11H0z" fill="#f25022"/>
                    <path d="M12 0h11v11H12z" fill="#7fba00"/>
                    <path d="M0 12h11v11H0z" fill="#00a4ef"/>
                    <path d="M12 12h11v11H12z" fill="#ffb900"/>
                  </svg>
                  <span>Microsoft</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Auth Toggle Footer */}
        <div className="text-center border-t border-claude-border/50 pt-4 space-y-2 select-none flex flex-col items-center justify-center">
          <div>
            <button
              type="button"
              onClick={() => {
                setErrorMsg(null);
                setSuccessMsg(null);
                if (authMode === 'login') {
                  setAuthMode('signup');
                } else {
                  setAuthMode('login');
                }
              }}
              className="text-xs text-claude-text-muted hover:text-claude-coral font-bold transition-colors cursor-pointer"
            >
              {authMode === 'login' && 'Need a personal study workspace? Create Account'}
              {authMode === 'signup' && 'Already have an account? Log In'}
              {(authMode === 'forgot' || authMode === 'verify-otp' || authMode === 'reset-password') && 'Remember your credentials? Log In'}
            </button>
          </div>
          {authMode === 'login' && (
            <div>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('forgot');
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className="text-xs text-claude-text-muted hover:text-claude-coral font-bold transition-colors cursor-pointer underline decoration-dotted underline-offset-2"
              >
                Forgot your password? Reset it here ✉️
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
