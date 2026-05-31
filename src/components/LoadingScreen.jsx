import { useState, useEffect } from 'react';

const facts = [
  "The Japanese writing system consists of three scripts: Hiragana (for grammar), Katakana (for foreign words), and Kanji (Chinese characters).",
  "Japanese verbs always appear at the very end of a sentence. The standard structure is Subject-Object-Verb (SOV).",
  "The word 'Karaoke' (カラオケ) is a blend of two words: 'kara' (empty) and 'oke' (short for orchestra).",
  "There are no singular or plural forms for nouns in Japanese, nor are there any articles like 'a', 'an', or 'the'.",
  "Japanese utilizes pitch accent, meaning words like 'hashi' can mean 'bridge' (橋) or 'chopsticks' (箸) depending on pitch.",
  "Japanese has a rich set of onomatopoeia words, like 'goro-goro' (rumbling thunder or a purring cat) and 'pika-pika' (sparkling).",
  "Japan is referred to as Nihon (日本), which translates literally to 'the origin of the sun', hence the 'Land of the Rising Sun'."
];

export default function LoadingScreen() {
  const [factIndex, setFactIndex] = useState(0);
  const [fade, setFade] = useState(true);
  
  useEffect(() => {
    const timer = setInterval(() => {
      // Fade out
      setFade(false);
      setTimeout(() => {
        setFactIndex(prev => (prev + 1) % facts.length);
        // Fade in
        setFade(true);
      }, 250); // Match transition duration
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#141413] flex items-center justify-center text-[#f2f0ea] select-none p-6">
      <div className="max-w-xl w-full flex flex-col items-center text-center space-y-8 animate-fade-in">
        
        {/* Custom Turning Loading Wheel */}
        <div className="relative flex items-center justify-center">
          {/* Spinning background tracks */}
          <div className="w-20 h-20 rounded-full border-4 border-[#e06847]/15 border-t-[#e06847] animate-spin" />
          
          {/* Centered logo container */}
          <div className="absolute w-12 h-12 rounded-full bg-[#1e1e1c] border border-[#2d2d2a] flex items-center justify-center text-lg font-bold text-[#e06847] shadow-sm">
            書
          </div>
        </div>
        
        {/* Interactive skeletal facts panel */}
        <div className="border border-[#2d2d2a] rounded-3xl p-6 md:p-8 w-full shadow-2xl bg-[#1e1e1c] flex flex-col gap-4 min-h-[160px] justify-center relative overflow-hidden">
          {/* Decorative soft gradient border */}
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#e06847]/40 to-transparent" />
          
          <div className="flex items-center justify-center gap-2 text-[10px] font-extrabold uppercase tracking-widest text-[#e06847] select-none">
            <span>💡</span>
            <span className="claude-serif">Did you know? / 日本語の豆知識</span>
          </div>
          
          <p className={`text-xs md:text-sm text-[#92918b] leading-relaxed max-w-md mx-auto italic transition-all duration-300 ${
            fade ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-2'
          }`}>
            "{facts[factIndex]}"
          </p>
        </div>
        
        {/* Loading status indicator */}
        <div className="space-y-2">
          <div className="text-[10px] font-extrabold text-[#92918b] tracking-widest uppercase">
            Connecting to Supabase Database
          </div>
          <div className="h-1.5 w-32 bg-[#1c1c1a] border border-[#2d2d2a] rounded-full overflow-hidden mx-auto">
            <div className="h-full bg-[#e06847] rounded-full w-2/3 animate-[pulse-subtle_1.5s_infinite_ease-in-out]" />
          </div>
        </div>

      </div>
    </div>
  );
}
