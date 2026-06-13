/* eslint-disable */
// Restored visual icons, Gen Z slang, and original emojis as requested by the user.
import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import QuizCard from './components/QuizCard';
import VocabManager from './components/VocabManager';
import KanaBoard from './components/KanaBoard';
import KanjiBoard from './components/KanjiBoard';
import ErrorFallback from './components/ErrorFallback';
import { demoVocab } from './utils/demoData';
import { supabase } from './utils/supabaseClient';
import LoadingScreen from './components/LoadingScreen';
import CursorTrail from './components/CursorTrail';
import StudyGuide from './components/StudyGuide';
import { generateMnemonic } from './utils/mnemonicGenerator';
import Auth from './components/Auth';
import { initWasm } from './utils/strokeMatcher';
// import StoryReader from './components/StoryReader';
import GrammarDojo from './components/GrammarDojo';
import { calculateSM2 } from './utils/srsEngine';
import { sortVocabByJlptPreference } from './utils/jlptPrioritizer';
import { setCachedVocab, getCachedVocab } from './utils/indexedDbCache';
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
  const isAdmin = 
    session?.user?.email === import.meta.env.VITE_ADMIN_EMAIL || 
    session?.user?.email === 'yashvardhan.23bce10849@vitbhopal.ac.in' ||
    import.meta.env.DEV;
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

  // Autohide Navbar on Inactivity inside the Navbar region only
  const [navbarVisible, setNavbarVisible] = useState(true);
  const navbarTimeoutRef = useRef(null);

  const showNavbar = () => {
    setNavbarVisible(true);
    if (navbarTimeoutRef.current) {
      clearTimeout(navbarTimeoutRef.current);
      navbarTimeoutRef.current = null;
    }
  };

  const hideNavbarWithDelay = () => {
    if (navbarTimeoutRef.current) {
      clearTimeout(navbarTimeoutRef.current);
    }
    navbarTimeoutRef.current = setTimeout(() => {
      setNavbarVisible(false);
    }, 2500); // 2.5 seconds timeout
  };

  const handleTouchActivity = () => {
    showNavbar();
    hideNavbarWithDelay();
  };

  useEffect(() => {
    // Hide after initial 2.5 seconds of mount
    hideNavbarWithDelay();
    return () => {
      if (navbarTimeoutRef.current) {
        clearTimeout(navbarTimeoutRef.current);
      }
    };
  }, []);

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

  // Review sessions state
  const [reviewSessions, setReviewSessions] = useState([]);

  // Furigana mode state: 'both', 'kanji', 'kana'
  const [furiganaMode, setFuriganaMode] = useState(() => {
    return localStorage.getItem('jp_vocab_furigana_mode') || 'both';
  });

  useEffect(() => {
    localStorage.setItem('jp_vocab_furigana_mode', furiganaMode);
  }, [furiganaMode]);


  // Fetch helper to refresh review sessions
  const refreshReviewSessions = async (uid) => {
    try {
      const { data, error } = await supabase
        .from('review_sessions')
        .select('*')
        .eq('user_id', uid)
        .order('session_date', { ascending: false })
        .limit(30);
      if (!error && data) {
        setReviewSessions(data);
      }
    } catch (e) {
      console.warn("Error refreshing review sessions:", e);
    }
  };

  const syncOfflineReviews = async () => {
    const queue = JSON.parse(localStorage.getItem('jp_vocab_offline_queue') || '[]');
    if (queue.length === 0) return;

    console.log(`Syncing ${queue.length} offline reviews to Supabase...`);
    
    for (const item of queue) {
      const { cardId, rating, timestamp } = item;
      const card = vocabList.find(c => c.id === cardId);
      if (!card) continue;

      const isCorrect = rating > 0;

      const { interval, repetitions, easeFactor, nextReview } = calculateSM2(
        rating,
        card.interval ?? 0,
        card.repetitions ?? 0,
        card.easeFactor ?? 2.5
      );

      let masteryScore = 0;
      if (repetitions > 0) {
        masteryScore = Math.min(100, Math.round((repetitions * 10) + (interval * 1.5)));
      }

      const wrongCount = isCorrect ? (card.wrongCount || 0) : ((card.wrongCount || 0) + 1);
      const correctCount = isCorrect ? ((card.correctCount || 0) + 1) : (card.correctCount || 0);

      try {
        await supabase
          .from('user_card_progress')
          .upsert({
            user_id: userId,
            card_id: cardId,
            ease_factor: easeFactor,
            interval: interval,
            repetitions: repetitions,
            last_reviewed: timestamp,
            next_review: nextReview.toISOString(),
            wrong_count: wrongCount,
            correct_count: correctCount,
            mastery_score: masteryScore
          }, { onConflict: 'user_id,card_id' });

        await supabase
          .from('review_history')
          .insert([{
            user_id: userId,
            card_id: cardId,
            rating: rating,
            reviewed_at: timestamp
          }]);
      } catch (err) {
        console.error("Failed to sync card offline progress:", err);
      }
    }

    localStorage.removeItem('jp_vocab_offline_queue');
    console.log("Offline reviews synchronized successfully.");
    
    if (userId) {
      refreshReviewSessions(userId);
    }
  };

  useEffect(() => {
    if (!userId) return;
    const handleSessionCompleted = () => {
      refreshReviewSessions(userId);
    };
    window.addEventListener('jp_vocab_session_completed', handleSessionCompleted);
    return () => window.removeEventListener('jp_vocab_session_completed', handleSessionCompleted);
  }, [userId]);

  // Trigger sync on online reconnection or when app becomes online
  useEffect(() => {
    if (userId && !isOffline && vocabList.length > 0) {
      syncOfflineReviews();
    }
  }, [userId, isOffline, vocabList.length === 0]);

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

        // Fetch user card progress
        let progressData = [];
        try {
          const { data, error: progressError } = await supabase
            .from('user_card_progress')
            .select('*')
            .eq('user_id', userId);
          if (!progressError && data) {
            progressData = data;
          } else if (progressError) {
            console.warn("Could not fetch user_card_progress (table might not exist yet):", progressError);
          }
        } catch (e) {
          console.warn("Exception fetching user_card_progress:", e);
        }

        if (vocabData) {
          // Merge user card progress into vocabulary list
          const merged = vocabData.map(card => {
            const prog = progressData.find(p => p.card_id === card.id);
            return {
              ...card,
              easeFactor: prog?.ease_factor ?? 2.5,
              interval: prog?.interval ?? 0,
              repetitions: prog?.repetitions ?? 0,
              lastReviewed: prog?.last_reviewed ?? null,
              nextReview: prog?.next_review ?? null,
              wrongCount: prog?.wrong_count ?? 0,
              correctCount: prog?.correct_count ?? 0,
              masteryScore: prog?.mastery_score ?? 0,
              progressId: prog?.id ?? null
            };
          });
          setVocabList(merged);
          // Save to local cache asynchronously for offline usage using IndexedDB
          setCachedVocab(merged).then(success => {
            if (!success) {
              console.warn("Could not cache vocabList in IndexedDB");
            }
          });
        }

        // 5. Fetch user review sessions
        try {
          const { data: sessionsData, error: sessionsError } = await supabase
            .from('review_sessions')
            .select('*')
            .eq('user_id', userId)
            .order('session_date', { ascending: false })
            .limit(30);
          if (!sessionsError && sessionsData) {
            setReviewSessions(sessionsData);
          } else if (sessionsError) {
            console.warn("Could not fetch review_sessions:", sessionsError);
          }
        } catch (e) {
          console.warn("Exception fetching review_sessions:", e);
        }
      } catch (err) {
        console.error('Failed to connect to Supabase database:', err);
        // Fallback to local cache asynchronously if offline
        const cachedList = await getCachedVocab();
        if (cachedList && cachedList.length > 0) {
          setVocabList(cachedList);
          console.log("Loaded vocabulary from offline cache.");
        } else {
          setDbError(true);
        }
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
      mnemonic: c.mnemonic?.trim() || c.trick?.trim() || generateMnemonic(c.hiragana, c.romaji, c.english),
      context_japanese: c.context_japanese || null,
      context_english: c.context_english || null
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
      mnemonic: newWord.mnemonic?.trim() || generateMnemonic(newWord.hiragana, newWord.romaji, newWord.english),
      context_japanese: newWord.context_japanese || null,
      context_english: newWord.context_english || null
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

  // Update individual word card
  const handleUpdateWord = async (updatedWord) => {
    const { id, hiragana, kanji, group, english, romaji, lesson, audio_url, mnemonic, context_japanese, context_english } = updatedWord;
    
    const { data, error } = await supabase
      .from('vocabulary')
      .update({
        hiragana: hiragana.trim(),
        kanji: kanji?.trim() || '',
        group: group?.trim() || 'Noun',
        english: english.trim(),
        romaji: romaji?.trim() || '',
        lesson: lesson?.trim() || 'General',
        audio_url: audio_url || null,
        mnemonic: mnemonic?.trim() || '',
        context_japanese: context_japanese || null,
        context_english: context_english || null
      })
      .eq('id', id)
      .select();

    if (!error && data && data.length > 0) {
      setVocabList(prev => prev.map(word => word.id === id ? { ...word, ...data[0] } : word));
      setActiveQueue(prev => prev.map(word => word.id === id ? { ...word, ...data[0] } : word));
      return data[0];
    } else {
      console.error('Error updating word:', error);
      throw error || new Error("Failed to update word in database");
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
  const handleStartSession = (lessons, srsOnly = false) => {
    if (vocabList.length === 0) return;
    
    const filterLessons = Array.isArray(lessons) ? lessons : selectedLessons;
    
    let pool = [...vocabList];
    if (filterLessons && filterLessons.length > 0) {
      pool = pool.filter(c => filterLessons.includes(c.lesson || 'General'));
    }
    
    if (srsOnly) {
      const now = new Date();
      pool = pool.filter(c => !c.nextReview || new Date(c.nextReview) <= now);
    }

    if (pool.length === 0) {
      alert("No cards match your filter criteria or no reviews are due!");
      return;
    }
    
    // Shuffle the vocabulary list to start a fresh queue.
    // If difficulty is set to hard, prioritize important JLPT cards first.
    const shuffled = difficulty === 'hard' 
      ? sortVocabByJlptPreference(pool) 
      : pool.sort(() => 0.5 - Math.random());
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

  // Experience gain handler for interactive components (Grammar Dojo)
  const handleGainXp = async (amount = 2) => {
    if (!userId) return;
    const today = new Date().toISOString().split('T')[0];
    const lastDate = stats.lastStudiedDate;
    let newStreak = stats.streak;

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

    const updatedStats = {
      ...stats,
      totalCorrect: stats.totalCorrect + amount,
      totalAttempts: stats.totalAttempts + amount,
      lastStudiedDate: today,
      streak: newStreak
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
  };

  // Answer response SRS logic handler
  const handleAnswer = async (rating, card) => {
    const isCorrect = rating > 0;
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

    // Compute updated SM-2 parameters
    const { interval, repetitions, easeFactor, nextReview } = calculateSM2(
      rating,
      card.interval ?? 0,
      card.repetitions ?? 0,
      card.easeFactor ?? 2.5
    );

    // Mastery Score Formula
    let masteryScore = 0;
    if (repetitions > 0) {
      masteryScore = Math.min(100, Math.round((repetitions * 10) + (interval * 1.5)));
    }

    // Update the vocabList state immediately
    setVocabList(prev => prev.map(c => {
      if (c.id === card.id) {
        return {
          ...c,
          interval,
          repetitions,
          easeFactor,
          nextReview: nextReview.toISOString(),
          wrongCount: isCorrect ? c.wrongCount : (c.wrongCount + 1),
          correctCount: isCorrect ? (c.correctCount + 1) : c.correctCount,
          masteryScore
        };
      }
      return c;
    }));

    // Write progress updates to Supabase or cache locally if offline
    if (userId) {
      const wrongCount = isCorrect ? (card.wrongCount || 0) : ((card.wrongCount || 0) + 1);
      const correctCount = isCorrect ? ((card.correctCount || 0) + 1) : (card.correctCount || 0);

      const progressRecord = {
        user_id: userId,
        card_id: card.id,
        ease_factor: easeFactor,
        interval: interval,
        repetitions: repetitions,
        last_reviewed: new Date().toISOString(),
        next_review: nextReview.toISOString(),
        wrong_count: wrongCount,
        correct_count: correctCount,
        mastery_score: masteryScore
      };

      if (isOffline) {
        // Cache offline progress update
        const offlineQueue = JSON.parse(localStorage.getItem('jp_vocab_offline_queue') || '[]');
        offlineQueue.push({ cardId: card.id, rating, timestamp: new Date().toISOString() });
        localStorage.setItem('jp_vocab_offline_queue', JSON.stringify(offlineQueue));
        console.log("Offline mode: review cached locally.");
      } else {
        // Perform upsert (match user_id and card_id)
        supabase
          .from('user_card_progress')
          .upsert(progressRecord, { onConflict: 'user_id,card_id' })
          .then(({ error: upsertError }) => {
            if (upsertError) {
              console.error('Error upserting user card progress:', upsertError);
            }
          });

        // Log granular review history
        supabase
          .from('review_history')
          .insert([{
            user_id: userId,
            card_id: card.id,
            rating: rating
          }])
          .then(({ error: histError }) => {
            if (histError) {
              console.error('Error inserting review history:', histError);
            }
          });
      }
    }

    // Update active review queue: if rating is Again (0), recycle card to end of queue
    if (rating === 0) {
      setActiveQueue(prev => {
        const [first, ...rest] = prev;
        return [...rest, first];
      });
    } else {
      setActiveQueue(prev => prev.slice(1));
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
    if (tabId === 'vocab' && !isAdmin) {
      return;
    }
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
        furiganaMode={furiganaMode}
        onChangeFuriganaMode={setFuriganaMode}
        isAdmin={isAdmin}
        visible={navbarVisible}
        showNavbar={showNavbar}
        hideNavbarWithDelay={hideNavbarWithDelay}
        handleTouchActivity={handleTouchActivity}
      />

      {/* Main Content Area */}
      <main className={`flex-1 flex flex-col overflow-y-auto w-full transition-all duration-500 ease-in-out ${
        navbarVisible ? 'pt-16 md:pt-0 md:pl-64' : 'pt-0 md:pt-0 md:pl-0'
      } ${
        activeTab === 'grammar' 
          ? 'h-full justify-start items-stretch' 
          : 'px-3 sm:px-4 md:px-8 py-5 pb-24 md:pb-6 justify-center items-center'
      }`}>
        {isOffline && (
          <div className="w-full max-w-6xl mx-auto mb-4 p-3 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-between text-xs font-bold animate-pulse-subtle shadow-sm select-none">
            <div className="flex items-center gap-2">
              <span>📶</span>
              <span>Running in Offline Mode. reviews will be cached and auto-synced.</span>
            </div>
            <span className="text-[9px] bg-amber-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
              Offline 📴
            </span>
          </div>
        )}
        {activeTab === 'dashboard' && (
          <Dashboard
            stats={stats}
            vocabList={vocabList}
            reviewSessions={reviewSessions}
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
            furiganaMode={furiganaMode}
          />
        )}

        {activeTab === 'vocab' && isAdmin && (
          <VocabManager
            vocabList={vocabList}
            onImportVocab={handleImportVocab}
            onClearAll={handleClearAll}
            onLoadDemo={handleLoadDemo}
            onDeleteWord={handleDeleteWord}
            onAddWord={handleAddWord}
            onUpdateWord={handleUpdateWord}
            isAdmin={isAdmin}
            furiganaMode={furiganaMode}
          />
        )}

        {/* {activeTab === 'story' && (
          <StoryReader
            onAddWord={handleAddWord}
            vocabList={vocabList}
          />
        )} */}

        {activeTab === 'grammar' && (
          <GrammarDojo
            onGainXp={handleGainXp}
            vocabList={vocabList}
          />
        )}

        {activeTab === 'study' && (
          <StudyGuide
            vocabList={vocabList}
            onUpdateMnemonic={handleUpdateMnemonic}
            furiganaMode={furiganaMode}
          />
        )}


        {activeTab === 'kana' && (
          <KanaBoard 
            themeRegion={themeRegion} 
            themeMode={themeMode} 
          />
        )}

        {activeTab === 'kanji' && (
          <KanjiBoard 
            themeRegion={themeRegion} 
            themeMode={themeMode} 
            vocabList={vocabList}
          />
        )}
      </main>
    </div>
  );
}
