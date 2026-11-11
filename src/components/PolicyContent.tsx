import { POLICY_DATE, privacySections, termsSections } from "@/lib/legal-policies";

export function PolicyContent({ policy }: { policy: "privacy" | "terms" }) {
  const sections = policy === "privacy" ? privacySections : termsSections;
  return (
    <>
      <p className="text-muted-foreground mb-8">Last updated: {POLICY_DATE}</p>
      <div className="space-y-8">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="text-xl font-semibold mb-3 text-foreground">{section.title}</h2>
            <p className="text-muted-foreground leading-relaxed">{section.text}</p>
          </section>
        ))}
      </div>
    </>
  );
}