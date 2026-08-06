import { ExternalLink, Newspaper } from "lucide-react";
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

export function StationNews({ station, limit = 5, title = "Station News", className = "" }: Props) {
  const { items, loading, error } = useStationNews(station, limit);

  if (!loading && !error && items.length === 0) return null;

  return (
    <div className={`rounded-2xl border border-border bg-card/60 backdrop-blur p-6 sm:p-8 ${className}`}>
      <div className="flex items-center gap-2 mb-5">
        <Newspaper className="w-4 h-4 text-primary" />
        <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary">{title}</h2>
      </div>

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
    </div>
  );
}
