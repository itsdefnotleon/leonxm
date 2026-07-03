import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Calendar, Radio } from "lucide-react";
import { Link } from "react-router-dom";
import defaultArticleImage from "@/assets/leonxm-default-article.webp.asset.json";

type Article = {
  id: string;
  title: string;
  date: string;
  summary: string;
  content: string;
  image?: string;
};

const articles: Article[] = [
  {
    id: "ilikeradio-maintenance",
    title: "ilikeRadio Website Down for Maintenance This Saturday — LeonXM Stays Live",
    date: "April 10, 2026",
    summary: "ilikeRadio's website will be undergoing scheduled maintenance this Saturday, but don't worry — LeonXM will continue broadcasting without interruption.",
    content: `This Saturday, ilikeRadio's standalone website will be going offline temporarily for scheduled maintenance. During this downtime, listeners who rely on the ilikeRadio website directly will be unable to access the stream.

However, if you're listening through LeonXM, you won't notice a thing. LeonXM's infrastructure operates independently, meaning all of our channels — including ilikeRadio — will continue to broadcast without any interruption.

This is one of the key advantages of the LeonXM platform. Our streams are hosted on robust, independent infrastructure that ensures 24/7 availability regardless of what happens with individual station websites.

So if you're a fan of ilikeRadio and want uninterrupted access to Bristol's best music this weekend, just keep it locked to LeonXM. We'll be here, as always — free, online, and live.`,
  },
];

export default function News() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight mb-2">News</h1>
          <p className="text-muted-foreground">The latest from LeonXM</p>
        </div>

        <div className="space-y-10">
          {articles.map((article) => (
            <article key={article.id} className="border border-border rounded-2xl p-8 bg-card">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
                <Calendar className="w-4 h-4" />
                <time>{article.date}</time>
              </div>
              <h2 className="text-2xl font-bold mb-4 text-foreground">{article.title}</h2>
              <div className="prose prose-invert max-w-none">
                {article.content.split("\n\n").map((paragraph, i) => (
                  <p key={i} className="text-muted-foreground mb-4 leading-relaxed">{paragraph}</p>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-border flex items-center gap-2 text-primary text-sm">
                <Radio className="w-4 h-4" />
                <Link to="/channel/2" className="hover:underline font-medium">Listen to ilikeRadio on LeonXM →</Link>
              </div>
            </article>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
