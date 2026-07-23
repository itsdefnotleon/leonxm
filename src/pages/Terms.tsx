import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";

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
        <h1 className="text-4xl font-bold tracking-tight mb-2">Terms of Service</h1>
        <p className="text-muted-foreground mb-10">Last updated: April 10, 2026</p>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed">By accessing and using LeonXM ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">2. Description of Service</h2>
            <p className="text-muted-foreground leading-relaxed">LeonXM is a free, online-only radio platform that provides streaming audio content across multiple channels. The Service is provided at no cost to listeners and requires no account or subscription.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">3. Use of the Service</h2>
            <p className="text-muted-foreground leading-relaxed">You agree to use LeonXM only for lawful purposes. You may not attempt to disrupt, interfere with, or gain unauthorised access to any part of the Service, its servers, or any connected networks.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">4. Intellectual Property</h2>
            <p className="text-muted-foreground leading-relaxed">All content broadcast on LeonXM, including music, branding, and graphics, is the property of their respective owners. The LeonXM name, logo, and original content are the property of LeonXM. You may not reproduce, distribute, or create derivative works without prior written permission.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">5. Availability</h2>
            <p className="text-muted-foreground leading-relaxed">We strive to keep LeonXM available 24/7, but we do not guarantee uninterrupted access. The Service may be temporarily unavailable due to maintenance, updates, or circumstances beyond our control.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">6. Disclaimer of Warranties</h2>
            <p className="text-muted-foreground leading-relaxed">LeonXM is provided "as is" and "as available" without warranties of any kind, either express or implied. We do not warrant that the Service will be error-free or that any defects will be corrected.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">7. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">To the fullest extent permitted by law, LeonXM and its operators shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Service.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">8. Changes to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">We reserve the right to modify these Terms of Service at any time. Continued use of the Service after changes constitutes acceptance of the updated terms.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">9. Contact</h2>
            <p className="text-muted-foreground leading-relaxed">If you have any questions about these Terms of Service, please reach out to us through the LeonXM website.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
