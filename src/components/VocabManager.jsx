import { useState, useRef, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { toKana } from 'wanakana';
import { renderFurigana } from '../utils/furiganaParser';

export default function VocabManager({ 
  vocabList, 
  onImportVocab, 
  onClearAll, 
  onLoadDemo, 
  onDeleteWord, 
  onAddWord, 
  onUpdateWord,
  isAdmin,
  furiganaMode
}) {
  const [jsonText, setJsonText] = useState('');
  const [csvText, setCsvText] = useState('');
  const [csvFile, setCsvFile] = useState(null);
  const [csvParsedResult, setCsvParsedResult] = useState(null);
  const [adminTab, setAdminTab] = useState('json'); // 'json', 'csv', or 'single'
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleCount, setVisibleCount] = useState(50);

  useEffect(() => {
    setVisibleCount(50);
  }, [searchTerm]);

  const speakJapanese = (text, customAudioUrl) => {
    if (customAudioUrl) {
      const audio = new Audio(customAudioUrl);
      audio.play().catch(err => {
        console.warn("Custom audio play failed, falling back to TTS:", err);
        speakJapaneseTTS(text);
      });
    } else {
      speakJapaneseTTS(text);
    }
  };

  const speakJapaneseTTS = (text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    utterance.rate = 0.9;
    const voices = window.speechSynthesis.getVoices();
    const jaVoice = voices.find(v => v.lang === 'ja-JP' || v.lang.startsWith('ja'));
    if (jaVoice) utterance.voice = jaVoice;
    window.speechSynthesis.speak(utterance);
  };

  // Individual word states
  const [singleHiragana, setSingleHiragana] = useState('');
  const [singleKanji, setSingleKanji] = useState('');
  const [singleRomaji, setSingleRomaji] = useState('');
  const [singleGroup, setSingleGroup] = useState('');
  const [singleEnglish, setSingleEnglish] = useState('');
  const [singleLesson, setSingleLesson] = useState('General');
  const [singleLessonMode, setSingleLessonMode] = useState('General');
  const [singleMnemonic, setSingleMnemonic] = useState('');
  const [singleContextJapanese, setSingleContextJapanese] = useState('');
  const [singleContextEnglish, setSingleContextEnglish] = useState('');
  const [minedParagraph, setMinedParagraph] = useState('');
  const [minedResults, setMinedResults] = useState([]);

  // Card Editing States
  const [editingWord, setEditingWord] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editHiragana, setEditHiragana] = useState('');
  const [editKanji, setEditKanji] = useState('');
  const [editRomaji, setEditRomaji] = useState('');
  const [editGroup, setEditGroup] = useState('');
  const [editEnglish, setEditEnglish] = useState('');
  const [editLesson, setEditLesson] = useState('General');
  const [editLessonMode, setEditLessonMode] = useState('General');
  const [editMnemonic, setEditMnemonic] = useState('');
  const [editContextJapanese, setEditContextJapanese] = useState('');
  const [editContextEnglish, setEditContextEnglish] = useState('');
  const [editAudioUrl, setEditAudioUrl] = useState('');
  const [editAudioFile, setEditAudioFile] = useState(null);
  const [editAudioBlob, setEditAudioBlob] = useState(null);
  const [editAudioPreviewUrl, setEditAudioPreviewUrl] = useState(null);
  const [editIsRecording, setEditIsRecording] = useState(false);

  // Custom audio upload states
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [singleAudioFile, setSingleAudioFile] = useState(null);

  // Bulk upload states
  const [bulkAudioFiles, setBulkAudioFiles] = useState([]);
  const [bulkLesson, setBulkLesson] = useState('General');
  const [bulkLessonMode, setBulkLessonMode] = useState('General');
  const [isUploading, setIsUploading] = useState(false);

  // Sync preset lesson modes
  useEffect(() => {
    if (singleLessonMode !== 'Custom') {
      setSingleLesson(singleLessonMode);
    }
  }, [singleLessonMode]);

  useEffect(() => {
    if (bulkLessonMode !== 'Custom') {
      setBulkLesson(bulkLessonMode);
    }
  }, [bulkLessonMode]);

  useEffect(() => {
    if (editLessonMode !== 'Custom') {
      setEditLesson(editLessonMode);
    }
  }, [editLessonMode]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        setSingleAudioFile(null); // Clear manual file if we record
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSingleAudioFile(file);
      setAudioUrl(URL.createObjectURL(file));
      setAudioBlob(null); // Clear recorded blob if we select a file
    }
  };

  const editMediaRecorderRef = useRef(null);
  const editAudioChunksRef = useRef([]);

  const startEditRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      editMediaRecorderRef.current = mediaRecorder;
      editAudioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          editAudioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(editAudioChunksRef.current, { type: 'audio/webm' });
        setEditAudioBlob(blob);
        setEditAudioPreviewUrl(URL.createObjectURL(blob));
        setEditAudioFile(null);
      };

      mediaRecorder.start();
      setEditIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Could not access microphone.");
    }
  };

  const stopEditRecording = () => {
    if (editMediaRecorderRef.current && editIsRecording) {
      editMediaRecorderRef.current.stop();
      editMediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setEditIsRecording(false);
    }
  };

  const handleEditFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditAudioFile(file);
      setEditAudioPreviewUrl(URL.createObjectURL(file));
      setEditAudioBlob(null);
    }
  };

  const handleStartEdit = (word) => {
    setEditingWord(word);
    setEditHiragana(word.hiragana || '');
    setEditKanji(word.kanji || '');
    setEditRomaji(word.romaji || '');
    setEditGroup(word.group || 'Noun');
    setEditEnglish(word.english || '');
    setEditMnemonic(word.mnemonic || '');
    setEditContextJapanese(word.context_japanese || '');
    setEditContextEnglish(word.context_english || '');
    setEditAudioUrl(word.audio_url || '');
    setEditAudioFile(null);
    setEditAudioBlob(null);
    setEditAudioPreviewUrl(word.audio_url || null);
    setEditIsRecording(false);
    
    // Set lesson modes
    const val = word.lesson || 'General';
    if (['N5', 'N4', 'General'].includes(val)) {
      setEditLessonMode(val);
      setEditLesson(val);
    } else {
      setEditLessonMode('Custom');
      setEditLesson(val);
    }
    
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsUploading(true);

    const sanitize = (text) => {
      if (!text) return '';
      return String(text).replace(/<[^>]*>/g, '').trim();
    };

    const cleanHiragana = sanitize(editHiragana);
    const cleanEnglish = sanitize(editEnglish);

    if (!cleanHiragana || !cleanEnglish) {
      setErrorMsg('Hiragana and English are required.');
      setIsUploading(false);
      return;
    }

    try {
      let vocalUrl = editAudioUrl;
      if (editAudioBlob || editAudioFile) {
        const publicUrl = await uploadAudioToSupabase(editAudioBlob || editAudioFile, cleanHiragana);
        if (publicUrl) {
          vocalUrl = publicUrl;
        }
      }

      const updatedWord = {
        id: editingWord.id,
        hiragana: cleanHiragana,
        kanji: sanitize(editKanji),
        romaji: sanitize(editRomaji),
        group: sanitize(editGroup),
        english: cleanEnglish,
        lesson: sanitize(editLesson) || 'General',
        mnemonic: sanitize(editMnemonic),
        context_japanese: sanitize(editContextJapanese) || null,
        context_english: sanitize(editContextEnglish) || null,
        audio_url: vocalUrl || null
      };

      await onUpdateWord(updatedWord);
      setSuccessMsg(`Successfully updated "${cleanHiragana}"!`);
      setShowEditModal(false);
      setEditingWord(null);
    } catch (err) {
      setErrorMsg(`Failed to update word: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const uploadAudioToSupabase = async (blobOrFile, wordText) => {
    try {
      const fileExt = blobOrFile.name ? blobOrFile.name.split('.').pop() : 'webm';
      const cleanWord = wordText.toLowerCase().replace(/[^a-z0-9]/g, '_');
      const fileName = `vocal_${Date.now()}_${cleanWord}.${fileExt}`;
      
      const { error } = await supabase.storage
        .from('vocals')
        .upload(fileName, blobOrFile, {
          cacheControl: '3600',
          upsert: true
        });
        
      if (error) throw error;
      
      const { data: publicUrlData } = supabase.storage
        .from('vocals')
        .getPublicUrl(fileName);
        
      return publicUrlData.publicUrl;
    } catch (err) {
      console.error("Failed to upload audio to Supabase Storage:", err);
      return null;
    }
  };

  const matchAudioToWord = (file, word) => {
    const fileNameClean = file.name.split('.')[0].toLowerCase().trim();
    const romajiClean = (word.romaji || '').toLowerCase().trim();
    const hiraganaClean = (word.hiragana || '').toLowerCase().trim();
    const kanjiClean = (word.kanji || '').toLowerCase().trim();
    const englishClean = (word.english || '').toLowerCase().replace(/[^a-z0-9]/g, '').trim();
    const fileNoSymbols = fileNameClean.replace(/[^a-z0-9]/g, '');

    return (
      romajiClean === fileNameClean ||
      hiraganaClean === fileNameClean ||
      kanjiClean === fileNameClean ||
      englishClean === fileNoSymbols ||
      romajiClean.replace(/[^a-z0-9]/g, '') === fileNoSymbols
    );
  };

  const sampleJson = `[
  {
    "hiragana": "ねこ",
    "kanji": "猫",
    "romaji": "neko",
    "group": "Noun",
    "english": "cat"
  },
  {
    "hiragana": "たべる",
    "kanji": "食べる",
    "romaji": "taberu",
    "group": "Ru-Verb (Group 2)",
    "english": "to eat"
  }
]`;

  const robustParseJSON = (text) => {
    // Normalize smart/curly quotes to standard straight quotes
    let sanitized = text
      .replace(/[\u201C\u201D]/g, '"')
      .replace(/[\u2018\u2019]/g, "'")
      .trim();

    if (!sanitized) return [];

    // 1. Try standard JSON.parse first
    try {
      const parsed = JSON.parse(sanitized);
      if (Array.isArray(parsed)) return parsed;
      if (typeof parsed === 'object' && parsed !== null) return [parsed];
    } catch {
      // Continue to cleanup fallbacks
    }

    // 2. Try wrapping raw object lists (e.g. comma-separated objects or trailing commas)
    let cleanText = sanitized;
    if (cleanText.startsWith('[')) {
      cleanText = cleanText.substring(1);
    }
    if (cleanText.endsWith(']')) {
      cleanText = cleanText.substring(0, cleanText.length - 1);
    }
    cleanText = cleanText.trim();
    if (cleanText.endsWith(',')) {
      cleanText = cleanText.substring(0, cleanText.length - 1).trim();
    }

    try {
      const parsed = JSON.parse(`[${cleanText}]`);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // Continue to regex-based parser
    }

    // 3. Regex-based bracket parsing for line-by-line or malformed lists
    const results = [];
    const matches = sanitized.match(/\{[^{}]*\}/g);
    if (matches && matches.length > 0) {
      for (const match of matches) {
        try {
          const item = JSON.parse(match);
          if (typeof item === 'object' && item !== null) {
            results.push(item);
          }
        } catch {
          // ignore individual parsing failure
        }
      }
    }

    if (results.length > 0) {
      return results;
    }

    throw new Error("Invalid format. Make sure each object is structured like: {\"hiragana\": \"...\", \"english\": \"...\"}");
  };

  const handleJsonSubmit = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    if (!jsonText.trim()) {
      setErrorMsg('Please paste some JSON first.');
      return;
    }

    try {
      const parsed = robustParseJSON(jsonText);
      if (parsed.length === 0) {
        setErrorMsg('No valid vocabulary objects found in the input.');
        return;
      }

      const invalidItem = parsed.find(
        (item) => typeof item !== 'object' || !item.hiragana || !item.english
      );

      if (invalidItem) {
        setErrorMsg('Each word must contain at least "hiragana" and "english" fields.');
        return;
      }

      setIsUploading(true);
      setErrorMsg(null);

      const sanitize = (text) => {
        if (!text) return '';
        return String(text).replace(/<[^>]*>/g, '').trim();
      };

      const updatedWords = [];
      let matchCount = 0;

      for (const item of parsed) {
        const word = {
          hiragana: sanitize(item.hiragana),
          kanji: sanitize(item.kanji || ''),
          romaji: sanitize(item.romaji || ''),
          group: sanitize(item.group || ''),
          english: sanitize(item.english),
          lesson: sanitize(item.lesson || '') || bulkLesson.trim() || 'General',
          mnemonic: sanitize(item.mnemonic || '')
        };

        const matchedFile = bulkAudioFiles.find(file => matchAudioToWord(file, word));

        if (matchedFile) {
          const publicUrl = await uploadAudioToSupabase(matchedFile, word.hiragana);
          if (publicUrl) {
            word.audio_url = publicUrl;
            matchCount++;
          }
        } else {
          word.audio_url = item.audio_url || null;
        }

        updatedWords.push(word);
      }

      const count = await onImportVocab(updatedWords);
      setSuccessMsg(`Successfully imported ${count} words! Associated ${matchCount} local vocals 🎙️`);
      setJsonText('');
      setBulkAudioFiles([]);
    } catch (e) {
      setErrorMsg(`Invalid JSON/Import: ${e.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCsvFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCsvFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target.result;
        setCsvText(text);
        processCSV(text);
      };
      reader.readAsText(file);
    }
  };

  const processCSV = (text) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    
    if (!text.trim()) {
      setCsvParsedResult(null);
      return;
    }
    
    try {
      const rows = parseCSV(text);
      if (rows.length < 2) {
        setErrorMsg('CSV file must contain a header row and at least one data row.');
        setCsvParsedResult(null);
        return;
      }
      
      const headers = rows[0].map(h => h.trim().toLowerCase());
      
      const hiraganaIdx = headers.indexOf('hiragana');
      const englishIdx = headers.indexOf('english');
      const kanjiIdx = headers.indexOf('kanji');
      const romajiIdx = headers.indexOf('romaji');
      const groupIdx = headers.indexOf('group');
      const lessonIdx = headers.indexOf('lesson');
      const mnemonicIdx = headers.indexOf('mnemonic');
      const audioUrlIdx = headers.indexOf('audio_url') !== -1 ? headers.indexOf('audio_url') : headers.indexOf('audiourl');
      const contextJaIdx = headers.indexOf('context_japanese') !== -1 ? headers.indexOf('context_japanese') : headers.indexOf('contextja');
      const contextEnIdx = headers.indexOf('context_english') !== -1 ? headers.indexOf('context_english') : headers.indexOf('contexten');

      if (hiraganaIdx === -1 || englishIdx === -1) {
        setErrorMsg('CSV must contain both "hiragana" and "english" columns in its header.');
        setCsvParsedResult(null);
        return;
      }

      const existingKeys = new Set(vocabList.map(c => `${c.hiragana.trim()}_${c.english.trim()}`.toLowerCase()));
      
      const validList = [];
      let malformedCount = 0;
      let duplicateCount = 0;
      const parsedRowsPreview = [];

      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (row.length === 1 && row[0] === '') continue; // Skip blank lines
        
        const hiragana = row[hiraganaIdx]?.trim() || '';
        const english = row[englishIdx]?.trim() || '';

        if (!hiragana || !english) {
          malformedCount++;
          continue;
        }

        const card = {
          hiragana,
          english,
          kanji: kanjiIdx !== -1 ? (row[kanjiIdx]?.trim() || '') : '',
          romaji: romajiIdx !== -1 ? (row[romajiIdx]?.trim() || '') : '',
          group: groupIdx !== -1 ? (row[groupIdx]?.trim() || 'Noun') : 'Noun',
          lesson: lessonIdx !== -1 ? (row[lessonIdx]?.trim() || 'General') : 'General',
          mnemonic: mnemonicIdx !== -1 ? (row[mnemonicIdx]?.trim() || '') : '',
          audio_url: audioUrlIdx !== -1 ? (row[audioUrlIdx]?.trim() || null) : null,
          context_japanese: contextJaIdx !== -1 ? (row[contextJaIdx]?.trim() || null) : null,
          context_english: contextEnIdx !== -1 ? (row[contextEnIdx]?.trim() || null) : null
        };

        const key = `${hiragana}_${english}`.toLowerCase();
        if (existingKeys.has(key)) {
          duplicateCount++;
        } else {
          validList.push(card);
        }

        if (parsedRowsPreview.length < 5) {
          parsedRowsPreview.push(card);
        }
      }

      setCsvParsedResult({
        total: rows.length - 1,
        valid: validList.length,
        malformed: malformedCount,
        duplicates: duplicateCount,
        validList,
        preview: parsedRowsPreview
      });

    } catch (e) {
      setErrorMsg(`CSV parsing error: ${e.message}`);
      setCsvParsedResult(null);
    }
  };

  const handleCsvSubmit = async () => {
    if (!csvParsedResult || csvParsedResult.validList.length === 0) {
      setErrorMsg('No new valid vocabulary to import.');
      return;
    }

    setIsUploading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const count = await onImportVocab(csvParsedResult.validList);
      setSuccessMsg(`Successfully imported ${count} cards from CSV!`);
      setCsvText('');
      setCsvFile(null);
      setCsvParsedResult(null);
    } catch (e) {
      setErrorMsg(`Import failed: ${e.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSingleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const sanitize = (text) => {
      if (!text) return '';
      return String(text).replace(/<[^>]*>/g, '').trim();
    };

    const cleanHiragana = sanitize(singleHiragana);
    const cleanEnglish = sanitize(singleEnglish);
    const cleanKanji = sanitize(singleKanji);
    const cleanRomaji = sanitize(singleRomaji);
    const cleanGroup = sanitize(singleGroup);
    const cleanLesson = sanitize(singleLesson) || 'General';
    const cleanMnemonic = sanitize(singleMnemonic);
    const cleanContextJapanese = sanitize(singleContextJapanese);
    const cleanContextEnglish = sanitize(singleContextEnglish);

    if (!cleanHiragana || !cleanEnglish) {
      setErrorMsg('Hiragana and English are required and cannot contain HTML tags.');
      return;
    }

    setIsUploading(true);

    try {
      const vocalUrl = (audioBlob || singleAudioFile) 
        ? await uploadAudioToSupabase(audioBlob || singleAudioFile, cleanHiragana)
        : null;

      const newWord = {
        hiragana: cleanHiragana,
        kanji: cleanKanji || undefined,
        romaji: cleanRomaji || undefined,
        group: cleanGroup || undefined,
        english: cleanEnglish,
        lesson: cleanLesson,
        audio_url: vocalUrl || null,
        mnemonic: cleanMnemonic || undefined,
        context_japanese: cleanContextJapanese || null,
        context_english: cleanContextEnglish || null
      };

      await onAddWord(newWord);
      setSuccessMsg(`Successfully added "${cleanHiragana}"!`);

      // Reset inputs
      setSingleHiragana('');
      setSingleKanji('');
      setSingleRomaji('');
      setSingleGroup('');
      setSingleEnglish('');
      setSingleLesson('General');
      setSingleMnemonic('');
      setSingleContextJapanese('');
      setSingleContextEnglish('');
      setAudioBlob(null);
      setSingleAudioFile(null);
      setAudioUrl(null);
    } catch (err) {
      setErrorMsg(`Failed to add word: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const hasKanji = (str) => /[\u4e00-\u9faf]/.test(str);

  const handleSentenceMine = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    if (!minedParagraph.trim()) {
      setErrorMsg('Please paste some Japanese text first.');
      return;
    }
    
    const cleanedText = minedParagraph.replace(/\[[^\s[\]]+\]/g, '');
    const regex = /([\u4e00-\u9faf]+[\u3040-\u309f]*|[\u30a0-\u30ff]+|[\u3040-\u309f]{2,})/g;
    const matches = cleanedText.match(regex) || [];
    
    const stopWords = new Set([
      'する', 'した', 'して', 'ある', 'ない', 'いる', 'いう', 'から', 'まで', 'いく', 'きた',
      'これ', 'それ', 'あれ', 'この', 'その', 'あの', 'ここ', 'そこ', 'あそこ', 'もの', 'こと',
      'とき', 'どう', 'こう', 'そう', 'ます'
    ]);
    
    const uniqueTokens = Array.from(new Set(matches.map(w => w.trim()))).filter(
      w => w.length > 0 && !stopWords.has(w)
    );
    
    const results = uniqueTokens.map(token => {
      const existing = vocabList.find(c => 
        (c.kanji && c.kanji.toLowerCase() === token.toLowerCase()) || 
        c.hiragana.toLowerCase() === token.toLowerCase()
      );
      
      return {
        word: token,
        status: existing ? 'saved' : 'new',
        existingData: existing || null,
        hiragana: hasKanji(token) ? '' : token,
        romaji: '',
        english: '',
        mnemonic: '',
        lesson: 'Mined',
        isExpanding: false
      };
    });
    
    setMinedResults(results);
    setSuccessMsg(`Parsed ${results.length} word candidates!`);
  };

  const handleSaveMinedWord = async (index, minedData) => {
    setErrorMsg(null);
    setSuccessMsg(null);

    const hira = minedData.hiragana.trim();
    const eng = minedData.english.trim();

    if (!hira || !eng) {
      setErrorMsg('Hiragana and English definition are required for saving.');
      return;
    }

    try {
      const newWord = {
        hiragana: hira,
        kanji: minedData.word,
        romaji: minedData.romaji.trim() || undefined,
        english: eng,
        lesson: minedData.lesson.trim() || 'Mined',
        mnemonic: minedData.mnemonic.trim() || undefined,
        group: 'Mined'
      };

      await onAddWord(newWord);
      setSuccessMsg(`Saved mined word "${minedData.word}"!`);

      setMinedResults(prev => prev.map((item, idx) => {
        if (idx === index) {
          return {
            ...item,
            status: 'saved',
            existingData: newWord,
            isExpanding: false
          };
        }
        return item;
      }));
    } catch (err) {
      setErrorMsg(`Failed to save mined word: ${err.message}`);
    }
  };

  const handleUpdateMinedField = (index, field, value) => {
    setMinedResults(prev => prev.map((item, idx) => {
      if (idx === index) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const toggleMinedExpand = (index) => {
    setMinedResults(prev => prev.map((item, idx) => {
      if (idx === index) {
        return { ...item, isExpanding: !item.isExpanding };
      }
      return item;
    }));
  };

  const filteredList = vocabList.filter(
    (item) =>
      item.hiragana.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.kanji && item.kanji.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.romaji && item.romaji.toLowerCase().includes(searchTerm.toLowerCase())) ||
      item.english.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.group && item.group.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.lesson && item.lesson.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.mnemonic && item.mnemonic.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-6xl mx-auto w-full px-2 py-4 md:py-8 animate-fade-in space-y-6 flex-1">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-claude-border pb-4 select-none">
        <div>
          <h1 className="text-3xl font-extrabold text-claude-text-heading claude-serif">Vocabulary Repository</h1>
          <p className="text-xs text-claude-text-muted">Import custom lists, input manual terms, or clear databases.</p>
        </div>
        {isAdmin && (
          <div className="flex gap-2">
            <button
              onClick={onLoadDemo}
              className="px-4 py-2 text-xs font-bold bg-claude-card border border-claude-border hover:border-claude-coral rounded-xl text-claude-text-heading transition-colors cursor-pointer"
            >
              Load Demo Cards 📚
            </button>
            <button
              onClick={onClearAll}
              className="px-4 py-2 text-xs font-bold bg-red-950/15 border border-red-900/10 hover:bg-red-900/20 rounded-xl text-red-500 transition-colors cursor-pointer"
            >
              Clear Database 🗑️
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input Forms */}
        {isAdmin && (
          <div className="lg:col-span-5 space-y-6">
            <div className="claude-panel border-claude-border rounded-3xl p-5 md:p-6 space-y-5 shadow-md flex-1">
              
              {/* Tab Selector Header */}
              <div className="flex bg-claude-sidebar/50 p-1 rounded-xl border border-claude-border select-none gap-1 flex-wrap md:flex-nowrap">
                <button
                  type="button"
                  onClick={() => { setAdminTab('json'); setErrorMsg(null); setSuccessMsg(null); }}
                  className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all cursor-pointer text-center ${
                    adminTab === 'json'
                      ? 'bg-claude-card text-claude-coral border border-claude-border/80 shadow-xs'
                      : 'text-claude-text-muted hover:text-claude-text'
                  }`}
                >
                  📥 JSON
                </button>
                <button
                  type="button"
                  onClick={() => { setAdminTab('csv'); setErrorMsg(null); setSuccessMsg(null); }}
                  className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all cursor-pointer text-center ${
                    adminTab === 'csv'
                      ? 'bg-claude-card text-claude-coral border border-claude-border/80 shadow-xs'
                      : 'text-claude-text-muted hover:text-claude-text'
                  }`}
                >
                  📁 CSV
                </button>
                <button
                  type="button"
                  onClick={() => { setAdminTab('single'); setErrorMsg(null); setSuccessMsg(null); }}
                  className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all cursor-pointer text-center ${
                    adminTab === 'single'
                      ? 'bg-claude-card text-claude-coral border border-claude-border/80 shadow-xs'
                      : 'text-claude-text-muted hover:text-claude-text'
                  }`}
                >
                  ✏️ Single
                </button>
                <button
                  type="button"
                  onClick={() => { setAdminTab('mine'); setErrorMsg(null); setSuccessMsg(null); }}
                  className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all cursor-pointer text-center ${
                    adminTab === 'mine'
                      ? 'bg-claude-card text-claude-coral border border-claude-border/80 shadow-xs'
                      : 'text-claude-text-muted hover:text-claude-text'
                  }`}
                >
                  ⛏️ Mine
                </button>
              </div>

              {/* Error or Success Messages (Unified inside card) */}
              {errorMsg && (
                <div className="text-xs text-red-600 bg-red-950/10 border border-red-900/10 rounded-lg p-2.5 flex items-start gap-2">
                  <span>⚠️</span>
                  <span>{errorMsg}</span>
                </div>
              )}
              {successMsg && (
                <div className="text-xs text-emerald-600 bg-emerald-950/10 border border-emerald-900/10 rounded-lg p-2.5 flex items-start gap-2 animate-bounce-subtle">
                  <span>✅</span>
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Tab Content 1: JSON Bulk Import */}
              {adminTab === 'json' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-1">
                    <h2 className="text-sm font-bold text-claude-text-heading flex items-center gap-1.5 claude-serif">
                      JSON Data Ingestion
                    </h2>
                    <p className="text-[10px] text-claude-text-muted leading-relaxed">
                      Paste a JSON array of words. Required: <code>hiragana</code>, <code>english</code>. Optional: <code>kanji</code>, <code>romaji</code>, <code>group</code>.
                    </p>
                  </div>

                  <textarea
                    value={jsonText}
                    onChange={(e) => setJsonText(e.target.value)}
                    placeholder='[\n  {\n    "hiragana": "いぬ",\n    "kanji": "犬",\n    "romaji": "inu",\n    "group": "Noun",\n    "english": "dog"\n  }\n]'
                    className="w-full h-44 bg-claude-sidebar/40 border border-claude-border focus:border-claude-coral/70 rounded-xl p-3 text-xs font-mono text-claude-text focus:outline-none transition-all resize-none"
                  />

                  {/* Bulk Lesson and Audio Match Selection */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-extrabold text-claude-text-muted tracking-wider block">Bulk Lesson / JLPT Level</label>
                      <div className="flex gap-1.5 mb-1.5 select-none">
                        {['N5', 'N4', 'General', 'Custom'].map((m) => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => setBulkLessonMode(m)}
                            className={`px-2.5 py-1.5 rounded-lg border text-[9px] font-black transition-all cursor-pointer ${
                              bulkLessonMode === m
                                ? 'bg-claude-coral/10 border-claude-coral text-claude-coral'
                                : 'bg-claude-card hover:bg-claude-sidebar border-claude-border text-claude-text-muted hover:text-claude-text-heading'
                            }`}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                      {bulkLessonMode === 'Custom' && (
                        <input
                          type="text"
                          value={bulkLesson}
                          onChange={(e) => setBulkLesson(e.target.value)}
                          placeholder="Type custom lesson..."
                          className="w-full px-3 py-2 bg-claude-sidebar/40 border border-claude-border rounded-xl text-xs focus:outline-none focus:border-claude-coral/70 text-claude-text animate-fade-in"
                        />
                      )}
                    </div>
                    <div>
                      <label className="text-[9px] uppercase font-extrabold text-claude-text-muted tracking-wider block mb-1">Select Vocals (Bulk)</label>
                      <input
                        type="file"
                        multiple
                        accept="audio/*"
                        onChange={(e) => setBulkAudioFiles(Array.from(e.target.files))}
                        id="bulk-audio-files"
                        className="hidden"
                      />
                      <label
                        htmlFor="bulk-audio-files"
                        className="w-full px-3 py-2 bg-claude-card hover:bg-claude-sidebar border border-claude-border text-claude-text-muted hover:text-claude-text-heading text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer h-[34px]"
                      >
                        📁 {bulkAudioFiles.length === 0 ? 'Select Files' : `${bulkAudioFiles.length} Loaded`}
                      </label>
                    </div>
                  </div>

                  <button
                    disabled={isUploading}
                    onClick={handleJsonSubmit}
                    className={`w-full py-3 bg-claude-coral hover:bg-claude-coral/95 text-white font-bold rounded-xl shadow-md transition-all text-xs cursor-pointer ${
                      isUploading ? 'opacity-50 cursor-not-allowed animate-pulse' : ''
                    }`}
                  >
                    {isUploading ? 'Uploading and Importing... ⚡' : 'Parse and Import Array ⚡'}
                  </button>

                  <details className="text-xs text-claude-text-muted">
                    <summary className="cursor-pointer hover:text-claude-text-heading font-semibold py-1">View Sample JSON Format</summary>
                    <pre className="mt-2 p-3 bg-claude-sidebar/20 border border-claude-border rounded-lg overflow-x-auto text-[9px] text-claude-coral font-mono">
                      {sampleJson}
                    </pre>
                  </details>
                </div>
              )}

              {/* Tab Content 2: CSV Bulk Import */}
              {adminTab === 'csv' && (
                <div className="space-y-4 animate-fade-in text-left">
                  <div className="space-y-1">
                    <h2 className="text-sm font-bold text-claude-text-heading flex items-center gap-1.5 claude-serif">
                      CSV Data Ingestion Pipeline
                    </h2>
                    <p className="text-[10px] text-claude-text-muted leading-relaxed">
                      Upload a CSV file or paste raw CSV text. Required columns: <code>hiragana</code>, <code>english</code>. 
                      Supports custom mappings, duplicate filtering, and real-time schema validation.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {/* CSV File Selector */}
                    <div>
                      <label className="text-[9px] uppercase font-extrabold text-claude-text-muted tracking-wider block mb-1">
                        Select CSV File
                      </label>
                      <input
                        type="file"
                        accept=".csv"
                        onChange={handleCsvFileChange}
                        id="csv-file-upload"
                        className="hidden"
                      />
                      <label
                        htmlFor="csv-file-upload"
                        className="w-full px-4 py-2 bg-claude-card hover:bg-claude-sidebar border border-claude-border text-claude-text-muted hover:text-claude-text-heading text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer h-10 shadow-xs"
                      >
                        📁 {csvFile ? csvFile.name : 'Choose CSV File'}
                      </label>
                    </div>

                    {/* CSV Text Paste Area */}
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-extrabold text-claude-text-muted tracking-wider block">
                        Or Paste Raw CSV Text
                      </label>
                      <textarea
                        value={csvText}
                        onChange={(e) => {
                          setCsvText(e.target.value);
                          processCSV(e.target.value);
                        }}
                        placeholder="hiragana,english,kanji,romaji,group,lesson,mnemonic,context_japanese,context_english&#10;いぬ,dog,犬,inu,Noun,General,Dog runs,犬が好き。,I like dogs."
                        className="w-full h-32 bg-claude-sidebar/40 border border-claude-border focus:border-claude-coral/70 rounded-xl p-3 text-xs font-mono text-claude-text focus:outline-none transition-all resize-none"
                      />
                    </div>
                  </div>

                  {/* Pre-Import Validation Banner */}
                  {csvParsedResult && (
                    <div className="space-y-4 animate-fade-in">
                      {/* Summary Banner */}
                      <div className="p-3 bg-claude-sidebar/55 border border-claude-border rounded-xl space-y-2 select-none">
                        <span className="text-[9px] font-extrabold text-claude-coral uppercase tracking-wider block">
                          🔍 Pre-Import Validation Report
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                          <div className="bg-claude-card p-2 rounded-lg border border-claude-border/40">
                            <span className="text-base font-black text-claude-text-heading block">{csvParsedResult.total}</span>
                            <span className="text-[8px] text-claude-text-muted uppercase font-bold">Total Detected</span>
                          </div>
                          <div className="bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                            <span className="text-base font-black text-emerald-600 dark:text-emerald-400 block">{csvParsedResult.valid}</span>
                            <span className="text-[8px] text-emerald-500 uppercase font-bold">Ready to Import</span>
                          </div>
                          <div className="bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
                            <span className="text-base font-black text-amber-600 dark:text-amber-500 block">{csvParsedResult.duplicates}</span>
                            <span className="text-[8px] text-amber-500 uppercase font-bold">Duplicates</span>
                          </div>
                          <div className="bg-red-500/10 p-2 rounded-lg border border-red-500/20">
                            <span className="text-base font-black text-red-500 block">{csvParsedResult.malformed}</span>
                            <span className="text-[8px] text-red-400 uppercase font-bold">Malformed</span>
                          </div>
                        </div>
                      </div>

                      {/* Preview Grid */}
                      {csvParsedResult.preview.length > 0 && (
                        <div className="space-y-1.5">
                          <span className="text-[9px] font-extrabold text-claude-text-muted uppercase tracking-wider block">
                            📋 Raw Row Preview (First 5 Items)
                          </span>
                          <div className="overflow-x-auto border border-claude-border rounded-xl">
                            <table className="min-w-full divide-y divide-claude-border text-[10px]">
                              <thead className="bg-claude-sidebar/40 font-bold text-claude-text-heading">
                                <tr>
                                  <th className="px-3 py-1.5 text-left">Japanese</th>
                                  <th className="px-3 py-1.5 text-left">Romaji</th>
                                  <th className="px-3 py-1.5 text-left">English</th>
                                  <th className="px-3 py-1.5 text-left">Group</th>
                                  <th className="px-3 py-1.5 text-left">Lesson</th>
                                  <th className="px-3 py-1.5 text-left">Mnemonic</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-claude-border bg-claude-card/30 text-claude-text">
                                {csvParsedResult.preview.map((row, idx) => (
                                  <tr key={idx} className="hover:bg-claude-sidebar/20">
                                    <td className="px-3 py-1.5 font-bold text-claude-text-heading japanese-serif">
                                      {row.kanji ? `${row.kanji} (${row.hiragana})` : row.hiragana}
                                    </td>
                                    <td className="px-3 py-1.5 font-mono text-claude-coral">{row.romaji}</td>
                                    <td className="px-3 py-1.5 font-semibold capitalize">{row.english}</td>
                                    <td className="px-3 py-1.5">{row.group}</td>
                                    <td className="px-3 py-1.5">{row.lesson}</td>
                                    <td className="px-3 py-1.5 truncate max-w-[120px]" title={row.mnemonic}>{row.mnemonic}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {/* Submit CSV */}
                      <button
                        disabled={isUploading || csvParsedResult.valid === 0}
                        onClick={handleCsvSubmit}
                        className={`w-full py-3 bg-claude-coral hover:bg-claude-coral/95 text-white font-bold rounded-xl shadow-md transition-all text-xs cursor-pointer ${
                          isUploading || csvParsedResult.valid === 0 ? 'opacity-50 cursor-not-allowed animate-pulse' : ''
                        }`}
                      >
                        {isUploading ? 'Ingesting CSV Pipeline... ⚡' : `Commit ${csvParsedResult.valid} Cards to DB ⚡`}
                      </button>
                    </div>
                  )}

                  <details className="text-xs text-claude-text-muted">
                    <summary className="cursor-pointer hover:text-claude-text-heading font-semibold py-1">View Expected CSV Mappings</summary>
                    <div className="mt-2 p-3 bg-claude-sidebar/20 border border-claude-border rounded-lg text-[10px] text-claude-text leading-relaxed space-y-1.5">
                      <p className="font-semibold text-claude-coral">Expected Header Fields:</p>
                      <ul className="list-disc pl-4 space-y-0.5 text-[9px]">
                        <li><code>hiragana</code> (Required) - e.g. ねこ</li>
                        <li><code>english</code> (Required) - e.g. cat</li>
                        <li><code>kanji</code> (Optional) - e.g. 猫</li>
                        <li><code>romaji</code> (Optional) - e.g. neko</li>
                        <li><code>group</code> (Optional) - e.g. Noun</li>
                        <li><code>lesson</code> (Optional) - e.g. General</li>
                        <li><code>mnemonic</code> (Optional) - Memory association trick</li>
                        <li><code>context_japanese</code> (Optional) - Context sentence</li>
                        <li><code>context_english</code> (Optional) - Translation of context sentence</li>
                      </ul>
                    </div>
                  </details>
                </div>
              )}

              {/* Tab Content 2: Add Single Word Form */}
              {adminTab === 'single' && (
                <form onSubmit={handleSingleSubmit} className="space-y-3.5 animate-fade-in">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[9px] uppercase font-extrabold text-claude-text-muted tracking-wider">Hiragana *</label>
                      <input
                        type="text"
                        required
                        value={singleHiragana}
                        onChange={(e) => setSingleHiragana(toKana(e.target.value, { IMEMode: true }))}
                        placeholder="たべる"
                        className="w-full px-3 py-2 bg-claude-sidebar/40 border border-claude-border rounded-xl text-xs focus:outline-none focus:border-claude-coral/70 text-claude-text"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] uppercase font-extrabold text-claude-text-muted tracking-wider">Kanji (Optional)</label>
                      <input
                        type="text"
                        value={singleKanji}
                        onChange={(e) => setSingleKanji(e.target.value)}
                        placeholder="食べる"
                        className="w-full px-3 py-2 bg-claude-sidebar/40 border border-claude-border rounded-xl text-xs focus:outline-none focus:border-claude-coral/70 text-claude-text"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[9px] uppercase font-extrabold text-claude-text-muted tracking-wider">Romaji (Optional)</label>
                      <input
                        type="text"
                        value={singleRomaji}
                        onChange={(e) => setSingleRomaji(e.target.value)}
                        placeholder="taberu"
                        className="w-full px-3 py-2 bg-claude-sidebar/40 border border-claude-border rounded-xl text-xs focus:outline-none focus:border-claude-coral/70 text-claude-text"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] uppercase font-extrabold text-claude-text-muted tracking-wider">Group (Optional)</label>
                      <input
                        type="text"
                        value={singleGroup}
                        onChange={(e) => setSingleGroup(e.target.value)}
                        placeholder="Verb Group 2"
                        className="w-full px-3 py-2 bg-claude-sidebar/40 border border-claude-border rounded-xl text-xs focus:outline-none focus:border-claude-coral/70 text-claude-text"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[9px] uppercase font-extrabold text-claude-text-muted tracking-wider">English Definition *</label>
                      <input
                        type="text"
                        required
                        value={singleEnglish}
                        onChange={(e) => setSingleEnglish(e.target.value)}
                        placeholder="to eat"
                        className="w-full px-3 py-2 bg-claude-sidebar/40 border border-claude-border rounded-xl text-xs focus:outline-none focus:border-claude-coral/70 text-claude-text"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-extrabold text-claude-text-muted tracking-wider block">Lesson / JLPT Level</label>
                      <div className="flex gap-1.5 mb-1.5 select-none">
                        {['N5', 'N4', 'General', 'Custom'].map((m) => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => setSingleLessonMode(m)}
                            className={`px-2.5 py-1.5 rounded-lg border text-[9px] font-black transition-all cursor-pointer ${
                              singleLessonMode === m
                                ? 'bg-claude-coral/10 border-claude-coral text-claude-coral'
                                : 'bg-claude-card hover:bg-claude-sidebar border-claude-border text-claude-text-muted hover:text-claude-text-heading'
                            }`}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                      {singleLessonMode === 'Custom' && (
                        <input
                          type="text"
                          required
                          value={singleLesson}
                          onChange={(e) => setSingleLesson(e.target.value)}
                          placeholder="Type custom lesson..."
                          className="w-full px-3 py-2 bg-claude-sidebar/40 border border-claude-border rounded-xl text-xs focus:outline-none focus:border-claude-coral/70 text-claude-text animate-fade-in"
                        />
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-[9px] uppercase font-extrabold text-claude-text-muted tracking-wider">Mnemonic / Learning Trick (Optional)</label>
                    <input
                      type="text"
                      value={singleMnemonic}
                      onChange={(e) => setSingleMnemonic(e.target.value)}
                      placeholder="e.g. eat your food at the table! (Taberu)"
                      className="w-full px-3 py-2 bg-claude-sidebar/40 border border-claude-border rounded-xl text-xs focus:outline-none focus:border-claude-coral/70 text-claude-text"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[9px] uppercase font-extrabold text-claude-text-muted tracking-wider">Context Sentence (Japanese - Optional)</label>
                      <input
                        type="text"
                        value={singleContextJapanese}
                        onChange={(e) => setSingleContextJapanese(e.target.value)}
                        placeholder="e.g. 毎朝6時に起[お]きます。"
                        className="w-full px-3 py-2 bg-claude-sidebar/40 border border-claude-border rounded-xl text-xs focus:outline-none focus:border-claude-coral/70 text-claude-text"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] uppercase font-extrabold text-claude-text-muted tracking-wider">Context Translation (English - Optional)</label>
                      <input
                        type="text"
                        value={singleContextEnglish}
                        onChange={(e) => setSingleContextEnglish(e.target.value)}
                        placeholder="e.g. I wake up at 6 every morning."
                        className="w-full px-3 py-2 bg-claude-sidebar/40 border border-claude-border rounded-xl text-xs focus:outline-none focus:border-claude-coral/70 text-claude-text"
                      />
                    </div>
                  </div>

                  {/* Vocal Audio Upload Section */}
                  <div className="p-3 bg-claude-sidebar/35 border border-claude-border/80 rounded-2xl space-y-2">
                    <label className="text-[9px] uppercase font-extrabold text-claude-text-muted tracking-wider block">Vocal Recording (Optional)</label>
                    
                    <div className="flex items-center gap-3">
                      {!isRecording ? (
                        <button
                          type="button"
                          onClick={startRecording}
                          className="px-3 py-1.5 bg-claude-coral/10 hover:bg-claude-coral/20 border border-claude-coral/30 hover:border-claude-coral/50 text-claude-coral text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          🎙️ Record Mic
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={stopRecording}
                          className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/40 text-red-500 text-xs font-bold rounded-lg animate-pulse transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          ⏹️ Stop
                        </button>
                      )}
                      
                      <div className="flex-1">
                        <input
                          type="file"
                          accept="audio/*"
                          onChange={handleFileChange}
                          id="single-audio-file"
                          className="hidden"
                        />
                        <label
                          htmlFor="single-audio-file"
                          className="px-3 py-1.5 bg-claude-card hover:bg-claude-sidebar border border-claude-border text-claude-text-muted hover:text-claude-text-heading text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer h-[32px]"
                        >
                          📁 Upload Vocal
                        </label>
                      </div>
                    </div>

                    {audioUrl && (
                      <div className="flex items-center justify-between bg-claude-card/50 border border-claude-border/50 rounded-xl p-1.5 select-none mt-1.5">
                        <audio src={audioUrl} controls className="h-6 w-[180px] shrink-0 max-w-[180px]" />
                        <button
                          type="button"
                          onClick={() => {
                            setAudioBlob(null);
                            setSingleAudioFile(null);
                            setAudioUrl(null);
                          }}
                          className="text-xs text-red-400 hover:text-red-500 p-1 hover:bg-red-950/25 rounded-md cursor-pointer"
                          title="Clear Vocal"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>

                  <button
                    disabled={isUploading}
                    type="submit"
                    className={`w-full py-2.5 mt-2 bg-claude-sidebar hover:bg-claude-card text-claude-text hover:text-claude-text-heading border border-claude-border font-bold rounded-xl transition-colors text-xs cursor-pointer ${
                      isUploading ? 'opacity-50 cursor-not-allowed animate-pulse' : ''
                    }`}
                  >
                    {isUploading ? 'Uploading Vocal... ⚡' : 'Add Card to Database'}
                  </button>
                </form>
              )}

              {/* Tab Content 4: Sentence Mining */}
              {adminTab === 'mine' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-1">
                    <h2 className="text-sm font-bold text-claude-text-heading flex items-center gap-1.5 claude-serif">
                      Sentence Mining Dojo ⛏️
                    </h2>
                    <p className="text-[10px] text-claude-text-muted leading-relaxed">
                      Paste Japanese subtitles, articles, or paragraphs here. We will extract individual words and check them against your deck to find terms you don't know yet!
                    </p>
                  </div>

                  <div className="space-y-2">
                    <textarea
                      value={minedParagraph}
                      onChange={(e) => setMinedParagraph(e.target.value)}
                      placeholder="日本語を勉強します。寿司を食べます。 (Paste Japanese here...)"
                      rows={5}
                      className="w-full bg-claude-sidebar/40 border border-claude-border rounded-2xl p-3 text-xs font-semibold focus:outline-none focus:border-claude-coral placeholder-claude-text-muted/65 text-claude-text leading-relaxed"
                    />
                    <button
                      type="button"
                      onClick={handleSentenceMine}
                      className="w-full py-2.5 bg-claude-coral hover:bg-claude-coral/95 text-white font-extrabold rounded-xl shadow-md transition-all text-xs cursor-pointer text-center"
                    >
                      Extract & Tokenize Words ⛏️
                    </button>
                  </div>

                  {minedResults.length > 0 && (
                    <div className="space-y-3 pt-2">
                      <div className="flex justify-between items-center px-1 border-b border-claude-border pb-1.5">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-claude-text-muted">
                          Extracted Candidates ({minedResults.length})
                        </span>
                        <button
                          type="button"
                          onClick={() => setMinedResults([])}
                          className="text-[9px] font-bold text-red-400 hover:text-red-500 cursor-pointer"
                        >
                          ✕ Clear
                        </button>
                      </div>

                      <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                        {minedResults.map((result, idx) => {
                          const isSaved = result.status === 'saved';
                          return (
                            <div
                              key={idx}
                              className={`p-2.5 rounded-xl border transition-all ${
                                isSaved
                                  ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                                  : 'bg-claude-card border-claude-border text-claude-text hover:border-claude-coral/40'
                              }`}
                            >
                              <div className="flex justify-between items-center gap-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-black japanese-serif">{result.word}</span>
                                  <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${
                                    isSaved
                                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                                      : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                                  }`}>
                                    {isSaved ? 'In Library 🟢' : 'New Candidate 🟡'}
                                  </span>
                                </div>

                                <div className="flex items-center gap-1.5">
                                  <a
                                    href={`https://jisho.org/search/${encodeURIComponent(result.word)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1 hover:bg-claude-sidebar rounded border border-transparent hover:border-claude-border text-[9px] font-bold flex items-center gap-1 transition-all cursor-pointer hover:text-claude-coral"
                                    title="Look up on Jisho.org"
                                  >
                                    🔍 Jisho
                                  </a>
                                  {!isSaved && (
                                    <button
                                      type="button"
                                      onClick={() => toggleMinedExpand(idx)}
                                      className="p-1 hover:bg-claude-sidebar rounded border border-transparent hover:border-claude-border text-[9px] font-black cursor-pointer transition-all hover:text-claude-coral"
                                    >
                                      {result.isExpanding ? '▲ Hide' : '➕ Mine'}
                                    </button>
                                  )}
                                </div>
                              </div>

                              {/* Expansion Form to Mine the word */}
                              {result.isExpanding && !isSaved && (
                                <div className="mt-2.5 pt-2.5 border-t border-claude-border/60 space-y-3 animate-fade-in text-claude-text">
                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <label className="text-[8px] uppercase font-extrabold text-claude-text-muted tracking-wider block mb-0.5">Reading (Hiragana) *</label>
                                      <input
                                        type="text"
                                        required
                                        value={result.hiragana}
                                        onChange={(e) => handleUpdateMinedField(idx, 'hiragana', toKana(e.target.value, { IMEMode: true }))}
                                        placeholder="e.g. すし"
                                        className="w-full px-2 py-1 bg-claude-sidebar border border-claude-border rounded-lg text-xs font-semibold text-claude-text-heading focus:outline-none focus:border-claude-coral"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-[8px] uppercase font-extrabold text-claude-text-muted tracking-wider block mb-0.5">Romaji (Optional)</label>
                                      <input
                                        type="text"
                                        value={result.romaji}
                                        onChange={(e) => handleUpdateMinedField(idx, 'romaji', e.target.value)}
                                        placeholder="e.g. sushi"
                                        className="w-full px-2 py-1 bg-claude-sidebar border border-claude-border rounded-lg text-xs font-semibold text-claude-text-heading focus:outline-none focus:border-claude-coral"
                                      />
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <label className="text-[8px] uppercase font-extrabold text-claude-text-muted tracking-wider block mb-0.5">English Definition *</label>
                                      <input
                                        type="text"
                                        required
                                        value={result.english}
                                        onChange={(e) => handleUpdateMinedField(idx, 'english', e.target.value)}
                                        placeholder="e.g. sushi"
                                        className="w-full px-2 py-1 bg-claude-sidebar border border-claude-border rounded-lg text-xs font-semibold text-claude-text-heading focus:outline-none focus:border-claude-coral"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-[8px] uppercase font-extrabold text-claude-text-muted tracking-wider block mb-0.5">Lesson Category</label>
                                      <input
                                        type="text"
                                        value={result.lesson}
                                        onChange={(e) => handleUpdateMinedField(idx, 'lesson', e.target.value)}
                                        placeholder="e.g. Mined"
                                        className="w-full px-2 py-1 bg-claude-sidebar border border-claude-border rounded-lg text-xs font-semibold text-claude-text-heading focus:outline-none focus:border-claude-coral"
                                      />
                                    </div>
                                  </div>

                                  <div>
                                    <label className="text-[8px] uppercase font-extrabold text-claude-text-muted tracking-wider block mb-0.5">Mnemonic trick (Optional)</label>
                                    <input
                                      type="text"
                                      value={result.mnemonic}
                                      onChange={(e) => handleUpdateMinedField(idx, 'mnemonic', e.target.value)}
                                      placeholder="Mnemonic trick details..."
                                      className="w-full px-2 py-1 bg-claude-sidebar border border-claude-border rounded-lg text-xs font-semibold text-claude-text-heading focus:outline-none focus:border-claude-coral"
                                    />
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => handleSaveMinedWord(idx, result)}
                                    className="w-full py-1.5 bg-claude-coral text-white text-[10px] font-black rounded-lg transition-all cursor-pointer text-center hover:bg-claude-coral/90 shadow-sm"
                                  >
                                    Save Mined Word to Library ⚡
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Right Column: Searchable Word List */}
        <div className={isAdmin ? "lg:col-span-7 space-y-4" : "lg:col-span-12 space-y-4"}>
          <div className="claude-panel border-claude-border rounded-3xl p-6 shadow-md flex-1 flex flex-col h-[600px]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-claude-text-heading flex items-center gap-2 claude-serif">
                <span>🗂️</span> Vocabulary List ({vocabList.length} Cards)
              </h2>
            </div>

            {/* Search Input */}
            <div className="relative mb-4">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-claude-text-muted">🔍</span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search hiragana, kanji, romaji, english..."
                className="w-full pl-9 pr-4 py-2.5 bg-claude-sidebar/40 border border-claude-border rounded-xl text-sm focus:outline-none focus:border-claude-coral/70 text-claude-text"
              />
            </div>

            {/* Scrollable list */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-2">
              {filteredList.length > 0 ? (
                <>
                  {filteredList.slice(0, visibleCount).map((word, index) => (
                    <div
                      key={index}
                      className="p-3 bg-claude-card/40 border border-claude-border/80 hover:border-claude-border rounded-xl flex justify-between items-center group transition-colors shadow-sm"
                    >
                      <div className="flex items-center gap-3 flex-grow">
                        <button
                          onClick={() => speakJapanese(word.hiragana, word.audio_url)}
                          className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs shrink-0 transition-all cursor-pointer shadow-xs ${
                            word.audio_url 
                              ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20' 
                              : 'bg-claude-sidebar border-claude-border text-claude-text hover:text-claude-coral hover:border-claude-coral/55'
                          }`}
                          title={word.audio_url ? "Play custom vocal recording 🎙️" : "Listen to pronunciation"}
                        >
                          🔊
                        </button>
                        <div className="space-y-1">
                          <div className="flex items-baseline gap-2 flex-wrap">
                            <span className="text-lg font-bold text-claude-text-heading japanese-serif">
                              {renderFurigana(word.kanji || word.hiragana, word.hiragana, furiganaMode)}
                            </span>
                            {word.kanji && furiganaMode === 'both' && !word.kanji.includes('[') && (
                              <span className="text-xs text-claude-text-muted">
                                ({word.hiragana}{word.romaji && ` / ${word.romaji}`})
                              </span>
                            )}
                            {!word.kanji && word.romaji && (
                              <span className="text-xs text-claude-text-muted">({word.romaji})</span>
                            )}
                            {word.group && (
                              <span className="text-[10px] font-semibold bg-claude-sidebar text-claude-coral px-2 py-0.5 rounded border border-claude-border">
                                {word.group}
                              </span>
                            )}
                            {word.lesson && (
                              <span className="text-[10px] font-semibold bg-claude-sidebar text-amber-500 px-2 py-0.5 rounded border border-claude-border">
                                📁 {word.lesson}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-claude-text">{word.english}</div>
                        </div>
                      </div>
                      {isAdmin && (
                        <div className="flex gap-1 shrink-0">
                          <button
                            onClick={() => handleStartEdit(word)}
                            className="text-claude-text-muted hover:text-claude-coral p-1.5 hover:bg-claude-sidebar rounded-lg transition-colors border border-transparent hover:border-claude-border md:opacity-0 md:group-hover:opacity-100 focus:opacity-100 cursor-pointer"
                            title="Edit card"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => onDeleteWord(word)}
                            className="text-claude-text-muted hover:text-rose-400 p-1.5 hover:bg-red-950/20 rounded-lg transition-colors border border-transparent hover:border-red-900/20 md:opacity-0 md:group-hover:opacity-100 focus:opacity-100 cursor-pointer"
                            title="Delete card"
                          >
                            🗑️
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                  {filteredList.length > visibleCount && (
                    <button
                      onClick={() => setVisibleCount(prev => prev + 50)}
                      className="w-full py-2.5 bg-claude-sidebar/55 hover:bg-claude-card text-claude-text-muted hover:text-claude-text-heading border border-claude-border border-dashed rounded-xl text-xs font-bold transition-all cursor-pointer text-center mt-2 shadow-xs"
                    >
                      Show More Cards (+50)
                    </button>
                  )}
                </>
              ) : (
                <div className="h-full flex flex-col justify-center items-center text-center p-8 text-claude-text-muted space-y-4">
                  {/* Thinking chibi mascot in empty state */}
                  <div className="w-20 h-20 bg-claude-sidebar border border-claude-border/80 rounded-full flex items-center justify-center overflow-hidden shrink-0 shadow-sm mx-auto">
                    <img 
                      src="https://api.dicebear.com/7.x/adventurer/svg?seed=Buster" 
                      className="w-14 h-14 object-cover scale-110" 
                      alt="Thinking chibi empty state" 
                    />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-claude-text-heading">Your Library is Empty</p>
                    <p className="text-xs text-claude-text-muted mt-1 max-w-[280px] mx-auto mb-3">
                      "I don't see any cards here! Load some demo words or paste custom JSON on the left to get us started." — Buster-kun
                    </p>
                    <button
                      type="button"
                      onClick={onLoadDemo}
                      className="px-4 py-2 bg-claude-coral/10 hover:bg-claude-coral/20 border border-claude-coral/25 text-claude-coral text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs hover:scale-[1.02] active:scale-[0.98] select-none"
                    >
                      ✨ Load Kyoto-Slate N5 Demo Deck
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Card Edit Modal Overlay */}
      {showEditModal && editingWord && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[100] flex items-center justify-center p-4 animate-fade-in select-none">
          {/* Backdrop click to close */}
          <div className="absolute inset-0 cursor-pointer" onClick={() => { setShowEditModal(false); setEditingWord(null); }} />
          
          <div className="bg-claude-card border border-claude-border rounded-3xl p-6 max-w-lg w-full relative z-10 animate-fade-in max-h-[90vh] overflow-y-auto shadow-2xl space-y-4 text-left">
            <div className="flex justify-between items-center border-b border-claude-border pb-3">
              <div>
                <h3 className="text-base font-black text-claude-text-heading claude-serif">Edit Vocabulary Card</h3>
                <p className="text-[10px] text-claude-text-muted">Modify card properties and commit updates directly to the database.</p>
              </div>
              <button 
                type="button"
                onClick={() => { setShowEditModal(false); setEditingWord(null); }}
                className="text-claude-text-muted hover:text-claude-text-heading text-sm font-black p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] uppercase font-extrabold text-claude-text-muted tracking-wider block mb-0.5">Hiragana *</label>
                  <input
                    type="text"
                    required
                    value={editHiragana}
                    onChange={(e) => setEditHiragana(toKana(e.target.value, { IMEMode: true }))}
                    placeholder="たべる"
                    className="w-full px-3 py-2 bg-claude-sidebar/40 border border-claude-border rounded-xl text-xs focus:outline-none focus:border-claude-coral text-claude-text-heading font-semibold"
                  />
                </div>
                <div>
                  <label className="text-[9px] uppercase font-extrabold text-claude-text-muted tracking-wider block mb-0.5">Kanji (Optional)</label>
                  <input
                    type="text"
                    value={editKanji}
                    onChange={(e) => setEditKanji(e.target.value)}
                    placeholder="食べる"
                    className="w-full px-3 py-2 bg-claude-sidebar/40 border border-claude-border rounded-xl text-xs focus:outline-none focus:border-claude-coral text-claude-text-heading font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] uppercase font-extrabold text-claude-text-muted tracking-wider block mb-0.5">Romaji (Optional)</label>
                  <input
                    type="text"
                    value={editRomaji}
                    onChange={(e) => setEditRomaji(e.target.value)}
                    placeholder="taberu"
                    className="w-full px-3 py-2 bg-claude-sidebar/40 border border-claude-border rounded-xl text-xs focus:outline-none focus:border-claude-coral text-claude-text-heading font-semibold"
                  />
                </div>
                <div>
                  <label className="text-[9px] uppercase font-extrabold text-claude-text-muted tracking-wider block mb-0.5">Group (Optional)</label>
                  <input
                    type="text"
                    value={editGroup}
                    onChange={(e) => setEditGroup(e.target.value)}
                    placeholder="Verb Group 2"
                    className="w-full px-3 py-2 bg-claude-sidebar/40 border border-claude-border rounded-xl text-xs focus:outline-none focus:border-claude-coral text-claude-text-heading font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] uppercase font-extrabold text-claude-text-muted tracking-wider block mb-0.5">English Definition *</label>
                  <input
                    type="text"
                    required
                    value={editEnglish}
                    onChange={(e) => setEditEnglish(e.target.value)}
                    placeholder="to eat"
                    className="w-full px-3 py-2 bg-claude-sidebar/40 border border-claude-border rounded-xl text-xs focus:outline-none focus:border-claude-coral text-claude-text-heading font-semibold"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-extrabold text-claude-text-muted tracking-wider block">Lesson / JLPT Level</label>
                  <div className="flex gap-1 mb-1 select-none">
                    {['N5', 'N4', 'General', 'Custom'].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setEditLessonMode(m)}
                        className={`px-2 py-1.5 rounded-lg border text-[8px] font-black transition-all cursor-pointer ${
                          editLessonMode === m
                            ? 'bg-claude-coral/10 border-claude-coral text-claude-coral'
                            : 'bg-claude-card hover:bg-claude-sidebar border-claude-border text-claude-text-muted hover:text-claude-text-heading'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                  {editLessonMode === 'Custom' && (
                    <input
                      type="text"
                      required
                      value={editLesson}
                      onChange={(e) => setEditLesson(e.target.value)}
                      placeholder="Type custom lesson..."
                      className="w-full px-3 py-2 bg-claude-sidebar/40 border border-claude-border rounded-xl text-xs focus:outline-none focus:border-claude-coral text-claude-text-heading font-semibold animate-fade-in"
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="text-[9px] uppercase font-extrabold text-claude-text-muted tracking-wider block mb-0.5">Mnemonic / Learning Trick</label>
                <textarea
                  value={editMnemonic}
                  onChange={(e) => setEditMnemonic(e.target.value)}
                  placeholder="Memory mnemonic trick..."
                  rows={2}
                  className="w-full px-3 py-2 bg-claude-sidebar/40 border border-claude-border rounded-xl text-xs focus:outline-none focus:border-claude-coral text-claude-text-heading font-semibold resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] uppercase font-extrabold text-claude-text-muted tracking-wider block mb-0.5">Context Sentence (Japanese)</label>
                  <input
                    type="text"
                    value={editContextJapanese}
                    onChange={(e) => setEditContextJapanese(e.target.value)}
                    placeholder="Context sentence..."
                    className="w-full px-3 py-2 bg-claude-sidebar/40 border border-claude-border rounded-xl text-xs focus:outline-none focus:border-claude-coral text-claude-text-heading font-semibold"
                  />
                </div>
                <div>
                  <label className="text-[9px] uppercase font-extrabold text-claude-text-muted tracking-wider block mb-0.5">Context Translation (English)</label>
                  <input
                    type="text"
                    value={editContextEnglish}
                    onChange={(e) => setEditContextEnglish(e.target.value)}
                    placeholder="Sentence translation..."
                    className="w-full px-3 py-2 bg-claude-sidebar/40 border border-claude-border rounded-xl text-xs focus:outline-none focus:border-claude-coral text-claude-text-heading font-semibold"
                  />
                </div>
              </div>

              {/* Vocal Audio Edit/Upload Section */}
              <div className="p-3 bg-claude-sidebar/35 border border-claude-border/80 rounded-2xl space-y-2">
                <label className="text-[9px] uppercase font-extrabold text-claude-text-muted tracking-wider block">Audio Vocal Clip</label>
                
                <div className="flex items-center gap-3">
                  {!editIsRecording ? (
                    <button
                      type="button"
                      onClick={startEditRecording}
                      className="px-3 py-1.5 bg-claude-coral/10 hover:bg-claude-coral/20 border border-claude-coral/30 hover:border-claude-coral/50 text-claude-coral text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      🎙️ Record New
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={stopEditRecording}
                      className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/40 text-red-500 text-xs font-bold rounded-lg animate-pulse transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      ⏹️ Stop
                    </button>
                  )}
                  
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={handleEditFileChange}
                      id="edit-audio-file"
                      className="hidden"
                    />
                    <label
                      htmlFor="edit-audio-file"
                      className="px-3 py-1.5 bg-claude-card hover:bg-claude-sidebar border border-claude-border text-claude-text-muted hover:text-claude-text-heading text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer h-[32px]"
                    >
                      📁 Upload New
                    </label>
                  </div>
                </div>

                {editAudioPreviewUrl && (
                  <div className="flex items-center justify-between bg-claude-card/50 border border-claude-border/50 rounded-xl p-1.5 select-none mt-1.5">
                    <audio src={editAudioPreviewUrl} controls className="h-6 w-[180px] shrink-0" />
                    <button
                      type="button"
                      onClick={() => {
                        setEditAudioBlob(null);
                        setEditAudioFile(null);
                        setEditAudioPreviewUrl(null);
                        setEditAudioUrl('');
                      }}
                      className="text-xs text-red-400 hover:text-red-500 p-1 hover:bg-red-950/25 rounded-md cursor-pointer font-bold"
                      title="Clear Vocal"
                    >
                      ✕ Clear Audio
                    </button>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-3 border-t border-claude-border">
                <button
                  type="submit"
                  disabled={isUploading}
                  className={`flex-1 py-3 bg-claude-coral hover:bg-claude-coral/95 text-white font-extrabold rounded-xl shadow-md transition-all text-xs cursor-pointer text-center ${
                    isUploading ? 'opacity-65 cursor-not-allowed animate-pulse' : ''
                  }`}
                >
                  {isUploading ? 'Saving... ⚡' : 'Save Changes ⚡'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowEditModal(false); setEditingWord(null); }}
                  className="flex-1 py-3 bg-claude-sidebar border border-claude-border hover:border-claude-text-heading text-claude-text font-bold rounded-xl transition-all text-xs cursor-pointer text-center"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function parseCSV(text) {
  const lines = [];
  let row = [""];
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const next = text[i+1];

    if (c === '"') {
      if (inQuotes && next === '"') {
        row[row.length - 1] += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',') {
      if (inQuotes) {
        row[row.length - 1] += c;
      } else {
        row.push("");
      }
    } else if (c === '\r' || c === '\n') {
      if (inQuotes) {
        row[row.length - 1] += c;
      } else {
        if (c === '\r' && next === '\n') {
          i++;
        }
        lines.push(row);
        row = [""];
      }
    } else {
      row[row.length - 1] += c;
    }
  }
  
  if (row.length > 1 || row[0] !== "") {
    lines.push(row);
  }
  
  return lines;
}
