export interface ChosenWord {
  syllable: string
  word: string
}

interface BuilderCardProps {
  chosenWords: ChosenWord[]
  onRemove: (syllable: string) => void
  mnemonic: string
  onMnemonicChange: (v: string) => void
}

export default function BuilderCard({ chosenWords, onRemove, mnemonic, onMnemonicChange }: BuilderCardProps) {
  if (chosenWords.length === 0) return null

  const placeholder = `مثلاً: ${chosenWords.map((c) => c.word).join(' ')} ...`

  return (
    <div className="builder-card visible">
      <div className="builder-top">
        <div className="builder-label">كلماتك المختارة:</div>
        <div className="chosen-words">
          {chosenWords.map((c) => (
            <div key={c.syllable} className="chosen-tag">
              <span>{c.word}</span>
              <span className="remove" onClick={() => onRemove(c.syllable)}>
                ✕
              </span>
            </div>
          ))}
        </div>
      </div>
      <textarea
        className="mnemonic-box"
        placeholder={placeholder}
        value={mnemonic}
        onChange={(e) => onMnemonicChange(e.target.value)}
      />
    </div>
  )
}
