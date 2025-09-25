"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import Image from "next/image"
import { votingQuestions } from "@/lib/voting-data"
import type { Vote, VotingResults } from "@/lib/types"

export default function VotingResultsPage() {
  const [results, setResults] = useState<VotingResults[]>([])
  const [totalParticipants, setTotalParticipants] = useState(0)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if voting was completed
    const votingComplete = localStorage.getItem("votingComplete")
    if (!votingComplete) {
      router.push("/")
      return
    }

    fetchResultsFromDatabase()
  }, [router])

  const fetchResultsFromDatabase = async () => {
    try {
      setLoading(true)
      console.log("[v0] Fetching results from database")
      const response = await fetch("/api/get-results")

      if (!response.ok) {
        throw new Error("Failed to fetch results")
      }

      const data = await response.json()
      console.log("[v0] Received data from API:", data)

      if (data.success) {
        const calculatedResults = calculateResultsFromDatabase(data.results, data.textResponses, data.rawAnswers)
        console.log("[v0] Calculated results:", calculatedResults)
        setResults(calculatedResults)

        // Count unique participants from raw answers
        const uniqueParticipants = new Set(data.rawAnswers?.map((answer: any) => answer.session_id) || []).size
        setTotalParticipants(uniqueParticipants)
      } else {
        console.error("Failed to fetch results:", data.error)
        // Fallback to localStorage if database fails
        fallbackToLocalStorage()
      }
    } catch (error) {
      console.error("Error fetching results:", error)
      // Fallback to localStorage if database fails
      fallbackToLocalStorage()
    } finally {
      setLoading(false)
    }
  }

  const fallbackToLocalStorage = () => {
    // Get all votes from localStorage as fallback
    const storedVotes = localStorage.getItem("votingResults")
    if (storedVotes) {
      const votes: Vote[] = JSON.parse(storedVotes)
      const calculatedResults = calculateResults(votes)
      setResults(calculatedResults)

      const uniqueParticipants = new Set(votes.map((vote) => vote.session_id)).size
      setTotalParticipants(uniqueParticipants)
    }
  }

  const calculateResultsFromDatabase = (dbResults: any, textResponses: any, rawAnswers: any[]): VotingResults[] => {
    console.log("[v0] Calculating results from database:", { dbResults, textResponses })

    return votingQuestions.map((question) => {
      const questionId = question.id
      const questionResults = dbResults[questionId] || {}

      if (question.type === "multiple_choice") {
        const totalVotes = Object.values(questionResults).reduce((sum: number, count: any) => sum + count, 0) as number

        const results = question.options
          .map((option, index) => {
            const optionNumber = (index + 1).toString()
            const count = questionResults[optionNumber] || 0
            const percentage = totalVotes > 0 ? (count / totalVotes) * 100 : 0

            return {
              option: option.text,
              count,
              percentage: Math.round(percentage),
              image: option.image,
            }
          })
          .sort((a, b) => b.count - a.count) // Sort by count descending

        return {
          question_id: question.id,
          question_text: question.question_text,
          results,
        }
      } else {
        const responses = textResponses[questionId] || []

        return {
          question_id: question.id,
          question_text: question.question_text,
          results: [],
          text_responses: responses,
        }
      }
    })
  }

  const calculateResults = (votes: Vote[]): VotingResults[] => {
    return votingQuestions.map((question) => {
      const questionVotes = votes.filter((vote) => vote.question_id === question.id)

      if (question.type === "multiple_choice") {
        const optionCounts: { [key: string]: number } = {}

        // Count votes for each option
        questionVotes.forEach((vote) => {
          if (vote.selected_option) {
            optionCounts[vote.selected_option] = (optionCounts[vote.selected_option] || 0) + 1
          }
        })

        // Calculate percentages and create results
        const totalVotes = questionVotes.length
        const results = question.options
          .map((option, index) => {
            const optionNumber = (index + 1).toString()
            const count = optionCounts[optionNumber] || 0
            const percentage = totalVotes > 0 ? (count / totalVotes) * 100 : 0

            return {
              option: option.text,
              count,
              percentage: Math.round(percentage),
              image: option.image,
            }
          })
          .sort((a, b) => b.count - a.count) // Sort by count descending

        return {
          question_id: question.id,
          question_text: question.question_text,
          results,
        }
      } else {
        // Text input questions
        const textResponses = questionVotes
          .map((vote) => vote.text_response)
          .filter((response) => response && response.trim() !== "")

        return {
          question_id: question.id,
          question_text: question.question_text,
          results: [],
          text_responses: textResponses,
        }
      }
    })
  }

  if (loading) {
    return (
      <div className="gradient-bg min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Cargando resultados...</div>
      </div>
    )
  }

  return (
    <div className="gradient-bg min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">Resultados de la Encuesta</h1>
          <p className="text-xl text-white/90">
            Total de participantes: <span className="font-bold">{totalParticipants}</span>
          </p>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {results.map((result, index) => (
            <Card key={result.question_id} className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl text-purple-800">
                  {index + 1}. {result.question_text}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {result.results.length > 0 ? (
                  <div className="space-y-4">
                    {result.results.map((option, optionIndex) => (
                      <div key={optionIndex} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {option.image && (
                              <div className="w-12 h-12 relative rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                                <Image
                                  src={option.image || "/placeholder.svg"}
                                  alt={option.option}
                                  fill
                                  className="object-contain object-center p-1"
                                />
                              </div>
                            )}
                            <span className="font-medium text-purple-800">{option.option}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-purple-800">
                              {option.count} votos ({option.percentage}%)
                            </span>
                          </div>
                        </div>
                        <Progress value={option.percentage} className="h-3 bg-purple-100" />
                      </div>
                    ))}
                  </div>
                ) : result.text_responses ? (
                  <div className="space-y-3">
                    <p className="font-medium text-purple-800">Respuestas ({result.text_responses.length}):</p>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {result.text_responses.map((response, responseIndex) => (
                        <div key={responseIndex} className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                          <p className="text-purple-700">"{response}"</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No hay respuestas para esta pregunta</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center pt-8">
          <p className="text-white/70 text-sm">© Cesar Joaquín Alegre Báez</p>
        </div>
      </div>
    </div>
  )
}
