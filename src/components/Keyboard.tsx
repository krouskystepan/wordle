'use client'

import { useState, useEffect, useCallback } from 'react'

interface KeyboardProps {
  onKeyPress: (key: string) => void
  letterStatuses: Record<string, string>
}

const rows = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM']

export default function Keyboard({
  onKeyPress,
  letterStatuses,
}: KeyboardProps) {
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

  const getKeyColor = (key: string) => {
    const status = letterStatuses[key]
    if (status === 'absent') return 'bg-black text-gray-700'
    return 'bg-gray-800 text-white'
  }

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
    <div className="flex flex-col gap-2 items-center">
      {/* 1. řada */}
      <div className="flex gap-2">
        {rows[0].split('').map((key) => (
          <button
            key={key}
            onClick={() => pressKey(key)}
            className={`w-12 h-14 rounded-md font-bold text-lg uppercase transition-colors border border-gray-800 cursor-pointer ${getKeyColor(
              key
            )} ${pressedKeys.has(key) ? 'brightness-150' : ''}`}
          >
            {key}
          </button>
        ))}
      </div>

      {/* 2. řada */}
      <div className="flex gap-2">
        {rows[1].split('').map((key) => (
          <button
            key={key}
            onClick={() => pressKey(key)}
            className={`w-12 h-14 rounded-md font-bold text-lg uppercase transition-colors border border-gray-800 cursor-pointer ${getKeyColor(
              key
            )} ${pressedKeys.has(key) ? 'brightness-150' : ''}`}
          >
            {key}
          </button>
        ))}
      </div>

      <div className="flex gap-2 items-center">
        <button
          onClick={() => pressKey('Enter')}
          className="w-20 h-14 rounded-md font-bold text-lg uppercase transition-colors border border-gray-800 cursor-pointer bg-emerald-800 text-white"
        >
          Enter
        </button>

        {rows[2].split('').map((key) => (
          <button
            key={key}
            onClick={() => pressKey(key)}
            className={`w-12 h-14 rounded-md font-bold text-lg uppercase transition-colors border border-gray-800 cursor-pointer ${getKeyColor(
              key
            )} ${pressedKeys.has(key) ? 'brightness-150' : ''}`}
          >
            {key}
          </button>
        ))}

        <button
          onClick={() => pressKey('Backspace')}
          className={
            'w-20 h-14 rounded-md font-bold text-lg uppercase transition-colors border border-gray-800 cursor-pointer bg-red-700 text-white'
          }
        >
          ⌫
        </button>
      </div>
    </div>
  )
}
