const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const ALLOWED_ROLES = new Set(["system", "user", "assistant"]);

interface IncomingMessage {
  role: string;
  content: string;
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("OPENAI_API_KEY");
    if (!apiKey) {
      return json({ error: "OpenAI is not configured yet" }, 500);
    }

    const payload = await req.json();
    const rawMessages: unknown = payload?.messages;
    if (!Array.isArray(rawMessages) || rawMessages.length === 0) {
      return json({ error: "messages must be a non-empty array" }, 400);
    }

    const messages = rawMessages
      .filter(
        (m): m is IncomingMessage =>
          !!m && typeof m === "object" &&
          ALLOWED_ROLES.has((m as IncomingMessage).role) &&
          typeof (m as IncomingMessage).content === "string"
      )
      .map((m) => ({ role: m.role, content: m.content.slice(0, 24000) }));

    if (messages.length === 0) {
      return json({ error: "no valid messages provided" }, 400);
    }

    const body: Record<string, unknown> = {
      model: "gpt-4o-mini",
      messages,
      temperature: 0.7,
    };
    if (payload?.json === true) {
      body.response_format = { type: "json_object" };
    }

    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await resp.json().catch(() => null);
    if (!resp.ok) {
      const message = data?.error?.message ?? `OpenAI request failed (${resp.status})`;
      return json({ error: message }, 502);
    }

    const content = data?.choices?.[0]?.message?.content;
    if (typeof content !== "string") {
      return json({ error: "unexpected OpenAI response shape" }, 502);
    }

    return json({ content });
  } catch (err) {
    return json({ error: err instanceof Error ? err.message : "internal error" }, 500);
  }
});
