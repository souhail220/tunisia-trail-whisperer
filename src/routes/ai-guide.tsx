import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MobileShell } from "@/components/MobileShell";
import { Bot, Send, AlertTriangle, MapPin, Heart, CloudRain, Phone, Mic } from "lucide-react";

export const Route = createFileRoute("/ai-guide")({
  head: () => ({ meta: [{ title: "AI Guide — TrailMate" }, { name: "description", content: "Offline AI hiking companion and emergency assistant." }] }),
  component: AIGuide,
});

const seedMessages = [
  { role: "ai", text: "Hi! I'm your offline TrailMate guide. Ask me about trails, gear, weather, or use Emergency mode if you need urgent help." },
];

function AIGuide() {
  const [emergency, setEmergency] = useState(false);
  const [messages, setMessages] = useState(seedMessages);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages(m => [...m, { role: "user", text }, { role: "ai", text: cannedReply(text, emergency) }]);
    setInput("");
  };

  const startListening = () => {
    if (listening) return;
    setListening(true);
    setTimeout(() => {
      setListening(false);
      setInput("How long to the summit?");
    }, 1600);
  };

  return (
    <MobileShell>
      <div className="flex flex-col h-[calc(100vh-6rem)]">
        {emergency && (
          <div className="bg-danger text-danger-foreground px-5 py-3 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-bold">Emergency mode active</p>
              <p className="text-[11px] opacity-90 flex items-center gap-1"><MapPin className="h-3 w-3" /> 36.4029° N, 10.1358° E · last GPS</p>
            </div>
            <button onClick={() => setEmergency(false)} className="text-xs font-semibold underline">Exit</button>
          </div>
        )}

        <div className="px-5 pt-6 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="font-bold">AI Guide</h1>
              <p className="text-[11px] text-success font-medium">● Offline ready</p>
            </div>
          </div>
          <button onClick={() => setEmergency(e=>!e)} className={`text-xs font-bold px-3 py-2 rounded-xl ${emergency ? "bg-card text-foreground" : "bg-danger/10 text-danger"}`}>
            {emergency ? "Calm mode" : "Emergency"}
          </button>
        </div>

        <div className="px-5 flex gap-2 overflow-x-auto no-scrollbar pb-3">
          {[
            { i: MapPin, t: "I'm lost" },
            { i: Heart, t: "Injury" },
            { i: CloudRain, t: "Weather alert" },
            { i: Phone, t: "Call for help" },
          ].map(({ i: I, t }) => (
            <button key={t} onClick={() => send(t)} className="flex items-center gap-1.5 bg-card border border-border rounded-full px-3 py-2 text-xs font-semibold whitespace-nowrap">
              <I className="h-3.5 w-3.5 text-danger" /> {t}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-5 space-y-3 pb-3">
          {messages.map((m,i) => (
            <div key={i} className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${m.role==="ai" ? "bg-card text-foreground" : "bg-primary text-primary-foreground ml-auto"}`}>
              {m.text}
            </div>
          ))}
        </div>

        <div className="px-5 py-3 border-t border-border bg-background">
          <div className="flex items-center gap-2 bg-card rounded-2xl px-4 py-2">
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send(input)} placeholder={listening ? "Listening…" : "Ask anything…"} className="flex-1 bg-transparent outline-none text-sm" />
            <button onClick={startListening} className={`h-8 w-8 rounded-xl flex items-center justify-center text-primary ${listening ? "animate-pulse bg-primary/10" : ""}`} aria-label="Voice"><Mic className="h-4 w-4" /></button>
            <button onClick={()=>send(input)} className="h-8 w-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center" aria-label="Send"><Send className="h-4 w-4" /></button>
          </div>
        </div>
      </div>
    </MobileShell>
  );
}

function cannedReply(text: string, emergency: boolean) {
  const t = text.toLowerCase();
  if (emergency || t.includes("lost")) return "Stay calm. 1) Stop moving. 2) Mark your position. 3) Listen for sounds. Your last GPS is saved — I'll guide you back step by step.";
  if (t.includes("injury")) return "Apply pressure to bleeding wounds. Stay seated, hydrate. Sending your GPS to nearest rescue station: Garde Nationale Zaghouan (28 km).";
  if (t.includes("weather")) return "Cached forecast: Thunderstorm risk in 2h. Descend below tree line and avoid ridges.";
  if (t.includes("call")) return "Initiating SOS beacon. Emergency contact: 197 (Tunisia Civil Protection). Your coordinates are being shared.";
  return "Based on cached trail data: that route is moderate, ~3h, with shaded sections. Bring 2L of water. Best started before 9am in summer.";
}
