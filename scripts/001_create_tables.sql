-- Create questions table
CREATE TABLE IF NOT EXISTS public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_text TEXT NOT NULL,
  option_1 TEXT NOT NULL,
  option_2 TEXT NOT NULL,
  option_3 TEXT NOT NULL,
  option_4 TEXT NOT NULL,
  correct_option INTEGER NOT NULL CHECK (correct_option BETWEEN 1 AND 4),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create game sessions table
CREATE TABLE IF NOT EXISTS public.game_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_name TEXT NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  total_questions INTEGER NOT NULL DEFAULT 10,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user answers table to track individual answers
CREATE TABLE IF NOT EXISTS public.user_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.game_sessions(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  selected_option INTEGER NOT NULL CHECK (selected_option BETWEEN 1 AND 4),
  is_correct BOOLEAN NOT NULL,
  answered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS) for all tables
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_answers ENABLE ROW LEVEL SECURITY;

-- Create policies for questions table (read-only for all users)
CREATE POLICY "questions_select_all" ON public.questions FOR SELECT USING (true);

-- Create policies for game_sessions table (anyone can insert and read)
CREATE POLICY "game_sessions_insert_all" ON public.game_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "game_sessions_select_all" ON public.game_sessions FOR SELECT USING (true);

-- Create policies for user_answers table (anyone can insert and read)
CREATE POLICY "user_answers_insert_all" ON public.user_answers FOR INSERT WITH CHECK (true);
CREATE POLICY "user_answers_select_all" ON public.user_answers FOR SELECT USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_game_sessions_score ON public.game_sessions(score DESC);
CREATE INDEX IF NOT EXISTS idx_game_sessions_completed_at ON public.game_sessions(completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_answers_session_id ON public.user_answers(session_id);
