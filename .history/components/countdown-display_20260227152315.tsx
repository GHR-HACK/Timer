'use client'

import { useEffect, useState } from 'react'

interface TimeRemaining {
  hours: number
  minutes: number
  seconds: number
  totalSeconds: number
}

interface CountdownDisplayProps {
  onCountdownEnded?: () => void
  isPaused?: boolean
}

export default function CountdownDisplay({ onCountdownEnded, isPaused = false }: CountdownDisplayProps) {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    hours: 30,
    minutes: 0,
    seconds: 0,
    totalSeconds: 108000,
  })
  const [isEnded, setIsEnded] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)

  useEffect(() => {
    const updateCountdown = () => {
      const startTimeStr = localStorage.getItem('startTime')
      if (!startTimeStr) {
        return
      }

      const now = Date.now()
      const startTime = parseInt(startTimeStr, 10)

      const THIRTY_HOURS_MS = 30 * 60 * 60 * 1000
      const endTime = startTime + THIRTY_HOURS_MS

      // If current time is BEFORE start time, show countdown to start
      if (now < startTime) {
        setHasStarted(false)
        setIsEnded(false)
        const remainingToStart = Math.max(0, startTime - now)
        const totalSeconds = Math.floor(remainingToStart / 1000)
        const hours = Math.floor(totalSeconds / 3600)
        const minutes = Math.floor((totalSeconds % 3600) / 60)
        const seconds = totalSeconds % 60

        setTimeRemaining({
          hours,
          minutes,
          seconds,
          totalSeconds,
        })
        return
      }

      // Hackathon has started - now count down 30 hours from start time
      setHasStarted(true)
      setIsEnded(false)

      // Account for paused time
      let pausedDuration = 0
      const pauseTimeStr = localStorage.getItem('pauseTime')
      const totalPausedDurationStr = localStorage.getItem('totalPausedDuration')

      if (isPaused && pauseTimeStr) {
        const pauseTime = parseInt(pauseTimeStr, 10)
        const currentPausedDuration = now - pauseTime
        pausedDuration = (parseInt(totalPausedDurationStr || '0', 10)) + currentPausedDuration
      } else if (totalPausedDurationStr) {
        pausedDuration = parseInt(totalPausedDurationStr, 10)
      }

      // Calculate remaining time accounting for paused duration
      const adjustedEndTime = endTime + pausedDuration
      const remaining = Math.max(0, adjustedEndTime - now)

      if (remaining <= 0) {
        setIsEnded(true)
        setTimeRemaining({
          hours: 0,
          minutes: 0,
          seconds: 0,
          totalSeconds: 0,
        })
        onCountdownEnded?.()
        return
      }
      setIsEnded(false)

      const totalSeconds = Math.floor(remaining / 1000)
      const hours = Math.floor(totalSeconds / 3600)
      const minutes = Math.floor((totalSeconds % 3600) / 60)
      const seconds = totalSeconds % 60

      setTimeRemaining({
        hours,
        minutes,
        seconds,
        totalSeconds,
      })
    }

    // Initial update
    updateCountdown()

    // Update every second
    const intervalId = window.setInterval(updateCountdown, 1000)

    return () => window.clearInterval(intervalId)
  }, [isPaused, onCountdownEnded])

  const formatNumber = (num: number): string => {
    return String(num).padStart(2, '0')
  }

  if (isEnded) {
    return (
      <div className="text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-white drop-shadow-2xl">
          HACKATHON COMPLETED
        </h1>
      </div>
    )
  }

  const startTimeStr = localStorage.getItem('startTime')
  const startTime = startTimeStr ? parseInt(startTimeStr, 10) : 0
  const now = Date.now()
  const isCountingToStart = now < startTime

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      {/* Status indicator */}
      <div className="text-white text-xl md:text-2xl font-bold">
        {isCountingToStart ? 'WAITING TO START' : 'HACKATHON RUNNING'}
      </div>

      {/* Main countdown card */}
      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
        <div className="flex items-center justify-center gap-6 md:gap-8">
          {/* Hours Box */}
          <div className="flex flex-col items-center gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl px-8 md:px-12 py-6 md:py-8 shadow-lg">
              <div className="text-5xl md:text-7xl font-bold text-white">
                {formatNumber(timeRemaining.hours)}
              </div>
            </div>
            <p className="text-sm md:text-base font-bold text-gray-700 tracking-widest">HOURS</p>
          </div>

          {/* Separator */}
          <div className="text-4xl md:text-6xl font-bold text-blue-600 animate-pulse">:</div>

          {/* Minutes Box */}
          <div className="flex flex-col items-center gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl px-8 md:px-12 py-6 md:py-8 shadow-lg">
              <div className="text-5xl md:text-7xl font-bold text-white">
                {formatNumber(timeRemaining.minutes)}
              </div>
            </div>
            <p className="text-sm md:text-base font-bold text-gray-700 tracking-widest">MINUTES</p>
          </div>

          {/* Separator */}
          <div className="text-4xl md:text-6xl font-bold text-blue-600 animate-pulse">:</div>

          {/* Seconds Box */}
          <div className="flex flex-col items-center gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl px-8 md:px-12 py-6 md:py-8 shadow-lg">
              <div className="text-5xl md:text-7xl font-bold text-white">
                {formatNumber(timeRemaining.seconds)}
              </div>
            </div>
            <p className="text-sm md:text-base font-bold text-gray-700 tracking-widest">SECONDS</p>
          </div>
        </div>
      </div>

      {/* Paused indicator */}
      {isPaused && (
        <div className="text-2xl font-bold text-yellow-300 drop-shadow-lg animate-pulse">
          ⏸️ PAUSED
        </div>
      )}
    </div>
  )
}
