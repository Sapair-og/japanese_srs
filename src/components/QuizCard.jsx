/* eslint-disable */
import React, { useState, useEffect, useRef } from 'react';
import { generateMnemonic } from '../utils/mnemonicGenerator';
import { toKana } from 'wanakana';


export default function QuizCard({ 
  currentCard, 
  allCards, 
  queueLength, 
  totalSessionCards, 
  onAnswer, 
  onRestartSession, 
  activeTab, 
  setActiveTab, 
  difficulty,
  setDifficulty,
  sessionLimit,
  setSessionLimit,
  onStartSession,
  onResetConfig,
  questionIndex,
  timerEnabled,
  setTimerEnabled,
  timePerCard,
  setTimePerCard,
  selectedLessons,
  setSelectedLessons,
  themeRegion,
  themeMode
}) {
  const [choices, setChoices] = useState([]);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isShake, setIsShake] = useState(false);
  const [showFurigana, setShowFurigana] = useState(true);
  const [showRomaji, setShowRomaji] = useState(true);
  const [useSerif, setUseSerif] = useState(true);

  const [answerMode, setAnswerMode] = useState(() => {
    return localStorage.getItem('jp_vocab_answermode') || 'mc';
  });
  const [typedAnswer, setTypedAnswer] = useState('');



  const currentWord = currentCard ? (currentCard.hiragana || '') : '';

  useEffect(() => {
    if (answerMode === 'calligraphy') {
      setAnswerMode('mc');
      localStorage.setItem('jp_vocab_answermode', 'mc');
    } else {
      localStorage.setItem('jp_vocab_answermode', answerMode);
    }
  }, [answerMode]);







  // Timer Session Stats
  const [timeLeft, setTimeLeft] = useState(timePerCard);
  const [timeouts, setTimeouts] = useState(0);
  const [elapsedTimes, setElapsedTimes] = useState([]);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [cardStartTime, setCardStartTime] = useState(null);
  const [isTimeoutOccurred, setIsTimeoutOccurred] = useState(false);
  const [sessionSaved, setSessionSaved] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(0);
  
  const filteredPoolSize = selectedLessons && selectedLessons.length === 0
    ? allCards.length
    : allCards.filter(c => selectedLessons.includes(c.lesson || 'General')).length;
  
  // Randomly select one of the two user-supplied success GIFs for completion screen
  const [successGif] = useState(() => {
    const gifName = Math.random() < 0.5 ? 'success_dance_1.gif' : 'success_dance_2.gif';
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    if (supabaseUrl) {
      const cleanUrl = supabaseUrl.endsWith('/') ? supabaseUrl.slice(0, -1) : supabaseUrl;
      return `${cleanUrl}/storage/v1/object/public/assets/${gifName}`;
    }
    return `/${gifName}`;
  });

  // Auto-speak state persisted in local storage
  const [autoSpeak, setAutoSpeak] = useState(() => {
    const saved = localStorage.getItem('jp_vocab_autospeak');
    return saved === 'true';
  });

  // Sync auto-speak settings
  useEffect(() => {
    localStorage.setItem('jp_vocab_autospeak', autoSpeak);
  }, [autoSpeak]);

  // Pre-load SpeechSynthesis voices (vital for Chrome/Edge)
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
    }
  }, []);

  // Ambient interactive background canvas hook
  const bgCanvasRef = useRef(null);

  useEffect(() => {
    const canvas = bgCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let animationId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const mouse = { x: -1000, y: -1000, radius: 130, clicked: false, clickX: 0, clickY: 0 };
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };
    const handleMouseClick = (e) => {
      mouse.clickX = e.clientX;
      mouse.clickY = e.clientY;
      mouse.clicked = true;
      setTimeout(() => { mouse.clicked = false; }, 100);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('click', handleMouseClick);

    class Particle {
      constructor() {
        this.reset();
        this.y = Math.random() * height;
      }

      reset() {
        this.x = Math.random() * width;
        this.size = Math.random() * 11 + 6; // Increased size range (6px to 17px)
        this.speedX = (Math.random() - 0.5) * 0.45;
        this.opacity = Math.random() * 0.4 + 0.45; // Higher base opacity (0.45 to 0.85)
        this.angle = Math.random() * Math.PI * 2;
        this.spin = (Math.random() - 0.5) * 0.025;

        // Theme based particle types
        const r = themeRegion || 'liyue';
        if (r === 'sumeru') {
          // Sumeru: green leaves drifting down
          this.y = -20;
          this.speedY = Math.random() * 0.8 + 0.4;
          this.color = Math.random() < 0.5 ? 'rgba(74, 222, 128, ' : 'rgba(34, 197, 94, ';
        } else if (r === 'fontaine') {
          // Fontaine: water bubbles floating up
          this.y = height + 20;
          this.speedY = -(Math.random() * 0.7 + 0.4);
          this.color = 'rgba(56, 189, 248, ';
        } else if (r === 'inazuma') {
          // Inazuma: violet sparks floating
          this.y = Math.random() * height;
          this.speedY = (Math.random() - 0.5) * 0.35;
          this.speedX = (Math.random() - 0.5) * 0.35;
          this.color = 'rgba(168, 85, 247, ';
        } else if (r === 'abyss') {
          // Abyss: deep purple space embers
          this.y = Math.random() * height;
          this.speedY = (Math.random() - 0.5) * 0.35;
          this.speedX = (Math.random() - 0.5) * 0.35;
          this.color = 'rgba(244, 63, 94, ';
        } else if (r === 'snezhnaya') {
          // Snezhnaya: cryo ice crystals drifting down
          this.y = -20;
          this.speedY = Math.random() * 0.6 + 0.3;
          this.speedX = (Math.random() - 0.5) * 0.25;
          this.color = 'rgba(186, 230, 253, ';
        } else if (r === 'khaenriah') {
          // Khaenri'ah: mechanical amber gear particles
          this.y = Math.random() * height;
          this.speedY = (Math.random() - 0.5) * 0.25;
          this.speedX = (Math.random() - 0.5) * 0.25;
          this.color = 'rgba(234, 179, 8, ';
        } else if (r === 'liyue') {
          // Liyue: floating geo crystals rising slowly
          this.y = height + 20;
          this.speedY = -(Math.random() * 0.4 + 0.2);
          this.color = 'rgba(245, 158, 11, ';
        } else if (r === 'mondstadt') {
          // Mondstadt: dandelion fluffy seeds drifting gently
          this.y = Math.random() * height;
          this.speedY = (Math.random() - 0.5) * 0.25;
          this.speedX = Math.random() * 0.4 + 0.1;
          this.color = 'rgba(14, 165, 233, ';
        } else if (r === 'natlan') {
          // Natlan: pyro embers rising quickly
          this.y = height + 20;
          this.speedY = -(Math.random() * 0.9 + 0.5);
          this.color = 'rgba(249, 115, 22, ';
        } else {
          // Default: Cherry blossoms falling
          this.y = -20;
          this.speedY = Math.random() * 0.7 + 0.4;
          this.speedX = Math.random() * 0.5 + 0.2;
          this.color = 'rgba(251, 207, 232, ';
        }
      }

      update() {
        this.angle += this.spin;

        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          const r = themeRegion || 'liyue';

          if (r === 'fontaine') {
            // Fontaine: bubbles swirl around cursor
            const swirlAngle = Math.atan2(dy, dx) + Math.PI / 2;
            this.x += Math.cos(swirlAngle) * force * 2.2;
            this.y += Math.sin(swirlAngle) * force * 2.2;
            
            // Pop on click
            if (mouse.clicked) {
              const clickDx = mouse.clickX - this.x;
              const clickDy = mouse.clickY - this.y;
              if (Math.sqrt(clickDx * clickDx + clickDy * clickDy) < 55) {
                this.reset();
                return;
              }
            }
          } else if (r === 'inazuma') {
            // Inazuma: sparks follow / gravitate slightly
            this.x += (dx / distance) * force * 1.5;
            this.y += (dy / distance) * force * 1.5;
          } else {
            // Others: push away
            this.x -= (dx / distance) * force * 2.2;
            this.y -= (dy / distance) * force * 2.2;
          }
        }

        this.x += this.speedX;
        this.y += this.speedY;

        if (this.y > height + 25 || this.y < -25 || this.x > width + 25 || this.x < -25) {
          this.reset();
        }
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color + this.opacity + ')';
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        // Dynamic element-themed particle shadows (neon glow!)
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color + '0.9)';

        const r = themeRegion || 'liyue';
        if (r === 'sumeru') {
          // Leaf shape
          ctx.beginPath();
          ctx.ellipse(0, 0, this.size, this.size / 2.2, 0, 0, Math.PI * 2);
          ctx.fill();
        } else if (r === 'fontaine') {
          // Bubble
          ctx.strokeStyle = this.color + '0.85)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(0, 0, this.size, 0, Math.PI * 2);
          ctx.stroke();
          ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
          ctx.beginPath();
          ctx.arc(-this.size / 3, -this.size / 3, this.size / 4, 0, Math.PI * 2);
          ctx.fill();
        } else if (r === 'inazuma') {
          // Electro diamond
          ctx.beginPath();
          ctx.moveTo(0, -this.size);
          ctx.lineTo(this.size / 2, 0);
          ctx.lineTo(0, this.size);
          ctx.lineTo(-this.size / 2, 0);
          ctx.closePath();
          ctx.fill();
        } else if (r === 'snezhnaya') {
          // Snowflake
          ctx.strokeStyle = this.color + '0.9)';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            ctx.moveTo(0, 0);
            ctx.lineTo(0, this.size);
            ctx.rotate(Math.PI / 3);
          }
          ctx.stroke();
        } else if (r === 'abyss') {
          // Void star spark
          ctx.beginPath();
          for (let i = 0; i < 4; i++) {
            ctx.lineTo(0, -this.size);
            ctx.lineTo(this.size / 4, -this.size / 4);
            ctx.rotate(Math.PI / 2);
          }
          ctx.closePath();
          ctx.fill();
        } else if (r === 'mondstadt') {
          // Dandelion seed star lines
          ctx.strokeStyle = this.color + '0.85)';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(0, 0, 2, 0, Math.PI * 2);
          ctx.stroke();
          for (let i = 0; i < 8; i++) {
            ctx.moveTo(0, 0);
            ctx.lineTo(0, this.size);
            ctx.rotate(Math.PI / 4);
          }
          ctx.stroke();
        } else if (r === 'natlan') {
          // Pyro ember flame teardrop
          ctx.beginPath();
          ctx.moveTo(0, -this.size);
          ctx.quadraticCurveTo(this.size / 2, 0, 0, this.size);
          ctx.quadraticCurveTo(-this.size / 2, 0, 0, -this.size);
          ctx.fill();
        } else {
          // Liyue & Khaenri'ah: Square diamond Geo core
          ctx.beginPath();
          ctx.rect(-this.size / 2, -this.size / 2, this.size, this.size);
          ctx.fill();
        }

        ctx.restore();
      }
    }

    const particleCount = 28;
    const particlesList = [];
    for (let i = 0; i < particleCount; i++) {
      particlesList.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Inazuma electro-spark linking
      if (themeRegion === 'inazuma') {
        for (let i = 0; i < particlesList.length; i++) {
          const p = particlesList[i];
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            ctx.save();
            ctx.globalAlpha = ((110 - dist) / 110) * 0.35;
            ctx.strokeStyle = 'rgba(168, 85, 247, 0.7)';
            ctx.lineWidth = 1.25;
            ctx.shadowBlur = 5;
            ctx.shadowColor = 'rgba(168, 85, 247, 0.9)';
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
            ctx.restore();
          }
        }
      }

      particlesList.forEach((p) => {
        p.update();
        p.draw();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('click', handleMouseClick);
    };
  }, [themeRegion, themeMode]);

  const canvasRef = useRef(null);
  const animationFrameId = useRef(null);
  const particles = useRef([]);

  const spawnParticles = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    const colors = [
      '#ffb7c5', // Sakura pink light
      '#ff9ebb', // Sakura pink medium
      '#ff7fa3', // Sakura pink dark
      '#e06847', // Coral accent
      '#ffe3e8', // Very light pink
    ];

    const tempParticles = [];
    for (let i = 0; i < 30; i++) {
      tempParticles.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 60,
        y: canvas.height / 2 + (Math.random() - 0.5) * 60,
        vx: (Math.random() - 0.5) * 6,
        vy: -Math.random() * 4 - 3,
        size: Math.random() * 8 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.15,
        opacity: 1,
        decay: Math.random() * 0.02 + 0.015,
      });
    }
    particles.current = tempParticles;

    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }

    const animate = () => {
      if (particles.current.length === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.current = particles.current.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.12; // Gravity
        p.angle += p.spin;
        p.opacity -= p.decay;

        if (p.opacity <= 0) return false;

        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);

        // Sakura petal shape
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, p.size / 1.7, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(p.size, 0);
        ctx.lineTo(p.size * 0.7, -p.size * 0.2);
        ctx.lineTo(p.size * 0.7, p.size * 0.2);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
        return true;
      });

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();
  };

  useEffect(() => {
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  const playCorrectSound = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const now = ctx.currentTime;
      
      // Notes: C5 -> E5 -> G5 (Aesthetic success major chord chime)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, now); // C5
      gain1.gain.setValueAtTime(0.06, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.3);
      
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(659.25, now + 0.08); // E5
      gain2.gain.setValueAtTime(0.06, now + 0.08);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.08);
      osc2.stop(now + 0.38);

      const osc3 = ctx.createOscillator();
      const gain3 = ctx.createGain();
      osc3.type = 'sine';
      osc3.frequency.setValueAtTime(783.99, now + 0.16); // G5
      gain3.gain.setValueAtTime(0.06, now + 0.16);
      gain3.gain.exponentialRampToValueAtTime(0.001, now + 0.46);
      osc3.connect(gain3);
      gain3.connect(ctx.destination);
      osc3.start(now + 0.16);
      osc3.stop(now + 0.46);
    } catch (e) {
      console.warn("Web Audio Context blocked/unsupported:", e);
    }
  };

  const playIncorrectSound = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const now = ctx.currentTime;
      
      // Detuned sawtooth wrong buzzer sound
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(125.00, now); // Low note
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(129.00, now); // Detune buzz
      
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.4);
      
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      
      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.4);
      osc2.stop(now + 0.4);
    } catch (e) {
      console.warn("Web Audio Context blocked/unsupported:", e);
    }
  };

  const speakJapanese = (text) => {
    if (currentCard && currentCard.audio_url) {
      const audio = new Audio(currentCard.audio_url);
      audio.play().catch(err => {
        console.warn("Custom audio play failed, falling back to TTS:", err);
        speakJapaneseTTS(text);
      });
    } else {
      speakJapaneseTTS(text);
    }
  };

  const speakJapaneseTTS = (text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    utterance.rate = 0.85; 
    
    const voices = window.speechSynthesis.getVoices();
    const jaVoice = voices.find(v => v.lang === 'ja-JP' || v.lang.startsWith('ja'));
    if (jaVoice) {
      utterance.voice = jaVoice;
    }
    window.speechSynthesis.speak(utterance);
  };

  const handleTimeout = () => {
    playIncorrectSound();
    setIsChecking(true);
    setSelectedChoice(null);
    setIsShake(true);
    setIsTimeoutOccurred(true);
    setTimeouts(prev => prev + 1);
    setElapsedTimes(prev => [...prev, timePerCard]);

    setTimeout(() => {
      setIsTimeoutOccurred(false);
      onAnswer(false, currentCard);
      setTypedAnswer('');
    }, 1500);
  };

  const handleTypedSubmit = (e) => {
    if (e) e.preventDefault();
    if (isChecking || !typedAnswer.trim()) return;

    setIsChecking(true);

    const elapsed = cardStartTime ? (performance.now() - cardStartTime) / 1000 : 0;
    setElapsedTimes(prev => [...prev, Math.min(elapsed, timePerCard)]);

    const isCorrect = 
      typedAnswer.toLowerCase().trim() === currentCard.hiragana.toLowerCase().trim() ||
      (currentCard.romaji && typedAnswer.toLowerCase().trim() === currentCard.romaji.toLowerCase().trim());

    if (isCorrect) {
      playCorrectSound();
      spawnParticles();
      setTimeout(() => {
        onAnswer(true, currentCard);
        setTypedAnswer('');
      }, 1200);
    } else {
      playIncorrectSound();
      setIsShake(true);
      setTimeout(() => {
        onAnswer(false, currentCard);
        setTypedAnswer('');
      }, 1700);
    }
  };

  const handleChoiceClick = (choice) => {
    if (isChecking) return; // Prevent double clicks
    
    setSelectedChoice(choice);
    setIsChecking(true);

    // Track response speed
    const elapsed = cardStartTime ? (performance.now() - cardStartTime) / 1000 : 0;
    setElapsedTimes(prev => [...prev, Math.min(elapsed, timePerCard)]);
    
    const isCorrect = choice.toLowerCase().trim() === currentCard.english.toLowerCase().trim();

    if (isCorrect) {
      playCorrectSound();
      spawnParticles();
      setTimeout(() => {
        onAnswer(true, currentCard);
      }, 1000);
    } else {
      playIncorrectSound();
      setIsShake(true);
      setTimeout(() => {
        onAnswer(false, currentCard);
      }, 1500);
    }
  };

  // Reset/Initialize session timer states
  useEffect(() => {
    if (totalSessionCards === 0) {
      setTimeouts(0);
      setElapsedTimes([]);
      setSessionStartTime(null);
      setCardStartTime(null);
      setIsTimeoutOccurred(false);
      setSessionSaved(false);
    } else if (!sessionStartTime) {
      setSessionStartTime(performance.now());
      setSessionSaved(false);
    }
  }, [totalSessionCards]);

  // Save session to history when queue completes
  useEffect(() => {
    if (totalSessionCards > 0 && !currentCard && !sessionSaved) {
      setSessionSaved(true);
      
      const duration = sessionStartTime ? Math.round((performance.now() - sessionStartTime) / 1000) : 0;
      setSessionDuration(duration);
      const avgSpeed = elapsedTimes.length > 0 ? parseFloat((elapsedTimes.reduce((a, b) => a + b, 0) / elapsedTimes.length).toFixed(1)) : 0;
      
      const newSession = {
        id: Math.random().toString(36).substring(2, 11),
        timestamp: new Date().toISOString(),
        duration,
        avgSpeed,
        timeouts,
        totalCards: totalSessionCards,
        difficulty
      };
      
      try {
        const savedHistory = localStorage.getItem('jp_vocab_session_history');
        const history = savedHistory ? JSON.parse(savedHistory) : [];
        const updatedHistory = [newSession, ...history].slice(0, 10);
        localStorage.setItem('jp_vocab_session_history', JSON.stringify(updatedHistory));
        
        // Dispatch window event so other tabs/components know history was updated
        window.dispatchEvent(new Event('jp_vocab_history_updated'));
      } catch (e) {
        console.error('Failed to save session history:', e);
      }
    }
  }, [currentCard, totalSessionCards, sessionSaved, sessionStartTime, elapsedTimes, timeouts, difficulty]);

  // Timer countdown handler
  useEffect(() => {
    if (totalSessionCards === 0 || !currentCard || !timerEnabled || isChecking || isTimeoutOccurred) {
      return;
    }

    setTimeLeft(timePerCard);
    setCardStartTime(performance.now());

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentCard, timerEnabled, isChecking, isTimeoutOccurred, totalSessionCards, timePerCard]);


  // Trigger audio on question pop-up if Auto-Speak is enabled
  useEffect(() => {
    if (currentCard && autoSpeak) {
      const audioTimer = setTimeout(() => {
        speakJapanese(currentCard.hiragana);
      }, 350);
      return () => clearTimeout(audioTimer);
    }
  }, [currentCard, autoSpeak]);

  // Keyboard hotkeys handler
  useEffect(() => {
    if (totalSessionCards === 0 || !currentCard || isChecking) {
      return;
    }

    const handleKeyDown = (e) => {
      if (['1', '2', '3', '4'].includes(e.key)) {
        const idx = parseInt(e.key) - 1;
        if (choices[idx]) {
          handleChoiceClick(choices[idx]);
        }
      }
      
      if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        speakJapanese(currentCard.hiragana);
      }
      
      if (e.key.toLowerCase() === 'q') {
        if (window.confirm("Are you sure you want to quit this study session? Your progress in this session will be lost.")) {
          onResetConfig();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentCard, isChecking, choices, totalSessionCards]);



  // Generate multiple choice options whenever the current card changes
  useEffect(() => {
    if (!currentCard) return;

    // Reset states
    setSelectedChoice(null);
    setIsChecking(false);
    setIsShake(false);
    setTypedAnswer('');

    // Filter out cards with same english definition (prevent duplicate correct answers)
    const otherCards = allCards.filter(
      c => c.english.toLowerCase().trim() !== currentCard.english.toLowerCase().trim()
    );
    
    let candidates = [];
    if (difficulty === 'hard' && currentCard.group) {
      // Find cards in the same lexical/verb group (e.g. Ru-Verb, Noun, etc.)
      candidates = otherCards.filter(
        c => c.group && c.group.toLowerCase().trim() === currentCard.group.toLowerCase().trim()
      );
    }
    
    // Extract unique english definitions from matching-group cards
    let uniqueOtherMeanings = Array.from(new Set(candidates.map(c => c.english)));
    
    // If not enough words in same group, pad with generic words from the entire database
    if (uniqueOtherMeanings.length < 3) {
      const genericMeanings = Array.from(new Set(otherCards.map(c => c.english)));
      for (const meaning of genericMeanings) {
        if (!uniqueOtherMeanings.includes(meaning)) {
          uniqueOtherMeanings.push(meaning);
        }
        if (uniqueOtherMeanings.length >= 3) break;
      }
    }

    // Shuffle and pick 3 incorrect options
    const shuffledOthers = uniqueOtherMeanings.sort(() => 0.5 - Math.random());
    const incorrect = shuffledOthers.slice(0, 3);
    
    // Fallbacks if vocab database is extremely tiny (e.g. 1-2 words total)
    const fallbackList = ['hello / good day', 'goodbye', 'thank you', 'excuse me / sorry', 'water', 'yes', 'no'];
    while (incorrect.length < 3) {
      const fb = fallbackList[Math.floor(Math.random() * fallbackList.length)];
      if (fb.toLowerCase().trim() !== currentCard.english.toLowerCase().trim() && !incorrect.includes(fb)) {
        incorrect.push(fb);
      }
    }

    // Combine correct and incorrect, and shuffle to determine final layout
    const combined = [currentCard.english, ...incorrect].sort(() => 0.5 - Math.random());
    setChoices(combined);
  }, [currentCard, allCards, difficulty, questionIndex]);

  if (totalSessionCards === 0) {
    return (
      <>
        <canvas ref={bgCanvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-60 dark:opacity-40" />
        <div className="max-w-xl mx-auto w-full px-4 py-8 animate-fade-in relative z-10">
          <div className="claude-panel border-claude-border rounded-3xl p-8 space-y-6 shadow-xs select-none">
            <div className="text-center space-y-2 border-b border-claude-border/50 pb-4">
              <h2 className="text-2xl font-extrabold text-claude-text-heading claude-serif">
                Configure Study Arena ✒️
              </h2>
              <p className="text-xs text-claude-text-muted">
                Select your settings and launch your customized Japanese vocabulary review.
              </p>
            </div>

            <div className="space-y-5">
              {/* Difficulty Level Settings */}
              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <label className="text-[10px] uppercase font-bold text-claude-text-muted tracking-wider">
                    Difficulty Level
                  </label>
                  <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded transition-all duration-300 ${
                    difficulty === 'hard' 
                      ? 'bg-red-500/10 text-red-500 dark:text-red-400 border border-red-500/25' 
                      : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25'
                  }`}>
                    {difficulty === 'hard' ? 'Hard Mode' : 'Easy Mode'}
                  </span>
                </div>
                <div className="relative flex bg-claude-sidebar p-1 rounded-xl border border-claude-border overflow-hidden select-none">
                  {/* Sliding indicator pill */}
                  <div 
                    className="absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-lg transition-all duration-300 ease-out shadow-xs border pointer-events-none"
                    style={{
                      transform: difficulty === 'hard' ? 'translateX(100%)' : 'translateX(0)',
                      backgroundColor: difficulty === 'hard' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                      borderColor: difficulty === 'hard' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(16, 185, 129, 0.4)',
                    }}
                  />
                  <button
                    onClick={() => setDifficulty('easy')}
                    className={`relative z-10 flex-1 py-2 text-xs font-semibold rounded-lg transition-all duration-300 cursor-pointer ${
                      difficulty === 'easy'
                        ? 'text-emerald-600 dark:text-emerald-400 font-extrabold'
                        : 'text-claude-text-muted hover:text-claude-text'
                    }`}
                  >
                    🟢 Easy
                  </button>
                  <button
                    onClick={() => setDifficulty('hard')}
                    className={`relative z-10 flex-1 py-2 text-xs font-semibold rounded-lg transition-all duration-300 cursor-pointer ${
                      difficulty === 'hard'
                        ? 'text-red-500 dark:text-red-400 font-extrabold'
                        : 'text-claude-text-muted hover:text-claude-text'
                    }`}
                  >
                    🔴 Hard
                  </button>
                </div>
              </div>

              {/* Session Size slider & quick select buttons */}
              <div className="space-y-2.5">
                <div className="flex justify-between items-baseline">
                  <label className="text-[10px] uppercase font-bold text-claude-text-muted tracking-wider">
                    Session Size
                  </label>
                  <span className="text-xs font-bold text-claude-coral bg-claude-coral/10 border border-claude-coral/20 px-2 py-0.5 rounded">
                    {Math.min(sessionLimit, filteredPoolSize || 1)} / {filteredPoolSize} Cards
                  </span>
                </div>
                
                <div className="flex items-center gap-3 py-2">
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
                          className={`py-1.5 px-2 rounded-lg border text-[10px] font-bold transition-all cursor-pointer ${
                            isSelected 
                              ? 'bg-claude-coral/10 border-claude-coral text-claude-coral' 
                              : 'bg-claude-card hover:bg-claude-sidebar border-claude-border text-claude-text-muted hover:text-claude-text-heading'
                          }`}
                        >
                          {label} Cards
                        </button>
                      );
                    })}
                </div>
              </div>

              {/* Select Lessons filter */}
              <div className="p-4 bg-claude-sidebar/40 border border-claude-border rounded-2xl space-y-3 select-none">
                <div className="flex justify-between items-baseline">
                  <label className="text-[10px] uppercase font-bold text-claude-text-muted tracking-wider">
                    Lessons Category Filter
                  </label>
                  <span className="text-xs font-bold text-claude-coral bg-claude-coral/10 border border-claude-coral/20 px-2 py-0.5 rounded">
                    {selectedLessons.length === 0 ? 'All Lessons' : `${selectedLessons.length} selected`}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto pr-1 py-1">
                  <button
                    type="button"
                    onClick={() => setSelectedLessons([])}
                    className={`py-1 px-2.5 rounded-lg border text-[10px] font-bold transition-all cursor-pointer ${
                      selectedLessons.length === 0
                        ? 'bg-claude-coral/10 border-claude-coral text-claude-coral'
                        : 'bg-claude-card hover:bg-claude-sidebar border-claude-border text-claude-text-muted hover:text-claude-text-heading'
                    }`}
                  >
                    🌐 All Lessons
                  </button>
                  {Array.from(new Set(allCards.map(c => c.lesson || 'General'))).sort().map((les) => {
                    const isSelected = selectedLessons.includes(les);
                    return (
                      <button
                        key={les}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setSelectedLessons(prev => prev.filter(l => l !== les));
                          } else {
                            setSelectedLessons(prev => [...prev, les]);
                          }
                        }}
                        className={`py-1 px-2.5 rounded-lg border text-[10px] font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-claude-coral/10 border-claude-coral text-claude-coral'
                            : 'bg-claude-card hover:bg-claude-sidebar border-claude-border text-claude-text-muted hover:text-claude-text-heading'
                        }`}
                      >
                        📁 {les}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Voice auto pronunciation option */}
              <div className="flex items-center justify-between p-3.5 bg-claude-sidebar/40 border border-claude-border rounded-2xl select-none">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-claude-text-heading block">Auto-Speak Vocab 🔊</span>
                  <span className="text-[9px] text-claude-text-muted block">Synthesize Japanese voice automatically on card display</span>
                </div>
                <button
                  onClick={() => setAutoSpeak(!autoSpeak)}
                  className={`px-3 py-1.5 rounded-lg border text-[10px] font-extrabold transition-all cursor-pointer ${
                    autoSpeak 
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400' 
                      : 'bg-claude-card border-claude-border text-claude-text-muted hover:text-claude-text-heading'
                  }`}
                >
                  {autoSpeak ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              {/* Answer Mode setting option */}
              <div className="flex items-center justify-between p-3.5 bg-claude-sidebar/40 border border-claude-border rounded-2xl select-none">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-claude-text-heading block">Quiz Answer Mode ✍️</span>
                  <span className="text-[9px] text-claude-text-muted block">Choose multiple choice or typed reading</span>
                </div>
                <button
                  onClick={() => {
                    if (answerMode === 'mc') setAnswerMode('typed');
                    else setAnswerMode('mc');
                  }}
                  className={`px-3 py-1.5 rounded-lg border text-[10px] font-extrabold transition-all cursor-pointer ${
                    answerMode !== 'mc' 
                      ? 'bg-claude-coral/15 border-claude-coral text-claude-coral' 
                      : 'bg-claude-card border-claude-border text-claude-text-muted hover:text-claude-text-heading'
                  }`}
                >
                  {answerMode === 'mc' && 'Multiple Choice'}
                  {answerMode === 'typed' && 'Typed Reading'}
                </button>
              </div>

              {/* Timer settings configuration */}
              <div className="p-4 bg-claude-sidebar/40 border border-claude-border rounded-2xl space-y-3 select-none">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-claude-text-heading block">Session Timer ⏱️</span>
                    <span className="text-[9px] text-claude-text-muted block">Enforce a strict countdown limit per card</span>
                  </div>
                  <button
                    onClick={() => setTimerEnabled(!timerEnabled)}
                    className={`px-3 py-1.5 rounded-lg border text-[10px] font-extrabold transition-all cursor-pointer ${
                      timerEnabled 
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400' 
                        : 'bg-claude-card border-claude-border text-claude-text-muted hover:text-claude-text-heading'
                    }`}
                  >
                    {timerEnabled ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
                
                {timerEnabled && (
                  <div className="space-y-1.5 pt-1.5 border-t border-claude-border/50">
                    <div className="flex justify-between text-[10px] font-bold text-claude-text-muted">
                      <span>Limit per Card</span>
                      <span className="text-claude-coral">{timePerCard} seconds</span>
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
                    <div className="flex justify-between text-[8px] text-claude-text-muted/65">
                      <span>5s (Rapid)</span>
                      <span>15s (Medium)</span>
                      <span>30s (Relaxed)</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <button
                onClick={onStartSession}
                disabled={allCards.length === 0}
                className={`w-full py-4 text-xs premium-btn-coral text-white font-black rounded-2xl text-center flex items-center justify-center gap-2 cursor-pointer ${
                  allCards.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Launch Study Session ⚡
              </button>
              <button
                onClick={() => setActiveTab('dashboard')}
                className="w-full py-3.5 bg-claude-card border border-claude-border hover:border-claude-text-muted text-claude-text-heading font-semibold rounded-2xl transition-all text-xs cursor-pointer text-center"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!currentCard) {
    // Session Complete view
    const progressPercent = totalSessionCards > 0 ? 100 : 0;
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
                Outstanding work! You have successfully reviewed all active cards in this session queue.
              </p>
            </div>

            {/* Performance Summary Metrics */}
            {timerEnabled && (
              <div className="grid grid-cols-3 gap-3 p-4 bg-claude-sidebar/35 border border-claude-border rounded-2xl text-center select-none max-w-sm mx-auto">
                <div>
                  <span className="text-[9px] uppercase font-bold text-claude-text-muted block">Duration</span>
                  <span className="text-sm font-extrabold text-claude-text-heading mt-0.5 block">
                    {sessionDuration}s
                  </span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-claude-text-muted block">Avg Speed</span>
                  <span className="text-sm font-extrabold text-claude-text-heading mt-0.5 block">
                    {elapsedTimes.length > 0 ? (elapsedTimes.reduce((a, b) => a + b, 0) / elapsedTimes.length).toFixed(1) : '0'}s
                  </span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-claude-text-muted block">Timeouts</span>
                  <span className="text-sm font-extrabold text-red-500 mt-0.5 block">
                    {timeouts}
                  </span>
                </div>
              </div>
            )}

            {/* Completion Progress ring */}
            <div className="flex justify-center py-2">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    className="stroke-claude-border"
                    strokeWidth="5"
                    fill="transparent"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    className="stroke-claude-coral transition-all duration-1000"
                    strokeWidth="5"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 56}
                    strokeDashoffset={2 * Math.PI * 56 * (1 - progressPercent / 100)}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-2xl font-extrabold text-claude-text-heading claude-serif">100%</span>
                  <span className="text-[9px] uppercase font-bold text-claude-text-muted">Cleared</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <button
                onClick={onRestartSession}
                className="w-full py-3.5 premium-btn-coral text-white font-bold rounded-2xl text-xs cursor-pointer"
              >
                Start New Session ⚡
              </button>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={onResetConfig}
                  className="py-3 bg-claude-sidebar border border-claude-border hover:border-claude-text-muted text-claude-text-heading font-semibold rounded-2xl transition-all text-xs cursor-pointer"
                >
                  Modify Settings ⚙️
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
        </div>
      </>
    );
  }

  // Active Quiz View
  const progressPercent = totalSessionCards > 0 
    ? Math.round(((totalSessionCards - queueLength) / totalSessionCards) * 100) 
    : 0;


  return (
    <>
      <canvas ref={bgCanvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-60 dark:opacity-40" />
      <div className="max-w-xl mx-auto w-full px-4 py-8 animate-fade-in relative z-10">
        <div className="space-y-6">
          {/* Header/Stats overlay */}
          <div className="flex justify-between items-center text-xs font-semibold text-claude-text-muted px-1 select-none">
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

          {/* Core Flashcard Container */}
          <div className="flip-card-container">
            <div className={`flip-card-inner ${isChecking ? 'flipped' : ''}`}>
              
              {/* FRONT FACE */}
              <div 
                className={`flip-card-front claude-panel study-card-hover border-claude-border p-5 sm:p-12 text-center relative overflow-hidden shadow-md ${
                  isShake ? 'animate-shake border-claude-error' : ''
                }`}
              >
                {/* Transparent Canvas for Sakura Particle Burst */}
                <canvas 
                  ref={canvasRef} 
                  className="absolute inset-0 w-full h-full pointer-events-none z-30" 
                />
                {/* Shrubby shrinking visual countdown bar */}
                {timerEnabled && !isChecking && (
                  <div 
                    className="absolute top-0 left-0 h-1 bg-claude-coral transition-all duration-1000 ease-linear"
                    style={{
                      width: `${(timeLeft / timePerCard) * 100}%`,
                    }}
                  />
                )}
                {/* Config switches (Furigana / Romaji / AutoSpeak / Fonts) */}
                <div className="absolute top-4 right-4 flex gap-2 z-10">
                  <button
                    onClick={() => setUseSerif(!useSerif)}
                    className={`w-8 h-8 rounded-lg border flex items-center justify-center text-xs font-bold transition-all cursor-pointer ${
                      useSerif 
                        ? 'bg-claude-card border-claude-border text-claude-text-heading' 
                        : 'bg-claude-coral/10 border-claude-coral/30 text-claude-coral'
                    }`}
                    title={useSerif ? 'Switch to Sans-Serif font' : 'Switch to Serif Mincho font'}
                  >
                    {useSerif ? '明' : 'ゴ'}
                  </button>
                  <button
                    onClick={() => setShowFurigana(!showFurigana)}
                    className={`w-8 h-8 rounded-lg border flex items-center justify-center text-xs font-bold transition-all cursor-pointer ${
                      showFurigana 
                        ? 'bg-claude-coral/10 border-claude-coral/30 text-claude-coral' 
                        : 'bg-claude-card border-claude-border text-claude-text-muted hover:text-claude-text-heading'
                    }`}
                    title="Toggle Furigana/Hiragana hints"
                  >
                    あ
                  </button>
                  <button
                    onClick={() => setShowRomaji(!showRomaji)}
                    className={`w-8 h-8 rounded-lg border flex items-center justify-center text-xs font-bold transition-all cursor-pointer ${
                      showRomaji 
                        ? 'bg-claude-coral/10 border-claude-coral/30 text-claude-coral' 
                        : 'bg-claude-card border-claude-border text-claude-text-muted hover:text-claude-text-heading'
                    }`}
                    title="Toggle Romaji hints"
                  >
                    A
                  </button>
                  <button
                    onClick={() => setAutoSpeak(!autoSpeak)}
                    className={`w-8 h-8 rounded-lg border flex items-center justify-center text-xs font-bold transition-all cursor-pointer ${
                      autoSpeak 
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400' 
                        : 'bg-claude-card border-claude-border text-claude-text-muted hover:text-claude-text-heading'
                    }`}
                    title="Toggle Auto-Speak on Card Popup"
                  >
                    🔊
                  </button>
                  <button
                    onClick={() => setTimerEnabled(!timerEnabled)}
                    className={`w-8 h-8 rounded-lg border flex items-center justify-center text-xs font-bold transition-all cursor-pointer ${
                      timerEnabled 
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400' 
                        : 'bg-claude-card border-claude-border text-claude-text-muted hover:text-claude-text-heading'
                    }`}
                    title={timerEnabled ? 'Disable Timer' : 'Enable Timer'}
                  >
                    ⏱️
                  </button>
                </div>

                {/* Badges Row */}
                <div className="flex justify-center items-center gap-3 mb-4 select-none pt-4">
                  {currentCard.group && (
                    <span className="text-[10px] uppercase tracking-wider font-extrabold bg-claude-sidebar text-claude-coral px-3 py-1 rounded-full border border-claude-border">
                      {currentCard.group}
                      {difficulty === 'hard' && ' • Hard'}
                    </span>
                  )}
                </div>

                {/* Word Display Area */}
                <div className="py-6 min-h-[160px] flex flex-col justify-center items-center w-full">
                  {answerMode === 'typed' ? (
                    currentCard.kanji ? (
                      <div className="space-y-3">
                        <div className="text-[10px] uppercase tracking-wider font-extrabold text-claude-text-muted">Type the reading of this Kanji:</div>
                        <div className="flex items-center justify-center gap-4">
                          <div className={`text-3xl sm:text-6xl font-bold tracking-wider text-claude-text-heading ${useSerif ? 'japanese-serif' : 'japanese-sans'}`}>
                            {currentCard.kanji}
                          </div>
                          <button
                            onClick={() => speakJapanese(currentCard.hiragana)}
                            className="w-10 h-10 rounded-full bg-claude-sidebar border border-claude-border hover:border-claude-coral/55 flex items-center justify-center text-base hover:scale-105 transition-all cursor-pointer shadow-sm text-claude-text hover:text-claude-coral"
                            title="Listen to Japanese pronunciation"
                          >
                            🔊
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="text-[10px] uppercase tracking-wider font-extrabold text-claude-text-muted">Type the Japanese reading for:</div>
                        <div className="text-2xl sm:text-3xl font-extrabold text-claude-text-heading claude-serif tracking-wide py-2">
                          {currentCard.english}
                        </div>
                        <button
                          onClick={() => speakJapanese(currentCard.hiragana)}
                          className="w-10 h-10 rounded-full bg-claude-sidebar border border-claude-border hover:border-claude-coral/55 flex items-center justify-center text-base hover:scale-105 transition-all cursor-pointer shadow-sm text-claude-text hover:text-claude-coral mx-auto"
                          title="Listen to Japanese pronunciation"
                        >
                          🔊
                        </button>
                      </div>
                    )
                  ) : (
                    currentCard.kanji ? (
                      <div className="space-y-3">
                        {/* Pronunciation Hints Row */}
                        <div className="flex justify-center items-center gap-3 text-sm min-h-[24px]">
                          <span 
                            className={`text-claude-text font-semibold transition-opacity duration-300 ${
                              showFurigana ? 'opacity-100' : 'opacity-0 select-none'
                            }`}
                          >
                            {currentCard.hiragana}
                          </span>
                          {currentCard.romaji && (
                            <span 
                              className={`text-claude-text-muted italic transition-opacity duration-300 ${
                                showRomaji ? 'opacity-100' : 'opacity-0 select-none'
                              }`}
                            >
                              [{currentCard.romaji}]
                            </span>
                          )}
                        </div>
                        
                        {/* Kanji representation and Speaker button inline */}
                        <div className="flex items-center justify-center gap-4">
                          <div className={`text-4xl sm:text-7xl font-bold tracking-wider text-claude-text-heading ${useSerif ? 'japanese-serif' : 'japanese-sans'}`}>
                            {currentCard.kanji}
                          </div>
                          <button
                            onClick={() => speakJapanese(currentCard.hiragana)}
                            className="w-10 h-10 rounded-full bg-claude-sidebar border border-claude-border hover:border-claude-coral/55 flex items-center justify-center text-base hover:scale-105 transition-all cursor-pointer shadow-sm text-claude-text hover:text-claude-coral"
                            title="Listen to Japanese pronunciation"
                          >
                            🔊
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* If only Hiragana exists, show it with speaker */
                      <div className="space-y-3">
                        <div className="flex items-center justify-center gap-4">
                          <div className={`text-4xl sm:text-7xl font-bold tracking-wider text-claude-text-heading ${useSerif ? 'japanese-serif' : 'japanese-sans'}`}>
                            {currentCard.hiragana}
                          </div>
                          <button
                            onClick={() => speakJapanese(currentCard.hiragana)}
                            className="w-10 h-10 rounded-full bg-claude-sidebar border border-claude-border hover:border-claude-coral/55 flex items-center justify-center text-base hover:scale-105 transition-all cursor-pointer shadow-sm text-claude-text hover:text-claude-coral"
                            title="Listen to Japanese pronunciation"
                          >
                            🔊
                          </button>
                        </div>
                        {currentCard.romaji && (
                          <div 
                            className={`text-claude-text-muted text-lg transition-opacity duration-300 italic min-h-[28px] ${
                              showRomaji ? 'opacity-100' : 'opacity-0 select-none'
                            }`}
                          >
                            {currentCard.romaji}
                          </div>
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* BACK FACE */}
              <div 
                className={`flip-card-back claude-panel study-card-hover border-claude-border p-5 sm:p-12 text-center relative overflow-hidden shadow-md flex flex-col justify-center items-center ${
                  answerMode === 'typed'
                    ? typedAnswer && (typedAnswer.toLowerCase().trim() === currentCard.hiragana.toLowerCase().trim() || (currentCard.romaji && typedAnswer.toLowerCase().trim() === currentCard.romaji.toLowerCase().trim()))
                      ? 'border-claude-success/60'
                      : 'border-claude-error/60'
                    : selectedChoice && selectedChoice.toLowerCase().trim() === currentCard.english.toLowerCase().trim()
                      ? 'border-claude-success/60'
                      : 'border-claude-error/60'
                }`}
              >
                {/* Visual Mnemonic Callout & Correct Meaning */}
                <div className="h-full w-full flex flex-col justify-between items-center py-2 select-none">
                  <div className="space-y-4 w-full">
                    <div className="space-y-1">
                      <span className="text-[8px] uppercase font-bold text-claude-text-muted tracking-wider block">Japanese</span>
                      <div className="text-3xl font-black text-claude-text-heading japanese-serif">
                        {currentCard.kanji || currentCard.hiragana}
                      </div>
                    </div>

                    {/* English Meaning */}
                    <div className="space-y-1">
                      <span className="text-[8px] uppercase font-bold text-claude-text-muted tracking-wider block">Correct Definition</span>
                      <div className="inline-block text-sm font-black text-white bg-claude-coral px-4 py-1.5 rounded-2xl capitalize shadow-sm">
                        {currentCard.english}
                      </div>
                    </div>

                    {/* Mnemonic callout box */}
                    <div className="p-3 bg-claude-sidebar/55 border border-claude-border/80 rounded-2xl max-w-sm mx-auto text-left space-y-1.5">
                      <span className="text-[8px] uppercase font-extrabold text-claude-coral tracking-widest block">💡 Memory Mnemonic Trick</span>
                      <p className="text-[10px] font-bold text-claude-text leading-relaxed">
                        {currentCard.mnemonic || generateMnemonic(currentCard.hiragana, currentCard.romaji, currentCard.english)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Answer Selections Grid */}
            <div className="grid grid-cols-1 gap-3 w-full">
              {answerMode === 'typed' ? (
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
                          ? typedAnswer.toLowerCase().trim() === currentCard.hiragana.toLowerCase().trim() || (currentCard.romaji && typedAnswer.toLowerCase().trim() === currentCard.romaji.toLowerCase().trim())
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
                choices.map((choice, index) => {
                  const isSelected = selectedChoice === choice;
                  const isCorrectDefinition = choice.toLowerCase().trim() === currentCard.english.toLowerCase().trim();

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
                })
              )}
            </div>
        </div>
      </div>
    </>
  );
}
