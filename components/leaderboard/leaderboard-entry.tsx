import type { GameSession } from "@/lib/types"

interface LeaderboardEntryProps {
  session: GameSession
  position: number
  isHighlighted?: boolean
}

export function LeaderboardEntry({ session, position, isHighlighted = false }: LeaderboardEntryProps) {
  const getRankEmoji = (pos: number) => {
    switch (pos) {
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
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const percentage = Math.round((session.score / session.total_questions) * 100)

  return (
    <div
      className={`grid grid-cols-12 gap-4 items-center p-4 rounded-2xl transition-all duration-200 ${
        isHighlighted ? "bg-yellow-400/20 border-2 border-yellow-400/50" : position <= 3 ? "bg-white/20" : "bg-white/10"
      } hover:bg-white/25`}
    >
      <div className="col-span-2 text-center">
        <span className="text-3xl">{getRankEmoji(position)}</span>
        <div className="text-white text-sm font-bold">#{position}</div>
      </div>
      <div className="col-span-5">
        <div
          className={`text-white font-medium truncate ${position <= 3 ? "text-lg" : "text-base"} ${
            isHighlighted ? "font-bold" : ""
          }`}
          style={{ fontFamily: "Kalam, cursive" }}
        >
          {session.player_name}
          {isHighlighted && <span className="ml-2 text-yellow-400">👤</span>}
        </div>
      </div>
      <div className="col-span-2 text-center">
        <div
          className={`text-white font-bold ${position <= 3 ? "text-xl" : "text-lg"}`}
          style={{ fontFamily: "Kalam, cursive" }}
        >
          {session.score}/{session.total_questions}
        </div>
        <div className="text-white/70 text-xs">{percentage}%</div>
      </div>
      <div className="col-span-3 text-center">
        <div className="text-white/80 text-xs" style={{ fontFamily: "Kalam, cursive" }}>
          {formatDate(session.completed_at)}
        </div>
      </div>
    </div>
  )
}
