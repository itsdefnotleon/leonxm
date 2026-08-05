import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { z } from 'npm:zod@3';

const BodySchema = z.object({
  overall: z.string().min(1).max(50),
  favouriteChannel: z.string().min(1).max(100),
  audioQuality: z.string().min(1).max(50),
  design: z.string().min(1).max(50),
  discovery: z.string().min(1).max(100),
  improvements: z.string().max(2000).optional().default(''),
  recommend: z.string().min(1).max(50),
  contact: z.string().max(200).optional().default(''),
});

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const webhook = Deno.env.get('DISCORD_WEBHOOK');
    if (!webhook) {
      return new Response(JSON.stringify({ error: 'Survey delivery is not configured.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const parsed = BodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: parsed.error.flatten().fieldErrors }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const d = parsed.data;

    const payload = {
      username: 'LeonXM Survey',
      embeds: [
        {
          title: 'New LeonXM Listener Survey Response',
          color: 0x3b6cff,
          timestamp: new Date().toISOString(),
          fields: [
            { name: 'Overall experience', value: d.overall, inline: true },
            { name: 'Favourite channel', value: d.favouriteChannel, inline: true },
            { name: 'Audio quality', value: d.audioQuality, inline: true },
            { name: 'Website design', value: d.design, inline: true },
            { name: 'How they found LeonXM', value: d.discovery, inline: true },
            { name: 'Would recommend', value: d.recommend, inline: true },
            { name: 'What could be better', value: d.improvements?.slice(0, 1024) || '—' },
            { name: 'Contact (optional)', value: d.contact || '—' },
          ],
        },
      ],
    };

    const res = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const details = await res.text();
      console.error(`Discord webhook failed [${res.status}]: ${details}`);
      return new Response(JSON.stringify({ error: 'Failed to deliver survey', status: res.status, details }), {
        status: res.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('submit-survey error', e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
