
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
    const { message, conversationId } = await req.json();
    
    if (!message) {
      throw new Error('Message is required');
    }

    // Get the user from the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Authorization header is required');
    }

    const token = authHeader.replace('Bearer ', '');

    // Initialize Supabase client with the user's JWT so RLS uses their identity
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    // Get or create AI assistant conversation
    let currentConversationId = conversationId;
    if (!currentConversationId) {
      const { data: conversation, error: convError } = await supabase
        .from('conversations')
        .insert({
          name: 'AI Assistant',
          is_group: false,
          company_id: null
        })
        .select()
        .single();

      if (convError) throw convError;
      currentConversationId = conversation.id;

      // Add user as member
      await supabase
        .from('conversation_members')
        .insert({
          conversation_id: currentConversationId,
          user_id: user.id
        });
    }

    // Store user message
    await supabase
      .from('messages')
      .insert({
        conversation_id: currentConversationId,
        user_id: user.id,
        content: message
      });

    // Get conversation history (last 20 messages)
    const { data: history } = await supabase
      .from('messages')
      .select('content, user_id')
      .eq('conversation_id', currentConversationId)
      .order('created_at', { ascending: true })
      .limit(20);

    // Gather context from the database
    const context = await gatherDatabaseContext(supabase);

    // Get Lovable AI API key
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!lovableApiKey) {
      throw new Error('Lovable AI key not configured');
    }

    // Create system prompt with database context
    const systemPrompt = createSystemPrompt(context);

    // Build message history for AI
    const aiMessages = (history || []).map((msg: any) => ({
      role: msg.user_id === user.id ? 'user' : 'assistant',
      content: msg.content
    }));

    // Call Lovable AI Gateway
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
          ...aiMessages
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'AI Gateway error');
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    // Store AI response
    await supabase
      .from('messages')
      .insert({
        conversation_id: currentConversationId,
        user_id: user.id, // Using user.id for AI messages too (to distinguish by content)
        content: aiResponse
      });

    console.log('AI Response generated successfully');

    return new Response(JSON.stringify({ 
      response: aiResponse,
      conversationId: currentConversationId 
    }), {
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

  return `You are FixBot, a direct appliance repair assistant. Answer exactly what's asked, nothing more.

DATABASE CONTEXT:
Recent Cases: ${recentCases.length} | Parts: ${commonParts.length} | Models: ${applianceModels.length}

RESPONSE RULES:
- Answer the exact question asked - no extras
- 1-2 sentences maximum unless they ask for more
- No safety warnings or disclaimers
- No "here's everything you should know" - just answer the question
- If they need details on brand/model/error code, ask briefly

USER CONTROLS DEPTH: They'll ask follow-up questions if they want more. Don't anticipate their needs.`;
}
