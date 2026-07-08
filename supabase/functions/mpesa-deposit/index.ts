import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const PROJECT_URL = Deno.env.get("PROJECT_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SERVICE_ROLE_KEY")!;
const PAYHERO_BASIC_AUTH = Deno.env.get("PAYHERO_BASIC_AUTH")!;
const PAYHERO_CHANNEL_ID = Deno.env.get("PAYHERO_CHANNEL_ID")!;

const admin = createClient(PROJECT_URL, SERVICE_ROLE_KEY);

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders,
    },
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  try {
    // -----------------------------
    // Authenticate User
    // -----------------------------
    const token = req.headers
      .get("Authorization")
      ?.replace("Bearer ", "");

    if (!token) {
      return json({ error: "User not authenticated." }, 401);
    }

    const authClient = createClient(
      PROJECT_URL,
      Deno.env.get("ANON_KEY")!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }
    );

    const {
      data: { user },
      error: authError,
    } = await authClient.auth.getUser();

    if (authError || !user) {
      return json({ error: "User not authenticated." }, 401);
    }

    // -----------------------------
    // Body
    // -----------------------------
    const { phone, amount } = await req.json();

    if (!phone || !amount) {
      return json({ error: "Missing fields." }, 400);
    }

    // -----------------------------
    // Normalize Phone
    // -----------------------------
    let phoneNumber = phone.toString().trim();

    if (phoneNumber.startsWith("254")) {
      phoneNumber = "0" + phoneNumber.substring(3);
    }

    const reference = crypto.randomUUID();

    // -----------------------------
    // Save Pending Transaction
    // -----------------------------
    const { error: insertError } = await admin
      .from("tradify_pesa")
      .insert({
        uid: user.id,
        phone: phoneNumber,
        amount,
        type: "deposit",
        status: "pending",
      });

    if (insertError) {
      return json({
        error: insertError.message,
      }, 500);
    }

    // -----------------------------
    // Call PayHero
    // -----------------------------
    const response = await fetch(
      "https://backend.payhero.co.ke/api/v2/payments",
      {
        method: "POST",
        headers: {
  Authorization: PAYHERO_BASIC_AUTH,
  "Content-Type": "application/json",
},
        body: JSON.stringify({
          amount,
          phone_number: phoneNumber,
          channel_id: Number(PAYHERO_CHANNEL_ID),
          provider: "m-pesa",
          external_reference: reference,
          callback_url:
            `${PROJECT_URL}/functions/v1/mpesa-callback`,
        }),
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      return json(result, 400);
    }

    await admin
      .from("tradify_pesa")
      .update({
        reference: result.reference,
        checkout_request_id: result.CheckoutRequestID,
      })
      .eq("uid", user.id)
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(1);

    return json({
      success: true,
      message: "STK sent.",
      reference: result.reference,
    });
  } catch (err) {
    console.error(err);

    return json({
      error: err instanceof Error ? err.message : "Internal server error",
    }, 500);
  }
});  