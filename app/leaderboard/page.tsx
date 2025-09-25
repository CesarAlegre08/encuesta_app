"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { getLeaderboard } from "@/lib/quiz-utils"
import type { GameSession } from "@/lib/types"
import Image from "next/image"

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<GameSession[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadLeaderboard()
  }, [])

  const loadLeaderboard = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getLeaderboard(1000) // Get up to 1000 results to show all players
      setLeaderboard(data)
    } catch (err) {
      console.error("Error loading leaderboard:", err)
      setError("Error al cargar la tabla de posiciones")
    } finally {
      setLoading(false)
    }
  }

  const getRankEmoji = (position: number) => {
    switch (position) {
      case 1:
        return "🥇"
      case 2:
        return "🥈"
      case 3:
        return "🥉"
      default:
        return "🏅"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="gradient-bg flex items-center justify-center min-h-screen">
        <div className="text-white text-center space-y-4">
          <div className="text-6xl animate-bounce">🏆</div>
          <p className="text-xl" style={{ fontFamily: "Kalam, cursive" }}>
            Cargando tabla de posiciones...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="gradient-bg flex flex-col items-center justify-start p-4 min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-white/10 text-6xl animate-pulse">🌸</div>
        <div className="absolute top-20 right-10 text-white/10 text-5xl animate-pulse delay-1000">🌺</div>
        <div className="absolute bottom-20 left-8 text-white/10 text-5xl animate-pulse delay-2000">🌸</div>
        <div className="absolute bottom-32 right-12 text-white/10 text-6xl animate-pulse delay-500">🌺</div>
        <div className="absolute top-1/2 left-4 text-white/5 text-4xl animate-pulse delay-3000">🌼</div>
        <div className="absolute top-1/3 right-6 text-white/5 text-4xl animate-pulse delay-1500">🌻</div>
      </div>

      <div className="w-full max-w-4xl mx-auto space-y-6 relative z-10">
        <div className="text-center space-y-6 py-6">
          <div className="relative">
            <Image
              src="/images/logo-flowers.png"
              alt="UC Logo con flores"
              width={180}
              height={54}
              className="mx-auto opacity-95 drop-shadow-lg"
              priority
            />
          </div>

          <div className="space-y-2">
            <h2 className="text-white/90 text-lg font-normal italic" style={{ fontFamily: "Kalam, cursive" }}>
              Contador Público Nacional
            </h2>

            <div className="flex items-center justify-center space-x-3">
              <div className="text-4xl">🏆</div>
              <h1 className="text-white text-3xl font-bold" style={{ fontFamily: "Kalam, cursive" }}>
                Tabla de Posiciones
              </h1>
              <div className="text-4xl">🏆</div>
            </div>

            <p className="text-white/80 text-lg" style={{ fontFamily: "Kalam, cursive" }}>
              Ranking completo de todos los jugadores
            </p>
          </div>
        </div>

        <div className="flex-1">
          {error ? (
            <div className="bg-white/15 backdrop-blur-md rounded-3xl p-8 text-center border border-white/20 shadow-2xl">
              <div className="text-white space-y-6">
                <div className="text-6xl">❌</div>
                <h3 className="text-xl font-bold" style={{ fontFamily: "Kalam, cursive" }}>
                  ¡Oops! Algo salió mal
                </h3>
                <p className="text-lg opacity-90" style={{ fontFamily: "Kalam, cursive" }}>
                  {error}
                </p>
                <Button
                  onClick={loadLeaderboard}
                  className="bg-white/90 hover:bg-white text-purple-800 rounded-2xl px-8 py-3 text-lg font-medium transition-all duration-200 hover:scale-105 shadow-lg"
                  style={{ fontFamily: "Kalam, cursive" }}
                >
                  🔄 Intentar de nuevo
                </Button>
              </div>
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="bg-white/15 backdrop-blur-md rounded-3xl p-12 text-center border border-white/20 shadow-2xl">
              <div className="text-white space-y-6">
                <div className="text-8xl animate-bounce">🏆</div>
                <h3 className="text-2xl font-bold" style={{ fontFamily: "Kalam, cursive" }}>
                  ¡La tabla está vacía!
                </h3>
                <p className="text-xl opacity-90" style={{ fontFamily: "Kalam, cursive" }}>
                  Aún no hay jugadores registrados
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white/15 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-2xl">
              <div className="text-center mb-6">
                <h3 className="text-white text-xl font-bold" style={{ fontFamily: "Kalam, cursive" }}>
                  🌟 {leaderboard.length} Jugador{leaderboard.length !== 1 ? "es" : ""} Registrado
                  {leaderboard.length !== 1 ? "s" : ""} 🌟
                </h3>
              </div>

              <div className="space-y-3">
                {leaderboard.map((session, index) => (
                  <div
                    key={session.id}
                    className={`flex items-center justify-between p-4 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] ${
                      index === 0
                        ? "bg-gradient-to-r from-yellow-400/30 to-yellow-300/20 border-2 border-yellow-400/50 shadow-lg"
                        : index === 1
                          ? "bg-gradient-to-r from-gray-300/30 to-gray-200/20 border-2 border-gray-300/50 shadow-md"
                          : index === 2
                            ? "bg-gradient-to-r from-orange-400/30 to-orange-300/20 border-2 border-orange-400/50 shadow-md"
                            : "bg-white/15 border border-white/30"
                    } hover:bg-white/25`}
                  >
                    {/* Left side: Rank and Player */}
                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                      <div className="flex flex-col items-center flex-shrink-0">
                        <span className={`${index < 3 ? "text-3xl" : "text-2xl"} drop-shadow-lg`}>
                          {getRankEmoji(index + 1)}
                        </span>
                        <div className={`text-white font-bold ${index < 3 ? "text-sm" : "text-xs"}`}>#{index + 1}</div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div
                          className={`text-white font-bold truncate ${
                            index === 0 ? "text-xl" : index < 3 ? "text-lg" : "text-base"
                          } drop-shadow-sm`}
                          style={{ fontFamily: "Kalam, cursive" }}
                          title={session.player_name}
                        >
                          {index === 0 && "👑 "}
                          {session.player_name}
                        </div>
                        <div className="text-white/80 text-sm" style={{ fontFamily: "Kalam, cursive" }}>
                          📅 {formatDate(session.completed_at)}
                        </div>
                      </div>
                    </div>

                    {/* Right side: Score with better visual emphasis */}
                    <div className="flex flex-col items-center flex-shrink-0 bg-white/20 rounded-xl p-3 min-w-[80px]">
                      <div
                        className={`text-white font-bold ${
                          index === 0 ? "text-2xl" : index < 3 ? "text-xl" : "text-lg"
                        } drop-shadow-sm`}
                        style={{ fontFamily: "Kalam, cursive" }}
                      >
                        {session.score}/{session.total_questions}
                      </div>
                      <div className={`text-white/90 font-medium ${index < 3 ? "text-sm" : "text-xs"}`}>
                        {Math.round((session.score / session.total_questions) * 100)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="w-full text-center py-6 mt-8 relative z-10">
          <p className="text-white/60 text-sm" style={{ fontFamily: "Kalam, cursive" }}>
            © 2025 Cesar Joaquín Alegre Báez - Todos los derechos reservados
          </p>
        </div>
      </div>
    </div>
  )
}
