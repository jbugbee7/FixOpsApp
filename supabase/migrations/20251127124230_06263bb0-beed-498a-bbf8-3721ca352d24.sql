-- Add customer address columns to cases table
ALTER TABLE cases 
ADD COLUMN customer_address TEXT,
ADD COLUMN customer_address_line_2 TEXT,
ADD COLUMN customer_city TEXT,
ADD COLUMN customer_state TEXT,
ADD COLUMN customer_zip_code TEXT;