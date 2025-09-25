"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useQuiz } from "@/hooks/use-quiz"
import { QuestionCard } from "@/components/quiz/question-card"
import { ProgressBar } from "@/components/quiz/progress-bar"
import { Button } from "@/components/ui/button"

export default function QuizPage() {
  const router = useRouter()
  const { quizState, loading, error, initializeQuiz, answerQuestion, nextQuestion, getCurrentQuestion, getProgress } =
    useQuiz()

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  // Initialize quiz on component mount
  useEffect(() => {
    initializeQuiz()
  }, [initializeQuiz])

  // Redirect to results when quiz is complete
  useEffect(() => {
    if (quizState.isComplete) {
      // Store final results in localStorage
      localStorage.setItem("quizResults", JSON.stringify(quizState))
      router.push("/results")
    }
  }, [quizState.isComplete, router, quizState])

  const handleAnswer = async (option: number) => {
    if (selectedAnswer !== null) return // Prevent multiple answers

    setSelectedAnswer(option)
    const correct = await answerQuestion(option)
    setIsCorrect(correct)
    setShowResult(true)

    // Auto-advance after 2 seconds
    setTimeout(() => {
      setSelectedAnswer(null)
      setShowResult(false)
      nextQuestion()
    }, 2000)
  }

  if (loading) {
    return (
      <div className="gradient-bg flex items-center justify-center min-h-screen">
        <div className="text-white text-center space-y-4">
          <div className="text-4xl">🌸</div>
          <p className="text-xl" style={{ fontFamily: "Kalam, cursive" }}>
            Cargando preguntas...
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="gradient-bg flex items-center justify-center p-4 min-h-screen">
        <div className="w-full max-w-md mx-auto text-center space-y-6">
          <div className="text-white space-y-4">
            <div className="text-4xl">❌</div>
            <h2 className="text-2xl font-bold" style={{ fontFamily: "Kalam, cursive" }}>
              Error
            </h2>
            <p className="text-lg" style={{ fontFamily: "Kalam, cursive" }}>
              {error}
            </p>
            <Button
              onClick={() => router.push("/")}
              className="w-full h-12 text-lg font-medium bg-white/90 hover:bg-white text-purple-800 rounded-3xl"
              style={{ fontFamily: "Kalam, cursive" }}
            >
              Volver al inicio
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const currentQuestion = getCurrentQuestion()
  if (!currentQuestion) {
    return (
      <div className="gradient-bg flex items-center justify-center min-h-screen">
        <div className="text-white text-center space-y-4">
          <div className="text-4xl">🌸</div>
          <p className="text-xl" style={{ fontFamily: "Kalam, cursive" }}>
            No hay preguntas disponibles
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="gradient-bg h-screen overflow-hidden flex flex-col">
      {/* Progress Bar */}
      <div className="w-full max-w-lg mx-auto p-4 pb-2">
        <ProgressBar
          progress={getProgress()}
          currentQuestion={quizState.currentQuestionIndex + 1}
          totalQuestions={quizState.questions.length}
        />
      </div>

      {/* Question Card - Takes remaining space and centers content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <QuestionCard
          question={currentQuestion}
          questionNumber={quizState.currentQuestionIndex + 1}
          onAnswer={handleAnswer}
          disabled={selectedAnswer !== null}
        />
      </div>

      {/* Answer Feedback */}
      {showResult && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 mx-4 text-center space-y-4 max-w-sm w-full">
            <div className="text-6xl">{isCorrect ? "✅" : "❌"}</div>
            <h3 className="text-2xl font-bold text-purple-800" style={{ fontFamily: "Kalam, cursive" }}>
              {isCorrect ? "¡Correcto!" : "Incorrecto"}
            </h3>
            {!isCorrect && (
              <p className="text-purple-600" style={{ fontFamily: "Kalam, cursive" }}>
                La respuesta correcta era:{" "}
                {currentQuestion[`option_${currentQuestion.correct_option}` as keyof typeof currentQuestion]}
              </p>
            )}
            <div className="text-purple-600" style={{ fontFamily: "Kalam, cursive" }}>
              Puntuación: {quizState.score}/{quizState.currentQuestionIndex + 1}
            </div>
          </div>
        </div>
      )}

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 text-white/20 text-4xl animate-pulse">🌸</div>
      <div className="absolute top-20 right-10 text-white/20 text-3xl animate-pulse delay-1000">🌺</div>
      <div className="absolute bottom-20 left-8 text-white/20 text-3xl animate-pulse delay-2000">🌸</div>
      <div className="absolute bottom-32 right-12 text-white/20 text-4xl animate-pulse delay-500">🌺</div>
    </div>
  )
}
