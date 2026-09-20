import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, Send, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, displayNameOf } from "@/hooks/use-auth";
import { toast } from "sonner";

interface ChatMessage {
  id: string;
  station_id: number;
  user_id: string;
  display_name: string;
  content: string;
  created_at: string;
}

interface Props {
  stationId: number;
  stationName: string;
}

export function StationChat({ stationId, stationName }: Props) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    supabase
      .from("chat_messages")
      .select("*")
      .eq("station_id", stationId)
      .order("created_at", { ascending: false })
      .limit(100)
      .then(({ data }) => {
        if (!cancelled && data) setMessages((data as ChatMessage[]).slice().reverse());
      });

    const channel = supabase
      .channel(`station-chat-${stationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `station_id=eq.${stationId}`,
        },
        (payload) => {
          const msg = payload.new as ChatMessage;
          setMessages((prev) => (prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]));
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "chat_messages",
          filter: `station_id=eq.${stationId}`,
        },
        (payload) => {
          const old = payload.old as { id: string };
          setMessages((prev) => prev.filter((m) => m.id !== old.id));
        }
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [stationId]);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    const content = text.trim();
    if (!content || !user || sending) return;
    setSending(true);
    const { error } = await supabase.from("chat_messages").insert({
      station_id: stationId,
      user_id: user.id,
      display_name: displayNameOf(user),
      content: content.slice(0, 500),
    });
    if (error) toast.error("Message could not be sent.");
    else setText("");
    setSending(false);
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("chat_messages").delete().eq("id", id);
    if (error) toast.error("Could not delete that message.");
  };

  return (
    <div className="rounded-2xl border border-border bg-card/60 backdrop-blur p-6 sm:p-8">
      <div className="flex items-center gap-2 mb-5">
        <MessageCircle className="w-4 h-4 text-primary" />
        <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary">
          Live Chat · {stationName}
        </h2>
      </div>

      <div
        ref={listRef}
        className="h-80 overflow-y-auto pr-2 space-y-3 rounded-xl bg-background/40 p-4"
      >
        {messages.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No messages yet — be the first to say hello.
          </p>
        )}
        {messages.map((m) => (
          <div key={m.id} className="group flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-primary">
                {m.display_name}
                <span className="ml-2 font-normal text-muted-foreground">
                  {new Date(m.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </p>
              <p className="text-sm text-foreground break-words">{m.content}</p>
            </div>
            {user?.id === m.user_id && (
              <button
                onClick={() => remove(m.id)}
                aria-label="Delete message"
                className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}
      </div>

      {user ? (
        <form onSubmit={send} className="mt-4 flex items-center gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={500}
            placeholder={`Ask ${stationName} a question…`}
            className="flex-1 rounded-full border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
          />
          <button
            type="submit"
            disabled={sending || !text.trim()}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            Send
          </button>
        </form>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">
          <Link to="/auth" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>{" "}
          to join the conversation.
        </p>
      )}
    </div>
  );
}
