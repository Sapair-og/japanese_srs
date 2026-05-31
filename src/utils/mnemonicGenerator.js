const mnemonicDictionary = {
  // Verbs
  "たべる": "Sounds like table - eat your food at the table! (taberu)",
  "taberu": "Sounds like table - eat your food at the table!",
  "のむ": "Sounds like no more - 'No more drinks for me!' (nomu)",
  "nomu": "Sounds like no more - 'No more drinks for me!'",
  "いく": "Sounds like eagle going away - 'I go!' (iku)",
  "iku": "Sounds like eagle going away - 'I go!'",
  "くる": "Sounds like crew coming to rescue us. (kuru)",
  "kuru": "Sounds like crew coming to rescue us.",
  "する": "Sounds like sue - suing is something lawyers do. (suru)",
  "suru": "Sounds like sue - suing is something lawyers do.",
  "はなす": "Sounds like harnessing - harnessing words when you speak. (hanasu)",
  "hanasu": "Sounds like harnessing - harnessing words when you speak.",
  "みる": "Sounds like mirror - look in the mirror to see yourself. (miru)",
  "miru": "Sounds like mirror - look in the mirror to see yourself.",
  "かく": "Sounds like cactus - scratch a message on a cactus to write. (kaku)",
  "kaku": "Sounds like cactus - scratch a message on a cactus to write.",
  "よむ": "Sounds like yo moo - reading a book to a cow: 'Yo, moo!' (yomu)",
  "yomu": "Sounds like yo moo - reading a book to a cow: 'Yo, moo!'",
  "きく": "Sounds like key crew - the key crew is listening carefully. (kiku)",
  "kiku": "Sounds like key crew - the key crew is listening carefully.",
  "ねる": "Sounds like nail - try to sleep on a bed of nails. (neru)",
  "neru": "Sounds like nail - try to sleep on a bed of nails.",
  "おきる": "Sounds like oak ear - the oak ear wakes up and is alert. (okiru)",
  "okiru": "Sounds like oak ear - the oak ear wakes up and is alert.",
  "あう": "Sounds like ow! - bumping into someone when you meet. (au)",
  "au": "Sounds like ow! - bumping into someone when you meet.",
  "かう": "Sounds like cow - going to the market to buy a cow. (kau)",
  "kau": "Sounds like cow - going to the market to buy a cow.",
  
  // Nouns
  "ともだち": "Sounds like tomorrow dachi - tomorrow I will play with my friend. (tomodachi)",
  "tomodachi": "Sounds like tomorrow dachi - tomorrow I will play with my friend.",
  "せんせい": "Sounds like cents say - teachers say wise words to earn their cents. (sensei)",
  "sensei": "Sounds like cents say - teachers say wise words to earn their cents.",
  "にほんご": "Nihon (Japan) + Go (Language) = Japanese language. (nihongo)",
  "nihongo": "Nihon (Japan) + Go (Language) = Japanese language.",
  "みず": "Sounds like me-zoo - drinking clean water at the zoo. (mizu)",
  "mizu": "Sounds like me-zoo - drinking clean water at the zoo.",
  "ほん": "Sounds like home - reading a book at home. (hon)",
  "hon": "Sounds like home - reading a book at home.",
  "がっこう": "Sounds like got-cool - you got cool by going to school. (gakkou)",
  "gakkou": "Sounds like got-cool - you got cool by going to school.",
  "いぬ": "Sounds like in-you - there is a loyal dog in you. (inu)",
  "inu": "Sounds like in-you - there is a loyal dog in you.",
  "ねこ": "Sounds like neck-o - a cute cat wrapping around your neck. (neko)",
  "neko": "Sounds like neck-o - a cute cat wrapping around your neck.",
  "とけい": "Sounds like toe-kay - checking your toe clock: 'Is it okay?' (tokei)",
  "tokei": "Sounds like toe-kay - checking your toe clock: 'Is it okay?'",
  "かばん": "Sounds like cabin - packing your bags to go to a cabin. (kaban)",
  "kaban": "Sounds like cabin - packing your bags to go to a cabin.",
  "くるま": "Sounds like crew-man - a crew of men working on a car. (kuruma)",
  "kuruma": "Sounds like crew-man - a crew of men working on a car.",
  "へや": "Sounds like hey-ya - dancing and shouting 'hey-ya!' in your room. (heya)",
  "heya": "Sounds like hey-ya - dancing and shouting 'hey-ya!' in your room.",
  "いえ": "Sounds like ee-eh - 'Is this house yours? Ee-eh!' (ie)",
  "ie": "Sounds like ee-eh - 'Is this house yours? Ee-eh!'",
  "まど": "Sounds like mad-dog - a mad dog barking out the window. (mado)",
  "mado": "Sounds like mad-dog - a mad dog barking out the window.",
  
  // Adjectives
  "あつい": "Sounds like a-choo! - sneezing in the hot weather. (atsui)",
  "atsui": "Sounds like a-choo! - sneezing in the hot weather.",
  "さむい": "Sounds like some ice - some ice is very cold. (samui)",
  "samui": "Sounds like some ice - some ice is very cold.",
  "やすい": "Sounds like yes-we - 'Yes, we can afford it because it's cheap!' (yasui)",
  "yasui": "Sounds like yes-we - 'Yes, we can afford it because it's cheap!'",
  "たかい": "Sounds like taco-eye - looking at a very expensive taco. (takai)",
  "takai": "Sounds like taco-eye - looking at a very expensive taco.",
  "おいしい": "Sounds like oh-she-eat - 'Oh, she eats it all because it is delicious!' (oishii)",
  "oishii": "Sounds like oh-she-eat - 'Oh, she eats it all because it is delicious!'",
};

