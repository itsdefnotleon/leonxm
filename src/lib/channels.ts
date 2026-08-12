import ilikeRadioLogo from "@/assets/ilikeradio-logo.png.asset.json";
import relaxLogo from "@/assets/relax-logo.png.asset.json";
import workoutLogo from "@/assets/workout-logo.png.asset.json";


export interface Channel {
  id: number;
  name: string;
  logo: string;
  streamUrl: string;
  nowPlayingApi: string;
  geoRestricted?: string[];
}

// Song request pages (external players with a Request button)
export const requestUrls: Record<number, string> = {
  2: "https://live.typicalnerds.uk/?station=ilikeradio",
  3: "https://swarm.itsdefnotleon.qzz.io/",
};

export interface NowPlaying {
  now_playing?: {
    song?: {
      title?: string;
      artist?: string;
      art?: string;
    };
  };
  listeners?: {
    current?: number;
  };
}

export const channels: Channel[] = [
  {
    id: 1,
    name: "TruckHits Radio",
    logo: "https://leons-image-library.neocities.org/truckhitsradio/cover.png",
    streamUrl: "https://azura.typicalmedia.net/listen/truckhits/radio.mp3",
    nowPlayingApi: "https://azura.typicalmedia.net/api/station/truckhits/nowplaying",
  },
  {
    id: 2,
    name: "ilikeRadio",
    logo: ilikeRadioLogo.url,
    streamUrl: "https://stream.zeno.fm/otmlz6yddt6vv",
    nowPlayingApi: "https://live.typicalnerds.uk/api/station/ilikeradio/nowplaying",
  },
  {
    id: 3,
    name: "Swarm Radio",
    logo: "https://leons-image-library.neocities.org/swarm.png",
    streamUrl: "https://stream.zeno.fm/acunkwb7nf9uv",
    nowPlayingApi: "https://live.typicalnerds.uk/api/station/leonfm-swarm/nowplaying",
  },
  {
    id: 4,
    name: "Relax",
    logo: relaxLogo.url,
    streamUrl: "https://cast1.typicalmedia.net/listen/relax/mp3",
    nowPlayingApi: "https://cast1.typicalmedia.net/api/v1/stations/relax/nowplaying",
  },
  {
    id: 5,
    name: "LeonXM Workout",
    logo: workoutLogo.url,
    streamUrl: "https://cast1.typicalmedia.net/stream/leonxm-workout/mp3",
    nowPlayingApi: "https://cast1.typicalmedia.net/api/v1/stations/leonxm-workout/nowplaying",
  },
];

