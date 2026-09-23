import { useState } from "react";
import { Sparkles, Send, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Props {
  station: {
    name: string;
    tagline?: string;
    description?: string;
    genre?: string;
    location?: string;
  };
  nowPlaying?: { title?: string; artist?: string } | null;
  recent?: { title?: string; artist?: string }[];
  stations?: { name: string; genre?: string; tagline?: string }[];
}

const SUGGESTIONS = [
  "What kind of music is on right now?",
  "When is this station on air?",
  "Which other station should I try?",
];

export function StationAssistant({ station, nowPlaying, recent, stations }: Props) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [asked, setAsked] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const ask = async (q: string) => {
    const text = q.trim();
    if (!text || loading) return;
    setLoading(true);
    setAnswer(null);
    setAsked(text);

    const { data, error } = await supabase.functions.invoke("station-assistant", {
      body: { question: text, station: { ...station, nowPlaying, recent }, stations },
    });

    setLoading(false);

    if (error || !data?.answer) {
      const message =
        (data as { error?: string } | null)?.error ??
        "The assistant couldn't answer right now. Please try again shortly.";
      toast.error(message);
      setAsked(null);
      return;
    }

    setAnswer(data.answer as string);
    setQuestion("");
  };

  return (
    <div className="rounded-2xl border border-border bg-card/60 backdrop-blur p-6 sm:p-8">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-4 h-4 text-primary" />
        <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary">
          Ask about {station.name}
        </h2>
      </div>
      <p className="text-sm text-muted-foreground mb-5">
        Questions about the station, what's on air or what to listen to next — get an instant answer.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(question);
        }}
        className="flex items-center gap-2"
      >
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          maxLength={500}
          placeholder="Ask anything about this station…"
          className="flex-1 rounded-full border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
        />
        <button
          type="submit"
          disabled={loading || !question.trim()}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          Ask
        </button>
      </form>

      <div className="mt-3 flex flex-wrap gap-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => ask(s)}
            disabled={loading}
            className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors disabled:opacity-50"
          >
            {s}
          </button>
        ))}
      </div>

      {(loading || answer) && (
        <div className="mt-5 rounded-xl bg-background/40 p-4">
          {asked && <p className="text-xs font-bold text-primary mb-2">{asked}</p>}
          {loading ? (
            <p className="text-sm text-muted-foreground">Thinking…</p>
          ) : (
            <p className="text-sm text-foreground whitespace-pre-line leading-relaxed">{answer}</p>
          )}
        </div>
      )}
    </div>
  );
}
