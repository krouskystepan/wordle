'use client'

import { useEffect, useState } from 'react'
import Grid from '@/components/Grid'
import Keyboard from '@/components/Keyboard'

export default function Home() {
  const [wordLength, setWordLength] = useState(5)
  const [maxGuesses, setMaxGuesses] = useState(6)
  const [words, setWords] = useState<string[]>([])
  const [targetWord, setTargetWord] = useState('')
  const [guesses, setGuesses] = useState<string[]>([])
  const [currentGuess, setCurrentGuess] = useState('')
  const [gameOver, setGameOver] = useState(false)
  const [letterStatuses, setLetterStatuses] = useState<Record<string, string>>(
    {}
  )
  const [invalidGuess, setInvalidGuess] = useState(false)

  useEffect(() => {
    if (wordLength === 4) setMaxGuesses(5)
    if (wordLength === 5) setMaxGuesses(6)
    if (wordLength === 6) setMaxGuesses(7)
  }, [wordLength])

  useEffect(() => {
    fetch(`/${wordLength}-words.txt`)
      .then((res) => res.text())
      .then((text) => {
        const loadedWords = text.split('\n').map((w) => w.trim().toUpperCase())
        setWords(loadedWords)
        const randomWord =
          loadedWords[Math.floor(Math.random() * loadedWords.length)]
        setTargetWord(randomWord)
        setGuesses([])
        setCurrentGuess('')
        setGameOver(false)
        setLetterStatuses({})
      })
  }, [wordLength])

  useEffect(() => {
    if (targetWord) console.log('Target word is:', targetWord)
  }, [targetWord])

  const updateLetterStatuses = (guess: string) => {
    const newStatuses = { ...letterStatuses }

    guess.split('').forEach((letter, idx) => {
      if (letter === targetWord[idx]) {
        newStatuses[letter] = 'correct'
      } else if (targetWord.includes(letter)) {
        if (newStatuses[letter] !== 'correct') newStatuses[letter] = 'present'
      } else {
        newStatuses[letter] = 'absent'
      }
    })

    setLetterStatuses(newStatuses)
  }

  const handleKey = (key: string) => {
    if (!targetWord || gameOver) return

    if (key === 'Enter') {
      if (currentGuess.length === targetWord.length) {
        const guessUpper = currentGuess.toUpperCase()

        if (!words.includes(guessUpper)) {
          setInvalidGuess(true)
          setTimeout(() => setInvalidGuess(false), 600)
          return
        }

        const newGuesses = [...guesses, guessUpper]
        setGuesses(newGuesses)
        updateLetterStatuses(guessUpper)
        setCurrentGuess('')

        if (guessUpper === targetWord) setGameOver(true)
        else if (newGuesses.length === maxGuesses) setGameOver(true)
      }
    } else if (key === 'Backspace') {
      setCurrentGuess((prev) => prev.slice(0, -1))
    } else if (
      /^[A-Z]$/i.test(key) &&
      currentGuess.length < targetWord.length
    ) {
      setCurrentGuess((prev) => prev + key.toUpperCase())
    }
  }

  const resetGame = () => {
    if (words.length === 0) return
    const newWord = words[Math.floor(Math.random() * words.length)]
    setTargetWord(newWord)
    setGuesses([])
    setCurrentGuess('')
    setGameOver(false)
    setLetterStatuses({})
  }

  return (
    <div className="flex flex-col items-center p-6 bg-black h-dvh">
      <h1 className="text-5xl font-bold text-white">Infinite Wordle</h1>

      <div className="flex gap-3 my-8">
        {[4, 5, 6].map((len) => (
          <button
            key={len}
            onClick={() => setWordLength(len)}
            className={`px-4 py-2 rounded-lg border-none cursor-pointer ${
              wordLength === len
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            {len} Letter Wordle
          </button>
        ))}
      </div>

      {targetWord && (
        <>
          <Grid
            guesses={guesses}
            currentGuess={currentGuess}
            wordLength={targetWord.length}
            targetWord={targetWord}
            maxGuesses={maxGuesses}
            invalidGuess={invalidGuess}
          />
          <Keyboard onKeyPress={handleKey} letterStatuses={letterStatuses} />
          {gameOver && (
            <div className="mt-4 text-xl font-semibold flex flex-col items-center text-white">
              {guesses[guesses.length - 1] === targetWord ? (
                <p>🎉 You won!</p>
              ) : (
                <p>Game Over! Word was {targetWord}</p>
              )}
              <button
                onClick={resetGame}
                className="cursor-pointer mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                🔄 Reset Game
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
