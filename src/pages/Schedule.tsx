import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useModerator } from "@/hooks/use-moderator";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const input =
  "rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary";

interface LiveEntry { id: number; title: string; start: string; end: string; is_now: boolean }

const fmt = (iso: string) => new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
const day = (iso: string) => new Date(iso).toLocaleDateString([], { weekday: "long", day: "numeric", month: "short" });

export default function Schedule() {
  const id = Number(useParams().id);
  const isMod = useModerator();
  const qc = useQueryClient();
  const [form, setForm] = useState({ title: "", host: "", day_of_week: 1, start_time: "09:00", end_time: "10:00" });

  const station = useQuery({
    queryKey: ["station", id],
    queryFn: async () => (await supabase.from("stations").select("id,name,schedule_api").eq("id", id).maybeSingle()).data,
  });

  const live = useQuery({
    queryKey: ["live-schedule", station.data?.schedule_api],
    enabled: !!station.data?.schedule_api,
    refetchInterval: 300_000,
    queryFn: async (): Promise<LiveEntry[]> => {
      const r = await fetch(station.data!.schedule_api!);
      if (!r.ok) throw new Error("schedule");
      const rows: LiveEntry[] = await r.json();
      // Drop duplicate/overlapping entries with the same start time
      const seen = new Set<string>();
      return rows.filter((e) => (seen.has(e.start) ? false : (seen.add(e.start), true)));
    },
  });

  const shows = useQuery({
    queryKey: ["shows", id],
    queryFn: async () =>
      (await supabase.from("station_shows").select("*").eq("station_id", id).order("day_of_week").order("start_time")).data ?? [],
  });

  const add = async () => {
    if (!form.title.trim()) return toast.error("Give the show a name.");
    const { error } = await supabase.from("station_shows").insert({ ...form, host: form.host || null, station_id: id });
    if (error) toast.error("Could not add show.");
    else { setForm({ ...form, title: "", host: "" }); qc.invalidateQueries({ queryKey: ["shows", id] }); }
  };
  const remove = async (sid: string) => {
    const { error } = await supabase.from("station_shows").delete().eq("id", sid);
    if (error) toast.error("Could not remove show."); else qc.invalidateQueries({ queryKey: ["shows", id] });
  };

  const name = station.data?.name ?? "Station";
  const grouped = (live.data ?? []).reduce<Record<string, LiveEntry[]>>((a, e) => ((a[day(e.start)] ??= []).push(e), a), {});

  return (
    <div className="min-h-screen bg-background">
      <SEO title={`${name} Schedule — LeonXM`} description={`Shows, hosts and air times on ${name}.`} path={`/channel/${id}/schedule`} />
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-12 pb-32">
        <Link to={`/channel/${id}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" /> {name}
        </Link>
        <h1 className="text-4xl font-bold text-foreground tracking-tight mb-8">{name} Schedule</h1>

        {(shows.data ?? []).length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg font-bold text-foreground mb-3">Weekly shows</h2>
            <div className="space-y-2">
              {shows.data!.map((s) => (
                <div key={s.id} className="flex items-center gap-3 rounded-xl border border-border bg-card/60 p-3">
                  <span className="w-28 text-xs font-semibold text-primary">{DAYS[s.day_of_week]}</span>
                  <span className="w-28 text-xs text-muted-foreground">{s.start_time.slice(0, 5)}–{s.end_time.slice(0, 5)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">{s.title}</p>
                    {s.host && <p className="text-xs text-muted-foreground">with {s.host}</p>}
                  </div>
                  {isMod && <button aria-label="Remove show" onClick={() => remove(s.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>}
                </div>
              ))}
            </div>
          </section>
        )}

        {station.data?.schedule_api && (
          <section className="mb-10">
            <h2 className="text-lg font-bold text-foreground mb-3">Coming up</h2>
            {live.isLoading && <p className="text-sm text-muted-foreground">Loading schedule…</p>}
            {live.isError && <p className="text-sm text-muted-foreground">The live schedule is unavailable right now.</p>}
            {Object.entries(grouped).map(([d, entries]) => (
              <div key={d} className="mb-5">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">{d}</p>
                <div className="space-y-2">
                  {entries.map((e) => (
                    <div key={`${e.id}-${e.start}`} className={`flex items-center gap-3 rounded-xl border p-3 ${e.is_now ? "border-primary bg-primary/10" : "border-border bg-card/60"}`}>
                      <span className="w-28 text-xs text-muted-foreground">{fmt(e.start)}–{fmt(e.end)}</span>
                      <span className="flex-1 text-sm font-semibold text-foreground">{e.title}</span>
                      {e.is_now && <span className="text-[10px] font-bold uppercase text-primary">On now</span>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>
        )}

        {!station.data?.schedule_api && (shows.data ?? []).length === 0 && !shows.isLoading && (
          <p className="text-sm text-muted-foreground">No schedule yet — this station plays around the clock.</p>
        )}

        {isMod && (
          <section className="rounded-xl border border-border bg-card/60 p-4 space-y-3">
            <h2 className="text-sm font-bold text-foreground">Add a show</h2>
            <div className="grid gap-2 sm:grid-cols-2">
              <input className={input} placeholder="Show name" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <input className={input} placeholder="Host (optional)" value={form.host} onChange={(e) => setForm({ ...form, host: e.target.value })} />
              <select className={input} value={form.day_of_week} onChange={(e) => setForm({ ...form, day_of_week: Number(e.target.value) })}>
                {DAYS.map((d, i) => <option key={d} value={i}>{d}</option>)}
              </select>
              <div className="flex gap-2">
                <input type="time" className={`${input} flex-1`} value={form.start_time} onChange={(e) => setForm({ ...form, start_time: e.target.value })} />
                <input type="time" className={`${input} flex-1`} value={form.end_time} onChange={(e) => setForm({ ...form, end_time: e.target.value })} />
              </div>
            </div>
            <button onClick={add} className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
              <Plus className="w-4 h-4" /> Add show
            </button>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
