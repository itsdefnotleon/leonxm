import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, Send, Trash2, Pin, PinOff, MicOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, displayNameOf } from "@/hooks/use-auth";
import { useModerator } from "@/hooks/use-moderator";
import { toast } from "sonner";

interface ChatMessage {
  id: string;
  station_id: number;
  user_id: string;
  display_name: string;
  content: string;
  created_at: string;
  pinned?: boolean;
}

interface Props {
  stationId: number;
  stationName: string;
}

const MUTE_MINUTES = 15;

export function StationChat({ stationId, stationName }: Props) {
  const { user } = useAuth();
  const isModerator = useModerator();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [mutedUntil, setMutedUntil] = useState<string | null>(null);
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
          event: "UPDATE",
          schema: "public",
          table: "chat_messages",
          filter: `station_id=eq.${stationId}`,
        },
        (payload) => {
          const msg = payload.new as ChatMessage;
          setMessages((prev) => prev.map((m) => (m.id === msg.id ? { ...m, ...msg } : m)));
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

  // Am I currently muted on this station?
  useEffect(() => {
    let cancelled = false;
    if (!user) {
      setMutedUntil(null);
      return;
    }
    supabase
      .from("chat_mutes")
      .select("muted_until")
      .eq("station_id", stationId)
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled) return;
        const until = data?.muted_until as string | undefined;
        setMutedUntil(until && new Date(until) > new Date() ? until : null);
      });
    return () => {
      cancelled = true;
    };
  }, [user, stationId, messages.length]);

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
    if (error)
      toast.error(
        mutedUntil ? "You're muted on this station right now." : "Message could not be sent."
      );
    else setText("");
    setSending(false);
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("chat_messages").delete().eq("id", id);
    if (error) toast.error("Could not delete that message.");
  };

  const togglePin = async (m: ChatMessage) => {
    const next = !m.pinned;
    const { error } = await supabase
      .from("chat_messages")
      .update({ pinned: next, pinned_at: next ? new Date().toISOString() : null })
      .eq("id", m.id);
    if (error) toast.error("Could not update that message.");
    else {
      setMessages((prev) => prev.map((x) => (x.id === m.id ? { ...x, pinned: next } : x)));
      toast.success(next ? "Message pinned." : "Message unpinned.");
    }
  };

  const mute = async (m: ChatMessage) => {
    if (!user) return;
    const until = new Date(Date.now() + MUTE_MINUTES * 60_000).toISOString();
    const { error } = await supabase.from("chat_mutes").upsert(
      { station_id: stationId, user_id: m.user_id, muted_until: until, created_by: user.id },
      { onConflict: "station_id,user_id" }
    );
    if (error) toast.error("Could not mute that listener.");
    else toast.success(`${m.display_name} is muted for ${MUTE_MINUTES} minutes.`);
  };

  const pinned = messages.filter((m) => m.pinned);

  const renderModTools = (m: ChatMessage) => (
    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
      {isModerator && (
        <>
          <button
            onClick={() => togglePin(m)}
            aria-label={m.pinned ? "Unpin message" : "Pin message"}
            className="text-muted-foreground hover:text-primary"
          >
            {m.pinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
          </button>
          {m.user_id !== user?.id && (
            <button
              onClick={() => mute(m)}
              aria-label="Mute listener"
              className="text-muted-foreground hover:text-destructive"
            >
              <MicOff className="w-3.5 h-3.5" />
            </button>
          )}
        </>
      )}
      {(isModerator || user?.id === m.user_id) && (
        <button
          onClick={() => remove(m.id)}
          aria-label="Delete message"
          className="text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );

  return (
    <div className="rounded-2xl border border-border bg-card/60 backdrop-blur p-6 sm:p-8">
      <div className="flex items-center gap-2 mb-5">
        <MessageCircle className="w-4 h-4 text-primary" />
        <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary">
          Live Chat · {stationName}
        </h2>
        {isModerator && (
          <span className="ml-auto rounded-full border border-primary/40 bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
            Moderator
          </span>
        )}
      </div>

      {pinned.length > 0 && (
        <div className="mb-4 space-y-2 rounded-xl border border-primary/30 bg-primary/5 p-4">
          {pinned.map((m) => (
            <div key={`pin-${m.id}`} className="group flex items-start gap-3">
              <Pin className="mt-0.5 w-3.5 h-3.5 shrink-0 text-primary" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-primary">{m.display_name}</p>
                <p className="text-sm text-foreground break-words">{m.content}</p>
              </div>
              {renderModTools(m)}
            </div>
          ))}
        </div>
      )}

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
                {m.pinned && (
                  <span className="ml-2 inline-flex items-center gap-1 font-normal text-muted-foreground">
                    <Pin className="w-3 h-3" /> pinned
                  </span>
                )}
              </p>
              <p className="text-sm text-foreground break-words">{m.content}</p>
            </div>
            {renderModTools(m)}
          </div>
        ))}
      </div>

      {user ? (
        mutedUntil ? (
          <p className="mt-4 text-sm text-muted-foreground">
            You're muted on this station until{" "}
            {new Date(mutedUntil).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}.
          </p>
        ) : (
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
        )
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
