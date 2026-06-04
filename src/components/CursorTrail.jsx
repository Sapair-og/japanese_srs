/* eslint-disable */
import React, { useEffect, useRef } from 'react';

const CHARACTERS = [
  // Hiragana
  'あ', 'い', 'う', 'え', 'お', 'か', 'き', 'く', 'け', 'こ', 'さ', 'し', 'す', 'せ', 'そ',
  // Katakana
  'ア', 'イ', 'ウ', 'エ', 'オ', 'カ', 'キ', 'ク', 'ケ', 'コ', 'サ', 'シ', 'ス', 'セ', 'ソ',
  // Kanji
  '日', '本', '語', '書', '学', '生', '友', '達', '先', '生', '私', '花', '猫', '犬', '夢', 
  '空', '海', '山', '川', '風', '雨', '雪', '月', '星', '春', '夏', '秋', '冬', '桜'
];

export default function CursorTrail() {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const mousePos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const lastTrailPos = useRef({ x: 0, y: 0 });
  const isMoving = useRef(false);
  const moveTimeout = useRef(null);
  const lastActiveTime = useRef(Date.now());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });

    const handleResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e) => {
      const { clientX: x, clientY: y } = e;
      mousePos.current = { x, y };

      isMoving.current = true;
      lastActiveTime.current = Date.now();

      if (moveTimeout.current) clearTimeout(moveTimeout.current);
      moveTimeout.current = setTimeout(() => {
        isMoving.current = false;
      }, 150);

      // Spawn a trail particle if the mouse moves enough distance
      const dist = Math.hypot(x - lastTrailPos.current.x, y - lastTrailPos.current.y);
      if (dist >= 24) {
        lastTrailPos.current = { x, y };
        spawnParticle(x, y, 'trail');
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Spawns a single character particle into the mutable ref array
    const spawnParticle = (x, y, mode = 'trail') => {
      const char = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
      let vx, vy, scale, decay;

      if (mode === 'radiate') {
        // Radiate radial sparks when cursor is stationary
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.6 + Math.random() * 1.2;
        vx = Math.cos(angle) * speed;
        vy = Math.sin(angle) * speed;
        scale = 10 + Math.random() * 8; // starting font size (px)
        decay = 0.012; // slow fade rate
      } else {
        // Upward floating drift for active cursor trailing
        vx = (Math.random() - 0.5) * 1.0;
        vy = (Math.random() - 0.5) * 0.6 - 1.0;
        scale = 12 + Math.random() * 12; // starting font size (px)
        decay = 0.022; // normal fade rate
      }

      particlesRef.current.push({
        x,
        y,
        char,
        vx,
        vy,
        opacity: 1,
        scale,
        decay,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.06
      });

      // Maintain a maximum particle budget to limit overhead
      if (particlesRef.current.length > 55) {
        particlesRef.current.shift();
      }

      startLoop();
    };

    // Radiating intervals
    const interval = setInterval(() => {
      // Only radiate sparks if mouse is stationary AND was active within the last 3 seconds
      if (!isMoving.current && (Date.now() - lastActiveTime.current < 3000)) {
        spawnParticle(mousePos.current.x, mousePos.current.y, 'radiate');
      }
    }, 200);

    let animId;
    let isLoopRunning = false;

    const render = () => {
      if (particlesRef.current.length === 0) {
        isLoopRunning = false;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return; // Suspend the render loop to save CPU
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const isDark = document.documentElement.classList.contains('dark');
      const baseColor = isDark ? '224, 104, 71' : '204, 90, 55'; // matching --accent-coral
      const glowColor = isDark ? '#e06847' : '#cc5a37';

      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';

      // Update positions and scale decay
      particlesRef.current = particlesRef.current.map(p => {
        const nextOpacity = p.opacity - p.decay;
        const nextScale = Math.max(0, p.scale - 0.06);
        return {
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          rotation: p.rotation + p.rotSpeed,
          opacity: nextOpacity,
          scale: nextScale
        };
      }).filter(p => p.opacity > 0 && p.scale > 0);

      // Render each particle in the frame
      for (let i = 0; i < particlesRef.current.length; i++) {
        const p = particlesRef.current[i];
        
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        
        // Render atmospheric glow
        ctx.shadowBlur = 4;
        ctx.shadowColor = glowColor;
        ctx.fillStyle = `rgba(${baseColor}, ${p.opacity})`;
        ctx.font = `bold ${p.scale}px "Sawarabi Mincho", "Noto Sans JP", serif`;
        
        ctx.fillText(p.char, 0, 0);
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    const startLoop = () => {
      if (!isLoopRunning) {
        isLoopRunning = true;
        animId = requestAnimationFrame(render);
      }
    };

    // Trigger initial render in case particles are spawned immediately
    startLoop();

    return () => {
      cancelAnimationFrame(animId);
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (moveTimeout.current) clearTimeout(moveTimeout.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999] w-full h-full overflow-hidden select-none"
    />
  );
}
