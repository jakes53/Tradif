import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const PROJECT_URL = Deno.env.get("PROJECT_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SERVICE_ROLE_KEY")!;

const admin = createClient(PROJECT_URL, SERVICE_ROLE_KEY);

const USD_RATE = 129;

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
  try {
    const payload = await req.json();

    console.log("CALLBACK:", JSON.stringify(payload));

    if (!payload.status) {
      return json({ ok: true });
    }

    const response = payload.response;

    if (
      response.Status !== "Success" ||
      response.ResultCode !== 0
    ) {
      return json({ ok: true });
    }

    const reference = response.ExternalReference;

    const { data: tx, error } = await admin
      .from("tradify_pesa")
      .select("*")
      .eq("reference", reference)
      .single();

    if (error || !tx) {
      return json({
        error: "Transaction not found",
      });
    }

    // already credited
    if (tx.status === "completed") {
      return json({ success: true });
    }

    const usdAmount = Number(response.Amount) / USD_RATE;

    const { data: profile } = await admin
      .from("profiles")
      .select("fiat_balance")
      .eq("id", tx.uid)
      .single();

    await admin
      .from("profiles")
      .update({
        fiat_balance:
          Number(profile?.fiat_balance || 0) + usdAmount,
      })
      .eq("id", tx.uid);

    await admin
      .from("tradify_pesa")
      .update({
        status: "completed",
        completed_at: new Date().toISOString(),
      })
      .eq("id", tx.id);

    return json({
      success: true,
    });
  } catch (e) {
    console.error(e);

    return json({
      error: "callback failed",
    }, 500);
  }
});