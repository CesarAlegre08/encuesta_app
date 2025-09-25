-- Drop existing policies if they exist
DROP POLICY IF EXISTS "questions_select_policy" ON questions;
DROP POLICY IF EXISTS "game_sessions_insert_policy" ON game_sessions;
DROP POLICY IF EXISTS "game_sessions_update_policy" ON game_sessions;
DROP POLICY IF EXISTS "game_sessions_select_policy" ON game_sessions;
DROP POLICY IF EXISTS "user_answers_insert_policy" ON user_answers;
DROP POLICY IF EXISTS "user_answers_select_policy" ON user_answers;

-- Disable RLS temporarily to recreate policies
ALTER TABLE questions DISABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_answers DISABLE ROW LEVEL SECURITY;

-- Enable RLS again
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_answers ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for the quiz app
-- Questions table - allow everyone to read questions
CREATE POLICY "questions_select_policy" ON questions
  FOR SELECT USING (true);

-- Game sessions - allow anyone to insert and update their own sessions
CREATE POLICY "game_sessions_insert_policy" ON game_sessions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "game_sessions_update_policy" ON game_sessions
  FOR UPDATE USING (true);

CREATE POLICY "game_sessions_select_policy" ON game_sessions
  FOR SELECT USING (true);

-- User answers - allow anyone to insert and select answers
CREATE POLICY "user_answers_insert_policy" ON user_answers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "user_answers_select_policy" ON user_answers
  FOR SELECT USING (true);
