import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FeatureShell } from "@/components/FeatureShell";
import { Upload, Star, Filter, Download, MessageCircle, AlertTriangle, Camera } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/features/share-route")({
  component: ShareRoute,
});

const seed = [
  { id:"r1", name:"Cap Bon coastal loop", author:"Leila", diff:3, type:"Coast", rating:4.7, comments:12, hazards:["river crossing"], photos:4 },
  { id:"r2", name:"Zaghouan summit", author:"Sami", diff:5, type:"Mountain", rating:4.9, comments:34, hazards:["slippery rocks","wind"], photos:7 },
  { id:"r3", name:"Tamerza canyon", author:"Nour", diff:2, type:"Desert", rating:4.4, comments:8, hazards:[], photos:3 },
];

function ShareRoute() {
  const [tab, setTab] = useState<"browse"|"upload">("browse");
  const [filter, setFilter] = useState<string>("all");
  const filtered = seed.filter(r => filter==="all" || r.type.toLowerCase()===filter);

  return (
    <FeatureShell title="Route Sharing" accent="Community-uploaded trails">
      <div className="px-5">
        <div className="bg-muted rounded-2xl p-1 grid grid-cols-2 text-xs font-semibold">
          {["browse","upload"].map(t=>(
            <button key={t} onClick={()=>setTab(t as any)} className={`py-2 rounded-xl capitalize ${tab===t?"bg-card shadow-[var(--shadow-card)]":""}`}>{t}</button>
          ))}
        </div>
      </div>

      {tab==="browse" && (
        <div className="px-5 mt-4 space-y-3">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            <Filter className="h-4 w-4 text-muted-foreground self-center shrink-0" />
            {["all","mountain","coast","desert","forest"].map(f=>(
              <button key={f} onClick={()=>setFilter(f)} className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize whitespace-nowrap ${filter===f?"bg-primary text-primary-foreground":"bg-card"}`}>{f}</button>
            ))}
          </div>
          {filtered.map(r=>(
            <div key={r.id} className="bg-card rounded-2xl p-4 shadow-[var(--shadow-card)]">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-sm">{r.name}</p>
                  <p className="text-[11px] text-muted-foreground">by {r.author} · {r.type} · diff {r.diff}/5</p>
                </div>
                <span className="flex items-center gap-1 text-xs font-bold"><Star className="h-3 w-3 fill-warning text-warning" />{r.rating}</span>
              </div>
              <div className="flex items-center gap-3 mt-2 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1"><Camera className="h-3 w-3" />{r.photos}</span>
                <span className="flex items-center gap-1"><MessageCircle className="h-3 w-3" />{r.comments}</span>
                {r.hazards.length>0 && <span className="flex items-center gap-1 text-danger"><AlertTriangle className="h-3 w-3" />{r.hazards.join(", ")}</span>}
              </div>
              <div className="flex gap-2 mt-3">
                <button onClick={()=>toast.success("GPX downloaded")} className="flex-1 bg-primary text-primary-foreground text-xs font-semibold py-2 rounded-xl flex items-center justify-center gap-1"><Download className="h-3 w-3" />Download</button>
                <button onClick={()=>toast("Opened comments")} className="px-4 bg-muted text-xs font-semibold py-2 rounded-xl">Comments</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab==="upload" && (
        <div className="px-5 mt-4 space-y-3">
          <div className="bg-card rounded-2xl p-6 border-2 border-dashed border-border text-center">
            <Upload className="h-8 w-8 mx-auto text-primary mb-2" />
            <p className="text-sm font-semibold">Drop your recorded GPX</p>
            <p className="text-[11px] text-muted-foreground">or pick from recent hikes</p>
          </div>
          <input className="w-full bg-card rounded-xl px-4 py-3 text-sm" placeholder="Trail name" />
          <div className="grid grid-cols-2 gap-2">
            <select className="bg-card rounded-xl px-3 py-3 text-sm">
              <option>Mountain</option><option>Coast</option><option>Desert</option><option>Forest</option>
            </select>
            <select className="bg-card rounded-xl px-3 py-3 text-sm">
              {[1,2,3,4,5].map(n=>(<option key={n}>Difficulty {n}</option>))}
            </select>
          </div>
          <div className="bg-card rounded-2xl p-4">
            <p className="text-sm font-semibold mb-2">Hazard markers</p>
            <div className="flex flex-wrap gap-2">
              {["Slippery","River crossing","Loose rocks","Wildlife","Exposure"].map(h=>(
                <button key={h} className="px-3 py-1.5 rounded-full text-xs font-semibold bg-muted">{h}</button>
              ))}
            </div>
          </div>
          <button onClick={()=>toast.success("Trail published to community")} className="w-full bg-primary text-primary-foreground font-semibold py-4 rounded-2xl">Publish trail</button>
        </div>
      )}
    </FeatureShell>
  );
}
