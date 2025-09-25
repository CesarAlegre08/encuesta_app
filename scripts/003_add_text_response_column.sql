-- Add text_response column to user_answers table to support open-ended questions
ALTER TABLE public.user_answers 
ADD COLUMN IF NOT EXISTS text_response TEXT;

-- Update the check constraint to allow NULL selected_option for text responses
-- First drop the existing constraint
ALTER TABLE public.user_answers 
DROP CONSTRAINT IF EXISTS user_answers_selected_option_check;

-- Add new constraint that allows selected_option to be between 1-4 OR allows text responses
ALTER TABLE public.user_answers 
ADD CONSTRAINT user_answers_selected_option_check 
CHECK (
  (selected_option BETWEEN 1 AND 4 AND text_response IS NULL) OR 
  (text_response IS NOT NULL AND selected_option IS NOT NULL)
);

-- Create index for text responses for better search performance
CREATE INDEX IF NOT EXISTS idx_user_answers_text_response ON public.user_answers(text_response) 
WHERE text_response IS NOT NULL;
