import { useState } from 'react';

const regionsList = [
  { id: 'liyue', name: 'Liyue', icon: '🔶', bg: '#f9f8f6', accent: '#cc5a37' },
  { id: 'mondstadt', name: 'Mondstadt', icon: '🍃', bg: '#f4faf9', accent: '#0ea5e9' },
  { id: 'inazuma', name: 'Inazuma', icon: '⚡', bg: '#faf5ff', accent: '#a855f7' },
  { id: 'sumeru', name: 'Sumeru', icon: '🌿', bg: '#f0fdf4', accent: '#22c55e' },
  { id: 'fontaine', name: 'Fontaine', icon: '🌊', bg: '#f0f9ff', accent: '#0284c7' },
  { id: 'natlan', name: 'Natlan', icon: '🔥', bg: '#fff7ed', accent: '#f97316' },
  { id: 'snezhnaya', name: 'Snezhnaya', icon: '❄️', bg: '#f0fdfa', accent: '#0d9488' },
  { id: 'khaenriah', name: 'Khaenri\'ah', icon: '⚙️', bg: '#fbfaf7', accent: '#ca8a04' },
  { id: 'abyss', name: 'Abyss', icon: '🔮', bg: '#fdf4ff', accent: '#d946ef' }
];

const presetAvatars = [
  // Original Dicebear Chibis
  { id: 'luna', name: 'Chibi Luna', seed: 'Luna', style: 'adventurer' },
  { id: 'zoe', name: 'Chibi Zoe', seed: 'Zoe', style: 'adventurer' },
  { id: 'felix', name: 'Chibi Felix', seed: 'Felix', style: 'adventurer' },
  { id: 'oliver', name: 'Chibi Oliver', seed: 'Oliver', style: 'adventurer' },
  { id: 'gamer', name: 'Gamer Chibi', seed: 'Gamer', style: 'adventurer' },
  { id: 'bella', name: 'Chibi Bella', seed: 'Bella', style: 'adventurer' },
  
  // Original Dicebear Anime
  { id: 'sakura', name: 'Anime Sakura', seed: 'Sakura', style: 'lorelei' },
  { id: 'miku', name: 'Anime Miku', seed: 'Miku', style: 'lorelei' },
  { id: 'ren', name: 'Anime Ren', seed: 'Ren', style: 'lorelei' },
  { id: 'haru', name: 'Anime Haru', seed: 'Haru', style: 'lorelei' },
  { id: 'fox', name: 'Fox Girl', seed: 'Fox', style: 'lorelei' },
  { id: 'neko', name: 'Neko Maid', seed: 'Neko', style: 'lorelei' },

  // Sourced Genshin Chibi Emojis
  { id: 'genshin_zhongli', name: 'Zhongli Chibi', seed: 'zhongli', style: 'local' },
  { id: 'genshin_raiden', name: 'Raiden Chibi', seed: 'raiden', style: 'local' },
  { id: 'genshin_nahida', name: 'Nahida Chibi', seed: 'nahida', style: 'local' },
  { id: 'genshin_venti', name: 'Venti Chibi', seed: 'venti', style: 'local' },
  { id: 'genshin_furina', name: 'Furina Chibi', seed: 'furina', style: 'local' },
  { id: 'genshin_paimon', name: 'Paimon Chibi', seed: 'paimon', style: 'local' },
  { id: 'genshin_hu_tao', name: 'Hu Tao Chibi', seed: 'hu_tao', style: 'local' }
];

