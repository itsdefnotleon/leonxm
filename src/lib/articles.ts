import truckHitsThumb from "@/assets/TruckHits_Radio_thumbnail.png.asset.json";
import summerUpdateThumb from "@/assets/LeonXM_summer_thumbnail.png.asset.json";
import shareUpdateThumb from "@/assets/LeonXM_share_update_thumbnail.png.asset.json";
import relaxThumb from "@/assets/relax-article-thumbnail.png.asset.json";
import globalThumb from "@/assets/swarm-ilike-global-thumbnail.png.asset.json";
import originalsThumb from "@/assets/dance-workout-originals.png.asset.json";
import hiphopThumb from "@/assets/leonxm-hiphop-launch.png.asset.json";

export type Article = {
  id: string;
  title: string;
  date: string;
  summary: string;
  content: string;
  image?: string;
  link?: { to: string; label: string };
};

export const articles: Article[] = [
  {
    id: "leonxm-workout-launch",
    title: "LeonXM Workout and LeonXM Dance Are Now Live",
    date: "August 12, 2026",
    summary: "Two exclusive LeonXM stations kick off the LeonXM Original Stations collection — Workout for the gym, Dance for the floor.",
    image: originalsThumb.url,
    content: `Need a boost? LeonXM Workout is live now — and it's built for motion.

This isn't background music. It's a station that pushes harder as you do: fast tempos, heavy drops, and the kind of tracks that make you want to add another set, another lap, or another kilometre. Whether you're warming up, mid-lift, or chasing a personal best, the playlist is locked in to keep your energy up.

And it's not arriving alone. LeonXM Dance has launched alongside it — big room anthems, club classics and non-stop beats for whenever you want the party to follow you. The slogan says it all: dance away!

Together, these two stations launch the LeonXM Original Stations collection: stations made by us, exclusive to LeonXM, and available nowhere else. Workout and Dance are just the start — more originals are coming soon.

Both are 100% free. No sign-up, no geoblocks, no interruptions — streaming around the clock.

Grab your headphones and press play.`,
    link: { to: "/originals", label: "Explore LeonXM Originals →" },
  },

  {
    id: "ilikeradio-swarm-global",
    title: "ilikeRadio and Swarm Radio Are No Longer Geolocked",
    date: "August 8, 2026",
    summary: "Both stations have moved to new global stream links, so the UK and Sweden restriction is gone — anyone, anywhere, can now listen.",
    image: globalThumb.url,
    content: `Good news for listeners outside the UK and Sweden: ilikeRadio and Swarm Radio are now available everywhere on LeonXM.

Until now, both stations ran through an AzuraCast server that was geolocked to the United Kingdom and Sweden. That wasn't a licensing decision — the server simply refused connections from other countries, so we had to block those channels for everyone else and show a popup explaining why.

Both stations have now switched to new global stream links, which can be reached from any country. As a result, we've removed the regional restriction entirely. The lock icons are gone, the popup is gone, and the channel pages work for everyone.

Nothing changes if you were already listening from the UK or Sweden — the audio is the same, and now-playing info still updates live. If you've tried these stations before and hit the region popup, give them another go.`,
    link: { to: "/channels", label: "Browse all channels →" },
  },
  {
    id: "relax-station-launch",
    title: "Say Hello to Relax — All Chill, Non-Stop",
    date: "August 7, 2026",
    summary: "A brand new station joins the lineup: Relax, dedicated entirely to chill music, streaming 24/7.",
    image: relaxThumb.url,
    content: `There's a new station on the dial. Relax has officially joined the lineup, and it's dedicated to one thing: chill music, all day and all night.

Expect laid-back beats, mellow vocals and easy listening with no interruptions. It's the station to put on while you're working, studying, gaming quietly or winding down at the end of the day. The slogan says it best — all chill, non-stop.

Relax streams 24/7 with live now-playing info, just like every other station here, so you'll always see what's on. It's available to everyone with no regional restrictions.

Head over to the Relax channel page and hit play.`,
    link: { to: "/channel/4", label: "Listen to Relax →" },
  },

  {
    id: "listener-survey-2026",
    title: "Tell Us What You Think — The LeonXM Listener Survey Is Live",
    date: "August 5, 2026",
    summary: "We want to hear how LeonXM is doing. Our new listener survey takes under two minutes and goes straight to the team.",
    content: `LeonXM has grown a lot since it launched, and everything we've built so far — the channel pages, the persistent player, local time theming, share buttons — came from listening to the people actually using it.

So now we're asking directly: what do you think of LeonXM?

We've put together a short listener survey covering the things we care most about. How is the audio quality when you stream? Which channel do you have on the most? What do you make of the site's design? And, most importantly, what's missing — what would make LeonXM better for you?

The survey takes under two minutes. It's completely anonymous unless you choose to leave a Discord username or email at the end, and every response goes straight to the LeonXM team. We read all of them.

Whether you're an ETS2 driver with TruckHits Radio on in the background, a Bristol listener tuning into ilikeRadio, or you're here for Swarm Radio, your answers shape what we build next.

Hit the button below and let us know how we're doing.`,
    link: { to: "/survey", label: "Take the LeonXM survey →" },
  },
  {
    id: "share-articles-social",
    title: "You Can Now Share LeonXM News Articles on Social Media",
    date: "July 23, 2026",
    summary: "Every article on the LeonXM News page now has built-in share buttons for X, Facebook, LinkedIn, and one-tap copy link — so spreading the word takes seconds.",
    image: shareUpdateThumb.url,
    content: `Sharing LeonXM news just got a whole lot easier. Every article on the News page now comes with a dedicated share row featuring one-click buttons for X (formerly Twitter), Facebook, and LinkedIn, plus a copy-link button that puts the article's direct URL straight onto your clipboard.

On mobile, you'll also see a native share button that hooks into your device's built-in share sheet — so you can send an article to WhatsApp, Messages, Discord, or anywhere else you chat, without leaving LeonXM.

We've paired this with a proper SEO pass across the whole site. Each article, channel, and page now has its own tailored title, description, and social preview card. That means when you paste a LeonXM link into a social post or a chat, the preview that pops up will actually reflect the specific article or channel you're sharing — not just a generic homepage card.

We built this because we want LeonXM's stories to travel. Whether it's a station outage update, a Summer feature drop, or news about ilikeRadio in Bristol, you should be able to hand it to a friend in a single tap.

Give it a try on this very article — scroll down, hit the X, Facebook, or LinkedIn button, and see how it looks in the wild.`,
    link: { to: "/news", label: "Back to all news →" },
  },
  {
    id: "truckhits-azuracast-down-again",
    title: "TruckHits Radio Temporarily Offline",
    date: "July 22, 2026",
    summary: "TruckHits Radio is currently unavailable due to an outage on its AzuraCast hosting server. The station operator has confirmed the service will return as soon as possible.",
    image: truckHitsThumb.url,
    content: `TruckHits Radio is currently offline on LeonXM due to an outage affecting the AzuraCast server that hosts the stream.

The station operator has been made aware of the issue and has told us the server will come back online whenever the hosting platform is restored. Unfortunately, this means we don't have a firm estimate for when TruckHits Radio will be available again.

We know this is frustrating for listeners who rely on TruckHits Radio for music during their drives, and we're sorry for the interruption. As soon as the AzuraCast server is back up, the stream will resume automatically on LeonXM — no action needed on your end.

We'll keep this article updated with any new information we receive. In the meantime, you can still tune in to ilikeRadio and Swarm Radio on LeonXM.`,
    link: { to: "/channels", label: "Browse all channels →" },
  },
  {
    id: "truckhits-stream-fixed",
    title: "TruckHits Radio on LeonXM now available again",
    date: "July 18, 2026",
    summary: "TruckHits Radio is back on LeonXM. We apologise for the recent interruption, and we want listeners to know about upcoming work on the hosting platform.",
    image: truckHitsThumb.url,
    content: `TruckHits Radio is now available again on LeonXM. We sincerely apologise to anyone who tuned in recently and couldn't hear anything — we're not sure how long the issue was going on, which is why we're taking full responsibility for not catching it sooner.

Please try listening again now. The stream should be back to full strength with all the hit music you expect on your hauls.

However, the station's hosting platform, AzuraCast (Node 2) & Xtra Audio, will be shutting down on July 31, 2026 at 06:00 HAT.

Because of this shutdown, more disruption to TruckHits Radio may occur over the coming days. We'll keep this article updated as we learn more, so stay tuned to LeonXM for the latest.

We were only just made aware of this ourselves, and we're sorry it wasn't caught sooner.`,
    link: { to: "/channel/1", label: "Listen to TruckHits Radio →" },
  },
  {
    id: "ilikeradio-maintenance",
    title: "ilikeRadio Website Down for Maintenance This Saturday — LeonXM Stays Live",
    date: "April 10, 2026",
    summary: "ilikeRadio's website will be undergoing scheduled maintenance this Saturday, but don't worry — LeonXM will continue broadcasting without interruption.",
    content: `This Saturday, ilikeRadio's standalone website will be going offline temporarily for scheduled maintenance. During this downtime, listeners who rely on the ilikeRadio website directly will be unable to access the stream.

However, if you're listening through LeonXM, you won't notice a thing. LeonXM's infrastructure operates independently, meaning all of our channels — including ilikeRadio — will continue to broadcast without any interruption.

This is one of the key advantages of the LeonXM platform. Our streams are hosted on robust, independent infrastructure that ensures 24/7 availability regardless of what happens with individual station websites.

So if you're a fan of ilikeRadio and want uninterrupted access to Bristol's best music this weekend, just keep it locked to LeonXM. We'll be here, as always — free, online, and live.`,
    link: { to: "/channel/2", label: "Listen to ilikeRadio on LeonXM →" },
  },
  {
    id: "leonxm-summer-update",
    title: "LeonXM Summer Update: Smarter Navigation, Local Time, and Regional Streaming",
    date: "July 4, 2026",
    summary: "We've rolled out a handful of updates to make LeonXM easier to use — from dynamic back buttons and a local-time header to clearer regional access for ilikeRadio and Swarm Radio.",
    image: summerUpdateThumb.url,
    content: `We're always tuning the LeonXM experience. This week we've shipped a few quality-of-life improvements across the site.

First, the header has changed. Instead of labeling the current theme mode, it now shows your local time and timezone, kept up to date alongside a day or night emoji so you can still tell whether LeonXM is in daylight or after-hours mode.

Navigation is smarter too. The About page now shows a back button that remembers where you came from, so if you arrived from the News page it says "Back to News" — and if you landed there directly, it falls back to "Back to Home".

On the News page, every article now has a default cover image, so stories always look polished even when no custom image is set.

We've also made the homepage cleaner: the "Browse all channels" button has been removed, and the main "Start listening" button now takes you straight to the full channel directory.

Finally, ilikeRadio and Swarm Radio are now only reachable from the United Kingdom and Sweden. This isn't a licensing decision — our AzuraCast server that hosts those streams is geolocked to those two countries, so requests from elsewhere can't connect. If you try to open those channels from outside the UK or Sweden, you'll see a clear popup and be redirected back home.`,
    link: { to: "/channels", label: "Explore all channels →" },
  },
];

export const sortedArticles = [...articles].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
);
