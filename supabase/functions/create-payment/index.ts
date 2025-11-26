import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");

    const { caseId, amount } = await req.json();
    if (!caseId || !amount) {
      throw new Error("Missing caseId or amount");
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Check if customer exists
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    // Create payment intent for the work order
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: "usd",
      customer: customerId,
      metadata: {
        caseId: caseId,
        userId: user.id,
      },
    });

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      payment_intent: paymentIntent.id,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Work Order Payment",
              description: `Payment for work order ${caseId}`,
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/?payment=success&case_id=${caseId}`,
      cancel_url: `${req.headers.get("origin")}/?payment=canceled`,
    });

    // Update case with payment intent ID
    await supabaseClient
      .from("cases")
      .update({ 
        payment_intent_id: paymentIntent.id,
        payment_amount: amount,
        payment_status: "pending"
      })
      .eq("id", caseId);

    return new Response(JSON.stringify({ url: session.url, paymentIntentId: paymentIntent.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Payment error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
