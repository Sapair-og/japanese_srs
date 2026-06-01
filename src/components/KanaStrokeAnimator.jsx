import React, { useState, useEffect, useRef } from 'react';

// Single SVG Stroke Renderer using zhengkyl/strokesvg contents
export function StrokeSvg({ 
  svgText, 
  stepIndex, 
  strokeHighlightColor = '#ff5f5f', 
  animate = false, 
  highlightCurrent = true,
  globalDelayOffset = 0,
  themeMode = 'light'
}) {
  const containerRef = useRef(null);
  
  // Generate a unique ID prefix for this instance to prevent SVG id/clipPath collisions
  const reactId = React.useId();
  const idPrefix = React.useMemo(() => reactId.replace(/:/g, ''), [reactId]);

  // Rewrite all IDs, href references, and url() references in the SVG text with the unique prefix
  const uniqueSvgText = React.useMemo(() => {
    if (!svgText) return '';
    return svgText
      .replace(/id="([^"]+)"/g, `id="${idPrefix}-$1"`)
      .replace(/href="#([^"]+)"/g, `href="#${idPrefix}-$1"`)
      .replace(/url\(#([^)]+)\)/g, `url(#${idPrefix}-$1)`);
  }, [svgText, idPrefix]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const svg = container.querySelector('svg');
    if (!svg) return;

    // Make SVG responsive
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');

    // Override stroke colors using CSS variables
    const shadowColor = themeMode === 'dark' ? 'rgba(241, 245, 249, 0.08)' : 'rgba(15, 23, 42, 0.08)';
    const strokeColor = themeMode === 'dark' ? '#f1f5f9' : '#1e293b';

    svg.style.setProperty('--shadow', shadowColor);
    svg.style.setProperty('--stroke', strokeColor);

    // Apply fill style override for shadows to make sure it picks the theme variable
    const shadowGroup = svg.querySelector('g[data-strokesvg="shadows"]');
    if (shadowGroup) {
      shadowGroup.style.fill = 'var(--shadow)';
    }

    // Find all strokes
    const strokes = svg.querySelectorAll('g[data-strokesvg="strokes"] > *');
    
    strokes.forEach((stroke, i) => {
      // Find length of path (handle SVGGElement or standard SVGPathElement)
      let length = 1000;
      if (stroke instanceof SVGGElement) {
        let sum = 0;
        let count = 0;
        for (const child of stroke.children) {
          if (typeof child.getTotalLength === 'function') {
            sum += child.getTotalLength();
            count++;
          }
        }
        length = count > 0 ? sum / count : 1000;
        
        // Apply dasharray to child paths
        for (const child of stroke.children) {
          child.style.strokeDasharray = `${length}`;
        }
      } else if (typeof stroke.getTotalLength === 'function') {
        length = stroke.getTotalLength();
        stroke.style.strokeDasharray = `${length}`;
      } else {
        stroke.style.strokeDasharray = `${length}`;
      }

      if (stepIndex !== undefined && stepIndex !== null) {
        // Progressive Rendering mode for step cards
        if (i < stepIndex) {
          // Fully drawn stroke (static)
          setStrokeOffset(stroke, 0);
          stroke.style.opacity = '1';
          stroke.style.visibility = 'visible';
          stroke.style.stroke = strokeColor;
          stroke.style.transition = 'none';
        } else if (i === stepIndex) {
          // Current stroke (draw immediately + highlight)
          setStrokeOffset(stroke, 0);
          stroke.style.opacity = '1';
          stroke.style.visibility = 'visible';
          stroke.style.stroke = highlightCurrent ? strokeHighlightColor : strokeColor;
          // Add a subtle pulse or thick stroke for current active drawing
          stroke.style.strokeWidth = stroke instanceof SVGGElement ? '' : '140'; 
          stroke.style.transition = 'none';
        } else {
          // Hidden stroke
          setStrokeOffset(stroke, length);
          stroke.style.opacity = '0';
          stroke.style.visibility = 'hidden';
          stroke.style.transition = 'none';
        }
      } else if (animate) {
        // Full sequence Animation mode
        setStrokeOffset(stroke, length);
        stroke.style.opacity = '1';
        stroke.style.visibility = 'visible';
        stroke.style.stroke = strokeColor;
        stroke.style.transition = 'none';
      } else {
        // Fully drawn static mode
        setStrokeOffset(stroke, 0);
        stroke.style.opacity = '1';
        stroke.style.visibility = 'visible';
        stroke.style.stroke = strokeColor;
        stroke.style.transition = 'none';
      }
    });

    // Run animation if requested
    if (animate && (stepIndex === undefined || stepIndex === null)) {
      let currentDelay = 100 + globalDelayOffset;
      const timeouts = [];

      strokes.forEach(stroke => {
        let length = 1000;
        if (stroke instanceof SVGGElement) {
          let sum = 0;
          let count = 0;
          for (const child of stroke.children) {
            if (typeof child.getTotalLength === 'function') {
              sum += child.getTotalLength();
              count++;
            }
          }
          length = count > 0 ? sum / count : 1000;
        } else if (typeof stroke.getTotalLength === 'function') {
          length = stroke.getTotalLength();
        }

        // Set duration proportional to length
        const duration = Math.max(300, Math.min(800, length / 1.5)); // duration in ms
        
        const startTimeout = setTimeout(() => {
          // Apply transition to stroke-dashoffset
          if (stroke instanceof SVGGElement) {
            for (const child of stroke.children) {
              child.style.transition = `stroke-dashoffset ${duration}ms ease-in-out`;
              child.style.strokeDashoffset = '0';
            }
          } else {
            stroke.style.transition = `stroke-dashoffset ${duration}ms ease-in-out`;
            stroke.style.strokeDashoffset = '0';
          }
        }, currentDelay);

        timeouts.push(startTimeout);
        currentDelay += duration + 180; // Add gap between strokes
      });

      return () => {
        timeouts.forEach(t => clearTimeout(t));
      };
    }

    function setStrokeOffset(el, val) {
      if (el instanceof SVGGElement) {
        for (const child of el.children) {
          child.style.strokeDashoffset = `${val}`;
        }
      } else {
        el.style.strokeDashoffset = `${val}`;
      }
    }

  }, [uniqueSvgText, stepIndex, animate, strokeHighlightColor, highlightCurrent, globalDelayOffset, themeMode]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full flex items-center justify-center pointer-events-none select-none"
      dangerouslySetInnerHTML={{ __html: uniqueSvgText }}
    />
  );
}

