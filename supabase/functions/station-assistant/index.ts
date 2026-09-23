import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

interface StationInfo {
  name?: string;
  tagline?: string;
  description?: string;
  genre?: string;
  location?: string;
  nowPlaying?: { title?: string; artist?: string } | null;
  recent?: { title?: string; artist?: string }[];
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const key = Deno.env.get('LOVABLE_API_KEY');
    if (!key) {
      return new Response(JSON.stringify({ error: 'The assistant is not configured yet.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json().catch(() => null);
    const question: string = (body?.question ?? '').toString().trim().slice(0, 500);
    const station: StationInfo = body?.station ?? {};
    const allStations: { name: string; genre?: string; tagline?: string }[] = Array.isArray(body?.stations)
      ? body.stations.slice(0, 30)
      : [];

    if (!question) {
      return new Response(JSON.stringify({ error: 'Please type a question first.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const context = [
      `Station: ${station.name ?? 'Unknown'}`,
      station.tagline ? `Tagline: ${station.tagline}` : '',
      station.genre ? `Genre: ${station.genre}` : '',
      station.location ? `Location: ${station.location}` : '',
      station.description ? `About: ${station.description}` : '',
      station.nowPlaying?.title
        ? `Currently playing: "${station.nowPlaying.title}"${station.nowPlaying.artist ? ` by ${station.nowPlaying.artist}` : ''}`
        : 'Currently playing: unknown',
      station.recent?.length
        ? `Recently played: ${station.recent
            .map((s) => `"${s.title ?? ''}"${s.artist ? ` by ${s.artist}` : ''}`)
            .join(', ')}`
        : '',
      allStations.length
        ? `Other LeonXM stations: ${allStations
            .map((s) => `${s.name}${s.genre ? ` (${s.genre})` : ''}`)
            .join('; ')}`
        : '',
    ]
      .filter(Boolean)
      .join('\n');

    const systemPrompt = `You are the LeonXM station helper, a friendly assistant on a free online radio website.
Answer listener questions about the station they are on, the music currently playing, and other LeonXM stations.
LeonXM streams 24/7 and has no fixed programme schedule or DJ timetable — if asked about schedules, say the stations run non-stop around the clock and suggest what usually suits the time of day.
Use only the context below plus general music knowledge. If you do not know something specific, say so briefly and suggest where to look on the site (channel pages, News, the live chat).
Keep answers short: 2-4 sentences, warm and plain-spoken. Never invent song titles, listener numbers or times.

CONTEXT
${context}`;

    const res = await fetch('https://ai.gateway.lovable.dev/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Lovable-API-Key': key,
        'X-Lovable-AIG-SDK': 'fetch',
      },
      body: JSON.stringify({
        model: 'openai/gpt-6-astra',
        instructions: systemPrompt,
        input: question,
        stream: true,
        reasoning: { effort: 'low', summary: 'auto' },
      }),
    });

    if (!res.ok || !res.body) {
      const detail = await res.text().catch(() => '');
      const message =
        res.status === 429
          ? 'The assistant is busy right now — please try again in a moment.'
          : res.status === 402
            ? 'The assistant is temporarily unavailable.'
            : 'The assistant could not answer that right now.';
      console.error('AI gateway error', res.status, detail.slice(0, 500));
      return new Response(JSON.stringify({ error: message }), {
        status: res.status === 429 ? 429 : 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Consume the SSE stream server-side and return the final answer.
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let answer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';
      for (const line of lines) {
        if (!line.startsWith('data:')) continue;
        const data = line.slice(5).trim();
        if (!data || data === '[DONE]') continue;
        try {
          const evt = JSON.parse(data);
          if (evt.type === 'response.output_text.delta' && typeof evt.delta === 'string') {
            answer += evt.delta;
          } else if (evt.type === 'response.completed' && !answer) {
            answer = evt.response?.output_text ?? '';
          }
        } catch {
          // ignore keep-alive / partial frames
        }
      }
    }

    if (!answer.trim()) {
      return new Response(
        JSON.stringify({ error: "The assistant didn't have an answer for that — try rephrasing." }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    return new Response(JSON.stringify({ answer: answer.trim() }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('station-assistant failed', err);
    return new Response(JSON.stringify({ error: 'Something went wrong asking the assistant.' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
