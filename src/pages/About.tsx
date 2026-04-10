import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";
import { ArrowLeft, Radio, Shield, Heart, Users } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-3xl mx-auto px-4 py-16">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to Channels</span>
        </Link>

        <h1 className="text-4xl sm:text-5xl font-black text-foreground tracking-tight mb-8">
          About LeonXM
        </h1>

        <div className="space-y-8 text-muted-foreground leading-relaxed">
          <p className="text-lg text-foreground/80">
            LeonXM is a <span className="text-primary font-semibold">free, online-only radio platform</span> bringing 
            you curated music channels with zero subscriptions, zero paywalls, and zero BS.
          </p>

          <div className="border border-border rounded-xl p-6 bg-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Radio className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-foreground">What is LeonXM?</h2>
            </div>
            <p>
              LeonXM is a collection of internet radio stations, each with its own unique identity and community. 
              From hit music for Euro Truck Simulator 2 players to local Bristol radio and AI-inspired experimental 
              stations — we bring together diverse audio experiences under one roof, completely free.
            </p>
          </div>

          <div className="border border-border rounded-xl p-6 bg-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Why LeonXM Exists</h2>
            </div>
            <p className="mb-4">
              LeonXM was created as a direct alternative to BlazeXM. While BlazeXM may have had a similar concept, 
              it's owned and operated by someone who has proven themselves to be unprofessional and dishonest — 
              someone the community simply can't trust or rely on.
            </p>
            <p>
              LeonXM is different. We believe that if you're going to run a platform, you should do it with 
              <span className="text-foreground font-medium"> integrity, transparency, and respect</span> for 
              your listeners. No lies, no drama — just good radio.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="border border-border rounded-xl p-6 bg-card">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Heart className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground">100% Free</h3>
              </div>
              <p className="text-sm">
                No subscriptions, no trials, no hidden fees. Every channel is free to listen to, forever.
              </p>
            </div>

            <div className="border border-border rounded-xl p-6 bg-card">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Community First</h3>
              </div>
              <p className="text-sm">
                Built by listeners, for listeners. We grow with our community and always put honesty first.
              </p>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground pt-4 border-t border-border">
            LeonXM — Real radio, run by real people, with real integrity.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default About;
