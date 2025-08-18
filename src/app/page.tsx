'use client'

import { useEffect, useState } from 'react'
import Grid from '@/components/Grid'
import Keyboard from '@/components/Keyboard'
import { WORD_LENGTH, MAX_GUESSES } from '@/data/config'

export default function Home() {
  const [words, setWords] = useState<string[]>([])
  const [targetWord, setTargetWord] = useState('')
  const [guesses, setGuesses] = useState<string[]>([])
  const [currentGuess, setCurrentGuess] = useState('')
  const [gameOver, setGameOver] = useState(false)

  useEffect(() => {
    fetch('/words-en.txt')
      .then((res) => res.text())
      .then((text) => {
        const loadedWords = text.split('\n').map((w) => w.trim().toUpperCase())
        setWords(loadedWords)
        setTargetWord(
          loadedWords[Math.floor(Math.random() * loadedWords.length)]
        )
      })
  }, [])

  useEffect(() => {
    if (targetWord) {
      console.log('Target word is:', targetWord)
    }
  }, [targetWord])

  const handleKey = (key: string) => {
    if (!targetWord || gameOver) return

    if (key === 'Enter') {
      if (currentGuess.length === WORD_LENGTH) {
        const newGuesses = [...guesses, currentGuess.toUpperCase()]
        setGuesses(newGuesses)
        setCurrentGuess('')

        if (currentGuess.toUpperCase() === targetWord) setGameOver(true)
        else if (newGuesses.length === MAX_GUESSES) setGameOver(true)
      }
    } else if (key === 'Backspace') {
      setCurrentGuess((prev) => prev.slice(0, -1))
    } else if (/^[A-Z]$/i.test(key) && currentGuess.length < WORD_LENGTH) {
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
  }

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-5xl font-bold mb-4">Custom Wordle</h1>
      {targetWord && (
        <>
          <Grid
            guesses={guesses}
            currentGuess={currentGuess}
            wordLength={WORD_LENGTH}
            targetWord={targetWord}
          />
          <Keyboard onKeyPress={handleKey} />
          {gameOver && (
            <div className="mt-4 text-xl font-semibold flex flex-col items-center">
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
