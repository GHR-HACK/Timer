'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'

interface MenuItem {
  id: string
  label: string
  emoji: string
  message?: string
  action?: 'theme' | 'pause' | 'resume' | 'reset'
}

interface FloatingMenuProps {
  onThemeSelect: (theme: string, message: string) => void
  onResetBackground: () => void
}

export default function FloatingMenu({ 
  onThemeSelect, 
  onResetBackground,
}: FloatingMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  const menuItems: MenuItem[] = [
    { id: 'breakfast', label: 'Breakfast', emoji: '🍞', message: '🍞 BREAKFAST TIME', action: 'theme' },
    { id: 'lunch', label: 'Lunch', emoji: '🍽️', message: '🍽️ LUNCH TIME', action: 'theme' },
    { id: 'hiTea', label: 'Hi-Tea', emoji: '☕', message: '☕ HI-TEA TIME', action: 'theme' },
    { id: 'dinner', label: 'Dinner', emoji: '🍴', message: '🍴 DINNER TIME', action: 'theme' },
    { id: 'midnightSnacks', label: 'Midnight Snacks', emoji: '🌙', message: '🌙 MIDNIGHT SNACKS TIME', action: 'theme' },
    { id: 'judging', label: 'Judging Round', emoji: '🏆', message: '🏆 JUDGING ROUND', action: 'theme' },
    { id: 'reset', label: 'Reset Background', emoji: '🔄', action: 'reset' },
  ]

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const handleMenuItemClick = (item: MenuItem) => {
    if (item.action === 'theme' && item.message) {
      onThemeSelect(item.id, item.message)
    } else if (item.action === 'reset') {
      onResetBackground()
    }
    setIsOpen(false)
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={toggleMenu}
        className="fixed bottom-8 right-8 z-40 w-16 h-16 rounded-full 
bg-gradient-to-br from-green-900 via-emerald-800 to-black 
hover:from-green-800 hover:via-emerald-700 hover:to-gray-900 
text-white shadow-lg transition-all duration-300 flex items-center justify-center 
hover:scale-110 active:scale-95"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <X size={28} />
        ) : (
          <Menu size={28} />
        )}
      </button>

      {/* Menu Items - Vertical Stack */}
      {isOpen && (
        <div className="fixed bottom-28 right-8 z-40 flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
          {menuItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => handleMenuItemClick(item)}
              className="group relative flex items-center gap-3 px-5 py-3 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 text-white transition-all duration-200 hover:scale-105 active:scale-95 min-w-max"
              style={{
                animation: isOpen ? `slideIn 0.3s ease-out ${index * 0.05}s forwards` : 'none',
                opacity: isOpen ? 1 : 0,
              }}
            >
              <span className="text-xl">{item.emoji}</span>
              <span className="font-medium text-sm md:text-base whitespace-nowrap">{item.label}</span>
            </button>
          ))}
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  )
}
