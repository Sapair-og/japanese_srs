import React from 'react';
import { describe, it, expect } from 'vitest';
import { formatJapanese, renderFurigana } from './furiganaParser';

describe('furiganaParser tests', () => {
  describe('formatJapanese tests', () => {
    it('should return raw text if no brackets are present', () => {
      expect(formatJapanese('日本語')).toBe('日本語');
    });

    it('should extract kanji in kanji mode', () => {
      expect(formatJapanese('漢字[かんじ]', 'kanji')).toBe('漢字');
      expect(formatJapanese('日本語[にほんご]を勉強[べんきょう]する', 'kanji')).toBe('日本語を勉強する');
    });

    it('should extract kana in kana mode', () => {
      expect(formatJapanese('漢字[かんじ]', 'kana')).toBe('かんじ');
      expect(formatJapanese('日本語[にほんご]を勉強[べんきょう]する', 'kana')).toBe('にほんごをべんきょうする');
    });

    it('should parse brackets into ruby element parts in both mode', () => {
      const result = formatJapanese('漢字[かんじ]', 'both');
      expect(Array.isArray(result)).toBe(true);
      // First part should be ruby tag, let's check it has a ruby element
      const rubyEl = result[0];
      expect(rubyEl.type).toBe('ruby');
      expect(rubyEl.props.children[0]).toBe('漢字');
    });
  });

  describe('renderFurigana tests', () => {
    it('should render pure hiragana if no kanji is present', () => {
      expect(renderFurigana('', 'ねこ')).toBe('ねこ');
    });

    it('should render kanji in kanji mode', () => {
      expect(renderFurigana('猫', 'ねこ', 'kanji')).toBe('猫');
    });

    it('should render hiragana in kana mode', () => {
      expect(renderFurigana('猫', 'ねこ', 'kana')).toBe('ねこ');
    });

    it('should render ruby element in both mode if different', () => {
      const result = renderFurigana('猫', 'ねこ', 'both');
      expect(result.type).toBe('ruby');
      expect(result.props.children[0]).toBe('猫');
      expect(result.props.children[1].props.children).toBe('ねこ');
    });

    it('should use bracket parser if kanji has bracket notation', () => {
      const result = renderFurigana('猫[ねこ]', '', 'both');
      expect(Array.isArray(result)).toBe(true);
      expect(result[0].type).toBe('ruby');
    });
  });
});
