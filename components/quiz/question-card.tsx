"use client"
import { Button } from "@/components/ui/button"
import type { Question } from "@/lib/types"
import Image from "next/image"

interface QuestionCardProps {
  question: Question
  questionNumber: number
  onAnswer: (option: number) => void
  disabled?: boolean
}

export function QuestionCard({ question, questionNumber, onAnswer, disabled = false }: QuestionCardProps) {
  const shuffleOptions = (question: Question) => {
    const options = [
      { number: 1, text: question.option_1 },
      { number: 2, text: question.option_2 },
      { number: 3, text: question.option_3 },
      { number: 4, text: question.option_4 },
    ]

    // Create array with original positions
    const shuffled = [...options]

    // Fisher-Yates shuffle
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }

    return shuffled
  }

  const options = shuffleOptions(question)

  return (
    <div className="w-full max-w-lg mx-auto text-center space-y-6">
      {/* Logo Section - Same as welcome screen */}
      <div className="space-y-3">
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
        <h2 className="text-white text-base font-normal italic" style={{ fontFamily: "Kalam, cursive" }}>
          Contador Público Nacional
        </h2>
      </div>

      {/* Question Section */}
      <div className="space-y-4">
        <div className="text-white space-y-2">
          <div className="text-base font-medium" style={{ fontFamily: "Kalam, cursive" }}>
            Pregunta N° {questionNumber}
          </div>
          <div className="text-lg font-normal leading-snug px-1" style={{ fontFamily: "Kalam, cursive" }}>
            {question.question_text}
          </div>
        </div>

        <div className="space-y-2">
          {options.map((option) => (
            <Button
              key={option.number}
              onClick={() => onAnswer(option.number)}
              disabled={disabled}
              className="w-full min-h-[3.5rem] p-3 text-sm font-medium bg-white/90 hover:bg-white text-purple-800 rounded-2xl border-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-[1.02] text-center leading-tight whitespace-normal break-words"
              style={{
                fontFamily: "Kalam, cursive",
                wordWrap: "break-word",
                overflowWrap: "break-word",
                hyphens: "auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span className="block w-full text-center leading-tight">{option.text}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
