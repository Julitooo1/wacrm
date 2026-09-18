-- Insitelvia: PEN for new accounts, new deals, and account preferences.
-- Existing deal amounts and original currencies are not converted.
BEGIN;
ALTER TABLE public.accounts ALTER COLUMN default_currency SET DEFAULT 'PEN';
ALTER TABLE public.deals ALTER COLUMN currency SET DEFAULT 'PEN';
UPDATE public.accounts SET default_currency = 'PEN'
WHERE default_currency IS DISTINCT FROM 'PEN';
COMMIT;