const getAvatarUrl = (style, seed) => {
  if (style === 'local') {
    return `/avatars/${seed}.png`;
  }
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}`;
};

const calculateLevelInfo = (totalCorrect) => {
  const xp = (totalCorrect || 0) * 10;
  let level = 1;
  let xpForNextLevel = 100;
  let accumulatedXp = 0;
  
  while (xp >= accumulatedXp + xpForNextLevel) {
    accumulatedXp += xpForNextLevel;
    level += 1;
    xpForNextLevel = level * 100;
  }
  
  const xpInCurrentLevel = xp - accumulatedXp;
  const progressPercent = Math.min(100, Math.floor((xpInCurrentLevel / xpForNextLevel) * 100));
  
  return {
    level,
    xp,
    xpInCurrentLevel,
    xpForNextLevel,
    progressPercent
  };
};

const DashboardIcon = ({ accent, className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <rect x="3" y="3" width="7" height="9" rx="1.5" fill={accent} fillOpacity={0.18} stroke={accent} strokeWidth={1.5} />
    <rect x="14" y="3" width="7" height="5" rx="1.5" stroke="currentColor" />
    <rect x="3" y="16" width="7" height="5" rx="1.5" stroke="currentColor" />
    <rect x="14" y="12" width="7" height="9" rx="1.5" fill={accent} fillOpacity={0.18} stroke={accent} strokeWidth={1.5} />
  </svg>
);

const QuizIcon = ({ accent, className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <rect x="3" y="4" width="18" height="16" rx="2.5" stroke="currentColor" />
    <line x1="7" y1="9" x2="17" y2="9" stroke={accent} strokeWidth={2.5} strokeLinecap="round" />
    <line x1="7" y1="14" x2="13" y2="14" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
    <path d="M16 13l1.5 2h-3z" fill={accent} stroke={accent} strokeWidth={1} />
  </svg>
);

const StudyIcon = ({ accent, className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    <path d="M12 6v8l2.5-1.5L17 14V6" fill={accent} fillOpacity={0.25} stroke={accent} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const KanaIcon = ({ accent, className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" />
    <line x1="12" y1="4" x2="12" y2="20" stroke={accent} strokeWidth={1} strokeDasharray="3 3" />
    <line x1="4" y1="12" x2="20" y2="12" stroke={accent} strokeWidth={1} strokeDasharray="3 3" />
    <path d="M8 8c4-1 6 2 8 6" stroke={accent} strokeWidth={2.5} strokeLinecap="round" />
  </svg>
);

const VocabIcon = ({ accent, className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    <path d="M14 3v4a1 1 0 001 1h4" stroke="currentColor" />
    <rect x="7" y="7" width="3" height="3" rx="0.5" fill={accent} fillOpacity={0.3} stroke={accent} strokeWidth={1.2} />
  </svg>
);

const ToriiGateLogo = ({ className = "w-6 h-6", ...props }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
    {/* Top curved lintel (Kasagi) */}
    <path d="M2 5 Q12 7.5 22 5 L22 7 Q12 9.5 2 7 Z" />
    {/* Second horizontal beam (Nuki) */}
    <path d="M4 11 H20 V12.5 H4 Z" />
    {/* Center strut (Gakuzuka) */}
    <rect x="11" y="8" width="2" height="3" />
    {/* Left Pillar (Hashira) */}
    <path d="M7.5 8 L6.2 21 H8.3 L9.6 8 Z" />
    {/* Right Pillar (Hashira) */}
    <path d="M16.5 8 L17.8 21 H15.7 L14.4 8 Z" />
    {/* Base plates (Daiishi) */}
    <rect x="5.7" y="20" width="3.1" height="1.2" rx="0.3" />
    <rect x="15.2" y="20" width="3.1" height="1.2" rx="0.3" />
  </svg>
);

const getNavIcon = (id, accent, isActive) => {
  const className = `w-5 h-5 transition-all duration-300 shrink-0 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`;
  switch (id) {
    case 'dashboard':
      return <DashboardIcon accent={accent} className={className} />;
    case 'quiz':
      return <QuizIcon accent={accent} className={className} />;
    case 'study':
      return <StudyIcon accent={accent} className={className} />;
    case 'kana':
      return <KanaIcon accent={accent} className={className} />;
    case 'vocab':
      return <VocabIcon accent={accent} className={className} />;
    default:
      return null;
  }
};

export default function Navbar({ activeTab, setActiveTab, hasCards, themeRegion, themeMode, onChangeTheme, profile, onUpdateProfile, bgMusicEnabled, onToggleMusic, onSignOut, userEmail, stats }) {
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [showAllThemes, setShowAllThemes] = useState(false);
  
  const { level, xp, xpInCurrentLevel, xpForNextLevel, progressPercent } = calculateLevelInfo(stats?.totalCorrect || 0);

  const getTop3Regions = () => {
    const defaultTop = ['liyue', 'mondstadt', 'inazuma'];
    try {
      const savedCounts = localStorage.getItem('theme_selection_counts');
      if (savedCounts) {
        const counts = JSON.parse(savedCounts);
        const sorted = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
        const validSorted = sorted.filter(id => regionsList.some(r => r.id === id));
        const merged = Array.from(new Set([...validSorted, ...defaultTop]));
        return merged.slice(0, 3);
      }
    } catch {
      // ignore
    }
    return defaultTop;
  };

  const getOrderedRegions = () => {
    const top3 = getTop3Regions();
    let orderedIds = [...top3];
    if (!orderedIds.includes(themeRegion)) {
      orderedIds = [top3[0], top3[1], themeRegion];
    }
    const remainingIds = regionsList
      .map(r => r.id)
      .filter(id => !orderedIds.includes(id));
    const finalIds = [...orderedIds, ...remainingIds];
    return finalIds.map(id => regionsList.find(r => r.id === id));
  };

  const handleRegionChange = (regionId) => {
    try {
      const savedCounts = localStorage.getItem('theme_selection_counts');
      const counts = savedCounts ? JSON.parse(savedCounts) : {};
      counts[regionId] = (counts[regionId] || 0) + 1;
      localStorage.setItem('theme_selection_counts', JSON.stringify(counts));
    } catch (e) {
      console.error(e);
    }
    onChangeTheme(regionId, themeMode);
  };

  const handleModeToggle = () => {
    const nextMode = themeMode === 'light' ? 'dark' : 'light';
    onChangeTheme(themeRegion, nextMode);
  };

  const currentRegion = regionsList.find(r => r.id === themeRegion) || regionsList[0];

  // Profile modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempName, setTempName] = useState(profile?.name || 'Luna-chan');
  const [tempTitle, setTempTitle] = useState(profile?.title || 'Chibi Student');
  const [tempAvatar, setTempAvatar] = useState({ 
    seed: profile?.avatarSeed || 'Luna', 
    style: profile?.avatarStyle || 'adventurer' 
  });

  const handleOpenModal = () => {
    setTempName(profile?.name || 'Luna-chan');
    setTempTitle(profile?.title || 'Chibi Student');
    setTempAvatar({ 
      seed: profile?.avatarSeed || 'Luna', 
      style: profile?.avatarStyle || 'adventurer' 
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    const sanitize = (text) => text.replace(/<[^>]*>/g, '').trim();
    const cleanName = sanitize(tempName) || 'Luna-chan';
    const cleanTitle = sanitize(tempTitle) || 'Chibi Student';

    onUpdateProfile({
      name: cleanName,
      title: cleanTitle,
      avatarSeed: tempAvatar.seed,
      avatarStyle: tempAvatar.style
    });
    setIsModalOpen(false);
  };

  const navItems = [
    { id: 'dashboard', name: 'Dashboard' },
    { id: 'quiz', name: 'Study Arena', disabled: !hasCards },
    { id: 'study', name: 'Study Guide' },
    { id: 'kana', name: 'Kana Board' },
    { id: 'vocab', name: 'Library Manager' },
  ];

  return (
    <>
      {/* Mobile Top Header Banner */}
      <div className="md:hidden w-full bg-claude-sidebar border-b border-claude-border px-4 py-3.5 flex justify-between items-center z-40 select-none">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-claude-coral/10 border border-claude-coral/25 flex items-center justify-center text-claude-coral shrink-0 shadow-inner">
            <ToriiGateLogo className="w-5 h-5" />
          </div>
          <div>
            <span className="text-sm font-extrabold tracking-tight text-claude-text-heading claude-serif">
              Sapair's
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Mobile Profile Trigger Button */}
          <div className="relative select-none">
            <button
              onClick={handleOpenModal}
              className="w-8 h-8 rounded-full bg-claude-coral/10 flex items-center justify-center border border-claude-border overflow-hidden cursor-pointer active:scale-95 transition-transform"
              title="Edit Profile"
            >
              <img 
                src={getAvatarUrl(profile.avatarStyle, profile.avatarSeed)} 
                className="w-7 h-7 scale-110 object-contain" 
                alt="Avatar" 
              />
            </button>
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-400 border border-claude-card flex items-center justify-center text-[7px] font-black text-slate-900 shadow-xs" title={`Level ${level}`}>
              {level}
            </div>
          </div>

          {/* Background Music Toggle */}
          <button
            onClick={onToggleMusic}
            className="px-2.5 h-8 rounded-lg bg-claude-card hover:bg-claude-sidebar border border-claude-border flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
            title={bgMusicEnabled ? "Mute Background Music" : "Play Background Music"}
          >
            <span className="text-xs">{bgMusicEnabled ? '🔊' : '🔇'}</span>
            <div className={`equalizer-container ${bgMusicEnabled ? 'equalizer-active' : 'equalizer-static'}`}>
              <div className="equalizer-bar equalizer-bar-1" />
              <div className="equalizer-bar equalizer-bar-2" />
              <div className="equalizer-bar equalizer-bar-3" />
              <div className="equalizer-bar equalizer-bar-4" />
            </div>
          </button>


          {/* Theme Selector */}
          <div className="relative">
            <button
              onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
              className="px-2.5 py-1.5 rounded-lg bg-claude-card hover:bg-claude-sidebar border border-claude-border flex items-center gap-1.5 text-xs font-bold text-claude-text-heading transition-colors cursor-pointer"
              title="Switch theme"
            >
              <span className="select-none">{currentRegion.icon}</span>
              <span className="capitalize">{currentRegion.name} ({themeMode === 'light' ? 'L' : 'D'})</span>
              <span className="text-[9px] opacity-60">▼</span>
            </button>
            
            {themeDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40 bg-transparent" 
                  onClick={() => setThemeDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-1.5 w-52 rounded-2xl bg-claude-card border border-claude-border shadow-xl p-2.5 z-50 animate-fade-in flex flex-col gap-2">
                  {/* Light/Dark Toggle Row */}
                  <div className="flex items-center justify-between border-b border-claude-border/50 pb-2 mb-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-claude-text-muted">Mode</span>
                    <button
                      onClick={handleModeToggle}
                      className="px-2.5 py-1 rounded-lg bg-claude-sidebar hover:bg-claude-border text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-inner"
                    >
                      {themeMode === 'light' ? '☀️ Light' : '🌙 Dark'}
                    </button>
                  </div>
                  {/* Regions Grid */}
                  <div className="overflow-hidden">
                    <div 
                      className="grid grid-cols-3 gap-1 transition-all duration-300 ease-in-out"
                      style={{ 
                        maxHeight: showAllThemes ? '140px' : '46px' 
                      }}
                    >
                      {getOrderedRegions().map((r, index) => {
                        const isRemaining = index >= 3;
                        return (
                          <button
                            key={r.id}
                            tabIndex={showAllThemes || !isRemaining ? 0 : -1}
                            onClick={() => {
                              handleRegionChange(r.id);
                              setThemeDropdownOpen(false);
                            }}
                            className={`p-1.5 rounded-lg border text-center flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                              themeRegion === r.id
                                ? 'bg-claude-sidebar border-claude-coral text-claude-coral'
                                : 'bg-claude-card border-transparent text-claude-text-muted hover:text-claude-text-heading hover:bg-claude-sidebar/30'
                            } ${isRemaining ? 'transition-opacity duration-300' : 'duration-200'}`}
                            style={{
                              opacity: showAllThemes || !isRemaining ? 1 : 0,
                              pointerEvents: showAllThemes || !isRemaining ? 'auto' : 'none'
                            }}
                            title={r.name}
                          >
                            <span className="text-sm select-none">{r.icon}</span>
                            <span className="text-[8px] font-bold truncate w-full">{r.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  {/* Toggle Show All Themes Button for Mobile */}
                  <button
                    onClick={() => setShowAllThemes(!showAllThemes)}
                    className="w-full py-1 text-[8px] font-bold text-claude-coral bg-claude-coral/5 hover:bg-claude-coral/10 border border-claude-coral/20 rounded-md transition-colors cursor-pointer text-center"
                  >
                    {showAllThemes ? '▲ Hide Themes' : '▼ More Themes'}
                  </button>
                </div>
              </>
            )}
          </div>
      </div>
    </div>

      {/* Desktop Left Sidebar */}
      <aside className="hidden md:flex w-64 h-screen sticky top-0 bg-claude-sidebar border-r border-claude-border flex-col justify-between py-8 px-5 z-40 select-none">
        <div className="space-y-8">
          {/* Logo Brand */}
          <div 
            className="flex items-center gap-3 px-2 cursor-pointer group"
            onClick={() => setActiveTab('dashboard')}
          >
            <div className="w-10 h-10 rounded-xl bg-claude-coral/10 border border-claude-coral/25 flex items-center justify-center text-claude-coral shrink-0 shadow-inner transition-transform group-hover:scale-105">
              <ToriiGateLogo className="w-6 h-6" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-claude-text-heading block claude-serif">
                Sapair's
              </span>
              <span className="text-[9px] block text-claude-coral font-bold tracking-widest uppercase -mt-1">
                JAPANESE SRS
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                disabled={item.disabled}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-xs font-bold transition-all duration-200 border ${
                  item.disabled 
                    ? 'opacity-25 cursor-not-allowed text-slate-500 border-transparent' 
                    : activeTab === item.id
                      ? 'bg-claude-card text-claude-coral border-claude-border shadow-sm'
                      : 'text-claude-text-muted hover:text-claude-text-heading border-transparent hover:bg-claude-card/50'
                }`}
              >
                <span>{getNavIcon(item.id, currentRegion.accent, activeTab === item.id)}</span>
                <span>{item.name}</span>
                {item.id === 'quiz' && hasCards && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-claude-coral animate-ping"></span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Footer Area: User Profile Mockup & Theme Switcher */}
        <div className="space-y-4 pt-4 border-t border-claude-border">
          {/* Theme Switcher Widget */}
          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-claude-text-muted">
                App Theme
              </span>
              <span className="text-[9px] font-bold text-claude-coral bg-claude-coral/10 px-1.5 py-0.5 rounded capitalize">
                {currentRegion.name} ({themeMode})
              </span>
            </div>
            
            {/* Theme Toggle Music & Mode Buttons */}
            <div className="flex gap-2">
              <button
                onClick={onToggleMusic}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 select-none border border-claude-border/40 hover:border-claude-coral/50 bg-claude-card/50 hover:bg-claude-card rounded-lg transition-all cursor-pointer"
                title={bgMusicEnabled ? "Mute Background Music" : "Play Background Music"}
              >
                <span className="text-xs">{bgMusicEnabled ? '🔊' : '🔇'}</span>
                <div className={`equalizer-container ${bgMusicEnabled ? 'equalizer-active' : 'equalizer-static'}`}>
                  <div className="equalizer-bar equalizer-bar-1" />
                  <div className="equalizer-bar equalizer-bar-2" />
                  <div className="equalizer-bar equalizer-bar-3" />
                  <div className="equalizer-bar equalizer-bar-4" />
                </div>
              </button>
              <button
                onClick={handleModeToggle}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 border border-claude-border/40 hover:border-claude-coral/50 bg-claude-card/50 hover:bg-claude-card rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                title={themeMode === 'light' ? "Switch to Dark Mode" : "Switch to Light Mode"}
              >
                {themeMode === 'light' ? '☀️ Light' : '🌙 Dark'}
              </button>
            </div>
            
            {/* Grid of Regions */}
            <div className="p-1.5 bg-claude-card/40 rounded-xl border border-claude-border overflow-hidden">
              <div 
                className="grid grid-cols-3 gap-1.5 transition-all duration-300 ease-in-out"
                style={{ 
                  maxHeight: showAllThemes ? '226px' : '76px'
                }}
              >
                {getOrderedRegions().map((r, index) => {
                  const isRemaining = index >= 3;
                  return (
                    <button
                      key={r.id}
                      tabIndex={showAllThemes || !isRemaining ? 0 : -1}
                      onClick={() => handleRegionChange(r.id)}
                      className={`relative p-2 aspect-square rounded-lg flex flex-col items-center justify-between border cursor-pointer ${
                        themeRegion === r.id
                          ? 'bg-claude-card border-claude-coral shadow-sm scale-[1.03]'
                          : 'bg-claude-card/60 hover:bg-claude-card border-transparent hover:border-claude-border/60 hover:scale-[1.01]'
                      } ${isRemaining ? 'transition-opacity duration-300' : 'transition-all duration-300'}`}
                      style={{
                        opacity: showAllThemes || !isRemaining ? 1 : 0,
                        pointerEvents: showAllThemes || !isRemaining ? 'auto' : 'none'
                      }}
                      title={r.name}
                    >
                      <span className="text-base select-none">{r.icon}</span>
                      <span className="text-[8px] font-extrabold truncate w-full text-center text-claude-text-muted">
                        {r.name}
                      </span>
                      
                      {/* Color dots preview */}
                      <div className="flex gap-0.5 mt-0.5">
                        <span 
                          className="w-1.5 h-1.5 rounded-full border border-claude-border/20" 
                          style={{ backgroundColor: r.bg }} 
                        />
                        <span 
                          className="w-1.5 h-1.5 rounded-full" 
                          style={{ backgroundColor: r.accent }} 
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Toggle Show All Themes Button */}
            <button
              onClick={() => setShowAllThemes(!showAllThemes)}
              className="w-full py-1 text-[9px] font-bold text-claude-coral bg-claude-coral/5 hover:bg-claude-coral/10 border border-claude-coral/20 hover:border-claude-coral/30 rounded-lg transition-colors cursor-pointer text-center"
            >
              {showAllThemes ? '▲ Hide Themes' : '▼ More Themes'}
            </button>
          </div>

          {/* Clickable User profile mockup with cute anime chibi avatar sticker */}
          <div 
            onClick={handleOpenModal}
            className="flex items-center gap-2.5 p-2 bg-claude-card/25 hover:bg-claude-card/75 rounded-xl border border-claude-border/50 hover:border-claude-coral/70 transition-all cursor-pointer group"
            title="Edit profile details"
          >
            <div className="relative shrink-0 select-none">
              <div className="w-8 h-8 rounded-full bg-claude-coral/10 flex items-center justify-center border border-claude-border overflow-hidden relative">
                <img 
                  src={getAvatarUrl(profile.avatarStyle, profile.avatarSeed)} 
                  className="w-7 h-7 scale-115 object-contain group-hover:scale-125 transition-transform" 
                  alt="Chibi avatar student" 
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[8px] text-white font-bold transition-opacity">
                  Edit
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-amber-400 border-2 border-claude-card flex items-center justify-center text-[7px] font-black text-slate-900 shadow-xs" title={`Level ${level}`}>
                {level}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold text-claude-text-heading block truncate group-hover:text-claude-coral transition-colors">
                {profile.name}
              </span>
              <span className="text-[9px] text-claude-text-muted block truncate -mt-0.5">
                {profile.title}
              </span>
              {/* XP Progress Bar */}
              <div className="mt-1 space-y-0.5">
                <div className="flex justify-between text-[7px] font-black uppercase text-claude-text-muted/80">
                  <span>{xpInCurrentLevel}/{xpForNextLevel} XP</span>
                </div>
                <div className="w-full h-1 bg-claude-border rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-400 to-claude-coral rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
            <span className="text-[10px] text-claude-text-muted opacity-0 group-hover:opacity-60 transition-opacity">
              ⚙️
            </span>
          </div>
          
          <button 
            onClick={onSignOut}
            className="w-full flex items-center justify-center gap-1.5 py-2 mt-2 border border-dashed border-red-500/20 hover:border-red-500/40 bg-red-600/5 hover:bg-red-600/10 text-red-600 font-extrabold rounded-xl transition-all text-[10px] cursor-pointer"
            title={`Logged in as ${userEmail}`}
          >
            <span>🚪</span>
            <span className="truncate">Sign Out ({userEmail})</span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-claude-sidebar border-t border-claude-border flex justify-around items-center z-50 shadow-lg">
        {navItems.map((item) => (
          <button
            key={item.id}
            disabled={item.disabled}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center w-20 h-full gap-0.5 text-[10px] font-bold transition-all ${
              item.disabled
                ? 'opacity-20 cursor-not-allowed text-slate-500'
                : activeTab === item.id
                  ? 'text-claude-coral scale-105'
                  : 'text-claude-text-muted hover:text-claude-text'
            }`}
          >
            <span>{getNavIcon(item.id, currentRegion.accent, activeTab === item.id)}</span>
            <span>{item.name}</span>
          </button>
        ))}
      </nav>

      {/* Profile Edit Modal overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[100] flex items-center justify-center p-4 animate-fade-in">
          {/* Backdrop click away */}
          <div className="absolute inset-0" onClick={() => setIsModalOpen(false)} />
          
          <div className="claude-panel w-full max-w-sm rounded-2xl p-6 relative z-10 flex flex-col gap-4 animate-fade-in shadow-2xl">
            <div className="flex justify-between items-center border-b border-claude-border pb-2.5">
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-claude-text-heading claude-serif">
                Edit Student Profile
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-claude-text-muted hover:text-claude-text-heading text-xs font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Profile Form */}
            <div className="space-y-4">
              {/* Name input */}
              <div className="space-y-1">
                <label className="text-[9px] font-extrabold text-claude-text-muted uppercase tracking-widest block">
                  Student Username
                </label>
                <input 
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="w-full bg-claude-sidebar border border-claude-border rounded-xl px-3.5 py-2 text-xs font-bold text-claude-text-heading focus:outline-none focus:border-claude-coral transition-colors"
                  maxLength={18}
                  placeholder="Enter nickname..."
                />
              </div>

              {/* Title/Role input */}
              <div className="space-y-1">
                <label className="text-[9px] font-extrabold text-claude-text-muted uppercase tracking-widest block">
                  Custom Title
                </label>
                <input 
                  type="text"
                  value={tempTitle}
                  onChange={(e) => setTempTitle(e.target.value)}
                  className="w-full bg-claude-sidebar border border-claude-border rounded-xl px-3.5 py-2 text-xs font-bold text-claude-text-heading focus:outline-none focus:border-claude-coral transition-colors"
                  maxLength={22}
                  placeholder="e.g. Chibi Student..."
                />
              </div>

              {/* Avatar Preset Grid */}
              <div className="space-y-1">
                <label className="text-[9px] font-extrabold text-claude-text-muted uppercase tracking-widest block">
                  Select Chibi & Anime Avatar
                </label>
                <div className="grid grid-cols-4 gap-2 pt-1 max-h-40 overflow-y-auto pr-1">
                  {presetAvatars.map((preset) => {
                    const avatarUrl = getAvatarUrl(preset.style, preset.seed);
                    const isSelected = tempAvatar.seed === preset.seed && tempAvatar.style === preset.style;
                    
                    return (
                      <button
                        key={preset.id}
                        onClick={() => setTempAvatar({ seed: preset.seed, style: preset.style })}
                        className={`relative aspect-square rounded-xl border flex items-center justify-center p-1 transition-all cursor-pointer overflow-hidden ${
                          isSelected 
                            ? 'bg-claude-sidebar border-claude-coral ring-2 ring-claude-coral/20' 
                            : 'bg-claude-card hover:bg-claude-sidebar border-claude-border/80'
                        }`}
                        title={preset.name}
                      >
                        <img src={avatarUrl} alt={preset.name} className="w-8 h-8 object-contain scale-115" />
                        {isSelected && (
                          <span className="absolute bottom-0 right-0 bg-claude-coral text-white w-3 h-3 rounded-tl-lg flex items-center justify-center text-[7px] font-black select-none">
                            ✓
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Save Buttons */}
            <div className="flex gap-2.5 pt-2 border-t border-claude-border">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-2 border border-claude-border hover:bg-claude-sidebar rounded-xl text-[10px] font-bold text-claude-text-muted transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-2 bg-claude-coral hover:bg-claude-coral/90 text-white rounded-xl text-[10px] font-extrabold transition-colors cursor-pointer"
              >
                Save Changes
              </button>
            </div>

            {/* Sign Out Option inside modal */}
            <div className="pt-2.5 border-t border-claude-border/50 flex flex-col gap-2">
              <div className="text-[8px] font-bold text-claude-text-muted text-center truncate">
                Authenticated as: <span className="text-claude-text-heading">{userEmail}</span>
              </div>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  onSignOut();
                }}
                className="w-full py-2 bg-red-600/5 hover:bg-red-600/10 text-red-600 border border-red-500/20 hover:border-red-500/40 rounded-xl text-[10px] font-black transition-all cursor-pointer text-center"
              >
                🚪 Sign Out
              </button>
            </div>


          </div>
        </div>
      )}
    </>
  );
}
