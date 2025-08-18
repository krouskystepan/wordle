import { MAX_GUESSES } from '@/data/config'

interface GridProps {
  guesses: string[]
  currentGuess: string
  wordLength: number
  targetWord: string
}

export default function Grid({
  guesses,
  currentGuess,
  wordLength,
  targetWord,
}: GridProps) {
  const getCellColor = (letter: string, idx: number, guess: string) => {
    if (!letter) return 'bg-white border-gray-300 text-black'

    const targetLetters = targetWord.split('')
    const guessLetters = guess.split('')

    const exactMatches = targetLetters.map((t, i) => t === guessLetters[i])

    const letterCounts: Record<string, number> = {}
    targetLetters.forEach((l, i) => {
      if (!exactMatches[i]) {
        letterCounts[l] = (letterCounts[l] || 0) + 1
      }
    })

    if (guessLetters[idx] === targetLetters[idx]) {
      return 'bg-green-500 text-white border-green-500'
    } else if (letterCounts[letter] > 0) {
      letterCounts[letter]--
      return 'bg-yellow-400 text-white border-yellow-400'
    } else {
      return 'bg-gray-400 text-white border-gray-400'
    }
  }

  return (
    <div className="flex flex-col gap-2 items-center mt-10">
      {Array.from({ length: MAX_GUESSES }).map((_, i) => {
        const guess = guesses[i] || (i === guesses.length ? currentGuess : '')
        return (
          <div key={i} className="flex gap-2">
            {Array.from({ length: wordLength }).map((_, j) => {
              const letter = guess[j] || ''
              const colorClass = guesses[i]
                ? getCellColor(letter, j, guess)
                : i === guesses.length
                ? 'bg-white border-gray-300 text-black'
                : 'bg-white border-gray-300 text-black'

              return (
                <div
                  key={j}
                  className={`w-16 h-16 flex justify-center items-center font-bold text-2xl uppercase border-2 ${colorClass}`}
                >
                  {letter}
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}
