import { useState } from 'react';

const stories = [
  {
    id: 'momotaro',
    title: '桃太郎 / Momotaro the Peach Boy',
    level: 'N5 / Beginner',
    description: 'A classic Japanese story about a brave boy born from a giant peach who fights ogres.',
    sentences: [
      {
        id: 1,
        japanese: 'むかしむかし、あるところに、おじいさんとおばあさんがいました。',
        ruby: 'むかしむかし、あるところに、おじいさんとおばあさんがいました。',
        romaji: 'Mukashi mukashi, aru tokoro ni, ojiisan to obaasan ga imashita.',
        english: 'Long, long ago, in a certain place, there lived an old man and an old woman.',
        vocab: [
          { word: 'むかしむかし', reading: '昔々', meaning: 'long long ago' },
          { word: 'おじいさん', reading: 'お爺さん', meaning: 'old man / grandfather' },
          { word: 'おばあさん', reading: 'お婆さん', meaning: 'old woman / grandmother' }
        ]
      },
      {
        id: 2,
        japanese: 'おじいさんは山へ芝刈りに、おばあさんは川へ洗濯に行きました。',
        ruby: 'おじいさんは<ruby>山<rt>やま</rt></ruby>へ<ruby>芝刈<rt>しばか</rt></ruby>りに、おばあさんは<ruby>川<rt>かわ</rt></ruby>へ<ruby>洗濯<rt>せんたく</rt></ruby>に<ruby>行<rt>い</rt></ruby>きました。',
        romaji: 'Ojiisan wa yama e shibakari ni, obaasan wa kawa e sentaku ni ikimashita.',
        english: 'The old man went to the mountain to gather firewood, and the old woman went to the river to wash clothes.',
        vocab: [
          { word: '山', reading: 'やま', meaning: 'mountain' },
          { word: '芝刈り', reading: 'しばかり', meaning: 'gathering firewood / cutting grass' },
          { word: '川', reading: 'かわ', meaning: 'river' },
          { word: '洗濯', reading: 'せんたく', meaning: 'laundry / washing' }
        ]
      },
      {
        id: 3,
        japanese: 'おばあさんが川で洗濯をしていると、大きな桃が流れてきました。',
        ruby: 'おばあさんが<ruby>川<rt>かわ</rt></ruby>で<ruby>洗濯<rt>せんたく</rt></ruby>をしていると、<ruby>大<rt>おお</rt></ruby>きな<ruby>桃<rt>もも</rt></ruby>が<ruby>流<rt>なが</rt></ruby>れてきました。',
        romaji: 'Obaasan ga kawa de sentaku o shite iru to, ookina momo ga nagarete kimashita.',
        english: 'While the old woman was washing clothes in the river, a giant peach came floating down.',
        vocab: [
          { word: '大きな', reading: 'おおきな', meaning: 'big / large' },
          { word: '桃', reading: 'もも', meaning: 'peach' },
          { word: '流れる', reading: 'ながれる', meaning: 'to float / flow' }
        ]
      },
      {
        id: 4,
        japanese: 'おばあさんは桃を家に持ち帰り、おじいさんと一緒に切りました。',
        ruby: 'おばあさんは<ruby>桃<rt>もも</rt></ruby>を<ruby>家<rt>いえ</rt></ruby>に<ruby>持<rt>も</rt></ruby>ち<ruby>帰<rt>かえ</rt></ruby>り、おじいさんと<ruby>一緒<rt>いっしょ</rt></ruby>に<ruby>切<rt>き</rt></ruby>りました。',
        romaji: 'Obaasan wa momo o ie ni mochikaeri, ojiisan to issho ni kirimashita.',
        english: 'The old woman took the peach back home, and cut it open together with the old man.',
        vocab: [
          { word: '家', reading: 'いえ', meaning: 'house / home' },
          { word: '持ち帰る', reading: 'もちかえる', meaning: 'to take home' },
          { word: '一緒', reading: 'いっしょ', meaning: 'together' },
          { word: '切る', reading: 'きる', meaning: 'to cut' }
        ]
      },
      {
        id: 5,
        japanese: 'すると、桃の中から元気な男の子が生まれました。',
        ruby: 'すると、<ruby>桃<rt>もも</rt></ruby>の<ruby>中<rt>なか</rt></ruby>から<ruby>元気<rt>げんき</rt></ruby>な<ruby>男<rt>おとこ</rt></ruby>の<ruby>子<rt>こ</rt></ruby>が<ruby>生<rt>う</rt></ruby>まれました。',
        romaji: 'Suruto, momo no naka kara genkina otokonoko ga umaremashita.',
        english: 'Then, out of the peach, a healthy baby boy was born.',
        vocab: [
          { word: '中', reading: 'なか', meaning: 'inside / middle' },
          { word: '元気', reading: 'げんき', meaning: 'healthy / energetic' },
          { word: '男の子', reading: 'おとこのこ', meaning: 'boy / male child' },
          { word: '生まれる', reading: 'うまれる', meaning: 'to be born' }
        ]
      }
    ]
  },
  {
    id: 'urashimataro',
    title: '浦島太郎 / Urashima Taro',
    level: 'N4 / Intermediate',
    description: 'A tale about a kind fisherman who saves a turtle, visits the Dragon Palace, and receives a mysterious box.',
    sentences: [
      {
        id: 1,
        japanese: '浦島太郎という漁師が、浜辺で子どもたちにいじめられている亀を助けました。',
        ruby: '<ruby>浦島太郎<rt>うらしまたろう</rt></ruby>という<ruby>漁師<rt>りょうし</rt></ruby>が、<ruby>浜辺<rt>はまべ</rt></ruby>で子どもたちにいじめられている<ruby>亀<rt>かめ</rt></ruby>を<ruby>助<rt>たす</rt></ruby>けました。',
        romaji: 'Urashima Tarō to iu ryōshi ga, hamabe de kodomotachi ni ijimerarete iru kame o tasukemashita.',
        english: 'A fisherman named Urashima Taro saved a turtle that was being bullied by children on the beach.',
        vocab: [
          { word: '漁師', reading: 'りょうし', meaning: 'fisherman' },
          { word: '浜辺', reading: 'はまべ', meaning: 'beach / seashore' },
          { word: 'いじめる', reading: '苛める', meaning: 'to bully / tease' },
          { word: '亀', reading: 'かめ', meaning: 'turtle' },
          { word: '助ける', reading: 'たすける', meaning: 'to save / rescue' }
        ]
      },
      {
        id: 2,
        japanese: '亀はお礼に、太郎を海の底にある竜宮城へ連れて行きました。',
        ruby: '<ruby>亀<rt>かめ</rt></ruby>はお<ruby>礼<rt>れい</rt></ruby>に、太郎を<ruby>海<rt>うみ</rt></ruby>の<ruby>底<rt>そこ</rt></ruby>にある<ruby>竜宮城<rt>りゅうぐうじょう</rt></ruby>へ<ruby>連<rt>つ</rt></ruby>れて<ruby>行<rt>い</rt></ruby>きました。',
        romaji: 'Kame wa orei ni, Tarō o umi no soko ni aru Ryūgū-jō e tsurete ikimashita.',
        english: 'In gratitude, the turtle took Taro to the Dragon Palace at the bottom of the sea.',
        vocab: [
          { word: 'お礼', reading: 'おれい', meaning: 'gratitude / thanks' },
          { word: '海', reading: 'うみ', meaning: 'sea / ocean' },
          { word: '底', reading: 'そこ', meaning: 'bottom / depth' },
          { word: '竜宮城', reading: 'りゅうぐうじょう', meaning: 'Dragon Palace' },
          { word: '連れて行く', reading: 'つれていく', meaning: 'to take someone along' }
        ]
      },
      {
        id: 3,
        japanese: '竜宮城では、乙姫様が太郎を美味しいごちそうで歓迎しました。',
        ruby: '<ruby>竜宮城<rt>りゅうぐうじょう</rt></ruby>では、<ruby>乙姫<rt>おとひめ</rt></ruby>さまが太郎を<ruby>美味<rt>おい</rt></ruby>しいごちそうで<ruby>歓迎<rt>かんげい</rt></ruby>しました。',
        romaji: 'Ryūgū-jō dewa, Otohime-sama ga Tarō o oishii gochisō de kangei shimashita.',
        english: 'At the Dragon Palace, Princess Otohime welcomed Taro with delicious feasts.',
        vocab: [
          { word: 'ごちそう', reading: '御馳走', meaning: 'feast / banquet' },
          { word: '歓迎', reading: 'かんげい', meaning: 'welcome / reception' }
        ]
      }
    ]
  },
  {
    id: 'tsuru',
    title: '鶴の恩返し / The Grateful Crane',
    level: 'N3 / Advanced',
    description: 'A beautiful story of a crane returning a favor to a poor man by weaving a valuable cloth, with a promise of privacy.',
    sentences: [
      {
        id: 1,
        japanese: '貧しい若者が、罠にかかった一羽の美しい鶴を助けて逃がしてやりました。',
        ruby: '<ruby>貧<rt>まず</rt></ruby>しい<ruby>若者<rt>わかもの</rt></ruby>が、<ruby>罠<rt>わな</rt></ruby>にかかった<ruby>一羽<rt>いちわ</rt></ruby>の<ruby>美<rt>うつく</rt></ruby>しい<ruby>鶴<rt>つる</rt></ruby>を<ruby>助<rt>たす</rt></ruby>けて<ruby>逃<rt>に</rt></ruby>がしてやりました。',
        romaji: 'Mazushii wakamono ga, wana ni kakatta ichi-wa no utsukushii tsuru o tasukete nigashite yarimashita.',
        english: 'A poor young man saved a beautiful crane caught in a trap and let it fly free.',
        vocab: [
          { word: '貧しい', reading: 'まずしい', meaning: 'poor / needy' },
          { word: '若者', reading: 'わかもの', meaning: 'young man' },
          { word: '罠', reading: 'わな', meaning: 'trap / snare' },
          { word: '美しい', reading: 'うつくしい', meaning: 'beautiful' },
          { word: '鶴', reading: 'つる', meaning: 'crane' }
        ]
      },
      {
        id: 2,
        japanese: '数日後、美しい娘がやってきて「私を妻にしてください」と頼みました。',
        ruby: '<ruby>数日後<rt>すうじつご</rt></ruby>、<ruby>美<rt>うつく</rt></ruby>しい<ruby>娘<rt>むすめ</rt></ruby>がやってきて「<ruby>私<rt>わたし</rt></ruby>を<ruby>妻<rt>つま</rt></ruby>にしてください」と<ruby>頼<rt>たの</rt></ruby>みました。',
        romaji: 'Sūjitsugo, utsukushii musume ga yattekite "Watashi o tsuma ni shite kudasai" to tanomimashita.',
        english: 'A few days later, a beautiful girl arrived and requested, "Please make me your wife."',
        vocab: [
          { word: '数日後', reading: 'すうじつご', meaning: 'a few days later' },
          { word: '娘', reading: 'むすめ', meaning: 'daughter / young lady' },
          { word: '妻', reading: 'つま', meaning: 'wife' },
          { word: '頼む', reading: 'たのむ', meaning: 'to request / ask' }
        ]
      },
      {
        id: 3,
        japanese: '娘は「織っている間は決して部屋を覗かないでください」と約束させました。',
        ruby: '<ruby>娘<rt>むすめ</rt></ruby>は「<ruby>織<rt>お</rt></ruby>っている<ruby>間<rt>あいだ</rt></ruby>は<ruby>決<rt>けっ</rt></ruby>して<ruby>部屋<rt>へや</rt></ruby>を<ruby>覗<rt>のぞ</rt></ruby>かないでください」と<ruby>約束<rt>やくそく</rt></ruby>させました。',
        romaji: 'Musume wa "Otte iru aida wa kesshite heya o nozokanaide kudasai" to yakusoku sasemashita.',
        english: 'The girl made him promise, "Please never look inside the room while I am weaving."',
        vocab: [
          { word: '織る', reading: 'おる', meaning: 'to weave' },
          { word: '間', reading: 'あいだ', meaning: 'while / period' },
          { word: '決して', reading: 'けっして', meaning: 'never / by no means' },
          { word: '覗く', reading: 'のぞく', meaning: 'to peek / look in' },
          { word: '約束', reading: 'やくそく', meaning: 'promise' }
        ]
      }
    ]
  }
];

