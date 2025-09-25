-- Update the check constraint to allow values 1-5 instead of 1-4
-- This is needed because some questions have option 'e' which maps to 5

-- Drop the existing constraint
ALTER TABLE public.user_answers DROP CONSTRAINT IF EXISTS user_answers_selected_option_check;

-- Add the new constraint that allows 1-5
ALTER TABLE public.user_answers ADD CONSTRAINT user_answers_selected_option_check 
CHECK (selected_option BETWEEN 1 AND 5);
