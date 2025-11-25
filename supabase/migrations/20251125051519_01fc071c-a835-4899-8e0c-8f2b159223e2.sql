-- Make company_id nullable in cases table to allow work orders without company
ALTER TABLE cases ALTER COLUMN company_id DROP NOT NULL;

-- Update RLS policy to allow users to manage cases without company OR with their company
DROP POLICY IF EXISTS "Users can manage cases in their company" ON cases;
CREATE POLICY "Users can manage cases"
  ON cases
  FOR ALL
  USING (
    auth.uid() IS NOT NULL AND (
      company_id IS NULL OR
      company_id IN (
        SELECT company_id 
        FROM profiles 
        WHERE id = auth.uid()
      )
    )
  );

-- Update view policy similarly  
DROP POLICY IF EXISTS "Users can view cases from their company" ON cases;
CREATE POLICY "Users can view cases"
  ON cases
  FOR SELECT
  USING (
    auth.uid() IS NOT NULL AND (
      company_id IS NULL OR
      company_id IN (
        SELECT company_id 
        FROM profiles 
        WHERE id = auth.uid()
      )
    )
  );