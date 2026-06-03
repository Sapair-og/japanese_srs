/* eslint-disable */
// Restored visual icons, Gen Z slang, and original emojis as requested by the user.
import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import QuizCard from './components/QuizCard';
import VocabManager from './components/VocabManager';
import KanaBoard from './components/KanaBoard';
import ErrorFallback from './components/ErrorFallback';
import { demoVocab } from './utils/demoData';
import { supabase } from './utils/supabaseClient';
import LoadingScreen from './components/LoadingScreen';
import CursorTrail from './components/CursorTrail';
import StudyGuide from './components/StudyGuide';
import { generateMnemonic } from './utils/mnemonicGenerator';
import Auth from './components/Auth';
import { initWasm } from './utils/strokeMatcher';
export function calculateLevelInfo(totalCorrect) {
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
}


const parseDbTheme = (dbThemeString) => {
  const theme = dbThemeString || 'theme-claude-light';
  
  if (theme === 'theme-claude-light') return { region: 'liyue', mode: 'light' };
  if (theme === 'theme-claude-dark') return { region: 'liyue', mode: 'dark' };
  if (theme === 'theme-spotify') return { region: 'sumeru', mode: 'dark' };
  if (theme === 'theme-duolingo') return { region: 'sumeru', mode: 'light' };
  if (theme === 'theme-github-light') return { region: 'fontaine', mode: 'light' };
  if (theme === 'theme-github-dark') return { region: 'fontaine', mode: 'dark' };
  if (theme === 'theme-monkeytype') return { region: 'khaenriah', mode: 'dark' };
  if (theme === 'theme-discord') return { region: 'inazuma', mode: 'dark' };
  if (theme === 'theme-dracula') return { region: 'abyss', mode: 'dark' };
  if (theme === 'theme-nord') return { region: 'snezhnaya', mode: 'dark' };
  
  const parts = theme.split('-');
  if (parts.length === 2) {
    const [region, mode] = parts;
    const validRegions = ['liyue', 'mondstadt', 'inazuma', 'sumeru', 'fontaine', 'natlan', 'snezhnaya', 'khaenriah', 'abyss'];
    const validModes = ['light', 'dark'];
    if (validRegions.includes(region) && validModes.includes(mode)) {
      return { region, mode };
    }
  }
  
  return { region: 'liyue', mode: 'light' };
};

