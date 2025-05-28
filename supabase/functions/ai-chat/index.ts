
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
    const { message } = await req.json();
    
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

    // Get OpenAI API key
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Create system prompt with database context
    const systemPrompt = createSystemPrompt(context);

    // Call OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'OpenAI API error');
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
    // Get recent cases for context
    const { data: recentCases } = await supabase
      .from('cases')
      .select('*')
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

  return `You are FixBot, an intelligent appliance repair assistant with access to real repair data. You help technicians with troubleshooting, part identification, and repair recommendations.

AVAILABLE DATA CONTEXT:

Recent Work Orders (${recentCases.length} cases):
${recentCases.map(case_ => 
  `- ${case_.appliance_brand} ${case_.appliance_type} (Status: ${case_.status}) - Problem: ${case_.problem_description}`
).join('\n')}

Available Parts Database (${commonParts.length} parts):
${commonParts.map(part => 
  `- ${part.part_number}: ${part.part_name} (${part.appliance_brand || 'Universal'})`
).join('\n')}

Known Appliance Models (${applianceModels.length} models):
${applianceModels.map(model => 
  `- ${model.brand} ${model.model} (${model.appliance_type})`
).join('\n')}

INSTRUCTIONS:
1. Use the real data above to provide specific, contextual recommendations
2. Reference actual part numbers and model information when available
3. Suggest similar cases from the work order history when relevant
4. Provide step-by-step troubleshooting based on the appliance type and problem
5. Recommend specific parts from the database when applicable
6. If you don't have specific data, say so and provide general guidance
7. Always be helpful, professional, and safety-conscious
8. Suggest when a technician should consult manuals or seek additional help

Remember: You have access to real repair data, so use it to provide more accurate and helpful responses!`;
}
