"use client"

import { Button } from "@/components/ui/button"

interface EmptyLeaderboardProps {
  onPlayNow: () => void
}

export function EmptyLeaderboard({ onPlayNow }: EmptyLeaderboardProps) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 text-center space-y-6">
      <div className="text-white space-y-4">
        <div className="text-6xl">🏆</div>
        <h3 className="text-2xl font-bold" style={{ fontFamily: "Kalam, cursive" }}>
          ¡La tabla está vacía!
        </h3>
        <p className="text-lg opacity-90" style={{ fontFamily: "Kalam, cursive" }}>
          Sé el primero en establecer un récord
        </p>
        <div className="pt-4">
          <Button
            onClick={onPlayNow}
            className="bg-white/90 hover:bg-white text-purple-800 rounded-3xl px-8 py-3 text-lg font-medium transition-all duration-200 hover:scale-105"
            style={{ fontFamily: "Kalam, cursive" }}
          >
            ¡Jugar ahora!
          </Button>
        </div>
      </div>
    </div>
  )
}