export default function StoryReader({ onAddWord, vocabList }) {
  const [selectedStory, setSelectedStory] = useState(stories[0]);
  const [activeSentence, setActiveSentence] = useState(stories[0].sentences[0]);
  const [showFurigana, setShowFurigana] = useState(true);
  const [showRomaji, setShowRomaji] = useState(false);
  const [showEnglish, setShowEnglish] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  const handleStoryChange = (story) => {
    setSelectedStory(story);
    setActiveSentence(story.sentences[0]);
  };

  const handleAddFlashcard = async (vocab) => {
    const isDuplicate = vocabList.some(item => 
      item.word === vocab.word || item.kanji === vocab.reading
    );

    if (isDuplicate) {
      triggerToast(`" ${vocab.word} " is already in your SRS library! 📚`);
      return;
    }

    try {
      await onAddWord({
        word: vocab.word,
        translation: vocab.meaning,
        kana: vocab.reading,
        difficulty: selectedStory.level.includes('Beginner') ? 'easy' : 'hard'
      });
      triggerToast(`Saved " ${vocab.word} " to SRS library! 🎉`);
    } catch (err) {
      console.error(err);
      triggerToast('Failed to save flashcard.');
    }
  };

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  return (
    <div className="w-full max-w-5xl flex flex-col md:flex-row gap-6 animate-fade-in relative z-10 select-none items-stretch text-[#f2f0ea]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-[9999] bg-claude-card border-2 border-claude-coral/80 text-claude-coral font-bold text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
          <span>✨</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Left Panel: Story Selector & Reader Scroll */}
      <div className="flex-1 flex flex-col gap-5">
        {/* Story Selector Header */}
        <div className="claude-panel p-4 rounded-2xl flex flex-wrap gap-2 items-center justify-between">
          <div className="flex gap-2">
            {stories.map(s => (
              <button
                key={s.id}
                onClick={() => handleStoryChange(s)}
                className={`px-3 py-2 rounded-xl text-[10px] font-black tracking-wider uppercase border transition-all cursor-pointer ${
                  selectedStory.id === s.id
                    ? 'bg-claude-coral text-white border-transparent shadow'
                    : 'bg-claude-sidebar border-claude-border hover:bg-claude-card text-claude-text-muted hover:text-[#f2f0ea]'
                }`}
              >
                {s.id === 'momotaro' ? '🍑 ' : s.id === 'urashimataro' ? '🐢 ' : '鶴 '}
                {s.title.split('/')[0].trim()}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 pt-2 sm:pt-0">
            {/* Furigana Toggle */}
            <button
              onClick={() => setShowFurigana(!showFurigana)}
              className={`p-2 rounded-lg border text-[10px] font-bold cursor-pointer transition-colors ${
                showFurigana
                  ? 'bg-claude-coral/10 border-claude-coral text-claude-coral'
                  : 'bg-claude-sidebar border-claude-border text-claude-text-muted'
              }`}
              title="Toggle Furigana above Kanji"
            >
              ふり仮名 {showFurigana ? 'ON' : 'OFF'}
            </button>
            {/* Romaji Toggle */}
            <button
              onClick={() => setShowRomaji(!showRomaji)}
              className={`p-2 rounded-lg border text-[10px] font-bold cursor-pointer transition-colors ${
                showRomaji
                  ? 'bg-claude-coral/10 border-claude-coral text-claude-coral'
                  : 'bg-claude-sidebar border-claude-border text-claude-text-muted'
              }`}
              title="Toggle Romaji English guides"
            >
              Romaji {showRomaji ? 'ON' : 'OFF'}
            </button>
            {/* English Toggle */}
            <button
              onClick={() => setShowEnglish(!showEnglish)}
              className={`p-2 rounded-lg border text-[10px] font-bold cursor-pointer transition-colors ${
                showEnglish
                  ? 'bg-claude-coral/10 border-claude-coral text-claude-coral'
                  : 'bg-claude-sidebar border-claude-border text-claude-text-muted'
              }`}
              title="Toggle English Translation overlays"
            >
              English {showEnglish ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        {/* Story Content Reader Screen */}
        <div className="claude-panel p-6 rounded-3xl bg-claude-card border border-claude-border shadow-lg flex flex-col gap-6 relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-amber-400 via-claude-coral to-amber-400" />
          
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-black uppercase bg-claude-coral/10 text-claude-coral border border-claude-coral/25 px-2 py-0.5 rounded-full">
                {selectedStory.level}
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-[#f2f0ea] claude-serif leading-tight">
              {selectedStory.title}
            </h2>
            <p className="text-[10px] text-claude-text-muted leading-relaxed">
              {selectedStory.description}
            </p>
          </div>

          <hr className="border-claude-border/50" />

          {/* Graded Text Lines */}
          <div className="space-y-6 md:space-y-8 max-h-[360px] overflow-y-auto pr-1">
            {selectedStory.sentences.map((sentence) => {
              const isActive = activeSentence.id === sentence.id;
              return (
                <div
                  key={sentence.id}
                  onClick={() => setActiveSentence(sentence)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative group flex flex-col gap-2 ${
                    isActive
                      ? 'bg-claude-coral/5 border-claude-coral shadow-inner'
                      : 'bg-transparent border-transparent hover:bg-claude-sidebar/20 hover:border-claude-border/30'
                  }`}
                >
                  {/* Left Highlight Marker bar */}
                  {isActive && (
                    <div className="absolute left-0 inset-y-0.5 w-1 rounded-r-md bg-claude-coral" />
                  )}

                  {/* Japanese Line */}
                  <div className={`text-base md:text-lg leading-relaxed japanese-serif ${
                    showFurigana ? 'ruby-visible' : 'ruby-hidden'
                  } ${isActive ? 'text-claude-coral' : 'text-[#f2f0ea]'}`}>
                    <span className="font-extrabold text-xs opacity-50 mr-2 select-none font-sans">
                      {sentence.id}.
                    </span>
                    <span dangerouslySetInnerHTML={{ __html: sentence.ruby }} />
                  </div>

                  {/* Romaji Overlay */}
                  {showRomaji && (
                    <div className="text-[11px] font-semibold text-amber-500/80 italic leading-tight pl-5">
                      {sentence.romaji}
                    </div>
                  )}

                  {/* English Translation Overlay */}
                  {showEnglish && (
                    <div className="text-xs text-claude-text-muted leading-relaxed pl-5">
                      {sentence.english}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Panel: Selected Sentence Vocabulary Side list */}
      <div className="w-full md:w-80 flex flex-col items-stretch">
        <div className="claude-panel p-5 rounded-3xl h-full flex flex-col gap-4 relative overflow-hidden bg-claude-sidebar/30">
          <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-claude-coral/20 via-claude-coral/50 to-claude-coral/20" />
          
          <div className="space-y-1">
            <span className="text-[8px] font-black uppercase text-claude-coral tracking-widest block">
              Sentence Dictionary / 単語帳
            </span>
            <h3 className="text-xs font-black text-[#f2f0ea]">
              Vocabulary in Sentence {activeSentence.id}
            </h3>
          </div>

          <hr className="border-claude-border/50" />

          {/* Vocabulary items list */}
          <div className="flex-1 flex flex-col gap-3 overflow-y-auto max-h-[380px] md:max-h-none pr-1">
            {activeSentence.vocab && activeSentence.vocab.length > 0 ? (
              activeSentence.vocab.map((v, idx) => {
                const isSaved = vocabList.some(item => 
                  item.word === v.word || item.kanji === v.reading
                );

                return (
                  <div
                    key={idx}
                    className="p-3 bg-claude-card border border-claude-border hover:border-claude-coral/45 rounded-2xl flex items-center justify-between gap-3 group/item transition-all"
                  >
                    <div className="min-w-0">
                      <div className="flex items-baseline gap-1.5 flex-wrap">
                        <span className="font-extrabold text-sm text-[#f2f0ea] japanese-serif">
                          {v.word}
                        </span>
                        {v.word !== v.reading && (
                          <span className="text-[10px] font-bold text-claude-coral/90 select-none">
                            ({v.reading})
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-claude-text-muted mt-0.5 leading-tight truncate">
                        {v.meaning}
                      </p>
                    </div>

                    <button
                      onClick={() => handleAddFlashcard(v)}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border transition-all cursor-pointer ${
                        isSaved
                          ? 'bg-emerald-600/10 border-emerald-600/30 text-emerald-500 cursor-default'
                          : 'bg-claude-coral/10 hover:bg-claude-coral border-claude-coral/20 hover:border-transparent text-claude-coral hover:text-white active:scale-90'
                      }`}
                      title={isSaved ? "Saved to your deck" : "Import word as flashcard"}
                      disabled={isSaved}
                    >
                      {isSaved ? '✓' : '＋'}
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-claude-text-muted text-[10px] font-bold">
                No vocabulary words listed for this line.
              </div>
            )}
          </div>
          
          <div className="pt-2 text-center border-t border-claude-border/30">
            <span className="text-[8px] text-claude-text-muted font-semibold block leading-tight">
              💡 Tap lines inside story to swap vocab lists
            </span>
          </div>
        </div>
      </div>

      {/* Styled ruby furigana css visibility classes */}
      <style>{`
        .ruby-hidden ruby rt {
          display: none !important;
        }
        .ruby-visible ruby {
          ruby-position: over;
        }
        .ruby-visible ruby rt {
          font-size: 0.58em;
          letter-spacing: normal;
          opacity: 0.82;
          padding-bottom: 0.1em;
          user-select: none;
        }
      `}</style>
    </div>
  );
}
