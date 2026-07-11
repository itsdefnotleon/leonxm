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
