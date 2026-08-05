import { useLocation, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { CheckCircle2, ArrowLeft, Radio } from "lucide-react";

type Field = {
  key: string;
  label: string;
};

const fields: Field[] = [
  { key: "overall", label: "How would you rate your overall experience with LeonXM?" },
  { key: "favouriteChannel", label: "Which channel do you listen to the most?" },
  { key: "audioQuality", label: "How is the audio quality when you stream?" },
  { key: "design", label: "What do you think of the website design?" },
  { key: "discovery", label: "How did you find out about LeonXM?" },
  { key: "recommend", label: "Would you recommend LeonXM to someone else?" },
  { key: "improvements", label: "What could we do better? Anything you'd like to see on LeonXM?" },
  { key: "contact", label: "Want a reply? Leave your Discord username or email (optional)" },
];

const SurveyConfirmation = () => {
  const location = useLocation();
  const answers = (location.state as { answers?: Record<string, string> } | null)?.answers;
  const hasSummary = answers && Object.keys(answers).length > 0;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO
        title="Thank You — LeonXM Listener Survey"
        description="Thanks for sharing your thoughts on LeonXM. Your feedback helps us make the service better."
        path="/survey/thanks"
      />
      <Header />

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-14">
        <Link
          to="/news"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to News</span>
        </Link>

        <div className="text-center mb-10">
          <CheckCircle2 className="w-14 h-14 text-primary mx-auto mb-6" />
          <h1 className="text-3xl sm:text-4xl font-black text-foreground mb-4">Thank you!</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Your answers have been sent straight to the LeonXM team. We read every single response.
          </p>
        </div>

        {hasSummary ? (
          <div className="rounded-2xl border border-border bg-card/40 backdrop-blur p-6 mb-10">
            <h2 className="text-lg font-bold text-foreground mb-4">Your response summary</h2>
            <dl className="space-y-4">
              {fields
                .filter((f) => answers[f.key])
                .map((f) => (
                  <div key={f.key} className="flex flex-col sm:flex-row sm:justify-between gap-1">
                    <dt className="text-muted-foreground text-sm max-w-[60%]">{f.label}</dt>
                    <dd className="text-foreground font-medium text-sm sm:text-right">{answers[f.key]}</dd>
                  </div>
                ))}
            </dl>
          </div>
        ) : null}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/channels"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
          >
            <Radio className="w-4 h-4" />
            Back to the channels
          </Link>
          <Link
            to="/survey"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border font-semibold hover:border-foreground/40 transition-colors"
          >
            Submit another response
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SurveyConfirmation;
