"use client"

import { useEffect, useState } from "react"

export function CelebrationAnimation() {
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    setShowConfetti(true)
    const timer = setTimeout(() => setShowConfetti(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  if (!showConfetti) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* Confetti particles */}
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className="absolute animate-bounce"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
          }}
        >
          {["🎉", "🎊", "⭐", "🌟", "✨"][Math.floor(Math.random() * 5)]}
        </div>
      ))}
    </div>
  )
}
