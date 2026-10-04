import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Pin, PinOff, Trash2, MicOff, Save, Plus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useModerator } from "@/hooks/use-moderator";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";

type Tab = "stations" | "chat" | "pinned" | "mutes";

interface StationRow {
  id: number;
  name: string;
  logo_url: string;
  stream_url: string;
  now_playing_api: string;
  tagline: string | null;
  description: string | null;
  is_original: boolean;
  sort_order: number;
  active: boolean;
}

const input =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary";

function StationEditor({ station, onSaved }: { station: StationRow; onSaved: () => void }) {
  const [s, setS] = useState(station);
  const [saving, setSaving] = useState(false);
  const set = <K extends keyof StationRow>(k: K, v: StationRow[K]) => setS((p) => ({ ...p, [k]: v }));

  const save = async () => {
    setSaving(true);
    const { id, ...rest } = s;
    const { error } = await supabase.from("stations").upsert({ id, ...rest });
    setSaving(false);
    if (error) toast.error("Could not save station.");
    else {
      toast.success(`${s.name} saved.`);
      onSaved();
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card/60 p-4 space-y-3">
      <div className="flex items-center gap-3">
        {s.logo_url && <img src={s.logo_url} alt="" className="w-10 h-10 rounded object-cover" />}
        <span className="text-xs text-muted-foreground">#{s.id}</span>
        <input className={input} value={s.name} onChange={(e) => set("name", e.target.value)} placeholder="Name" />
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <input className={input} value={s.logo_url} onChange={(e) => set("logo_url", e.target.value)} placeholder="Logo URL" />
        <input className={input} value={s.stream_url} onChange={(e) => set("stream_url", e.target.value)} placeholder="Stream URL" />
        <input className={input} value={s.now_playing_api} onChange={(e) => set("now_playing_api", e.target.value)} placeholder="Now playing API" />
        <input className={input} value={s.tagline ?? ""} onChange={(e) => set("tagline", e.target.value || null)} placeholder="Tagline" />
      </div>
      <textarea className={input} rows={2} value={s.description ?? ""} onChange={(e) => set("description", e.target.value || null)} placeholder="Description" />
      <div className="flex flex-wrap items-center gap-4 text-sm text-foreground">
        <label className="flex items-center gap-2"><input type="checkbox" checked={s.active} onChange={(e) => set("active", e.target.checked)} /> Visible</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={s.is_original} onChange={(e) => set("is_original", e.target.checked)} /> Original</label>
        <label className="flex items-center gap-2">Order <input type="number" className={`${input} w-20`} value={s.sort_order} onChange={(e) => set("sort_order", Number(e.target.value))} /></label>
        <button onClick={save} disabled={saving} className="ml-auto inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50">
          <Save className="w-4 h-4" /> Save
        </button>
      </div>
    </div>
  );
}

export default function Moderator() {
  const { user } = useAuth();
  const isModerator = useModerator();
  const qc = useQueryClient();
  const [tab, setTab] = useState<Tab>("stations");
  const [stationFilter, setStationFilter] = useState<number | "all">("all");

  const stations = useQuery({
    queryKey: ["mod-stations"],
    enabled: isModerator,
    queryFn: async () => {
      const { data, error } = await supabase.from("stations").select("*").order("sort_order");
      if (error) throw error;
      return data as StationRow[];
    },
  });

  const messages = useQuery({
    queryKey: ["mod-messages", stationFilter],
    enabled: isModerator,
    queryFn: async () => {
      let q = supabase.from("chat_messages").select("*").order("created_at", { ascending: false }).limit(200);
      if (stationFilter !== "all") q = q.eq("station_id", stationFilter);
      const { data, error } = await q;
      if (error) throw error;
      return data;
    },
  });

  const mutes = useQuery({
    queryKey: ["mod-mutes"],
    enabled: isModerator,
    queryFn: async () => {
      const { data, error } = await supabase.from("chat_mutes").select("*").gt("muted_until", new Date().toISOString());
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (!isModerator) return;
    const ch = supabase
      .channel("mod-dashboard")
      .on("postgres_changes", { event: "*", schema: "public", table: "chat_messages" }, () =>
        qc.invalidateQueries({ queryKey: ["mod-messages"] })
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [isModerator, qc]);

  const stationName = (id: number) => stations.data?.find((s) => s.id === id)?.name ?? `#${id}`;
  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["mod-messages"] });
    qc.invalidateQueries({ queryKey: ["mod-mutes"] });
  };

  const togglePin = async (id: string, pinned: boolean) => {
    const { error } = await supabase.from("chat_messages").update({ pinned: !pinned, pinned_at: pinned ? null : new Date().toISOString() }).eq("id", id);
    if (error) toast.error("Could not update message."); else refresh();
  };
  const remove = async (id: string) => {
    const { error } = await supabase.from("chat_messages").delete().eq("id", id);
    if (error) toast.error("Could not delete message."); else refresh();
  };
  const mute = async (station_id: number, user_id: string, name: string) => {
    if (!user) return;
    const until = new Date(Date.now() + 15 * 60_000).toISOString();
    const { error } = await supabase.from("chat_mutes").upsert({ station_id, user_id, muted_until: until, created_by: user.id }, { onConflict: "station_id,user_id" });
    if (error) toast.error("Could not mute."); else { toast.success(`${name} muted for 15 minutes.`); refresh(); }
  };
  const unmute = async (id: string) => {
    const { error } = await supabase.from("chat_mutes").delete().eq("id", id);
    if (error) toast.error("Could not unmute."); else refresh();
  };
  const addStation = () => {
    const nextId = Math.max(0, ...(stations.data ?? []).map((s) => s.id)) + 1;
    qc.setQueryData<StationRow[]>(["mod-stations"], (prev) => [
      ...(prev ?? []),
      { id: nextId, name: "New station", logo_url: "", stream_url: "", now_playing_api: "", tagline: null, description: null, is_original: false, sort_order: nextId, active: false },
    ]);
  };

  const list = tab === "pinned" ? (messages.data ?? []).filter((m) => m.pinned) : messages.data ?? [];

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Moderator Dashboard — LeonXM" description="LeonXM moderator tools." path="/moderator" />
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-12 pb-32">
        <h1 className="text-4xl font-bold text-foreground tracking-tight mb-6">Moderator Dashboard</h1>

        {!user ? (
          <p className="text-muted-foreground"><Link to="/auth" className="text-primary font-semibold">Sign in</Link> to continue.</p>
        ) : !isModerator ? (
          <p className="text-muted-foreground">Your account doesn't have moderator access.</p>
        ) : (
          <>
            <div className="flex flex-wrap gap-2 mb-6">
              {(["stations", "chat", "pinned", "mutes"] as Tab[]).map((t) => (
                <button key={t} onClick={() => setTab(t)} className={`rounded-full px-4 py-2 text-sm font-semibold capitalize ${tab === t ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground"}`}>
                  {t === "chat" ? "Chat" : t === "pinned" ? "Pinned" : t === "mutes" ? "Muted" : "Stations"}
                </button>
              ))}
            </div>

            {tab === "stations" && (
              <div className="space-y-4">
                {(stations.data ?? []).map((s) => (
                  <StationEditor key={s.id} station={s} onSaved={() => { qc.invalidateQueries({ queryKey: ["mod-stations"] }); qc.invalidateQueries({ queryKey: ["stations"] }); }} />
                ))}
                <button onClick={addStation} className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground">
                  <Plus className="w-4 h-4" /> Add station
                </button>
              </div>
            )}

            {(tab === "chat" || tab === "pinned") && (
              <div>
                <select className={`${input} mb-4 max-w-xs`} value={stationFilter} onChange={(e) => setStationFilter(e.target.value === "all" ? "all" : Number(e.target.value))}>
                  <option value="all">All stations</option>
                  {(stations.data ?? []).map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
                <div className="space-y-2">
                  {list.length === 0 && <p className="text-sm text-muted-foreground">Nothing here.</p>}
                  {list.map((m) => (
                    <div key={m.id} className="flex items-start gap-3 rounded-xl border border-border bg-card/60 p-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-muted-foreground">
                          <span className="font-bold text-primary">{m.display_name}</span> · {stationName(m.station_id)} · {new Date(m.created_at).toLocaleString()}
                        </p>
                        <p className="text-sm text-foreground break-words">{m.content}</p>
                      </div>
                      <button aria-label="Pin" onClick={() => togglePin(m.id, m.pinned)} className="text-muted-foreground hover:text-primary">
                        {m.pinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
                      </button>
                      {m.user_id !== user.id && (
                        <button aria-label="Mute" onClick={() => mute(m.station_id, m.user_id, m.display_name)} className="text-muted-foreground hover:text-destructive"><MicOff className="w-4 h-4" /></button>
                      )}
                      <button aria-label="Delete" onClick={() => remove(m.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === "mutes" && (
              <div className="space-y-2">
                {(mutes.data ?? []).length === 0 && <p className="text-sm text-muted-foreground">No one is muted.</p>}
                {(mutes.data ?? []).map((m) => (
                  <div key={m.id} className="flex items-center gap-3 rounded-xl border border-border bg-card/60 p-3 text-sm text-foreground">
                    <span className="flex-1">{stationName(m.station_id)} · user {m.user_id.slice(0, 8)} · until {new Date(m.muted_until).toLocaleTimeString()}</span>
                    <button onClick={() => unmute(m.id)} className="rounded-full border border-border px-3 py-1 text-xs font-semibold">Unmute</button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
