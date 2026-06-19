import { useState } from 'react';

const regionsList = [
  { id: 'liyue', name: 'Liyue', icon: '🔶', bg: '#f9f8f6', accent: '#cc5a37' },
  { id: 'mondstadt', name: 'Mondstadt', icon: '🍃', bg: '#f4faf9', accent: '#0ea5e9' },
  { id: 'inazuma', name: 'Inazuma', icon: '⚡', bg: '#faf5ff', accent: '#a855f7' },
  { id: 'sumeru', name: 'Sumeru', icon: '🌿', bg: '#ffffff', accent: '#1db954' },
  { id: 'fontaine', name: 'Fontaine', icon: '🌊', bg: '#f0f9ff', accent: '#0284c7' },
  { id: 'natlan', name: 'Natlan', icon: '🔥', bg: '#fff7ed', accent: '#f97316' },
  { id: 'snezhnaya', name: 'Snezhnaya', icon: '❄️', bg: '#f0fdfa', accent: '#0d9488' },
  { id: 'khaenriah', name: 'Khaenri\'ah', icon: '⚙️', bg: '#fbfaf7', accent: '#ca8a04' },
  { id: 'abyss', name: 'Abyss', icon: '🔮', bg: '#fdf4ff', accent: '#d946ef' }
];

const presetAvatars = [
  { id: 'luna', name: 'Chibi Luna', seed: 'Luna', style: 'adventurer' },
  { id: 'zoe', name: 'Chibi Zoe', seed: 'Zoe', style: 'adventurer' },
  { id: 'felix', name: 'Chibi Felix', seed: 'Felix', style: 'adventurer' },
  { id: 'oliver', name: 'Chibi Oliver', seed: 'Oliver', style: 'adventurer' },
  { id: 'gamer', name: 'Gamer Chibi', seed: 'Gamer', style: 'adventurer' },
  { id: 'bella', name: 'Chibi Bella', seed: 'Bella', style: 'adventurer' },
  { id: 'sakura', name: 'Anime Sakura', seed: 'Sakura', style: 'lorelei' },
  { id: 'miku', name: 'Anime Miku', seed: 'Miku', style: 'lorelei' },
  { id: 'ren', name: 'Anime Ren', seed: 'Ren', style: 'lorelei' },
  { id: 'haru', name: 'Anime Haru', seed: 'Haru', style: 'lorelei' },
  { id: 'fox', name: 'Fox Girl', seed: 'Fox', style: 'lorelei' },
  { id: 'neko', name: 'Neko Maid', seed: 'Neko', style: 'lorelei' },
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

const ToriiGateLogo = ({ className = "w-6 h-6", ...props }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
    <path d="M2 5 Q12 7.5 22 5 L22 7 Q12 9.5 2 7 Z" />
    <path d="M4 11 H20 V12.5 H4 Z" />
    <rect x="11" y="8" width="2" height="3" />
    <path d="M7.5 8 L6.2 21 H8.3 L9.6 8 Z" />
    <path d="M16.5 8 L17.8 21 H15.7 L14.4 8 Z" />
    <rect x="5.7" y="20" width="3.1" height="1.2" rx="0.3" />
    <rect x="15.2" y="20" width="3.1" height="1.2" rx="0.3" />
  </svg>
);

export default function Navbar({
  activeTab,
  setActiveTab,
  hasCards,
  vocabList = [],
  onStartSession,
  themeRegion,
  themeMode,
  onChangeTheme,
  profile,
  onUpdateProfile,
  bgMusicEnabled,
  onToggleMusic,
  onSignOut,
  userEmail,
  stats,
  furiganaMode,
  onChangeFuriganaMode,
  isAdmin
}) {
  const [settingsDropdownOpen, setSettingsDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempName, setTempName] = useState(profile?.name || 'Learner');
  const [tempTitle, setTempTitle] = useState(profile?.title || 'Chibi Student');
  const [tempAvatar, setTempAvatar] = useState({
    seed: profile?.avatarSeed || 'Luna',
    style: profile?.avatarStyle || 'adventurer'
  });

  const { level } = calculateLevelInfo(stats?.totalCorrect || 0);

  const handleOpenModal = () => {
    setTempName(profile?.name || 'Learner');
    setTempTitle(profile?.title || 'Chibi Student');
    setTempAvatar({
      seed: profile?.avatarSeed || 'Luna',
      style: profile?.avatarStyle || 'adventurer'
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    const cleanName = tempName.replace(/<[^>]*>/g, '').trim() || 'Learner';
    const cleanTitle = tempTitle.replace(/<[^>]*>/g, '').trim() || 'Chibi Student';
    onUpdateProfile({
      name: cleanName,
      title: cleanTitle,
      avatarSeed: tempAvatar.seed,
      avatarStyle: tempAvatar.style
    });
    setIsModalOpen(false);
  };

  const handleModeToggle = () => {
    const nextMode = themeMode === 'light' ? 'dark' : 'light';
    onChangeTheme(themeRegion, nextMode);
  };

  const handleRegionChange = (regionId) => {
    onChangeTheme(regionId, themeMode);
  };

  // Lessons/Reviews count calculations
  const now = new Date();
  const dueReviewsCount = vocabList ? vocabList.filter(c => c.nextReview && new Date(c.nextReview) <= now).length : 0;
  const lessonsCount = vocabList ? vocabList.filter(c => !c.nextReview).length : 0;

  const navItems = [
    { id: 'dashboard', name: 'Dashboard' },
    { id: 'kanji', name: 'Kanji Dojo' },
    { id: 'kana', name: 'Kana Board' },
    { id: 'grammar', name: 'Grammar Dojo' },
    { id: 'study', name: 'Study Guide' },
    ...(isAdmin ? [{ id: 'vocab', name: 'Library Manager' }] : []),
  ];

  return (
    <>
      {/* Top sticky WaniKani horizontal Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-claude-sidebar border-b border-claude-border z-50 flex items-center justify-between px-4 md:px-8 select-none shadow-xs">
        
        {/* Left: Branding */}
        <div 
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-2.5 cursor-pointer hover:scale-[1.01] transition-transform"
        >
          <div className="w-8 h-8 rounded-lg bg-claude-coral/10 border border-claude-coral/25 text-claude-coral flex items-center justify-center shadow-xs shrink-0">
            <ToriiGateLogo className="w-5 h-5" />
          </div>
          <div>
            <span className="text-sm font-black tracking-tight text-claude-text-heading uppercase font-serif">
              Kyōto-Slate
            </span>
          </div>
        </div>

        {/* Center: Lessons & Reviews Badges */}
        <div className="flex items-center gap-3">
          {/* Lessons Badge */}
          <button 
            onClick={() => onStartSession(null, false, true)}
            disabled={lessonsCount === 0}
            className="flex items-center rounded-lg overflow-hidden border border-claude-border bg-claude-card hover:scale-[1.02] transition-transform select-none cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed shadow-xs"
            title="Start Lessons"
          >
            <span className={`${lessonsCount > 0 ? 'bg-sky-500' : 'bg-claude-border'} text-white font-extrabold px-3 py-1 text-xs`}>
              {lessonsCount}
            </span>
            <span className="text-claude-text-muted font-extrabold px-2.5 py-1 text-[10px] uppercase tracking-wider">
              Lessons
            </span>
          </button>

          {/* Reviews Badge */}
          <button 
            onClick={() => onStartSession(null, true, false)}
            disabled={dueReviewsCount === 0}
            className="flex items-center rounded-lg overflow-hidden border border-claude-border bg-claude-card hover:scale-[1.02] transition-transform select-none cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed shadow-xs"
            title="Start Reviews"
          >
            <span className={`${dueReviewsCount > 0 ? 'bg-claude-coral' : 'bg-claude-border'} text-white font-extrabold px-3 py-1 text-xs`}>
              {dueReviewsCount}
            </span>
            <span className="text-claude-text-muted font-extrabold px-2.5 py-1 text-[10px] uppercase tracking-wider">
              Reviews
            </span>
          </button>
        </div>

        {/* Right: Links & Settings */}
        <div className="flex items-center gap-4">
          
          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-5 text-xs font-black text-claude-text-muted">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`hover:text-claude-text-heading transition-colors cursor-pointer ${
                  activeTab === item.id ? 'text-claude-coral font-black border-b-2 border-claude-coral pb-1 mt-1' : 'pb-1'
                }`}
              >
                {item.name}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2 border-l border-claude-border pl-4">
            
            {/* Quick settings dropdown toggler */}
            <div className="relative">
              <button
                onClick={() => setSettingsDropdownOpen(!settingsDropdownOpen)}
                className="w-8 h-8 rounded-xl bg-claude-bg hover:bg-claude-border/50 flex items-center justify-center text-xs text-claude-text-muted hover:text-claude-text-heading cursor-pointer shadow-xs"
                title="Settings & Themes"
              >
                ⚙️
              </button>

              {settingsDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setSettingsDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2.5 w-60 rounded-2xl bg-claude-card border border-claude-border shadow-xl p-4 z-50 flex flex-col gap-3.5 text-claude-text animate-fade-in">
                    
                    <div className="flex items-center justify-between border-b border-claude-border pb-2.5">
                      <span className="text-[9px] font-black uppercase tracking-wider text-claude-text-muted">Theme Mode</span>
                      <button
                        onClick={handleModeToggle}
                        className="px-3 py-1 rounded-xl bg-claude-bg hover:bg-claude-border/55 text-[10px] font-extrabold flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        {themeMode === 'light' ? '☀️ Light' : '🌙 Dark'}
                      </button>
                    </div>

                    <div className="space-y-1.5 border-b border-claude-border pb-3">
                      <span className="text-[9px] font-black uppercase tracking-wider text-claude-text-muted block">Accent Themes</span>
                      <div className="grid grid-cols-3 gap-1.5">
                        {regionsList.map(r => (
                          <button
                            key={r.id}
                            onClick={() => {
                              handleRegionChange(r.id);
                              setSettingsDropdownOpen(false);
                            }}
                            className={`p-1.5 rounded-lg border text-center flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                              themeRegion === r.id
                                ? 'bg-claude-coral/10 border-claude-coral text-claude-coral'
                                : 'bg-transparent border-transparent hover:bg-claude-bg'
                            }`}
                          >
                            <span className="text-sm select-none">{r.icon}</span>
                            <span className="text-[7px] font-black tracking-tighter truncate w-full">{r.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2 border-b border-claude-border pb-3 text-left">
                      <span className="text-[9px] font-black uppercase tracking-wider text-claude-text-muted block">Furigana Mode</span>
                      <div className="flex bg-claude-bg p-0.5 rounded-xl border border-claude-border">
                        {['both', 'kanji', 'kana'].map(mode => (
                          <button
                            key={mode}
                            onClick={() => onChangeFuriganaMode(mode)}
                            className={`flex-1 py-1.5 rounded-lg text-[9px] font-black capitalize transition-all cursor-pointer text-center ${
                              furiganaMode === mode
                                ? 'bg-claude-card text-claude-coral shadow-xs'
                                : 'text-claude-text-muted hover:text-claude-text-heading'
                            }`}
                          >
                            {mode === 'both' ? 'Both' : mode === 'kanji' ? 'Kanji' : 'Kana'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black uppercase tracking-wider text-claude-text-muted">Background Music</span>
                      <button
                        onClick={onToggleMusic}
                        className="px-2.5 py-1.5 rounded-lg bg-claude-bg hover:bg-claude-border/55 text-xs cursor-pointer shadow-xs text-claude-text-heading"
                      >
                        {bgMusicEnabled ? '🔊 Playing' : '🔇 Muted'}
                      </button>
                    </div>

                  </div>
                </>
              )}
            </div>

            {/* Profile Avatar Trigger */}
            <button
              onClick={handleOpenModal}
              className="w-8 h-8 rounded-full border border-claude-border overflow-hidden cursor-pointer active:scale-95 transition-transform shrink-0 flex items-center justify-center bg-claude-bg"
              title="Student Profile"
            >
              <img 
                src={getAvatarUrl(profile?.avatarStyle, profile?.avatarSeed)} 
                className="w-7 h-7 scale-110 object-contain" 
                alt="Avatar" 
              />
            </button>

            {/* Mobile Hamburger menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-8 h-8 rounded-xl bg-claude-bg hover:bg-claude-border/55 flex items-center justify-center lg:hidden text-claude-text-muted hover:text-claude-text-heading cursor-pointer shadow-xs ml-1"
            >
              ☰
            </button>

          </div>
        </div>
      </header>

      {/* Mobile Slide-down Menu Drawer */}
      {mobileMenuOpen && (
        <>
          <div className="fixed inset-0 z-30 bg-black/40 backdrop-blur-xs lg:hidden" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed top-16 left-0 right-0 bg-claude-card border-b border-claude-border z-30 p-5 flex flex-col gap-4 animate-fade-in lg:hidden text-claude-text">
            <span className="text-[9px] font-black uppercase tracking-wider text-claude-text-muted pl-0.5">Navigation</span>
            <div className="grid grid-cols-2 gap-2">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`p-3 rounded-xl border text-center font-extrabold text-xs cursor-pointer transition-all ${
                    activeTab === item.id
                      ? 'bg-claude-coral/10 border-claude-coral text-claude-coral shadow-xs'
                      : 'bg-claude-bg border-claude-border text-claude-text-muted hover:bg-claude-border/30 hover:text-claude-text-heading'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onSignOut();
              }}
              className="w-full py-2.5 bg-red-500/5 hover:bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl text-xs font-black transition-all cursor-pointer text-center mt-2"
            >
              🚪 Sign Out ({userEmail})
            </button>
          </div>
        </>
      )}

      {/* Profile Edit Modal overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[100] flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0" onClick={() => setIsModalOpen(false)} />
          
          <div className="bg-claude-card border border-claude-border w-full max-w-sm rounded-3xl p-6 relative z-10 flex flex-col gap-4 animate-scale-up shadow-2xl">
            <div className="flex justify-between items-center border-b border-claude-border pb-2.5">
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-claude-text-heading">
                Edit Student Profile
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-claude-text-muted hover:text-claude-text-heading text-xs font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-extrabold text-claude-text-muted uppercase tracking-widest block">
                  Student Username
                </label>
                <input 
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="w-full bg-claude-bg border border-claude-border rounded-xl px-3.5 py-2 text-xs font-bold text-claude-text-heading focus:outline-hidden focus:border-claude-coral transition-colors shadow-inner"
                  maxLength={18}
                  placeholder="Enter nickname..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-extrabold text-claude-text-muted uppercase tracking-widest block">
                  Custom Title
                </label>
                <input 
                  type="text"
                  value={tempTitle}
                  onChange={(e) => setTempTitle(e.target.value)}
                  className="w-full bg-claude-bg border border-claude-border rounded-xl px-3.5 py-2 text-xs font-bold text-claude-text-heading focus:outline-hidden focus:border-claude-coral transition-colors shadow-inner"
                  maxLength={22}
                  placeholder="e.g. Chibi Student..."
                />
              </div>

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
                            ? 'bg-claude-bg border-claude-coral ring-2 ring-claude-coral/20' 
                            : 'bg-claude-card border-claude-border'
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

            <div className="flex gap-2.5 pt-2 border-t border-claude-border">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-2 border border-claude-border hover:bg-claude-bg rounded-xl text-[10px] font-bold text-claude-text-muted transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-2 bg-claude-coral hover:opacity-95 text-white rounded-xl text-[10px] font-extrabold transition-colors cursor-pointer shadow"
              >
                Save Changes
              </button>
            </div>

            <div className="pt-2.5 border-t border-claude-border flex flex-col gap-2">
              <div className="text-[8px] font-bold text-claude-text-muted text-center truncate">
                Authenticated as: <span className="text-claude-text-heading">{userEmail}</span>
              </div>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  onSignOut();
                }}
                className="w-full py-2 bg-red-500/5 hover:bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl text-[10px] font-black transition-all cursor-pointer text-center"
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
