import React, { useState, useEffect, useRef } from 'react';
import { generateMnemonic } from '../utils/mnemonicGenerator';
import { toKana } from 'wanakana';
import { calculateSM2 } from '../utils/srsEngine';
import { supabase } from '../utils/supabaseClient';
import { renderFurigana, formatJapanese } from '../utils/furiganaParser';


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
  themeMode,
  furiganaMode
}) {
  const [displayCard, setDisplayCard] = useState(currentCard);
  const [floatingXps, setFloatingXps] = useState([]);

  // Auto-cleanup floating XP indicators after animation duration
  useEffect(() => {
    if (floatingXps.length > 0) {
      const activeTextIds = floatingXps.map(x => x.id);
      const timer = setTimeout(() => {
        setFloatingXps(prev => prev.filter(x => !activeTextIds.includes(x.id)));
      }, 1400);
      return () => clearTimeout(timer);
    }
  }, [floatingXps]);

  const [displayChoices, setDisplayChoices] = useState(() => {
    if (!currentCard) return [];
    const otherCards = allCards.filter(
      c => c.english.toLowerCase().trim() !== currentCard.english.toLowerCase().trim()
    );
    let candidates = [];
    if (difficulty === 'hard' && currentCard.group) {
      candidates = otherCards.filter(
        c => c.group && c.group.toLowerCase().trim() === currentCard.group.toLowerCase().trim()
      );
    }
    let uniqueOtherMeanings = Array.from(new Set(candidates.map(c => c.english)));
    if (uniqueOtherMeanings.length < 3) {
      const genericMeanings = Array.from(new Set(otherCards.map(c => c.english)));
      for (const meaning of genericMeanings) {
        if (!uniqueOtherMeanings.includes(meaning)) {
          uniqueOtherMeanings.push(meaning);
        }
        if (uniqueOtherMeanings.length >= 3) break;
      }
    }
    const shuffledOthers = uniqueOtherMeanings.sort(() => 0.5 - Math.random());
    const incorrect = shuffledOthers.slice(0, 3);
    const fallbackList = ['hello / good day', 'goodbye', 'thank you', 'excuse me / sorry', 'water', 'yes', 'no'];
    while (incorrect.length < 3) {
      const fb = fallbackList[Math.floor(Math.random() * fallbackList.length)];
      if (fb.toLowerCase().trim() !== currentCard.english.toLowerCase().trim() && !incorrect.includes(fb)) {
        incorrect.push(fb);
      }
    }
    return [currentCard.english, ...incorrect].sort(() => 0.5 - Math.random());
  });

  const [selectedChoice, setSelectedChoice] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [answeredCorrectly, setAnsweredCorrectly] = useState(null);
  const [srsOnly, setSrsOnly] = useState(() => {
    return localStorage.getItem('jp_vocab_srsonly') === 'true';
  });
  const [isShake, setIsShake] = useState(false);
  const [showFurigana, setShowFurigana] = useState(true);
  const [showRomaji, setShowRomaji] = useState(true);
  const [useSerif, setUseSerif] = useState(true);

  const [answerMode, setAnswerMode] = useState(() => {
    return localStorage.getItem('jp_vocab_answermode') || 'mc';
  });
  const [typedAnswer, setTypedAnswer] = useState('');

  const [correctHistory, setCorrectHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isHistoryFlipped, setIsHistoryFlipped] = useState(false);



  const currentWord = currentCard ? (currentCard.hiragana || '') : '';

  useEffect(() => {
    if (answerMode === 'calligraphy') {
      setAnswerMode('mc');
      localStorage.setItem('jp_vocab_answermode', 'mc');
    } else {
      localStorage.setItem('jp_vocab_answermode', answerMode);
    }
  }, [answerMode]);

  useEffect(() => {
    localStorage.setItem('jp_vocab_srsonly', srsOnly);
  }, [srsOnly]);







  // Timer Session Stats
  const [timeLeft, setTimeLeft] = useState(timePerCard);
  const [timeouts, setTimeouts] = useState(0);
  const [elapsedTimes, setElapsedTimes] = useState([]);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [cardStartTime, setCardStartTime] = useState(null);
  const [isTimeoutOccurred, setIsTimeoutOccurred] = useState(false);
  const [sessionSaved, setSessionSaved] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(0);
  
  const now = new Date();
  const getDueCards = (cards) => cards.filter(c => !c.nextReview || new Date(c.nextReview) <= now);

  const filteredPool = selectedLessons && selectedLessons.length === 0
    ? allCards
    : allCards.filter(c => selectedLessons.includes(c.lesson || 'General'));

  const activePool = srsOnly ? getDueCards(filteredPool) : filteredPool;
  const filteredPoolSize = activePool.length;
  
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
    setAnsweredCorrectly(false);
    setTimeouts(prev => prev + 1);
    setElapsedTimes(prev => [...prev, timePerCard]);
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
      setFloatingXps(prev => [...prev, { id: Date.now(), x: Math.random() * 40 - 20, y: Math.random() * 20 - 10 }]);
      setCorrectHistory(prev => [...prev, currentCard]);
      setAnsweredCorrectly(true);
    } else {
      playIncorrectSound();
      setIsShake(true);
      setAnsweredCorrectly(false);
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
      setFloatingXps(prev => [...prev, { id: Date.now(), x: Math.random() * 40 - 20, y: Math.random() * 20 - 10 }]);
      setCorrectHistory(prev => [...prev, currentCard]);
      setAnsweredCorrectly(true);
    } else {
      playIncorrectSound();
      setIsShake(true);
      setAnsweredCorrectly(false);
    }
  };

  const handleHistoryBack = () => {
    if (timerEnabled) return;
    setIsHistoryFlipped(false);
    if (historyIndex === -1) {
      setHistoryIndex(correctHistory.length - 1);
    } else if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
    }
  };

  const handleHistoryForward = () => {
    if (timerEnabled) return;
    setIsHistoryFlipped(false);
    if (historyIndex === -1) {
      setHistoryIndex(correctHistory.length - 1);
    } else if (historyIndex === correctHistory.length - 1) {
      setHistoryIndex(-1);
    } else {
      setHistoryIndex(prev => prev + 1);
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
      setCorrectHistory([]);
      setHistoryIndex(-1);
      setIsHistoryFlipped(false);
    } else if (!sessionStartTime) {
      setSessionStartTime(performance.now());
      setSessionSaved(false);
    }
  }, [totalSessionCards]);

  // Reset session history on initial launch of a session
  useEffect(() => {
    if (totalSessionCards > 0 && queueLength === totalSessionCards) {
      setCorrectHistory([]);
      setHistoryIndex(-1);
      setIsHistoryFlipped(false);
    }
  }, [currentCard, totalSessionCards, queueLength]);

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

      // Save to Supabase review_sessions
      const accuracyRate = elapsedTimes.length > 0 
        ? parseFloat(((totalSessionCards / elapsedTimes.length) * 100).toFixed(1)) 
        : 100.0;
        
      supabase.auth.getSession().then(({ data: { session } }) => {
        const userId = session?.user?.id;
        if (userId) {
          supabase
            .from('review_sessions')
            .insert([{
              user_id: userId,
              duration_seconds: duration,
              cards_reviewed: totalSessionCards,
              accuracy_rate: accuracyRate,
              xp_earned: totalSessionCards * 10
            }])
            .then(({ error }) => {
              if (error) {
                console.error("Error saving review session to Supabase:", error);
              } else {
                window.dispatchEvent(new Event('jp_vocab_session_completed'));
              }
            });
        }
      });
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
    if (totalSessionCards === 0 || !currentCard || historyIndex !== -1) {
      return;
    }

    const handleKeyDown = (e) => {
      if (!isChecking) {
        if (answerMode === 'mc' && ['1', '2', '3', '4'].includes(e.key)) {
          const idx = parseInt(e.key) - 1;
          if (displayChoices[idx]) {
            handleChoiceClick(displayChoices[idx]);
          }
        }
        
        if (e.key === ' ' || e.key === 'Spacebar') {
          e.preventDefault();
          speakJapanese(currentCard.hiragana);
        }
      } else {
        // When checking (flipped to back), we allow rating hotkeys
        if (answeredCorrectly === true) {
          if (['1', '2', '3', '4'].includes(e.key)) {
            const rating = parseInt(e.key) - 1; // 0, 1, 2, 3
            onAnswer(rating, currentCard);
          }
        } else if (answeredCorrectly === false) {
          if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
            e.preventDefault();
            onAnswer(0, currentCard);
          }
        }
      }
      
      if (e.key.toLowerCase() === 'q') {
        if (window.confirm("Are you sure you want to quit this study session? Your progress in this session will be lost.")) {
          onResetConfig();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentCard, isChecking, answeredCorrectly, displayChoices, totalSessionCards, historyIndex, answerMode]);



  // Generate multiple choice options and synchronize transition to next card
  useEffect(() => {
    if (!currentCard) {
      setDisplayCard(null);
      setDisplayChoices([]);
      return;
    }

    const generateChoicesForCard = (card) => {
      const otherCards = allCards.filter(
        c => c.english.toLowerCase().trim() !== card.english.toLowerCase().trim()
      );
      
      let candidates = [];
      if (difficulty === 'hard' && card.group) {
        candidates = otherCards.filter(
          c => c.group && c.group.toLowerCase().trim() === card.group.toLowerCase().trim()
        );
      }
      
      let uniqueOtherMeanings = Array.from(new Set(candidates.map(c => c.english)));
      
      if (uniqueOtherMeanings.length < 3) {
        const genericMeanings = Array.from(new Set(otherCards.map(c => c.english)));
        for (const meaning of genericMeanings) {
          if (!uniqueOtherMeanings.includes(meaning)) {
            uniqueOtherMeanings.push(meaning);
          }
          if (uniqueOtherMeanings.length >= 3) break;
        }
      }

      const shuffledOthers = uniqueOtherMeanings.sort(() => 0.5 - Math.random());
      const incorrect = shuffledOthers.slice(0, 3);
      
      const fallbackList = ['hello / good day', 'goodbye', 'thank you', 'excuse me / sorry', 'water', 'yes', 'no'];
      while (incorrect.length < 3) {
        const fb = fallbackList[Math.floor(Math.random() * fallbackList.length)];
        if (fb.toLowerCase().trim() !== card.english.toLowerCase().trim() && !incorrect.includes(fb)) {
          incorrect.push(fb);
        }
      }

      const combined = [card.english, ...incorrect].sort(() => 0.5 - Math.random());
      return combined;
    };

    if (isChecking) {
      // The card is currently flipped. Start the flip-back transition first.
      setIsChecking(false);
      setIsShake(false);
      setSelectedChoice(null);
      setAnsweredCorrectly(null);
      setIsTimeoutOccurred(false);
      
      // Delay updating displayCard and displayChoices until the flip-back animation finishes (600ms)
      const timer = setTimeout(() => {
        setDisplayCard(currentCard);
        setDisplayChoices(generateChoicesForCard(currentCard));
        setTypedAnswer('');
      }, 600);

      return () => clearTimeout(timer);
    } else {
      // The card is already facing front. Update immediately.
      setSelectedChoice(null);
      setIsShake(false);
      setTypedAnswer('');
      setAnsweredCorrectly(null);
      setIsTimeoutOccurred(false);
      setDisplayCard(currentCard);
      setDisplayChoices(generateChoicesForCard(currentCard));
    }
  }, [currentCard, allCards, difficulty, questionIndex]);

  if (totalSessionCards === 0) {
    return (
      <>
        <canvas ref={bgCanvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-60 dark:opacity-40" />
        <div className="max-w-4xl mx-auto w-full px-4 py-6 md:py-10 animate-fade-in relative z-10">
          <div className="claude-panel border-claude-border rounded-3xl p-6 md:p-8 space-y-6 md:space-y-8 shadow-xs select-none">
            
            {/* Header Title */}
            <div className="text-center space-y-2 pb-5 border-b border-claude-border/50">
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
                <div className="p-5 bg-claude-sidebar/20 border border-claude-border/60 rounded-2xl space-y-3">
                  <div className="flex justify-between items-baseline pb-1 border-b border-claude-border/20">
                    <label className="text-[10px] uppercase font-bold text-claude-text-muted tracking-wider">
                      Lessons Category Filter
                    </label>
                    <span className="text-[10px] font-bold text-claude-coral bg-claude-coral/10 border border-claude-coral/20 px-2 py-0.5 rounded">
                      {selectedLessons.length === 0 ? 'All Lessons' : `${selectedLessons.length} Selected`}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1 py-1">
                    <button
                      type="button"
                      onClick={() => setSelectedLessons([])}
                      className={`py-1 px-2.5 rounded-lg border text-[9px] font-black transition-all cursor-pointer ${
                        selectedLessons.length === 0
                          ? 'bg-claude-coral/10 border-claude-coral text-claude-coral shadow-xs'
                          : 'bg-claude-card hover:bg-claude-sidebar border-claude-border text-claude-text-muted hover:text-claude-text-heading hover:scale-[1.02]'
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
                          className={`py-1 px-2.5 rounded-lg border text-[9px] font-black transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-claude-coral/10 border-claude-coral text-claude-coral shadow-xs'
                              : 'bg-claude-card hover:bg-claude-sidebar border-claude-border text-claude-text-muted hover:text-claude-text-heading hover:scale-[1.02]'
                          }`}
                        >
                          📁 {les}
                        </button>
                      );
                    })}
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
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400' 
                            : 'bg-claude-card border-claude-border text-claude-text-muted hover:text-claude-text-heading hover:scale-[1.02]'
                        }`}
                      >
                        {srsOnly ? 'Enabled' : 'Disabled'}
                      </button>
                    </div>

                    {/* Auto-Speak toggle */}
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

                    {/* Timer settings configuration */}
                    <div className="p-3.5 bg-claude-card/50 border border-claude-border rounded-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
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
                        <div className="space-y-1.5 pt-2.5 border-t border-claude-border/50">
                          <div className="flex justify-between text-[9px] font-bold text-claude-text-muted">
                            <span>Time Limit per Card</span>
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

  const cardToRender = historyIndex !== -1 ? correctHistory[historyIndex] : (displayCard || currentCard);

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
                ⬅️ Back
              </button>
              <span className="text-claude-text-muted text-[10px]">
                {historyIndex === -1 
                  ? `Review Mode: ${correctHistory.length} correct cards available` 
                  : `Reviewing: Card ${historyIndex + 1} of ${correctHistory.length}`}
              </span>
              <button
                type="button"
                onClick={handleHistoryForward}
                className="px-3 py-1.5 rounded-lg border border-claude-border bg-claude-sidebar transition-all flex items-center justify-center gap-1 cursor-pointer text-[10px] hover:border-claude-coral hover:text-claude-coral hover:scale-[1.02]"
                title="Next card / Active card"
              >
                {historyIndex === -1 ? 'Review History 🔍' : historyIndex === correctHistory.length - 1 ? 'Active Card ⚡' : 'Next ➡️'}
              </button>
            </div>
          )}

          {/* Core Flashcard Container */}
          <div 
            className={`flip-card-container ${historyIndex !== -1 ? 'cursor-pointer select-none' : ''}`}
            onClick={() => {
              if (historyIndex !== -1) {
                setIsHistoryFlipped(prev => !prev);
              }
            }}
          >
            <div className={`flip-card-inner ${(historyIndex !== -1 ? isHistoryFlipped : isChecking) ? 'flipped' : ''}`}>
              
              {/* FRONT FACE */}
              <div 
                className={`flip-card-front claude-panel border-claude-border p-5 sm:p-12 text-center relative overflow-hidden shadow-md ${
                  isShake ? 'animate-shake border-claude-error' : ''
                }`}
              >
                {/* Floating XP indicators */}
                {floatingXps.map(fx => (
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
                    onClick={(e) => { e.stopPropagation(); setUseSerif(!useSerif); }}
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
                    onClick={(e) => { e.stopPropagation(); setShowFurigana(!showFurigana); }}
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
                    onClick={(e) => { e.stopPropagation(); setShowRomaji(!showRomaji); }}
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
                    onClick={(e) => { e.stopPropagation(); setAutoSpeak(!autoSpeak); }}
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
                    onClick={(e) => { e.stopPropagation(); setTimerEnabled(!timerEnabled); }}
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
                  {historyIndex !== -1 && (
                    <span className="text-[10px] uppercase tracking-wider font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/25">
                      ✓ Correctly Answered
                    </span>
                  )}
                  {cardToRender.group && (
                    <span className="text-[10px] uppercase tracking-wider font-extrabold bg-claude-sidebar text-claude-coral px-3 py-1 rounded-full border border-claude-border">
                      {cardToRender.group}
                      {difficulty === 'hard' && ' • Hard'}
                    </span>
                  )}
                </div>

                {/* Word Display Area */}
                <div className="py-6 min-h-[160px] flex flex-col justify-center items-center w-full">
                  {answerMode === 'typed' ? (
                    cardToRender.kanji ? (
                      <div className="space-y-3">
                        <div className="text-[10px] uppercase tracking-wider font-extrabold text-claude-text-muted">Type the reading of this Kanji:</div>
                        <div className="flex items-center justify-center gap-4">
                          <div className={`text-3xl sm:text-6xl font-bold tracking-wider text-claude-text-heading ${useSerif ? 'japanese-serif' : 'japanese-sans'}`}>
                            {renderFurigana(cardToRender.kanji, cardToRender.hiragana, 'kanji')}
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); speakJapanese(cardToRender.hiragana); }}
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
                          {cardToRender.english}
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); speakJapanese(cardToRender.hiragana); }}
                          className="w-10 h-10 rounded-full bg-claude-sidebar border border-claude-border hover:border-claude-coral/55 flex items-center justify-center text-base hover:scale-105 transition-all cursor-pointer shadow-sm text-claude-text hover:text-claude-coral mx-auto"
                          title="Listen to Japanese pronunciation"
                        >
                          🔊
                        </button>
                      </div>
                    )
                  ) : (
                    cardToRender.kanji ? (
                      <div className="space-y-3">
                        {/* Pronunciation Hints Row */}
                        <div className="flex justify-center items-center gap-3 text-sm min-h-[24px]">
                          {furiganaMode !== 'both' && (
                            <span 
                              className={`text-claude-text font-semibold transition-opacity duration-300 ${
                                showFurigana ? 'opacity-100' : 'opacity-0 select-none'
                              }`}
                            >
                              {cardToRender.hiragana}
                            </span>
                          )}
                          {cardToRender.romaji && (
                            <span 
                              className={`text-claude-text-muted italic transition-opacity duration-300 ${
                                showRomaji ? 'opacity-100' : 'opacity-0 select-none'
                              }`}
                            >
                              [{cardToRender.romaji}]
                            </span>
                          )}
                        </div>
                        
                        {/* Kanji representation and Speaker button inline */}
                        <div className="flex items-center justify-center gap-4">
                          <div className={`text-4xl sm:text-7xl font-bold tracking-wider text-claude-text-heading ${useSerif ? 'japanese-serif' : 'japanese-sans'}`}>
                            {renderFurigana(cardToRender.kanji, cardToRender.hiragana, furiganaMode)}
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); speakJapanese(cardToRender.hiragana); }}
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
                            {cardToRender.hiragana}
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); speakJapanese(cardToRender.hiragana); }}
                            className="w-10 h-10 rounded-full bg-claude-sidebar border border-claude-border hover:border-claude-coral/55 flex items-center justify-center text-base hover:scale-105 transition-all cursor-pointer shadow-sm text-claude-text hover:text-claude-coral"
                            title="Listen to Japanese pronunciation"
                          >
                            🔊
                          </button>
                        </div>
                        {cardToRender.romaji && (
                          <div 
                            className={`text-claude-text-muted text-lg transition-opacity duration-300 italic min-h-[28px] ${
                              showRomaji ? 'opacity-100' : 'opacity-0 select-none'
                            }`}
                          >
                            {cardToRender.romaji}
                          </div>
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* BACK FACE */}
              <div 
                className={`flip-card-back claude-panel border-claude-border p-5 sm:p-12 text-center relative overflow-hidden shadow-md flex flex-col justify-center items-center ${
                  historyIndex !== -1
                    ? 'border-claude-success/60'
                    : answeredCorrectly
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
                        {renderFurigana(cardToRender.kanji || cardToRender.hiragana, cardToRender.hiragana, furiganaMode)}
                      </div>
                    </div>

                    {/* English Meaning */}
                    <div className="space-y-1">
                      <span className="text-[8px] uppercase font-bold text-claude-text-muted tracking-wider block">Correct Definition</span>
                      <div className="inline-block text-sm font-black text-white bg-claude-coral px-4 py-1.5 rounded-2xl capitalize shadow-sm">
                        {cardToRender.english}
                      </div>
                    </div>

                    {/* Mnemonic callout box */}
                    <div className="p-3 bg-claude-sidebar/55 border border-claude-border/80 rounded-2xl max-w-sm mx-auto text-left space-y-1.5">
                      <span className="text-[8px] uppercase font-extrabold text-claude-coral tracking-widest block">💡 Memory Mnemonic Trick</span>
                      <p className="text-[10px] font-bold text-claude-text leading-relaxed">
                        {cardToRender.mnemonic || generateMnemonic(cardToRender.hiragana, cardToRender.romaji, cardToRender.english)}
                      </p>
                    </div>

                    {/* Context sentences if present */}
                    {cardToRender.context_japanese && (
                      <div className="p-3 bg-claude-sidebar/40 border border-claude-border/50 rounded-2xl max-w-sm mx-auto text-left space-y-1 mt-3">
                        <span className="text-[8px] uppercase font-extrabold text-claude-text-muted tracking-widest block">💬 Context Sentence</span>
                        <p className="text-[11px] font-semibold text-claude-text-heading leading-relaxed japanese-serif">
                          {formatJapanese(cardToRender.context_japanese, furiganaMode)}
                        </p>
                        {cardToRender.context_english && (
                          <p className="text-[10px] text-claude-text-muted">
                            {cardToRender.context_english}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Answer Selections Grid */}
          <div className="grid grid-cols-1 gap-3 w-full">
            {historyIndex !== -1 ? (
              <div className="claude-panel border-claude-border p-6 rounded-2xl text-center space-y-4 shadow-sm select-none animate-fade-in bg-claude-sidebar/20">
                <div className="text-2xl">💡</div>
                <div className="space-y-1">
                  <span className="text-xs font-extrabold text-claude-text-heading block">You are reviewing a past correct question</span>
                  <span className="text-[10px] text-claude-text-muted block">Tap the card above to toggle showing translation and memory mnemonic!</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setHistoryIndex(-1);
                    setIsHistoryFlipped(false);
                  }}
                  className="px-4 py-2 bg-claude-coral text-white text-[10px] font-black rounded-xl cursor-pointer hover:opacity-95 transition-opacity mx-auto block"
                >
                  Resume Active Quiz ⚡
                </button>
              </div>
            ) : isChecking ? (
              answeredCorrectly === true ? (
                <div className="space-y-4 animate-fade-in w-full text-center">
                  <div className="text-[10px] font-black text-claude-success uppercase tracking-widest mb-1.5">
                    🎉 Correct! Rate recall quality for scheduling:
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
                    {[
                      { rating: 0, label: 'Again', color: 'border-red-500/30 hover:bg-red-500/10 text-red-500 dark:text-red-400', emoji: '🔴', desc: 'Forgot' },
                      { rating: 1, label: 'Hard', color: 'border-orange-500/30 hover:bg-orange-500/10 text-orange-500 dark:text-orange-400', emoji: '🟡', desc: 'Slow' },
                      { rating: 2, label: 'Good', color: 'border-emerald-500/30 hover:bg-emerald-500/10 text-emerald-500 dark:text-emerald-400', emoji: '🟢', desc: 'Optimal' },
                      { rating: 3, label: 'Easy', color: 'border-purple-500/30 hover:bg-purple-500/10 text-purple-500 dark:text-purple-400', emoji: '🔵', desc: 'Instant' }
                    ].map(({ rating, label, color, emoji, desc }) => {
                      const srsInfo = calculateSM2(
                        rating,
                        (displayCard || currentCard).interval || 0,
                        (displayCard || currentCard).repetitions || 0,
                        (displayCard || currentCard).easeFactor || 2.5
                      );
                      const nextInt = srsInfo.interval;
                      const intervalLabel = nextInt === 0 ? 'now' : nextInt === 1 ? '1d' : `${nextInt}d`;
                      
                      return (
                        <button
                          key={rating}
                          type="button"
                          onClick={() => onAnswer(rating, currentCard)}
                          className={`flex flex-col items-center justify-center p-3 border-2 rounded-2xl bg-claude-card cursor-pointer transition-all duration-200 transform hover:scale-[1.03] active:scale-[0.98] ${color}`}
                        >
                          <span className="text-lg mb-1">{emoji}</span>
                          <span className="text-xs font-black uppercase">{label}</span>
                          <span className="text-[9px] opacity-75 font-semibold mt-0.5">{desc}</span>
                          <span className="text-[9px] font-black mt-2 bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded-md">
                            {intervalLabel}
                          </span>
                          <span className="text-[8px] opacity-40 font-bold mt-1">
                            Hotkey {rating + 1}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="space-y-4 animate-fade-in w-full">
                  <div className="text-center text-[10px] font-black text-claude-error uppercase tracking-widest">
                    😢 Incorrect or timed out!
                  </div>
                  <button
                    type="button"
                    onClick={() => onAnswer(0, currentCard)}
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
                        ? typedAnswer.toLowerCase().trim() === (displayCard || currentCard).hiragana.toLowerCase().trim() || ((displayCard || currentCard).romaji && typedAnswer.toLowerCase().trim() === (displayCard || currentCard).romaji.toLowerCase().trim())
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
              displayChoices.map((choice, index) => {
                const isSelected = selectedChoice === choice;
                const isCorrectDefinition = choice.toLowerCase().trim() === (displayCard || currentCard).english.toLowerCase().trim();

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
