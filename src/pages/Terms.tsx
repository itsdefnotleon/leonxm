import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { PolicyContent } from "@/components/PolicyContent";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Terms of Service — LeonXM"
        description="The terms under which you can use LeonXM, our free online radio streaming network."
        path="/terms"
      />
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
        <PolicyContent policy="terms" />
      </main>
      <Footer />
    </div>
  );
}
