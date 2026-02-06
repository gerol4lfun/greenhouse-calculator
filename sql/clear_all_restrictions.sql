-- Очистка всех restrictions (выполнить в Supabase SQL Editor)
UPDATE delivery_dates 
SET restrictions = NULL, updated_at = NOW()
WHERE restrictions IS NOT NULL;
