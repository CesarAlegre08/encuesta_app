"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import Image from "next/image"
import { votingQuestions } from "@/lib/voting-data"
import type { Vote } from "@/lib/types"

export default function VotingPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [votes, setVotes] = useState<Vote[]>([])
  const [selectedOption, setSelectedOption] = useState<string>("")
  const [textResponse, setTextResponse] = useState<string>("")
  const [participantName, setParticipantName] = useState<string>("")
  const [sessionId] = useState<string>(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)
  const router = useRouter()

  useEffect(() => {
    const name = localStorage.getItem("playerName")
    if (name) {
      setParticipantName(name)
    } else {
      router.push("/")
    }
  }, [router])

  const currentQuestion = votingQuestions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / votingQuestions.length) * 100

  const allOptionsHaveImages =
    currentQuestion?.type === "multiple_choice" &&
    currentQuestion.options.length > 0 &&
    currentQuestion.options.every((option) => option.image)

  const handleVote = async () => {
    if (!currentQuestion) return

    const vote: Vote = {
      id: `vote_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      session_id: sessionId,
      question_id: currentQuestion.id,
      selected_option: currentQuestion.type === "multiple_choice" ? selectedOption : undefined,
      text_response: currentQuestion.type === "text_input" ? textResponse : undefined,
      voted_at: new Date().toISOString(),
    }

    const newVotes = [...votes, vote]
    setVotes(newVotes)

    try {
      const response = await fetch("/api/save-vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session_id: sessionId,
          question_id: currentQuestion.id,
          selected_option: currentQuestion.type === "multiple_choice" ? selectedOption : undefined,
          text_response: currentQuestion.type === "text_input" ? textResponse : undefined,
          participant_name: participantName,
        }),
      })

      if (!response.ok) {
        console.error("Failed to save vote to database")
      }
    } catch (error) {
      console.error("Error saving vote:", error)
    }

    // Store votes in localStorage
    localStorage.setItem("votingResults", JSON.stringify(newVotes))

    // Reset form
    setSelectedOption("")
    setTextResponse("")

    // Move to next question or finish
    if (currentQuestionIndex < votingQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      // Voting complete
      localStorage.setItem("votingComplete", "true")
      router.push("/voting-results")
    }
  }

  const canProceed = currentQuestion?.type === "multiple_choice" ? selectedOption !== "" : textResponse.trim() !== ""

  if (!currentQuestion) {
    return <div>Cargando...</div>
  }

  return (
    <div className="gradient-bg min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-white text-sm">
            <span>
              Pregunta {currentQuestionIndex + 1} de {votingQuestions.length}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2 bg-white/20" />
        </div>

        {/* Question Card */}
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
          <CardContent className="p-8">
            <div className="space-y-6">
              {/* Question Text */}
              <h2 className="text-2xl font-bold text-purple-800 text-center leading-relaxed">
                {currentQuestion.question_text}
              </h2>

              {/* Multiple Choice Options */}
              {currentQuestion.type === "multiple_choice" && (
                <div className="space-y-4">
                  {allOptionsHaveImages ? (
                    <div
                      className={`grid gap-6 ${
                        currentQuestion.options.length <= 3
                          ? "grid-cols-1 sm:grid-cols-3"
                          : currentQuestion.options.length === 4
                            ? "grid-cols-2"
                            : "grid-cols-2 sm:grid-cols-3"
                      }`}
                    >
                      {currentQuestion.options.map((option) => (
                        <div
                          key={option.id}
                          className={`relative cursor-pointer transition-all duration-200 rounded-2xl overflow-hidden group ${
                            selectedOption === option.id
                              ? "ring-4 ring-purple-600 shadow-2xl scale-105"
                              : "hover:shadow-xl hover:scale-102"
                          }`}
                          onClick={() => setSelectedOption(option.id)}
                        >
                          <div className="w-full h-80 relative bg-gray-100 rounded-2xl overflow-hidden">
                            <Image
                              src={option.image || "/placeholder.svg"}
                              alt={option.text}
                              fill
                              className="object-contain object-center p-2"
                              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                            />
                            {/* Selection indicator */}
                            <div
                              className={`absolute top-3 right-3 w-6 h-6 rounded-full border-2 bg-white/90 transition-all duration-200 ${
                                selectedOption === option.id ? "border-purple-600 scale-110" : "border-gray-300"
                              }`}
                            >
                              {selectedOption === option.id && (
                                <div className="w-full h-full rounded-full bg-purple-600 scale-50"></div>
                              )}
                            </div>
                            {/* Hover overlay */}
                            <div className="absolute inset-0 bg-purple-600/0 group-hover:bg-purple-600/10 transition-all duration-200"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {currentQuestion.options.map((option) => (
                        <div
                          key={option.id}
                          className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                            selectedOption === option.id
                              ? "border-purple-600 bg-purple-50 shadow-lg"
                              : "border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-25"
                          }`}
                          onClick={() => setSelectedOption(option.id)}
                        >
                          <div className="flex items-center space-x-4">
                            {option.image && (
                              <div className="flex-shrink-0">
                                <div className="w-24 h-24 relative rounded-xl overflow-hidden bg-gray-100">
                                  <Image
                                    src={option.image || "/placeholder.svg"}
                                    alt={option.text}
                                    fill
                                    className="object-contain object-center p-1"
                                  />
                                </div>
                              </div>
                            )}
                            <div className="flex-1">
                              <p className="text-lg font-medium text-purple-800">{option.text}</p>
                            </div>
                            <div className="flex-shrink-0">
                              <div
                                className={`w-6 h-6 rounded-full border-2 ${
                                  selectedOption === option.id ? "border-purple-600 bg-purple-600" : "border-gray-300"
                                }`}
                              >
                                {selectedOption === option.id && (
                                  <div className="w-full h-full rounded-full bg-white scale-50"></div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Text Input */}
              {currentQuestion.type === "text_input" && (
                <div className="space-y-4">
                  <Textarea
                    placeholder="Escribe tu respuesta aquí..."
                    value={textResponse}
                    onChange={(e) => setTextResponse(e.target.value)}
                    className="min-h-32 text-lg border-2 border-purple-200 focus:border-purple-600 rounded-2xl p-4"
                  />
                </div>
              )}

              {/* Next Button */}
              <div className="pt-4">
                <Button
                  onClick={handleVote}
                  disabled={!canProceed}
                  className="w-full h-14 text-xl font-medium bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-2xl border-0 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {currentQuestionIndex < votingQuestions.length - 1 ? "Siguiente" : "Finalizar"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 text-white/20 text-4xl animate-pulse">🌸</div>
        <div className="absolute top-20 right-10 text-white/20 text-3xl animate-pulse delay-1000">🌺</div>
        <div className="absolute bottom-20 left-8 text-white/20 text-3xl animate-pulse delay-2000">🌸</div>
        <div className="absolute bottom-32 right-12 text-white/20 text-4xl animate-pulse delay-500">🌺</div>
      </div>
    </div>
  )
}
