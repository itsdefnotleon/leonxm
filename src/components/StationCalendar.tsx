import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface LiveEntry { id: number; title: string; start: string; end: string; is_now: boolean }
interface Show { id: string; title: string; host: string | null; day_of_week: number; start_time: string; end_time: string }
interface Item { key: string; title: string; host?: string | null; start: Date; end: Date; isNow: boolean }

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
const fmt = (d: Date) => d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
const sameDay = (a: Date, b: Date) => dayKey(a) === dayKey(b);

export function StationCalendar({ stationId, stationName }: { stationId: number; stationName: string }) {
  const today = new Date();
  const [month, setMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selected, setSelected] = useState(today);

  const station = useQuery({
    queryKey: ["station-schedule-api", stationId],
    queryFn: async () => (await supabase.from("stations").select("schedule_api").eq("id", stationId).maybeSingle()).data,
  });
  const api = station.data?.schedule_api;
  const live = useQuery({
    queryKey: ["live-schedule", api],
    enabled: !!api,
    refetchInterval: 300_000,
    queryFn: async (): Promise<LiveEntry[]> => {
      const r = await fetch(api!);
      if (!r.ok) throw new Error("schedule");
      return r.json();
    },
  });
  const shows = useQuery({
    queryKey: ["station-shows", stationId],
    queryFn: async (): Promise<Show[]> =>
      ((await supabase.from("station_shows").select("*").eq("station_id", stationId)).data ?? []) as Show[],
  });

  // Group every show by calendar day for the visible month.
  const byDay = useMemo(() => {
    const map = new Map<string, Item[]>();
    const add = (it: Item) => {
      const k = dayKey(it.start);
      const list = map.get(k) ?? [];
      if (!list.some((x) => x.start.getTime() === it.start.getTime())) list.push(it);
      map.set(k, list);
    };
    (live.data ?? []).forEach((e) =>
      add({ key: `l${e.id}-${e.start}`, title: e.title, start: new Date(e.start), end: new Date(e.end), isNow: e.is_now }),
    );
    const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    for (let d = 1; d <= days; d++) {
      const date = new Date(month.getFullYear(), month.getMonth(), d);
      (shows.data ?? []).filter((s) => s.day_of_week === date.getDay()).forEach((s) => {
        const [sh, sm] = s.start_time.split(":").map(Number);
        const [eh, em] = s.end_time.split(":").map(Number);
        const start = new Date(date); start.setHours(sh, sm, 0, 0);
        const end = new Date(date); end.setHours(eh, em, 0, 0);
        if (end <= start) end.setDate(end.getDate() + 1);
        add({ key: `s${s.id}-${d}`, title: s.title, host: s.host, start, end, isNow: Date.now() >= +start && Date.now() < +end });
      });
    }
    map.forEach((l) => l.sort((a, b) => +a.start - +b.start));
    return map;
  }, [live.data, shows.data, month]);

  const lead = month.getDay();
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells: (Date | null)[] = [
    ...Array(lead).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(month.getFullYear(), month.getMonth(), i + 1)),
  ];
  const week = Array.from({ length: 7 }, (_, i) => { const d = new Date(today); d.setDate(today.getDate() + i); return d; });
  const selectedItems = byDay.get(dayKey(selected)) ?? [];
  const shift = (n: number) => setMonth(new Date(month.getFullYear(), month.getMonth() + n, 1));

  const dayButton = (d: Date, big: boolean) => {
    const isSel = sameDay(d, selected);
    const isToday = sameDay(d, today);
    const count = byDay.get(dayKey(d))?.length ?? 0;
    return (
      <button
        key={dayKey(d) + (big ? "w" : "m")}
        onClick={() => { setSelected(d); if (d.getMonth() !== month.getMonth()) setMonth(new Date(d.getFullYear(), d.getMonth(), 1)); }}
        className={`flex flex-col items-center justify-center rounded-xl border transition-colors ${big ? "py-2 min-w-[3.25rem]" : "aspect-square"} ${
          isSel ? "border-primary bg-primary/15 text-foreground" : "border-border/60 bg-background/40 text-muted-foreground hover:text-foreground hover:border-border"
        }`}
      >
        {big && <span className="text-[9px] font-bold uppercase tracking-[0.15em]">{isToday ? "Today" : WEEKDAYS[d.getDay()]}</span>}
        <span className={`font-bold ${big ? "text-lg" : "text-sm"} ${isToday && !big ? "text-primary" : ""}`}>{d.getDate()}</span>
        {!big && <span className={`mt-0.5 h-1 w-1 rounded-full ${count ? "bg-primary" : "bg-transparent"}`} />}
      </button>
    );
  };

  return (
    <div className="rounded-2xl border border-border bg-card/60 backdrop-blur p-6 sm:p-8">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-foreground">{stationName} · Schedule</h2>
        <p className="text-xs text-muted-foreground">Times shown in your local timezone</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">{week.map((d) => dayButton(d, true))}</div>

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <div className="flex items-center justify-between mb-3">
            <button onClick={() => shift(-1)} aria-label="Previous month" className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-background/60"><ChevronLeft className="w-4 h-4" /></button>
            <span className="text-sm font-semibold text-foreground">{month.toLocaleDateString([], { month: "long", year: "numeric" })}</span>
            <button onClick={() => shift(1)} aria-label="Next month" className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-background/60"><ChevronRight className="w-4 h-4" /></button>
          </div>
          <div className="grid grid-cols-7 gap-1.5 mb-1.5">
            {WEEKDAYS.map((w) => <span key={w} className="text-center text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{w}</span>)}
          </div>
          <div className="grid grid-cols-7 gap-1.5">{cells.map((c, i) => (c ? dayButton(c, false) : <span key={`e${i}`} />))}</div>
        </div>

        <div>
          <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary mb-3">
            {selected.toLocaleDateString([], { weekday: "long", day: "numeric", month: "long" })}
          </h3>
          {(live.isLoading || shows.isLoading) && <p className="text-sm text-muted-foreground">Loading schedule…</p>}
          {!live.isLoading && selectedItems.length === 0 && (
            <p className="text-sm text-muted-foreground">No scheduled shows this day — non-stop music around the clock.</p>
          )}
          <ul className="space-y-2">
            {selectedItems.map((it) => (
              <li key={it.key} className={`rounded-xl border p-3 ${it.isNow ? "border-primary bg-primary/10" : "border-border/60 bg-background/40"}`}>
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold text-sm text-foreground">{it.title}</span>
                  {it.isNow && <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-primary">On now</span>}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {fmt(it.start)} – {fmt(it.end)}{it.host ? ` · ${it.host}` : ""}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