export default function App() {
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const userId = session?.user?.id;
  const isAdmin = session?.user?.email === import.meta.env.VITE_ADMIN_EMAIL;
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  
  // Gen Z style error and network states
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [dbError, setDbError] = useState(false);
  const [errorPreviewType, setErrorPreviewType] = useState(null);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Initialize WebAssembly stroke matcher engine
  useEffect(() => {
    initWasm();
  }, []);

  
  // Theme states representing current Genshin region and light/dark mode
  const [themeRegion, setThemeRegion] = useState('liyue');
  const [themeMode, setThemeMode] = useState('light');

  // User profile state
  const [profile, setProfile] = useState({
    name: 'Luna-chan',
    title: 'Chibi Student',
    avatarSeed: 'Luna',
    avatarStyle: 'adventurer'
  });

  // Database of vocabulary
  const [vocabList, setVocabList] = useState([]);



  // User lifetime stats
  const [stats, setStats] = useState({
    streak: 0,
    totalAttempts: 0,
    totalCorrect: 0,
    lastStudiedDate: null
  });

  // Session settings states
  const [difficulty, setDifficulty] = useState('easy'); // 'easy' or 'hard'
  const [sessionLimit, setSessionLimit] = useState(0);
  const [selectedLessons, setSelectedLessons] = useState([]);

  // Study Arena Timer states
  const [timerEnabled, setTimerEnabled] = useState(() => {
    const saved = localStorage.getItem('jp_vocab_timer_enabled');
    return saved === 'true';
  });
  const [timePerCard, setTimePerCard] = useState(() => {
    const saved = localStorage.getItem('jp_vocab_timer_duration');
    return saved ? parseInt(saved) : 10;
  });

  // Sync timer settings to localStorage
  useEffect(() => {
    localStorage.setItem('jp_vocab_timer_enabled', timerEnabled);
  }, [timerEnabled]);

  useEffect(() => {
    localStorage.setItem('jp_vocab_timer_duration', timePerCard);
  }, [timePerCard]);

  // Active quiz session states
  const [activeQueue, setActiveQueue] = useState([]);
  const [totalSessionCards, setTotalSessionCards] = useState(0);
  
  // Unique question key/index to force QuizCard unmount/remount on incorrect recycling
  const [questionIndex, setQuestionIndex] = useState(0);

  // Studied dates heatmap tracking list state (synced with db)
  const [studiedDates, setStudiedDates] = useState([]);

  // Background music state
  const [bgMusicEnabled, setBgMusicEnabled] = useState(() => {
    return localStorage.getItem('jp_vocab_bg_music_enabled') === 'true';
  });
  const audioRef = useRef(null);

  // Initialize audio volume and source load
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.25; // Gentle background level
    }
  }, []);

  // Handle play/pause logic based on toggle and study session status
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const isQuizActive = activeTab === 'quiz' && activeQueue.length > 0;

    if (bgMusicEnabled && !isQuizActive) {
      audio.play().catch(err => {
        console.warn("Autoplay blocked by browser. User interaction required:", err);
      });
    } else {
      audio.pause();
    }
  }, [bgMusicEnabled, activeTab, activeQueue.length]);

  // Sync preference to localStorage
  useEffect(() => {
    localStorage.setItem('jp_vocab_bg_music_enabled', bgMusicEnabled);
  }, [bgMusicEnabled]);

  // Apply theme class to document element when region or mode changes
  useEffect(() => {
    const root = document.documentElement;
    const regionClasses = [
      'theme-liyue',
      'theme-mondstadt',
      'theme-inazuma',
      'theme-sumeru',
      'theme-fontaine',
      'theme-natlan',
      'theme-snezhnaya',
      'theme-khaenriah',
      'theme-abyss'
    ];
    // Clear existing region classes
    regionClasses.forEach(c => root.classList.remove(c));
    
    // Add current region class
    root.classList.add('theme-' + themeRegion);
    
    // Toggle dark class
    root.classList.toggle('dark', themeMode === 'dark');
  }, [themeRegion, themeMode]);



  // Auth listener for session changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch initial profile, stats, and vocabulary list from Supabase
  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }
    
    async function loadData() {
      try {
        setIsLoading(true);
        
        // 1. Fetch user profile
        let { data: profileData, error: profileError } = await supabase
          .from('user_profile')
          .select('*')
          .eq('id', userId)
          .single();
          
        if (profileError && profileError.code === 'PGRST116') {
          // Profile does not exist yet, create a default profile record
          const defaultProfile = {
            id: userId,
            name: session?.user?.user_metadata?.full_name || 'Luna-chan',
            title: 'Chibi Student',
            avatar_seed: 'Luna',
            avatar_style: 'adventurer',
            theme: 'liyue-light'
          };
          const { error: insertError } = await supabase
            .from('user_profile')
            .insert([defaultProfile]);
            
          if (!insertError) {
            setProfile({
              name: defaultProfile.name,
              title: defaultProfile.title,
              avatarSeed: defaultProfile.avatar_seed,
              avatarStyle: defaultProfile.avatar_style
            });
            setThemeRegion('liyue');
            setThemeMode('light');
          }
        } else if (profileData) {
          setProfile({
            name: profileData.name,
            title: profileData.title,
            avatarSeed: profileData.avatar_seed,
            avatarStyle: profileData.avatar_style
          });
          const { region, mode } = parseDbTheme(profileData.theme);
          setThemeRegion(region);
          setThemeMode(mode);
        }

        // 2. Fetch user stats
        let { data: statsData, error: statsError } = await supabase
          .from('user_stats')
          .select('*')
          .eq('id', userId)
          .single();

        if (statsError && statsError.code === 'PGRST116') {
          // Stats record does not exist yet, create one
          const defaultStats = {
            id: userId,
            streak: 0,
            total_attempts: 0,
            total_correct: 0,
            last_studied_date: null
          };
          const { error: insertError } = await supabase
            .from('user_stats')
            .insert([defaultStats]);
            
          if (!insertError) {
            setStats({
              streak: 0,
              totalAttempts: 0,
              totalCorrect: 0,
              lastStudiedDate: null
            });
          }
        } else if (statsData) {
          setStats({
            streak: statsData.streak,
            totalAttempts: statsData.total_attempts,
            totalCorrect: statsData.total_correct,
            lastStudiedDate: statsData.last_studied_date
          });
        }

        // 3. Fetch user study heatmap dates
        let { data: datesData, error: datesError } = await supabase
          .from('user_study_dates')
          .select('studied_date')
          .eq('user_id', userId);

        if (datesData) {
          setStudiedDates(datesData.map(d => d.studied_date));
        } else {
          setStudiedDates([]);
        }

        // 4. Fetch vocabulary list
        let { data: vocabData, error: vocabError } = await supabase
          .from('vocabulary')
          .select('*')
          .order('created_at', { ascending: true });

        if (vocabData) {
          setVocabList(vocabData);
        }
      } catch (err) {
        console.error('Failed to connect to Supabase database:', err);
        setDbError(true);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [userId]);

  // Keep sessionLimit in sync with vocabList changes
  useEffect(() => {
    if (vocabList.length > 0) {
      setSessionLimit(prev => {
        if (prev === 0 || prev > vocabList.length) {
          return vocabList.length;
        }
        return prev;
      });
    } else {
      setSessionLimit(0);
    }
  }, [vocabList]);

  // Merge imported cards ensuring uniqueness
  const handleImportVocab = async (newCards) => {
    const existingKeys = new Set(vocabList.map(c => `${c.hiragana.trim()}_${c.english.trim()}`.toLowerCase()));
    const filteredNew = newCards.filter(c => {
      const key = `${c.hiragana.trim()}_${c.english.trim()}`.toLowerCase();
      return !existingKeys.has(key);
    });

    if (filteredNew.length === 0) return 0;

    const cardsToInsert = filteredNew.map(c => ({
      hiragana: c.hiragana.trim(),
      kanji: c.kanji?.trim() || '',
      group: c.group?.trim() || 'Noun',
      english: c.english.trim(),
      romaji: c.romaji?.trim() || '',
      lesson: c.lesson?.trim() || 'General',
      audio_url: c.audio_url || null,
      mnemonic: c.mnemonic?.trim() || c.trick?.trim() || generateMnemonic(c.hiragana, c.romaji, c.english)
    }));

    let { data, error } = await supabase
      .from('vocabulary')
      .insert(cardsToInsert)
      .select();

    if (error && error.code === 'PGRST204') {
      console.warn("DB lacks 'mnemonic', 'lesson' or other columns. Retrying import with base columns...");
      const baseCardsToInsert = cardsToInsert.map(({ hiragana, kanji, group, english, romaji }) => ({
        hiragana, kanji, group, english, romaji
      }));
      const retryResult = await supabase
        .from('vocabulary')
        .insert(baseCardsToInsert)
        .select();
      data = retryResult.data;
      error = retryResult.error;

      if (!error) {
        alert("Notice: Cards imported successfully, but your database is missing optional columns. To support lessons, audio, and mnemonics, please run the SQL migration script in your Supabase SQL Editor:\n\nalter table public.vocabulary add column if not exists lesson text default 'General';\nalter table public.vocabulary add column if not exists audio_url text;\nalter table public.vocabulary add column if not exists mnemonic text default '';");
      }
    }

    if (!error && data) {
      setVocabList(prev => [...prev, ...data]);
      return data.length;
    } else {
      console.error('Error importing cards:', error);
      return 0;
    }
  };

  // Add individual word card
  const handleAddWord = async (newWord) => {
    const cardsToInsert = [{
      hiragana: newWord.hiragana.trim(),
      kanji: newWord.kanji?.trim() || '',
      group: newWord.group?.trim() || 'Noun',
      english: newWord.english.trim(),
      romaji: newWord.romaji?.trim() || '',
      lesson: newWord.lesson?.trim() || 'General',
      audio_url: newWord.audio_url || null,
      mnemonic: newWord.mnemonic?.trim() || generateMnemonic(newWord.hiragana, newWord.romaji, newWord.english)
    }];

    let { data, error } = await supabase
      .from('vocabulary')
      .insert(cardsToInsert)
      .select();

    if (error && error.code === 'PGRST204') {
      console.warn("DB lacks some optional columns. Retrying add with only base columns...");
      const baseCardsToInsert = cardsToInsert.map(({ hiragana, kanji, group, english, romaji }) => ({
        hiragana, kanji, group, english, romaji
      }));
      const retryResult = await supabase
        .from('vocabulary')
        .insert(baseCardsToInsert)
        .select();
      data = retryResult.data;
      error = retryResult.error;
    }

    if (!error && data) {
      setVocabList(prev => [...prev, ...data]);
    } else {
      console.error('Error adding word:', error);
    }
  };

  // Delete individual word card
  const handleDeleteWord = async (wordToDelete) => {
    const query = wordToDelete.id 
      ? supabase.from('vocabulary').delete().eq('id', wordToDelete.id)
      : supabase.from('vocabulary').delete().eq('hiragana', wordToDelete.hiragana).eq('english', wordToDelete.english);

    const { error } = await query;

    if (!error) {
      setVocabList(prev => prev.filter(word => 
        wordToDelete.id ? word.id !== wordToDelete.id : !(word.hiragana === wordToDelete.hiragana && word.english === wordToDelete.english)
      ));
      setActiveQueue(prev => prev.filter(word => 
        wordToDelete.id ? word.id !== wordToDelete.id : !(word.hiragana === wordToDelete.hiragana && word.english === wordToDelete.english)
      ));
    } else {
      console.error('Error deleting word:', error);
    }
  };

  // Clear data
  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to delete all vocabulary cards and reset stats? This cannot be undone.')) {
      const { error: deleteError } = await supabase
        .from('vocabulary')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      const resetStats = {
        streak: 0,
        total_attempts: 0,
        total_correct: 0,
        last_studied_date: null
      };

      const { error: statsError } = await supabase
        .from('user_stats')
        .update(resetStats)
        .eq('id', userId);

      if (!deleteError && !statsError) {
        setVocabList([]);
        setStats({
          streak: 0,
          totalAttempts: 0,
          totalCorrect: 0,
          lastStudiedDate: null
        });
        setDifficulty('easy');
        setActiveQueue([]);
        setTotalSessionCards(0);
        setQuestionIndex(0);
        setActiveTab('dashboard');
      } else {
        console.error('Error clearing data:', deleteError, statsError);
      }
    }
  };

  // Load demo vocabulary
  const handleLoadDemo = async () => {
    const cardsToInsert = demoVocab.map(c => ({
      hiragana: c.hiragana.trim(),
      kanji: c.kanji.trim(),
      group: c.group.trim(),
      english: c.english.trim(),
      romaji: c.romaji.trim(),
      lesson: c.lesson?.trim() || 'General',
      mnemonic: c.mnemonic?.trim() || generateMnemonic(c.hiragana, c.romaji, c.english)
    }));

    const { data, error } = await supabase
      .from('vocabulary')
      .insert(cardsToInsert)
      .select();

    if (!error && data) {
      setVocabList(prev => [...prev, ...data]);
    } else {
      console.error('Error loading demo vocabulary:', error);
    }
  };

  // Start study session
  const handleStartSession = (lessons) => {
    if (vocabList.length === 0) return;
    
    const filterLessons = Array.isArray(lessons) ? lessons : selectedLessons;
    
    let pool = [...vocabList];
    if (filterLessons && filterLessons.length > 0) {
      pool = pool.filter(c => filterLessons.includes(c.lesson || 'General'));
    }
    
    // Shuffle the vocabulary list to start a fresh queue
    const shuffled = pool.sort(() => 0.5 - Math.random());
    const limit = Math.min(sessionLimit > 0 ? sessionLimit : shuffled.length, shuffled.length);
    const selected = shuffled.slice(0, limit);

    setActiveQueue(selected);
    setTotalSessionCards(selected.length);
    setQuestionIndex(0);
    setActiveTab('quiz');
  };

  // Restart existing session
  const handleRestartSession = () => {
    handleStartSession(selectedLessons);
  };

  // Answer response SRS logic handler
  const handleAnswer = async (isCorrect, card) => {
    const today = new Date().toISOString().split('T')[0];
    const lastDate = stats.lastStudiedDate;
    
    let newStreak = stats.streak;
    
    if (isCorrect) {
      if (lastDate !== today) {
        if (!lastDate) {
          newStreak = 1;
        } else {
          const lastDateObj = new Date(lastDate);
          const todayObj = new Date(today);
          const diffTime = Math.abs(todayObj - lastDateObj);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          if (diffDays === 1) {
            newStreak = stats.streak + 1;
          } else {
            newStreak = 1;
          }
        }
      }
    }

    const updatedStats = {
      streak: newStreak,
      totalAttempts: stats.totalAttempts + 1,
      totalCorrect: isCorrect ? stats.totalCorrect + 1 : stats.totalCorrect,
      lastStudiedDate: isCorrect ? today : stats.lastStudiedDate
    };

    // Update user_stats in Supabase
    const { error } = await supabase
      .from('user_stats')
      .update({
        streak: updatedStats.streak,
        total_attempts: updatedStats.totalAttempts,
        total_correct: updatedStats.totalCorrect,
        last_studied_date: updatedStats.lastStudiedDate
      })
      .eq('id', userId);

    if (!error) {
      setStats(updatedStats);
    } else {
      console.error('Error updating stats in Supabase:', error);
    }

    // Update active review queue
    if (isCorrect) {
      setActiveQueue(prev => prev.slice(1));
    } else {
      setActiveQueue(prev => {
        const [first, ...rest] = prev;
        return [...rest, first];
      });
    }

    // Update studied dates heatmap log on correct answer
    if (isCorrect && userId) {
      supabase
        .from('user_study_dates')
        .insert([{ user_id: userId, studied_date: today }])
        .then(({ error: dError }) => {
          if (dError && dError.code !== '23505') { // Ignore duplicate keys
            console.error('Error logging study date:', dError);
          }
        });

      setStudiedDates(prev => {
        if (!prev.includes(today)) {
          return [...prev, today];
        }
        return prev;
      });
    }

    // Always increment the question index key to force component remounting
    setQuestionIndex(prev => prev + 1);
  };

  // Sign out the current user session
  const handleSignOut = async () => {
    if (window.confirm('Are you sure you want to sign out of your study workspace?')) {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
      } else {
        setSession(null);
        setVocabList([]);
        setStats({
          streak: 0,
          totalAttempts: 0,
          totalCorrect: 0,
          lastStudiedDate: null
        });
        setStudiedDates([]);
        setActiveQueue([]);
        setActiveTab('dashboard');
      }
    }
  };

  // Clear user-specific statistics and study dates
  const handleClearStats = async () => {
    if (window.confirm('Are you sure you want to reset your study stats and heatmap history? This will not affect the shared vocabulary database.')) {
      try {
        const resetStats = {
          streak: 0,
          total_attempts: 0,
          total_correct: 0,
          last_studied_date: null
        };

        const { error: statsError } = await supabase
          .from('user_stats')
          .update(resetStats)
          .eq('id', userId);

        const { error: datesError } = await supabase
          .from('user_study_dates')
          .delete()
          .eq('user_id', userId);

        if (!statsError && !datesError) {
          setStats({
            streak: 0,
            totalAttempts: 0,
            totalCorrect: 0,
            lastStudiedDate: null
          });
          setStudiedDates([]);
          alert('Your personal study progress and logs have been cleared.');
        } else {
          console.error('Error resetting user stats:', statsError, datesError);
          alert('Failed to reset stats. Please try again.');
        }
      } catch (err) {
        console.error('Error in handleClearStats:', err);
      }
    }
  };

  const handleUpdateProfile = async (newProfile) => {
    const { error } = await supabase
      .from('user_profile')
      .update({
        name: newProfile.name,
        title: newProfile.title,
        avatar_seed: newProfile.avatarSeed,
        avatar_style: newProfile.avatarStyle
      })
      .eq('id', userId);

    if (!error) {
      setProfile(newProfile);
    } else {
      console.error('Error updating profile in Supabase:', error);
    }
  };

  const handleUpdateTheme = async (region, mode) => {
    const combined = `${region}-${mode}`;
    const { error } = await supabase
      .from('user_profile')
      .update({
        theme: combined
      })
      .eq('id', userId);

    if (!error) {
      setThemeRegion(region);
      setThemeMode(mode);
    } else {
      console.error('Error updating theme in Supabase:', error);
    }
  };

  const handleUpdateMnemonic = async (cardId, newMnemonic) => {
    const { error } = await supabase
      .from('vocabulary')
      .update({ mnemonic: newMnemonic })
      .eq('id', cardId);

    if (!error) {
      setVocabList(prev => prev.map(word => word.id === cardId ? { ...word, mnemonic: newMnemonic } : word));
      return true;
    } else {
      console.error('Error updating mnemonic in Supabase:', error);
      return false;
    }
  };

  const handleResetSessionConfig = () => {
    setActiveQueue([]);
    setTotalSessionCards(0);
  };

  const handleNavTabClick = (tabId) => {
    if (tabId === 'quiz') {
      // If we are already on the quiz tab and a session is active, ask if they want to reset it
      if (activeTab === 'quiz' && activeQueue.length > 0) {
        if (window.confirm("Are you sure you want to quit the current study session and return to settings?")) {
          handleResetSessionConfig();
        }
        return;
      }
      
      // If there's no active session running (i.e. queue is empty), reset config to show launcher
      if (activeQueue.length === 0) {
        handleResetSessionConfig();
      }
    }
    setActiveTab(tabId);
  };

  if (authLoading || isLoading) {
    return (
      <>
        <LoadingScreen />
        <CursorTrail />
      </>
    );
  }

  if (!session) {
    return (
      <>
        <Auth />
        <CursorTrail />
      </>
    );
  }

  // Intercept normal rendering for Gen Z error screens
  if (errorPreviewType) {
    return (
      <>
        <ErrorFallback 
          type={errorPreviewType} 
          onRetry={() => setErrorPreviewType(null)} 
          onBackHome={() => setErrorPreviewType(null)} 
        />
        <CursorTrail />
      </>
    );
  }

  if (isOffline) {
    return (
      <>
        <ErrorFallback 
          type="offline" 
          onRetry={() => setIsOffline(!navigator.onLine)} 
        />
        <CursorTrail />
      </>
    );
  }

  if (dbError) {
    return (
      <>
        <ErrorFallback 
          type="database" 
          onRetry={() => {
            setDbError(false);
            window.location.reload();
          }} 
        />
        <CursorTrail />
      </>
    );
  }

  return (
    <div className="flex-grow flex flex-col md:flex-row min-h-screen">
      <CursorTrail />
      {/* Background Music player */}
      <audio ref={audioRef} src="/bg_music.mp3" loop />
      {/* Navigation Sidebar & Bottom Bar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={handleNavTabClick} 
        hasCards={vocabList.length > 0}
        themeRegion={themeRegion}
        themeMode={themeMode}
        onChangeTheme={handleUpdateTheme}
        profile={profile}
        onUpdateProfile={handleUpdateProfile}
        bgMusicEnabled={bgMusicEnabled}
        onToggleMusic={() => setBgMusicEnabled(prev => !prev)}
        onSignOut={handleSignOut}
        userEmail={session?.user?.email}
        stats={stats}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-y-auto px-3 sm:px-4 md:px-8 py-5 pb-24 md:pb-6 justify-center items-center w-full">
        {activeTab === 'dashboard' && (
          <Dashboard
            stats={stats}
            vocabList={vocabList}
            onStartSession={handleStartSession}
            onLoadDemo={handleLoadDemo}
            onClearAll={handleClearAll}
            onClearStats={handleClearStats}
            setActiveTab={handleNavTabClick}
            difficulty={difficulty}
            setDifficulty={setDifficulty}
            sessionLimit={sessionLimit}
            setSessionLimit={setSessionLimit}
            profile={profile}
            onResetConfig={handleResetSessionConfig}
            studiedDates={studiedDates}
            onTriggerPreview={setErrorPreviewType}
            isAdmin={isAdmin}
          />
        )}

        {activeTab === 'quiz' && (
          <QuizCard
            currentCard={activeQueue[0]}
            allCards={vocabList}
            queueLength={activeQueue.length}
            totalSessionCards={totalSessionCards}
            onAnswer={handleAnswer}
            onRestartSession={handleRestartSession}
            activeTab={activeTab}
            setActiveTab={handleNavTabClick}
            difficulty={difficulty}
            setDifficulty={setDifficulty}
            sessionLimit={sessionLimit}
            setSessionLimit={setSessionLimit}
            onStartSession={handleStartSession}
            onResetConfig={handleResetSessionConfig}
            questionIndex={questionIndex}
            timerEnabled={timerEnabled}
            setTimerEnabled={setTimerEnabled}
            timePerCard={timePerCard}
            setTimePerCard={setTimePerCard}
            selectedLessons={selectedLessons}
            setSelectedLessons={setSelectedLessons}
            themeRegion={themeRegion}
            themeMode={themeMode}
          />
        )}

        {activeTab === 'vocab' && (
          <VocabManager
            vocabList={vocabList}
            onImportVocab={handleImportVocab}
            onClearAll={handleClearAll}
            onLoadDemo={handleLoadDemo}
            onDeleteWord={handleDeleteWord}
            onAddWord={handleAddWord}
            isAdmin={isAdmin}
          />
        )}

        {activeTab === 'study' && (
          <StudyGuide
            vocabList={vocabList}
            onUpdateMnemonic={handleUpdateMnemonic}
          />
        )}

        {activeTab === 'kana' && (
          <KanaBoard 
            themeRegion={themeRegion} 
            themeMode={themeMode} 
          />
        )}
      </main>
    </div>
  );
}
