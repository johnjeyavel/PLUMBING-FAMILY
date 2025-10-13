-- Replace comment column with user_id column in plumbing_families table
ALTER TABLE public.plumbing_families 
DROP COLUMN comment;

ALTER TABLE public.plumbing_families 
ADD COLUMN user_id text NOT NULL DEFAULT '';