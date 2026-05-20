import { createFileRoute, notFound, useRouter, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { MobileShell } from "@/components/MobileShell";
import { trails, thermalRiskFor } from "@/lib/mock-data";
import { ChevronLeft, MapPin, Flag, Trophy, Bot, Send, Pause, Play, CheckCircle2, Sparkles, Navigation, ChevronDown, Star, LifeBuoy, Footprints } from "lucide-react";
import { toast } from "sonner";
import mapBg from "@/assets/map-bg.jpg";
import { SafetyWatchPanel, MeshSOSSheet, OfflineEmergencySheet, StarPathSheet, ThermalStrip, ThermalRiskSheet } from "@/components/feature-sheets";

export const Route = createFileRoute("/hike/$id")({
  component: ActiveHike,
});


type Checkpoint = { id: string; name: string; km: number; reward: string; xp: number; pos: { top: string; left: string } };

function ActiveHike() {
  const { id } = Route.useParams();
  const router = useRouter();
  const trail = trails.find(t => t.id === id);
  if (!trail) throw notFound();

  const checkpoints: Checkpoint[] = useMemo(() => {
    const total = trail.distanceKm;
    return [
      { id: "c1", name: "Trailhead",    km: 0,            reward: "🥾 Starter Badge",   xp: 50,  pos: { top: "78%", left: "18%" } },
      { id: "c2", name: "First Ridge",  km: +(total*0.33).toFixed(1), reward: "📸 Scenic View",     xp: 100, pos: { top: "58%", left: "36%" } },
      { id: "c3", name: "Mid Camp",     km: +(total*0.6).toFixed(1),  reward: "💧 Hydration +",     xp: 150, pos: { top: "42%", left: "58%" } },
      { id: "c4", name: "Summit Push",  km: +(total*0.85).toFixed(1), reward: "⛰️ Climber Badge",   xp: 200, pos: { top: "26%", left: "72%" } },
      { id: "c5", name: "Finish",       km: total,        reward: "🏆 Trail Conqueror", xp: 300, pos: { top: "14%", left: "84%" } },
    ];
  }, [trail.distanceKm]);

  const [running, setRunning] = useState(true);
  const [seconds, setSeconds] = useState(0);
  const [km, setKm] = useState(0);
  const [reached, setReached] = useState<string[]>([]);
  const [xp, setXp] = useState(0);
  const [messages, setMessages] = useState<{role:"ai"|"user"; text:string}[]>([
    { role: "ai", text: `Welcome to ${trail.name}! I'll guide you. Maintain steady pace — first checkpoint in ${(trail.distanceKm*0.33).toFixed(1)} km.` },
  ]);
  const [input, setInput] = useState("");
  const chatRef = useRef<HTMLDivElement>(null);
  const companionRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [companionOpen, setCompanionOpen] = useState(false);
  const [meshOpen, setMeshOpen] = useState(false);
  const [emergencyOpen, setEmergencyOpen] = useState(false);
  const [starOpen, setStarOpen] = useState(false);
  const [thermalOpen, setThermalOpen] = useState(false);
  const rescueKey = useMemo(() => `${trail.id.slice(0,3).toUpperCase()}-${Math.floor(1000+Math.random()*9000)}-${Math.random().toString(36).slice(2,5).toUpperCase()}`, [trail.id]);

  // Auto-start GhostTrail + reveal rescue key once
  const started = useRef(false);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    toast.success("GhostTrail recording", { description: `Rescue key: ${rescueKey}`, duration: 8000 });
  }, [rescueKey]);

  const toggleCompanion = () => {
    setCompanionOpen(o => !o);
    if (!companionOpen) {
      setTimeout(() => {
        companionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        inputRef.current?.focus();
      }, 200);
      if (messages.length <= 1) {
        setMessages(m => [...m, { role: "ai", text: "I'm right here with you. Ask me anything — pace, hydration, navigation, weather." }]);
      }
    }
  };


  // simulated movement
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => {
      setSeconds(s => s + 1);
      setKm(k => Math.min(trail.distanceKm, +(k + trail.distanceKm / 120).toFixed(2)));
    }, 1000);
    return () => clearInterval(t);
  }, [running, trail.distanceKm]);

  // checkpoint detection
  useEffect(() => {
    checkpoints.forEach(cp => {
      if (km >= cp.km && !reached.includes(cp.id)) {
        setReached(r => [...r, cp.id]);
        setXp(x => x + cp.xp);
        toast.success(`Checkpoint: ${cp.name}`, { description: `+${cp.xp} XP · ${cp.reward}` });
        setMessages(m => [...m, { role: "ai", text: `Great job reaching ${cp.name}! You earned ${cp.reward} (+${cp.xp} XP). Keep going.` }]);
      }
    });
  }, [km, checkpoints, reached]);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const progress = Math.min(100, (km / trail.distanceKm) * 100);
  const completed = km >= trail.distanceKm;

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages(m => [...m, { role: "user", text }, { role: "ai", text: aiReply(text, km, trail.distanceKm) }]);
    setInput("");
  };

  const finish = () => {
    toast.success(`Hike complete! +${xp} XP earned`);
    router.navigate({ to: "/profile" });
  };

  const fmt = (s: number) => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
  const hikerPos = checkpoints.reduce((acc, cp, i) => {
    if (km >= cp.km) return cp.pos;
    if (i === 0) return cp.pos;
    const prev = checkpoints[i-1];
    if (km < cp.km && km >= prev.km) {
      const t = (km - prev.km) / (cp.km - prev.km || 1);
      const lerp = (a: string, b: string) => `${parseFloat(a) + (parseFloat(b)-parseFloat(a))*t}%`;
      return { top: lerp(prev.pos.top, cp.pos.top), left: lerp(prev.pos.left, cp.pos.left) };
    }
    return acc;
  }, checkpoints[0].pos);

  return (
    <MobileShell>
      <div className="relative">
        {/* Map */}
        <div className="relative h-[340px] overflow-hidden">
          <img src={mapBg} alt="Hike map" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background" />

          <button onClick={() => router.history.back()} className="absolute top-6 left-5 h-10 w-10 rounded-2xl bg-background/95 flex items-center justify-center z-10" aria-label="Back">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="absolute top-6 right-5 bg-background/95 rounded-2xl px-3 py-2 z-10 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-xs font-bold">{xp} XP</span>
          </div>

          {/* Path line */}
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
            <polyline
              points={checkpoints.map(c => `${parseFloat(c.pos.left)},${parseFloat(c.pos.top)}`).join(" ")}
              fill="none" stroke="oklch(0.45 0.18 285)" strokeWidth="0.6" strokeDasharray="1.5 1" strokeLinecap="round"
            />
          </svg>

          {/* Checkpoints */}
          {checkpoints.map(cp => {
            const done = reached.includes(cp.id);
            return (
              <div key={cp.id} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ top: cp.pos.top, left: cp.pos.left }}>
                <div className={`h-7 w-7 rounded-full flex items-center justify-center ring-4 ${done ? "bg-secondary ring-secondary/25" : "bg-background ring-primary/25"}`}>
                  {done ? <CheckCircle2 className="h-4 w-4 text-secondary-foreground" /> : <Flag className="h-3.5 w-3.5 text-primary" />}
                </div>
              </div>
            );
          })}

          {/* Hiker marker */}
          <div className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-1000" style={{ top: hikerPos.top, left: hikerPos.left }}>
            <div className="relative">
              <span className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
              <div className="relative h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-[var(--shadow-float)]">
                <Navigation className="h-4 w-4 fill-current" />
              </div>
            </div>
          </div>
        </div>

        {/* Live stats */}
        <div className="px-5 -mt-10 relative z-10">
          <div className="bg-card rounded-3xl p-4 shadow-[var(--shadow-card)]">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-[10px] uppercase text-muted-foreground font-semibold">Live hike</p>
                <p className="font-bold text-sm leading-tight">{trail.name}</p>
              </div>
              <button onClick={() => setRunning(r => !r)} className="h-10 w-10 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center" aria-label="Pause">
                {running ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current" />}
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <Mini v={`${km.toFixed(2)} km`} l="distance" />
              <Mini v={fmt(seconds)} l="time" />
              <Mini v={`${reached.length}/${checkpoints.length}`} l="checkpoints" />
            </div>
            <div className="mt-3">
              <div className="h-2 rounded-full bg-primary/15 overflow-hidden">
                <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">{progress.toFixed(0)}% complete</p>
            </div>
            <button
              onClick={activateCompanion}
              className={`mt-3 w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold transition-colors ${companionActive ? "bg-secondary/15 text-secondary border border-secondary/30" : "bg-primary text-primary-foreground"}`}
            >
              <Bot className="h-4 w-4" />
              {companionActive ? "Companion active — tap to chat" : "Activate AI companion"}
            </button>
          </div>

          {/* Checkpoint rewards list */}
          <div className="mt-4">
            <p className="text-xs font-bold uppercase text-muted-foreground mb-2 flex items-center gap-1"><Trophy className="h-3 w-3" /> Checkpoints & rewards</p>
            <div className="space-y-2">
              {checkpoints.map(cp => {
                const done = reached.includes(cp.id);
                return (
                  <div key={cp.id} className={`bg-card rounded-2xl p-3 flex items-center gap-3 border ${done ? "border-secondary/40" : "border-transparent"}`}>
                    <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${done ? "bg-secondary/15" : "bg-primary/10"}`}>
                      {done ? <CheckCircle2 className="h-4 w-4 text-secondary" /> : <MapPin className="h-4 w-4 text-primary" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold">{cp.name}</p>
                      <p className="text-[11px] text-muted-foreground">{cp.km} km · {cp.reward}</p>
                    </div>
                    <span className={`text-[11px] font-bold ${done ? "text-secondary" : "text-muted-foreground"}`}>+{cp.xp}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Companion */}
          <div ref={companionRef} className={`mt-5 bg-card rounded-3xl p-4 shadow-[var(--shadow-card)] transition-all ${companionActive ? "ring-2 ring-primary/40" : ""}`}>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-bold text-sm">AI Companion</p>
                <p className="text-[10px] text-success font-semibold">● Live during hike</p>
              </div>
            </div>
            <div ref={chatRef} className="max-h-48 overflow-y-auto space-y-2 pr-1">
              {messages.map((m,i) => (
                <div key={i} className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs ${m.role==="ai" ? "bg-background text-foreground" : "bg-primary text-primary-foreground ml-auto"}`}>
                  {m.text}
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar">
              {["How far to next?", "I need a break", "Weather check"].map(q => (
                <button key={q} onClick={()=>send(q)} className="whitespace-nowrap text-[11px] font-semibold bg-background border border-border rounded-full px-3 py-1.5">{q}</button>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2 bg-background rounded-2xl px-3 py-2">
              <input ref={inputRef} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send(input)} placeholder="Ask your companion…" className="flex-1 bg-transparent outline-none text-sm" />
              <button onClick={()=>send(input)} className="h-8 w-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center" aria-label="Send"><Send className="h-4 w-4" /></button>
            </div>
          </div>

          <button
            onClick={finish}
            className={`mt-5 w-full font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 ${completed ? "bg-secondary text-secondary-foreground" : "bg-card text-foreground border border-border"}`}
          >
            <Trophy className="h-4 w-4" /> {completed ? "Claim rewards & finish" : "End hike early"}
          </button>

          <Link to="/ai-guide" className="mt-3 mb-4 block text-center text-xs font-semibold text-primary">Open full AI Guide →</Link>
        </div>
      </div>
    </MobileShell>
  );
}

function Mini({ v, l }: { v: string; l: string }) {
  return (
    <div className="bg-background rounded-xl py-2">
      <p className="text-sm font-bold">{v}</p>
      <p className="text-[10px] text-muted-foreground uppercase">{l}</p>
    </div>
  );
}

function aiReply(text: string, km: number, total: number) {
  const t = text.toLowerCase();
  const remaining = (total - km).toFixed(1);
  if (t.includes("far") || t.includes("next")) return `You're at ${km.toFixed(2)} km. About ${remaining} km left to the finish.`;
  if (t.includes("break")) return "Good idea — find shade, sip water, stretch your calves for 3 minutes. I'll pause tracking if you want.";
  if (t.includes("weather")) return "Cached forecast: clear skies, 24°C. Wind picking up after 3pm — finish before then.";
  return "Steady breathing, short steps on the inclines. You've got this.";
}
