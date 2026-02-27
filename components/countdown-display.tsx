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
}

export default function CountdownDisplay({ onCountdownEnded }: CountdownDisplayProps) {
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

      const remaining = Math.max(0, endTime - now)

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
  }, [onCountdownEnded])

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

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      {/* Main countdown card */}
      <div className=" rounded-3xl shadow-2xl p-8 md:p-12">
        <div className="flex items-center justify-center gap-6 md:gap-8">
          {/* Hours Box */}
          <div className="flex flex-col items-center gap-4">
            <div className="bg-[#1F2A23] rounded-2xl px-8 md:px-12 py-6 md:py-8 shadow-lg">
              <div className="text-5xl md:text-7xl font-bold text-white">
                {formatNumber(timeRemaining.hours)}
              </div>
            </div>
            <p className="text-sm md:text-base font-bold tracking-widest text-white">HOURS</p>
          </div>

          {/* Separator */}
          <div className="text-4xl md:text-6xl font-bold text-[#0A6522] animate-pulse">:</div>

          {/* Minutes Box */}
          <div className="flex flex-col items-center gap-4">
            <div className="bg-[#1F2A23]  rounded-2xl px-8 md:px-12 py-6 md:py-8 shadow-lg">
              <div className="text-5xl md:text-7xl font-bold text-white">
                {formatNumber(timeRemaining.minutes)}
              </div>
            </div>
            <p className="text-sm md:text-base font-bold tracking-widest text-white">MINUTES</p>
          </div>

          {/* Separator */}
          <div className="text-4xl md:text-6xl font-bold text-[#0A6522] animate-pulse">:</div>

          {/* Seconds Box */}
                <div className="flex flex-col items-center gap-4">
                  <div className="bg-[#1F2A23] rounded-2xl px-8 md:px-12 py-6 md:py-8 shadow-lg">
              <div className="text-5xl md:text-7xl font-bold text-white">
                {formatNumber(timeRemaining.seconds)}
              </div>
            </div>
            <p className="text-sm md:text-base font-bold tracking-widest text-white">SECONDS</p>
          </div>
        </div>
      </div>

    </div>
  )
}
