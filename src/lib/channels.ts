import ilikeRadioLogo from "@/assets/ilikeradio-logo.png.asset.json";
import relaxLogo from "@/assets/relax-logo.png.asset.json";


export interface Channel {
  id: number;
  name: string;
  logo: string;
  streamUrl: string;
  nowPlayingApi: string;
  geoRestricted?: string[];
}

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
    streamUrl: "https://live.typicalnerds.uk/listen/ilikeradio/stream",
    nowPlayingApi: "https://live.typicalnerds.uk/api/station/ilikeradio/nowplaying",
    geoRestricted: ["GB", "SE"],
  },
  {
    id: 3,
    name: "Swarm Radio",
    logo: "https://leons-image-library.neocities.org/swarm.png",
    streamUrl: "https://live.typicalnerds.uk/listen/leonfm-swarm/stream",
    nowPlayingApi: "https://live.typicalnerds.uk/api/station/leonfm-swarm/nowplaying",
    geoRestricted: ["GB", "SE"],
  },
  {
    id: 4,
    name: "Relax",
    logo: relaxLogo.url,
    streamUrl: "https://cast1.typicalmedia.net/listen/relax/mp3",
    nowPlayingApi: "https://cast1.typicalmedia.net/api/v1/stations/relax/nowplaying",
  },
];

