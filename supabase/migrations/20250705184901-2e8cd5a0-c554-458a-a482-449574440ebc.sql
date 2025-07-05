-- Ensure reorder_alerts table has proper RLS policies for data isolation
-- First, check if the table exists and create it if needed
CREATE TABLE IF NOT EXISTS public.reorder_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  inventory_item_id UUID NOT NULL,
  user_id UUID NOT NULL,
  alert_level TEXT NOT NULL DEFAULT 'low_stock',
  message TEXT NOT NULL,
  is_acknowledged BOOLEAN DEFAULT FALSE,
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on reorder_alerts
ALTER TABLE public.reorder_alerts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for reorder_alerts to ensure data isolation
DROP POLICY IF EXISTS "Users can create their own reorder alerts" ON public.reorder_alerts;
CREATE POLICY "Users can create their own reorder alerts" 
ON public.reorder_alerts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their own reorder alerts" ON public.reorder_alerts;
CREATE POLICY "Users can view their own reorder alerts" 
ON public.reorder_alerts 
FOR SELECT 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own reorder alerts" ON public.reorder_alerts;
CREATE POLICY "Users can update their own reorder alerts" 
ON public.reorder_alerts 
FOR UPDATE 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own reorder alerts" ON public.reorder_alerts;
CREATE POLICY "Users can delete their own reorder alerts" 
ON public.reorder_alerts 
FOR DELETE 
USING (auth.uid() = user_id);

-- Update the check_inventory_levels function to use the correct user_id
CREATE OR REPLACE FUNCTION public.check_inventory_levels()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if stock is below minimum and create alert if needed
  IF NEW.current_stock <= NEW.minimum_stock THEN
    INSERT INTO public.reorder_alerts (inventory_item_id, user_id, message)
    VALUES (
      NEW.id,
      NEW.user_id, -- Use the user_id from the inventory item
      'Low stock alert: ' || NEW.item_name || ' is at ' || NEW.current_stock || ' units (minimum: ' || NEW.minimum_stock || ')'
    )
    ON CONFLICT DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the trigger exists on inventory_items
DROP TRIGGER IF EXISTS check_inventory_levels_trigger ON public.inventory_items;
CREATE TRIGGER check_inventory_levels_trigger
  AFTER UPDATE OR INSERT ON public.inventory_items
  FOR EACH ROW
  EXECUTE FUNCTION public.check_inventory_levels();