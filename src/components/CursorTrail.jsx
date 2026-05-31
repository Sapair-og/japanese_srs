/* eslint-disable */
import React, { useEffect, useState, useRef } from 'react';

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
  const [particles, setParticles] = useState([]);
  const mousePos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const lastTrailPos = useRef({ x: 0, y: 0 });
  const particleId = useRef(0);
  const isMoving = useRef(false);
  const moveTimeout = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX: x, clientY: y } = e;
      mousePos.current = { x, y };

      // Set moving state and reset inactivity timeout
      isMoving.current = true;
      if (moveTimeout.current) clearTimeout(moveTimeout.current);
      moveTimeout.current = setTimeout(() => {
        isMoving.current = false;
      }, 150);

      // Handle trail spawning during movement
      const dist = Math.hypot(x - lastTrailPos.current.x, y - lastTrailPos.current.y);
      if (dist >= 22) {
        lastTrailPos.current = { x, y };
        spawnParticle(x, y, 'trail');
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (moveTimeout.current) clearTimeout(moveTimeout.current);
    };
  }, []);

  // Spawn a single character particle
  const spawnParticle = (x, y, mode = 'trail') => {
    const char = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
    let vx, vy, scale, decay;

    if (mode === 'radiate') {
      // Radiate in all 360-degree directions when mouse is still
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.8 + Math.random() * 1.4;
      vx = Math.cos(angle) * speed;
      vy = Math.sin(angle) * speed; // Shoot outwards radially
      scale = 0.4 + Math.random() * 0.5;
      decay = 0.015; // Slow fade for radiating particles
    } else {
      // Drift slightly and float upwards during active trail movement
      vx = (Math.random() - 0.5) * 1.2;
      vy = (Math.random() - 0.5) * 0.8 - 1.2;
      scale = 0.5 + Math.random() * 0.7;
      decay = 0.025; // Normal fade rate
    }

    const newParticle = {
      id: particleId.current++,
      x,
      y,
      char,
      vx,
      vy,
      opacity: 1,
      scale,
      decay,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 6
    };

    // Cap active particles to 45 to safeguard rendering performance
    setParticles(prev => [...prev.slice(-45), newParticle]);
  };

  // Interval timer to radiate characters when the cursor is stationary
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isMoving.current) {
        // Spawn 1 radiating particle from the current mouse position
        spawnParticle(mousePos.current.x, mousePos.current.y, 'radiate');
      }
    }, 180); // Spawn rate when still

    return () => clearInterval(interval);
  }, []);

  // Physics animation loop using requestAnimationFrame
  useEffect(() => {
    if (particles.length === 0) return;

    let active = true;
    const updatePhysics = () => {
      if (!active) return;
      
      setParticles(prev => 
        prev
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            rotation: p.rotation + p.rotSpeed,
            opacity: p.opacity - p.decay,
            scale: Math.max(0, p.scale - 0.005)
          }))
          .filter(p => p.opacity > 0 && p.scale > 0)
      );
      
      requestAnimationFrame(updatePhysics);
    };

    const animId = requestAnimationFrame(updatePhysics);
    return () => {
      active = false;
      cancelAnimationFrame(animId);
    };
  }, [particles.length]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden select-none">
      {particles.map(p => (
        <span
          key={p.id}
          className="absolute font-bold text-claude-coral select-none pointer-events-none"
          style={{
            left: p.x,
            top: p.y,
            transform: `translate(-50%, -50%) scale(${p.scale}) rotate(${p.rotation}deg)`,
            opacity: p.opacity,
            fontSize: '13px',
            fontFamily: "'Sawarabi Mincho', 'Noto Sans JP', serif",
            textShadow: '0 0 3px var(--color-claude-coral)',
            transition: 'opacity 0.05s linear'
          }}
        >
          {p.char}
        </span>
      ))}
    </div>
  );
}
