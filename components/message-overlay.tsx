'use client'

interface MessageOverlayProps {
  message: string
}

export default function MessageOverlay({ message }: MessageOverlayProps) {
  return (
    <div className="fixed bottom-32 left-1/2 transform -translate-x-1/2 z-30 pointer-events-none">
      <div className="animate-in fade-in zoom-in duration-300">
        <div className="bg-gradient-to-r from-green-900 via-emerald-800 to-gray-900 rounded-2xl px-12 py-8 shadow-2xl">
          <p className="text-3xl md:text-5xl font-black text-white text-center drop-shadow-lg animate-pulse">
            {message}
          </p>
        </div>
      </div>
    </div>
  )
}
