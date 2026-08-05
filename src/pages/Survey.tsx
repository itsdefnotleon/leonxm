import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";

type Field = {
  key: string;
  label: string;
  options?: string[];
  textarea?: boolean;
  optional?: boolean;
  placeholder?: string;
};

const fields: Field[] = [
  { key: "overall", label: "How would you rate your overall experience with LeonXM?", options: ["Excellent", "Good", "Okay", "Poor"] },
  { key: "favouriteChannel", label: "Which channel do you listen to the most?", options: ["TruckHits Radio", "ilikeRadio", "Swarm Radio", "I listen to all of them", "None yet"] },
  { key: "audioQuality", label: "How is the audio quality when you stream?", options: ["Great", "Fine", "Sometimes buffers", "Often unusable"] },
  { key: "design", label: "What do you think of the website design?", options: ["Love it", "It's good", "It's fine", "Needs work"] },
  { key: "discovery", label: "How did you find out about LeonXM?", options: ["Discord", "A friend", "Social media", "Search engine", "Other"] },
  { key: "recommend", label: "Would you recommend LeonXM to someone else?", options: ["Definitely", "Probably", "Not sure", "No"] },
  { key: "improvements", label: "What could we do better? Anything you'd like to see on LeonXM?", textarea: true, optional: true, placeholder: "Tell us anything — new stations, features, bugs..." },
  { key: "contact", label: "Want a reply? Leave your Discord username or email (optional)", optional: true, placeholder: "yourname#0000 or you@example.com" },
];

const Survey = () => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const set = (key: string, value: string) => setAnswers((a) => ({ ...a, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const missing = fields.filter((f) => !f.optional && !answers[f.key]);
    if (missing.length) {
      toast.error("Please answer all of the required questions.");
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke("submit-survey", {
        body: {
          overall: answers.overall,
          favouriteChannel: answers.favouriteChannel,
          audioQuality: answers.audioQuality,
          design: answers.design,
          discovery: answers.discovery,
          recommend: answers.recommend,
          improvements: (answers.improvements || "").slice(0, 2000),
          contact: (answers.contact || "").slice(0, 200),
        },
      });
      if (error) throw error;
      setDone(true);
    } catch (err) {
      console.error("survey submit failed", err);
      toast.error("Something went wrong sending your answers. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO
        title="LeonXM Listener Survey — Tell Us What You Think"
        description="Share your thoughts on LeonXM: our channels, audio quality, design and what you'd like to see next. It takes under two minutes."
        path="/survey"
      />
      <Header />

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-14">
        <Link to="/news" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to News</span>
        </Link>

        {done ? (
          <div className="text-center py-16">
            <CheckCircle2 className="w-14 h-14 text-primary mx-auto mb-6" />
            <h1 className="text-3xl font-black text-foreground mb-4">Thank you!</h1>
            <p className="text-muted-foreground mb-8">
              Your answers have been sent straight to the LeonXM team. We read every single response.
            </p>
            <Link
              to="/channels"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
            >
              Back to the channels
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-4xl sm:text-5xl font-black text-foreground tracking-tight mb-4">
              LeonXM Listener Survey
            </h1>
            <p className="text-muted-foreground mb-10 leading-relaxed">
              We want to know how LeonXM is doing — what you love, what annoys you, and what you'd like next.
              It takes under two minutes and it's completely anonymous unless you choose to leave your contact.
            </p>

            <form onSubmit={handleSubmit} className="space-y-8">
              {fields.map((f) => (
                <div key={f.key} className="rounded-2xl border border-border bg-card/40 backdrop-blur p-5">
                  <label className="block text-foreground font-semibold mb-4">
                    {f.label}
                    {f.optional && <span className="text-muted-foreground font-normal text-sm"> (optional)</span>}
                  </label>

                  {f.options ? (
                    <div className="flex flex-wrap gap-2">
                      {f.options.map((opt) => {
                        const active = answers[f.key] === opt;
                        return (
                          <button
                            type="button"
                            key={opt}
                            onClick={() => set(f.key, opt)}
                            className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                              active
                                ? "bg-primary text-primary-foreground border-primary"
                                : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/40"
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  ) : f.textarea ? (
                    <textarea
                      value={answers[f.key] || ""}
                      onChange={(e) => set(f.key, e.target.value)}
                      maxLength={2000}
                      rows={5}
                      placeholder={f.placeholder}
                      className="w-full rounded-xl bg-background border border-border p-3 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  ) : (
                    <input
                      value={answers[f.key] || ""}
                      onChange={(e) => set(f.key, e.target.value)}
                      maxLength={200}
                      placeholder={f.placeholder}
                      className="w-full rounded-xl bg-background border border-border p-3 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  )}
                </div>
              ))}

              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-primary text-primary-foreground font-bold hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {submitting ? "Sending..." : "Submit my answers"}
              </button>
            </form>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Survey;
