import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FeatureShell } from "@/components/FeatureShell";
import { Camera, Leaf, BookOpen, AlertTriangle, Save } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/features/wildlife")({
  component: Wildlife,
});

const species = [
  { name:"Barbary partridge", sci:"Alectoris barbara", kind:"Bird", danger:"Low", habitat:"Scrubland, hills", note:"Endemic to North Africa, ground-nesting." },
  { name:"Horseshoe whip snake", sci:"Hemorrhois hippocrepis", kind:"Reptile", danger:"Low", habitat:"Rocky areas", note:"Non-venomous, fast-moving. Backs away if approached." },
  { name:"Atlas mastic tree", sci:"Pistacia atlantica", kind:"Plant", danger:"None", habitat:"Arid mountains", note:"Drought-tolerant, edible resin." },
  { name:"Yellow scorpion", sci:"Buthus occitanus", kind:"Insect", danger:"Moderate", habitat:"Dry stones", note:"Sting painful, rarely dangerous to adults." },
];

function Wildlife() {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<typeof species[number] | null>(null);
  const [journal, setJournal] = useState<typeof species[number][]>([]);

  const scan = () => {
    setScanning(true); setResult(null);
    setTimeout(()=>{
      setResult(species[Math.floor(Math.random()*species.length)]);
      setScanning(false);
    }, 1400);
  };

  return (
    <FeatureShell title="WildlifeID Lens" accent="Offline AI species ID">
      <div className="px-5 space-y-4">
        <div className="relative h-72 rounded-3xl overflow-hidden bg-gradient-to-br from-secondary/40 to-primary/30">
          <div className="absolute inset-0 flex items-center justify-center">
            <Leaf className="h-20 w-20 text-card/40" />
          </div>
          <div className="absolute inset-6 border-2 border-card/60 rounded-2xl" />
          <div className="absolute top-3 left-3 bg-card/90 backdrop-blur px-2 py-1 rounded-full text-[10px] font-bold">OFFLINE MODEL</div>
          {scanning && <div className="absolute inset-0 bg-card/20 backdrop-blur-sm flex items-center justify-center"><p className="text-card font-bold animate-pulse">Identifying…</p></div>}
        </div>
        <button onClick={scan} className="w-full bg-primary text-primary-foreground font-semibold py-4 rounded-2xl flex items-center justify-center gap-2"><Camera className="h-4 w-4" />Identify in frame</button>

        {result && (
          <div className="bg-card rounded-2xl p-4 shadow-[var(--shadow-card)] fade-in">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold">{result.name}</p>
                <p className="text-[11px] italic text-muted-foreground">{result.sci}</p>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${result.danger==="Moderate"?"bg-warning/20 text-warning-foreground":result.danger==="High"?"bg-danger/15 text-danger":"bg-success/15 text-success"}`}>{result.danger} risk</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">{result.kind} · {result.habitat}</p>
            <p className="text-sm mt-2 leading-relaxed">{result.note}</p>
            {result.danger!=="Low" && result.danger!=="None" && (
              <div className="mt-2 flex items-center gap-2 text-danger text-xs"><AlertTriangle className="h-3 w-3" />Keep distance, do not handle.</div>
            )}
            <button onClick={()=>{setJournal(j=>[result,...j]);toast.success("Saved to journal");}} className="mt-3 w-full bg-secondary text-secondary-foreground font-semibold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2"><Save className="h-4 w-4" />Add to journal</button>
          </div>
        )}

        <div className="bg-card rounded-2xl p-4 shadow-[var(--shadow-card)]">
          <p className="text-sm font-semibold flex items-center gap-2 mb-2"><BookOpen className="h-4 w-4 text-primary" />Field journal ({journal.length})</p>
          {journal.length===0 ? (
            <p className="text-[11px] text-muted-foreground">Sightings you save will appear here.</p>
          ) : (
            <ul className="space-y-1.5">
              {journal.map((s,i)=>(<li key={i} className="text-xs flex justify-between"><span>{s.name}</span><span className="text-muted-foreground">{s.kind}</span></li>))}
            </ul>
          )}
        </div>
      </div>
    </FeatureShell>
  );
}
