import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground mb-10">Last updated: April 11, 2026</p>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">1. Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">LeonXM ("we", "our", "us") is committed to protecting your privacy. This Privacy Policy explains how we handle information when you use our free radio streaming service.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">2. Information We Collect</h2>
            <p className="text-muted-foreground leading-relaxed">LeonXM does not require you to create an account or provide any personal information. We do not collect names, email addresses, or payment details. Basic technical data such as IP addresses and browser type may be processed by our hosting providers to deliver the Service.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">3. Cookies</h2>
            <p className="text-muted-foreground leading-relaxed">LeonXM does not use tracking cookies or third-party advertising cookies. Essential cookies may be used solely to ensure the Service functions correctly, such as remembering your volume preference.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">4. Third-Party Services</h2>
            <p className="text-muted-foreground leading-relaxed">Our audio streams are delivered through third-party infrastructure providers. These providers may process limited technical data (such as IP addresses) to deliver content. We do not share any personal information with third parties for marketing purposes.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">5. Data Retention</h2>
            <p className="text-muted-foreground leading-relaxed">Since we do not collect personal data, there is no personal data retained. Server logs maintained by our hosting providers are automatically deleted in accordance with their own retention policies.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">6. Children's Privacy</h2>
            <p className="text-muted-foreground leading-relaxed">LeonXM is a general-audience service. We do not knowingly collect information from children under 13. If you believe a child has provided us with personal data, please contact us so we can take appropriate action.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">7. Changes to This Policy</h2>
            <p className="text-muted-foreground leading-relaxed">We may update this Privacy Policy from time to time. Any changes will be reflected on this page with an updated revision date. Continued use of the Service constitutes acceptance of the revised policy.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">8. Contact</h2>
            <p className="text-muted-foreground leading-relaxed">If you have any questions about this Privacy Policy, please reach out to us through the LeonXM website.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
