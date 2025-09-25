import { createClient } from "@/lib/supabase/client"
import type { GameSession } from "@/lib/types"

// Get leaderboard (top scores)
export async function getLeaderboard(limit = 10): Promise<GameSession[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("game_sessions")
    .select("*")
    .order("score", { ascending: false })
    .order("completed_at", { ascending: true }) // In case of tie, earlier completion wins
    .limit(limit)

  if (error) {
    console.error("Error fetching leaderboard:", error)
    return []
  }

  return data || []
}

// Get player's best score
export async function getPlayerBestScore(playerName: string): Promise<number> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("game_sessions")
    .select("score")
    .eq("player_name", playerName)
    .order("score", { ascending: false })
    .limit(1)
    .single()

  if (error || !data) {
    return 0
  }

  return data.score
}

// Get total number of questions available
export async function getTotalQuestionsCount(): Promise<number> {
  const supabase = createClient()

  const { count, error } = await supabase.from("questions").select("*", { count: "exact", head: true })

  if (error) {
    console.error("Error getting questions count:", error)
    return 0
  }

  return count || 0
}

// Calculate score percentage
export function calculateScorePercentage(score: number, totalQuestions: number): number {
  if (totalQuestions === 0) return 0
  return Math.round((score / totalQuestions) * 100)
}

// Get score message based on percentage
export function getScoreMessage(percentage: number): string {
  if (percentage >= 90) return "¡Excelente! Eres un experto"
  if (percentage >= 80) return "¡Muy bien! Tienes buen conocimiento"
  if (percentage >= 70) return "¡Bien! Vas por buen camino"
  if (percentage >= 60) return "Regular, puedes mejorar"
  if (percentage >= 50) return "Necesitas estudiar más"
  return "Debes repasar los conceptos básicos"
}

// Format time duration
export function formatDuration(startTime: Date, endTime: Date): string {
  const diffMs = endTime.getTime() - startTime.getTime()
  const diffSeconds = Math.floor(diffMs / 1000)
  const minutes = Math.floor(diffSeconds / 60)
  const seconds = diffSeconds % 60

  if (minutes > 0) {
    return `${minutes}m ${seconds}s`
  }
  return `${seconds}s`
}

// Shuffle array (Fisher-Yates algorithm)
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]

  // Multiple shuffle passes for better randomization
  for (let pass = 0; pass < 2; pass++) {
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
  }

  return shuffled
}

export function shuffleQuestionOptions<
  T extends { option_1: string; option_2: string; option_3: string; option_4: string; correct_option: number },
>(question: T): T & { optionMapping: number[] } {
  const options = [
    { original: 1, text: question.option_1 },
    { original: 2, text: question.option_2 },
    { original: 3, text: question.option_3 },
    { original: 4, text: question.option_4 },
  ]

  const shuffled = shuffleArray(options)
  const mapping = shuffled.map((opt) => opt.original)

  return {
    ...question,
    option_1: shuffled[0].text,
    option_2: shuffled[1].text,
    option_3: shuffled[2].text,
    option_4: shuffled[3].text,
    correct_option: mapping.indexOf(question.correct_option) + 1,
    optionMapping: mapping,
  }
}
