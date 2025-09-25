export interface Question {
  id: string
  question_text: string
  option_1: string
  option_2: string
  option_3: string
  option_4: string
  correct_option: number
  created_at: string
}

export interface GameSession {
  id: string
  player_name: string
  score: number
  total_questions: number
  completed_at: string
}

export interface UserAnswer {
  id: string
  session_id: string
  question_id: string
  selected_option: number
  is_correct: boolean
  answered_at: string
}

export interface QuizState {
  currentQuestionIndex: number
  questions: Question[]
  answers: number[]
  score: number
  playerName: string
  sessionId: string | null
  isComplete: boolean
}

export interface VotingQuestion {
  id: string
  question_text: string
  options: VotingOption[]
  type: "multiple_choice" | "text_input"
  image_mapping?: { [key: string]: string } // Maps option text to image path
}

export interface VotingOption {
  id: string
  text: string
  image?: string
}

export interface Vote {
  id: string
  session_id: string
  question_id: string
  selected_option?: string
  text_response?: string
  voted_at: string
}

export interface VotingSession {
  id: string
  participant_name: string
  completed_at: string
}

export interface VotingResults {
  question_id: string
  question_text: string
  results: {
    option: string
    count: number
    percentage: number
    image?: string
  }[]
  text_responses?: string[]
}