export const generateMnemonic = (hiragana, romaji, english) => {
  const hClean = (hiragana || '').toLowerCase().trim();
  const rClean = (romaji || '').toLowerCase().trim();
  
  // Check exact matches
  if (mnemonicDictionary[hClean]) return mnemonicDictionary[hClean];
  if (mnemonicDictionary[rClean]) return mnemonicDictionary[rClean];

  // Phonetic rule generator
  const refString = rClean || hClean;
  if (!refString) return `Connect word with meaning: ${english}`;

  // Analyze syllables
  let association;

  if (refString.startsWith('ta')) { association = 'TAstying'; }
  else if (refString.startsWith('mi')) { association = 'MIrroring'; }
  else if (refString.startsWith('ka')) { association = 'KAsting eyes on'; }
  else if (refString.startsWith('ki')) { association = 'KIcking'; }
  else if (refString.startsWith('ko')) { association = 'KOala hugging'; }
  else if (refString.startsWith('ku')) { association = 'KUdos for'; }
  else if (refString.startsWith('sa')) { association = 'SAvoring'; }
  else if (refString.startsWith('su')) { association = 'SUper-sizing'; }
  else if (refString.startsWith('sh')) { association = 'SHowing'; }
  else if (refString.startsWith('ne')) { association = 'NEstling'; }
  else if (refString.startsWith('no')) { association = 'NOticing'; }
  else if (refString.startsWith('yo')) { association = 'YOdling about'; }
  else if (refString.startsWith('ha')) { association = 'HAndling'; }
  else if (refString.startsWith('ma')) { association = 'MAking'; }
  else if (refString.startsWith('me')) { association = 'MEeting'; }
  else if (refString.startsWith('o')) { association = 'Obtaining'; }
  else if (refString.startsWith('a')) { association = 'Acquiring'; }
  else if (refString.startsWith('i')) { association = 'Imagining'; }
  else if (refString.startsWith('u')) { association = 'Uncovering'; }
  else if (refString.startsWith('e')) { association = 'Exploring'; }
  else {
    // Fallback based on first letter
    const firstLetter = refString.charAt(0).toUpperCase();
    return `Mnemonic: To remember ${hiragana} (${romaji || 'reading'}), link the sound of '${firstLetter}' to: ${english}.`;
  }

  return `Phonetic Trick: To remember ${hiragana} (${romaji || 'reading'}), think of ${association} ${english}!`;
};
