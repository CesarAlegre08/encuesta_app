interface ProgressBarProps {
  progress: number
  currentQuestion: number
  totalQuestions: number
}

export function ProgressBar({ progress, currentQuestion, totalQuestions }: ProgressBarProps) {
  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-white text-sm font-medium">
        <span>Pregunta {currentQuestion}</span>
        <span>{totalQuestions} preguntas</span>
      </div>
      <div className="w-full bg-white/20 rounded-full h-2">
        <div
          className="bg-white h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
