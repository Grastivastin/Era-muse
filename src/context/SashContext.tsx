import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

type Ctx = {
  sessionId: string;
  selectedEra: string | null;
  setSelectedEra: (era: string) => Promise<void>;
};

const SashCtx = createContext<Ctx | null>(null);

function getOrCreateSessionId(): string {
  const KEY = "sash-session-id";
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(KEY, id);
  }
  return id;
}

export function SashProvider({ children }: { children: ReactNode }) {
  const [sessionId] = useState(() => getOrCreateSessionId());
  const [selectedEra, setSelectedEraState] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      // upsert session row
      await supabase.from("sessions").upsert({ id: sessionId }, { onConflict: "id" });
      const { data } = await supabase.from("sessions").select("selected_era").eq("id", sessionId).maybeSingle();
      if (data?.selected_era) setSelectedEraState(data.selected_era);
    })();
  }, [sessionId]);

  const setSelectedEra = async (era: string) => {
    setSelectedEraState(era);
    await supabase.from("sessions").update({ selected_era: era, updated_at: new Date().toISOString() }).eq("id", sessionId);
  };

  return <SashCtx.Provider value={{ sessionId, selectedEra, setSelectedEra }}>{children}</SashCtx.Provider>;
}

export function useSash() {
  const ctx = useContext(SashCtx);
  if (!ctx) throw new Error("useSash must be used inside SashProvider");
  return ctx;
}