// Math helper to get local step index for split characters
function getCharacterStepIndex(charIndex, globalIdx, strokeCounts) {
  let startStep = 0;
  for (let k = 0; k < charIndex; k++) {
    startStep += strokeCounts[k];
  }
  const count = strokeCounts[charIndex];
  const endStep = startStep + count;

  if (globalIdx < startStep) {
    return -1; // Hidden
  } else if (globalIdx >= endStep) {
    return count - 1; // Fully drawn
  } else {
    return globalIdx - startStep; // Currently drawing
  }
}

// Main Interactive Kana Stroke Animator Component
export default function KanaStrokeAnimator({ 
  activeDrawKana, 
  activeType, 
  themeRegion, 
  themeMode,
  onSpeak
}) {
  const [svgTexts, setSvgTexts] = useState([]);
  const [strokeCounts, setStrokeCounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [animationKey, setAnimationKey] = useState(0);

  // Region colors mapping for current theme
  const getThemeHighlightColor = () => {
    const regions = {
      liyue: '#f43f5e', // Rose / Coral
      mondstadt: '#06b6d4', // Cyan
      inazuma: '#a855f7', // Purple
      sumeru: '#10b981', // Emerald / Green
      fontaine: '#3b82f6', // Blue
      natlan: '#f97316', // Orange
      snezhnaya: '#0f766e', // Teal
      khaenriah: '#d97706', // Amber
      abyss: '#ec4899' // Pink
    };
    return regions[themeRegion] || '#f43f5e';
  };

  useEffect(() => {
    if (!activeDrawKana) return;

    Promise.resolve().then(() => {
      setLoading(true);
    });
    const chars = [...activeDrawKana.kana];

    const promises = chars.map(char => {
      const path = `/strokesvg/${activeType}/${char}.svg`;
      return fetch(path)
        .then(res => {
          if (!res.ok) throw new Error(`Could not load stroke SVG for character: ${char}`);
          return res.text();
        });
    });

    Promise.all(promises)
      .then(texts => {
        setSvgTexts(texts);
        
        // Count strokes in each SVG
        const counts = texts.map(text => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(text, 'image/svg+xml');
          const strokes = doc.querySelectorAll('g[data-strokesvg="strokes"] > *');
          return strokes.length;
        });
        setStrokeCounts(counts);
        setLoading(false);
        setAnimationKey(prev => prev + 1); // Trigger showcase animation
      })
      .catch(err => {
        console.error('Failed to load strokesvg:', err);
        setLoading(false);
      });
  }, [activeDrawKana, activeType]);

  const totalStrokesCount = strokeCounts.reduce((sum, count) => sum + count, 0);
  const highlightColor = getThemeHighlightColor();

  // Stagger animation delays for showcase characters
  const getShowcaseDelay = (charIdx) => {
    let delay = 0;
    for (let k = 0; k < charIdx; k++) {
      // Rough duration: 550ms per stroke + 180ms gap
      delay += strokeCounts[k] * 730;
    }
    return delay;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3 text-claude-text-muted">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-claude-text-muted border-t-transparent" />
        <span className="text-xs font-bold tracking-wider uppercase">Loading stroke paths...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Large Showcase Animator Row */}
      <div 
        onClick={() => setAnimationKey(prev => prev + 1)}
        className="flex items-center justify-center gap-6 py-4 px-8 bg-claude-sidebar/35 border border-claude-border/50 rounded-3xl relative overflow-hidden group cursor-pointer hover:bg-claude-sidebar/50 transition-all select-none"
        title="Click to replay stroke animation"
      >
        {/* Replay Indicator watermark */}
        <div className="absolute top-2.5 right-3 text-[9px] uppercase font-extrabold tracking-widest text-claude-text-muted/40 group-hover:text-claude-text-muted/80 transition-colors flex items-center gap-1">
          <span>Replay</span>
          <span>🔄</span>
        </div>

        <div className="flex items-center justify-center gap-4">
          {svgTexts.map((text, idx) => {
            const sizeClass = svgTexts.length > 1 ? "w-20 h-20 sm:w-24 sm:h-24" : "w-24 h-24 sm:w-28 sm:h-28";
            return (
              <div key={idx} className={`${sizeClass} drop-shadow-sm`}>
                <StrokeSvg 
                  svgText={text} 
                  animate={true} 
                  themeMode={themeMode}
                  globalDelayOffset={getShowcaseDelay(idx)}
                  key={`${activeDrawKana.kana}-${idx}-${animationKey}`}
                />
              </div>
            );
          })}
        </div>

        <div className="flex flex-col items-start gap-0.5 select-none border-l border-claude-border/60 pl-6">
          <span className="text-[9px] uppercase font-extrabold text-claude-text-muted tracking-widest">Pronunciation</span>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-cyan-600 dark:text-cyan-400 uppercase tracking-widest">
              {activeDrawKana.romaji}
            </span>
            {onSpeak && (
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Avoid triggering animation replay
                  onSpeak();
                }}
                className="w-7 h-7 rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-xs text-cyan-600 dark:text-cyan-400 transition-all flex items-center justify-center cursor-pointer active:scale-90"
                title="Listen pronunciation"
              >
                🔊
              </button>
            )}
          </div>
          <span className="text-[9px] text-claude-text-muted font-medium">
            {totalStrokesCount} {totalStrokesCount === 1 ? 'Stroke' : 'Strokes'}
          </span>
        </div>
      </div>

      {/* Progressive Step Cards Grid */}
      <div className="space-y-2.5">
        <h4 className="text-[10px] uppercase font-extrabold text-claude-text-muted tracking-widest text-center md:text-left">
          Writing Steps Sequence
        </h4>
        
        <div className="flex flex-wrap gap-3.5 items-center justify-center md:justify-start py-1.5 max-h-[36vh] overflow-y-auto pr-1.5 scrollbar-thin">
          {Array.from({ length: totalStrokesCount }).map((_, stepIdx) => (
            <div key={`${stepIdx}-${animationKey}`} className="flex flex-col items-center gap-2 animate-fade-in">
              <div className="p-2 bg-claude-sidebar/20 rounded-2xl border border-dashed border-claude-border/50 hover:border-cyan-500/30 transition-colors flex flex-col items-center shadow-xs bg-claude-card">
                
                {/* Render all character SVGs for this step */}
                <div className="flex gap-2 justify-center items-center h-14 w-28">
                  {svgTexts.map((text, charIdx) => {
                    const charStepIdx = getCharacterStepIndex(charIdx, stepIdx, strokeCounts);
                    // Standard small size for step SVGs
                    const stepSizeClass = svgTexts.length > 1 ? "w-8 h-8" : "w-10 h-10";
                    return (
                      <div key={charIdx} className={`${stepSizeClass}`}>
                        <StrokeSvg 
                          svgText={text} 
                          stepIndex={charStepIdx}
                          strokeHighlightColor={highlightColor}
                          themeMode={themeMode}
                          key={`${charStepIdx}-${animationKey}`}
                        />
                      </div>
                    );
                  })}
                </div>

                <span 
                  className="text-[9px] uppercase tracking-wider font-extrabold mt-1.5 px-2 py-0.5 rounded-full text-white/90 shadow-2xs transition-colors"
                  style={{ backgroundColor: highlightColor }}
                >
                  Stroke {stepIdx + 1}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
