export const n5Lessons = [
  {
    id: 1,
    title: 'Topic Marker 「は」',
    concept: 'The particle は (pronounced "wa") marks the main topic of your sentence. It comes directly after the topic noun.',
    englishTemplate: 'I am a student.',
    sequenceTemplate: ['私', 'は', '学生', 'です'],
    defaultReplacements: {},
    tip: 'Subject (私) + Topic Marker (は) + Description (学生) + Copula (です - is/am).',
    pattern: 'Noun + wa (particle) + Noun + desu',
    meaning: 'to declare that something is another thing (A is B).'
  },
  {
    id: 2,
    title: 'Object Marker 「を」',
    concept: 'The particle を (pronounced "o") marks the direct object of the verb. It is placed after the noun that receives the action.',
    englishTemplate: 'I drink {DRINK}.',
    sequenceTemplate: ['私', 'は', '{DRINK}', 'を', '飲みます'],
    defaultReplacements: {
      '{DRINK}': { japanese: '水', english: 'water' }
    },
    category: 'drink',
    tip: 'Subject (私 は) + Object + Object Marker (を) + Verb (飲みます - drink).',
    pattern: 'Noun + o (particle) + Verb',
    meaning: 'to perform an action on a direct object.'
  },
  {
    id: 3,
    title: 'Direction Marker 「に」',
    concept: 'The particle に (pronounced "ni") marks the destination, direction, or time of movement, translated as "to" or "at".',
    englishTemplate: 'I go to {PLACE}.',
    sequenceTemplate: ['私', 'は', '{PLACE}', 'に', '行きます'],
    defaultReplacements: {
      '{PLACE}': { japanese: '学校', english: 'school' }
    },
    category: 'place',
    tip: 'Subject (私 は) + Destination + Direction Marker (に) + Motion Verb (行きます - go).',
    pattern: 'Noun (Place) + ni (particle) + Motion Verb',
    meaning: 'to state the destination or direction of movement.'
  },
  {
    id: 4,
    title: 'Inanimate Existence 「があります」',
    concept: 'Use があります to say "there is" or "to have" for inanimate objects, plants, or abstract things.',
    englishTemplate: 'There is {FOOD}.',
    sequenceTemplate: ['ここに', '{FOOD}', 'が', 'あります'],
    defaultReplacements: {
      '{FOOD}': { japanese: '寿司', english: 'sushi' }
    },
    category: 'food',
    tip: 'Location (ここに - here) + Inanimate Noun + Subject Marker (が) + Existence Verb (あります).',
    pattern: 'Noun (Inanimate) + ga (particle) + arimasu',
    meaning: 'to say that a non-living thing exists or is present.'
  },
  {
    id: 5,
    title: 'Animate Existence 「がいます」',
    concept: 'Use がいます to say "there is" or "to have" for living things like humans, animals, or pets.',
    englishTemplate: 'There is a friend.',
    sequenceTemplate: ['ここに', '友達', 'が', 'います'],
    defaultReplacements: {},
    tip: 'Location (ここに - here) + Animate Noun (友達) + Subject Marker (が) + Existence Verb (います).',
    pattern: 'Noun (Animate) + ga (particle) + imasu',
    meaning: 'to say that a living thing (person or animal) exists or is present.'
  },
  {
    id: 6,
    title: 'Action in Progress 「ています」',
    concept: 'Add ています to the Te-form of a verb to express an action currently happening right now (continuous progressive).',
    englishTemplate: 'I am drinking {DRINK}.',
    sequenceTemplate: ['私', 'は', '{DRINK}', 'を', '飲んで', 'います'],
    defaultReplacements: {
      '{DRINK}': { japanese: '水', english: 'water' }
    },
    category: 'drink',
    tip: 'Subject (私 は) + Object + Object Marker (を) + Verb Te-form (飲んで) + auxiliary (います).',
    pattern: 'Verb (Te-form) + imasu',
    meaning: 'to state that an action is currently in progress (am/is/are doing).'
  },
  {
    id: 7,
    title: 'Polite Invitation 「ませんか」',
    concept: 'Change a verb to its negative question form ませんか to make a polite invitation or suggestion to do something together.',
    englishTemplate: 'Won\'t you eat {FOOD} together?',
    sequenceTemplate: ['一緒', 'に', '{FOOD}', 'を', '食べませんか'],
    defaultReplacements: {
      '{FOOD}': { japanese: '寿司', english: 'sushi' }
    },
    category: 'food',
    tip: 'Together (一緒 に) + Object + Object Marker (を) + Polite Negative invitation (食べませんか).',
    pattern: 'Verb (Masu-stem) + masenka',
    meaning: 'to make a polite invitation to do something together ("won\'t you?").'
  },
  {
    id: 8,
    title: 'Polite Request 「てください」',
    concept: 'Combine the Te-form of a verb with ください to make a polite command or request, translated as "please do".',
    englishTemplate: 'Please eat {FOOD}.',
    sequenceTemplate: ['{FOOD}', 'を', '食べて', 'ください'],
    defaultReplacements: {
      '{FOOD}': { japanese: '寿司', english: 'sushi' }
    },
    category: 'food',
    tip: 'Object + Object Marker (を) + Verb Te-form (食べて) + Request helper (ください).',
    pattern: 'Verb (Te-form) + kudasai',
    meaning: 'to make a polite request or ask someone to do something.'
  },
  {
    id: 9,
    title: 'Prohibition 「てはいけません」',
    concept: 'Combine the Te-form of a verb with はいけません to express a strong prohibition, translated as "must not do".',
    englishTemplate: 'You must not drink {DRINK}.',
    sequenceTemplate: ['{DRINK}', 'を', '飲ん', 'で', 'は', 'いけません'],
    defaultReplacements: {
      '{DRINK}': { japanese: '水', english: 'water' }
    },
    category: 'drink',
    tip: 'Object + Object Marker (を) + Verb Te-form (飲んで) + Prohibition particles (はいけません).',
    pattern: 'Verb (Te-form) + wa (particle) + ikemasen',
    meaning: 'to express a strong prohibition or say that someone must not do something.'
  },
  {
    id: 10,
    title: 'Reason 「から」',
    concept: 'Add から directly after a polite clause (ends in です or ます) to explain the cause or reason of a subsequent action.',
    englishTemplate: 'Because I like {DRINK}, I drink it.',
    sequenceTemplate: ['{DRINK}', 'が', '好き', 'ですから', '飲みます'],
    defaultReplacements: {
      '{DRINK}': { japanese: '水', english: 'water' }
    },
    category: 'drink',
    tip: 'Subject (が) + Adjective (好きです) + Reason particle (から) + Verb (飲みます).',
    pattern: 'Clause (Reason) + kara (particle) + Clause (Result)',
    meaning: 'to explain the reason or cause of an action ("because/since").'
  },
  {
    id: 11,
    title: 'Conjunction 「が」',
    concept: 'Connect two clauses with が to mean "but" or "however". It is placed directly after the polite end of the first clause.',
    englishTemplate: 'Japanese is difficult, but interesting.',
    sequenceTemplate: ['日本語', 'は', '難しい', 'ですが', '面白い', 'です'],
    defaultReplacements: {},
    tip: 'Topic (日本語 は) + Adj 1 (難しい) + Contrast copula (ですが) + Adj 2 (面白い) + Copula (です).',
    pattern: 'Clause 1 + desu ga (particle) + Clause 2',
    meaning: 'to connect two sentences or thoughts in contrast ("but/however").'
  },
  {
    id: 12,
    title: 'Also Marker 「も」',
    concept: 'The particle も replaces は or が to mean "also" or "too" when adding similar subjects or objects.',
    englishTemplate: 'I also eat {FOOD}.',
    sequenceTemplate: ['私', 'も', '{FOOD}', 'を', '食べます'],
    defaultReplacements: {
      '{FOOD}': { japanese: '寿司', english: 'sushi' }
    },
    category: 'food',
    tip: 'Subject + Also (も) + Object + Object Marker (を) + Verb (食べます).',
    pattern: 'Noun + mo (particle) + Verb',
    meaning: 'to indicate that something or someone also performs an action ("also/too").'
  },
  {
    id: 13,
    title: 'Possessive 「の」',
    concept: 'The particle の links two nouns to show possession, belonging, or category. The first noun modifies the second.',
    englishTemplate: 'This is my school.',
    sequenceTemplate: ['これ', 'は', '私', 'の', '学校', 'です'],
    defaultReplacements: {},
    tip: 'Pronoun (これ) + wa (は) + Owner (私) + no (の) + Possession (学校) + desu (です).',
    pattern: 'Noun (Owner) + no (particle) + Noun',
    meaning: 'to show possession or link two nouns together ("A\'s B" or "B of A").'
  },
  {
    id: 14,
    title: 'Location of Action 「で」',
    concept: 'The particle で indicates the location where an action takes place. Place it after the location noun.',
    englishTemplate: 'I eat {FOOD} at school.',
    sequenceTemplate: ['私', 'は', '学校', 'で', '{FOOD}', 'を', '食べます'],
    defaultReplacements: {
      '{FOOD}': { japanese: '寿司', english: 'sushi' }
    },
    category: 'food',
    tip: 'Subject + Location + de (で) + Object + o (を) + Verb (食べます).',
    pattern: 'Noun (Location) + de (particle) + Verb',
    meaning: 'to specify the location where an active action takes place ("at" or "in").'
  },
  {
    id: 15,
    title: 'Means / Instrument 「で」',
    concept: 'The particle で can also indicate the tool, method, language, or means by which an action is performed.',
    englishTemplate: 'I go to school by train.',
    sequenceTemplate: ['私', 'は', '電車', 'で', '学校', 'に', '行きます'],
    defaultReplacements: {},
    tip: 'Subject + Tool (電車) + de (で) + Destination (学校) + ni (に) + Motion Verb (行きます).',
    pattern: 'Noun (Means) + de (particle) + Verb',
    meaning: 'to indicate the tool, instrument, method, or vehicle used to perform an action ("by" or "with").'
  },
  {
    id: 16,
    title: 'Companion 「と」',
    concept: 'The particle と is placed after a person or animal to indicate that you do an action together with them.',
    englishTemplate: 'I go to school with my friend.',
    sequenceTemplate: ['私', 'は', '友達', 'と', '学校', 'に', '行きます'],
    defaultReplacements: {},
    tip: 'Subject + Companion (友達) + to (と) + Destination + ni (に) + Motion Verb.',
    pattern: 'Noun (Person) + to (particle) + Verb',
    meaning: 'to show that an action is performed together with a companion ("with").'
  },
  {
    id: 17,
    title: 'Noun Connector 「と」',
    concept: 'Use と to connect nouns in an exhaustive list, meaning "and". It comes after each listed noun except the last.',
    englishTemplate: 'There is sushi and water.',
    sequenceTemplate: ['ここに', '寿司', 'と', '水', 'が', 'あります'],
    defaultReplacements: {},
    tip: 'Noun 1 (寿司) + to (と) + Noun 2 (水) + ga (が) + existence verb (あります).',
    pattern: 'Noun 1 + to (particle) + Noun 2',
    meaning: 'to link nouns together in a complete, exhaustive list ("and").'
  },
  {
    id: 18,
    title: 'Attribute Marker 「が」',
    concept: 'Use が after the target of likes, dislikes, capabilities, or desires (e.g. 好き, 嫌い, 上手, 欲しい).',
    englishTemplate: 'I like {FOOD}.',
    sequenceTemplate: ['私', 'は', '{FOOD}', 'が', '好き', 'です'],
    defaultReplacements: {
      '{FOOD}': { japanese: '寿司', english: 'sushi' }
    },
    category: 'food',
    tip: 'Subject + Topic (は) + Target (寿司) + ga (が) + Adjective (好き) + desu (です).',
    pattern: 'Noun (Target) + ga (particle) + Adjective / Desiderative',
    meaning: 'to mark the target object of an emotion, desire, or capability.'
  },
  {
    id: 19,
    title: 'Double Subject 「は...が」',
    concept: 'Structure topics and their specific attributes. The main topic takes は, while the specific sub-attribute takes が.',
    englishTemplate: 'As for Japan, the food is delicious.',
    sequenceTemplate: ['日本', 'は', '食べ物', 'が', '美味しい', 'です'],
    defaultReplacements: {},
    tip: 'Main Topic (日本 は) + Sub-attribute (食べ物) + ga (が) + Adjective (美味しい) + desu.',
    pattern: 'Noun (Topic) + wa (particle) + Noun (Sub-Attribute) + ga (particle) + Adjective',
    meaning: 'to state a topic and specify a specific attribute or feature of that topic.'
  },
  {
    id: 20,
    title: 'Specific Time 「に」',
    concept: 'Place the particle に after specific, numerical times (like hours, months, years) to state when an action occurs.',
    englishTemplate: 'I will go to school at 8 o\'clock.',
    sequenceTemplate: ['八時', 'に', '学校', 'に', '行きます'],
    defaultReplacements: {},
    tip: 'Numerical Time (八時 - 8:00) + ni (に) + Destination + ni (に) + Verb (行きます).',
    pattern: 'Noun (Time) + ni (particle) + Verb',
    meaning: 'to indicate the specific time at which an event or action occurs ("at", "on", or "in").'
  },
  {
    id: 21,
    title: 'Approximate Time 「ごろ」',
    concept: 'Attach ごろ directly to a time noun to mean "around" or "approximately" that specific clock time.',
    englishTemplate: 'I go to school around 8 o\'clock.',
    sequenceTemplate: ['私', 'は', '八時', 'ごろ', '学校', 'に', '行きます'],
    defaultReplacements: {},
    tip: 'Subject + Time (八時) + goro (ごろ) + Destination + ni (に) + Verb.',
    pattern: 'Noun (Time) + goro + Verb',
    meaning: 'to express an approximate clock time ("around").'
  },
  {
    id: 22,
    title: 'Duration 「ぐらい」',
    concept: 'Use ぐらい (or くらい) after quantities or periods of time to express an approximate duration, count, or cost.',
    englishTemplate: 'I study for about 1 hour.',
    sequenceTemplate: ['一時間', 'ぐらい', '勉強します'],
    defaultReplacements: {},
    tip: 'Duration (一時間 - 1 hour) + gurai (ぐらい) + Verb (勉強します - study).',
    pattern: 'Noun (Duration/Quantity) + gurai',
    meaning: 'to indicate an approximate duration, quantity, or degree ("about" or "approximately").'
  },
  {
    id: 23,
    title: 'Frequency Rate 「に」',
    concept: 'State frequency by placing に after the time frame noun (e.g. per week, per day) to show how often you do an action.',
    englishTemplate: 'I study 3 times in 1 week.',
    sequenceTemplate: ['一週間', 'に', '三回', '勉強します'],
    defaultReplacements: {},
    tip: 'Time span (一週間 - 1 week) + ni (に) + Count (三回 - 3 times) + Verb.',
    pattern: 'Noun (Time span) + ni (particle) + Noun (Times) + Verb',
    meaning: 'to show the frequency rate of an action ("per" or "in").'
  },
  {
    id: 24,
    title: 'Exclusive Limit 「だけ」',
    concept: 'Attach だけ directly to a noun or limit indicator to state that there are no others, meaning "only".',
    englishTemplate: 'I drink only water.',
    sequenceTemplate: ['私', 'は', '水', 'だけ', 'を', '飲みます'],
    defaultReplacements: {},
    tip: 'Subject + Noun (水) + dake (だけ) + o (を) + Verb (飲みます).',
    pattern: 'Noun + dake (particle) + Verb',
    meaning: 'to limit the scope to just one specific item or quantity ("only").'
  },
  {
    id: 25,
    title: 'Existence Lists 「あります」',
    concept: 'List inanimate items and state that they exist. Combine multiple Nouns using と and add があります at the end.',
    englishTemplate: 'There is water and sushi here.',
    sequenceTemplate: ['ここに', '水', 'と', '寿司', 'が', 'あります'],
    defaultReplacements: {},
    tip: 'Location (ここに) + Noun 1 (水) + to (と) + Noun 2 (寿司) + ga (が) + arimasu (あります).',
    pattern: 'Noun 1 + to (particle) + Noun 2 + ga (particle) + arimasu',
    meaning: 'to declare that multiple non-living things are present in a location.'
  },
  {
    id: 26,
    title: 'Purpose of Movement 「に」',
    concept: 'State the purpose of going or coming. Attach the particle に to a verbます-stem, followed by a motion verb.',
    englishTemplate: 'I go to eat {FOOD}.',
    sequenceTemplate: ['私', 'は', '{FOOD}', 'を', '食べ', 'に', '行きます'],
    defaultReplacements: {
      '{FOOD}': { japanese: '寿司', english: 'sushi' }
    },
    category: 'food',
    tip: 'Subject + Object + o (を) + Verb stem (食べ) + purpose marker (に) + Motion verb (行きます).',
    pattern: 'Verb (Masu-stem) + ni (particle) + Motion Verb',
    meaning: 'to express the purpose of a movement ("go/come to do something").'
  },
  {
    id: 27,
    title: 'Desire 「が欲しいです」',
    concept: 'Use 欲しいです after the particle が to state that the speaker desires or wants a physical object.',
    englishTemplate: 'I want a car.',
    sequenceTemplate: ['私', 'は', '車', 'が', '欲しい', 'です'],
    defaultReplacements: {},
    tip: 'Subject + Topic (は) + Object (車) + ga (が) + Desire (欲しい) + desu.',
    pattern: 'Noun + ga (particle) + hoshii desu',
    meaning: 'to state that you want or desire a specific physical item.'
  },
  {
    id: 28,
    title: 'Verb Desire 「たいです」',
    concept: 'Attach たいです directly to a verbます-stem to express a subjective desire to perform that action.',
    englishTemplate: 'I want to drink {DRINK}.',
    sequenceTemplate: ['私', 'は', '{DRINK}', 'を', '飲み', 'たい', 'です'],
    defaultReplacements: {
      '{DRINK}': { japanese: '水', english: 'water' }
    },
    category: 'drink',
    tip: 'Subject + Object + o (を) + Verb stem (飲み) + desire (たい) + desu.',
    pattern: 'Verb (Masu-stem) + tai desu',
    meaning: 'to state that you want to perform a specific action.'
  },
  {
    id: 29,
    title: 'Connecting i-Adjectives 「くて」',
    concept: 'To link multiple i-adjectives together, drop the final -i of the first adjective and add くて.',
    englishTemplate: 'This sushi is cheap and delicious.',
    sequenceTemplate: ['この', '寿司', 'は', '安く', 'て', '美味しい', 'です'],
    defaultReplacements: {},
    tip: 'Topic + Adj 1 (安い -> 安く) + link (て) + Adj 2 (美味しい) + desu.',
    pattern: 'Adjective(i-stem) + kute + Adjective 2',
    meaning: 'to connect two or more i-adjectives in a descriptive sequence ("is cheap and...").'
  },
  {
    id: 30,
    title: 'Connecting na-Adjectives 「で」',
    concept: 'To link multiple na-adjectives (or nouns) in a sequence, add で directly after the first stem.',
    englishTemplate: 'This school is quiet and clean.',
    sequenceTemplate: ['この', '学校', 'は', '静か', 'で', '綺麗', 'です'],
    defaultReplacements: {},
    tip: 'Topic + Adj 1 (静か) + link (で) + Adj 2 (綺麗) + desu.',
    pattern: 'Adjective(na-stem) / Noun + de (particle) + Adjective 2',
    meaning: 'to connect two or more na-adjectives (or nouns) in a sequence ("is quiet and...").'
  },
  {
    id: 31,
    title: 'Polite Suggestion 「ましょう」',
    concept: 'Change a verb to its ましょう ending to make a polite, enthusiastic suggestion or proposal to do something ("let\'s").',
    englishTemplate: 'Let\'s eat {FOOD} together.',
    sequenceTemplate: ['一緒', 'に', '{FOOD}', 'を', '食べましょう'],
    defaultReplacements: {
      '{FOOD}': { japanese: '寿司', english: 'sushi' }
    },
    category: 'food',
    tip: 'Together (一緒 に) + Object + o (を) + Suggestion Verb (食べましょう).',
    pattern: 'Verb (Masu-stem) + mashou',
    meaning: 'to make a polite and proactive suggestion to do an action ("let\'s").'
  },
  {
    id: 32,
    title: 'Offer Help 「ましょうか」',
    concept: 'Add か to ましょう to politely offer to do an action for someone else ("shall I?").',
    englishTemplate: 'Shall I drink water?',
    sequenceTemplate: ['私', 'が', '水', 'を', '飲みましょうか'],
    defaultReplacements: {},
    tip: 'Subject (私 が) + Object (水) + o (を) + Offer Verb (飲みましょうか).',
    pattern: 'Verb (Masu-stem) + mashou ka',
    meaning: 'to politely offer to perform a helpful action for someone ("shall I?").'
  },
  {
    id: 33,
    title: 'Ask Permission 「てもいいですか」',
    concept: 'Combine the Te-form of a verb with もいいですか to ask for permission to do something ("may I?").',
    englishTemplate: 'May I drink {DRINK}?',
    sequenceTemplate: ['{DRINK}', 'を', '飲んで', 'も', 'いい', 'です', 'か'],
    defaultReplacements: {
      '{DRINK}': { japanese: '水', english: 'water' }
    },
    category: 'drink',
    tip: 'Object + o (を) + Verb Te-form (飲んで) + permission helper (もいいですか).',
    pattern: 'Verb (Te-form) + mo (particle) + ii desu ka',
    meaning: 'to ask for permission to perform an action ("may I/is it okay if I?").'
  },
  {
    id: 34,
    title: 'Negative Request 「ないでください」',
    concept: 'Change a verb to its negative Nai-form and add でください to politely ask someone NOT to do something.',
    englishTemplate: 'Please do not drink {DRINK}.',
    sequenceTemplate: ['{DRINK}', 'を', '飲まない', 'で', 'ください'],
    defaultReplacements: {
      '{DRINK}': { japanese: '水', english: 'water' }
    },
    category: 'drink',
    tip: 'Object + o (を) + Verb Nai-form (飲まない) + request (でください).',
    pattern: 'Verb (Nai-form) + de + kudasai',
    meaning: 'to politely request or command someone not to do an action ("please don\'t").'
  },
  {
    id: 35,
    title: 'Change of State 「く/になります」',
    concept: 'Express becoming something. Use く + なります for i-adjectives, and に + なります for na-adjectives/nouns.',
    englishTemplate: 'The water became cold.',
    sequenceTemplate: ['水', 'が', '冷たく', 'なりました'],
    defaultReplacements: {},
    tip: 'Subject (水 が) + Adj i-stem (冷たく) + became (なりました).',
    pattern: 'Adjective (i-stem) + ku / Noun + ni (particle) + narimasu',
    meaning: 'to show a change in state or condition ("to become").'
  },
  {
    id: 36,
    title: 'Too Much 「すぎます」',
    concept: 'State that an action or quality is excessive. Attach すぎます to a verbます-stem or adjective stem.',
    englishTemplate: 'This water is too hot.',
    sequenceTemplate: ['この', '水', 'は', '熱', 'すぎます'],
    defaultReplacements: {},
    tip: 'Topic (この 水 は) + Adjective stem (熱) + excess (すぎます).',
    pattern: 'Verb (Masu-stem) / Adjective (Stem) + sugimasu',
    meaning: 'to indicate that something is done to an excess or is too extreme ("too much").'
  },
  {
    id: 37,
    title: 'Comparison 「のほうが...より」',
    concept: 'Compare two items. The preferred item takes のほうが ("is more"), while the benchmark item takes より ("than").',
    englishTemplate: 'Sushi is more delicious than bread.',
    sequenceTemplate: ['パン', 'より', '寿司', 'の', 'ほう', 'が', '美味しい', 'です'],
    defaultReplacements: {},
    tip: 'Benchmark (パン より) + Preferred (寿司 の ほう が) + Adjective + desu.',
    pattern: 'Noun 1 + no hou ga + Noun 2 + yori + Adjective',
    meaning: 'to compare two things and declare that one is more of a quality than the other.'
  },
  {
    id: 38,
    title: 'Comparison Inquiry 「と...とどちら」',
    concept: 'Ask someone to choose between two options. End with どちらが...ですか ("which one is...?").',
    englishTemplate: 'Which is delicious, sushi or bread?',
    sequenceTemplate: ['寿司', 'と', 'パン', 'と', 'どちら', 'が', '美味しい', 'です', 'か'],
    defaultReplacements: {},
    tip: 'Option 1 (寿司 と) + Option 2 (パン と) + which one (どちら が) + Adjective + desu ka.',
    pattern: 'Noun 1 + to (particle) + Noun 2 + to (particle) + dochira ga + Adjective + desu ka',
    meaning: 'to ask which of two options possesses a certain attribute.'
  },
  {
    id: 39,
    title: 'Superlative 「の中で一番」',
    concept: 'State the best in a category. Specify the range/group followed by の中で, and then 一番 ("number one").',
    englishTemplate: 'Japanese is the most interesting of all.',
    sequenceTemplate: ['全部', 'の', '中', 'で', '日本語', 'が', '一番', '面白い', 'です'],
    defaultReplacements: {},
    tip: 'Group (全部 の 中 で) + Subject (日本語 が) + most (一番) + Adjective + desu.',
    pattern: 'Noun (Group) + no naka de (particle) + Noun (Subject) + ga (particle) + ichiban + Adjective',
    meaning: 'to indicate the absolute superlative choice within a specific group or category ("the most").'
  },
  {
    id: 40,
    title: 'Representative Actions 「たり...たり」',
    concept: 'List actions as representative examples of what you do. Attach たり to plain past form (た) of verbs, end with します.',
    englishTemplate: 'I do things like eating and drinking.',
    sequenceTemplate: ['食べたり', '飲んだり', 'します'],
    defaultReplacements: {},
    tip: 'Verb 1 (食べたり) + Verb 2 (飲んだり) + helper verb (します).',
    pattern: 'Verb 1 (Ta-form) + ri + Verb 2 (Ta-form) + ri + shimasu',
    meaning: 'to list two or more actions as typical, non-exhaustive examples of what you do.'
  },
  {
    id: 41,
    title: 'Conjecture 「でしょう」',
    concept: 'Use でしょう after plain form verbs, adjectives, or nouns to express a polite conjecture, guess, or probability ("probably").',
    englishTemplate: 'It will probably rain tomorrow.',
    sequenceTemplate: ['明日', 'は', '雨', 'でしょう'],
    defaultReplacements: {},
    tip: 'Time (明日 は) + Noun (雨) + conjecture (でしょう).',
    pattern: 'Verb/Adj/Noun (Plain-form) + deshou',
    meaning: 'to express a polite conjecture, guess, or request agreement ("probably / right?").'
  },
  {
    id: 42,
    title: 'Opinion 「と思います」',
    concept: 'Express a personal opinion or thought. Place と思います directly after a plain form clause.',
    englishTemplate: 'I think Japanese is interesting.',
    sequenceTemplate: ['日本語', 'は', '面白い', 'と', '思います'],
    defaultReplacements: {},
    tip: 'Statement (日本語 は 面白い) + quote particle (と) + think (思います).',
    pattern: 'Clause (Plain-form) + to (particle) + omoimasu',
    meaning: 'to express a personal opinion or belief ("I think that").'
  },
  {
    id: 43,
    title: 'Indirect Quotation 「と言います」',
    concept: 'Use と言います to quote what someone else said. The quoted clause must end in its plain form.',
    englishTemplate: 'My friend said he will go to school.',
    sequenceTemplate: ['友達', 'は', '学校', 'に', '行く', 'と', '言いました'],
    defaultReplacements: {},
    tip: 'Speaker + Topic + Quote (学校 に 行く) + quote (と) + said (言いました).',
    pattern: 'Clause (Plain-form) + to (particle) + iimasu',
    meaning: 'to quote or report what someone else said ("says that / said that").'
  },
  {
    id: 44,
    title: 'Nominalizer 「の / こと」',
    concept: 'Turn a verb sentence into a noun clause so it can take object or subject particles. Attach の (or こと) to a plain verb.',
    englishTemplate: 'I like drinking {DRINK}.',
    sequenceTemplate: ['私', 'は', '{DRINK}', 'を', '飲む', 'の', 'が', '好き', 'です'],
    defaultReplacements: {
      '{DRINK}': { japanese: '水', english: 'water' }
    },
    category: 'drink',
    tip: 'Subject + Object + verb (飲む) + nominalizer (の) + ga + Adjective (好きです).',
    pattern: 'Verb (Dictionary-form) + no (particle) + ga (particle) + Adjective',
    meaning: 'to convert a verb phrase into a noun clause so it can be evaluated as a subject or object.'
  },
  {
    id: 45,
    title: 'Polite Negative Question 「ないですか」',
    concept: 'Formulate a polite, suggestive question using the negative form. It asks for verification in a gentle tone.',
    englishTemplate: 'Is Japanese not interesting?',
    sequenceTemplate: ['日本語', 'は', '面白くない', 'です', 'か'],
    defaultReplacements: {},
    tip: 'Topic (日本語 は) + negative adjective (面白くない) + desu ka.',
    pattern: 'Adjective (Negative) + desu ka',
    meaning: 'to ask a question in a negative tone to suggest or seek confirmation ("isn\'t it...?").'
  },
  {
    id: 46,
    title: 'Conjunction Clause 「で / て」',
    concept: 'Connect sentences by changing the first verb into its Te-form. This links actions chronologically.',
    englishTemplate: 'I go to school and study.',
    sequenceTemplate: ['学校', 'に', '行って', '勉強します'],
    defaultReplacements: {},
    tip: 'Action 1 (学校 に 行って) + Action 2 (勉強します).',
    pattern: 'Verb 1 (Te-form) + Verb 2',
    meaning: 'to connect two actions or clauses sequentially or explain a sequence of events ("and then").'
  },
  {
    id: 47,
    title: 'Limit Boundary 「まで」',
    concept: 'The particle まで specifies the end point, time limit, or boundary of an action, meaning "until" or "to".',
    englishTemplate: 'I will study until 8 o\'clock.',
    sequenceTemplate: ['私', 'は', '八時', 'まで', '勉強します'],
    defaultReplacements: {},
    tip: 'Subject + Time Limit (八時) + made (まで) + Verb (勉強します).',
    pattern: 'Noun (Time/Place) + made (particle) + Verb',
    meaning: 'to specify the end point or time limit of an action or state ("until/up to/as far as").'
  },
  {
    id: 48,
    title: 'Starting Point 「から」',
    concept: 'The particle から specifies the starting point of time or space, meaning "from". It is often paired with まで.',
    englishTemplate: 'I study from 8 o\'clock.',
    sequenceTemplate: ['私', 'は', '八時', 'から', '勉強します'],
    defaultReplacements: {},
    tip: 'Subject + Start (八時) + kara (から) + Verb (勉強します).',
    pattern: 'Noun (Time/Place) + kara (particle) + Verb',
    meaning: 'to specify the starting point of an action in terms of time or space ("from").'
  },
  {
    id: 49,
    title: 'Seeking Agreement 「ね」',
    concept: 'Place the sentence-ending particle ね at the very end to seek agreement or empathy from the listener, meaning "right?".',
    englishTemplate: 'Japanese is interesting, isn\'t it?',
    sequenceTemplate: ['日本語', 'は', '面白い', 'です', 'ね'],
    defaultReplacements: {},
    tip: 'Clause (日本語 は 面白い です) + agreement marker (ね).',
    pattern: 'Sentence + ne (particle)',
    meaning: 'to seek agreement, confirm shared information, or show empathy ("isn\'t it? / right?").'
  },
  {
    id: 50,
    title: 'Assuring listener 「よ」',
    concept: 'Place the sentence-ending particle よ at the end to state new information or emphasize an assertion, meaning "you know!".',
    englishTemplate: 'This sushi is delicious, you know!',
    sequenceTemplate: ['この', '寿司', 'は', '美味しい', 'です', 'よ'],
    defaultReplacements: {},
    tip: 'Clause (この 寿司 は 面白い です) + assertion marker (よ).',
    pattern: 'Sentence + yo (particle)',
    meaning: 'to emphasize an assertion, provide new information, or give a friendly warning ("you know! / I tell you").'
  },
  {
    id: 51,
    title: 'Before doing 「まえに」',
    concept: 'Attach まえに directly to a dictionary-form verb to state that an action occurs before another action.',
    englishTemplate: 'Before eating, I wash my hands.',
    sequenceTemplate: ['食べる', 'まえに', '手', 'を', '洗います'],
    defaultReplacements: {},
    tip: 'Verb dict-form (食べる) + mae ni (まえに) + Object + Verb (洗います).',
    pattern: 'Verb (Dictionary-form) + mae ni + Clause',
    meaning: 'to state that an action happens before another action ("before doing").'
  },
  {
    id: 52,
    title: 'After doing 「あとで」',
    concept: 'Attach あとで to the plain past-form (た) of a verb to state that an action occurs after another action.',
    englishTemplate: 'After eating {FOOD}, I drink water.',
    sequenceTemplate: ['{FOOD}', 'を', '食べた', 'あとで', '水', 'を', '飲みます'],
    defaultReplacements: {
      '{FOOD}': { japanese: '寿司', english: 'sushi' }
    },
    category: 'food',
    tip: 'Object + Verb Past Plain (食べた) + after (あとで) + secondary action.',
    pattern: 'Verb (Ta-form) + ato de + Clause',
    meaning: 'to state that an action happens after another action ("after doing").'
  },
  {
    id: 53,
    title: 'Inability 「ことができません」',
    concept: 'To state that you cannot do an action, attach ことができません directly to the dictionary form of the verb.',
    englishTemplate: 'I cannot drink {DRINK}.',
    sequenceTemplate: ['私', 'は', '{DRINK}', 'を', '飲む', 'こと', 'が', 'できません'],
    defaultReplacements: {
      '{DRINK}': { japanese: '水', english: 'water' }
    },
    category: 'drink',
    tip: 'Subject + Object + o + Verb Dictionary (飲む) + inability (ことができません).',
    pattern: 'Verb (Dictionary-form) + koto ga (particle) + dekimasen',
    meaning: 'to express that you are physically or contextually unable to perform an action ("cannot do").'
  },
  {
    id: 54,
    title: 'Question Particle 「か」',
    concept: 'Use the sentence-ending particle か to mark a question. It is equivalent to a question mark.',
    englishTemplate: 'Do you drink {DRINK}?',
    sequenceTemplate: ['あなた', 'は', '{DRINK}', 'を', '飲みます', 'か'],
    defaultReplacements: {
      '{DRINK}': { japanese: '水', english: 'water' }
    },
    category: 'drink',
    tip: 'Topic + Object + o + Verb (飲みます) + question particle (か).',
    pattern: 'Sentence + ka (particle)',
    meaning: 'to indicate that the sentence is a question.'
  },
  {
    id: 55,
    title: 'i-Adjective Modifier',
    concept: 'Modify a noun directly with an i-adjective. Place the adjective directly before the noun in its plain form.',
    englishTemplate: 'This is delicious sushi.',
    sequenceTemplate: ['これ', 'は', '美味しい', '寿司', 'です'],
    defaultReplacements: {},
    tip: 'Pronoun + wa + i-adjective (美味しい) + Noun (寿司) + desu.',
    pattern: 'Adjective (i-form) + Noun',
    meaning: 'to directly describe a noun using an i-adjective.'
  },
  {
    id: 56,
    title: 'na-Adjective Modifier',
    concept: 'Modify a noun directly with a na-adjective. Place the adjective before the noun and link them with な.',
    englishTemplate: 'This is a clean school.',
    sequenceTemplate: ['これ', 'は', '綺麗', 'な', '学校', 'です'],
    defaultReplacements: {},
    tip: 'Pronoun + wa + na-adjective (綺麗) + link (な) + Noun (学校) + desu.',
    pattern: 'Adjective (na-stem) + na + Noun',
    meaning: 'to directly describe a noun using a na-adjective.'
  },
  {
    id: 57,
    title: 'Non-existence 「がありません」',
    concept: 'State that an inanimate object or abstract concept does not exist. Use がありません after the noun.',
    englishTemplate: 'There is no water here.',
    sequenceTemplate: ['ここに', '水', 'が', 'ありません'],
    defaultReplacements: {},
    tip: 'Location (ここに) + Noun (水) + subject marker (が) + negative existence (ありません).',
    pattern: 'Noun (Inanimate) + ga (particle) + arimasen',
    meaning: 'to declare that a non-living thing does not exist or is not present.'
  },
  {
    id: 58,
    title: 'Animate Non-existence 「がいません」',
    concept: 'State that a living thing (person/animal) does not exist. Use がいません after the noun.',
    englishTemplate: 'There is no friend here.',
    sequenceTemplate: ['ここに', '友達', 'が', 'いません'],
    defaultReplacements: {},
    tip: 'Location (ここに) + Noun (友達) + subject marker (が) + negative existence (いません).',
    pattern: 'Noun (Animate) + ga (particle) + imasen',
    meaning: 'to declare that a living thing (person or animal) is not present.'
  },
  {
    id: 59,
    title: 'Goal / Toward 「へ」',
    concept: 'The particle へ (pronounced "e") marks the direction toward which movement is oriented, meaning "toward".',
    englishTemplate: 'I will go toward school.',
    sequenceTemplate: ['私', 'は', '学校', 'へ', '行きます'],
    defaultReplacements: {},
    tip: 'Subject + Direction (学校) + e (へ) + Motion Verb (行きます).',
    pattern: 'Noun (Direction) + e (particle) + Motion Verb',
    meaning: 'to indicate the direction of movement toward a destination ("toward").'
  },
  {
    id: 60,
    title: 'Topic Contrast 「には」',
    concept: 'Combine particles. には contrasts or highlights a destination or specific location in relation to the main sentence topic.',
    englishTemplate: 'As for school, I go there.',
    sequenceTemplate: ['学校', 'には', '行きます'],
    defaultReplacements: {},
    tip: 'Destination contrast (学校 には) + Verb (行きます).',
    pattern: 'Noun + ni (particle) + wa (particle) + Verb',
    meaning: 'to contrast or emphasize a specific location or destination topic.'
  }
];

