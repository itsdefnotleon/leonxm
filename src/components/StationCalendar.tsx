import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { scheduleWeek, scheduleApiForDay, entriesStartingOnDay } from "@/lib/schedule-week";

interface LiveEntry { id: number; title: string; start: string; end: string; is_now: boolean }
interface Show { id: string; title: string; host: string | null; day_of_week: number; start_time: string; end_time: string }
interface Item { key: string; title: string; host?: string | null; start: Date; end: Date; isNow: boolean }

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
const fmt = (d: Date) => d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
const sameDay = (a: Date, b: Date) => dayKey(a) === dayKey(b);

export function StationCalendar({ stationId, stationName }: { stationId: number; stationName: string }) {
  const today = new Date();
  const [selected, setSelected] = useState(today);
  const todayKey = dayKey(today);
  const week = useMemo(() => scheduleWeek(new Date()), [todayKey]);

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
      if (!api) return [];
      const r = await fetch(api);
      if (!r.ok) throw new Error("schedule");
      return r.json();
    },
  });
  const shows = useQuery({
    queryKey: ["station-shows", stationId],
    queryFn: async (): Promise<Show[]> =>
      ((await supabase.from("station_shows").select("*").eq("station_id", stationId)).data ?? []) as Show[],
  });

  // Combine live entries and recurring shows for the next seven days.
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
    for (const date of week) {
      (shows.data ?? []).filter((s) => s.day_of_week === date.getDay()).forEach((s) => {
        const [sh, sm] = s.start_time.split(":").map(Number);
        const [eh, em] = s.end_time.split(":").map(Number);
        const start = new Date(date); start.setHours(sh, sm, 0, 0);
        const end = new Date(date); end.setHours(eh, em, 0, 0);
        if (end <= start) end.setDate(end.getDate() + 1);
        add({ key: `s${s.id}-${dayKey(date)}`, title: s.title, host: s.host, start, end, isNow: Date.now() >= +start && Date.now() < +end });
      });
    }
    map.forEach((l) => l.sort((a, b) => +a.start - +b.start));
    return map;
  }, [live.data, shows.data, week]);

  const selectedItems = byDay.get(dayKey(selected)) ?? [];

  const dayButton = (d: Date) => {
    const isSel = sameDay(d, selected);
    const isToday = sameDay(d, today);
    return (
      <Button
        variant="outline"
        role="tab"
        aria-selected={isSel}
        aria-controls={`schedule-day-${stationId}`}
        key={dayKey(d)}
        onClick={() => setSelected(d)}
        className={`flex h-16 min-w-0 flex-col items-center justify-center gap-0 rounded-lg border px-1 py-2 transition-colors ${
          isSel ? "border-primary bg-primary/15 text-foreground" : "border-border/60 bg-background/40 text-muted-foreground hover:text-foreground hover:border-border"
        }`}
      >
        <span className="text-[9px] font-bold uppercase">{isToday ? "Today" : WEEKDAYS[d.getDay()]}</span>
        <span className="text-lg font-bold">{d.getDate()}</span>
      </Button>
    );
  };

  return (
    <section aria-label={`${stationName} weekly schedule`} className="border-y border-border py-6 sm:py-8">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-foreground">{stationName} · Schedule</h2>
        <p className="text-xs text-muted-foreground">Times shown in your local timezone</p>
      </div>

      <div role="tablist" aria-label="Schedule days" className="grid grid-cols-7 gap-1 sm:gap-2 mb-6 max-w-xl">{week.map(dayButton)}</div>

        <div role="tabpanel" id={`schedule-day-${stationId}`}>
          <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary mb-3">
            {selected.toLocaleDateString([], { weekday: "long", day: "numeric", month: "long" })}
          </h3>
          {(live.isLoading || shows.isLoading) && <p className="text-sm text-muted-foreground">Loading schedule…</p>}
          {(live.isError || shows.isError) && <p className="text-sm text-muted-foreground">The schedule is unavailable right now.</p>}
          {!live.isLoading && !shows.isLoading && !live.isError && !shows.isError && selectedItems.length === 0 && (
            <p className="text-sm text-muted-foreground">No scheduled shows listed for this day.</p>
          )}
          <ul className="space-y-2">
            {selectedItems.map((it) => (
              <li key={it.key} className={`rounded-lg border p-3 ${it.isNow ? "border-primary bg-primary/10" : "border-border/60 bg-background/40"}`}>
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
    </section>
  );
}
