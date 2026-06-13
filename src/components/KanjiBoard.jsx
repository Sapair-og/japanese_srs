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
    osc1.frequency.setValueAtTime(523.25, now); // C5
    gain1.gain.setValueAtTime(0.08, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.3);
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
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, now); // Low buzz
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.45);
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
    utterance.rate = 0.8;
    // Find Japanese voice if available
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

  // Find example words from vocabList for the selected Kanji
  const exampleWords = React.useMemo(() => {
    if (!selectedKanji) return [];
    const char = selectedKanji.character;
    return vocabList
      .filter(v => v.kanji && v.kanji.includes(char))
      .slice(0, 5); // Show top 5 examples
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

    // Clear and draw grid if visible
    ctx.clearRect(0, 0, size, size);
    if (canvasGridVisible) {
      ctx.strokeStyle = themeMode === 'dark' ? 'rgba(241, 245, 249, 0.12)' : 'rgba(15, 23, 42, 0.08)';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);

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
    ctx.strokeStyle = themeMode === 'dark' ? '#f87171' : '#dc2626'; // Red brush
    ctx.lineWidth = 6;
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
    
    for (let i = 0; i < 25; i++) {
      tempParticles.push({
        x: canvas.width / 2,
        y: canvas.height / 3,
        vx: (Math.random() - 0.5) * 8,
        vy: -Math.random() * 5 - 4,
        size: Math.random() * 8 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.2,
        opacity: 1,
        decay: Math.random() * 0.02 + 0.015
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
        p.vy += 0.15; // Gravity
        p.angle += p.spin;
        p.opacity -= p.decay;

        if (p.opacity <= 0) return false;

        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);

        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, p.size / 1.8, 0, 0, Math.PI * 2);
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
    // Generate pool of kanji based on selected categories
    let pool = kanjiList.filter(k => quizConfig.categories.includes(k.level));
    if (pool.length === 0) return;

    // Shuffle pool
    pool = [...pool].sort(() => Math.random() - 0.5);

    // Apply limits
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

    // Pick unique distractors
    const uniqueDistractors = Array.from(new Set(distractors))
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    // Combine and shuffle options
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

    // Wait and advance
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

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 select-none relative pb-12">
      {/* Background canvas for sakura particle bursts */}
      {quizActive && !quizFinished && (
        <canvas 
          ref={particleCanvasRef} 
          className="absolute inset-0 w-full h-full pointer-events-none z-50" 
        />
      )}

      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-claude-border pb-5">
        <div>
          <h1 className="text-2xl font-black text-claude-text-heading claude-serif flex items-center gap-2">
            <span>⛩️</span> Kanji Dojo
          </h1>
          <p className="text-xs text-claude-text-muted mt-1 font-semibold">
            Master the core N5, N4, and Daily Life Kanji with memory mnemonics, handwriting practice, and MCQ tests.
          </p>
        </div>

        {!quizActive && (
          <button
            onClick={() => setQuizActive(true)}
            className={`px-5 py-2.5 rounded-xl text-xs font-black text-white ${themeColors.accent} hover:opacity-90 shadow-md cursor-pointer transition-all active:scale-95 flex items-center gap-1.5`}
          >
            <span>🎯</span> Start Kanji Quiz
          </button>
        )}
      </div>

      {/* QUIZ INTERFACE */}
      {quizActive ? (
        <div className="bg-claude-card border border-claude-border rounded-3xl p-6 md:p-8 shadow-sm">
          
          {/* Quiz Setup Panel */}
          {!quizQueue.length || quizFinished ? (
            <div>
              {quizFinished ? (
                // Quiz Completed Screen
                <div className="text-center space-y-6 max-w-lg mx-auto py-4">
                  <div className="text-6xl">🌸</div>
                  <h2 className="text-2xl font-black text-claude-text-heading claude-serif">
                    Quiz Completed!
                  </h2>
                  <div className="bg-claude-sidebar border border-claude-border rounded-2xl p-6 space-y-3">
                    <div className="flex justify-between text-sm font-bold border-b border-claude-border/50 pb-2">
                      <span className="text-claude-text-muted">Total Questions:</span>
                      <span className="text-claude-text-heading">{quizQueue.length}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold border-b border-claude-border/50 pb-2">
                      <span className="text-claude-text-muted">Correct Answers:</span>
                      <span className="text-green-500 font-extrabold">{quizScore}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold">
                      <span className="text-claude-text-muted">Success Rate:</span>
                      <span className={`font-black ${quizScore === quizQueue.length ? 'text-green-500' : 'text-claude-coral'}`}>
                        {Math.round((quizScore / quizQueue.length) * 100)}%
                      </span>
                    </div>
                  </div>

                  {/* Rating emoji & message */}
                  <p className="text-sm font-extrabold text-claude-text-heading italic animate-bounce">
                    {quizScore === quizQueue.length ? 'Perfect Score! Sugoi! 🌸🏆' :
                     quizScore >= quizQueue.length * 0.8 ? 'Excellent job! Great study habits! 🎯🌟' :
                     quizScore >= quizQueue.length * 0.5 ? 'Good try! Keep practicing! 💮' :
                     'Keep learning, you will get better! Ganbare! 🎯'}
                  </p>

                  {/* Incorrect Answers Review Table */}
                  {incorrectAnswers.length > 0 && (
                    <div className="text-left space-y-3 mt-6">
                      <h3 className="text-xs font-black uppercase tracking-wider text-claude-text-muted">
                        Review Incorrect Answers
                      </h3>
                      <div className="max-h-48 overflow-y-auto border border-claude-border rounded-xl bg-claude-sidebar/40 divide-y divide-claude-border">
                        {incorrectAnswers.map((item, i) => (
                          <div key={i} className="p-3 text-xs flex justify-between items-center gap-3">
                            <div>
                              <span className="text-lg font-black mr-2 text-claude-text-heading">{item.question.character}</span>
                              <span className="text-claude-text-muted">({item.question.meaning})</span>
                            </div>
                            <div className="text-right">
                              <div className="text-[10px] text-red-500 font-bold">You: {item.yourAnswer}</div>
                              <div className="text-[10px] text-green-500 font-extrabold">Correct: {item.correctAnswer}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4 justify-center">
                    <button
                      onClick={startQuiz}
                      className={`px-5 py-2.5 rounded-xl text-xs font-black text-white ${themeColors.accent} hover:opacity-95 cursor-pointer shadow active:scale-95`}
                    >
                      🔄 Retake Quiz
                    </button>
                    <button
                      onClick={() => {
                        setQuizActive(false);
                        setQuizQueue([]);
                      }}
                      className="px-5 py-2.5 rounded-xl text-xs font-black bg-claude-sidebar border border-claude-border text-claude-text-heading hover:bg-claude-card cursor-pointer active:scale-95"
                    >
                      ↩️ Back to Dojo
                    </button>
                  </div>
                </div>
              ) : (
                // Quiz Configuration Screen
                <div className="max-w-md mx-auto space-y-6">
                  <h2 className="text-lg font-extrabold text-claude-text-heading border-b border-claude-border pb-3 flex items-center gap-2">
                    <span>⚙️</span> Customize Your Quiz
                  </h2>

                  {/* Category select */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-wider text-claude-text-muted">
                      Select Card Categories
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'n5', name: 'N5 Kanji', count: 80 },
                        { id: 'n4', name: 'N4 Kanji', count: 80 },
                        { id: 'daily', name: 'Daily Life', count: 30 }
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
                            className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                              isSelected 
                                ? `${themeColors.border} bg-claude-sidebar text-claude-coral shadow-sm scale-[1.02]`
                                : 'border-claude-border bg-claude-card hover:bg-claude-sidebar/20 text-claude-text-muted'
                            }`}
                          >
                            <div className="text-xs font-black">{cat.name}</div>
                            <div className="text-[9px] opacity-60 mt-0.5">{cat.count} items</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Question count */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-wider text-claude-text-muted">
                      Number of Questions
                    </label>
                    <div className="flex bg-claude-sidebar border border-claude-border rounded-xl p-1">
                      {[5, 10, 15, 20, 30].map(n => (
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
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-wider text-claude-text-muted">
                      Question format
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      {[
                        { id: 'kanji-to-meaning', title: 'Kanji ➔ English Meaning', desc: 'Given a Kanji character, guess its English meaning.' },
                        { id: 'meaning-to-kanji', title: 'Meaning ➔ Kanji Character', desc: 'Given an English meaning, pick the correct Kanji character.' },
                        { id: 'kanji-to-reading', title: 'Kanji ➔ Reading (Kana)', desc: 'Given a Kanji character, guess its Onyomi/Kunyomi pronunciation.' }
                      ].map(item => (
                        <button
                          key={item.id}
                          onClick={() => setQuizConfig(prev => ({ ...prev, type: item.id }))}
                          className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                            quizConfig.type === item.id 
                              ? `${themeColors.border} bg-claude-sidebar text-claude-coral shadow-sm`
                              : 'border-claude-border bg-claude-card hover:bg-claude-sidebar/20 text-claude-text-muted'
                          }`}
                        >
                          <div>
                            <div className="text-xs font-black text-claude-text-heading">{item.title}</div>
                            <div className="text-[9px] text-claude-text-muted mt-0.5">{item.desc}</div>
                          </div>
                          {quizConfig.type === item.id && <span className="text-xs">✔️</span>}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Action row */}
                  <div className="flex gap-3 pt-3">
                    <button
                      onClick={startQuiz}
                      disabled={quizConfig.categories.length === 0}
                      className={`flex-1 py-3 rounded-xl text-xs font-black text-white ${themeColors.accent} hover:opacity-95 cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      🚀 Start Quiz Session
                    </button>
                    <button
                      onClick={() => setQuizActive(false)}
                      className="px-5 py-3 rounded-xl text-xs font-black bg-claude-sidebar border border-claude-border text-claude-text-heading hover:bg-claude-card cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Active Quiz Arena
            <div className="space-y-6">
              {/* Header stats bar */}
              <div className="flex items-center justify-between border-b border-claude-border/50 pb-3">
                <span className="text-xs font-black text-claude-text-heading">
                  Question {currentIdx + 1} of {quizQueue.length}
                </span>
                <span className="text-xs font-black text-green-500">
                  Score: {quizScore}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-claude-sidebar h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${themeColors.accent}`}
                  style={{ width: `${((currentIdx + 1) / quizQueue.length) * 100}%` }}
                />
              </div>

              {/* Question card container */}
              <div className="flex flex-col items-center justify-center py-6 text-center">
                {quizConfig.type === 'meaning-to-kanji' ? (
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-claude-text-muted uppercase tracking-wider">
                      Which kanji character means:
                    </div>
                    <div className="text-3xl font-black text-claude-coral claude-serif">
                      "{quizQueue[currentIdx]?.meaning}"
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-claude-text-muted uppercase tracking-wider">
                      {quizConfig.type === 'kanji-to-reading' ? 'Guess the pronunciation for:' : 'What does this kanji mean?'}
                    </div>
                    <div className="text-7xl font-black text-claude-text-heading leading-tight bg-claude-sidebar border border-claude-border p-6 rounded-3xl w-32 h-32 flex items-center justify-center shadow-inner claude-serif">
                      {quizQueue[currentIdx]?.character}
                    </div>
                  </div>
                )}
              </div>

              {/* MCQ Options grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-xl mx-auto">
                {options.map((opt, i) => {
                  const currentQuestion = quizQueue[currentIdx];
                  const quizType = quizConfig.type;
                  const correctVal = 
                    quizType === 'kanji-to-meaning' ? currentQuestion.meaning :
                    quizType === 'meaning-to-kanji' ? currentQuestion.character :
                    currentQuestion.onyomi + ' / ' + currentQuestion.kunyomi;

                  let cardStyle = 'border-claude-border bg-claude-card hover:bg-claude-sidebar/20 text-claude-text-heading';
                  if (selectedAnswer === opt) {
                    if (isChecking) {
                      cardStyle = opt === correctVal 
                        ? 'border-green-500 bg-green-500/10 text-green-600 scale-[1.02]' 
                        : 'border-red-500 bg-red-500/10 text-red-500 animate-shake';
                    } else {
                      cardStyle = `${themeColors.border} bg-claude-sidebar text-claude-coral shadow-sm scale-[1.02]`;
                    }
                  } else if (isChecking && opt === correctVal) {
                    cardStyle = 'border-green-500 bg-green-500/10 text-green-600';
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => handleSelectOption(opt)}
                      disabled={isChecking}
                      className={`p-4 rounded-2xl border text-center transition-all duration-200 cursor-pointer font-bold text-sm ${cardStyle}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {/* Check submit action row */}
              <div className="pt-4 flex justify-center gap-3">
                <button
                  onClick={handleCheckAnswer}
                  disabled={!selectedAnswer || isChecking}
                  className={`px-8 py-3 rounded-xl text-xs font-black text-white ${themeColors.accent} hover:opacity-95 cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isChecking ? 'Checking...' : 'Check Answer'}
                </button>
                <button
                  onClick={() => {
                    setQuizActive(false);
                    setQuizQueue([]);
                  }}
                  className="px-6 py-3 rounded-xl text-xs font-black bg-claude-sidebar border border-claude-border text-claude-text-heading hover:bg-claude-card cursor-pointer"
                >
                  Quit Quiz
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        // MAIN BOARD BROWSER
        <div className="space-y-6">
          {/* Level categories tabs & Search */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Filter Tabs */}
            <div className="flex bg-claude-card border border-claude-border rounded-xl p-1 shrink-0 self-start">
              {[
                { id: 'all', label: 'All 🏮' },
                { id: 'n5', label: 'N5 💮' },
                { id: 'n4', label: 'N4 🌸' },
                { id: 'daily', label: 'Daily 🏠' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveLevel(tab.id)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-black capitalize transition-all cursor-pointer ${
                    activeLevel === tab.id
                      ? `bg-claude-sidebar text-claude-coral border border-claude-border shadow-xs`
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
                placeholder="Search kanji, meaning, readings, or tricks..."
                className="w-full px-4 py-2.5 bg-claude-card border border-claude-border rounded-2xl text-xs text-claude-text-heading placeholder-claude-text-muted/65 focus:outline-hidden focus:border-claude-coral focus:ring-1 focus:ring-claude-coral shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-claude-text-muted hover:text-claude-text-heading"
                >
                  ❌
                </button>
              )}
            </div>
          </div>

          {/* Cards count tracker */}
          <div className="text-[10px] font-extrabold uppercase tracking-widest text-claude-text-muted flex justify-between">
            <span>Showing {filteredKanji.length} Kanji characters</span>
            {activeLevel !== 'all' && <span className="capitalize">{activeLevel} level</span>}
          </div>

          {/* Grid Layout of Kanji Cards */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {filteredKanji.map((item, index) => (
              <button
                key={index}
                onClick={() => setSelectedKanji(item)}
                className="bg-claude-card border border-claude-border hover:border-claude-coral rounded-2xl p-4 flex flex-col items-center justify-center gap-2 transition-all duration-300 hover:shadow-md hover:scale-[1.02] cursor-pointer"
              >
                {/* Large Kanji symbol */}
                <span className="text-3xl font-black text-claude-text-heading leading-tight claude-serif">
                  {item.character}
                </span>

                {/* Primary Meaning */}
                <span className="text-[10px] font-bold text-claude-text-muted text-center truncate w-full">
                  {item.meaning}
                </span>

                {/* Level badge indicator */}
                <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${
                  item.level === 'n5' ? 'bg-emerald-500/10 text-emerald-600' :
                  item.level === 'n4' ? 'bg-purple-500/10 text-purple-600' :
                  'bg-orange-500/10 text-orange-600'
                }`}>
                  {item.level}
                </span>
              </button>
            ))}
          </div>

          {/* Fallback empty view */}
          {filteredKanji.length === 0 && (
            <div className="text-center py-12 border border-dashed border-claude-border rounded-3xl bg-claude-card/40">
              <span className="text-3xl">🏜️</span>
              <h3 className="text-xs font-black text-claude-text-heading mt-2">No Kanji matched your criteria</h3>
              <p className="text-[10px] text-claude-text-muted mt-1">Try resetting the level filter or adjust your search.</p>
            </div>
          )}
        </div>
      )}

      {/* DETAILS LIGHTBOX DRAWER */}
      {selectedKanji && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          {/* Backdrop Click */}
          <div className="absolute inset-0" onClick={() => setSelectedKanji(null)} />

          {/* Modal Content */}
          <div className="relative bg-claude-card border border-claude-border rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl z-10 flex flex-col md:flex-row h-full max-h-[90vh] md:max-h-[580px] animate-scale-up">
            
            {/* Left Column: Visual display, TTS, Practice Canvas */}
            <div className="w-full md:w-2/5 bg-claude-sidebar border-b md:border-b-0 md:border-r border-claude-border p-5 flex flex-col items-center justify-between gap-4 shrink-0">
              
              {/* Calligraphy guideline grid */}
              <div className="relative w-full aspect-square max-w-[200px] border border-claude-border bg-claude-card rounded-2xl overflow-hidden flex items-center justify-center shadow-inner group">
                
                {/* Large Kanji symbol underneath */}
                <div className="absolute inset-0 flex items-center justify-center text-8xl font-black text-claude-text-heading/15 pointer-events-none select-none font-serif">
                  {selectedKanji.character}
                </div>

                {/* Canvas element for practice sketches */}
                <canvas
                  ref={canvasRef}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="absolute inset-0 cursor-crosshair touch-none"
                />

                {/* Grid toggle helper label */}
                <div className="absolute bottom-1 right-2 text-[8px] font-black uppercase text-claude-text-muted opacity-50 select-none pointer-events-none">
                  Practice Canvas
                </div>
              </div>

              {/* Canvas controls */}
              <div className="flex gap-2 w-full justify-center">
                <button
                  onClick={clearCanvas}
                  className="px-3 py-1 bg-claude-card hover:bg-claude-sidebar/20 border border-claude-border rounded-lg text-[9px] font-extrabold text-claude-text-heading cursor-pointer active:scale-95 transition-all"
                >
                  🧹 Clear Board
                </button>
                <button
                  onClick={() => setCanvasGridVisible(prev => !prev)}
                  className={`px-3 py-1 border rounded-lg text-[9px] font-extrabold cursor-pointer active:scale-95 transition-all ${
                    canvasGridVisible 
                      ? `${themeColors.border} bg-claude-sidebar text-claude-coral` 
                      : 'border-claude-border bg-claude-card text-claude-text-muted'
                  }`}
                >
                  🔲 {canvasGridVisible ? 'Hide Grid' : 'Show Grid'}
                </button>
              </div>

              {/* TTS Audio Button & level badge */}
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={() => speakKanji(selectedKanji.character)}
                  className={`w-12 h-12 rounded-full border border-claude-border bg-claude-card hover:bg-claude-sidebar flex items-center justify-center shadow-md active:scale-95 transition-all cursor-pointer`}
                  title="Listen to pronunciation"
                >
                  <span className="text-xl">🔊</span>
                </button>
                <span className="text-[9px] font-extrabold text-claude-text-muted uppercase">
                  Level {selectedKanji.level} • {selectedKanji.character}
                </span>
              </div>
            </div>

            {/* Right Column: Readings, Mnemonics, Examples */}
            <div className="flex-1 p-6 flex flex-col justify-between overflow-y-auto space-y-5">
              
              {/* Top Row: Character Meaning & Close */}
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-black text-claude-text-heading claude-serif leading-none">
                    {selectedKanji.character}
                  </h2>
                  <p className="text-xs font-bold text-claude-coral uppercase tracking-wide mt-1">
                    {selectedKanji.meaning}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedKanji(null)}
                  className="w-8 h-8 rounded-full bg-claude-sidebar border border-claude-border hover:bg-claude-border/50 flex items-center justify-center cursor-pointer text-xs transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Readings Info Card */}
              <div className="bg-claude-sidebar border border-claude-border rounded-2xl p-4 grid grid-cols-2 gap-4 text-xs font-bold">
                <div>
                  <span className="text-[8px] font-black uppercase text-claude-text-muted block mb-1">Onyomi (Chinese)</span>
                  <span className="text-claude-text-heading text-sm font-extrabold">{selectedKanji.onyomi}</span>
                </div>
                <div>
                  <span className="text-[8px] font-black uppercase text-claude-text-muted block mb-1">Kunyomi (Japanese)</span>
                  <span className="text-claude-text-heading text-sm font-extrabold">{selectedKanji.kunyomi}</span>
                </div>
              </div>

              {/* Mnemonic / Memory Story card */}
              <div className="space-y-2">
                <span className="text-[8px] font-black uppercase tracking-wider text-claude-text-muted block">
                  Memory Mnemonic Association
                </span>
                <div className="bg-claude-sidebar/40 border border-claude-border rounded-2xl p-4 flex gap-4 items-center">
                  <div className="text-4xl bg-claude-card border border-claude-border p-2 rounded-2xl shadow-sm shrink-0">
                    {selectedKanji.illustration}
                  </div>
                  <div className="text-xs text-claude-text-heading leading-relaxed font-semibold">
                    {selectedKanji.mnemonic}
                  </div>
                </div>
              </div>

              {/* example words containing this kanji */}
              <div className="space-y-2 flex-grow">
                <span className="text-[8px] font-black uppercase tracking-wider text-claude-text-muted block">
                  Example Vocabulary Words
                </span>
                {exampleWords.length > 0 ? (
                  <div className="border border-claude-border rounded-2xl bg-claude-card overflow-hidden text-xs divide-y divide-claude-border">
                    {exampleWords.map((v, i) => (
                      <div key={i} className="p-2.5 flex justify-between items-center gap-3">
                        <div>
                          <span className="font-extrabold text-claude-text-heading mr-2 text-sm">{v.kanji}</span>
                          <span className="text-[10px] text-claude-text-muted">({v.hiragana})</span>
                        </div>
                        <span className="text-[10px] font-bold text-claude-coral">{v.english}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 border border-dashed border-claude-border/50 rounded-2xl bg-claude-sidebar/20 text-[10px] text-claude-text-muted font-bold">
                    No words in Library Manager contain this Kanji yet.
                  </div>
                )}
              </div>

              {/* Action Close row */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedKanji(null)}
                  className={`px-4 py-2 rounded-xl text-xs font-black text-white ${themeColors.accent} hover:opacity-90 shadow cursor-pointer transition-all active:scale-95`}
                >
                  Close Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
