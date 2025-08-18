'use client'

import { useState, useEffect, useCallback } from 'react'

interface KeyboardProps {
  onKeyPress: (key: string) => void
}

const rows = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM']

export default function Keyboard({ onKeyPress }: KeyboardProps) {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set())

  const pressKey = useCallback(
    (key: string) => {
      setPressedKeys((prev) => new Set(prev).add(key))
      onKeyPress(key)
      setTimeout(() => {
        setPressedKeys((prev) => {
          const newSet = new Set(prev)
          newSet.delete(key)
          return newSet
        })
      }, 150)
    },
    [onKeyPress]
  )

  useEffect(() => {
    const handlePhysicalKey = (e: KeyboardEvent) => {
      let key = e.key
      if (key === 'Enter' || key === 'Backspace' || /^[a-zA-Z]$/.test(key)) {
        if (/^[a-zA-Z]$/.test(key)) key = key.toUpperCase()
        pressKey(key)
      }
    }

    window.addEventListener('keydown', handlePhysicalKey)
    return () => window.removeEventListener('keydown', handlePhysicalKey)
  }, [pressKey])

  return (
    <div className="flex flex-col gap-2 items-center mt-6">
      {rows.map((row, i) => (
        <div key={i} className="flex gap-2">
          {row.split('').map((key) => (
            <button
              key={key}
              onClick={() => pressKey(key)}
              className={`w-12 h-14 rounded-md font-bold text-lg uppercase transition-colors ${
                pressedKeys.has(key) ? 'bg-gray-500' : 'bg-gray-700'
              }`}
            >
              {key}
            </button>
          ))}
        </div>
      ))}
    </div>
  )
}
