export interface SyllableResult {
  syllable: string
  words: string[]
}

interface ResultsColumnsProps {
  originalWord: string
  syllables: SyllableResult[]
  onPickWord: (syllable: string, word: string) => void
}

export default function ResultsColumns({ originalWord, syllables, onPickWord }: ResultsColumnsProps) {
  const total = syllables.reduce((sum, s) => sum + s.words.length, 0)

  return (
    <div className="results-card">
      <div className="results-top">
        <div className="results-title">
          نتائج: <span className="original-word-display">{originalWord}</span>
        </div>
        <div className="info-badge">
          {total} كلمة في {syllables.length} مقاطع
        </div>
      </div>
      <div style={{ padding: '1.25rem 1rem 0.5rem' }}>
        
        {/* Syllable bar */}
        <div className="syllable-bar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          {syllables.map((s, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center' }}>
              {i > 0 && <span className="syl-plus" style={{ margin: '0 0.5rem' }}>+</span>}
              <div className="syl-pill">{s.syllable}</div>
            </span>
          ))}
        </div>

        {/* Columns */}
        {/* استخدمنا هنا Inline Style عشان نجبر الأعمدة تبدأ من فوق (flex-start) */}
        <div 
          className="columns-wrap" 
          style={{ 
            display: 'flex', 
            alignItems: 'flex-start', /* هو ده الحل اللي بيمنع أي عمود يطلع أو ينزل عن الباقي */
            justifyContent: 'center',
            gap: '1.5rem', /* المسافة بين الأعمدة */
            width: '100%',
            flexWrap: 'wrap' /* عشان لو الشاشة صغرت ينزلوا تحت بعض */
          }}
        >
          {syllables.map((s, i) => (
            <div key={i} className="col-block" style={{ flex: '1', minWidth: '150px' }}>
              
              {/* Header بتاع العمود */}
              <div 
                className="col-header" 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '0.5rem',
                  marginBottom: '1rem'
                }}
              >
                <div className="col-syl">{s.syllable}</div>
                <div className="col-count">{s.words.length} كلمة</div>
              </div>

              {/* الكلمات جوه العمود */}
              <div className="col-items">
                {s.words.length === 0 ? (
                  <div className="col-empty">
                    <div className="no-icon">🈳</div>
                    <div>ما لقيناش كلمات لهذا المقطع</div>
                  </div>
                ) : (
                  s.words.map((w, j) => (
                    <div key={j} className="word-item" onClick={() => onPickWord(s.syllable, w)}>
                      {w.startsWith(s.syllable) ? (
                        <>
                          <span className="word-highlight">{s.syllable}</span>
                          {w.slice(s.syllable.length)}
                        </>
                      ) : (
                        w
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
