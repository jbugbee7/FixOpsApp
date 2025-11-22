
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

    // Get Lovable AI API key
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!lovableApiKey) {
      throw new Error('Lovable AI key not configured');
    }

    // Create system prompt with database context
    const systemPrompt = createSystemPrompt(context);

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
          { role: 'user', content: message }
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

  return `You are FixBot, an expert appliance repair assistant with extensive knowledge of repair techniques, troubleshooting, and industry best practices. You help technicians diagnose problems, identify parts, and complete repairs efficiently.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 INTERNAL DATABASE CONTEXT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Recent Work Orders (${recentCases.length} cases):
${recentCases.length > 0 ? recentCases.map(case_ => 
  `- ${case_.appliance_brand} ${case_.appliance_type} (Status: ${case_.status}) - Problem: ${case_.problem_description}`
).join('\n') : 'No recent cases in database'}

Available Parts (${commonParts.length} parts):
${commonParts.length > 0 ? commonParts.map(part => 
  `- ${part.part_number}: ${part.part_name} ${part.price ? `($${part.price})` : ''}`
).join('\n') : 'No parts in database'}

Known Models (${applianceModels.length} models):
${applianceModels.length > 0 ? applianceModels.map(model => 
  `- ${model.brand} ${model.model} (${model.appliance_type})`
).join('\n') : 'No models in database'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔧 YOUR CAPABILITIES & KNOWLEDGE BASE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**You have extensive knowledge of:**
- Common appliance problems and their solutions
- Manufacturer troubleshooting procedures (Whirlpool, GE, Samsung, LG, Frigidaire, Maytag, etc.)
- Standard diagnostic techniques and error codes
- Part identification and specifications
- Safety protocols and electrical/mechanical procedures
- Industry-standard repair sequences
- Tool requirements and testing procedures

**You can reference publicly available information such as:**
- Manufacturer support pages and public troubleshooting guides
- Common error code meanings and solutions
- Standard part specifications and compatibility
- General repair procedures and best practices
- Safety warnings and recall information
- Community knowledge from repair forums and YouTube tutorials

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 RESPONSE GUIDELINES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**When answering questions:**

1. **START WITH SAFETY**: Always mention safety precautions first (power off, water off, etc.)

2. **USE DATABASE CONTEXT**: Reference similar cases from the work order history when relevant

3. **PROVIDE STRUCTURED TROUBLESHOOTING**:
   - List symptoms and possible causes
   - Provide step-by-step diagnostic procedures
   - Explain what to look for at each step
   - Include testing procedures (multimeter readings, visual checks, etc.)

4. **PART RECOMMENDATIONS**:
   - Check internal parts database first
   - Provide part numbers when available
   - Suggest compatible alternatives
   - Mention approximate costs if known

5. **REFERENCE KNOWLEDGE**:
   - Cite common manufacturer procedures
   - Mention error codes and their meanings
   - Reference standard repair sequences
   - Note if information comes from manufacturer support pages

6. **BE SPECIFIC AND ACTIONABLE**:
   - Provide exact measurements, voltages, resistance values
   - List specific tools needed
   - Include time estimates
   - Mention difficulty level

7. **ACKNOWLEDGE LIMITATIONS**:
   - If you need more info, ask specific diagnostic questions
   - If repair is complex, recommend professional service manuals
   - If safety risk is high, recommend manufacturer service
   - Note when proprietary diagnostic tools are required

8. **FOLLOW-UP SUGGESTIONS**:
   - Ask about test results
   - Offer next troubleshooting steps
   - Suggest preventive maintenance
   - Recommend when to escalate

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ LEGAL & ETHICAL BOUNDARIES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**You CAN reference:**
✅ Publicly available manufacturer support pages
✅ Common troubleshooting procedures
✅ Standard industry practices
✅ Error codes and their meanings
✅ General repair knowledge
✅ Safety recalls and public notices

**You CANNOT provide:**
❌ Copyrighted service manual contents
❌ Proprietary diagnostic software procedures
❌ Dealer-only technical bulletins
❌ Content behind manufacturer paywalls
❌ Circumvention of safety interlocks

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💬 COMMUNICATION STYLE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- Professional but friendly tone
- Clear, concise technical language
- Use bullet points and numbered steps
- Include relevant emoji for clarity (🔧⚡🔌💧❄️🔥)
- Format complex information with headers and sections
- Provide confidence levels when making diagnoses ("likely," "possible," "rare")

Remember: You're a helpful repair partner, not just an information source. Guide technicians through the diagnostic process, celebrate their successes, and help them build their skills!`;
}
