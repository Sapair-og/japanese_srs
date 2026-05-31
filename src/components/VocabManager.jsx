import { useState, useRef } from 'react';
import { supabase } from '../utils/supabaseClient';
import { toKana } from 'wanakana';

export default function VocabManager({ vocabList, onImportVocab, onClearAll, onLoadDemo, onDeleteWord, onAddWord }) {
  const [jsonText, setJsonText] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

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
  const [singleMnemonic, setSingleMnemonic] = useState('');

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
  const [isUploading, setIsUploading] = useState(false);

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

      const updatedWords = [];
      let matchCount = 0;

      for (const item of parsed) {
        const word = { ...item };
        word.lesson = word.lesson?.trim() || bulkLesson.trim() || 'General';

        const matchedFile = bulkAudioFiles.find(file => matchAudioToWord(file, word));

        if (matchedFile) {
          const publicUrl = await uploadAudioToSupabase(matchedFile, word.hiragana);
          if (publicUrl) {
            word.audio_url = publicUrl;
            matchCount++;
          }
        } else {
          word.audio_url = word.audio_url || null;
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

  const handleSingleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!singleHiragana.trim() || !singleEnglish.trim()) {
      setErrorMsg('Hiragana and English are required.');
      return;
    }

    setIsUploading(true);

    try {
      const vocalUrl = (audioBlob || singleAudioFile) 
        ? await uploadAudioToSupabase(audioBlob || singleAudioFile, singleHiragana)
        : null;

      const newWord = {
        hiragana: singleHiragana.trim(),
        kanji: singleKanji.trim() || undefined,
        romaji: singleRomaji.trim() || undefined,
        group: singleGroup.trim() || undefined,
        english: singleEnglish.trim(),
        lesson: singleLesson.trim() || 'General',
        audio_url: vocalUrl || null,
        mnemonic: singleMnemonic.trim() || undefined
      };

      await onAddWord(newWord);
      setSuccessMsg(`Successfully added "${singleHiragana}"!`);

      // Reset inputs
      setSingleHiragana('');
      setSingleKanji('');
      setSingleRomaji('');
      setSingleGroup('');
      setSingleEnglish('');
      setSingleLesson('General');
      setSingleMnemonic('');
      setAudioBlob(null);
      setSingleAudioFile(null);
      setAudioUrl(null);
    } catch (err) {
      setErrorMsg(`Failed to add word: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input Forms */}
        <div className="lg:col-span-5 space-y-6">
          {/* JSON Ingestion Card */}
          <div className="claude-panel border-claude-border rounded-3xl p-6 space-y-4 shadow-md">
            <h2 className="text-lg font-bold text-claude-text-heading flex items-center gap-2 claude-serif">
              <span>📥</span> JSON Data Ingestion
            </h2>
            <p className="text-xs text-claude-text-muted leading-relaxed">
              Paste a JSON array of words. Required: <code>hiragana</code>, <code>english</code>. Optional: <code>kanji</code>, <code>romaji</code>, <code>group</code>.
            </p>

            <textarea
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              placeholder='[\n  {\n    "hiragana": "いぬ",\n    "kanji": "犬",\n    "romaji": "inu",\n    "group": "Noun",\n    "english": "dog"\n  }\n]'
              className="w-full h-40 bg-claude-sidebar/40 border border-claude-border focus:border-claude-coral/70 rounded-xl p-3 text-xs font-mono text-claude-text focus:outline-none transition-all resize-none"
            />

            {/* Error or Success Messages */}
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

            {/* Bulk Lesson and Audio Match Selection */}
            <div className="grid grid-cols-2 gap-3 py-1">
              <div>
                <label className="text-[10px] uppercase font-bold text-claude-text-muted tracking-wider block mb-1">Bulk Lesson Name</label>
                <input
                  type="text"
                  value={bulkLesson}
                  onChange={(e) => setBulkLesson(e.target.value)}
                  placeholder="General"
                  className="w-full px-3 py-2 bg-claude-sidebar/40 border border-claude-border rounded-xl text-xs focus:outline-none focus:border-claude-coral/70 text-claude-text"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-claude-text-muted tracking-wider block mb-1">Select Vocals (Bulk)</label>
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
                  📁 {bulkAudioFiles.length === 0 ? 'Select Files' : `${bulkAudioFiles.length} loaded`}
                </label>
              </div>
            </div>

            <button
              disabled={isUploading}
              onClick={handleJsonSubmit}
              className={`w-full py-3 bg-claude-coral hover:bg-claude-coral/95 text-white font-bold rounded-xl shadow-md transition-all text-sm cursor-pointer ${
                isUploading ? 'opacity-50 cursor-not-allowed animate-pulse' : ''
              }`}
            >
              {isUploading ? 'Uploading and Importing... ⚡' : 'Parse and Import Array ⚡'}
            </button>

            {/* Sample block */}
            <details className="text-xs text-claude-text-muted">
              <summary className="cursor-pointer hover:text-claude-text-heading font-semibold py-1">View Sample JSON Format</summary>
              <pre className="mt-2 p-3 bg-claude-sidebar/20 border border-claude-border rounded-lg overflow-x-auto text-[10px] text-claude-coral font-mono">
                {sampleJson}
              </pre>
            </details>
          </div>

          {/* Quick Add Single Word Form */}
          <div className="claude-panel border-claude-border rounded-3xl p-6 space-y-4 shadow-md">
            <h2 className="text-lg font-bold text-claude-text-heading flex items-center gap-2 claude-serif">
              <span>✏️</span> Add Individual Word
            </h2>

            <form onSubmit={handleSingleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-claude-text-muted tracking-wider">Hiragana *</label>
                  <input
                    type="text"
                    required
                    value={singleHiragana}
                    onChange={(e) => setSingleHiragana(toKana(e.target.value, { IMEMode: true }))}
                    placeholder="たべる"
                    className="w-full px-3 py-2 bg-claude-sidebar/40 border border-claude-border rounded-xl text-sm focus:outline-none focus:border-claude-coral/70 text-claude-text"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-claude-text-muted tracking-wider">Kanji (Optional)</label>
                  <input
                    type="text"
                    value={singleKanji}
                    onChange={(e) => setSingleKanji(e.target.value)}
                    placeholder="食べる"
                    className="w-full px-3 py-2 bg-claude-sidebar/40 border border-claude-border rounded-xl text-sm focus:outline-none focus:border-claude-coral/70 text-claude-text"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-claude-text-muted tracking-wider">Romaji (Optional)</label>
                  <input
                    type="text"
                    value={singleRomaji}
                    onChange={(e) => setSingleRomaji(e.target.value)}
                    placeholder="taberu"
                    className="w-full px-3 py-2 bg-claude-sidebar/40 border border-claude-border rounded-xl text-sm focus:outline-none focus:border-claude-coral/70 text-claude-text"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-claude-text-muted tracking-wider">Group (Optional)</label>
                  <input
                    type="text"
                    value={singleGroup}
                    onChange={(e) => setSingleGroup(e.target.value)}
                    placeholder="Verb Group 2"
                    className="w-full px-3 py-2 bg-claude-sidebar/40 border border-claude-border rounded-xl text-sm focus:outline-none focus:border-claude-coral/70 text-claude-text"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-claude-text-muted tracking-wider">English Definition *</label>
                  <input
                    type="text"
                    required
                    value={singleEnglish}
                    onChange={(e) => setSingleEnglish(e.target.value)}
                    placeholder="to eat"
                    className="w-full px-3 py-2 bg-claude-sidebar/40 border border-claude-border rounded-xl text-sm focus:outline-none focus:border-claude-coral/70 text-claude-text"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-claude-text-muted tracking-wider">Lesson Name</label>
                  <input
                    type="text"
                    value={singleLesson}
                    onChange={(e) => setSingleLesson(e.target.value)}
                    placeholder="General"
                    className="w-full px-3 py-2 bg-claude-sidebar/40 border border-claude-border rounded-xl text-sm focus:outline-none focus:border-claude-coral/70 text-claude-text"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-claude-text-muted tracking-wider">Mnemonic / Learning Trick (Optional)</label>
                <input
                  type="text"
                  value={singleMnemonic}
                  onChange={(e) => setSingleMnemonic(e.target.value)}
                  placeholder="e.g. eat your food at the table! (Taberu)"
                  className="w-full px-3 py-2 bg-claude-sidebar/40 border border-claude-border rounded-xl text-sm focus:outline-none focus:border-claude-coral/70 text-claude-text"
                />
              </div>

              {/* Vocal Audio Upload Section */}
              <div className="p-3.5 bg-claude-sidebar/35 border border-claude-border/80 rounded-2xl space-y-3">
                <label className="text-[10px] uppercase font-bold text-claude-text-muted tracking-wider block">Vocal Recording (Optional)</label>
                
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
                  <div className="flex items-center justify-between bg-claude-card/50 border border-claude-border/50 rounded-xl p-2 select-none">
                    <audio src={audioUrl} controls className="h-6 w-[200px] shrink-0 max-w-[200px]" />
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
                className={`w-full py-2.5 mt-2 bg-claude-sidebar hover:bg-claude-card text-claude-text hover:text-claude-text-heading border border-claude-border font-bold rounded-xl transition-colors text-sm cursor-pointer ${
                  isUploading ? 'opacity-50 cursor-not-allowed animate-pulse' : ''
                }`}
              >
                {isUploading ? 'Uploading Vocal... ⚡' : 'Add Card to Database'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Searchable Word List */}
        <div className="lg:col-span-7 space-y-4">
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
                filteredList.map((word, index) => (
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
                          {word.kanji ? (
                            <>
                              <span className="text-lg font-bold text-claude-text-heading japanese-serif">{word.kanji}</span>
                              <span className="text-xs text-claude-text-muted">
                                ({word.hiragana}{word.romaji && ` / ${word.romaji}`})
                              </span>
                            </>
                          ) : (
                            <>
                              <span className="text-lg font-bold text-claude-text-heading japanese-serif">{word.hiragana}</span>
                              {word.romaji && (
                                <span className="text-xs text-claude-text-muted">({word.romaji})</span>
                              )}
                            </>
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
                    <button
                      onClick={() => onDeleteWord(word)}
                      className="text-claude-text-muted hover:text-rose-400 p-1.5 hover:bg-red-950/20 rounded-lg transition-colors border border-transparent hover:border-red-900/20 md:opacity-0 md:group-hover:opacity-100 focus:opacity-100 cursor-pointer"
                      title="Delete card"
                    >
                      🗑️
                    </button>
                  </div>
                ))
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
                    <p className="text-xs text-claude-text-muted mt-1 max-w-[280px] mx-auto">
                      "I don't see any cards here! Load some demo words or paste custom JSON on the left to get us started." — Buster-kun
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
