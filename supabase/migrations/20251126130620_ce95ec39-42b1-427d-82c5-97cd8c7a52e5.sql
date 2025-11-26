-- Add signature and payment fields to cases table
ALTER TABLE cases 
ADD COLUMN authorization_signature TEXT,
ADD COLUMN authorization_signature_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN authorization_signed_by TEXT,
ADD COLUMN completion_signature TEXT,
ADD COLUMN completion_signature_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN completion_signed_by TEXT,
ADD COLUMN payment_intent_id TEXT,
ADD COLUMN payment_amount NUMERIC,
ADD COLUMN payment_status TEXT DEFAULT 'pending',
ADD COLUMN payment_date TIMESTAMP WITH TIME ZONE;