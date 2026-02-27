'use client'

import { useEffect, useState } from 'react'
import CountdownDisplay from '@/components/countdown-display'
import FloatingMenu from '@/components/floating-menu'
import ProgressBar from '@/components/progress-bar'
import FullscreenButton from '@/components/fullscreen-button'
import MessageOverlay from '@/components/message-overlay'

export default function Page() {
  const [mounted, setMounted] = useState(false)
  const [backgroundTheme, setBackgroundTheme] = useState('default')
  const [displayMessage, setDisplayMessage] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)

    // Load saved background preference
    const saved = localStorage.getItem('hackathon-bg-theme')
    if (saved) {
      setBackgroundTheme(saved)
    }

    // Set fixed start time on first load (or update if code changed)
    // CHANGE THIS DATE AND TIME TO YOUR HACKATHON START TIME
    // Format: new Date(year, month-1, day, hour, minute, second)
    // NOTE: month is 0-indexed
    const startTimeStr = localStorage.getItem('startTime')
    const fixedStartTime = new Date(2026, 1, 28, 10, 0, 0).getTime()

    // If missing or different from the code-provided fixed start time, update storage.
    // This helps during development when you change the hardcoded start time.
    if (!startTimeStr) {
      localStorage.setItem('startTime', String(fixedStartTime))
      localStorage.setItem('totalPausedDuration', '0')
    } else {
      const stored = parseInt(startTimeStr, 10)
      if (stored !== fixedStartTime) {
        localStorage.setItem('startTime', String(fixedStartTime))
        localStorage.setItem('totalPausedDuration', '0')
      }
    }

  }, [])


  const handleResetBackground = () => {
    setBackgroundTheme('default')
    localStorage.setItem('hackathon-bg-theme', 'default')
    setDisplayMessage(null) // hide any previous message
    playNotificationSound()
  }

  const handleThemeSelect = (theme: string, message?: string) => {
    setBackgroundTheme(theme)
    localStorage.setItem('hackathon-bg-theme', theme)

    if (message) {
      setDisplayMessage(message)
    }

    playNotificationSound()
  }

  const playNotificationSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.value = 800
      oscillator.type = 'sine'

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.1)
    } catch (error) {
      console.log('[v0] Audio context not available')
    }
  }

  if (!mounted) return null

  const backgroundImageUrl = getBackgroundImage(backgroundTheme)

  return (
    <main
      className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center"
      style={{
        backgroundImage: backgroundImageUrl,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div
        className="absolute inset-0 bg-black/40 transition-opacity duration-500"
        style={{
          opacity: backgroundTheme === 'default' ? 0.4 : 0.5,
        }}
      />

      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
        <CountdownDisplay />
        <ProgressBar />
      </div>

      {displayMessage && <MessageOverlay message={displayMessage} />}

      <FloatingMenu
        onThemeSelect={handleThemeSelect}
        onResetBackground={handleResetBackground}
      />

      <FullscreenButton />
    </main>
  )
}

function getBackgroundImage(theme: string): string {
  const images: Record<string, string> = {
    // Local images served from the `public/bg/` folder
    // Place your image files in `public/bg/` with these names:
    // default.jpg, breakfast.jpg, lunch.jpg, hiTea.jpg, dinner.jpg, midnightSnacks.jpg, judging.jpg, announcement.jpg
    default: "url('/bg/default.png')",
    breakfast: "url('/bg/Break.png')",
    lunch: "url('/bg/lunch.png')",
    hiTea: "url('/bg/tea.png')",
    dinner: "url('/bg/Dinner.jpeg')",
    midnightSnacks: "url('/bg/midnight.png')",
    judging: "url('/bg/judge.png')"
  }

  return images[theme] || images.default
}
