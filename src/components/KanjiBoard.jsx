import React, { useState, useEffect, useRef } from 'react';
import { kanjiList } from '../utils/kanjiData';

// Sound synthesis for offline audio feedback
const playCorrectSound = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now); // D5
    gain1.gain.setValueAtTime(0.06, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    
    // Add minor harmony
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880.00, now); // A5
    gain2.gain.setValueAtTime(0.04, now);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.35);
    osc2.stop(now + 0.35);
  } catch (e) {
    console.warn("Audio Context blocked:", e);
  }
};

const playIncorrectSound = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, now); // Low buzz
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.5);
  } catch (e) {
    console.warn("Audio Context blocked:", e);
  }
};

// Web Speech TTS speaker
const speakKanji = (char) => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(char);
    utterance.lang = 'ja-JP';
    utterance.rate = 0.7; // Slowed down as requested in the plan
    const voices = window.speechSynthesis.getVoices();
    const jaVoice = voices.find(v => v.lang.startsWith('ja'));
    if (jaVoice) {
      utterance.voice = jaVoice;
    }
    window.speechSynthesis.speak(utterance);
  }
};

export default function KanjiBoard({ themeRegion, themeMode, vocabList = [] }) {
  const [activeLevel, setActiveLevel] = useState('all'); // 'all', 'n5', 'n4', 'daily'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKanji, setSelectedKanji] = useState(null);
  
  // Stroke SVG state
  const [svgContent, setSvgContent] = useState('');
  const [svgLoading, setSvgLoading] = useState(false);

  // Fetch stroke order diagram when selected kanji changes
  useEffect(() => {
    if (!selectedKanji) {
      setSvgContent('');
      return;
    }
    setSvgLoading(true);
    setSvgContent('');
    try {
      const codePoint = selectedKanji.character.codePointAt(0).toString(16).toLowerCase().padStart(5, '0');
      const url = `https://cdn.jsdelivr.net/gh/KanjiVG/kanjivg@latest/kanji/${codePoint}.svg`;
      fetch(url)
        .then(res => {
          if (!res.ok) throw new Error('Network error');
          return res.text();
        })
        .then(text => {
          const cleanSvg = text.replace(/<\?xml.*?\?>/g, '').replace(/<!--.*?-->/g, '');
          setSvgContent(cleanSvg);
          setSvgLoading(false);
        })
        .catch(err => {
          console.warn('KanjiVG SVG fetch failed, using fallback:', err);
          setSvgContent('');
          setSvgLoading(false);
        });
    } catch (e) {
      console.warn('Failed to calculate codePoint:', e);
      setSvgContent('');
      setSvgLoading(false);
    }
  }, [selectedKanji]);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 24;

  // Reset page when filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeLevel, searchQuery]);
  
  // Calligraphy Canvas practice states
  const [canvasGridVisible, setCanvasGridVisible] = useState(true);
  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  const lastPosRef = useRef({ x: 0, y: 0 });

  // Quiz States
  const [quizActive, setQuizActive] = useState(false);
  const [quizConfig, setQuizConfig] = useState({
    categories: ['n5', 'n4', 'daily'],
    numQuestions: 15,
    type: 'kanji-to-meaning' // 'kanji-to-meaning', 'meaning-to-kanji', 'kanji-to-reading'
  });
  const [quizQueue, setQuizQueue] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [options, setOptions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [incorrectAnswers, setIncorrectAnswers] = useState([]);

  // Sakura particle animation for correct answers
  const particleCanvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animFrameRef = useRef(null);

  // Trigger TTS voice preloading
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
    }
  }, []);

  // Filter Kanji based on level and search query
  const filteredKanji = React.useMemo(() => {
    return kanjiList.filter(k => {
      const matchesLevel = activeLevel === 'all' || k.level === activeLevel;
      const cleanQuery = searchQuery.toLowerCase().trim();
      const matchesSearch = !cleanQuery || 
        k.character.includes(cleanQuery) ||
        k.meaning.toLowerCase().includes(cleanQuery) ||
        k.onyomi.toLowerCase().includes(cleanQuery) ||
        k.kunyomi.toLowerCase().includes(cleanQuery) ||
        k.mnemonic.toLowerCase().includes(cleanQuery);
      return matchesLevel && matchesSearch;
    });
  }, [activeLevel, searchQuery]);

  const paginatedKanji = React.useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredKanji.slice(start, start + itemsPerPage);
  }, [filteredKanji, currentPage]);

  const totalPages = Math.ceil(filteredKanji.length / itemsPerPage);

  // Find example words from vocabList for the selected Kanji
  const exampleWords = React.useMemo(() => {
    if (!selectedKanji) return [];
    if (selectedKanji.examples && selectedKanji.examples.length > 0) {
      return selectedKanji.examples;
    }
    const char = selectedKanji.character;
    return vocabList
      .filter(v => v.kanji && v.kanji.includes(char))
      .map(v => ({ kanji: v.kanji, reading: v.hiragana, meaning: v.english }))
      .slice(0, 3);
  }, [selectedKanji, vocabList]);

  // Color theme helpers based on App's active region
  const getThemeColors = () => {
    const regions = {
      liyue: { accent: 'bg-claude-coral', border: 'border-claude-coral', text: 'text-claude-coral', raw: '#cc5a37' },
      mondstadt: { accent: 'bg-sky-500', border: 'border-sky-500', text: 'text-sky-500', raw: '#0ea5e9' },
      inazuma: { accent: 'bg-purple-500', border: 'border-purple-500', text: 'text-purple-500', raw: '#a855f7' },
      sumeru: { accent: 'bg-emerald-500', border: 'border-emerald-500', text: 'text-emerald-500', raw: '#1db954' },
      fontaine: { accent: 'bg-blue-500', border: 'border-blue-500', text: 'text-blue-500', raw: '#0284c7' },
      natlan: { accent: 'bg-orange-500', border: 'border-orange-500', text: 'text-orange-500', raw: '#f97316' },
      snezhnaya: { accent: 'bg-teal-500', border: 'border-teal-500', text: 'text-teal-500', raw: '#0d9488' },
      khaenriah: { accent: 'bg-yellow-600', border: 'border-yellow-600', text: 'text-yellow-600', raw: '#ca8a04' },
      abyss: { accent: 'bg-pink-500', border: 'border-pink-500', text: 'text-pink-500', raw: '#d946ef' }
    };
    return regions[themeRegion] || regions.liyue;
  };

  const themeColors = getThemeColors();

  // Draw practice grid on canvas
  const setupCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const size = canvas.getBoundingClientRect().width;
    
    // Scale for high DPI
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);
    
    // Set style dimensions
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    // Draw Japanese Genkouyoushi grid
    if (canvasGridVisible) {
      ctx.strokeStyle = themeMode === 'dark' ? 'rgba(241, 245, 249, 0.1)' : 'rgba(15, 23, 42, 0.06)';
      ctx.lineWidth = 1;
      ctx.setLineDash([6, 6]);

      // Vertical mid
      ctx.beginPath();
      ctx.moveTo(size / 2, 0);
      ctx.lineTo(size / 2, size);
      ctx.stroke();

      // Horizontal mid
      ctx.beginPath();
      ctx.moveTo(0, size / 2);
      ctx.lineTo(size, size / 2);
      ctx.stroke();

      // Diagonal 1
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(size, size);
      ctx.stroke();

      // Diagonal 2
      ctx.beginPath();
      ctx.moveTo(size, 0);
      ctx.lineTo(0, size);
      ctx.stroke();

      ctx.setLineDash([]); // Reset line dash
    }

    // Draw Zen circle watermark (Enso) in center
    ctx.strokeStyle = themeMode === 'dark' ? 'rgba(241, 245, 249, 0.05)' : 'rgba(15, 23, 42, 0.03)';
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    ctx.beginPath();
    // Incomplete circle (Zen aesthetic of imperfection)
    ctx.arc(size / 2, size / 2, size * 0.34, 0.12, Math.PI * 1.9);
    ctx.stroke();
  };

  useEffect(() => {
    if (selectedKanji) {
      setTimeout(setupCanvas, 100); // Wait for DOM layout
    }
  }, [selectedKanji, canvasGridVisible]);

  // Handwriting Canvas Drawing Logic
  const getCanvasCoords = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    let clientX, clientY;
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    const coords = getCanvasCoords(e);
    isDrawingRef.current = true;
    lastPosRef.current = coords;
  };

  const draw = (e) => {
    if (!isDrawingRef.current) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const coords = getCanvasCoords(e);

    ctx.beginPath();
    // Beautiful dynamic semi-transparent brush stroke
    ctx.strokeStyle = themeMode === 'dark' ? 'rgba(248, 113, 113, 0.85)' : 'rgba(220, 38, 38, 0.85)';
    ctx.lineWidth = 7;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();

    lastPosRef.current = coords;
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
  };

  const clearCanvas = () => {
    setupCanvas();
  };

  // --- SAKURA PARTICLE SYSTEM ---
  const spawnSakuraBurst = () => {
    const canvas = particleCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    const colors = ['#ffb7c5', '#ff9ebb', '#ff7fa3', '#e06847', '#ffe3e8'];
    const tempParticles = [];
    
    for (let i = 0; i < 30; i++) {
      tempParticles.push({
        x: canvas.width / 2,
        y: canvas.height / 3,
        vx: (Math.random() - 0.5) * 9,
        vy: -Math.random() * 6 - 5,
        size: Math.random() * 9 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.25,
        opacity: 1,
        decay: Math.random() * 0.018 + 0.012
      });
    }

    particlesRef.current = tempParticles;

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }

    const animate = () => {
      if (particlesRef.current.length === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesRef.current = particlesRef.current.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.16; // Gravity
        p.angle += p.spin;
        p.opacity -= p.decay;

        if (p.opacity <= 0) return false;

        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);

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

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animate();
  };

  useEffect(() => {
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  // --- QUIZ GAME ENGINE ---
  const startQuiz = () => {
    let pool = kanjiList.filter(k => quizConfig.categories.includes(k.level));
    if (pool.length === 0) return;

    // Shuffle pool
    pool = [...pool].sort(() => Math.random() - 0.5);

    const totalQ = Math.min(pool.length, quizConfig.numQuestions);
    const queue = pool.slice(0, totalQ);

    setQuizQueue(queue);
    setCurrentIdx(0);
    setQuizScore(0);
    setIncorrectAnswers([]);
    setQuizFinished(false);
    setSelectedAnswer(null);
    setIsChecking(false);
    setQuizActive(true);

    generateQuestionOptions(queue[0], pool);
  };

  const generateQuestionOptions = (currentQuestion, fullPool) => {
    const quizType = quizConfig.type;
    const correctVal = 
      quizType === 'kanji-to-meaning' ? currentQuestion.meaning :
      quizType === 'meaning-to-kanji' ? currentQuestion.character :
      currentQuestion.onyomi + ' / ' + currentQuestion.kunyomi;

    // Generate incorrect options
    const distractors = fullPool
      .filter(k => k.character !== currentQuestion.character)
      .map(k => {
        return quizType === 'kanji-to-meaning' ? k.meaning :
          quizType === 'meaning-to-kanji' ? k.character :
          k.onyomi + ' / ' + k.kunyomi;
      });

    const uniqueDistractors = Array.from(new Set(distractors))
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    const allOptions = [correctVal, ...uniqueDistractors].sort(() => Math.random() - 0.5);
    setOptions(allOptions);
  };

  const handleSelectOption = (opt) => {
    if (isChecking) return;
    setSelectedAnswer(opt);
  };

  const handleCheckAnswer = () => {
    if (isChecking || !selectedAnswer) return;

    setIsChecking(true);
    const currentQuestion = quizQueue[currentIdx];
    const quizType = quizConfig.type;
    const correctVal = 
      quizType === 'kanji-to-meaning' ? currentQuestion.meaning :
      quizType === 'meaning-to-kanji' ? currentQuestion.character :
      currentQuestion.onyomi + ' / ' + currentQuestion.kunyomi;

    const isCorrect = selectedAnswer === correctVal;

    if (isCorrect) {
      setQuizScore(prev => prev + 1);
      playCorrectSound();
      spawnSakuraBurst();
    } else {
      playIncorrectSound();
      setIncorrectAnswers(prev => [...prev, {
        question: currentQuestion,
        yourAnswer: selectedAnswer,
        correctAnswer: correctVal
      }]);
    }

    setTimeout(() => {
      const nextIdx = currentIdx + 1;
      if (nextIdx < quizQueue.length) {
        setCurrentIdx(nextIdx);
        setSelectedAnswer(null);
        setIsChecking(false);
        generateQuestionOptions(quizQueue[nextIdx], kanjiList);
      } else {
        setQuizFinished(true);
      }
    }, 1800);
  };

  // Glow variable helper
  const getGlowStyle = (rawColor) => {
    return {
      '--glow-color': `${rawColor}22`,
      '--glow-border': `${rawColor}55`,
      '--accent-color': rawColor
    };
  };

  return (
    <div 
      className="w-full max-w-6xl mx-auto space-y-6 select-none relative pb-12"
      style={getGlowStyle(themeColors.raw)}
    >
      {/* Background canvas for sakura particle bursts */}
      {quizActive && !quizFinished && (
        <canvas 
          ref={particleCanvasRef} 
          className="absolute inset-0 w-full h-full pointer-events-none z-50" 
        />
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-claude-border pb-6">
        <div>
          <h1 className="text-3xl font-black text-claude-text-heading claude-serif flex items-center gap-2.5">
            <span>⛩️</span> Kanji Dojo
          </h1>
          <p className="text-xs text-claude-text-muted mt-1.5 font-bold tracking-tight max-w-2xl">
            Prepare for JLPT N5 and N4. Browse all 300 characters, interact with stroke guides, draw on the practice canvas, and run customizable revision tests.
          </p>
        </div>

        {!quizActive && (
          <button
            onClick={() => setQuizActive(true)}
            className={`px-5 py-3 rounded-2xl text-xs font-black text-white ${themeColors.accent} hover:opacity-90 shadow-md cursor-pointer transition-all active:translate-y-0.5 active:shadow-inner hover:scale-[1.02] flex items-center gap-1.5`}
          >
            <span>🎯</span> Start Kanji Quiz
          </button>
        )}
      </div>

      {/* QUIZ ARENA */}
      {quizActive ? (
        <div className="bg-claude-card border border-claude-border rounded-3xl p-6 md:p-8 shadow-md transition-all duration-300">
          
          {/* Quiz Setup Panel */}
          {!quizQueue.length || quizFinished ? (
            <div>
              {quizFinished ? (
                // Quiz Completed Screen
                <div className="text-center space-y-6 max-w-lg mx-auto py-6">
                  <div className="text-7xl animate-bounce">🌸</div>
                  <h2 className="text-3xl font-black text-claude-text-heading claude-serif">
                    Quiz Session Finished!
                  </h2>
                  
                  <div className="bg-claude-sidebar border border-claude-border rounded-2xl p-6 space-y-3.5 shadow-inner">
                    <div className="flex justify-between text-xs font-extrabold border-b border-claude-border/50 pb-2.5">
                      <span className="text-claude-text-muted">Total Questions:</span>
                      <span className="text-claude-text-heading">{quizQueue.length}</span>
                    </div>
                    <div className="flex justify-between text-xs font-extrabold border-b border-claude-border/50 pb-2.5">
                      <span className="text-claude-text-muted">Correct Answers:</span>
                      <span className="text-green-500 font-black">{quizScore}</span>
                    </div>
                    <div className="flex justify-between text-xs font-extrabold">
                      <span className="text-claude-text-muted">Success Rate:</span>
                      <span className={`font-black ${quizScore === quizQueue.length ? 'text-green-500' : 'text-claude-coral'}`}>
                        {Math.round((quizScore / quizQueue.length) * 100)}%
                      </span>
                    </div>
                  </div>

                  <p className="text-sm font-extrabold text-claude-text-heading italic">
                    {quizScore === quizQueue.length ? 'Flawless Victory! Sugoi! 🌸🏆' :
                     quizScore >= quizQueue.length * 0.8 ? 'Excellent work! Almost perfect! 🎯🌟' :
                     quizScore >= quizQueue.length * 0.5 ? 'Nice try! Keep practicing! 💮' :
                     'Keep studying, practice makes perfect! Ganbare! 🎯'}
                  </p>

                  {/* Incorrect Answers Review Table */}
                  {incorrectAnswers.length > 0 && (
                    <div className="text-left space-y-3 mt-6">
                      <h3 className="text-[10px] font-black uppercase tracking-wider text-claude-text-muted">
                        Review Missed Items
                      </h3>
                      <div className="max-h-52 overflow-y-auto border border-claude-border rounded-2xl bg-claude-sidebar/30 divide-y divide-claude-border">
                        {incorrectAnswers.map((item, i) => (
                          <div key={i} className="p-3.5 text-xs flex justify-between items-center gap-4 hover:bg-claude-sidebar/20 transition-colors">
                            <div>
                              <span className="text-xl font-black mr-2 text-claude-text-heading leading-none">{item.question.character}</span>
                              <span className="text-claude-text-muted">({item.question.meaning})</span>
                            </div>
                            <div className="text-right">
                              <div className="text-[10px] text-red-500 font-bold">You selected: {item.yourAnswer}</div>
                              <div className="text-[10px] text-green-500 font-black">Correct: {item.correctAnswer}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 pt-6 justify-center">
                    <button
                      onClick={startQuiz}
                      className={`px-6 py-3 rounded-2xl text-xs font-black text-white ${themeColors.accent} hover:opacity-95 cursor-pointer shadow active:translate-y-0.5`}
                    >
                      🔄 Retake Quiz
                    </button>
                    <button
                      onClick={() => {
                        setQuizActive(false);
                        setQuizQueue([]);
                      }}
                      className="px-6 py-3 rounded-2xl text-xs font-black bg-claude-sidebar border border-claude-border text-claude-text-heading hover:bg-claude-card cursor-pointer active:translate-y-0.5"
                    >
                      ↩️ Back to Dojo
                    </button>
                  </div>
                </div>
              ) : (
                // Quiz Setup Screen
                <div className="max-w-md mx-auto space-y-6">
                  <h2 className="text-xl font-black text-claude-text-heading border-b border-claude-border pb-4 flex items-center gap-2.5">
                    <span>⚙️</span> Quiz Configuration
                  </h2>

                  {/* Category select */}
                  <div className="space-y-2.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-claude-text-muted">
                      Select Card Categories
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'n5', name: 'N5 Kanji', count: 103, emoji: '💮' },
                        { id: 'n4', name: 'N4 Kanji', count: 167, emoji: '🌸' },
                        { id: 'daily', name: 'Daily Life', count: 30, emoji: '🏠' }
                      ].map(cat => {
                        const isSelected = quizConfig.categories.includes(cat.id);
                        return (
                          <button
                            key={cat.id}
                            onClick={() => {
                              setQuizConfig(prev => {
                                const newCats = prev.categories.includes(cat.id)
                                  ? prev.categories.filter(c => c !== cat.id)
                                  : [...prev.categories, cat.id];
                                return { ...prev, categories: newCats };
                              });
                            }}
                            className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                              isSelected 
                                ? `${themeColors.border} bg-claude-sidebar/40 text-claude-coral shadow-sm scale-[1.02] border-2`
                                : 'border-claude-border bg-claude-card hover:bg-claude-sidebar/20 text-claude-text-muted'
                            }`}
                          >
                            <div className="text-xs font-black">{cat.emoji} {cat.name}</div>
                            <div className="text-[9px] opacity-70 mt-1">{cat.count} items</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Question count */}
                  <div className="space-y-2.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-claude-text-muted">
                      Number of Questions
                    </label>
                    <div className="flex bg-claude-sidebar border border-claude-border rounded-2xl p-1 shadow-inner">
                      {[5, 10, 15, 20, 30, 50].map(n => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setQuizConfig(prev => ({ ...prev, numQuestions: n }))}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer text-center ${
                            quizConfig.numQuestions === n
                              ? `bg-claude-card text-claude-coral border border-claude-border shadow-xs`
                              : 'text-claude-text-muted hover:text-claude-text-heading'
                          }`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Question formats */}
                  <div className="space-y-2.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-claude-text-muted">
                      Question format
                    </label>
                    <div className="grid grid-cols-1 gap-2.5">
                      {[
                        { id: 'kanji-to-meaning', title: 'Kanji ➔ English Meaning', desc: 'Given a Kanji character, guess its English translation.' },
                        { id: 'meaning-to-kanji', title: 'Meaning ➔ Kanji Character', desc: 'Given an English meaning, pick the correct Kanji character.' },
                        { id: 'kanji-to-reading', title: 'Kanji ➔ Pronunciation (Onyomi/Kunyomi)', desc: 'Given a Kanji, guess its correct kana readings.' }
                      ].map(item => (
                        <button
                          key={item.id}
                          onClick={() => setQuizConfig(prev => ({ ...prev, type: item.id }))}
                          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                            quizConfig.type === item.id 
                              ? `${themeColors.border} bg-claude-sidebar/40 text-claude-coral shadow-sm border-2`
                              : 'border-claude-border bg-claude-card hover:bg-claude-sidebar/20 text-claude-text-muted'
                          }`}
                        >
                          <div>
                            <div className="text-xs font-black text-claude-text-heading">{item.title}</div>
                            <div className="text-[9px] text-claude-text-muted mt-0.5">{item.desc}</div>
                          </div>
                          {quizConfig.type === item.id && <span className="text-xs text-claude-coral">✔️</span>}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Action row */}
                  <div className="flex gap-3 pt-4 border-t border-claude-border/50">
                    <button
                      onClick={startQuiz}
                      disabled={quizConfig.categories.length === 0}
                      className={`flex-1 py-3.5 rounded-2xl text-xs font-black text-white ${themeColors.accent} hover:opacity-95 cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed active:translate-y-0.5`}
                    >
                      🚀 Start Quiz Session
                    </button>
                    <button
                      onClick={() => setQuizActive(false)}
                      className="px-5 py-3.5 rounded-2xl text-xs font-black bg-claude-sidebar border border-claude-border text-claude-text-heading hover:bg-claude-card cursor-pointer active:translate-y-0.5"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Active Quiz Game Arena
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-claude-border/50 pb-3.5">
                <span className="text-xs font-black text-claude-text-heading uppercase tracking-wide">
                  Question {currentIdx + 1} of {quizQueue.length}
                </span>
                <span className="text-xs font-black text-green-500 bg-green-500/10 px-2.5 py-0.5 rounded-full border border-green-500/20">
                  Score: {quizScore}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-claude-sidebar h-2.5 rounded-full overflow-hidden shadow-inner border border-claude-border/40">
                <div 
                  className={`h-full transition-all duration-300 ${themeColors.accent}`}
                  style={{ width: `${((currentIdx + 1) / quizQueue.length) * 100}%` }}
                />
              </div>

              {/* Question card container */}
              <div className="flex flex-col items-center justify-center py-8 text-center">
                {quizConfig.type === 'meaning-to-kanji' ? (
                  <div className="space-y-3">
                    <div className="text-[10px] font-black text-claude-text-muted uppercase tracking-widest">
                      Select the correct character for:
                    </div>
                    <div className="text-4xl font-black text-claude-coral claude-serif leading-none">
                      "{quizQueue[currentIdx]?.meaning}"
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="text-[10px] font-black text-claude-text-muted uppercase tracking-widest">
                      {quizConfig.type === 'kanji-to-reading' ? 'Guess the readings for:' : 'What does this kanji represent?'}
                    </div>
                    <div className="text-8xl font-black text-claude-text-heading leading-none bg-claude-sidebar border border-claude-border p-7 rounded-3xl w-36 h-36 flex items-center justify-center shadow-inner japanese-serif">
                      {quizQueue[currentIdx]?.character}
                    </div>
                  </div>
                )}
              </div>

              {/* MCQ Options grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 max-w-2xl mx-auto">
                {options.map((opt, i) => {
                  const currentQuestion = quizQueue[currentIdx];
                  const quizType = quizConfig.type;
                  const correctVal = 
                    quizType === 'kanji-to-meaning' ? currentQuestion.meaning :
                    quizType === 'meaning-to-kanji' ? currentQuestion.character :
                    currentQuestion.onyomi + ' / ' + currentQuestion.kunyomi;

                  let cardStyle = 'border-claude-border bg-claude-card hover:bg-claude-sidebar/25 text-claude-text-heading border shadow-sm hover:scale-[1.01]';
                  if (selectedAnswer === opt) {
                    if (isChecking) {
                      cardStyle = opt === correctVal 
                        ? 'border-green-500 bg-green-500/15 text-green-600 scale-[1.02] border-2 shadow-md' 
                        : 'border-red-500 bg-red-500/15 text-red-500 animate-shake border-2';
                    } else {
                      cardStyle = `${themeColors.border} bg-claude-sidebar text-claude-coral shadow-md scale-[1.02] border-2`;
                    }
                  } else if (isChecking && opt === correctVal) {
                    cardStyle = 'border-green-500 bg-green-500/15 text-green-600 border-2';
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => handleSelectOption(opt)}
                      disabled={isChecking}
                      className={`p-4.5 rounded-2xl text-center transition-all duration-200 cursor-pointer font-bold text-sm select-none active:translate-y-0.5 ${cardStyle}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {/* Submit panel */}
              <div className="pt-6 flex justify-center gap-3.5 border-t border-claude-border/50">
                <button
                  onClick={handleCheckAnswer}
                  disabled={!selectedAnswer || isChecking}
                  className={`px-10 py-3.5 rounded-2xl text-xs font-black text-white ${themeColors.accent} hover:opacity-95 cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed active:translate-y-0.5`}
                >
                  {isChecking ? 'Verifying...' : 'Check Answer'}
                </button>
                <button
                  onClick={() => {
                    setQuizActive(false);
                    setQuizQueue([]);
                  }}
                  className="px-6 py-3.5 rounded-2xl text-xs font-black bg-claude-sidebar border border-claude-border text-claude-text-heading hover:bg-claude-card cursor-pointer active:translate-y-0.5"
                >
                  Quit Quiz
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        // MAIN BOARD VIEW
        <div className="space-y-6">
          {/* Level categories tabs & Search */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Filter Tabs */}
            <div className="flex bg-claude-card border border-claude-border rounded-2xl p-1.5 shrink-0 self-start shadow-sm">
              {[
                { id: 'all', label: 'All 🏮' },
                { id: 'n5', label: 'JLPT N5 💮' },
                { id: 'n4', label: 'JLPT N4 🌸' },
                { id: 'daily', label: 'Daily Life 🏠' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveLevel(tab.id)}
                  className={`px-4.5 py-2 rounded-xl text-xs font-black capitalize transition-all cursor-pointer ${
                    activeLevel === tab.id
                      ? `bg-claude-sidebar text-claude-coral border border-claude-border shadow-md`
                      : 'text-claude-text-muted hover:text-claude-text-heading'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative flex-1 max-w-md w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search kanji character, meaning, readings..."
                className="w-full px-4 py-3 bg-claude-card border border-claude-border rounded-2xl text-xs text-claude-text-heading placeholder-claude-text-muted/60 focus:outline-hidden focus:border-claude-coral focus:ring-1 focus:ring-claude-coral shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-claude-text-muted hover:text-claude-text-heading cursor-pointer"
                >
                  ❌
                </button>
              )}
            </div>
          </div>

          {/* Cards count tracker */}
          <div className="text-[10px] font-black uppercase tracking-wider text-claude-text-muted flex justify-between px-1">
            <span>Showing {filteredKanji.length} Kanji characters</span>
            {activeLevel !== 'all' && <span className="capitalize">{activeLevel} level</span>}
          </div>

          {/* Grid Layout of Kanji Cards */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {paginatedKanji.map((item, index) => (
              <button
                key={index}
                onClick={() => setSelectedKanji(item)}
                className="relative group bg-gradient-to-br from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white rounded-2xl pt-5 pb-4 px-3 flex flex-col items-center justify-center gap-1.5 transition-all duration-300 hover:scale-[1.05] cursor-pointer shadow-md hover:shadow-pink-500/20 hover:shadow-xl border border-pink-400/20 overflow-hidden"
              >
                {/* Visual glow overlay */}
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                {/* Large Kanji symbol */}
                <span className="text-4xl font-black leading-none drop-shadow-sm select-none japanese-serif">
                  {item.character}
                </span>

                {/* Primary Meaning */}
                <span className="text-[10px] font-extrabold text-pink-100 text-center truncate w-full group-hover:text-white transition-colors">
                  {item.meaning}
                </span>

                {/* Level badge indicator */}
                <span className={`text-[7px] font-black uppercase px-2.5 py-0.5 rounded-md ${
                  item.level === 'n5' ? 'bg-emerald-400/30 text-emerald-100' :
                  item.level === 'n4' ? 'bg-purple-400/30 text-purple-100' :
                  'bg-orange-400/30 text-orange-100'
                }`}>
                  {item.level}
                </span>
              </button>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-claude-border/50">
              <span className="text-[10px] font-black uppercase text-claude-text-muted">
                Page {currentPage} of {totalPages} (Showing {filteredKanji.length} items)
              </span>
              
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className="px-3.5 py-2 bg-claude-card hover:bg-claude-sidebar border border-claude-border rounded-xl text-xs font-black text-claude-text-heading disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer active:translate-y-0.5 transition-all"
                >
                  ◀️ Prev
                </button>
                
                {/* Pages indicators */}
                <div className="hidden sm:flex items-center gap-1.5">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                    .map((p, idx, arr) => {
                      const prevVal = arr[idx - 1];
                      const showEllipsis = prevVal && p - prevVal > 1;
                      
                      return (
                        <React.Fragment key={p}>
                          {showEllipsis && <span className="text-claude-text-muted text-xs px-1">...</span>}
                          <button
                            onClick={() => setCurrentPage(p)}
                            className={`w-8 h-8 rounded-xl text-xs font-black flex items-center justify-center border transition-all cursor-pointer ${
                              currentPage === p
                                ? `${themeColors.border} bg-claude-sidebar/40 text-claude-coral border-2 shadow-xs scale-105`
                                : 'border-claude-border bg-claude-card text-claude-text-muted hover:text-claude-text-heading hover:bg-claude-sidebar'
                            }`}
                          >
                            {p}
                          </button>
                        </React.Fragment>
                      );
                    })}
                </div>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  className="px-3.5 py-2 bg-claude-card hover:bg-claude-sidebar border border-claude-border rounded-xl text-xs font-black text-claude-text-heading disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer active:translate-y-0.5 transition-all"
                >
                  Next ▶️
                </button>
              </div>
            </div>
          )}

          {/* Fallback empty view */}
          {filteredKanji.length === 0 && (
            <div className="text-center py-16 border border-dashed border-claude-border rounded-3xl bg-claude-card/30">
              <span className="text-4xl">🏜️</span>
              <h3 className="text-xs font-black text-claude-text-heading mt-2">No Kanji matched your criteria</h3>
              <p className="text-[10px] text-claude-text-muted mt-1">Try resetting the level filter or adjust your search.</p>
            </div>
          )}
        </div>
      )}

      {/* DETAILS LIGHTBOX DRAWER */}
      {selectedKanji && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          {/* Backdrop Click */}
          <div className="absolute inset-0" onClick={() => setSelectedKanji(null)} />

          {/* Modal Content */}
          <div className="relative bg-claude-card border border-claude-border rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl z-10 flex flex-col h-full max-h-[90vh] md:max-h-[660px] animate-scale-up">
            
            {/* Custom stylesheet for KanjiVG rendering */}
            <style>{`
              .kanjivg-svg svg {
                width: 100% !important;
                height: 100% !important;
                display: block;
              }
              .kanjivg-svg svg path {
                stroke: ${themeMode === 'dark' ? '#f1f5f9' : '#0f172a'} !important;
                stroke-width: 3.2px !important;
              }
              .kanjivg-svg svg text {
                fill: #ec4899 !important;
                font-size: 6px !important;
                font-weight: 800 !important;
                font-family: ui-sans-serif, system-ui, sans-serif !important;
              }
            `}</style>

            {/* 1. Header Banner: Rose Pink Gradient */}
            <div className="relative bg-gradient-to-r from-rose-500 to-pink-600 text-white p-6 md:p-8 flex items-center justify-between shrink-0 border-b border-pink-400/20">
              {/* Pattern Background overlay */}
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
              
              <div className="flex items-center gap-6 z-10">
                <span className="text-6xl md:text-7xl font-black drop-shadow-md select-none japanese-serif">
                  {selectedKanji.character}
                </span>
                <div className="space-y-1">
                  <span className="text-[9px] font-black uppercase tracking-widest text-pink-100 bg-pink-700/30 px-2.5 py-1 rounded-md">
                    Level {selectedKanji.level.toUpperCase()} Kanji
                  </span>
                  <h2 className="text-2xl md:text-3xl font-black tracking-tight leading-tight">
                    {selectedKanji.meaning}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-3 z-10">
                {/* TTS Speaker */}
                <button
                  onClick={() => speakKanji(selectedKanji.character)}
                  className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center shadow transition-all cursor-pointer hover:scale-105 active:scale-95"
                  title="Pronounce character"
                >
                  <span className="text-xl">🔊</span>
                </button>
                {/* Close Button */}
                <button
                  onClick={() => setSelectedKanji(null)}
                  className="w-12 h-12 rounded-2xl bg-black/15 hover:bg-black/25 border border-white/10 flex items-center justify-center cursor-pointer transition-colors"
                >
                  <span className="text-lg">✕</span>
                </button>
              </div>
            </div>

            {/* Scrollable Container */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* 2. Look-and-Write Practice Area */}
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-claude-text-muted px-0.5 block">
                  Look & Write Calligraphy Practice
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left: Stroke Order Diagram */}
                  <div className="bg-claude-sidebar border border-claude-border rounded-2xl p-4 flex flex-col items-center justify-center min-h-[220px]">
                    <span className="text-[9px] font-extrabold text-claude-text-muted mb-2 uppercase tracking-wide">
                      Stroke Order Guide
                    </span>
                    <div className="relative w-full max-w-[160px] aspect-square flex items-center justify-center bg-claude-card border border-claude-border/50 rounded-xl p-2.5 shadow-inner">
                      {svgLoading ? (
                        <div className="flex flex-col items-center gap-2">
                          <span className="animate-spin text-xl text-rose-500">⏳</span>
                          <span className="text-[9px] font-extrabold text-claude-text-muted">Loading Guide...</span>
                        </div>
                      ) : svgContent ? (
                        <div 
                          className="w-full h-full kanjivg-svg flex items-center justify-center"
                          dangerouslySetInnerHTML={{ __html: svgContent }}
                        />
                      ) : (
                        // Fallback to stylized text character
                        <span className="text-8xl font-black text-rose-500/25 select-none japanese-serif">
                          {selectedKanji.character}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: Handwriting Canvas */}
                  <div className="bg-claude-sidebar border border-claude-border rounded-2xl p-4 flex flex-col items-center justify-between min-h-[220px]">
                    <span className="text-[9px] font-extrabold text-claude-text-muted uppercase tracking-wide flex justify-between w-full">
                      <span>Practice Writing Area</span>
                      <button
                        onClick={clearCanvas}
                        className="text-rose-500 hover:text-rose-600 transition-colors text-[9px] font-black cursor-pointer"
                      >
                        🧹 Clear
                      </button>
                    </span>
                    
                    <div className="relative w-full max-w-[160px] aspect-square border border-claude-border/70 bg-claude-card rounded-xl overflow-hidden shadow-inner mt-2">
                      <div className="absolute inset-0 flex items-center justify-center text-7xl font-black text-claude-text-heading/[0.03] pointer-events-none select-none japanese-serif">
                        {selectedKanji.character}
                      </div>
                      <canvas
                        ref={canvasRef}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                        className="absolute inset-0 cursor-crosshair touch-none z-10"
                      />
                    </div>

                    <div className="flex gap-4 mt-2 justify-center w-full">
                      <button
                        onClick={() => setCanvasGridVisible(prev => !prev)}
                        className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                          canvasGridVisible 
                            ? 'border-rose-500/30 text-rose-600 dark:text-rose-400 bg-rose-500/5' 
                            : 'border-claude-border text-claude-text-muted hover:text-claude-text-heading'
                        }`}
                      >
                        {canvasGridVisible ? 'Hide Grid lines' : 'Show Grid lines'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Readings Grid */}
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-claude-text-muted px-0.5 block">
                  Pronunciation Readings
                </span>
                <div className="bg-claude-sidebar border border-claude-border rounded-2xl p-4.5 grid grid-cols-2 gap-6 shadow-inner text-xs font-bold">
                  <div className="space-y-1">
                    <span className="text-[8px] font-black uppercase text-pink-500 dark:text-pink-400 tracking-wider block">
                      Onyomi (Chinese Reading)
                    </span>
                    <span className="text-claude-text-heading text-sm font-black block tracking-wide">
                      {selectedKanji.onyomi || '—'}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[8px] font-black uppercase text-emerald-500 dark:text-emerald-400 tracking-wider block">
                      Kunyomi (Japanese Reading)
                    </span>
                    <span className="text-claude-text-heading text-sm font-black block tracking-wide">
                      {selectedKanji.kunyomi || '—'}
                    </span>
                  </div>
                </div>
              </div>

              {/* 4. Memory Association Story */}
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-claude-text-muted px-0.5 block">
                  Mnemonic Memory Story
                </span>
                <div className="bg-claude-sidebar/35 border border-claude-border rounded-2xl p-4 flex gap-4 items-center">
                  <div className="text-4xl bg-gradient-to-br from-pink-100 to-rose-200 dark:from-pink-900/40 dark:to-rose-800/40 border border-rose-200/50 dark:border-rose-800/35 p-3 rounded-2xl shadow shrink-0 select-none">
                    {selectedKanji.illustration}
                  </div>
                  <div className="text-xs text-claude-text-heading leading-relaxed font-semibold">
                    {selectedKanji.mnemonic}
                  </div>
                </div>
              </div>

              {/* 5. Vocabulary Examples */}
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-claude-text-muted px-0.5 block">
                  High-Frequency Vocabulary Examples
                </span>
                {exampleWords.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {exampleWords.map((v, i) => (
                      <div 
                        key={i} 
                        className="bg-purple-500/5 dark:bg-purple-950/15 border border-purple-500/20 hover:border-purple-500/40 rounded-2xl p-4 flex flex-col items-center justify-center text-center transition-all duration-300 hover:scale-[1.02] shadow-xs group"
                      >
                        <span className="font-black text-purple-700 dark:text-purple-300 text-lg tracking-wide group-hover:text-purple-600 dark:group-hover:text-purple-200 transition-colors">
                          {v.kanji}
                        </span>
                        <span className="text-[10px] text-purple-500 dark:text-purple-400 font-extrabold mt-0.5 mb-1.5">
                          {v.reading}
                        </span>
                        <span className="text-[9px] font-bold text-claude-text-muted leading-tight border-t border-purple-500/10 pt-1.5 w-full">
                          {v.meaning}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 border border-dashed border-claude-border rounded-2xl bg-claude-sidebar/10 text-[10px] text-claude-text-muted font-black tracking-tight shadow-inner">
                    No vocabulary items available.
                  </div>
                )}
              </div>

            </div>

            {/* 6. Footer Button row */}
            <div className="p-4 bg-claude-sidebar border-t border-claude-border flex justify-end shrink-0">
              <button
                onClick={() => setSelectedKanji(null)}
                className="px-6 py-2.5 rounded-2xl text-xs font-black text-white bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 shadow cursor-pointer transition-all active:translate-y-0.5"
              >
                Done Studying
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
