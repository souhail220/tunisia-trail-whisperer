import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Species, thermalRiskFor, speciesFor, species as allSpecies } from "@/lib/mock-data";
import { ThermometerSun, AlertTriangle, Backpack, Radio, Star, Map, LifeBuoy, Headphones, ChevronRight, Upload, MapPin, Mic, Power } from "lucide-react";
import { toast } from "sonner";

type SheetProps = { open: boolean; onOpenChange: (o: boolean) => void };

/* ───────── Thermal Risk ───────── */
export function ThermalRiskSheet({ open, onOpenChange, region }: SheetProps & { region: string }) {
  const r = thermalRiskFor(region);
  const tone =
    r.level === "high" ? "bg-danger/10 text-danger border-danger/30"
    : r.level === "moderate" ? "bg-warning/15 text-warning-foreground border-warning/30"
    : "bg-success/10 text-success border-success/30";
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl">
        <SheetHeader><SheetTitle className="flex items-center gap-2"><ThermometerSun className="h-5 w-5 text-warning-foreground" />ThermalRisk · {region}</SheetTitle></SheetHeader>
        <div className={`mt-4 rounded-2xl border p-4 ${tone}`}>
          <p className="text-xs font-bold uppercase">{r.label}</p>
          <p className="text-3xl font-bold mt-1">{r.score}<span className="text-sm font-normal opacity-70">/100</span></p>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-3">
          <div className="bg-card rounded-2xl p-3 shadow-[var(--shadow-card)]"><p className="text-[10px] uppercase text-muted-foreground font-semibold">UV index</p><p className="text-lg font-bold">{r.uv}</p></div>
          <div className="bg-card rounded-2xl p-3 shadow-[var(--shadow-card)]"><p className="text-[10px] uppercase text-muted-foreground font-semibold">Temp</p><p className="text-lg font-bold">{r.tempC}°C</p></div>
        </div>
        <p className="text-xs text-muted-foreground mt-3 leading-relaxed">Hydrate 500ml/hr, start before sunrise, carry electrolytes. Avoid exposed ridges between 12–16h.</p>
      </SheetContent>
    </Sheet>
  );
}

