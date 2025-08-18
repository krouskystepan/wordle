'use client'

import { useEffect, useState } from 'react'
import Grid from '@/components/Grid'
import Keyboard from '@/components/Keyboard'
import { WORD_LENGTH, MAX_GUESSES } from '@/data/config'

export default function Home() {
  const [targetWord, setTargetWord] = useState('')
  const [guesses, setGuesses] = useState<string[]>([])
  const [currentGuess, setCurrentGuess] = useState('')
  const [gameOver, setGameOver] = useState(false)

  useEffect(() => {
    fetch('/words.txt')
      .then((res) => res.text())
      .then((text) => {
        const words = text.split('\n').map((w) => w.trim().toUpperCase())
        const randomWord = words[Math.floor(Math.random() * words.length)]
        setTargetWord(randomWord)
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

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6">Custom Wordle</h1>
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
            <p className="mt-4 text-xl font-semibold">
              {guesses[guesses.length - 1] === targetWord
                ? '🎉 You won!'
                : `Game Over! Word was ${targetWord}`}
            </p>
          )}
        </>
      )}
    </div>
  )
}
