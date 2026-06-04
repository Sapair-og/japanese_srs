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
    tip: 'Destination + Direction (に) + Verb Plain (行く) + Contextual conditional (なら) + Train + Subject (が) + Adjective (便利) + Copula (です).',
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
  }
];
