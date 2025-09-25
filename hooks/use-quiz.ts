"use client"

import { useState, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import type { QuizState } from "@/lib/types"

export function useQuiz() {
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestionIndex: 0,
    questions: [],
    answers: [],
    score: 0,
    playerName: "",
    sessionId: null,
    isComplete: false,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  // Initialize quiz
  const initializeQuiz = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      console.log("[v0] Starting quiz initialization...")

      // Get player name from localStorage
      const playerName = localStorage.getItem("playerName") || "Jugador Anónimo"
      console.log("[v0] Player name:", playerName)

      console.log("[v0] Attempting to fetch questions from database...")
      const { data: allQuestions, error: questionsError } = await supabase.from("questions").select("*")

      console.log("[v0] Database response:", { data: allQuestions, error: questionsError })

      if (questionsError) {
        console.error("[v0] Database error:", questionsError)
        throw questionsError
      }

      if (!allQuestions || allQuestions.length === 0) {
        console.error("[v0] No questions found in database")
        throw new Error("No se encontraron preguntas en la base de datos")
      }

      console.log("[v0] Found", allQuestions.length, "questions")

      let shuffledQuestions = [...allQuestions]

      // Multiple shuffle passes for better randomization
      for (let pass = 0; pass < 3; pass++) {
        for (let i = shuffledQuestions.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1))
          ;[shuffledQuestions[i], shuffledQuestions[j]] = [shuffledQuestions[j], shuffledQuestions[i]]
        }
      }

      // Add timestamp-based additional randomization
      const timeBasedSeed = Date.now() % shuffledQuestions.length
      shuffledQuestions = [...shuffledQuestions.slice(timeBasedSeed), ...shuffledQuestions.slice(0, timeBasedSeed)]

      // Select 10 random questions
      const selectedQuestions = shuffledQuestions.slice(0, 10)

      // Create game session
      const { data: session, error: sessionError } = await supabase
        .from("game_sessions")
        .insert({
          player_name: playerName,
          score: 0,
          total_questions: selectedQuestions.length,
        })
        .select()
        .single()

      if (sessionError) throw sessionError

      setQuizState({
        currentQuestionIndex: 0,
        questions: selectedQuestions,
        answers: new Array(selectedQuestions.length).fill(0),
        score: 0,
        playerName,
        sessionId: session.id,
        isComplete: false,
      })
    } catch (err) {
      console.error("Error initializing quiz:", err)
      setError(err instanceof Error ? err.message : "Error al inicializar el quiz")
    } finally {
      setLoading(false)
    }
  }, [supabase])

  // Answer a question
  const answerQuestion = useCallback(
    async (selectedOption: number) => {
      if (quizState.isComplete || !quizState.sessionId) return false

      const currentQuestion = quizState.questions[quizState.currentQuestionIndex]
      const isCorrect = selectedOption === currentQuestion.correct_option

      try {
        // Save user answer to database
        await supabase.from("user_answers").insert({
          session_id: quizState.sessionId,
          question_id: currentQuestion.id,
          selected_option: selectedOption,
          is_correct: isCorrect,
        })

        // Update local state
        const newAnswers = [...quizState.answers]
        newAnswers[quizState.currentQuestionIndex] = selectedOption

        const newScore = isCorrect ? quizState.score + 1 : quizState.score

        setQuizState((prev) => ({
          ...prev,
          answers: newAnswers,
          score: newScore,
        }))

        return isCorrect
      } catch (err) {
        console.error("Error saving answer:", err)
        setError("Error al guardar la respuesta")
        return false
      }
    },
    [quizState, supabase],
  )

  // Move to next question
  const nextQuestion = useCallback(() => {
    if (quizState.currentQuestionIndex < quizState.questions.length - 1) {
      setQuizState((prev) => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
      }))
    } else {
      // Quiz is complete
      completeQuiz()
    }
  }, [quizState.currentQuestionIndex, quizState.questions.length])

  // Complete the quiz
  const completeQuiz = useCallback(async () => {
    if (!quizState.sessionId) return

    try {
      // Update final score in database
      await supabase.from("game_sessions").update({ score: quizState.score }).eq("id", quizState.sessionId)

      setQuizState((prev) => ({
        ...prev,
        isComplete: true,
      }))
    } catch (err) {
      console.error("Error completing quiz:", err)
      setError("Error al completar el quiz")
    }
  }, [quizState.sessionId, quizState.score, supabase])

  // Get current question
  const getCurrentQuestion = useCallback(() => {
    if (quizState.questions.length === 0) return null
    return quizState.questions[quizState.currentQuestionIndex]
  }, [quizState.questions, quizState.currentQuestionIndex])

  // Get quiz progress
  const getProgress = useCallback(() => {
    if (quizState.questions.length === 0) return 0
    return ((quizState.currentQuestionIndex + 1) / quizState.questions.length) * 100
  }, [quizState.currentQuestionIndex, quizState.questions.length])

  // Reset quiz
  const resetQuiz = useCallback(() => {
    setQuizState({
      currentQuestionIndex: 0,
      questions: [],
      answers: [],
      score: 0,
      playerName: "",
      sessionId: null,
      isComplete: false,
    })
    setError(null)
  }, [])

  return {
    quizState,
    loading,
    error,
    initializeQuiz,
    answerQuestion,
    nextQuestion,
    completeQuiz,
    getCurrentQuestion,
    getProgress,
    resetQuiz,
  }
}