export function ThermalPill({ region, className = "" }: { region: string; className?: string }) {
  const [open, setOpen] = useState(false);
  const r = thermalRiskFor(region);
  const tone = r.level === "high" ? "bg-danger/10 text-danger" : r.level === "moderate" ? "bg-warning/20 text-warning-foreground" : "bg-success/15 text-success";
  return (
    <>
      <button onClick={(e)=>{e.preventDefault();e.stopPropagation();setOpen(true);}} className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${tone} ${className}`}>{r.label}</button>
      <ThermalRiskSheet open={open} onOpenChange={setOpen} region={region} />
    </>
  );
}

export function ThermalStrip({ region, onClick }: { region: string; onClick: () => void }) {
  const r = thermalRiskFor(region);
  const tone = r.level === "high" ? "bg-danger/10 text-danger" : r.level === "moderate" ? "bg-warning/15 text-warning-foreground" : "bg-success/10 text-success";
  return (
    <button onClick={onClick} className={`w-full ${tone} text-xs font-semibold py-2 px-4 flex items-center justify-between`}>
      <span className="flex items-center gap-2"><ThermometerSun className="h-4 w-4" />{r.label} · UV {r.uv} · {r.tempC}°C</span>
      <ChevronRight className="h-4 w-4 opacity-70" />
    </button>
  );
}

/* ───────── Wildlife ───────── */
export function WildlifeSheet({ open, onOpenChange, species }: SheetProps & { species: Species | null }) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl">
        <SheetHeader><SheetTitle>WildlifeID</SheetTitle></SheetHeader>
        {species && (
          <div className="mt-4">
            <div className="h-40 rounded-2xl bg-gradient-to-br from-secondary/40 to-primary/30 flex items-center justify-center text-6xl">{species.emoji}</div>
            <div className="flex items-start justify-between mt-3">
              <div>
                <p className="font-bold">{species.name}</p>
                <p className="text-[11px] italic text-muted-foreground">{species.sci}</p>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${species.danger==="Moderate"||species.danger==="High"?"bg-warning/20 text-warning-foreground":"bg-success/15 text-success"}`}>{species.danger} risk</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">{species.kind} · {species.habitat}</p>
            <p className="text-sm mt-2 leading-relaxed">{species.note}</p>
            {(species.danger==="Moderate"||species.danger==="High") && (
              <div className="mt-2 flex items-center gap-2 text-danger text-xs"><AlertTriangle className="h-3 w-3" />Keep distance, do not handle.</div>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

export function WildlifeChips({ trailId }: { trailId: string }) {
  const list = speciesFor(trailId).slice(0, 3);
  const [sel, setSel] = useState<Species | null>(null);
  if (list.length === 0) return null;
  return (
    <>
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {list.map(s => (
          <button key={s.id} onClick={(e)=>{e.preventDefault();e.stopPropagation();setSel(s);}} className="whitespace-nowrap text-[11px] font-semibold bg-card/90 text-foreground border border-border rounded-full px-3 py-1.5 flex items-center gap-1">
            <span>{s.emoji}</span>{s.name}
          </button>
        ))}
      </div>
      <WildlifeSheet open={!!sel} onOpenChange={o=>!o&&setSel(null)} species={sel} />
    </>
  );
}

export function WildlifeRow({ trailId }: { trailId: string }) {
  const list = speciesFor(trailId);
  const [sel, setSel] = useState<Species | null>(null);
  if (list.length === 0) return null;
  return (
    <div>
      <p className="text-xs font-bold uppercase text-muted-foreground mb-2">Wildlife you may encounter</p>
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {list.map(s => (
          <button key={s.id} onClick={()=>setSel(s)} className="min-w-[110px] bg-card rounded-2xl p-3 shadow-[var(--shadow-card)] flex flex-col items-center gap-1">
            <span className="text-3xl">{s.emoji}</span>
            <span className="text-[11px] font-semibold text-center leading-tight">{s.name}</span>
          </button>
        ))}
      </div>
      <WildlifeSheet open={!!sel} onOpenChange={o=>!o&&setSel(null)} species={sel} />
    </div>
  );
}

export const lookupSpecies = (id: string) => allSpecies.find(s => s.id === id);

/* ───────── Smart Gear Checklist ───────── */
export function GearChecklistSheet({ open, onOpenChange, difficulty, weather, region }: SheetProps & { difficulty: string; weather: string; region?: string }) {
  const hard = difficulty === "Hard" || difficulty === "Expert";
  const items: Record<string, string[]> = {
    Navigation: ["Offline GPS map", "Compass"],
    Hydration: [hard ? "3L water" : "2L water", "Electrolyte tabs"],
    Safety: ["First aid kit", "Headlamp", "Emergency whistle"],
    Clothing: weather === "hot" ? ["Sun hat", "UV sleeves", "Light layers"] : ["Light jacket", "Layered base"],
    Food: ["Trail mix", "Energy bars", "Dates & nuts"],
  };
  if (hard) items.Safety.push("Emergency bivvy", "Satellite messenger");
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl max-h-[85vh] overflow-y-auto">
        <SheetHeader><SheetTitle className="flex items-center gap-2"><Backpack className="h-5 w-5 text-secondary" />Smart gear checklist</SheetTitle></SheetHeader>
        <p className="text-[11px] text-muted-foreground mt-1">AI-tuned for {difficulty} · {weather}{region?` · ${region}`:""}</p>
        <div className="space-y-3 mt-4">
          {Object.entries(items).map(([cat, list]) => (
            <div key={cat}>
              <p className="text-[11px] font-bold uppercase tracking-wide text-secondary mb-1">{cat}</p>
              <ul className="space-y-1.5">
                {list.map(item => (
                  <li key={item} className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={!!checked[item]} onChange={()=>setChecked(c=>({...c,[item]:!c[item]}))} className="h-4 w-4 accent-primary rounded" />
                    <span className={checked[item] ? "line-through text-muted-foreground" : ""}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}

/* ───────── AR Route HUD ───────── */
export function AROverlaySheet({ open, onOpenChange, trailName }: SheetProps & { trailName?: string }) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl h-[90vh] p-0 overflow-hidden">
        <div className="relative w-full h-full bg-gradient-to-b from-[oklch(0.25_0.08_260)] to-[oklch(0.15_0.06_270)] text-card">
          <div className="absolute inset-x-0 top-0 p-4">
            <SheetHeader><SheetTitle className="text-card flex items-center gap-2"><Map className="h-5 w-5" />AR Navigation</SheetTitle></SheetHeader>
            {trailName && <p className="text-xs opacity-80 mt-1">{trailName}</p>}
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="border-2 border-card/40 rounded-full w-64 h-64 flex items-center justify-center relative">
              <div className="absolute -top-3 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">N</div>
              <div className="text-center">
                <p className="text-5xl">↑</p>
                <p className="text-xs opacity-80 mt-2">Next waypoint</p>
                <p className="text-2xl font-bold">320 m</p>
              </div>
            </div>
          </div>
          <div className="absolute bottom-6 inset-x-4 bg-card/10 backdrop-blur border border-card/20 rounded-2xl p-3 text-xs">
            <p className="font-semibold">Heading 12° NE · Elev +18m</p>
            <p className="opacity-70 mt-0.5">Hold phone upright. Stay on visible path overlay.</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

/* ───────── Offline Emergency ───────── */
const emergencySteps = [
  { id: "bleed", t: "Bleeding", body: "Apply firm direct pressure with clean cloth for 10 min. Elevate the wound above heart level. Do not remove embedded objects." },
  { id: "fracture", t: "Suspected fracture", body: "Immobilize joint above and below. Use trekking pole + clothing as splint. Do not realign bone. Evacuate slowly." },
  { id: "heat", t: "Heat exhaustion", body: "Move to shade. Loosen clothing. Sip cool water with electrolytes. Cool neck/wrists. Rest 30 min before continuing." },
  { id: "snake", t: "Snake bite", body: "Stay calm, immobilize limb below heart. Remove rings/watch. Do NOT cut or suck. Mark swelling edge with time, get to help." },
];

export function OfflineEmergencySheet({ open, onOpenChange }: SheetProps) {
  const [picked, setPicked] = useState<string | null>(null);
  const step = emergencySteps.find(s => s.id === picked);
  return (
    <Sheet open={open} onOpenChange={(o)=>{onOpenChange(o); if(!o) setPicked(null);}}>
      <SheetContent side="bottom" className="rounded-t-3xl max-h-[85vh] overflow-y-auto">
        <SheetHeader><SheetTitle className="flex items-center gap-2"><LifeBuoy className="h-5 w-5 text-danger" />Offline emergency guide</SheetTitle></SheetHeader>
        {!step ? (
          <div className="mt-4 space-y-2">
            <p className="text-xs text-muted-foreground">Pick what's happening. Works without signal.</p>
            {emergencySteps.map(s => (
              <button key={s.id} onClick={()=>setPicked(s.id)} className="w-full bg-card rounded-2xl p-4 shadow-[var(--shadow-card)] flex items-center justify-between">
                <span className="text-sm font-semibold">{s.t}</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        ) : (
          <div className="mt-4 bg-card rounded-2xl p-4 shadow-[var(--shadow-card)]">
            <p className="font-bold">{step.t}</p>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{step.body}</p>
            <button onClick={()=>setPicked(null)} className="mt-4 text-xs font-semibold text-primary">← Back to symptoms</button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

/* ───────── Mesh SOS ───────── */
export function MeshSOSSheet({ open, onOpenChange }: SheetProps) {
  const peers = [
    { id: 1, name: "Hiker · 8 m", hops: 1 },
    { id: 2, name: "Ranger node · 240 m", hops: 2 },
    { id: 3, name: "Cellular relay · 1.6 km", hops: 3 },
  ];
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl">
        <SheetHeader><SheetTitle className="flex items-center gap-2"><Radio className="h-5 w-5 text-danger" />Mesh SOS relayed</SheetTitle></SheetHeader>
        <p className="text-xs text-muted-foreground mt-1">Your distress beacon is hopping through nearby Bluetooth peers.</p>
        <div className="space-y-2 mt-4">
          {peers.map(p => (
            <div key={p.id} className="bg-card rounded-2xl p-3 shadow-[var(--shadow-card)] flex items-center justify-between">
              <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-secondary animate-pulse" /><span className="text-sm font-semibold">{p.name}</span></div>
              <span className="text-[10px] font-bold text-muted-foreground">{p.hops} hop{p.hops>1?"s":""}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 bg-danger/10 text-danger rounded-2xl p-3 text-xs font-semibold">SOS active · your location is being broadcast.</div>
      </SheetContent>
    </Sheet>
  );
}

/* ───────── StarPath ───────── */
export function StarPathSheet({ open, onOpenChange }: SheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl h-[80vh] p-0 overflow-hidden">
        <div className="w-full h-full bg-[oklch(0.15_0.05_270)] text-card relative">
          <div className="p-4">
            <SheetHeader><SheetTitle className="text-card flex items-center gap-2"><Star className="h-5 w-5 text-warning-foreground" />StarPath night compass</SheetTitle></SheetHeader>
          </div>
          <div className="absolute inset-10 rounded-full border border-card/20 flex items-center justify-center">
            {[...Array(30)].map((_,i)=>(
              <span key={i} className="absolute h-1 w-1 rounded-full bg-card/80" style={{ top: `${Math.random()*100}%`, left: `${Math.random()*100}%` }} />
            ))}
            <div className="text-center">
              <p className="text-xs opacity-70">Polaris</p>
              <p className="text-2xl">★</p>
              <p className="text-xs opacity-70 mt-2">North · 358°</p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

/* ───────── RadioMode ───────── */
export function RadioModeSheet({ open, onOpenChange }: SheetProps) {
  const [ptt, setPtt] = useState(false);
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl">
        <SheetHeader><SheetTitle className="flex items-center gap-2"><Headphones className="h-5 w-5 text-primary" />Open channel · Trailheads</SheetTitle></SheetHeader>
        <p className="text-xs text-muted-foreground mt-1">12 hikers connected · BT mesh</p>
        <div className="mt-6 flex flex-col items-center">
          <button onPointerDown={()=>setPtt(true)} onPointerUp={()=>setPtt(false)} onPointerLeave={()=>setPtt(false)} className={`h-32 w-32 rounded-full font-bold text-card flex items-center justify-center transition-all ${ptt?"bg-danger scale-95":"bg-primary"}`}>
            <span className="flex flex-col items-center gap-1"><Mic className="h-8 w-8" /><span className="text-xs">{ptt?"Live":"Hold to talk"}</span></span>
          </button>
          <p className="text-[11px] text-muted-foreground mt-4">Push & hold the button to broadcast to the channel.</p>
        </div>
      </SheetContent>
    </Sheet>
  );
}

/* ───────── Enhanced Route Share (form content) ───────── */
export function EnhancedShareForm({ onSubmit, onCancel }: { onSubmit: (data: { kind: "trail" | "hazard" | "wildlife"; trail: string; region: string; hazard?: string; speciesName?: string; speciesDesc?: string; gpxName?: string }) => void; onCancel: () => void }) {
  const [kind, setKind] = useState<"trail" | "hazard" | "wildlife">("trail");
  const [trail, setTrail] = useState("");
  const [region, setRegion] = useState("");
  const [hazard, setHazard] = useState("");
  const [speciesName, setSpeciesName] = useState("");
  const [speciesDesc, setSpeciesDesc] = useState("");
  const [gpxName, setGpxName] = useState<string | null>(null);

  const submit = () => {
    if (!trail.trim() || !region.trim()) { toast.error("Add a trail name and region"); return; }
    if (kind === "hazard" && !hazard.trim()) { toast.error("Describe the hazard"); return; }
    if (kind === "wildlife" && !speciesName.trim()) { toast.error("Add the species name"); return; }
    onSubmit({ kind, trail, region, hazard, speciesName, speciesDesc, gpxName: gpxName || undefined });
  };

  return (
    <div className="space-y-3 mt-4">
      <div className="grid grid-cols-3 gap-2">
        {([["trail","Trail"],["hazard","Hazard"],["wildlife","Wildlife"]] as const).map(([k,l]) => (
          <button key={k} onClick={()=>setKind(k)} className={`py-2 rounded-xl text-xs font-semibold border ${kind===k?"bg-primary text-primary-foreground border-primary":"border-border"}`}>{l}</button>
        ))}
      </div>

      <label className="block">
        <span className="text-xs font-medium text-muted-foreground">Trail name</span>
        <input value={trail} onChange={e=>setTrail(e.target.value)} className="w-full mt-1 px-4 py-3 rounded-xl bg-card border border-border outline-none text-sm" placeholder="e.g. Cap Bon Cliff Walk" />
      </label>
      <label className="block">
        <span className="text-xs font-medium text-muted-foreground">Region</span>
        <input value={region} onChange={e=>setRegion(e.target.value)} className="w-full mt-1 px-4 py-3 rounded-xl bg-card border border-border outline-none text-sm" placeholder="e.g. Nabeul" />
      </label>

      {kind === "trail" && (
        <label className="block">
          <span className="text-xs font-medium text-muted-foreground">GPX file</span>
          <div className="mt-1 flex items-center gap-2">
            <label className="flex-1 cursor-pointer bg-card border border-dashed border-border rounded-xl px-4 py-3 text-xs flex items-center gap-2">
              <Upload className="h-4 w-4 text-primary" />
              <span className={gpxName ? "font-semibold" : "text-muted-foreground"}>{gpxName || "Upload GPX track"}</span>
              <input type="file" accept=".gpx" className="hidden" onChange={e=>setGpxName(e.target.files?.[0]?.name || null)} />
            </label>
          </div>
        </label>
      )}

      {kind === "hazard" && (
        <label className="block">
          <span className="text-xs font-medium text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" />Geotagged hazard</span>
          <input value={hazard} onChange={e=>setHazard(e.target.value)} className="w-full mt-1 px-4 py-3 rounded-xl bg-card border border-border outline-none text-sm" placeholder="e.g. Loose rocks near summit" />
          <p className="text-[10px] text-muted-foreground mt-1">Pinned at your current GPS location.</p>
        </label>
      )}

      {kind === "wildlife" && (
        <>
          <label className="block">
            <span className="text-xs font-medium text-muted-foreground">Species name</span>
            <input value={speciesName} onChange={e=>setSpeciesName(e.target.value)} className="w-full mt-1 px-4 py-3 rounded-xl bg-card border border-border outline-none text-sm" placeholder="e.g. Barbary partridge" />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-muted-foreground">Description</span>
            <textarea value={speciesDesc} onChange={e=>setSpeciesDesc(e.target.value)} rows={3} className="w-full mt-1 px-4 py-3 rounded-xl bg-card border border-border outline-none text-sm resize-none" placeholder="Where, when, behavior…" />
          </label>
        </>
      )}

      <div className="flex flex-col gap-2 pt-2">
        <button onClick={submit} className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-xl">Post</button>
        <button onClick={onCancel} className="w-full bg-card border border-border font-semibold py-3 rounded-xl text-sm">Cancel</button>
      </div>
    </div>
  );
}

/* ───────── Safety Watch (embedded panel) ───────── */
export function SafetyWatchPanel({ onSOS }: { onSOS: () => void }) {
  const [countdown, setCountdown] = useState<number | null>(null);

  const startSOS = () => {
    setCountdown(5);
    const iv = setInterval(() => {
      setCountdown(c => {
        if (c === null) { clearInterval(iv); return null; }
        if (c <= 1) { clearInterval(iv); onSOS(); return null; }
        return c - 1;
      });
    }, 1000);
  };
  const cancel = () => setCountdown(null);

  return (
    <div className="bg-card rounded-3xl p-4 shadow-[var(--shadow-card)] border border-danger/10">
      <div className="flex items-center gap-2 mb-3">
        <div className="h-9 w-9 rounded-xl bg-danger/10 flex items-center justify-center"><Power className="h-4 w-4 text-danger" /></div>
        <div className="flex-1">
          <p className="font-bold text-sm">AI Safety Watch</p>
          <p className="text-[10px] text-success font-semibold">● Monitoring active</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        <Sensor l="Accel" v="OK" />
        <Sensor l="Gyro" v="OK" />
        <Sensor l="Activity" v="Walking" />
      </div>
      <p className="text-[11px] text-muted-foreground mt-3 leading-relaxed">No fall, abnormal inactivity or disorientation detected. Auto-alert will trigger if a hazard is detected.</p>
      {countdown === null ? (
        <button onClick={startSOS} className="mt-3 w-full bg-danger text-danger-foreground font-bold py-3 rounded-2xl flex items-center justify-center gap-2"><AlertTriangle className="h-4 w-4" />Trigger SOS</button>
      ) : (
        <button onClick={cancel} className="mt-3 w-full bg-danger text-danger-foreground font-bold py-3 rounded-2xl animate-pulse">Sending SOS in {countdown}… tap to cancel</button>
      )}
    </div>
  );
}

function Sensor({ l, v }: { l: string; v: string }) {
  return (
    <div className="bg-background rounded-xl py-2">
      <p className="text-xs font-bold text-secondary">{v}</p>
      <p className="text-[10px] text-muted-foreground uppercase">{l}</p>
    </div>
  );
}
