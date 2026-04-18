type ArabicEntry = { root_word: string; [key: string]: unknown }

let dictionary: string[] | null = null

// دالة توحيد الحروف (تعامل أ، إ، آ كـ ا)
function normalize(str: string): string {
  if (!str) return "";
  return str
    .normalize("NFC")
    .replace(/[أإآ]/g, "ا") // توحيد الألفات
    .replace(/ة/g, "ه")    // توحيد التاء المربوطة
    .replace(/[^\u0621-\u064A]/g, ""); // إزالة التشكيل وأي رموز غريبة
}

export async function loadDictionary(): Promise<string[]> {
  if (dictionary) return dictionary;
  
  try {
    const res = await fetch('/arabic.json');
    if (!res.ok) throw new Error("فشل تحميل القاموس");
    
    const data: ArabicEntry[] = await res.json();
    // نقوم بتخزين الكلمات موحدة من البداية لنسهل البحث
    dictionary = data.map((e) => e.root_word).filter(Boolean);
    console.log("Dictionary loaded:", dictionary.length, "words");
    return dictionary;
  } catch (error) {
    console.error("Error loading dictionary:", error);
    return [];
  }
}

export function searchWords(words: string[], syllable: string): string[] {
  const normSyllable = normalize(syllable);

  // نستخدم التوحيد على الكلمة أثناء الفلترة
  return words.filter((w) => {
    const normWord = normalize(w);
    return normWord.startsWith(normSyllable);
  });
  // تم إزالة .slice(0, 20) لظهور كل النتائج
}
