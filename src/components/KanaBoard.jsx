/* eslint-disable */
import React, { useState, useEffect, useRef } from 'react';
import {
  hiraganaGojuon,
  hiraganaDakuon,
  hiraganaYoon,
  katakanaGojuon,
  katakanaDakuon,
  katakanaYoon
} from '../utils/kanaData';
import KanaStrokeAnimator from './KanaStrokeAnimator';
import { strokeMatcher } from '../utils/strokeMatcher';




export default function KanaBoard({ themeRegion, themeMode }) {
  const [activeType, setActiveType] = useState('hiragana'); // 'hiragana' or 'katakana'
  const [activeSection, setActiveSection] = useState('gojuon'); // 'gojuon', 'dakuon', 'yoon'
  const [mode, setMode] = useState('board'); // 'board' or 'drill'
  
  // Guided stroke-order sequence states & refs
  const [activeDrawKana, setActiveDrawKana] = useState(null);
  
  // Drill Configuration state
  const [selectedRows, setSelectedRows] = useState([]);
  const [drillLength, setDrillLength] = useState(10);
  const [drillActive, setDrillActive] = useState(false);
  const [drillMode, setDrillMode] = useState('mc'); // 'mc' or 'calligraphy'

  // Calligraphy drawing states for practice drills
  const [userStrokes, setUserStrokes] = useState([]);
  const [targetStrokes, setTargetStrokes] = useState(null);
  const [svgPaths, setSvgPaths] = useState([]);
  const [drawingFeedback, setDrawingFeedback] = useState([]);

  // Refs for high-performance canvas gestures without triggering React state updates on every move
  const isDrawingRef = useRef(false);
  const currentStrokeRef = useRef([]);
  const drawingCanvasRef = useRef(null);

  
  // Active Drill session state
  const [drillQueue, setDrillQueue] = useState([]);
  const [currentDrillIndex, setCurrentDrillIndex] = useState(0);
  const [drillChoices, setDrillChoices] = useState([]);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isShake, setIsShake] = useState(false);
  const [drillScore, setDrillScore] = useState(0);
  const [drillCompleted, setDrillCompleted] = useState(false);

  // Random success gif state for drill completion screen
  const [successGif] = useState(() => {
    const gifName = Math.random() < 0.5 ? 'success_dance_1.gif' : 'success_dance_2.gif';
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    if (supabaseUrl) {
      const cleanUrl = supabaseUrl.endsWith('/') ? supabaseUrl.slice(0, -1) : supabaseUrl;
      return `${cleanUrl}/storage/v1/object/public/assets/${gifName}`;
    }
    return `/${gifName}`;
  });

  // Pre-load voices
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
    }
  }, []);

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
  const getGlowColor = () => {
    const regions = {
      liyue: '#cc5a37',
      mondstadt: '#0ea5e9',
      inazuma: '#a855f7',
      sumeru: '#22c55e',
      fontaine: '#0284c7',
      natlan: '#f97316',
      snezhnaya: '#0d9488',
      khaenriah: '#ca8a04',
      abyss: '#d946ef'
    };
    return regions[themeRegion] || '#cc5a37';
  };




  useEffect(() => {
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  // Play audio synthesizers
  const playCorrectSound = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const now = ctx.currentTime;
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
    } catch (e) {
      console.warn("Web Audio blocked:", e);
    }
  };

  const playIncorrectSound = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const gain = ctx.createGain();
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(125.00, now);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.4);
      osc1.connect(gain);
      gain.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.4);
    } catch (e) {
      console.warn("Web Audio blocked:", e);
    }
  };

  const speakJapanese = (text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    utterance.rate = 0.9;
    const voices = window.speechSynthesis.getVoices();
    const jaVoice = voices.find(v => v.lang === 'ja-JP' || v.lang.startsWith('ja'));
    if (jaVoice) utterance.voice = jaVoice;
    window.speechSynthesis.speak(utterance);
  };

  // Get current active character map
  const getActiveMap = () => {
    if (activeType === 'hiragana') {
      if (activeSection === 'gojuon') return hiraganaGojuon;
      if (activeSection === 'dakuon') return hiraganaDakuon;
      return hiraganaYoon;
    } else {
      if (activeSection === 'gojuon') return katakanaGojuon;
      if (activeSection === 'dakuon') return katakanaDakuon;
      return katakanaYoon;
    }
  };

  const currentMap = getActiveMap();

  // Initialize selected rows for drill when active type/section changes
  useEffect(() => {
    // Select all row names by default
    const allRows = currentMap.map(r => r.rowName);
    setSelectedRows(allRows);
  }, [activeType, activeSection]);

  const handleRowToggle = (rowName) => {
    setSelectedRows(prev => 
      prev.includes(rowName) 
        ? prev.filter(r => r !== rowName)
        : [...prev, rowName]
    );
  };

  // Start the drill
  const handleStartDrill = () => {
    // Extract selected items
    const pool = [];
    currentMap.forEach(row => {
      if (selectedRows.includes(row.rowName)) {
        row.items.forEach(item => {
          if (item.kana && item.romaji) {
            pool.push(item);
          }
        });
      }
    });

    if (pool.length === 0) {
      alert("Please select at least one character row to drill!");
      return;
    }

    // Shuffle and pick drillLength items
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const length = Math.min(drillLength, shuffled.length);
    const queue = shuffled.slice(0, length);

    setDrillQueue(queue);
    setCurrentDrillIndex(0);
    setDrillScore(0);
    setDrillCompleted(false);
    setDrillActive(true);
    generateChoices(queue[0], pool);
  };

  // Generate choices for current drill item
  const generateChoices = (item, pool) => {
    if (!item) return;
    
    // Get wrong alternatives from the current pool
    const otherOptions = pool
      .filter(p => p.romaji !== item.romaji)
      .map(p => p.romaji);
    
    const uniqueOthers = Array.from(new Set(otherOptions));
    const shuffledOthers = uniqueOthers.sort(() => 0.5 - Math.random());
    const incorrect = shuffledOthers.slice(0, 3);
    
    // Fallbacks if pool is too small
    const fallbacks = ['a', 'i', 'u', 'e', 'o', 'ka', 'ki', 'ku', 'ke', 'ko'];
    while (incorrect.length < 3) {
      const fb = fallbacks[Math.floor(Math.random() * fallbacks.length)];
      if (fb !== item.romaji && !incorrect.includes(fb)) {
        incorrect.push(fb);
      }
    }

    const combined = [item.romaji, ...incorrect].sort(() => 0.5 - Math.random());
    setDrillChoices(combined);
    setSelectedChoice(null);
    setIsChecking(false);
    setIsShake(false);
  };

  // Handle drill answer selection
  const handleChoiceClick = (choice) => {
    if (isChecking) return;

    setSelectedChoice(choice);
    setIsChecking(true);

    const correctItem = drillQueue[currentDrillIndex];
    const isCorrect = choice === correctItem.romaji;

    if (isCorrect) {
      playCorrectSound();
      spawnParticles();
      setDrillScore(prev => prev + 1);
      setTimeout(() => {
        advanceDrill();
      }, 900);
    } else {
      playIncorrectSound();
      setIsShake(true);
      setTimeout(() => {
        advanceDrill();
      }, 1400);
    }
  };

  const advanceDrill = () => {
    const nextIndex = currentDrillIndex + 1;
    if (nextIndex < drillQueue.length) {
      setCurrentDrillIndex(nextIndex);
      // Collect pool of all possible choices for wrong options
      const pool = [];
      currentMap.forEach(row => {
        if (selectedRows.includes(row.rowName)) {
          row.items.forEach(item => {
            if (item.kana && item.romaji) pool.push(item);
          });
        }
      });
      generateChoices(drillQueue[nextIndex], pool);
    } else {
      setDrillCompleted(true);
    }
  };

  const handleResetDrillConfig = () => {
    setDrillActive(false);
    setDrillCompleted(false);
  };

  // Utility to sample points from SVG path command using native browser SVG API
  const samplePointsFromPath = (pathD, numSamples = 32) => {
    try {
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", pathD);
      const totalLen = path.getTotalLength();
      const points = [];
      for (let i = 0; i < numSamples; i++) {
        const fraction = i / (numSamples - 1);
        const pt = path.getPointAtLength(fraction * totalLen);
        points.push({ x: pt.x, y: pt.y });
      }
      return points;
    } catch (err) {
      console.error("Error sampling SVG path:", err);
      return [];
    }
  };

  // Calligraphy SVG loader for drills
  useEffect(() => {
    if (!drillActive || drillMode !== 'calligraphy' || drillCompleted) return;
    const currentItem = drillQueue[currentDrillIndex];
    if (!currentItem) return;
    
    let active = true;
    setTargetStrokes(null);
    setSvgPaths([]);
    setUserStrokes([]);
    setDrawingFeedback([]);
    
    async function fetchSvg() {
      try {
        const char = currentItem.kana;
        let res = await fetch(`/strokesvg/hiragana/${encodeURIComponent(char)}.svg`);
        if (!res.ok) {
          res = await fetch(`/strokesvg/katakana/${encodeURIComponent(char)}.svg`);
        }
        if (!res.ok) throw new Error("SVG not found");
        
        const text = await res.text();
        if (!active) return;
        
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, "image/svg+xml");
        
        // Parse direct children (paths or groups) to count strokes accurately
        const strokeElements = doc.querySelectorAll('g[data-strokesvg="strokes"] > path, g[data-strokesvg="strokes"] > g');
        
        const tStrokes = [];
        const dStrings = [];
        
        strokeElements.forEach(el => {
          let pathElement = null;
          if (el.tagName.toLowerCase() === 'path') {
            pathElement = el;
          } else if (el.tagName.toLowerCase() === 'g') {
            // Take the first path in the group as the main stroke trajectory
            pathElement = el.querySelector('path');
          }
          
          if (pathElement) {
            const d = pathElement.getAttribute("d");
            if (d) {
              dStrings.push(d);
              tStrokes.push(samplePointsFromPath(d, 32));
            }
          }
        });
        
        setTargetStrokes(tStrokes);
        setSvgPaths(dStrings);
      } catch (err) {
        console.warn("Failed to load stroke SVG for character:", currentItem.kana, err);
      }
    }
    
    fetchSvg();
    return () => { active = false; };
  }, [currentDrillIndex, drillActive, drillMode, drillCompleted]);

  // High-performance canvas coordinates & drawing methods
  const getCanvasCoords = (e) => {
    const canvas = drawingCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    return {
      x: ((clientX - rect.left) / rect.width) * 1024,
      y: ((clientY - rect.top) / rect.height) * 1024
    };
  };

  const handleDrawStart = (e) => {
    if (isChecking) return;
    e.preventDefault();
    isDrawingRef.current = true;
    const coords = getCanvasCoords(e);
    currentStrokeRef.current = [coords];
    
    const canvas = drawingCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.beginPath();
      ctx.moveTo(coords.x, coords.y);
      ctx.strokeStyle = 'var(--accent-coral, #cc5a37)';
      ctx.lineWidth = 32;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }
  };

  const handleDrawMove = (e) => {
    if (!isDrawingRef.current || isChecking) return;
    e.preventDefault();
    const coords = getCanvasCoords(e);
    currentStrokeRef.current.push(coords);
    
    const canvas = drawingCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
    }
  };

  const handleDrawEnd = (e) => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    
    if (currentStrokeRef.current.length > 1) {
      const completedStroke = [...currentStrokeRef.current];
      const nextStrokes = [...userStrokes, completedStroke];
      setUserStrokes(nextStrokes);
      
      if (targetStrokes && targetStrokes.length > 0) {
        const strokeIdx = userStrokes.length;
        const targetStroke = targetStrokes[strokeIdx];
        
        if (targetStroke) {
          const res = strokeMatcher.matchSingleStroke(completedStroke, targetStroke);
          let feedback = 'correct';
          if (res.score < 0.6) {
            feedback = 'error-shape';
          } else if (!res.isDirectionCorrect) {
            feedback = 'error-direction';
          }
          setDrawingFeedback(prev => [...prev, feedback]);
        }
      }
    }
    
    const canvas = drawingCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    
    currentStrokeRef.current = [];
  };

  // Auto check calligraphy when finished all strokes
  useEffect(() => {
    if (!drillActive || drillMode !== 'calligraphy' || !targetStrokes || targetStrokes.length === 0 || userStrokes.length === 0) return;
    
    if (userStrokes.length === targetStrokes.length) {
      setIsChecking(true);
      
      const res = strokeMatcher.matchAllStrokes(userStrokes, targetStrokes);
      const isCorrect = res.score >= 0.65 && res.isOrderCorrect && res.isDirectionCorrect;
      
      if (isCorrect) {
        playCorrectSound();
        spawnParticles();
        setDrillScore(prev => prev + 1);
        setTimeout(() => {
          advanceDrill();
          setUserStrokes([]);
          setDrawingFeedback([]);
          setIsChecking(false);
        }, 1000);
      } else {
        playIncorrectSound();
        setIsShake(true);
        setTimeout(() => {
          setIsShake(false);
          advanceDrill();
          setUserStrokes([]);
          setDrawingFeedback([]);
          setIsChecking(false);
        }, 1500);
      }
    }
  }, [userStrokes.length, targetStrokes, drillMode]);


  return (
    <div className="max-w-6xl mx-auto w-full px-2 py-4 md:py-8 animate-fade-in space-y-6">
      
      {/* Title & Mode Switcher Header */}
      <div className="claude-panel border-claude-border rounded-3xl p-6 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gradient-to-r from-claude-coral/5 to-transparent select-none">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-claude-coral/10 text-claude-coral text-[10px] font-extrabold uppercase px-3 py-1 rounded-full border border-claude-coral/25 tracking-wider">
            💮 Kana Room
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-claude-text-heading claude-serif mt-1">
            Hiragana & Katakana
          </h1>
          <p className="text-xs text-claude-text-muted">
            Learn the basics of the Japanese alphabet grids and drill recognition.
          </p>
        </div>

        {/* View Mode Tabs */}
        <div className="relative flex bg-claude-sidebar p-1 rounded-xl border border-claude-border overflow-hidden w-full sm:w-auto">
          <div 
            className="absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-lg transition-all duration-300 ease-out shadow-xs border bg-claude-card border-claude-border/50 pointer-events-none"
            style={{
              transform: mode === 'drill' ? 'translateX(100%)' : 'translateX(0)'
            }}
          />
          <button
            onClick={() => { setMode('board'); handleResetDrillConfig(); }}
            className={`relative z-10 px-6 py-2 text-xs font-semibold rounded-lg transition-all duration-300 cursor-pointer ${
              mode === 'board' ? 'text-claude-coral font-extrabold' : 'text-claude-text-muted hover:text-claude-text-heading'
            }`}
          >
            📋 Grid Charts
          </button>
          <button
            onClick={() => setMode('drill')}
            className={`relative z-10 px-6 py-2 text-xs font-semibold rounded-lg transition-all duration-300 cursor-pointer ${
              mode === 'drill' ? 'text-claude-coral font-extrabold' : 'text-claude-text-muted hover:text-claude-text-heading'
            }`}
          >
            ⚡ Practice Drills
          </button>
        </div>
      </div>

      {/* Sub-toggles for type & section */}
      {!drillActive && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 select-none">
          {/* Hiragana vs Katakana */}
          <div className="flex bg-claude-sidebar/60 border border-claude-border p-1 rounded-xl gap-1">
            <button
              onClick={() => setActiveType('hiragana')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeType === 'hiragana' 
                  ? 'bg-claude-card text-claude-coral shadow-xs border border-claude-border/40' 
                  : 'text-claude-text-muted hover:text-claude-text-heading'
              }`}
            >
              Hiragana
            </button>
            <button
              onClick={() => setActiveType('katakana')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeType === 'katakana' 
                  ? 'bg-claude-card text-claude-coral shadow-xs border border-claude-border/40' 
                  : 'text-claude-text-muted hover:text-claude-text-heading'
              }`}
            >
              Katakana
            </button>
          </div>

          {/* Gojuon vs Dakuon vs Yoon */}
          <div className="flex bg-claude-sidebar/60 border border-claude-border p-1 rounded-xl gap-1 w-full sm:w-auto overflow-x-auto">
            <button
              onClick={() => setActiveSection('gojuon')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeSection === 'gojuon' 
                  ? 'bg-claude-card text-claude-coral shadow-xs border border-claude-border/40' 
                  : 'text-claude-text-muted hover:text-claude-text-heading'
              }`}
            >
              Basic (Gojuon)
            </button>
            <button
              onClick={() => setActiveSection('dakuon')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeSection === 'dakuon' 
                  ? 'bg-claude-card text-claude-coral shadow-xs border border-claude-border/40' 
                  : 'text-claude-text-muted hover:text-claude-text-heading'
              }`}
            >
              Voiced (Dakuon)
            </button>
            <button
              onClick={() => setActiveSection('yoon')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeSection === 'yoon' 
                  ? 'bg-claude-card text-claude-coral shadow-xs border border-claude-border/40' 
                  : 'text-claude-text-muted hover:text-claude-text-heading'
              }`}
            >
              Contracted (Yoon)
            </button>
          </div>
        </div>
      )}

      {/* Grid Mode View */}
      {mode === 'board' && (
        <div className="claude-panel border-claude-border rounded-3xl p-6 md:p-8 space-y-8 select-none">
          <div className="grid grid-cols-1 gap-6">
            {currentMap.map((row) => (
              <div key={row.rowName} className="flex flex-col md:flex-row md:items-center gap-4 border-b border-claude-border/30 pb-4 last:border-0 last:pb-0">
                
                {/* Row Label */}
                <div className="w-24 text-left">
                  <span className="text-[10px] uppercase font-bold text-claude-coral bg-claude-coral/10 px-2 py-0.5 rounded border border-claude-coral/15">
                    {row.rowName}
                  </span>
                </div>
                
                {/* Grid row items */}
                <div className="flex-1 grid grid-cols-5 gap-3">
                  {row.items.map((item, idx) => {
                    if (!item.kana) {
                      // Spacer card
                      return <div key={`empty-${idx}`} className="bg-transparent border-0 select-none pointer-events-none" />;
                    }
                    return (
                      <button
                        key={item.kana}
                        onClick={() => {
                          speakJapanese(item.kana);
                          setActiveDrawKana(item);
                        }}
                        className="bg-claude-card border border-claude-border rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-center gap-2 group cursor-pointer shadow-xs active:scale-95 kana-card-glow"
                      >
                        <span className="text-3xl sm:text-4xl font-extrabold text-claude-text-heading group-hover:scale-105 transition-transform japanese-serif kana-char-glow">
                          {item.kana}
                        </span>
                        
                        <div className="flex items-center gap-1.5 text-xs text-claude-text-muted mt-1 select-none">
                          <span>🔊</span>
                          <span className="font-semibold">{item.romaji}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Drill Mode Configure View */}
      {mode === 'drill' && !drillActive && (
        <div className="max-w-xl mx-auto w-full px-4 animate-fade-in">
          <div className="claude-panel border-claude-border rounded-3xl p-8 space-y-6 shadow-xs select-none">
            <div className="text-center space-y-2 border-b border-claude-border/50 pb-4">
              <h2 className="text-2xl font-extrabold text-claude-text-heading claude-serif">
                Configure Practice Drill ⚡
              </h2>
              <p className="text-xs text-claude-text-muted">
                Select specific character rows and count parameters to launch your drill.
              </p>
            </div>

            <div className="space-y-4">
              {/* Select Rows checkboxes */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-claude-text-muted tracking-wider block">
                  Select Rows to Practice ({selectedRows.length} checked)
                </label>
                
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {currentMap.map((row) => (
                    <button
                      key={row.rowName}
                      onClick={() => handleRowToggle(row.rowName)}
                      className={`px-3 py-2 border rounded-xl text-left text-xs font-bold flex items-center justify-between cursor-pointer transition-colors ${
                        selectedRows.includes(row.rowName)
                          ? 'bg-claude-coral/10 border-claude-coral text-claude-coral'
                          : 'bg-claude-card hover:bg-claude-sidebar border-claude-border text-claude-text-muted'
                      }`}
                    >
                      <span>{row.rowName}</span>
                      <span className="text-[9px] opacity-75">
                        {selectedRows.includes(row.rowName) ? '✓' : '+'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Drill Type selection option */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-claude-text-muted tracking-wider block">
                  Drill Type
                </label>
                <div className="flex bg-claude-sidebar/60 border border-claude-border p-1 rounded-xl gap-1">
                  <button
                    onClick={() => setDrillMode('mc')}
                    className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                      drillMode === 'mc'
                        ? 'bg-claude-card text-claude-coral shadow-xs border border-claude-border/40 font-extrabold'
                        : 'text-claude-text-muted hover:text-claude-text-heading'
                    }`}
                  >
                    📋 Multiple Choice
                  </button>
                  <button
                    onClick={() => setDrillMode('calligraphy')}
                    className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                      drillMode === 'calligraphy'
                        ? 'bg-claude-card text-claude-coral shadow-xs border border-claude-border/40 font-extrabold'
                        : 'text-claude-text-muted hover:text-claude-text-heading'
                    }`}
                  >
                    🖌️ Calligraphy Tracing
                  </button>
                </div>
              </div>

              {/* Drill count limit */}
              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <label className="text-[10px] uppercase font-bold text-claude-text-muted tracking-wider">
                    Drill Size
                  </label>
                  <span className="text-xs font-bold text-claude-coral bg-claude-coral/10 border border-claude-coral/20 px-2 py-0.5 rounded">
                    {drillLength} Questions
                  </span>
                </div>
                
                <div className="grid grid-cols-4 gap-2 select-none">
                  {[5, 10, 15, 25].map((num) => {
                    const isSelected = drillLength === num;
                    return (
                      <button
                        key={num}
                        onClick={() => setDrillLength(num)}
                        className={`py-1.5 px-2 rounded-lg border text-[10px] font-bold transition-all cursor-pointer ${
                          isSelected 
                            ? 'bg-claude-coral/10 border-claude-coral text-claude-coral' 
                            : 'bg-claude-card hover:bg-claude-sidebar border-claude-border text-claude-text-muted hover:text-claude-text-heading'
                        }`}
                      >
                        {num} Qs
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <button
              onClick={handleStartDrill}
              className="w-full py-4 text-xs premium-btn-coral text-white font-black rounded-2xl text-center flex items-center justify-center gap-2 cursor-pointer"
            >
              Launch Drill Session ⚡
            </button>
          </div>
        </div>
      )}

      {/* Drill Active Quiz View */}
      {mode === 'drill' && drillActive && !drillCompleted && (
        <div className="max-w-xl mx-auto w-full px-4 animate-fade-in">
          <div className="space-y-6">
            
            {/* Header/Stats overlay */}
            <div className="flex justify-between items-center text-xs font-semibold text-claude-text-muted px-1 select-none">
              <button
                onClick={handleResetDrillConfig}
                className="bg-claude-card border border-claude-border hover:border-red-500 hover:text-red-500 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                title="Quit study session"
              >
                🚪 Quit
              </button>
              <span className="bg-claude-card border border-claude-border rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 shadow-sm">
                Question {currentDrillIndex + 1} of {drillQueue.length}
              </span>
              <span className="bg-claude-card border border-claude-border rounded-lg px-2.5 py-1.5 shadow-sm">
                Score: {drillScore}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-claude-sidebar border border-claude-border h-2 rounded-full overflow-hidden shadow-inner">
              <div 
                className="h-full bg-claude-coral transition-all duration-300 ease-out" 
                style={{ width: `${((currentDrillIndex) / drillQueue.length) * 100}%` }}
              />
            </div>

            {/* Drill Quiz Card & Input Methods */}
            {drillMode === 'calligraphy' ? (
              <div className="space-y-4 w-full">
                {/* Tracing Canvas Container */}
                <div 
                  className={`claude-panel border-claude-border rounded-3xl p-6 sm:p-8 text-center relative overflow-hidden shadow-md ${
                    isShake ? 'animate-shake border-claude-error' : ''
                  }`}
                >
                  {/* Transparent Canvas for Sakura Particle Burst */}
                  <canvas 
                    ref={canvasRef} 
                    className="absolute inset-0 w-full h-full pointer-events-none z-30" 
                  />

                  {/* Top Header controls */}
                  <div className="absolute top-4 left-4 text-[10px] font-black text-claude-text-muted uppercase tracking-wider select-none">
                    Write this Kana: <span className="text-claude-coral bg-claude-coral/10 px-2 py-0.5 border border-claude-coral/20 rounded font-black">{drillQueue[currentDrillIndex]?.romaji}</span>
                  </div>

                  <div className="absolute top-4 right-4 z-30 flex gap-2">
                    <button
                      onClick={() => speakJapanese(drillQueue[currentDrillIndex]?.kana)}
                      className="w-8 h-8 rounded-full bg-claude-sidebar border border-claude-border hover:border-claude-coral/55 flex items-center justify-center text-xs transition-all cursor-pointer shadow-sm text-claude-text hover:text-claude-coral"
                      title="Listen pronunciation"
                    >
                      🔊
                    </button>
                  </div>

                  {/* Draw box */}
                  <div className="py-2 flex flex-col items-center">
                    <div className="relative w-full aspect-square max-w-[240px] sm:max-w-[280px] bg-claude-sidebar/20 border border-claude-border rounded-2xl overflow-hidden mx-auto select-none calligraphy-grid">
                      {/* Stencil Tracing Outline */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-15 text-claude-text select-none">
                        {targetStrokes ? (
                          <svg viewBox="0 0 1024 1024" className="w-full h-full stroke-current fill-none stroke-[32px] stroke-linecap-round stroke-linejoin-round">
                            {svgPaths.map((d, i) => (
                              <path key={i} d={d} />
                            ))}
                          </svg>
                        ) : (
                          <span className="text-[120px] font-bold japanese-serif">{drillQueue[currentDrillIndex]?.kana}</span>
                        )}
                      </div>

                      {/* High-Performance Gesture Canvas */}
                      <canvas
                        ref={drawingCanvasRef}
                        onMouseDown={handleDrawStart}
                        onMouseMove={handleDrawMove}
                        onMouseUp={handleDrawEnd}
                        onMouseLeave={handleDrawEnd}
                        onTouchStart={handleDrawStart}
                        onTouchMove={handleDrawMove}
                        onTouchEnd={handleDrawEnd}
                        className="absolute inset-0 w-full h-full cursor-crosshair z-20 touch-none"
                        style={{ touchAction: 'none' }}
                        width={1024}
                        height={1024}
                      />

                      {/* SVG Live Render Overlay */}
                      <svg viewBox="0 0 1024 1024" className="absolute inset-0 w-full h-full pointer-events-none z-10 fill-none stroke-linecap-round stroke-linejoin-round">
                        {userStrokes.map((stroke, sIdx) => {
                          const feedback = drawingFeedback[sIdx];
                          let strokeColor = 'var(--accent-coral, #cc5a37)';
                          if (feedback === 'correct') strokeColor = '#10b981';
                          if (feedback === 'error-shape' || feedback === 'error-direction') strokeColor = '#ef4444';
                          
                          const pathData = stroke.map((pt, pIdx) => `${pIdx === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`).join(' ');
                          return (
                            <path
                              key={sIdx}
                              d={pathData}
                              stroke={strokeColor}
                              strokeWidth="32"
                            />
                          );
                        })}
                      </svg>
                    </div>

                    {/* Manual self check fallback if no stroke details are loaded */}
                    {!targetStrokes && (
                      <div className="flex gap-2 justify-center mt-4 relative z-30 w-full max-w-[240px] sm:max-w-[280px]">
                        <button
                          type="button"
                          onClick={() => {
                            playCorrectSound();
                            spawnParticles();
                            setDrillScore(prev => prev + 1);
                            advanceDrill();
                            setUserStrokes([]);
                            setDrawingFeedback([]);
                          }}
                          className="flex-1 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 rounded-xl text-[10px] font-bold cursor-pointer"
                        >
                          ✓ Correct
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            playIncorrectSound();
                            setIsShake(true);
                            setTimeout(() => {
                              setIsShake(false);
                              advanceDrill();
                              setUserStrokes([]);
                              setDrawingFeedback([]);
                            }, 1200);
                          }}
                          className="flex-1 py-2 bg-red-500/10 border border-red-500/30 text-red-500 rounded-xl text-[10px] font-bold cursor-pointer"
                        >
                          ✗ Incorrect
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Control Panel (Clear & Progress info) */}
                <div className="flex justify-between items-center max-w-md mx-auto py-1 px-2 select-none relative z-30">
                  <span className="text-[9px] uppercase font-bold text-claude-text-muted">
                    {targetStrokes 
                      ? `Draw Stroke: ${userStrokes.length + 1} of ${targetStrokes.length}`
                      : `Trace character: "${drillQueue[currentDrillIndex]?.kana}"`
                    }
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setUserStrokes([]);
                      setDrawingFeedback([]);
                    }}
                    className="px-3 py-1.5 bg-claude-sidebar border border-claude-border hover:border-claude-coral/55 text-claude-text-muted hover:text-claude-coral rounded-lg text-[9px] font-bold cursor-pointer transition-all"
                  >
                    Clear Canvas 🧹
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div 
                  className={`claude-panel study-card-hover border-claude-border rounded-3xl p-12 sm:p-16 text-center relative overflow-hidden shadow-md ${
                    isShake ? 'animate-shake border-claude-error' : ''
                  } ${
                    isChecking && selectedChoice === drillQueue[currentDrillIndex].romaji
                      ? 'border-claude-success' 
                      : ''
                  }`}
                >
                  <canvas 
                    ref={canvasRef} 
                    className="absolute inset-0 w-full h-full pointer-events-none z-30" 
                  />
                  <div className="absolute top-4 right-4">
                    <button
                      onClick={() => speakJapanese(drillQueue[currentDrillIndex].kana)}
                      className="w-9 h-9 rounded-full bg-claude-sidebar border border-claude-border hover:border-claude-coral/55 flex items-center justify-center text-xs transition-all cursor-pointer shadow-sm text-claude-text hover:text-claude-coral"
                      title="Listen pronunciation"
                    >
                      🔊
                    </button>
                  </div>

                  <div className="py-6 min-h-[160px] flex flex-col justify-center items-center">
                    <span className="text-[10px] uppercase tracking-wider font-extrabold bg-claude-sidebar text-claude-coral px-3 py-1 rounded-full border border-claude-border mb-4">
                      {activeType === 'hiragana' ? 'Hiragana Drill' : 'Katakana Drill'}
                    </span>
                    
                    <div className="text-7xl sm:text-8xl font-black text-claude-text-heading japanese-serif tracking-wider">
                      {drillQueue[currentDrillIndex]?.kana}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {drillChoices.map((choice, idx) => {
                    const isSelected = selectedChoice === choice;
                    const isCorrect = choice === drillQueue[currentDrillIndex]?.romaji;

                    let buttonClass = 'bg-claude-card border-claude-border hover:border-claude-coral/55 text-claude-text hover:text-claude-text-heading';
                    
                    if (isChecking) {
                      if (isCorrect) {
                        buttonClass = 'bg-claude-success border-claude-success text-white scale-[1.01]';
                      } else if (isSelected) {
                        buttonClass = 'bg-claude-error border-claude-error text-white scale-[0.99]';
                      } else {
                        buttonClass = 'bg-claude-card/25 border-claude-border/25 text-claude-text-muted/40 cursor-not-allowed scale-[0.98]';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        disabled={isChecking}
                        onClick={() => handleChoiceClick(choice)}
                        className={`py-4 px-6 border text-center rounded-2xl font-bold text-sm sm:text-base flex justify-center items-center transition-all duration-150 shadow-xs cursor-pointer ${buttonClass}`}
                      >
                        <span>{choice}</span>
                      </button>
                    );
                  })}
                </div>
              </>
            )}

          </div>
        </div>
      )}

      {/* Drill Completed View */}
      {mode === 'drill' && drillActive && drillCompleted && (
        <div className="max-w-xl mx-auto w-full px-4 animate-fade-in text-center select-none">
          <div className="claude-panel border-claude-border rounded-3xl p-10 space-y-6 relative overflow-hidden">
            
            <div className="space-y-3">
              {/* Celebrating Mascot */}
              <div className="w-32 h-32 flex items-center justify-center shrink-0 mx-auto overflow-hidden rounded-2xl border border-claude-border">
                <img 
                  src={successGif} 
                  className="w-full h-full object-cover" 
                  alt="Success celebrating animation mascot" 
                />
              </div>
              
              <h1 className="text-3xl font-extrabold text-claude-text-heading claude-serif mt-4">Drill Complete!</h1>
              <p className="text-sm text-claude-text-muted max-w-sm mx-auto">
                Fantastic recognition! You scored <strong className="text-claude-text-heading font-black">{drillScore} / {drillQueue.length}</strong> correct on your {activeType === 'hiragana' ? 'Hiragana' : 'Katakana'} drill.
              </p>
            </div>

            {/* Score Ring */}
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
                    strokeDashoffset={2 * Math.PI * 56 * (1 - (drillScore / drillQueue.length))}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-2xl font-extrabold text-claude-text-heading claude-serif">
                    {Math.round((drillScore / drillQueue.length) * 100)}%
                  </span>
                  <span className="text-[9px] uppercase font-bold text-claude-text-muted">Accuracy</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <button
                onClick={handleStartDrill}
                className="w-full py-3.5 premium-btn-coral text-white font-bold rounded-2xl text-xs cursor-pointer"
              >
                Restart Same Drill ⚡
              </button>
              <button
                onClick={handleResetDrillConfig}
                className="w-full py-3.5 bg-claude-sidebar border border-claude-border hover:border-claude-text-muted text-claude-text-heading font-semibold rounded-2xl transition-all text-xs cursor-pointer"
              >
                Back to Drill Config ⚙️
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Guided Progressive Stroke Sequence Modal Overlay */}
      {activeDrawKana && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[100] flex items-center justify-center p-4 animate-fade-in">
          {/* Backdrop click away */}
          <div className="absolute inset-0" onClick={() => setActiveDrawKana(null)} />
          
          <div className="claude-panel w-full max-w-lg rounded-3xl p-5 md:p-6 relative z-10 flex flex-col gap-4 animate-fade-in shadow-2xl bg-claude-card">
            {/* Header */}
            <div className="flex justify-between items-center border-b border-claude-border pb-3">
              <div>
                <h3 className="font-extrabold text-sm uppercase tracking-wider text-claude-text-heading claude-serif">
                  Guided Stroke Order
                </h3>
                <p className="text-[10px] text-claude-text-muted">
                  Follow the progressive sequence below to learn the correct stroke order.
                </p>
              </div>
              <button 
                onClick={() => setActiveDrawKana(null)}
                className="text-claude-text-muted hover:text-claude-text-heading text-xs font-bold p-1 cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            <KanaStrokeAnimator 
              activeDrawKana={activeDrawKana}
              activeType={activeType}
              themeRegion={themeRegion}
              themeMode={themeMode}
              onSpeak={() => speakJapanese(activeDrawKana.kana)}
            />

            {/* Action buttons */}
            <div className="flex justify-end pt-2 border-t border-claude-border">
              <button
                onClick={() => setActiveDrawKana(null)}
                className="px-6 py-2.5 bg-claude-sidebar border border-claude-border hover:bg-claude-card text-claude-text hover:text-claude-text-heading rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Close Guide
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
