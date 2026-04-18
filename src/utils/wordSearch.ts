export function searchWords(words: string[], syllable: string): string[] {
 
  const normalize = (str: string) => {
    return str
      .replace(/[أإآ]/g, 'ا') 
      .replace(/[^\u0621-\u064A]/g, '');
  };

  const normalizedSyllable = normalize(syllable);

  return words.filter((w) => {
    
    return normalize(w).startsWith(normalizedSyllable);
  });

}
