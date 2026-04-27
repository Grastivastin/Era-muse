import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSash } from "@/context/SashContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { MessageCircleHeart, X, Send, Sparkles } from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string };

export default function SageWidget() {
  const { sessionId } = useSash();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    supabase
      .from("sage_messages")
      .select("role,content")
      .eq("session_id", sessionId)
      .order("created_at")
      .then(({ data }) => setMessages((data ?? []) as Msg[]));
  }, [open, sessionId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 999999, behavior: "smooth" });
  }, [messages, open]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    await supabase.from("sage_messages").insert({ session_id: sessionId, role: "user", content: text });

    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/sage-chat`;
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: next, session_id: sessionId }),
      });
      if (resp.status === 429) { toast.error("Sage is overwhelmed by adoration. Try again in a moment."); setLoading(false); return; }
      if (resp.status === 402) { toast.error("AI credits ran out. Add funds in Lovable settings."); setLoading(false); return; }
      if (!resp.ok || !resp.body) throw new Error("stream failed");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let assistantText = "";
      let done = false;
      setMessages(m => [...m, { role: "assistant", content: "" }]);

      while (!done) {
        const { done: rd, value } = await reader.read();
        if (rd) break;
        buffer += decoder.decode(value, { stream: true });
        let idx;
        while ((idx = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, idx);
          buffer = buffer.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") { done = true; break; }
          try {
            const parsed = JSON.parse(json);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              assistantText += delta;
              setMessages(m => m.map((msg, i) => i === m.length - 1 ? { ...msg, content: assistantText } : msg));
            }
          } catch { buffer = line + "\n" + buffer; break; }
        }
      }
      await supabase.from("sage_messages").insert({ session_id: sessionId, role: "assistant", content: assistantText });
    } catch (e) {
      toast.error("Sage drifted off. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating launcher */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Chat with Sage, your stylist"
          className="fixed bottom-6 right-6 z-50 group flex items-center gap-2 rounded-full px-5 py-4 shadow-soft hover-lift"
          style={{
            background: "linear-gradient(135deg, hsl(var(--rose-dust)) 0%, hsl(var(--lavender)) 100%)",
          }}
        >
          <MessageCircleHeart className="h-5 w-5 text-paper" />
          <span className="font-script text-xl text-paper font-bold pr-1">ask Sage</span>
          <Sparkles className="h-3 w-3 text-paper animate-shimmer" />
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div
          className="fixed bottom-6 right-6 z-50 w-[92vw] max-w-md h-[70vh] max-h-[600px] rounded-3xl overflow-hidden shadow-soft border border-border flex flex-col bg-paper/95 backdrop-blur-md animate-petal-in"
        >
          {/* Header */}
          <div
            className="flex items-center justify-between p-4 border-b border-border"
            style={{ background: "linear-gradient(135deg, hsl(var(--blush)/0.6), hsl(var(--lavender)/0.4))" }}
          >
            <div>
              <p className="font-script text-2xl text-ink font-bold">Sage</p>
              <p className="text-[10px] uppercase tracking-[0.3em] text-ink-soft">your house stylist</p>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close Sage" className="p-2 rounded-full hover:bg-paper/60 transition">
              <X className="h-4 w-4 text-ink" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="text-center mt-12 space-y-3">
                <p className="font-script text-2xl text-rose-dust">hi darling</p>
                <p className="font-serif italic text-ink-soft text-sm px-4">
                  tell me the mood. the place. the boy. the song you keep replaying. i'll find you the dress.
                </p>
              </div>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                  m.role === "user"
                    ? "ml-auto bg-blush text-ink"
                    : "bg-cream border border-border text-ink font-serif italic whitespace-pre-wrap"
                }`}
              >
                {m.content || (m.role === "assistant" && loading ? <span className="animate-shimmer">…</span> : "")}
              </div>
            ))}
          </div>

          {/* Input */}
          <form onSubmit={(e) => { e.preventDefault(); send(); }} className="flex gap-2 p-3 border-t border-border bg-paper/80">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="tell me everything…"
              className="rounded-full bg-cream text-sm"
            />
            <Button type="submit" disabled={loading} size="icon" className="rounded-full shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
}
