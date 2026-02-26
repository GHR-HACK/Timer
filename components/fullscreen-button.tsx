'use client'

import { useEffect, useState } from 'react'
import { Maximize, Minimize } from 'lucide-react'

export default function FullscreenButton() {
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen()
        setIsFullscreen(true)
      } else {
        await document.exitFullscreen()
        setIsFullscreen(false)
      }
    } catch (error) {
      console.error('Fullscreen error:', error)
    }
  }

  return (
    <button
      onClick={toggleFullscreen}
      className="fixed top-8 right-8 z-30 p-3 rounded-lg bg-white/10 backdrop-blur-md hover:bg-white/20 text-white transition-all duration-200 hover:scale-110 active:scale-95"
      aria-label="Toggle fullscreen"
    >
      {isFullscreen ? (
        <Minimize size={24} />
      ) : (
        <Maximize size={24} />
      )}
    </button>
  )
}
