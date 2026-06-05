import React from 'react';

/**
 * Utility to parse bracketed Japanese text like "漢字[かんじ]" into JSX ruby tags.
 * Falls back to plain text if no brackets are found.
 */
export function parseFurigana(text) {
  if (!text) return '';
  
  // Match Kanji characters followed by brackets: e.g. 漢字[かんじ]
  const regex = /([\u4e00-\u9faf\u3005]+)\[([^\s[\]]+)\]/g;
  
  // If there are no matches, return raw text
  if (!text.match(regex)) {
    return text;
  }
  
  const parts = [];
  let lastIndex = 0;
  let match;
  
  while ((match = regex.exec(text)) !== null) {
    const matchIndex = match.index;
    
    // Push preceding plain text
    if (matchIndex > lastIndex) {
      parts.push(text.substring(lastIndex, matchIndex));
    }
    
    const kanji = match[1];
    const furigana = match[2];
    
    parts.push(
      <ruby key={matchIndex} className="ruby-char">
        {kanji}
        <rt className="ruby-text text-[10px] select-none text-claude-coral opacity-90 tracking-normal font-sans font-bold block pb-0.5">{furigana}</rt>
      </ruby>
    );
    
    lastIndex = regex.lastIndex;
  }
  
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }
  
  return parts;
}

/**
 * Formats Japanese text according to the global furiganaMode setting.
 * Modes:
 * - 'both': Show Kanji with Furigana (renders ruby elements)
 * - 'kanji': Show raw Kanji only (hides furigana)
 * - 'kana': Show raw Kana only (hides kanji)
 */
export function formatJapanese(text, mode = 'both') {
  if (!text) return '';
  
  if (mode === 'kanji') {
    return text.replace(/([\u4e00-\u9faf\u3005]+)\[([^\s[\]]+)\]/g, '$1');
  }
  
  if (mode === 'kana') {
    return text.replace(/([\u4e00-\u9faf\u3005]+)\[([^\s[\]]+)\]/g, '$2');
  }
  
  return parseFurigana(text);
}

/**
 * Renders Japanese text with furigana ruby tags based on the mode.
 * Handles both bracketed text and separate kanji/hiragana fields.
 */
export function renderFurigana(kanji, hiragana, mode = 'both') {
  if (!kanji) return hiragana || '';
  
  // If kanji has bracket notation, use formatJapanese
  const hasBrackets = kanji.includes('[') && kanji.includes(']');
  if (hasBrackets) {
    return formatJapanese(kanji, mode);
  }
  
  // No brackets, but we have both kanji and hiragana
  if (mode === 'kanji') {
    return kanji;
  }
  if (mode === 'kana') {
    return hiragana || kanji;
  }
  
  // mode === 'both'
  if (hiragana && hiragana !== kanji) {
    return (
      <ruby className="ruby-char">
        {kanji}
        <rt className="ruby-text text-[10px] select-none text-claude-coral opacity-90 tracking-normal font-sans font-bold block pb-0.5">{hiragana}</rt>
      </ruby>
    );
  }
  
  return kanji;
}

