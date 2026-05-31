/* eslint-disable */
import React from 'react';

export default function ErrorFallback({ type, onRetry, onBackHome }) {
  const getErrorData = () => {
    switch (type) {
      case 'offline':
        return {
          title: "fr no internet? we are cooked. 🦖🔌",
          subtitle: "bestie, your wifi literally decided to quiet quit. go touch some real grass or check your router settings. RIP connectivity.",
          btnLabel: "try again bestie 🔄",
          illustration: (
            <svg viewBox="0 0 200 200" className="w-40 h-40 select-none pointer-events-none">
              <style>
                {`
                  @keyframes wifiFlicker {
                    0%, 100% { opacity: 0.15; }
                    50% { opacity: 0.85; }
                  }
                  @keyframes graveWobble {
                    0%, 100% { transform: rotate(0deg); }
                    50% { transform: rotate(-1deg); }
                  }
                  .wifi-arc-1 { animation: wifiFlicker 1.8s infinite ease-in-out; }
                  .wifi-arc-2 { animation: wifiFlicker 1.8s infinite ease-in-out 0.4s; }
                  .wifi-arc-3 { animation: wifiFlicker 1.8s infinite ease-in-out 0.8s; }
                  .grave { animation: graveWobble 4s infinite ease-in-out; transform-origin: bottom center; }
                `}
              </style>
              
              {/* Ground & Grass */}
              <path d="M 20 170 Q 100 160 180 170 L 180 190 L 20 190 Z" fill="#2d2d2a" />
              <path d="M 40 166 L 43 158 L 47 166 M 150 168 L 153 160 L 157 168" stroke="#cc5a37" strokeWidth="2" fill="none" />
              
              {/* Gravestone */}
              <g className="grave">
                <path d="M 60 170 L 60 80 Q 60 50 100 50 Q 140 50 140 80 L 140 170 Z" fill="#1e1e1c" stroke="#2d2d2a" strokeWidth="3" />
                <path d="M 75 90 L 125 90 M 100 75 L 100 120" stroke="#2d2d2a" strokeWidth="4" strokeLinecap="round" />
                <text x="100" y="145" fill="#6b6a65" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">NO WIFI</text>
              </g>
              
              {/* Broken WiFi over grave */}
              <g transform="translate(100, 30)">
                <circle cx="0" cy="0" r="4" fill="#cc5a37" />
                <path d="M -10 -8 A 15 15 0 0 1 10 -8" fill="none" stroke="#cc5a37" strokeWidth="2.5" className="wifi-arc-1" strokeLinecap="round" />
                <path d="M -18 -16 A 25 25 0 0 1 18 -16" fill="none" stroke="#cc5a37" strokeWidth="2.5" className="wifi-arc-2" strokeLinecap="round" />
                <path d="M -26 -24 A 35 35 0 0 1 26 -24" fill="none" stroke="#cc5a37" strokeWidth="2.5" className="wifi-arc-3" strokeLinecap="round" />
                
                {/* Visual Crack lighting bolt */}
                <path d="M -2 -35 L 5 -20 L -5 -15 L 2 2" fill="none" stroke="#141413" strokeWidth="2" />
              </g>
            </svg>
          )
        };
      case 'database':
        return {
          title: "the database ghosted us 💔",
          subtitle: "supabase left us on read. either the servers are having a midlife crisis, or your .env file keys quiet quit. RIP data.",
          btnLabel: "reconnect bestie 🔌",
          illustration: (
            <svg viewBox="0 0 200 200" className="w-40 h-40 select-none pointer-events-none">
              <style>
                {`
                  @keyframes ghostFloat {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-12px) rotate(3deg); }
                  }
                  @keyframes coffinGlow {
                    0%, 100% { filter: drop-shadow(0 0 2px rgba(204,90,55,0.25)); }
                    50% { filter: drop-shadow(0 0 12px rgba(204,90,55,0.75)); }
                  }
                  .ghost { animation: ghostFloat 3s infinite ease-in-out; }
                  .coffin { animation: coffinGlow 2.5s infinite ease-in-out; }
                `}
              </style>
              
              {/* Coffin with glowing accent */}
              <g className="coffin">
                {/* Coffin shadow / outline */}
                <path d="M 80 180 L 50 140 L 60 70 L 140 70 L 150 140 L 120 180 Z" fill="#1e1e1c" stroke="#cc5a37" strokeWidth="1.5" />
                {/* Coffin Lid slightly skewed open */}
                <path d="M 75 178 L 43 138 L 55 65 L 132 65 L 143 138 L 115 178 Z" fill="#141413" stroke="#2d2d2a" strokeWidth="3" />
                {/* Supabase logo inside glowing */}
                <path d="M 90 120 L 110 100 L 98 100 L 110 85 L 90 105 L 102 105 Z" fill="#cc5a37" opacity="0.85" />
              </g>
              
              {/* Faint Floating Ghost */}
              <g className="ghost" transform="translate(100, 70)">
                <path d="M -15 0 C -15 -25 15 -25 15 0 L 15 20 C 15 22 10 25 5 22 C 0 25 -5 22 -10 25 C -15 22 -15 22 -15 20 Z" fill="#f2f0ea" opacity="0.88" />
                {/* Face */}
                <circle cx="-5" cy="-5" r="2" fill="#141413" />
                <circle cx="5" cy="-5" r="2" fill="#141413" />
                <path d="M -3 3 Q 0 6 3 3" fill="none" stroke="#141413" strokeWidth="1.5" strokeLinecap="round" />
                {/* Cheeks */}
                <circle cx="-8" cy="-1" r="1.5" fill="#cc5a37" opacity="0.4" />
                <circle cx="8" cy="-1" r="1.5" fill="#cc5a37" opacity="0.4" />
              </g>
            </svg>
          )
        };
      case '404':
      default:
        return {
          title: "bro went to the shadow realm 🪦",
          subtitle: "bestie, this page is dead. like, actually deceased. we looked everywhere but there is only void here.",
          btnLabel: "go home bestie 🏛️",
          illustration: (
            <svg viewBox="0 0 200 200" className="w-40 h-40 select-none pointer-events-none">
              <style>
                {`
                  @keyframes handSway {
                    0%, 100% { transform: rotate(0deg); }
                    50% { transform: rotate(5deg); }
                  }
                  @keyframes eyeFlicker {
                    0%, 100% { opacity: 0.1; }
                    50% { opacity: 0.9; }
                  }
                  .zombie-hand { animation: handSway 3.5s infinite ease-in-out; transform-origin: bottom center; }
                  .glow-eye { animation: eyeFlicker 2.5s infinite ease-in-out; }
                `}
              </style>
              
              {/* Ground & Grass */}
              <path d="M 20 170 Q 100 160 180 170 L 180 190 L 20 190 Z" fill="#2d2d2a" />
              
              {/* Gravestone */}
              <path d="M 40 170 L 40 90 Q 40 60 75 60 Q 110 60 110 90 L 110 170 Z" fill="#1e1e1c" stroke="#2d2d2a" strokeWidth="2.5" />
              <text x="75" y="110" fill="#cc5a37" fontSize="18" fontWeight="black" textAnchor="middle" fontFamily="monospace">404</text>
              <text x="75" y="130" fill="#6b6a65" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="monospace">R . I . P</text>
              
              {/* Zombie Hand rising */}
              <g className="zombie-hand" transform="translate(130, 160)">
                {/* Arm */}
                <path d="M -6 10 L -4 -30 L 4 -30 L 6 10 Z" fill="#6b6a65" />
                {/* Hand / Fingers */}
                <path d="M -4 -30 C -4 -35 -8 -38 -8 -42 Q -8 -45 -5 -45 C -4 -42 -2 -35 -2 -30" fill="#cc5a37" stroke="#2d2d2a" strokeWidth="1" />
                <path d="M -1 -30 C -1 -37 -3 -42 -3 -47 Q -3 -50 0 -50 C 2 -47 2 -37 2 -30" fill="#cc5a37" stroke="#2d2d2a" strokeWidth="1" />
                <path d="M 2 -30 C 2 -35 5 -40 5 -45 Q 7 -47 9 -45 C 8 -41 5 -35 5 -30" fill="#cc5a37" stroke="#2d2d2a" strokeWidth="1" />
                <path d="M 4 -28 C 6 -32 10 -34 11 -37 Q 13 -36 12 -33 C 9 -30 6 -27 5 -25" fill="#cc5a37" stroke="#2d2d2a" strokeWidth="1" />
              </g>
              
              {/* Glowing red eyes in the dark grave side */}
              <circle cx="155" cy="120" r="2.5" fill="#cc5a37" className="glow-eye" />
              <circle cx="163" cy="120" r="2.5" fill="#cc5a37" className="glow-eye" />
            </svg>
          )
        };
    }
  };

  const data = getErrorData();

  return (
    <div className="w-full min-h-screen bg-[#141413] flex items-center justify-center text-[#f2f0ea] p-6 animate-fade-in select-none">
      <div className="max-w-md w-full border border-[#2d2d2a] rounded-3xl p-8 shadow-2xl bg-[#1e1e1c] flex flex-col items-center text-center gap-6 relative overflow-hidden">
        {/* Soft coral accent top strip */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#cc5a37]/50 to-transparent" />
        
        {/* Graveyard Illustration */}
        <div className="flex justify-center items-center">
          {data.illustration}
        </div>

        {/* Text Copy */}
        <div className="space-y-2">
          <h2 className="text-xl font-black text-[#f2f0ea] claude-serif leading-tight">
            {data.title}
          </h2>
          <p className="text-xs text-[#92918b] leading-relaxed max-w-sm mx-auto">
            {data.subtitle}
          </p>
        </div>

        {/* Buttons / Actions */}
        <div className="flex flex-col gap-2.5 w-full pt-2">
          {onRetry && (
            <button
              onClick={onRetry}
              className="w-full py-3.5 bg-[#cc5a37] hover:bg-[#cc5a37]/90 text-white font-extrabold rounded-2xl shadow-md transition-all text-xs cursor-pointer active:scale-98"
            >
              {data.btnLabel}
            </button>
          )}
          {onBackHome && (
            <button
              onClick={onBackHome}
              className="w-full py-3 bg-[#141413] border border-[#2d2d2a] hover:border-[#6b6a65] text-[#f2f0ea] font-semibold rounded-2xl transition-all text-xs cursor-pointer active:scale-98"
            >
              go back to safety 🏠
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
