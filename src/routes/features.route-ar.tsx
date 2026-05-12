import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { FeatureShell } from "@/components/FeatureShell";
import { Camera, Navigation, AlertTriangle, MapPin, Sparkles } from "lucide-react";

export const Route = createFileRoute("/features/route-ar")({
  component: RouteAR,
});

function RouteAR() {
  const [phase, setPhase] = useState<"form"|"loading"|"route"|"ar">("form");
  const [diff, setDiff] = useState(3);
  const [dur, setDur] = useState(4);
  const [terrain, setTerrain] = useState("Mountain");
  const heading = useHeading(phase === "ar");

  const generate = () => { setPhase("loading"); setTimeout(()=>setPhase("route"), 1400); };

  return (
    <FeatureShell title="AR Route Generator" accent="AI route + AR navigation">
      {phase === "form" && (
        <div className="px-5 space-y-5">
          <div className="bg-card rounded-2xl p-4 shadow-[var(--shadow-card)] space-y-4">
            <div>
              <div className="flex justify-between text-sm font-semibold"><span>Difficulty</span><span className="text-primary">{diff}/5</span></div>
              <input type="range" min={1} max={5} value={diff} onChange={e=>setDiff(+e.target.value)} className="w-full accent-primary" />
            </div>
            <div>
              <div className="flex justify-between text-sm font-semibold"><span>Duration</span><span className="text-primary">{dur}h</span></div>
              <input type="range" min={1} max={12} value={dur} onChange={e=>setDur(+e.target.value)} className="w-full accent-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold mb-2">Terrain</p>
              <div className="flex gap-2 flex-wrap">
                {["Mountain","Desert","Coast","Forest"].map(t=>(
                  <button key={t} onClick={()=>setTerrain(t)} className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${terrain===t?"bg-primary text-primary-foreground border-primary":"border-border"}`}>{t}</button>
                ))}
              </div>
            </div>
          </div>
          <button onClick={generate} className="w-full bg-primary text-primary-foreground font-semibold py-4 rounded-2xl flex items-center justify-center gap-2"><Sparkles className="h-4 w-4" />Generate route</button>
        </div>
      )}

      {phase === "loading" && (
        <div className="px-5 space-y-3">
          {[0,1,2].map(i=>(<div key={i} className="h-24 rounded-2xl shimmer" />))}
          <p className="text-center text-xs text-muted-foreground">Crafting your AI route…</p>
        </div>
      )}

      {phase === "route" && (
        <div className="px-5 space-y-3">
          <div className="bg-card rounded-2xl overflow-hidden shadow-[var(--shadow-card)]">
            <div className="h-40 bg-gradient-to-br from-primary/30 to-secondary/30 relative">
              <span className="absolute top-3 left-3 bg-card/90 backdrop-blur px-2 py-1 rounded-full text-[10px] font-bold">AI ROUTE</span>
            </div>
            <div className="p-4">
              <p className="font-bold">Jebel Zaghouan loop · {dur}h</p>
              <p className="text-xs text-muted-foreground">12.4km · {diff}/5 difficulty · {terrain}</p>
              <div className="grid grid-cols-3 gap-2 mt-3 text-center">
                {[{l:"Checkpoints",v:"6"},{l:"Hazards",v:"2"},{l:"Water",v:"3"}].map(s=>(
                  <div key={s.l} className="bg-muted rounded-xl p-2"><p className="text-sm font-bold text-primary">{s.v}</p><p className="text-[10px] text-muted-foreground uppercase">{s.l}</p></div>
                ))}
              </div>
            </div>
          </div>
          <button onClick={()=>setPhase("ar")} className="w-full bg-secondary text-secondary-foreground font-semibold py-4 rounded-2xl flex items-center justify-center gap-2"><Camera className="h-4 w-4" /> Start AR navigation</button>
          <button onClick={()=>setPhase("form")} className="w-full bg-card border border-border font-semibold py-3 rounded-2xl text-sm">Refine</button>
        </div>
      )}

      {phase === "ar" && (
        <div className="px-5">
          <div className="relative h-[420px] rounded-3xl overflow-hidden bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900">
            {/* Grid floor effect */}
            <div className="absolute inset-0 opacity-30" style={{backgroundImage:"linear-gradient(transparent 95%, white 95%), linear-gradient(90deg, transparent 95%, white 95%)", backgroundSize:"40px 40px"}} />
            {/* Arrow */}
            <div className="absolute inset-0 flex items-center justify-center" style={{ transform:`rotate(${heading}deg)` }}>
              <Navigation className="h-24 w-24 text-warning drop-shadow-[0_0_12px_rgba(255,200,0,0.6)]" />
            </div>
            {/* Top HUD */}
            <div className="absolute top-3 left-3 right-3 flex justify-between text-card text-xs font-bold">
              <span className="bg-black/40 backdrop-blur px-3 py-1.5 rounded-full">NEXT · 240m</span>
              <span className="bg-black/40 backdrop-blur px-3 py-1.5 rounded-full">{Math.round(heading)}°</span>
            </div>
            {/* Trail marker */}
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-secondary text-secondary-foreground px-3 py-1.5 rounded-full text-[11px] font-bold flex items-center gap-1">
              <MapPin className="h-3 w-3" /> Checkpoint 3 of 6
            </div>
            {/* Hazard */}
            <div className="absolute bottom-3 left-3 right-3 bg-danger/90 text-danger-foreground rounded-xl p-3 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <p className="text-xs font-bold">Slippery rocks ahead — 80m</p>
            </div>
          </div>
          <button onClick={()=>setPhase("route")} className="w-full mt-3 bg-card border border-border font-semibold py-3 rounded-2xl text-sm">Exit AR</button>
        </div>
      )}
    </FeatureShell>
  );
}

function useHeading(active: boolean) {
  const [h, setH] = useState(0);
  const ref = useRef(0);
  useEffect(()=>{
    if (!active) return;
    const t = setInterval(()=>{ ref.current = (ref.current + (Math.random()*20-10))%360; setH(ref.current); }, 600);
    return ()=>clearInterval(t);
  }, [active]);
  return h;
}
