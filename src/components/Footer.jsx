import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full mt-12 bg-transparent select-none">
      {/* 1. Shoreline Landscape Illustration SVG */}
      <svg 
        viewBox="0 0 1200 180" 
        className="w-full h-auto block text-zinc-300 dark:text-zinc-700 fill-none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Sky Background & Sun rays */}
        <path d="M 0 180 L 0 110 Q 300 120 600 110 T 1200 110 L 1200 180 Z" fill="var(--bg-primary)" opacity="0.5" />
        
        {/* Mount Fuji (on the right side) */}
        <polygon points="850,110 980,30 1110,110" fill="currentColor" opacity="0.3" stroke="currentColor" strokeWidth="1" />
        <polygon points="948,50 980,30 1012,50" fill="#ffffff" opacity="0.95" /> {/* Snow Cap */}

        {/* Waves / Sea Shoreline (Left side to center) */}
        {/* Wave Layer 1 */}
        <path 
          d="M 0 115 Q 150 95 300 115 T 600 115 T 900 115 L 1200 115 L 1200 180 L 0 180 Z" 
          fill="var(--bg-primary)" 
          stroke="currentColor" 
          strokeWidth="1.5" 
        />
        {/* Wave Layer 2 (Crabigator waves) */}
        <path 
          d="M 0 125 Q 100 105 200 125 T 400 125 T 600 125 L 1200 125 L 1200 180 L 0 180 Z" 
          fill="currentColor" 
          fillOpacity="0.05" 
          stroke="currentColor" 
          strokeWidth="1" 
          strokeDasharray="4 4"
        />

        {/* Giant Crabigator Monster (rising from the sea on the left, ~120px to 220px) */}
        <g className="text-emerald-600 dark:text-emerald-700" fill="currentColor">
          {/* Crabigator scales/back */}
          <path d="M 60 130 C 50 105 70 85 95 85 C 105 85 115 90 120 100 C 130 90 145 90 155 100 C 160 90 175 90 185 100 C 190 115 185 130 170 130 Z" />
          
          {/* Head & snout */}
          <path d="M 160 105 C 160 95 175 90 190 92 C 195 93 205 97 210 103 C 205 107 195 108 190 108 C 180 108 170 110 160 105 Z" />
          
          {/* Eye */}
          <circle cx="180" cy="98" r="2.5" fill="#000" />
          <circle cx="180" cy="98" r="1" fill="#fff" />
          
          {/* Snout spikes */}
          <polygon points="195,92 198,87 201,92" fill="#000" opacity="0.3" />
          <polygon points="203,94 206,89 209,94" fill="#000" opacity="0.3" />

          {/* Crab Claws */}
          <path d="M 90 110 Q 75 75 60 90 Q 55 95 62 102 C 67 107 80 110 90 110 Z" /> {/* Left Claw */}
          <path d="M 130 110 Q 145 70 165 85 Q 170 90 162 97 C 157 102 140 110 130 110 Z" /> {/* Right Claw */}
          
          {/* Cute monster smile */}
          <path d="M 195 102 Q 200 105 204 102" stroke="#000" strokeWidth="1.5" fill="none" />
        </g>

        {/* Checkered Turtle (walking on the shore on the right, ~680px) */}
        <g className="text-amber-600 dark:text-amber-700" fill="currentColor">
          {/* Flippers */}
          <ellipse cx="660" cy="140" rx="8" ry="4" transform="rotate(-15 660 140)" />
          <ellipse cx="715" cy="140" rx="8" ry="4" transform="rotate(15 715 140)" />
          {/* Tail */}
          <polygon points="658,135 650,135 656,131" />
          {/* Shell */}
          <path d="M 665 135 C 665 115 710 115 710 135 Z" fill="#b45309" stroke="#78350f" strokeWidth="1.5" />
          {/* Checkered Shell grid lines */}
          <path d="M 678 118 L 678 135 M 690 116 L 690 135 M 702 120 L 702 135 M 665 128 H 710" stroke="#f59e0b" strokeWidth="1.2" fill="none" />
          {/* Head & Neck */}
          <path d="M 708 132 C 715 132 725 125 725 132 C 725 138 715 137 708 136 Z" />
          {/* Eyes */}
          <circle cx="721" cy="130" r="1" fill="#000" />
        </g>

        {/* Shore/Sand decorations (little grass bundles or rocks) */}
        <circle cx="450" cy="145" r="3" fill="currentColor" opacity="0.2" />
        <circle cx="456" cy="148" r="2.2" fill="currentColor" opacity="0.2" />
        <circle cx="810" cy="135" r="4" fill="currentColor" opacity="0.2" />
        
        {/* Clouds */}
        <path d="M 350 40 Q 370 30 390 40 Q 410 30 430 40 L 430 50 L 350 50 Z" fill="currentColor" opacity="0.08" />
        <path d="M 750 30 Q 765 20 780 30 Q 795 20 810 30 L 810 38 L 750 38 Z" fill="currentColor" opacity="0.08" />
      </svg>

      {/* 2. Footer Menu and Copyright Bar */}
      <div className="w-full bg-[#333333] text-zinc-300 py-5 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold shadow-md">
        {/* Left: Menu Links */}
        <div className="flex flex-wrap gap-4 md:gap-6 justify-center md:justify-start">
          <a href="#" className="hover:text-pink-500 transition-colors">About</a>
          <a href="#" className="hover:text-pink-500 transition-colors">API</a>
          <a href="#" className="hover:text-pink-500 transition-colors">Help</a>
          <a href="#" className="hover:text-pink-500 transition-colors">Terms</a>
          <a href="#" className="hover:text-pink-500 transition-colors">Privacy</a>
          <a href="#" className="hover:text-pink-500 transition-colors">App Status</a>
          <a href="#" className="hover:text-pink-500 transition-colors">Contact</a>
        </div>

        {/* Right: Copyright banner styled as a bright pink tag */}
        <div className="bg-pink-500 text-white font-extrabold px-3 py-1.5 rounded-lg select-none tracking-tight shadow-xs">
          Copyright © Kyoto-Slate LLC
        </div>
      </div>
    </footer>
  );
}
