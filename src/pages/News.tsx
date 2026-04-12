import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Calendar, Radio } from "lucide-react";
import { Link } from "react-router-dom";
import blazeProof from "@/assets/blazexm-proof.webp";

const articles = [
  {
    id: "blazexm-exposed",
    title: "BlazeXM Exposed: Stolen Branding, Fake Permissions, and Endless Drama",
    date: "April 12, 2026",
    summary: "A deep dive into BlazeXM's pattern of stolen branding, fabricated claims of permission from SiriusXM and iHeart, and the toxic behavior of its owner.",
    content: `If you've spent any time in the online radio community, you've probably heard of BlazeXM. And if you have, you probably already know what a mess it is. But for those who don't — buckle up, because this one's a ride.

BlazeXM is a knockoff internet radio service that has built its entire identity by ripping off SiriusXM's branding. The name, the styling, the look and feel — it's all lifted directly from one of the biggest names in radio. And when called out on it, the owner — who goes by "Blaze" — has repeatedly claimed that SiriusXM gave them permission to use their branding.

Spoiler: they didn't.

When pressed for proof of this supposed permission, Blaze's response was telling. In a Discord conversation, after being asked directly for evidence, Blaze first said "Okay, Okay, No" — and then when pushed further, his excuse was: "Because ur not a blazeXM staff." That's not an answer. That's a deflection. If you had legitimate permission from a multi-billion dollar corporation, you'd be shouting it from the rooftops — not hiding behind a staff-only excuse that conveniently prevents anyone from ever verifying the claim.

But it doesn't stop at SiriusXM. Blaze has also been caught stealing Y100's branding from iHeart Radio, once again claiming he had permission to do so. And once again, he didn't. Community members have pointed out that Blaze has also claimed to "know the bosses at iHeart & Audacy Radio Group" — a laughable claim that nobody has been able to verify, because it's almost certainly fabricated.

The pattern is clear: make a bold claim, refuse to back it up, and then deflect or attack anyone who questions it. It's textbook dishonesty.

And then there's the drama. Blaze is notorious in the community for constantly picking fights, stirring up conflicts, and dragging other creators into pointless beef. Instead of focusing on building a quality product, Blaze spends his time starting arguments, being antagonistic, and creating a toxic atmosphere wherever he goes. It's exhausting for everyone involved, and it's driven away countless community members who just want to enjoy internet radio without the middle school drama.

The service itself reflects this lack of care. BlazeXM's streams are unreliable, the branding is entirely derivative, and there's zero originality to be found. It's a carbon copy pretending to be something it's not, run by someone who would rather fight than build.

At LeonXM, we took a different path. We built our platform from the ground up with original branding, reliable infrastructure, and quality stations that actually work. We don't steal other companies' identities. We don't fabricate permissions. And we definitely don't spend our time starting drama with other creators.

We're here to deliver great radio — free, reliable, and without the baggage. If you've been burned by BlazeXM's nonsense, welcome home. LeonXM is the real deal, and we're not going anywhere.`,
    hasProofImage: true,
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