export const n4Lessons = [
  {
    id: 1,
    title: 'Intention 「つもりです」',
    concept: 'Attach つもりです to a dictionary form verb to express a strong future plan or intention to do an action.',
    englishTemplate: 'I intend to go to {PLACE}.',
    sequenceTemplate: ['私', 'は', '{PLACE}', 'に', '行く', 'つもり', 'です'],
    defaultReplacements: {
      '{PLACE}': { japanese: '学校', english: 'school' }
    },
    category: 'place',
    tip: 'Subject + Destination + Direction Marker (に) + Verb Plain (行く) + Intention (つもりです).',
    pattern: 'Verb (Dictionary/Nai-form) + tsumori desu',
    meaning: 'to state a firm future plan or intention to do (or not do) something.'
  },
  {
    id: 2,
    title: 'Desire 「たいです」',
    concept: 'Attach たいです to a verb ます-stem to express a subjective desire to do that action ("want to").',
    englishTemplate: 'I want to eat {FOOD}.',
    sequenceTemplate: ['私', 'は', '{FOOD}', 'を', '食べたい', 'です'],
    defaultReplacements: {
      '{FOOD}': { japanese: '寿司', english: 'sushi' }
    },
    category: 'food',
    tip: 'Subject + Object + Object Marker (を) + Verb stem + desire (食べたいです).',
    pattern: 'Verb (Masu-stem) + tai desu',
    meaning: 'to express a personal desire or wish to perform an action ("want to").'
  },
  {
    id: 3,
    title: 'Experience 「たことがあります」',
    concept: 'Attach ことがあります to the past plain form (た形) of a verb to state that you have had that experience in the past.',
    englishTemplate: 'I have eaten {FOOD} before.',
    sequenceTemplate: ['私', 'は', '{FOOD}', 'を', '食べた', 'こと', 'が', 'あります'],
    defaultReplacements: {
      '{FOOD}': { japanese: '寿司', english: 'sushi' }
    },
    category: 'food',
    tip: 'Subject + Object + Object Marker (を) + Verb Past (食べた) + Experience phrase (ことがあります).',
    pattern: 'Verb (Ta-form) + koto ga (particle) + arimasu',
    meaning: 'to state that you have had a past experience of doing something ("have done before").'
  },
  {
    id: 4,
    title: 'Permission 「てもいいです」',
    concept: 'Add もいいです to the Te-form of a verb to grant or request permission, translated as "may do".',
    englishTemplate: 'You may drink {DRINK}.',
    sequenceTemplate: ['{DRINK}', 'を', '飲ん', 'で', 'も', 'いい', 'です'],
    defaultReplacements: {
      '{DRINK}': { japanese: '水', english: 'water' }
    },
    category: 'drink',
    tip: 'Object + Object Marker (を) + Verb Te-form (飲んで) + Permission helper (もいいです).',
    pattern: 'Verb (Te-form) + mo (particle) + ii desu',
    meaning: 'to request or grant permission to do an action ("may do/it is okay to").'
  },
  {
    id: 5,
    title: 'Obligation 「なければなりません」',
    concept: 'Change a verb to its negative Nai-form, drop the -i, and add ければなりません to state a mandatory duty ("must do").',
    englishTemplate: 'I must go to {PLACE}.',
    sequenceTemplate: ['私', 'は', '{PLACE}', 'に', '行か', 'なければ', 'なりません'],
    defaultReplacements: {
      '{PLACE}': { japanese: '学校', english: 'school' }
    },
    category: 'place',
    tip: 'Subject + Destination + Direction Marker (に) + Verb Nai-form stem (行か) + Obligation suffix (なければなりません).',
    pattern: 'Verb (Nai-stem without -i) + kereba narimasen',
    meaning: 'to express a strong obligation, necessity, or duty ("must do/have to").'
  },
  {
    id: 6,
    title: 'Excess 「すぎます」',
    concept: 'Attach すぎます to a verbます-stem or adjective stem to express that an action or state is excessive ("too much").',
    englishTemplate: 'I ate too much {FOOD}.',
    sequenceTemplate: ['私', 'は', '{FOOD}', 'を', '食べ', 'すぎました'],
    defaultReplacements: {
      '{FOOD}': { japanese: '寿司', english: 'sushi' }
    },
    category: 'food',
    tip: 'Subject + Object + Object Marker (を) + Verb stem (食べ) + Excess helper (すぎました).',
    pattern: 'Verb (Masu-stem) / Adjective (Stem) + sugimasu',
    meaning: 'to indicate that an action or state is excessive or done to an extreme ("too much").'
  },
  {
    id: 7,
    title: 'Ability 「ことができます」',
    concept: 'Attach ことができます to the dictionary form of a verb to state a capability, equivalent to "can do" an action.',
    englishTemplate: 'I can eat {FOOD}.',
    sequenceTemplate: ['私', 'は', '{FOOD}', 'を', '食べる', 'こと', 'が', 'できます'],
    defaultReplacements: {
      '{FOOD}': { japanese: '寿司', english: 'sushi' }
    },
    category: 'food',
    tip: 'Subject + Object + Object Marker (を) + Verb Dictionary (食べる) + Ability phrase (ことができます).',
    pattern: 'Verb (Dictionary-form) + koto ga (particle) + dekimasu',
    meaning: 'to express the physical capability or possibility of doing something ("can do").'
  },
  {
    id: 8,
    title: 'Concurrent Action 「ながら」',
    concept: 'Attach ながら to a verb ます-stem to show two actions performed simultaneously by the same subject ("while").',
    englishTemplate: 'I study while drinking {DRINK}.',
    sequenceTemplate: ['私', 'は', '{DRINK}', 'を', '飲み', 'ながら', '勉強します'],
    defaultReplacements: {
      '{DRINK}': { japanese: '水', english: 'water' }
    },
    category: 'drink',
    tip: 'Subject + Object + Object Marker (to) + Verb stem (飲み) + Concurrent (ながら) + Main Verb (勉強します).',
    pattern: 'Verb 1 (Masu-stem) + nagara (particle) + Verb 2',
    meaning: 'to perform two actions at the same time by the same person ("while doing A, I do B").'
  },
  {
    id: 9,
    title: 'Preparation 「ておきます」',
    concept: 'Combine the Te-form of a verb with おきます to indicate doing an action in advance, in preparation for the future.',
    englishTemplate: 'I will reserve a hotel in advance of the trip.',
    sequenceTemplate: ['旅行', 'の', '前に', 'ホテル', 'を', '予約して', 'おきます'],
    defaultReplacements: {},
    tip: 'Noun + Possessive (の) + Before (前に) + Object + Object Marker (を) + Verb Te-form (予約して) + Preparatory (おきます).',
    pattern: 'Verb (Te-form) + okimasu',
    meaning: 'to perform an action in advance in preparation for future use or benefit ("do in advance").'
  },
  {
    id: 10,
    title: 'Completion/Regret 「てしまいます」',
    concept: 'Use てしまいます to express completing an action fully, or to express regret over an accidental action.',
    englishTemplate: 'I accidentally drank {DRINK}.',
    sequenceTemplate: ['私', 'は', '{DRINK}', 'を', '飲んで', 'しまいました'],
    defaultReplacements: {
      '{DRINK}': { japanese: '水', english: 'water' }
    },
    category: 'drink',
    tip: 'Subject + Object + Object Marker (を) + Verb Te-form (飲んで) + Completed/Regret (しまいました).',
    pattern: 'Verb (Te-form) + shimaimasu',
    meaning: 'to express that an action was completed fully, or that it happened accidentally with regret.'
  },
  {
    id: 11,
    title: 'Might / Conjecture 「かもしれません」',
    concept: 'Attach かもしれません to plain form verbs, adjectives, or nouns to express a guess or possibility ("might/possibly").',
    englishTemplate: 'I might go to {PLACE} tomorrow.',
    sequenceTemplate: ['明日', '私', 'は', '{PLACE}', 'に', '行く', 'かも', 'しれません'],
    defaultReplacements: {
      '{PLACE}': { japanese: '学校', english: 'school' }
    },
    category: 'place',
    tip: 'Time (明日) + Subject + Destination + Direction Marker (に) + Verb Plain (行く) + Probability (かもしれません).',
    pattern: 'Verb/Adjective (Plain-form) / Noun + kamoshiremasen',
    meaning: 'to express a guess or conjecture with a lower degree of certainty ("might/possibly").'
  },
  {
    id: 12,
    title: 'Expectation 「はずです」',
    concept: 'Attach はずです to plain form verbs or adjectives to express that something should be or is expected to happen.',
    englishTemplate: 'He is expected to go to {PLACE} today.',
    sequenceTemplate: ['彼', 'は', '今日', '{PLACE}', 'に', '行く', 'はず', 'です'],
    defaultReplacements: {
      '{PLACE}': { japanese: '学校', english: 'school' }
    },
    category: 'place',
    tip: 'Subject + Topic (は) + Time (今日) + Destination + Direction Marker (に) + Verb Plain (行く) + Expectation (はずです).',
    pattern: 'Verb/Adjective (Plain-form) + hazu desu',
    meaning: 'to express a strong expectation or logical belief based on facts ("should be/expected to").'
  },
  {
    id: 13,
    title: 'Contrast/Regret 「のに」',
    concept: 'Connect clauses with のに to express "despite/even though". It shows contrast combined with surprise, regret, or complaint.',
    englishTemplate: 'Despite taking medicine, my cold won\'t cure.',
    sequenceTemplate: ['薬', 'を', '飲んだ', 'のに', '風邪', 'が', '治りません'],
    defaultReplacements: {},
    tip: 'Medicine + Object (を) + Verb Past Plain (飲んだ) + Contrastive (のに) + Cold noun + Subject (が) + Negative Verb (治りません).',
    pattern: 'Verb (Plain-form) + noni (particle) + Unexpected Clause',
    meaning: 'to express contrast with frustration, regret, or surprise ("despite the fact that/even though").'
  },
  {
    id: 14,
    title: 'Conditional 「たら」',
    concept: 'Attach たら to the past plain form of verbs or adjectives to state a condition ("if" or "when"). Highly frequent in N4!',
    englishTemplate: 'If it rains, I won\'t go to {PLACE}.',
    sequenceTemplate: ['雨', 'が', '降ったら', '{PLACE}', 'に', '行きません'],
    defaultReplacements: {
      '{PLACE}': { japanese: '学校', english: 'school' }
    },
    category: 'place',
    tip: 'Rain + Subject (が) + Past conditional (降ったら) + Destination + Direction (に) + Negative motion verb (行きません).',
    pattern: 'Verb (Ta-form) + ra',
    meaning: 'to express a general conditional condition or chronological sequence ("if/when").'
  },
  {
    id: 15,
    title: 'Conditional 「ば」',
    concept: 'Use the conditional ば form of verbs or adjectives to express a condition. If the condition is met, the result follows.',
    englishTemplate: 'If it is cheap, I will buy that {FOOD}.',
    sequenceTemplate: ['安ければ', 'あの', '{FOOD}', 'を', '買います'],
    defaultReplacements: {
      '{FOOD}': { japanese: '寿司', english: 'sushi' }
    },
    category: 'food',
    tip: 'Adjective Provisional (安ければ) + Demonstrative (あの) + Object + Object Marker (を) + Verb (買います).',
    pattern: 'Verb (Ba-form) / Adjective (Kereba-form)',
    meaning: 'to state a hypothetical condition where the result directly depends on the condition ("if").'
  },
  {
    id: 16,
    title: 'Conditional 「と」',
    concept: 'Attach と directly after a dictionary form verb to indicate a natural or automatic consequence ("if/when X, then Y happens next").',
    englishTemplate: 'When spring comes, cherry blossoms bloom.',
    sequenceTemplate: ['春', 'に', 'なると', '桜', 'が', '咲きます'],
    defaultReplacements: {},
    tip: 'Spring + Direction (in) + Verb Dictionary + conditional (なると) + Cherry blossoms + Subject (が) + Verb (咲きます).',
    pattern: 'Verb (Dictionary-form) + to (particle)',
    meaning: 'to express a natural, automatic, or inevitable consequence ("if/when X happens, Y always happens next").'
  },
  {
    id: 17,
    title: 'Conditional 「なら」',
    concept: 'Use なら after a noun or verb to state a condition based on context provided by the other speaker ("if it is/in the case of").',
    englishTemplate: 'If you are going to {PLACE}, the train is convenient.',
    sequenceTemplate: ['{PLACE}', 'に', '行く', 'なら', '電車', 'が', '便利', 'です'],
    defaultReplacements: {
      '{PLACE}': { japanese: '学校', english: 'school' }
    },
    category: 'place',
    tip: 'Destination + Direction (に) + Verb Plain (行く) + Contextual conditional (なら) + Train + Subject (g) + Adjective (便利) + Copula (です).',
    pattern: 'Noun / Verb (Plain-form) + nara (particle)',
    meaning: 'to state a condition or advice based on the context of the conversation ("if it is the case that").'
  },
  {
    id: 18,
    title: 'Honorific Favor 「てくれます」',
    concept: 'Attach くれます to a verb Te-form to state that someone else performed an action as a favor for me or my family.',
    englishTemplate: 'The teacher taught me Japanese.',
    sequenceTemplate: ['先生', 'が', '私', 'に', '日本語', 'を', '教えて', 'くれました'],
    defaultReplacements: {},
    tip: 'Teacher + Subject (が) + Me + Direction (に) + Language + Object (を) + Verb Te-form (教えて) + Favor helper (くれました).',
    pattern: 'Verb (Te-form) + kuremasu',
    meaning: 'to express that someone else did a favor or kindness for the speaker ("does ... for me").'
  },
  {
    id: 19,
    title: 'Favor to Others 「てあげます」',
    concept: 'Attach あげます to a verb Te-form to indicate performing an action as a favor for someone of equal or lower status.',
    englishTemplate: 'I will buy {FOOD} for my friend.',
    sequenceTemplate: ['私', 'は', '友達', 'に', '{FOOD}', 'を', '買って', 'あげます'],
    defaultReplacements: {
      '{FOOD}': { japanese: '寿司', english: 'sushi' }
    },
    category: 'food',
    tip: 'Subject + Recipient + ni + Object + o + Verb Te-form (買って) + favor helper (あげます).',
    pattern: 'Verb (Te-form) + agemasu',
    meaning: 'to express doing an action as a favor or benefit for someone else.'
  },
  {
    id: 20,
    title: 'Favor Received 「てもらいます」',
    concept: 'Attach もらいます to a verb Te-form to state that you received a favor, meaning "I had someone do something for me".',
    englishTemplate: 'I had the teacher teach me Japanese.',
    sequenceTemplate: ['私', 'は', '先生', 'に', '日本語', 'を', '教えて', 'もらいました'],
    defaultReplacements: {},
    tip: 'Subject + Giver + ni + Object + o + Verb Te-form (教えて) + helper (もらいました).',
    pattern: 'Verb (Te-form) + moraimasu',
    meaning: 'to state that the speaker received a helpful action performed by someone else ("have someone do").'
  },
  {
    id: 21,
    title: 'Trial Action 「てみます」',
    concept: 'Attach みます to the Te-form of a verb to show trying or attempting to do an action to see what it is like ("try doing").',
    englishTemplate: 'I will try to eat {FOOD}.',
    sequenceTemplate: ['私', 'は', '{FOOD}', 'を', '食べて', 'みます'],
    defaultReplacements: {
      '{FOOD}': { japanese: '寿司', english: 'sushi' }
    },
    category: 'food',
    tip: 'Subject + Object + o + Verb Te-form (食べて) + trial helper (みます).',
    pattern: 'Verb (Te-form) + mimasu',
    meaning: 'to indicate trying or attempting an action to see its result ("try doing").'
  },
  {
    id: 22,
    title: 'State of Result 「てあります」',
    concept: 'Combine transitive verbs in Te-form with あります to indicate a state that remains as a result of an intentional action.',
    englishTemplate: 'The hotel is reserved.',
    sequenceTemplate: ['ホテル', 'が', '予約して', 'あります'],
    defaultReplacements: {},
    tip: 'Object + subject marker (が) + Verb Te-form (予約して) + state indicator (あります).',
    pattern: 'Verb (Te-form) + arimasu',
    meaning: 'to describe a state resulting from a purposeful action performed by someone.'
  },
  {
    id: 23,
    title: 'Begin / Approach 「てきます」',
    concept: 'Combine verb Te-form with きます to show an action beginning, or a movement coming toward the speaker\'s focus.',
    englishTemplate: 'It started to rain.',
    sequenceTemplate: ['雨', 'が', '降って', 'きました'],
    defaultReplacements: {},
    tip: 'Subject + Verb Te-form (降って) + approach/start (きました).',
    pattern: 'Verb (Te-form) + kimasu',
    meaning: 'to indicate that an action is beginning or moving toward the speaker\'s location or focus.'
  },
  {
    id: 24,
    title: 'Continue / Depart 「ていきます」',
    concept: 'Combine verb Te-form with いきます to indicate an action continuing into the future, or moving away from the speaker.',
    englishTemplate: 'I will continue to study Japanese.',
    sequenceTemplate: ['私', 'は', '日本語', 'を', '勉強して', 'いきます'],
    defaultReplacements: {},
    tip: 'Subject + Object + o + Verb Te-form (勉強して) + continue (いきます).',
    pattern: 'Verb (Te-form) + ikimasu',
    meaning: 'to indicate that an action will continue into the future or move away from the speaker.'
  },
  {
    id: 25,
    title: 'Easy to do 「やすいです」',
    concept: 'Attach やすいです to a verb ます-stem to indicate that an action is easy or comfortable to perform.',
    englishTemplate: 'This pen is easy to write with.',
    sequenceTemplate: ['この', 'ペン', 'は', '書き', 'やすい', 'です'],
    defaultReplacements: {},
    tip: 'Topic + Verb Masu-stem (書き) + easy helper (やすい) + desu.',
    pattern: 'Verb (Masu-stem) + yasui desu',
    meaning: 'to state that a particular action is easy or simple to execute.'
  },
  {
    id: 26,
    title: 'Hard to do 「にくいです」',
    concept: 'Attach にくいです to a verb ます-stem to indicate that an action is difficult or uncomfortable to perform.',
    englishTemplate: 'This pen is difficult to write with.',
    sequenceTemplate: ['この', 'ペン', 'は', '書き', 'にくい', 'です'],
    defaultReplacements: {},
    tip: 'Topic + Verb Masu-stem (書き) + difficult helper (にくい) + desu.',
    pattern: 'Verb (Masu-stem) + nikui desu',
    meaning: 'to state that a particular action is difficult or complex to execute.'
  },
  {
    id: 27,
    title: 'Instruction 「なさい」',
    concept: 'Attach なさい to a verbます-stem to issue a firm command or instruction, commonly used by parents or teachers.',
    englishTemplate: 'Eat your {FOOD}!',
    sequenceTemplate: ['{FOOD}', 'を', '食べ', 'なさい'],
    defaultReplacements: {
      '{FOOD}': { japanese: '寿司', english: 'sushi' }
    },
    category: 'food',
    tip: 'Object + o + Verb Masu-stem (食べ) + command (なさい).',
    pattern: 'Verb (Masu-stem) + nasai',
    meaning: 'to give a firm, polite command or instruction (less harsh than imperative).'
  },
  {
    id: 28,
    title: 'Way of doing 「かた」',
    concept: 'Attach かた to a verbます-stem (and make the object particle の) to describe the method or way of doing that action.',
    englishTemplate: 'I don\'t know the way to eat this.',
    sequenceTemplate: ['これ', 'の', '食べ方', 'が', 'わかりません'],
    defaultReplacements: {},
    tip: 'Object + no (の) + Verb stem + kata (食べ方) + subject (が) + don\'t know.',
    pattern: 'Noun + no (particle) + Verb (Masu-stem) + kata',
    meaning: 'to express the method, manner, or way of performing an action ("how to").'
  },
  {
    id: 29,
    title: 'Appearance 「そうです」',
    concept: 'Attach そうです to an adjective stem (drop -i, or drop -na) to state that something looks or seems a certain way.',
    englishTemplate: 'This {FOOD} looks delicious.',
    sequenceTemplate: ['この', '{FOOD}', 'は', '美味し', 'そうです'],
    defaultReplacements: {
      '{FOOD}': { japanese: '寿司', english: 'sushi' }
    },
    category: 'food',
    tip: 'Topic + Adjective stem (美味しい -> 美味し) + looks like (そうです).',
    pattern: 'Adjective (Stem) + sou desu',
    meaning: 'to state that something appears or seems to have a quality based on visual evidence ("looks like").'
  },
  {
    id: 30,
    title: 'Hearsay 「そうです」',
    concept: 'Attach そうです to the plain form of a verb or adjective to state information you heard from another source ("I heard that").',
    englishTemplate: 'I heard that he goes to school.',
    sequenceTemplate: ['彼', 'は', '学校', 'に', '行く', 'そうです'],
    defaultReplacements: {},
    tip: 'Topic + Destination + Verb Plain (行く) + hearsay (そうです).',
    pattern: 'Verb/Adjective (Plain-form) + sou desu',
    meaning: 'to report information received from another source ("I heard that / they say that").'
  },
  {
    id: 31,
    title: 'Change to Ability 「ようになります」',
    concept: 'Attach ようになります to a potential verb dictionary form to indicate a gradual transition into being able to do it.',
    englishTemplate: 'I became able to speak Japanese.',
    sequenceTemplate: ['日本語', 'が', '話せる', 'ように', 'なりました'],
    defaultReplacements: {},
    tip: 'Language + ga + Potential Verb Plain (話せる) + state change (ようになりました).',
    pattern: 'Verb (Potential Dictionary-form) + yoo ni + narimasu',
    meaning: 'to indicate that one has acquired the ability to perform a new action ("become able to").'
  },
  {
    id: 32,
    title: 'Effort to do 「ようにします」',
    concept: 'Attach ようにします to a dictionary form or negative plain verb to indicate making a continuous, conscious effort to do it.',
    englishTemplate: 'I try to drink {DRINK} every day.',
    sequenceTemplate: ['毎日', '{DRINK}', 'を', '飲む', 'ように', 'しています'],
    defaultReplacements: {
      '{DRINK}': { japanese: '水', english: 'water' }
    },
    category: 'drink',
    tip: 'Frequency (毎日) + Object + o + Verb Dict (飲む) + effort (ようにしています).',
    pattern: 'Verb (Dictionary/Nai-form) + yoo ni + shimasu',
    meaning: 'to make a conscious, ongoing effort to perform (or avoid) a specific action ("try to").'
  },
  {
    id: 33,
    title: 'Ensure request 「ようにしてください」',
    concept: 'Attach ようにしてください to a verb dictionary or negative form to issue a polite request to ensure a habit.',
    englishTemplate: 'Please make sure to study.',
    sequenceTemplate: ['勉強する', 'ように', 'してください'],
    defaultReplacements: {},
    tip: 'Verb Dictionary (勉強する) + habit request (ようにしてください).',
    pattern: 'Verb (Dictionary/Nai-form) + yoo ni + kudasai',
    meaning: 'to politely command or request someone to make sure to do (or not do) an action as a habit.'
  },
  {
    id: 34,
    title: 'Passive Form 「られます」',
    concept: 'Conjugate verbs into their passive られる form to state that an action was done to you, often indicating adversity.',
    englishTemplate: 'I was eaten by a friend.',
    sequenceTemplate: ['私', 'は', '友達', 'に', '食べられました'],
    defaultReplacements: {},
    tip: 'Victim + wa (は) + Agent + ni (に) + Passive Verb (食べられました).',
    pattern: 'Noun (Victim) + wa (particle) + Noun (Agent) + ni (particle) + Verb (Passive)',
    meaning: 'to express that an action was performed upon a subject by an agent ("be done by").'
  },
  {
    id: 35,
    title: 'Causative Form 「させます」',
    concept: 'Conjugate verbs into their causative させる form to show making or letting someone perform an action.',
    englishTemplate: 'I made him drink {DRINK}.',
    sequenceTemplate: ['私', 'は', '彼', 'に', '{DRINK}', 'を', '飲ませました'],
    defaultReplacements: {
      '{DRINK}': { japanese: '水', english: 'water' }
    },
    category: 'drink',
    tip: 'Director + wa + Doer + ni + Object + o + Causative Verb (飲ませました).',
    pattern: 'Noun (Director) + wa (particle) + Noun (Doer) + ni (particle) + Verb (Causative)',
    meaning: 'to make or allow someone else to perform a specific action ("make/let do").'
  },
  {
    id: 36,
    title: 'Causative Passive 「させられます」',
    concept: 'Combine causative and passive forms to express that you were forced or made to do an action by someone else.',
    englishTemplate: 'I was forced to study by my teacher.',
    sequenceTemplate: ['私', 'は', '先生', 'に', '勉強させられました'],
    defaultReplacements: {},
    tip: 'Subject + wa + Force agent + ni + Causative Passive Verb (勉強させられました).',
    pattern: 'Noun (Subject) + wa (particle) + Noun (Agent) + ni (particle) + Verb (Causative Passive)',
    meaning: 'to express that the subject was forced or coerced into performing an action by someone else.'
  },
  {
    id: 37,
    title: 'Honorific Verb 「いらっしゃる」',
    concept: 'Use special honorific (Keigo) verbs to show deep respect toward the actions of a person of higher status.',
    englishTemplate: 'The teacher went to school.',
    sequenceTemplate: ['先生', 'は', '学校', 'に', 'いらっしゃいました'],
    defaultReplacements: {},
    tip: 'Respected Person + Topic (先生 は) + destination + Respectful verb (いらっしゃいました - went).',
    pattern: 'Noun (Respected) + wa (particle) + Verb (Honorific)',
    meaning: 'to refer to the actions of a respected superior with high honorific status.'
  },
  {
    id: 38,
    title: 'Humble Verb 「まいる」',
    concept: 'Use special humble (Kenjougo) verbs to lower your own actions, showing respect to the person you are speaking to.',
    englishTemplate: 'I humble went to school.',
    sequenceTemplate: ['私', 'は', '学校', 'に', '参りました'],
    defaultReplacements: {},
    tip: 'Speaker + Topic (私 は) + destination + Humble verb (参りました - humble went).',
    pattern: 'Noun (Self) + wa (particle) + Verb (Humble)',
    meaning: 'to refer to the speaker\'s own actions humbly to show respect to the listener.'
  },
  {
    id: 39,
    title: 'Polite Respectful 「お...になります」',
    concept: 'Form an honorific verb by placing お before a verbます-stem, followed by になります.',
    englishTemplate: 'The teacher read the book.',
    sequenceTemplate: ['先生', 'は', '本', 'を', 'お読みになりました'],
    defaultReplacements: {},
    tip: 'Respected Topic + Object + Respectful wrapper (お読みになりました).',
    pattern: 'Noun (Respected) + wa (particle) + o (particle) + o + Verb (Masu-stem) + ni narimasu',
    meaning: 'to express respect for a superior\'s actions using a structured grammatical formula.'
  },
  {
    id: 40,
    title: 'Polite Humble 「お...します」',
    concept: 'Form a humble verb by placing お before a verbます-stem, followed by します (or いたします).',
    englishTemplate: 'I will help the teacher.',
    sequenceTemplate: ['私', 'は', '先生', 'を', 'お手伝いします'],
    defaultReplacements: {},
    tip: 'Self + wa + Respected object + humble wrapper (お手伝いします).',
    pattern: 'Noun (Self) + wa (particle) + Noun (Respected) + o (particle) + o + Verb (Masu-stem) + shimasu',
    meaning: 'to humbly describe your own actions that benefit or affect a respected person.'
  },
  {
    id: 41,
    title: 'Visual Inference 「ようです」',
    concept: 'Attach ようです to plain form verbs, adjectives, or nouns (with の) to express a guess based on sensory evidence.',
    englishTemplate: 'It seems that it rained.',
    sequenceTemplate: ['雨', 'が', '降った', 'よう', 'です'],
    defaultReplacements: {},
    tip: 'Evidence (雨 が 降った) + visual guess (よう です).',
    pattern: 'Verb/Adjective (Plain-form) / Noun + no (particle) + yoo desu',
    meaning: 'to express a conjecture or inference based on sensory, direct observation ("seems like").'
  },
  {
    id: 42,
    title: 'Typical Characteristic 「らしい」',
    concept: 'Attach らしい to nouns to state that something has the typical, prototypical characteristics of that noun ("very typical of").',
    englishTemplate: 'It is a typical spring today.',
    sequenceTemplate: ['今日', 'は', '春', 'らしい', '日', 'です'],
    defaultReplacements: {},
    tip: 'Topic (今日 は) + Noun (春) + typical (らしい) + Noun (日) + desu.',
    pattern: 'Noun + rashii + Noun + desu',
    meaning: 'to state that something exhibits the prototypical or ideal characteristics of a noun.'
  },
  {
    id: 43,
    title: 'Exclusivity 「ばかり」',
    concept: 'Place ばかり after a noun to state that there is nothing but that item, indicating an exclusive frequency or amount.',
    englishTemplate: 'He drinks nothing but {DRINK}.',
    sequenceTemplate: ['彼', 'は', '{DRINK}', 'ばかり', '飲みます'],
    defaultReplacements: {
      '{DRINK}': { japanese: '水', english: 'water' }
    },
    category: 'drink',
    tip: 'Topic + Object (水) + exclusivity (ばかり) + Verb (飲みます).',
    pattern: 'Noun + bakari + Verb',
    meaning: 'to state that a subject does or possesses nothing but one specific item ("nothing but/only").'
  },
  {
    id: 44,
    title: 'Recent Action 「たばかり」',
    concept: 'Attach ばかり to the past plain form (た) of a verb to state that you have just finished doing that action very recently.',
    englishTemplate: 'I have just eaten {FOOD}.',
    sequenceTemplate: ['私', 'は', '{FOOD}', 'を', '食べた', 'ばかり', 'です'],
    defaultReplacements: {
      '{FOOD}': { japanese: '寿司', english: 'sushi' }
    },
    category: 'food',
    tip: 'Subject + Object + Verb Past Plain (食べた) + just completed (ばかりです).',
    pattern: 'Verb (Ta-form) + bakari desu',
    meaning: 'to state that an action was completed very recently, according to the speaker\'s perception ("just finished").'
  },
  {
    id: 45,
    title: 'Immediate Present 「とき」',
    concept: 'Use とき after plain form verbs or adjectives to state the specific timeframe or moment when something occurs.',
    englishTemplate: 'When I go to school, I study.',
    sequenceTemplate: ['学校', 'に', '行く', 'とき', '勉強します'],
    defaultReplacements: {},
    tip: 'Timeframe Verb Plain (行く) + when (とき) + main clause (勉強します).',
    pattern: 'Verb (Plain-form) + toki + Clause',
    meaning: 'to establish the specific time or occasion during which an action or state occurs ("when").'
  },
  {
    id: 46,
    title: 'Immediate Future 「ところです」',
    concept: 'Attach ところです directly to a dictionary-form verb to state that you are just about to perform that action.',
    englishTemplate: 'I am about to go to school.',
    sequenceTemplate: ['私', 'は', '学校', 'に', '行く', 'ところ', 'です'],
    defaultReplacements: {},
    tip: 'Subject + Destination + Verb Dictionary (行く) + about to (ところ です).',
    pattern: 'Verb (Dictionary-form) + tokoro desu',
    meaning: 'to state that the speaker is on the absolute verge of starting an action ("about to").'
  },
  {
    id: 47,
    title: 'Mid-Action 「ているところです」',
    concept: 'Attach ところです to a verb ている progressive form to state that you are right in the middle of performing that action.',
    englishTemplate: 'I am in the middle of drinking {DRINK}.',
    sequenceTemplate: ['私', 'は', '{DRINK}', 'を', '飲んで', 'いる', 'ところ', 'です'],
    defaultReplacements: {
      '{DRINK}': { japanese: '水', english: 'water' }
    },
    category: 'drink',
    tip: 'Subject + Object + Verb Progressive (飲んでいる) + mid-action (ところ です).',
    pattern: 'Verb (Te-form) + iru + tokoro desu',
    meaning: 'to state that the speaker is currently in the active middle of performing an action ("in the middle of").'
  },
  {
    id: 48,
    title: 'Just Completed 「たところです」',
    concept: 'Attach ところです to a verb past plain (た) form to state that you have literally just this second finished the action.',
    englishTemplate: 'I have just eaten {FOOD} this second.',
    sequenceTemplate: ['私', 'は', '{FOOD}', 'を', '食べた', 'ところ', 'です'],
    defaultReplacements: {
      '{FOOD}': { japanese: '寿司', english: 'sushi' }
    },
    category: 'food',
    tip: 'Subject + Object + Verb Past Plain (食べた) + just finished (ところ です).',
    pattern: 'Verb (Ta-form) + tokoro desu',
    meaning: 'to state that an action has literally just been completed this very instant ("just this second").'
  },
  {
    id: 49,
    title: 'Every Time 「たびに」',
    concept: 'Attach たびに to a dictionary-form verb or a noun (with の) to state that whenever X happens, Y always happens.',
    englishTemplate: 'Every time I go to {PLACE}, I study.',
    sequenceTemplate: ['{PLACE}', 'に', '行く', 'たびに', '勉強します'],
    defaultReplacements: {
      '{PLACE}': { japanese: '学校', english: 'school' }
    },
    category: 'place',
    tip: 'Trigger action (行く) + every time (たびに) + consequence (勉強します).',
    pattern: 'Verb (Dictionary-form) / Noun + no (particle) + tabi ni',
    meaning: 'to state that every single time a certain event occurs, another action inevitably follows.'
  },
  {
    id: 50,
    title: 'While / During 「あいだに」',
    concept: 'Use あいだに to show that a one-time action occurs while a continuous state or another action is taking place.',
    englishTemplate: 'While I was studying at school, my friend came.',
    sequenceTemplate: ['学校', 'で', '勉強している', 'あいだに', '友達', 'が', '来ました'],
    defaultReplacements: {},
    tip: 'Continuous clause (勉強している) + while (あいだに) + short action (友達 が 来ました).',
    pattern: 'Verb (Progressive-form) / Noun + no (particle) + aida ni',
    meaning: 'to indicate that a temporary action is performed within the duration of a continuous event.'
  },
  {
    id: 51,
    title: 'While / Before Change 「うちに」',
    concept: 'Use うちに to indicate doing an action while a current temporary state exists, before it changes and makes it impossible.',
    englishTemplate: 'While it is hot, please eat this {FOOD}.',
    sequenceTemplate: ['温かい', 'うちに', 'この', '{FOOD}', 'を', '食べて', 'ください'],
    defaultReplacements: {
      '{FOOD}': { japanese: '寿司', english: 'sushi' }
    },
    category: 'food',
    tip: 'State (温かい) + before it changes (うちに) + request (食べて ください).',
    pattern: 'Verb (Plain-form) / Adjective + uchi ni',
    meaning: 'to suggest doing an action during a favorable state before it changes.'
  },
  {
    id: 52,
    title: 'Agent / By means 「によって」',
    concept: 'Attach によって to indicate the agent of a passive action (e.g. built by, written by) or the cause/method.',
    englishTemplate: 'This school was built by him.',
    sequenceTemplate: ['この', '学校', 'は', '彼', 'によって', '建てられました'],
    defaultReplacements: {},
    tip: 'Object + wa + Creator (彼) + by (によって) + Passive Verb (建てられました).',
    pattern: 'Noun (Creator) + ni yotte + Verb (Passive)',
    meaning: 'to identify the agent who created or performed an action, or specify the cause or method.'
  },
  {
    id: 53,
    title: 'Topic Focus 「について」',
    concept: 'Attach について to a noun to mean "about" or "concerning" that topic. It is followed by active verbs like think, talk, or read.',
    englishTemplate: 'I will study about Japan.',
    sequenceTemplate: ['私', 'は', '日本', 'について', '勉強します'],
    defaultReplacements: {},
    tip: 'Subject + Target Topic (日本) + about (について) + Verb (勉強します).',
    pattern: 'Noun + ni tsuite + Verb',
    meaning: 'to specify the subject matter or topic of an action, discussion, or study ("about/concerning").'
  },
  {
    id: 54,
    title: 'Target Target 「にたいして」',
    concept: 'Attach にたいして to a noun to state an attitude, action, or feeling directed toward a person or topic ("towards/against").',
    englishTemplate: 'I am polite towards the teacher.',
    sequenceTemplate: ['私', 'は', '先生', 'に対して', '親切', 'です'],
    defaultReplacements: {},
    tip: 'Subject + target person (先生) + towards (に対して) + polite/kind (親切 です).',
    pattern: 'Noun (Target) + ni taishite + Clause',
    meaning: 'to indicate the object toward which an attitude, action, or emotion is directed ("towards").'
  },
  {
    id: 55,
    title: 'Topic Context 「にかんして」',
    concept: 'Attach にかんして to a noun to mean "regarding" or "in connection with". It is a formal, written equivalent of について.',
    englishTemplate: 'I study regarding this school.',
    sequenceTemplate: ['この', '学校', 'に関して', '勉強します'],
    defaultReplacements: {},
    tip: 'Topic + regarding (に関して) + Verb (勉強します).',
    pattern: 'Noun + ni kanshite + Verb',
    meaning: 'to introduce a topic or domain of reference formally ("regarding / in connection with").'
  },
  {
    id: 56,
    title: 'Attribute Nominal 「さ」',
    concept: 'Convert an adjective into a noun representing its physical or measurable degree by dropping the final -i and adding さ.',
    englishTemplate: 'I measure the height of the school.',
    sequenceTemplate: ['学校', 'の', '高さ', 'を', '測ります'],
    defaultReplacements: {},
    tip: 'Noun + no + Adjective noun-stem (高さ - height) + o + Verb (測ります).',
    pattern: 'Adjective (i-stem -> sa) + Noun',
    meaning: 'to turn an adjective into a measurable noun state (e.g. high -> height, hot -> heat).'
  },
  {
    id: 57,
    title: 'No Obligation 「なくてもいいです」',
    concept: 'Attach なくてもいいです to a verb negative Nai-stem to state that performing the action is not required or necessary.',
    englishTemplate: 'You do not have to drink {DRINK}.',
    sequenceTemplate: ['{DRINK}', 'を', '飲まなくても', 'いい', 'です'],
    defaultReplacements: {
      '{DRINK}': { japanese: '水', english: 'water' }
    },
    category: 'drink',
    tip: 'Object + Verb negative stem (飲まなくても) + fine (いいです).',
    pattern: 'Verb (Nai-stem) + nakute mo + ii desu',
    meaning: 'to state that a particular action is not mandatory or necessary ("don\'t have to").'
  },
  {
    id: 58,
    title: 'Objective Decision 「とする」',
    concept: 'Attach とします directly to plain form clauses to express acting under an assumption or setting a rule/decision.',
    englishTemplate: 'Suppose that tomorrow is a holiday.',
    sequenceTemplate: ['明日', 'は', '休み', 'と', 'します'],
    defaultReplacements: {},
    tip: 'Topic + Noun (休み) + assumption/decision (と します).',
    pattern: 'Noun / Verb (Plain-form) + to + shimasu',
    meaning: 'to make a decision or establish an assumption/rule ("assume that/decide to").'
  },
  {
    id: 59,
    title: 'No Doubt 「にちがいない」',
    concept: 'Attach にちがいない to plain form verbs, adjectives, or nouns to express a strong, logical certainty ("must be/no doubt").',
    englishTemplate: 'He must go to school.',
    sequenceTemplate: ['彼', 'は', '学校', 'に', '行く', 'にちがいありません'],
    defaultReplacements: {},
    tip: 'Topic + Destination + Verb Plain (行く) + certainty (にちがいありません).',
    pattern: 'Verb/Adjective (Plain-form) + ni chigai nai',
    meaning: 'to express a strong conviction or logical certainty with high confidence ("must be/no doubt").'
  },
  {
    id: 60,
    title: 'Objective Purpose 「ために」',
    concept: 'Attach ために to a dictionary-form verb or a noun (with の) to express a clear objective, purpose, or reason ("in order to").',
    englishTemplate: 'In order to go to school, I study.',
    sequenceTemplate: ['学校', 'に', '行く', 'ために', '勉強します'],
    defaultReplacements: {},
    tip: 'Purpose Verb Dict (行く) + in order to (ために) + Action (勉強します).',
    pattern: 'Verb (Dictionary-form) / Noun + no (particle) + tame ni',
    meaning: 'to indicate the explicit purpose, benefit, or objective of performing an action ("in order to/for").'
  }
];
