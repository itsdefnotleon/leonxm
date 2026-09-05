import ilikeRadioLogo from "@/assets/ilikeradio-logo.png.asset.json";
import relaxLogo from "@/assets/relax-logo.png.asset.json";
import workoutLogo from "@/assets/workout-logo.png.asset.json";
import danceLogo from "@/assets/dance-logo.png.asset.json";
import hiphopLogo from "@/assets/leonxm-hiphop-logo.png.asset.json";
import ninetiesLogo from "@/assets/leonxm-90s-logo.png.asset.json";
import oneLogo from "@/assets/leonxm-one-logo.png.asset.json";


export interface Channel {
  id: number;
  name: string;
  logo: string;
  streamUrl: string;
  nowPlayingApi: string;
  geoRestricted?: string[];
  original?: boolean;
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
    original: true,
    logo: workoutLogo.url,
    streamUrl: "https://cast1.typicalmedia.net/stream/leonxm-workout/mp3",
    nowPlayingApi: "https://cast1.typicalmedia.net/api/v1/stations/leonxm-workout/nowplaying",
  },
  {
    id: 6,
    name: "LeonXM Dance",
    original: true,
    logo: danceLogo.url,
    streamUrl: "https://cast1.typicalmedia.net/stream/leonxm-dance/mp3",
    nowPlayingApi: "https://cast1.typicalmedia.net/api/v1/stations/leonxm-dance/nowplaying",
  },
  {
    id: 7,
    name: "LeonXM HipHop",
    original: true,
    logo: hiphopLogo.url,
    streamUrl: "https://cast1.typicalmedia.net/stream/leonxm-hip-hop/mp3",
    nowPlayingApi: "https://cast1.typicalmedia.net/api/v1/stations/leonxm-hip-hop/nowplaying",
  },
  {
    id: 8,
    name: "LeonXM 90s",
    original: true,
    logo: ninetiesLogo.url,
    streamUrl: "https://cast1.typicalmedia.net/stream/leonxm-90s/mp3",
    nowPlayingApi: "https://cast1.typicalmedia.net/api/v1/stations/leonxm-90s/nowplaying",
  },
  {
    id: 9,
    name: "LeonXM One",
    original: true,
    logo: oneLogo.url,
    streamUrl: "https://cast1.typicalmedia.net/stream/leonxm-one/mp3",
    nowPlayingApi: "https://cast1.typicalmedia.net/api/v1/stations/leonxm-one/nowplaying",
  },
];


