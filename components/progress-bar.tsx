'use client'

import { useEffect, useState } from 'react'

export default function ProgressBar() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Fixed timestamps - IST timezone
    const startTime = new Date('2026-02-28T11:00:00+05:30').getTime()
    const endTime = new Date('2026-03-01T17:00:00+05:30').getTime()
    const totalDuration = endTime - startTime

    const updateProgress = () => {
      const now = Date.now()
      const elapsed = Math.max(0, now - startTime)
      const percentage = Math.min(100, (elapsed / totalDuration) * 100)
      setProgress(percentage)
    }

    updateProgress()
    const interval = setInterval(updateProgress, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed bottom-0 left-0 w-full h-1 bg-gray-900 z-20">
      <div
        className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
