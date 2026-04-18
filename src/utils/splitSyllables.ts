export async function splitSyllables(word: string): Promise<string[]> {
  const res = await fetch('/api/split-syllables', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ word }),
  })
  if (!res.ok) throw new Error('فشل تحليل الكلمة')
  const data = await res.json()
  return data.syllables as string[]
}
