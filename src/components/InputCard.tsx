interface InputCardProps {
  word: string
  loading: boolean
  onWordChange: (v: string) => void
  onAnalyze: () => void
  onExampleClick: (ex: string) => void
}

const EXAMPLES = ['سوكاري', 'جاكاري', 'كونيتشيوا', 'سيتاي', 'تاسكيتي', 'أوكاشي', 'هاياكو']

export default function InputCard({ word, loading, onWordChange, onAnalyze, onExampleClick }: InputCardProps) {
  return (
    <div className="input-card">
      <div className="input-row">
        <input
          type="text"
          className="word-input"
          value={word}
          onChange={(e) => onWordChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onAnalyze()}
          placeholder="مثلاً: كونيتشيوا"
          autoComplete="off"
          dir="rtl"
        />
        <button className="go-btn" disabled={loading} onClick={onAnalyze}>
          {loading ? '...' : 'حلّل'}
        </button>
      </div>
      <p className="hint">
        اكتب الكلمة اليابانية كما تُنطق بالعربي — مثلاً <em>سوكاري</em> أو <em>جاكاري</em> أو{' '}
        <em>كونيتشيوا</em>
      </p>
      <div className="examples">
        {EXAMPLES.map((ex) => (
          <span
            key={ex}
            className="ex-chip"
            onClick={() => onExampleClick(ex)}
          >
            {ex}
          </span>
        ))}
      </div>
    </div>
  )
}
