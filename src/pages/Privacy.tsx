import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { PolicyContent } from "@/components/PolicyContent";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Privacy Policy — LeonXM"
        description="How leonXM handles chat accounts, public messages, browser storage, AI questions and moderation records."
        path="/privacy"
      />
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
        <PolicyContent policy="privacy" />
      </main>
      <Footer />
    </div>
  );
}
