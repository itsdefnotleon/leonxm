import { AlertTriangle, ExternalLink, Newspaper, RefreshCw } from "lucide-react";
import { useStationNews } from "@/hooks/use-station-news";

interface Props {
  station?: "ilikeradio" | "swarmradio";
  limit?: number;
  title?: string;
  className?: string;
}

function formatDate(iso: string | null) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" });
}

const swarmPlatforms = [
  { label: "Typical Nerds LIVE! Player", url: "https://live.typicalnerds.uk/?station=leonfm-swarm" },
  { label: "Swarm Radio Player", url: "https://swarm.itsdefnotleon.qzz.io/" },
  { label: "OnlineRadioBox", url: "https://onlineradiobox.com/se/swarm/" },
  { label: "RadioReg", url: "https://radioreg.net/stations/684" },
  { label: "Zeno FM", url: "https://zeno.fm/radio/swarm-radio/" },
  { label: "TuneIn", url: "https://tunein.com/radio/Swarm-Radio-s352122/" },
];

function SwarmNotice() {
  return (
    <div className="mb-6 rounded-xl border border-destructive/40 bg-destructive/10 p-5">
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle className="w-4 h-4 text-destructive" />
        <h3 className="text-sm font-bold text-foreground">Important Notice</h3>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">
        As of 9pm UTC+0 on Tuesday the 1st of September 2026, Swarm Radio's Caster.FM website has
        officially shutdown and will remain archived until further notice. Therefore, this news
        section will no longer receive updates.
      </p>
      <p className="text-sm text-muted-foreground leading-relaxed mt-3">
        To continue listening to Swarm Radio, you can keep listening to us here on LeonXM or on the
        other following platforms:
      </p>
      <ul className="mt-3 space-y-1.5">
        {swarmPlatforms.map((p) => (
          <li key={p.url}>
            <a
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
            >
              {p.label}
              <ExternalLink className="w-3 h-3" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function StationNews({ station, limit = 5, title = "Station News", className = "" }: Props) {
  const { items, loading, error } = useStationNews(station, limit);

  const showSwarmNotice = station === "swarmradio" || station === undefined;

  if (!loading && !error && items.length === 0 && !showSwarmNotice) return null;

  return (
    <div className={`rounded-2xl border border-border bg-card/60 backdrop-blur p-6 sm:p-8 ${className}`}>
      <div className="flex items-center gap-2 mb-5">
        <Newspaper className="w-4 h-4 text-primary" />
        <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary">{title}</h2>
      </div>

      {showSwarmNotice && <SwarmNotice />}

      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-5 rounded bg-secondary/60 animate-pulse" />
          ))}
        </div>
      )}

      {error && !loading && (
        <p className="text-sm text-muted-foreground">Station news is unavailable right now.</p>
      )}

      {!loading && !error && (
        <ul className="space-y-4">
          {items.map((item) => (
            <li key={item.url}>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-2"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
                    {item.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {!station && <span className="text-primary font-semibold">{item.station}</span>}
                    {!station && formatDate(item.date) && " · "}
                    {formatDate(item.date)}
                  </p>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-1 group-hover:text-primary transition-colors" />
              </a>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-6 pt-4 border-t border-border/60 text-xs text-muted-foreground flex items-center gap-1.5">
        <RefreshCw className="w-3 h-3" />
        Updated automatically · Powered by the stations' Caster.FM websites
      </p>
    </div>
  );
}
