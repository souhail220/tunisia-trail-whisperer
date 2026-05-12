import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { FeatureShell } from "@/components/FeatureShell";
import { Backpack, Sparkles, Download } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/features/gear")({
  component: GearChecklist,
});

type Item = { name: string; priority: "must"|"recommended"|"optional"; alt?: string };

function generate(diff: string, weather: string, days: number, budget: string): Record<string, Item[]> {
  const days2 = Math.max(1, days);
  const harsh = diff === "hard";
  const cold = weather === "cold";
  return {
    Safety: [
      { name: "First aid kit", priority: "must", alt: budget==="low"?"Basic pharmacy kit":undefined },
      { name: "Headlamp + spare batteries", priority: "must" },
      { name: "Whistle", priority: "must" },
      ...(harsh ? [{ name: "Emergency bivvy", priority: "recommended" as const }] : []),
    ],
    Navigation: [
      { name: "Offline GPS app", priority: "must" },
      { name: "Compass", priority: "recommended" },
      { name: "Paper map", priority: "recommended", alt: "Print free OSM map" },
    ],
    Clothing: cold
      ? [{ name: "Insulated jacket", priority: "must" }, { name: "Beanie + gloves", priority: "must" }, { name: "Base layer", priority: "recommended" }]
      : [{ name: "Sun hat", priority: "must" }, { name: "UV sleeves", priority: "recommended" }, { name: "Light layers", priority: "recommended" }],
    Hydration: [
      { name: `${1+days2}L water`, priority: "must" },
      { name: "Electrolyte tabs", priority: "recommended", alt: "Salt + lemon" },
    ],
    Food: [
      { name: `${2*days2} energy bars`, priority: "must", alt: "Homemade dates+nuts" },
      { name: "Trail mix", priority: "recommended" },
    ],
  };
}

function GearChecklist() {
  const [diff, setDiff] = useState("moderate");
  const [weather, setWeather] = useState("hot");
  const [days, setDays] = useState(1);
  const [budget, setBudget] = useState("mid");
  const items = useMemo(()=>generate(diff,weather,days,budget),[diff,weather,days,budget]);
  const [checked, setChecked] = useState<Record<string,boolean>>({});

  return (
    <FeatureShell title="Smart Gear Checklist" accent="AI-generated packing list">
      <div className="px-5 space-y-4">
        <div className="bg-card rounded-2xl p-4 shadow-[var(--shadow-card)] space-y-3">
          <Field label="Difficulty" opts={["easy","moderate","hard"]} val={diff} set={setDiff} />
          <Field label="Weather" opts={["sunny","hot","rainy","cold"]} val={weather} set={setWeather} />
          <Field label="Budget" opts={["low","mid","premium"]} val={budget} set={setBudget} />
          <div>
            <div className="flex justify-between text-[11px] font-semibold text-muted-foreground"><span>Days</span><span>{days}</span></div>
            <input type="range" min={1} max={7} value={days} onChange={e=>setDays(+e.target.value)} className="w-full accent-primary" />
          </div>
        </div>

        <div className="bg-card rounded-2xl p-4 shadow-[var(--shadow-card)]">
          <div className="flex items-center gap-2 mb-3"><Sparkles className="h-4 w-4 text-primary" /><p className="text-sm font-bold">Generated list</p></div>
          {Object.entries(items).map(([cat, list])=>(
            <div key={cat} className="mb-4 last:mb-0">
              <p className="text-[11px] font-bold uppercase tracking-wide text-secondary mb-1">{cat}</p>
              <ul className="space-y-1.5">
                {list.map(it=>{
                  const k = `${cat}-${it.name}`;
                  return (
                    <li key={k} className="flex items-start gap-2">
                      <input type="checkbox" checked={!!checked[k]} onChange={()=>setChecked(c=>({...c,[k]:!c[k]}))} className="h-4 w-4 mt-0.5 accent-primary" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className={`text-sm ${checked[k]?"line-through text-muted-foreground":""}`}>{it.name}</span>
                          <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${it.priority==="must"?"bg-danger/15 text-danger":it.priority==="recommended"?"bg-warning/20 text-warning-foreground":"bg-muted text-muted-foreground"}`}>{it.priority}</span>
                        </div>
                        {it.alt && budget==="low" && <p className="text-[10px] text-muted-foreground">💡 Budget alt: {it.alt}</p>}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
          <button onClick={()=>toast.success("Checklist exported")} className="w-full mt-2 bg-primary text-primary-foreground font-semibold py-3 rounded-xl text-sm flex items-center justify-center gap-2"><Download className="h-4 w-4" />Export</button>
        </div>
      </div>
    </FeatureShell>
  );
}

function Field({ label, opts, val, set }: { label:string; opts:string[]; val:string; set:(s:string)=>void }) {
  return (
    <div>
      <p className="text-[11px] font-semibold text-muted-foreground mb-1">{label}</p>
      <div className="flex gap-1">
        {opts.map(o=>(
          <button key={o} onClick={()=>set(o)} className={`flex-1 text-[11px] py-1.5 rounded-full font-semibold capitalize ${val===o?"bg-primary text-primary-foreground":"bg-muted text-muted-foreground"}`}>{o}</button>
        ))}
      </div>
    </div>
  );
}
