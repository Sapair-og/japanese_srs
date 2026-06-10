import React, { useState, useEffect, useRef } from 'react';
import { generateMnemonic } from '../utils/mnemonicGenerator';
import { toKana } from 'wanakana';
import { calculateSM2 } from '../utils/srsEngine';
import { supabase } from '../utils/supabaseClient';
import { renderFurigana, formatJapanese } from '../utils/furiganaParser';
import QuizConfig from './Quiz/QuizConfig';
import QuizSession from './Quiz/QuizSession';
import QuizComplete from './Quiz/QuizComplete';
import KeyboardShortcutsModal from './Quiz/KeyboardShortcutsModal';


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
  const [autoGrade, setAutoGrade] = useState(() => {
    return localStorage.getItem('jp_vocab_autograde') !== 'false';
  });
  const autoAdvanceTimeoutRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('jp_vocab_autograde', autoGrade);
  }, [autoGrade]);

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

  // Grouping lessons and counts
  const lessonCounts = allCards.reduce((acc, card) => {
    const les = card.lesson || 'General';
    acc[les] = (acc[les] || 0) + 1;
    return acc;
  }, {});

  const uniqueLessons = Array.from(new Set(allCards.map(c => c.lesson || 'General'))).sort();

  const n5Lessons = uniqueLessons.filter(l => l.toLowerCase().includes('n5'));
  const n4Lessons = uniqueLessons.filter(l => l.toLowerCase().includes('n4'));
  const otherLessons = uniqueLessons.filter(l => !l.toLowerCase().includes('n5') && !l.toLowerCase().includes('n4'));

  const handleSelectAllN5 = () => {
    setSelectedLessons(prev => {
      const filtered = prev.filter(l => !n5Lessons.includes(l));
      return [...filtered, ...n5Lessons];
    });
  };

  const handleDeselectAllN5 = () => {
    setSelectedLessons(prev => prev.filter(l => !n5Lessons.includes(l)));
  };

  const handleSelectAllN4 = () => {
    setSelectedLessons(prev => {
      const filtered = prev.filter(l => !n4Lessons.includes(l));
      return [...filtered, ...n4Lessons];
    });
  };

  const handleDeselectAllN4 = () => {
    setSelectedLessons(prev => prev.filter(l => !n4Lessons.includes(l)));
  };

  const handleSelectAllOthers = () => {
    setSelectedLessons(prev => {
      const filtered = prev.filter(l => !otherLessons.includes(l));
      return [...filtered, ...otherLessons];
    });
  };

  const handleDeselectAllOthers = () => {
    setSelectedLessons(prev => prev.filter(l => !otherLessons.includes(l)));
  };

  const handleToggleLesson = (les) => {
    if (selectedLessons.includes(les)) {
      setSelectedLessons(prev => prev.filter(l => l !== les));
    } else {
      setSelectedLessons(prev => [...prev, les]);
    }
  };
  
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

  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);

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

  const hasAnsweredRef = useRef(false);

  const submitAnswer = (rating, card) => {
    if (hasAnsweredRef.current) return;
    hasAnsweredRef.current = true;
    if (autoAdvanceTimeoutRef.current) {
      clearTimeout(autoAdvanceTimeoutRef.current);
      autoAdvanceTimeoutRef.current = null;
    }
    onAnswer(rating, card);
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
      if (autoGrade) {
        autoAdvanceTimeoutRef.current = setTimeout(() => {
          submitAnswer(2, currentCard);
        }, 900);
      }
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
      if (autoGrade) {
        autoAdvanceTimeoutRef.current = setTimeout(() => {
          submitAnswer(2, currentCard);
        }, 900);
      }
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

  // Keyboard hotkeys handler (only active during study sessions)
  useEffect(() => {
    if (totalSessionCards === 0 || !currentCard || historyIndex !== -1 || showShortcutsHelp) {
      return;
    }

    const handleKeyDown = (e) => {
      // Ignore keypresses inside inputs
      if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) {
        return;
      }

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
            submitAnswer(rating, currentCard);
          }
        } else if (answeredCorrectly === false) {
          if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
            e.preventDefault();
            submitAnswer(0, currentCard);
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
  }, [currentCard, isChecking, answeredCorrectly, displayChoices, totalSessionCards, historyIndex, answerMode, showShortcutsHelp]);



  // Generate multiple choice options and synchronize transition to next card
  useEffect(() => {
    hasAnsweredRef.current = false;
    if (autoAdvanceTimeoutRef.current) {
      clearTimeout(autoAdvanceTimeoutRef.current);
    }

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

  // Global hotkeys handler (always active while in Quiz tab for Help modal toggling)
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      // Ignore keypresses inside text fields (unless Escape is pressed to blur them)
      if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) {
        if (e.key === 'Escape') {
          document.activeElement.blur();
        }
        return;
      }

      if (e.key.toLowerCase() === 'h' || e.key === '?') {
        e.preventDefault();
        setShowShortcutsHelp(prev => !prev);
      } else if (e.key === 'Escape' && showShortcutsHelp) {
        e.preventDefault();
        setShowShortcutsHelp(false);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [showShortcutsHelp]);

  // Renders the Keyboard Shortcuts help modal
  const renderShortcutsHelpModal = () => {
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
  };

  if (totalSessionCards === 0) {
    return (
      <QuizConfig
        bgCanvasRef={bgCanvasRef}
        setShowShortcutsHelp={setShowShortcutsHelp}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        sessionLimit={sessionLimit}
        setSessionLimit={setSessionLimit}
        filteredPoolSize={filteredPoolSize}
        allCards={allCards}
        selectedLessons={selectedLessons}
        setSelectedLessons={setSelectedLessons}
        n5Lessons={n5Lessons}
        n4Lessons={n4Lessons}
        otherLessons={otherLessons}
        lessonCounts={lessonCounts}
        handleSelectAllN5={handleSelectAllN5}
        handleDeselectAllN5={handleDeselectAllN5}
        handleSelectAllN4={handleSelectAllN4}
        handleDeselectAllN4={handleDeselectAllN4}
        handleSelectAllOthers={handleSelectAllOthers}
        handleDeselectAllOthers={handleDeselectAllOthers}
        handleToggleLesson={handleToggleLesson}
        onStartSession={onStartSession}
        srsOnly={srsOnly}
        setSrsOnly={setSrsOnly}
        autoSpeak={autoSpeak}
        setAutoSpeak={setAutoSpeak}
        answerMode={answerMode}
        setAnswerMode={setAnswerMode}
        autoGrade={autoGrade}
        setAutoGrade={setAutoGrade}
        timerEnabled={timerEnabled}
        setTimerEnabled={setTimerEnabled}
        timePerCard={timePerCard}
        setTimePerCard={setTimePerCard}
        setActiveTab={setActiveTab}
      />
    );
  }

  if (!currentCard) {
    return (
      <QuizComplete
        bgCanvasRef={bgCanvasRef}
        successGif={successGif}
        totalSessionCards={totalSessionCards}
        correctHistory={correctHistory}
        timeouts={timeouts}
        elapsedTimes={elapsedTimes}
        sessionDuration={sessionDuration}
        setActiveTab={setActiveTab}
        onRestartSession={onRestartSession}
        speakJapanese={speakJapanese}
      />
    );
  }

  // Active Quiz View
  const progressPercent = totalSessionCards > 0 
    ? Math.round(((totalSessionCards - queueLength) / totalSessionCards) * 100) 
    : 0;

  const cardToRender = historyIndex !== -1 ? correctHistory[historyIndex] : (displayCard || currentCard);

  return (
    <>
      <QuizSession
        bgCanvasRef={bgCanvasRef}
        canvasRef={canvasRef}
        floatingXps={floatingXps}
        onResetConfig={onResetConfig}
        setShowShortcutsHelp={setShowShortcutsHelp}
        queueLength={queueLength}
        totalSessionCards={totalSessionCards}
        progressPercent={progressPercent}
        timerEnabled={timerEnabled}
        correctHistory={correctHistory}
        historyIndex={historyIndex}
        handleHistoryBack={handleHistoryBack}
        handleHistoryForward={handleHistoryForward}
        cardToRender={cardToRender}
        timeLeft={timeLeft}
        timePerCard={timePerCard}
        showFurigana={showFurigana}
        setShowFurigana={setShowFurigana}
        showRomaji={showRomaji}
        setShowRomaji={setShowRomaji}
        useSerif={useSerif}
        setUseSerif={setUseSerif}
        isChecking={isChecking}
        isHistoryFlipped={isHistoryFlipped}
        setIsHistoryFlipped={setIsHistoryFlipped}
        speakJapanese={speakJapanese}
        generateMnemonic={generateMnemonic}
        answerMode={answerMode}
        typedAnswer={typedAnswer}
        setTypedAnswer={setTypedAnswer}
        handleTypedSubmit={handleTypedSubmit}
        toKana={toKana}
        displayChoices={displayChoices}
        selectedChoice={selectedChoice}
        handleChoiceClick={handleChoiceClick}
        answeredCorrectly={answeredCorrectly}
        submitAnswer={submitAnswer}
        isShake={isShake}
        renderFurigana={renderFurigana}
        formatJapanese={formatJapanese}
      />
      <KeyboardShortcutsModal
        showShortcutsHelp={showShortcutsHelp}
        setShowShortcutsHelp={setShowShortcutsHelp}
        answerMode={answerMode}
      />
    </>
  );
}
