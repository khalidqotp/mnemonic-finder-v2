type ArabicEntry = { root_word: string; [key: string]: unknown }

let dictionary: string[] | null = null

export async function loadDictionary(): Promise<string[]> {
  if (dictionary) return dictionary
  const res = await fetch('/arabic.json')
  const data: ArabicEntry[] = await res.json()
  dictionary = data.map((e) => e.root_word).filter(Boolean)
  return dictionary
}

export function searchWords(words: string[], syllable: string): string[] {
  return words.filter((w) => w.startsWith(syllable)).slice(0, 20)
}
