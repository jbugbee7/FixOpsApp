
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DatabaseContext {
  recentCases: any[];
  commonParts: any[];
  applianceModels: any[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationHistory = [] } = await req.json();
    
    if (!message) {
      throw new Error('Message is required');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get the user from the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Authorization header is required');
    }

    // Set the auth header for supabase
    supabase.auth.setSession({
      access_token: authHeader.replace('Bearer ', ''),
      refresh_token: '',
    });

    // Gather context from the database
    const context = await gatherDatabaseContext(supabase);

    // Get Lovable AI API key
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!lovableApiKey) {
      throw new Error('Lovable AI key not configured');
    }

    // Create system prompt with database context
    const systemPrompt = createSystemPrompt(context);

    // Call Lovable AI Gateway with conversation history
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          ...conversationHistory
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'AI Gateway error');
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log('AI Response generated successfully');

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-chat function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function gatherDatabaseContext(supabase: any): Promise<DatabaseContext> {
  try {
    // Get recent cases for context (excluding customer information)
    const { data: recentCases } = await supabase
      .from('cases')
      .select('id, appliance_brand, appliance_type, appliance_model, serial_number, warranty_status, service_type, problem_description, initial_diagnosis, parts_needed, estimated_time, labor_cost, parts_cost, status, technician_notes, wo_number, created_at')
      .order('created_at', { ascending: false })
      .limit(10);

    // Get common parts
    const { data: commonParts } = await supabase
      .from('parts')
      .select('*')
      .limit(20);

    // Get appliance models
    const { data: applianceModels } = await supabase
      .from('appliance_models')
      .select('*')
      .limit(20);

    return {
      recentCases: recentCases || [],
      commonParts: commonParts || [],
      applianceModels: applianceModels || [],
    };
  } catch (error) {
    console.error('Error gathering database context:', error);
    return {
      recentCases: [],
      commonParts: [],
      applianceModels: [],
    };
  }
}

function createSystemPrompt(context: DatabaseContext): string {
  const { recentCases, commonParts, applianceModels } = context;

  return `You are FixBot, a professional appliance repair assistant. Provide clear, confident, and helpful guidance.

DATABASE CONTEXT:
Recent Cases: ${recentCases.length} | Parts: ${commonParts.length} | Models: ${applianceModels.length}

RESPONSE STYLE:
- Be direct and professional - answer what's asked with enough detail to be helpful
- Provide context and reasoning when relevant to build confidence
- Include specific model numbers, part numbers, or technical details when available
- If you need more information (brand/model/error code), ask clearly
- Balance brevity with completeness - give enough info to be useful
- Use your database knowledge to provide informed, specific answers

GOAL: Help technicians feel confident and well-informed in their repair decisions.`;
}
