import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FeatureShell } from "@/components/FeatureShell";
import { Radio, Bluetooth, Wifi, WifiOff, Users } from "lucide-react";

export const Route = createFileRoute("/features/mesh-sos")({
  component: MeshSos;
});

const peers = [
  { id: "TM-9F2A", dist: "120m", relayed: true },
  { id: "TM-7C11", dist: "340m", relayed: true },
  { id: "TM-5B88", dist: "0.9km", relayed: false },
  { id: "TM-2D44", dist: "1.4km", relayed: false },
];

function MeshSos() {
  const [active, setActive] = useState(false);
  const [hops, setHops] = useState(0);
  const [reached, setReached] = useState(false);
  const [listening, setListening] = useState(true);

  useEffect(() => {
    if (!active) return;
    setHops(0); setReached(false);
    const ints = [800, 1400, 1200, 1600];
    const ts: number[] = [];
    let acc = 0;
    ints.forEach((d,i)=>{
      acc += d;
      ts.push(window.setTimeout(()=>{ setHops(i+1); if (i===ints.length-1) setReached(true); }, acc));
    });
    return () => ts.forEach(t=>clearTimeout(t));
  }, [active]);

  return (
    <FeatureShell title="Mesh SOS Network" accent="Bluetooth peer-to-peer relay">
      <div className="px-5 space-y-4">
        <div className="bg-card rounded-2xl p-4 shadow-[var(--shadow-card)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-primary/10 flex items-center justify-center"><Bluetooth className="h-5 w-5 text-primary" /></div>
            <div>
              <p className="font-bold text-sm">Background relay</p>
              <p className="text-[11px] text-muted-foreground">Silently forwards SOS packets</p>
            </div>
          </div>
          <button onClick={()=>setListening(l=>!l)} className={`px-3 py-2 rounded-xl text-xs font-bold ${listening?"bg-success text-success-foreground":"bg-muted text-muted-foreground"}`}>{listening?"ON":"OFF"}</button>
        </div>

        <div className="bg-card rounded-2xl p-4 shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold flex items-center gap-2"><WifiOff className="h-4 w-4 text-danger" /> No cell signal</p>
            <span className="text-[10px] font-bold bg-warning/20 text-warning-foreground px-2 py-0.5 rounded-full">MESH MODE</span>
          </div>
          <p className="text-[11px] text-muted-foreground">Your SOS will hop through nearby devices until one reaches the internet.</p>
          <button onClick={()=>setActive(true)} className="mt-3 w-full bg-danger text-danger-foreground font-bold py-4 rounded-2xl text-sm">Trigger SOS via mesh</button>
        </div>

        {active && (
          <div className="bg-card rounded-2xl p-4 shadow-[var(--shadow-card)] fade-in">
            <p className="text-sm font-semibold mb-3">Relay status</p>
            <div className="space-y-2">
              {peers.map((p,i)=>{
                const done = i < hops;
                return (
                  <div key={p.id} className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${done?"bg-success text-success-foreground":"bg-muted text-muted-foreground"}`}>
                      <Radio className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold">{p.id}</p>
                      <p className="text-[11px] text-muted-foreground">{p.dist} · {done?"relayed":"pending"}</p>
                    </div>
                    {done && <span className="text-[10px] font-bold text-success">HOP {i+1}</span>}
                  </div>
                );
              })}
            </div>
            {reached && (
              <div className="mt-4 bg-success/15 rounded-xl p-3 flex items-center gap-2">
                <Wifi className="h-4 w-4 text-success" />
                <p className="text-xs font-semibold">Reached connected device — alert sent to 197</p>
              </div>
            )}
          </div>
        )}

        <div className="bg-card rounded-2xl p-4 shadow-[var(--shadow-card)]">
          <p className="text-sm font-semibold flex items-center gap-2 mb-2"><Users className="h-4 w-4 text-primary" /> Nearby mesh peers</p>
          <p className="text-[11px] text-muted-foreground">{peers.length} devices in range</p>
        </div>
      </div>
    </FeatureShell>
  );
}
