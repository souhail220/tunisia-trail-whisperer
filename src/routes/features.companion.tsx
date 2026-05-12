import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FeatureShell } from "@/components/FeatureShell";
import { Bot, Send, Wifi, WifiOff } from "lucide-react";

export const Route = createFileRoute("/features/companion")({
  component: Companion,
});

const tips = [
  "Pace looks steady — keep your cadence around 90 steps/min.",
  "Sip 200ml water every 20 minutes in this heat.",
  "Wind picking up at ridge — secure loose layers.",
  "You drifted 30m off-trail to the east, correct left.",
];

function Companion() {
  const [online, setOnline] = useState(false);
  const [messages, setMessages] = useState<{r:"ai"|"user";t:string}[]>([
    { r:"ai", t:"I'm with you. I'll watch your pace, weather and trail position." },
  ]);
  const [input, setInput] = useState("");

  useEffect(()=>{
    const t = setInterval(()=>{
      setMessages(m=>[...m, { r:"ai", t: tips[Math.floor(Math.random()*tips.length)] }]);
    }, 12000);
    return ()=>clearInterval(t);
  },[]);

  const send = () => {
    if (!input.trim()) return;
    const q = input;
    setMessages(m=>[...m, {r:"user",t:q}]);
    setInput("");
    setTimeout(()=>{
      setMessages(m=>[...m, {r:"ai",t: reply(q)}]);
    }, 600);
  };

  return (
    <FeatureShell title="AI Hiking Companion" accent="Real-time pace & safety">
      <div className="px-5 space-y-3">
        <div className="bg-card rounded-2xl p-4 shadow-[var(--shadow-card)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-primary/10 flex items-center justify-center"><Bot className="h-5 w-5 text-primary" /></div>
            <div>
              <p className="font-bold text-sm">Companion active</p>
              <p className="text-[11px] text-muted-foreground">{online?"Synced with cloud":"Offline cache · syncs later"}</p>
            </div>
          </div>
          <button onClick={()=>setOnline(o=>!o)} className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center">{online?<Wifi className="h-4 w-4 text-success" />:<WifiOff className="h-4 w-4 text-muted-foreground" />}</button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[{l:"Pace",v:"4.8 km/h"},{l:"Elapsed",v:"1h 42"},{l:"Off-trail",v:"0m"}].map(s=>(
            <div key={s.l} className="bg-card rounded-2xl p-3 text-center shadow-[var(--shadow-card)]"><p className="text-sm font-bold text-primary">{s.v}</p><p className="text-[10px] text-muted-foreground uppercase">{s.l}</p></div>
          ))}
        </div>

        <div className="bg-card rounded-2xl p-3 shadow-[var(--shadow-card)] h-80 overflow-y-auto space-y-2">
          {messages.map((m,i)=>(
            <div key={i} className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${m.r==="ai"?"bg-muted":"bg-primary text-primary-foreground ml-auto"}`}>{m.t}</div>
          ))}
        </div>

        <div className="bg-card rounded-2xl p-2 flex items-center gap-2 shadow-[var(--shadow-card)]">
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Ask your companion…" className="flex-1 bg-transparent px-2 outline-none text-sm" />
          <button onClick={send} className="h-9 w-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center"><Send className="h-4 w-4" /></button>
        </div>
      </div>
    </FeatureShell>
  );
}

function reply(q: string) {
  const t = q.toLowerCase();
  if (t.includes("water")) return "Based on heat & your pace: aim for 250ml every 15 minutes.";
  if (t.includes("rest")) return "Take a 5-minute break in shade. Your HR is slightly elevated.";
  if (t.includes("weather")) return "Cached forecast: clear next 2h, then chance of clouds.";
  return "I've logged that. I'll factor it into the next pace check.";
}
