export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function askOpenAI(messages: ChatMessage[], opts?: { json?: boolean }): Promise<string> {
  const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/openai-chat`;
  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ messages, json: opts?.json === true }),
  });

  if (!resp.ok) {
    let message = `Request failed (${resp.status})`;
    try {
      const errBody = await resp.json();
      if (typeof errBody?.error === 'string') message = errBody.error;
    } catch {
      // keep default message
    }
    throw new Error(message);
  }

  const data = await resp.json();
  if (typeof data?.content !== 'string') {
    throw new Error('Unexpected response from AI service');
  }
  return data.content;
}
