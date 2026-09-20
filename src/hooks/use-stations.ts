import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { channels as staticChannels, type Channel } from "@/lib/channels";

async function fetchStations(): Promise<Channel[]> {
  const { data, error } = await supabase
    .from("stations")
    .select("*")
    .eq("active", true)
    .order("sort_order", { ascending: true });

  if (error) throw error;

  return (data ?? []).map((r) => ({
    id: r.id,
    name: r.name,
    logo: r.logo_url,
    streamUrl: r.stream_url,
    nowPlayingApi: r.now_playing_api,
    original: r.is_original ?? false,
    geoRestricted: r.geo_restricted ?? undefined,
    tagline: r.tagline ?? undefined,
    description: r.description ?? undefined,
    genre: r.genre ?? undefined,
    location: r.location ?? undefined,
    requestUrl: r.request_url ?? undefined,
  }));
}

/** All stations, loaded from the backend with the bundled list as a fallback. */
export function useStations(): Channel[] {
  const { data } = useQuery({
    queryKey: ["stations"],
    queryFn: fetchStations,
    staleTime: 60_000,
  });

  return data && data.length > 0 ? data : staticChannels;
}

export function useStation(id: number | undefined): Channel | undefined {
  const stations = useStations();
  if (id === undefined || Number.isNaN(id)) return undefined;
  return stations.find((s) => s.id === id);
}
