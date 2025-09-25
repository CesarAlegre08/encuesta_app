"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { calculateScorePercentage, getScoreMessage } from "@/lib/quiz-utils"
import type { QuizState } from "@/lib/types"
import Image from "next/image"

export default function ResultsPage() {
  const router = useRouter()
  const [quizResults, setQuizResults] = useState<QuizState | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get quiz results from localStorage
    const results = localStorage.getItem("quizResults")
    if (results) {
      try {
        const parsedResults = JSON.parse(results)
        setQuizResults(parsedResults)
      } catch (error) {
        console.error("Error parsing quiz results:", error)
        router.push("/")
      }
    } else {
      // No results found, redirect to home
      router.push("/")
    }
    setLoading(false)
  }, [router])

  const handleViewLeaderboard = () => {
    router.push("/leaderboard")
  }

  if (loading) {
    return (
      <div className="gradient-bg flex items-center justify-center min-h-screen overflow-hidden">
        <div className="text-white text-center space-y-4">
          <div className="text-4xl">⭐</div>
          <p className="text-xl">Cargando resultados...</p>
        </div>
      </div>
    )
  }

  if (!quizResults) {
    return (
      <div className="gradient-bg flex items-center justify-center min-h-screen overflow-hidden">
        <div className="text-white text-center space-y-4">
          <div className="text-4xl">❌</div>
          <p className="text-xl">No se encontraron resultados</p>
          <Button onClick={() => router.push("/")} className="mt-4">
            Volver al inicio
          </Button>
        </div>
      </div>
    )
  }

  const percentage = calculateScorePercentage(quizResults.score, quizResults.questions.length)
  const message = getScoreMessage(percentage)

  return (
    <div className="gradient-bg min-h-screen flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md mx-auto text-center space-y-6">
        {/* Logo and Title Section */}
        <div className="space-y-4">
          {/* UC Logo with Flowers */}
          <div className="relative">
            <Image
              src="/images/logo-flowers.png"
              alt="UC Logo con flores"
              width={160}
              height={48}
              className="mx-auto opacity-90"
            />
          </div>

          {/* Subtitle */}
          <h2 className="text-white text-lg font-normal italic">Contador Público Nacional</h2>
        </div>

        {/* Results Section */}
        <div className="space-y-5">
          {/* Thank You Message */}
          <div className="text-white space-y-3">
            <h3 className="text-2xl font-bold">¡Gracias por Participar!</h3>
            <p className="text-lg">{quizResults.playerName}</p>
          </div>

          {/* Score Display */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-5 space-y-3">
            <div className="text-white space-y-2">
              <div className="text-3xl font-bold">
                {quizResults.score}/{quizResults.questions.length}
              </div>
              <div className="text-lg">{percentage}% de aciertos</div>
              <div className="text-base font-medium">{message}</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleViewLeaderboard}
              className="w-full h-12 text-lg font-medium bg-white/90 hover:bg-white text-purple-800 rounded-3xl border-0 transition-all duration-200 hover:scale-105"
              style={{ fontFamily: "Kalam, cursive" }}
            >
              Ver tabla de posiciones
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 text-white/20 text-4xl animate-pulse">🌸</div>
      <div className="absolute top-20 right-10 text-white/20 text-3xl animate-pulse delay-1000">🌺</div>
      <div className="absolute bottom-20 left-8 text-white/20 text-3xl animate-pulse delay-2000">🌸</div>
      <div className="absolute bottom-32 right-12 text-white/20 text-4xl animate-pulse delay-500">🌺</div>
    </div>
  )
}
