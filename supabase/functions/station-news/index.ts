import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const SOURCES: Record<string, { name: string; url: string }> = {
  ilikeradio: { name: 'ilikeRadio', url: 'https://ilikeradio.ismyradio.com/news' },
  swarmradio: { name: 'Swarm Radio', url: 'https://swarmradio.ismyradio.com/news' },
};

interface Item {
  station: string;
  title: string;
  url: string;
  date: string | null;
}

function decode(s: string) {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

async function scrape(key: string): Promise<Item[]> {
  const src = SOURCES[key];
  const res = await fetch(src.url, {
    headers: { 'User-Agent': 'LeonXM-NewsBot/1.0 (+https://leonxm.lovable.app)' },
  });
  if (!res.ok) throw new Error(`[${res.status}] failed to fetch ${src.url}`);
  const html = await res.text();

  const items: Item[] = [];
  const seen = new Set<string>();
  // Each list entry: <a class="header" href=".../news/slug">Title</a> ... data-datetime="ISO"
  const re = /<a\s+class="header"\s+href="([^"]*\/news\/[^"]+)"[^>]*>([\s\S]*?)<\/a>([\s\S]{0,800}?)data-datetime="([^"]*)"/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const url = m[1];
    if (seen.has(url)) continue;
    seen.add(url);
    items.push({
      station: src.name,
      title: decode(m[2].replace(/<[^>]+>/g, '')),
      url,
      date: m[4] || null,
    });
  }
  return items;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const url = new URL(req.url);
    const station = url.searchParams.get('station');
    const limit = Math.min(Number(url.searchParams.get('limit') ?? '5') || 5, 20);

    const keys = station ? [station.toLowerCase()] : Object.keys(SOURCES);
    if (keys.some((k) => !SOURCES[k])) {
      return new Response(JSON.stringify({ error: 'Unknown station' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const results = await Promise.allSettled(keys.map(scrape));
    const items: Item[] = [];
    const errors: string[] = [];
    results.forEach((r, i) => {
      if (r.status === 'fulfilled') items.push(...r.value.slice(0, limit));
      else {
        console.error(`scrape failed for ${keys[i]}:`, r.reason);
        errors.push(keys[i]);
      }
    });

    items.sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''));

    return new Response(JSON.stringify({ items, errors }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=900',
      },
    });
  } catch (e) {
    console.error('station-news error:', e);
    return new Response(JSON.stringify({ error: String((e as Error).message ?? e) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
