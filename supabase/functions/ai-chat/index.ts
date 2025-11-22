
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
  modelDetails: any | null;
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
    const context = await gatherDatabaseContext(supabase, message);

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

async function gatherDatabaseContext(supabase: any, message: string): Promise<DatabaseContext> {
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

    // Try to extract model number from message and fetch specific model details
    let modelDetails = null;
    const modelMatch = message.match(/\b[A-Z0-9]{4,}\b/); // Basic pattern for model numbers
    if (modelMatch) {
      const potentialModel = modelMatch[0];
      const { data: specificModel } = await supabase
        .from('appliance_models')
        .select('*')
        .ilike('model', `%${potentialModel}%`)
        .limit(1)
        .single();
      
      if (specificModel) {
        modelDetails = specificModel;
        
        // Get related cases for this specific model
        const { data: modelCases } = await supabase
          .from('cases')
          .select('id, appliance_model, problem_description, initial_diagnosis, parts_needed, technician_notes')
          .ilike('appliance_model', `%${potentialModel}%`)
          .limit(5);
        
        if (modelCases) {
          modelDetails.relatedCases = modelCases;
        }
      }
    }

    return {
      recentCases: recentCases || [],
      commonParts: commonParts || [],
      applianceModels: applianceModels || [],
      modelDetails,
    };
  } catch (error) {
    console.error('Error gathering database context:', error);
    return {
      recentCases: [],
      commonParts: [],
      applianceModels: [],
      modelDetails: null,
    };
  }
}

function createSystemPrompt(context: DatabaseContext): string {
  const { recentCases, commonParts, applianceModels, modelDetails } = context;

  let contextInfo = `DATABASE CONTEXT:
Recent Cases: ${recentCases.length} | Parts: ${commonParts.length} | Models: ${applianceModels.length}`;

  if (modelDetails) {
    contextInfo += `\n\nSPECIFIC MODEL FOUND: ${modelDetails.brand} ${modelDetails.model} (${modelDetails.appliance_type})`;
    if (modelDetails.relatedCases && modelDetails.relatedCases.length > 0) {
      contextInfo += `\nRelated cases for this model: ${modelDetails.relatedCases.length} cases in database`;
      contextInfo += `\nCommon issues: ${modelDetails.relatedCases.map((c: any) => c.problem_description).join(', ')}`;
    }
  }

  return `You are FixBot - talk to me as a fellow technician. I know how to diagnose, I'm just bouncing ideas off you.

${contextInfo}

COMMUNICATION STYLE:
- Peer-to-peer technician conversation - skip the basics, I know my stuff
- When I give you a model number, USE THE DATABASE to look up actual specs and past cases
- NEVER assume generic parts or components - if I mention a model, reference what's actually in that model
- Challenge my thinking if something doesn't add up with the model specs
- Share what you've seen in similar cases from the database
- Be direct - "That model uses X, not Y" or "I've seen 3 cases with similar symptoms"
- CRITICAL: Keep responses under 80 words - be concise and focused

PERSONALITY:
- If I greet you casually (like "what's up", "good morning", "hey", "yo"), respond with a quirky, friendly tech greeting
- Examples: "What's up! Ready to troubleshoot some appliances?" or "Morning! Coffee's on, let's fix some stuff" or "Hey! Another day, another compressor to diagnose"
- Keep it brief and fun, then ask what I'm working on

CRITICAL: DO NOT make assumptions about components (like start relays, capacitors, etc.) without checking if that model actually has them. Use the database context and model-specific information.

GOAL: Be a knowledgeable sounding board who helps me work through the diagnosis using actual data.`;
}
