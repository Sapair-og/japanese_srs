import { useState } from 'react';
import { generateMnemonic } from '../utils/mnemonicGenerator';
import { renderFurigana } from '../utils/furiganaParser';

export default function StudyGuide({ vocabList, onUpdateMnemonic, furiganaMode }) {
  const [selectedLesson, setSelectedLesson] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCardId, setEditingCardId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Pronounce voice trigger
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
    utterance.rate = 0.95;
    const voices = window.speechSynthesis.getVoices();
    const jaVoice = voices.find(v => v.lang === 'ja-JP' || v.lang.startsWith('ja'));
    if (jaVoice) utterance.voice = jaVoice;
    window.speechSynthesis.speak(utterance);
  };

  // Extract unique lessons sorted
  const lessons = Array.from(
    new Set(vocabList.map((item) => item.lesson || 'General'))
  ).sort((a, b) => {
    // Attempt numerical sorting if format is 'Lesson X'
    const numA = parseInt(a.replace(/^\D+/g, ''));
    const numB = parseInt(b.replace(/^\D+/g, ''));
    if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
    return a.localeCompare(b);
  });

  // Filter list
  const filteredList = vocabList.filter((item) => {
    const matchesLesson = selectedLesson === 'All' || (item.lesson || 'General') === selectedLesson;
    const cleanSearch = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !cleanSearch ||
      item.hiragana.toLowerCase().includes(cleanSearch) ||
      (item.kanji && item.kanji.toLowerCase().includes(cleanSearch)) ||
      (item.romaji && item.romaji.toLowerCase().includes(cleanSearch)) ||
      item.english.toLowerCase().includes(cleanSearch) ||
      (item.mnemonic && item.mnemonic.toLowerCase().includes(cleanSearch));
    
    return matchesLesson && matchesSearch;
  });

  const handleStartEdit = (item) => {
    setEditingCardId(item.id);
    setEditValue(item.mnemonic || generateMnemonic(item.hiragana, item.romaji, item.english));
  };

  const handleSaveMnemonic = async (item) => {
    setIsSaving(true);
    try {
      const success = await onUpdateMnemonic(item.id, editValue.trim());
      if (success) {
        setEditingCardId(null);
      } else {
        alert("Could not update mnemonic. If you haven't run the SQL migration query to add the 'mnemonic' column, please run: \n\nalter table public.vocabulary add column if not exists mnemonic text default '';");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 select-none animate-fade-in">
      {/* Top Header Card */}
      <div className="glass-panel rounded-3xl p-6 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md bg-claude-card">
        <div className="space-y-1.5">
          <h2 className="text-xl font-extrabold text-claude-text-heading block tracking-tight claude-serif">
            📖 Japanese Study Guide
          </h2>
          <p className="text-[10px] text-claude-text-muted leading-relaxed max-w-lg">
            Review vocabulary list parameters, listen to active pronunciation, and view or edit custom mnemonics (memory tricks) to lock in hard words.
          </p>
        </div>

        {/* Dropdown Filters and search */}
        <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center">
          {/* Lesson Select */}
          <div className="flex flex-col gap-1">
            <span className="text-[8px] font-extrabold uppercase tracking-widest text-claude-text-muted pl-0.5">Lesson Category</span>
            <select
              value={selectedLesson}
              onChange={(e) => setSelectedLesson(e.target.value)}
              className="px-3 py-2 bg-claude-sidebar border border-claude-border text-xs font-bold text-claude-text-heading rounded-xl cursor-pointer focus:outline-none focus:border-claude-coral transition-colors"
            >
              <option value="All">All Lessons ({vocabList.length})</option>
              {lessons.map((l) => (
                <option key={l} value={l}>
                  {l} ({vocabList.filter(item => (item.lesson || 'General') === l).length})
                </option>
              ))}
            </select>
          </div>

          {/* Search Term */}
          <div className="flex flex-col gap-1 flex-1 sm:w-56">
            <span className="text-[8px] font-extrabold uppercase tracking-widest text-claude-text-muted pl-0.5">Quick Search</span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search words, tricks..."
              className="px-3.5 py-2 bg-claude-sidebar border border-claude-border text-xs font-bold text-claude-text-heading rounded-xl focus:outline-none focus:border-claude-coral placeholder-claude-text-muted/60 transition-colors w-full"
            />
          </div>
        </div>
      </div>

      {/* Empty Database State */}
      {vocabList.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center flex flex-col items-center justify-center gap-4 bg-claude-card">
          <span className="text-4xl">📜</span>
          <h3 className="font-extrabold text-sm uppercase tracking-wider text-claude-text-heading claude-serif">
            Your Library is Empty
          </h3>
          <p className="text-[10px] text-claude-text-muted max-w-xs leading-relaxed">
            There are no vocabulary cards saved in your database yet. Go to the Library Manager to add cards, import JSON lists, or load Kyoto-Slate N5 demo data!
          </p>
        </div>
      ) : filteredList.length === 0 ? (
        /* Empty Filter Search State */
        <div className="glass-panel rounded-3xl p-10 text-center flex flex-col items-center justify-center gap-2 bg-claude-card">
          <span className="text-2xl">🔍</span>
          <p className="text-[10px] text-claude-text-muted">
            No vocabulary items match your search filters. Try selecting a different lesson or clearing your search term.
          </p>
        </div>
      ) : (
        /* Study Guide Table Container */
        <div className="glass-panel rounded-3xl overflow-hidden border border-claude-border shadow-md bg-claude-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-claude-border bg-claude-sidebar/55">
                  <th className="px-5 py-3 text-[9px] font-extrabold uppercase tracking-widest text-claude-text-muted w-1/4">Japanese Word</th>
                  <th className="px-5 py-3 text-[9px] font-extrabold uppercase tracking-widest text-claude-text-muted w-1/6">Romaji</th>
                  <th className="px-5 py-3 text-[9px] font-extrabold uppercase tracking-widest text-claude-text-muted w-1/5">Meaning</th>
                  <th className="px-5 py-3 text-[9px] font-extrabold uppercase tracking-widest text-claude-text-muted w-5/12">Mnemonic / Learning Trick</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-claude-border/50">
                {filteredList.map((item) => (
                  <tr key={item.id} className="hover:bg-claude-sidebar/20 transition-colors group">
                    {/* Word Character with Audio Play Button */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <button
                          onClick={() => speakJapanese(item.hiragana, item.audio_url)}
                          className="w-7 h-7 rounded-lg bg-claude-sidebar border border-claude-border hover:border-claude-coral/40 flex items-center justify-center text-xs hover:text-claude-coral transition-colors cursor-pointer"
                          title="Click to play pronunciation audio"
                        >
                          🔊
                        </button>
                        <div className="flex flex-col min-w-0">
                          <span className="text-base font-bold text-claude-text-heading leading-tight japanese-serif">
                            {renderFurigana(item.kanji || item.hiragana, item.hiragana, furiganaMode)}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Romaji */}
                    <td className="px-5 py-3.5 text-xs font-semibold text-claude-text-heading">
                      {item.romaji || '-'}
                    </td>

                    {/* Meaning */}
                    <td className="px-5 py-3.5">
                      <span className="text-xs font-bold text-claude-coral bg-claude-coral/5 px-2 py-1 rounded-md capitalize">
                        {item.english}
                      </span>
                    </td>

                    {/* Mnemonic / Learning Trick Row */}
                    <td className="px-5 py-3.5">
                      {editingCardId === item.id ? (
                        /* Editing Mnemonic Input Form */
                        <div className="flex items-center gap-1.5 w-full">
                          <textarea
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="flex-1 bg-claude-sidebar border border-claude-border rounded-lg px-2.5 py-1.5 text-xs text-claude-text-heading focus:outline-none focus:border-claude-coral resize-none max-h-16 w-full font-semibold"
                            maxLength={160}
                            autoFocus
                            placeholder="Add mnemonic, sound trigger, or keyword trick..."
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSaveMnemonic(item);
                              }
                            }}
                          />
                          <div className="flex flex-col gap-1">
                            <button
                              onClick={() => handleSaveMnemonic(item)}
                              disabled={isSaving}
                              className="w-7 h-7 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg flex items-center justify-center text-[10px] cursor-pointer disabled:opacity-50 transition-colors shadow-sm"
                              title="Save Mnemonic"
                            >
                              💾
                            </button>
                            <button
                              onClick={() => setEditingCardId(null)}
                              disabled={isSaving}
                              className="w-7 h-7 bg-claude-sidebar border border-claude-border hover:border-claude-border text-claude-text-heading rounded-lg flex items-center justify-center text-[10px] cursor-pointer transition-colors shadow-sm"
                              title="Cancel"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Standard Mnemonic View Block */
                        <div 
                          onClick={() => handleStartEdit(item)}
                          className="flex items-start justify-between gap-2.5 p-1.5 hover:bg-claude-sidebar/45 rounded-xl border border-transparent hover:border-claude-border/40 cursor-pointer group/item transition-all duration-200 min-h-8"
                          title="Click to edit study trick"
                        >
                          <p className="text-[10px] font-semibold text-claude-text leading-relaxed flex-1">
                            {item.mnemonic || generateMnemonic(item.hiragana, item.romaji, item.english)}
                          </p>
                          <span className="text-[10px] text-claude-text-muted/40 group-hover/item:opacity-100 opacity-0 transition-opacity pr-1 pt-0.5">
                            ✏️
                          </span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
