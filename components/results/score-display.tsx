interface ScoreDisplayProps {
  score: number
  totalQuestions: number
  percentage: number
  message: string
  playerName: string
}

export function ScoreDisplay({ score, totalQuestions, percentage, message, playerName }: ScoreDisplayProps) {
  const getScoreEmoji = (percentage: number) => {
    if (percentage >= 90) return "🏆"
    if (percentage >= 80) return "🥇"
    if (percentage >= 70) return "🥈"
    if (percentage >= 60) return "🥉"
    if (percentage >= 50) return "👍"
    return "📚"
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 space-y-6">
      <div className="text-center space-y-4">
        <div className="text-6xl">{getScoreEmoji(percentage)}</div>
        <h3 className="text-white text-2xl font-bold" style={{ fontFamily: "Kalam, cursive" }}>
          ¡Felicidades {playerName}!
        </h3>
      </div>

      <div className="text-white text-center space-y-3">
        <div className="text-5xl font-bold">
          {score}/{totalQuestions}
        </div>
        <div className="text-2xl font-medium">{percentage}% de aciertos</div>
        <div className="text-lg opacity-90">{message}</div>
      </div>

      {/* Score breakdown */}
      <div className="grid grid-cols-2 gap-4 text-white text-center">
        <div className="space-y-1">
          <div className="text-2xl font-bold text-green-300">{score}</div>
          <div className="text-sm opacity-75">Correctas</div>
        </div>
        <div className="space-y-1">
          <div className="text-2xl font-bold text-red-300">{totalQuestions - score}</div>
          <div className="text-sm opacity-75">Incorrectas</div>
        </div>
      </div>
    </div>
  )
}
