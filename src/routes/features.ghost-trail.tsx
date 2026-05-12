import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FeatureShell } from "@/components/FeatureShell";
import { Footprints, Lock, Key, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/features/ghost-trail")({
  component: GhostTrail,
});

function GhostTrail() {
  const [active, setActive] = useState(true);
  const [interval2, setInterval2] = useState(5);
  const [autoDelete, setAutoDelete] = useState(24);
  const [share, setShare] = useState(true);
  const [crumbs, setCrumbs] = useState<{lat:string;lng:string;t:string}[]>([
    { lat:"36.4029", lng:"10.1358", t:"08:14" },
    { lat:"36.4035", lng:"10.1361", t:"08:19" },
    { lat:"36.4041", lng:"10.1370", t:"08:24" },
  ]);
  const [revealed, setRevealed] = useState(false);

  useEffect(()=>{
    if (!active) return;
    const t = setInterval(()=>{
      setCrumbs(c=>[...c, { lat:(36.4 + Math.random()*0.02).toFixed(4), lng:(10.13 + Math.random()*0.02).toFixed(4), t:new Date().toLocaleTimeString().slice(0,5) }]);
    }, 6000);
    return ()=>clearInterval(t);
  },[active]);

  return (
    <FeatureShell title="GhostTrail" accent="Encrypted GPS breadcrumbs">
      <div className="px-5 space-y-4">
        <div className="bg-card rounded-2xl p-4 shadow-[var(--shadow-card)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-primary/10 flex items-center justify-center"><Footprints className="h-5 w-5 text-primary" /></div>
            <div>
              <p className="font-bold text-sm">Dropping breadcrumbs</p>
              <p className="text-[11px] text-muted-foreground">AES-256 encrypted · BT broadcast</p>
            </div>
          </div>
          <button onClick={()=>setActive(a=>!a)} className={`px-3 py-2 rounded-xl text-xs font-bold ${active?"bg-success text-success-foreground":"bg-muted text-muted-foreground"}`}>{active?"ON":"OFF"}</button>
        </div>

        <div className="bg-card rounded-2xl p-4 shadow-[var(--shadow-card)] space-y-3">
          <div>
            <div className="flex justify-between text-[11px] font-semibold text-muted-foreground"><span>Drop interval</span><span>{interval2} min</span></div>
            <input type="range" min={1} max={30} value={interval2} onChange={e=>setInterval2(+e.target.value)} className="w-full accent-primary" />
          </div>
          <div>
            <div className="flex justify-between text-[11px] font-semibold text-muted-foreground"><span>Auto-delete after</span><span>{autoDelete}h</span></div>
            <input type="range" min={1} max={72} value={autoDelete} onChange={e=>setAutoDelete(+e.target.value)} className="w-full accent-primary" />
          </div>
          <button onClick={()=>setShare(s=>!s)} className="w-full flex items-center justify-between bg-muted rounded-xl px-3 py-2 text-sm">
            <span>Share with nearby hikers</span>
            <span className={`text-xs font-bold ${share?"text-success":"text-muted-foreground"}`}>{share?"ON":"OFF"}</span>
          </button>
        </div>

        <div className="bg-card rounded-2xl p-4 shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold flex items-center gap-2"><Lock className="h-4 w-4 text-primary" /> Encrypted trail ({crumbs.length})</p>
            <button onClick={()=>setRevealed(r=>!r)} className="text-xs text-primary font-semibold flex items-center gap-1">{revealed?<EyeOff className="h-3 w-3" />:<Eye className="h-3 w-3" />}{revealed?"Hide":"Reveal"}</button>
          </div>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {crumbs.map((c,i)=>(
              <div key={i} className="flex justify-between text-xs font-mono py-1 border-b border-border last:border-0">
                <span className="text-muted-foreground">{c.t}</span>
                <span>{revealed ? `${c.lat}, ${c.lng}` : "•••• ••••"}</span>
              </div>
            ))}
          </div>
          <button onClick={()=>{navigator.clipboard?.writeText("rescue-key-XJ29-7AKL"); toast.success("Rescue key copied");}} className="mt-3 w-full bg-primary text-primary-foreground font-semibold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2"><Key className="h-4 w-4" /> Copy rescue key</button>
        </div>
      </div>
    </FeatureShell>
  );
}
