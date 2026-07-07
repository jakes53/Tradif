import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ───────── CORS ─────────
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// ───────── ENV ─────────
const PROJECT_URL = Deno.env.get("PROJECT_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SERVICE_ROLE_KEY")!;
const PAYHERO_BASIC_AUTH = Deno.env.get("PAYHERO_BASIC_AUTH")!;
const PAYHERO_ACCOUNT_ID = Deno.env.get("PAYHERO_ACCOUNT_ID")!;

// ───────── CLIENT ─────────
const supabase = createClient(PROJECT_URL, SERVICE_ROLE_KEY);

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);

    // ───── CALLBACK ─────
    if (url.pathname.endsWith("/callback")) {
      const payload = await req.json();

      if (!payload?.reference || payload?.status !== "SUCCESS") {
        return json({ received: true });
      }

      const { data: tx } = await supabase
        .from("tradify_pesa")
        .select("id, uid, amount")
        .eq("reference", payload.reference)
        .eq("status", "pending")
        .single();

      if (!tx) return json({ received: true });

      const { data: profile } = await supabase
        .from("profiles")
        .select("fiat_balance")
        .eq("id", tx.uid)
        .single();

      await supabase
        .from("profiles")
        .update({
          fiat_balance: (profile?.fiat_balance || 0) + tx.amount,
        })
        .eq("id", tx.uid);

      await supabase
        .from("tradify_pesa")
        .update({ status: "completed" })
        .eq("id", tx.id);

      return json({ success: true });
    }

    // ───── STK PUSH ─────
    const { uid, phone, amount } = await req.json();

    if (!uid || !phone || !amount) {
      return json({ error: "Missing fields" }, 400);
    }

    const reference = `DEP-${crypto.randomUUID().slice(0, 8)}`;

    await supabase.from("tradify_pesa").insert({
      uid,
      phone,
      amount,
      reference,
      status: "pending",
    });

    const res = await fetch("https://backend.payhero.co.ke/api/v2/payments", {
      method: "POST",
      headers: {
        Authorization: PAYHERO_BASIC_AUTH,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount,
        phone_number: phone,
        channel_id: Number(PAYHERO_ACCOUNT_ID),
        provider: "m-pesa",
        external_reference: reference,
        callback_url: `${PROJECT_URL}/functions/v1/mpesa-deposit/callback`,
      }),
    });

    const data = await res.json();

    if (!res.ok || !data?.success) {
      await supabase
        .from("tradify_pesa")
        .update({ status: "failed" })
        .eq("reference", reference);

      return json({ error: "STK push failed" }, 400);
    }

    return json({ success: true, reference });
  } catch (err) {
    console.error(err);
    return json({ error: "Server error" }, 500);
  }
});