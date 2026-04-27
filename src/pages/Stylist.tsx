import Layout from "@/components/sash/Layout";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSash } from "@/context/SashContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

type Msg = { role: "user" | "assistant"; content: string };

export default function Stylist() {
  const { sessionId } = useSash();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.from("sage_messages").select("role,content").eq("session_id", sessionId).order("created_at")
      .then(({ data }) => setMessages((data ?? []) as Msg[]));
  }, [sessionId]);

  useEffect(() => { scrollRef.current?.scrollTo({ top: 999999, behavior: "smooth" }); }, [messages]);

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
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
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
    <Layout>
      <section className="container py-12 max-w-3xl">
        <div className="text-center space-y-2 mb-8">
          <p className="font-script text-3xl text-rose-dust">your stylist</p>
          <h1 className="font-display text-5xl text-ink">Sage</h1>
          <p className="font-serif italic text-ink-soft">Tell her the mood. She'll find you the dress.</p>
        </div>

        <div ref={scrollRef} className="bg-cream/60 rounded-3xl p-6 h-[55vh] overflow-y-auto space-y-4 border border-border">
          {messages.length === 0 && (
            <p className="font-serif italic text-ink-soft text-center mt-20">try: "I have a first date in a candlelit wine bar. I want to look like I wrote a book about him already."</p>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`max-w-[85%] p-4 rounded-2xl ${m.role === "user" ? "ml-auto bg-blush text-ink" : "bg-paper border border-border text-ink font-serif italic whitespace-pre-wrap"}`}>
              {m.content || (m.role === "assistant" && loading ? <span className="animate-shimmer">…</span> : "")}
            </div>
          ))}
        </div>

        <form onSubmit={(e) => { e.preventDefault(); send(); }} className="flex gap-2 mt-4">
          <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="darling, tell me everything…" className="rounded-full bg-paper" />
          <Button type="submit" disabled={loading} className="rounded-full px-8">Send</Button>
        </form>
      </section>
    </Layout>
  );
}