import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { MobileShell } from "@/components/MobileShell";
import { trails } from "@/lib/mock-data";
import { TrailCard } from "@/components/TrailCard";
import { ChevronLeft, Sparkles, Map } from "lucide-react";
import { AROverlaySheet, GearChecklistSheet } from "@/components/feature-sheets";


export const Route = createFileRoute("/generate")({
  head: () => ({ meta: [{ title: "AI Route Generator — TrailMate" }, { name: "description", content: "Generate a perfect Tunisian hike with AI." }] }),
  component: Generate,
});

const prefs = ["Scenic views", "Historical sites", "Waterfalls", "Wildlife", "Solitude", "Family"];

function Generate() {
  const [duration, setDuration] = useState(4);
  const [diff, setDiff] = useState(3);
  const [level, setLevel] = useState("Intermediate");
  const [budget, setBudget] = useState("free");
  const [chosen, setChosen] = useState<string[]>(["Scenic views"]);
  const [phase, setPhase] = useState<"form"|"loading"|"results">("form");
  const [arOpen, setArOpen] = useState<string | null>(null);
  const [gearOpen, setGearOpen] = useState(false);
  const results = trails.slice(0,3);
  const primary = results[0];


  const generate = () => {
    setPhase("loading");
    setTimeout(()=>setPhase("results"), 1600);
  };

  return (
    <MobileShell>
      <div className="px-5 pt-6 flex items-center gap-3">
        <Link to="/explore" className="h-9 w-9 rounded-xl bg-card flex items-center justify-center"><ChevronLeft className="h-4 w-4" /></Link>
        <h1 className="font-bold text-lg">AI Route Generator</h1>
      </div>

      {phase === "form" && (
        <div className="px-5 mt-6 space-y-6">
          <div>
            <div className="flex justify-between text-sm font-semibold"><span>Duration</span><span className="text-primary">{duration < 24 ? `${duration}h` : `${Math.round(duration/24)}d`}</span></div>
            <input type="range" min={1} max={72} value={duration} onChange={e=>setDuration(+e.target.value)} className="w-full accent-primary" />
          </div>
          <div>
            <div className="flex justify-between text-sm font-semibold"><span>Difficulty</span><span className="text-primary">{diff}/5</span></div>
            <input type="range" min={1} max={5} value={diff} onChange={e=>setDiff(+e.target.value)} className="w-full accent-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold mb-2">Physical level</p>
            <div className="flex gap-2">
              {["Beginner","Intermediate","Expert"].map(l => (
                <button key={l} onClick={()=>setLevel(l)} className={`flex-1 py-2 rounded-full text-xs font-semibold border ${level===l?"bg-primary text-primary-foreground border-primary":"border-border"}`}>{l}</button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2">Preferences</p>
            <div className="flex flex-wrap gap-2">
              {prefs.map(p => {
                const on = chosen.includes(p);
                return (
                  <button key={p} onClick={()=>setChosen(c=>on?c.filter(x=>x!==p):[...c,p])}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${on?"bg-secondary text-secondary-foreground border-secondary":"border-border text-foreground"}`}>{p}</button>
                );
              })}
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2">Budget</p>
            <div className="grid grid-cols-3 gap-2">
              {[{k:"free",l:"Free"},{k:"guided",l:"Guided"},{k:"premium",l:"Premium"}].map(b => (
                <button key={b.k} onClick={()=>setBudget(b.k)} className={`py-3 rounded-2xl text-xs font-bold border ${budget===b.k?"bg-primary/10 border-primary text-primary":"border-border"}`}>{b.l}</button>
              ))}
            </div>
          </div>
          <button onClick={generate} className="w-full bg-primary text-primary-foreground font-semibold py-4 rounded-2xl shadow-[var(--shadow-float)] flex items-center justify-center gap-2">
            <Sparkles className="h-4 w-4" /> Generate my route
          </button>
        </div>
      )}

      {phase === "loading" && (
        <div className="px-5 mt-6 space-y-3">
          {[0,1,2].map(i => (
            <div key={i} className="bg-card rounded-2xl overflow-hidden">
              <div className="h-32 shimmer" />
              <div className="p-3 space-y-2">
                <div className="h-3 w-2/3 shimmer rounded" />
                <div className="h-2.5 w-1/3 shimmer rounded" />
              </div>
            </div>
          ))}
          <p className="text-center text-xs text-muted-foreground mt-4">Crafting 3 routes for you…</p>
        </div>
      )}

      {phase === "results" && (
        <div className="mt-6">
          <p className="px-5 text-xs text-muted-foreground mb-3">3 routes matched your preferences</p>
          <div className="flex gap-3 overflow-x-auto no-scrollbar px-5 pb-2 snap-x">
            {trails.slice(0,3).map(t => (
              <Link key={t.id} to="/trail/$id" params={{ id: t.id }} className="snap-center min-w-[280px]">
                <TrailCard trail={t} compact />
              </Link>
            ))}
          </div>
          <div className="px-5 mt-6">
            <button onClick={()=>setPhase("form")} className="w-full bg-card border border-border font-semibold py-3 rounded-2xl text-sm">Refine preferences</button>
          </div>
        </div>
      )}
    </MobileShell>
  );
}
