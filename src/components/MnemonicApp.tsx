import { useState, useEffect, useRef, useCallback } from 'react'
import InputCard from './InputCard'
import ResultsColumns, { type SyllableResult } from './ResultsColumns'
import BuilderCard, { type ChosenWord } from './BuilderCard'
import { splitSyllables } from '../utils/splitSyllables'
import { loadDictionary, searchWords } from '../utils/wordSearch'

type AppState = 'idle' | 'loading' | 'results' | 'error'

export default function MnemonicApp() {
  const [word, setWord] = useState('')
  const [appState, setAppState] = useState<AppState>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [originalWord, setOriginalWord] = useState('')
  const [syllables, setSyllables] = useState<SyllableResult[]>([])
  const [chosenWords, setChosenWords] = useState<ChosenWord[]>([])
  const [mnemonic, setMnemonic] = useState('')
  const [toast, setToast] = useState('')
  const [toastVisible, setToastVisible] = useState(false)
  const builderRef = useRef<HTMLDivElement>(null)
  const dictRef = useRef<string[] | null>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    loadDictionary().then((d) => { dictRef.current = d })
  }, [])

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    setToastVisible(true)
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToastVisible(false), 2200)
  }, [])

  const analyze = useCallback(async (overrideWord?: string) => {
    const target = (overrideWord ?? word).trim()
    if (!target) return

    setAppState('loading')
    setChosenWords([])
    setMnemonic('')
    setOriginalWord(target)

    try {
      const dict = dictRef.current ?? await loadDictionary()
      dictRef.current = dict

      const syls = await splitSyllables(target)
      if (!syls.length) throw new Error('ما قدرناش نقسّم الكلمة')

      const results: SyllableResult[] = syls.map((syl) => ({
        syllable: syl,
        words: searchWords(dict, syl),
      }))

      setSyllables(results)
      setAppState('results')
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'خطأ غير معروف')
      setAppState('error')
    }
  }, [word])

  const handlePickWord = useCallback((syllable: string, w: string) => {
    setChosenWords((prev) => {
      const idx = prev.findIndex((c) => c.syllable === syllable && c.word === w)
      if (idx !== -1) return prev.filter((_, i) => i !== idx)
      const sylIdx = prev.findIndex((c) => c.syllable === syllable)
      if (sylIdx !== -1) {
        const next = [...prev]
        next[sylIdx] = { syllable, word: w }
        return next
      }
      return [...prev, { syllable, word: w }]
    })
    showToast(`✓ "${w}" اتاختار — اكتب جملتك بالأسفل`)
    setTimeout(() => builderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50)
  }, [showToast])

  const handleRemove = useCallback((syllable: string) => {
    setChosenWords((prev) => prev.filter((c) => c.syllable !== syllable))
  }, [])

  const handleExampleClick = useCallback((ex: string) => {
    setWord(ex)
    analyze(ex)
  }, [analyze])

  return (
    <>
      <div className="page">
        <header>
          <div className="tag">🧠 مولّد المنيمونكس الياباني</div>
          <h1>اكتب الكلمة — وابني المنيمونك</h1>
          <p className="sub">
            اكتب الكلمة اليابانية بالعربي، وهنقسّمها لمقاطع ونجيبلك كل الكلمات العربية الممكنة لكل مقطع عشان تختار وتبني جملتك
          </p>
        </header>

        <InputCard
          word={word}
          loading={appState === 'loading'}
          onWordChange={setWord}
          onAnalyze={() => analyze()}
          onExampleClick={handleExampleClick}
        />

        <div id="mainArea">
          {appState === 'idle' && (
            <div className="state-empty">
              <div className="icon">🈳</div>
              <p>اكتب كلمة يابانية بالأعلى وهيظهر هنا عواميد الكلمات العربية لكل مقطع منها</p>
            </div>
          )}
          {appState === 'loading' && (
            <div className="state-loading">
              <div className="spinner-ring" />
              <span>بنحلّل الكلمة ونجيب الكلمات...</span>
            </div>
          )}
          {appState === 'error' && (
            <div className="state-error">❌ {errorMsg}</div>
          )}
          {appState === 'results' && (
            <ResultsColumns
              originalWord={originalWord}
              syllables={syllables}
              onPickWord={handlePickWord}
            />
          )}
        </div>

        <div ref={builderRef}>
          <BuilderCard
            chosenWords={chosenWords}
            onRemove={handleRemove}
            mnemonic={mnemonic}
            onMnemonicChange={setMnemonic}
          />
        </div>
      </div>

      <div className={`toast${toastVisible ? ' show' : ''}`}>{toast}</div>
    </>
  )
}
