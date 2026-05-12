import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FeatureShell } from "@/components/FeatureShell";
import { ShieldAlert, Activity, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/features/safety-watch")({
  component: SafetyWatch,
});

function SafetyWatch() {
  const [enabled, setEnabled] = useState(true);
  const [sensitivity, setSensitivity] = useState(2);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [event, setEvent] = useState<string | null>(null);

  useEffect(() => {
    if (countdown === null) return;
    if (countdown <= 0) {
      toast.error("SOS dispatched to emergency contacts");
      setCountdown(null); setEvent(null); return;
    }
    const t = setTimeout(() => setCountdown(c => (c ?? 0) - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const simulate = (ev: string) => { setEvent(ev); setCountdown(15); };

  return (
    <FeatureShell title="AI Safety Watch" accent="Background sensor monitoring">
      <div className="px-5 space-y-4">
        <div className="bg-card rounded-2xl p-4 shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-2xl bg-danger/10 flex items-center justify-center"><ShieldAlert className="h-5 w-5 text-danger" /></div>
              <div>
                <p className="font-bold text-sm">Monitoring active</p>
                <p className="text-[11px] text-muted-foreground">Accelerometer · Gyro · Activity</p>
              </div>
            </div>
            <button onClick={()=>setEnabled(e=>!e)} className={`px-3 py-2 rounded-xl text-xs font-bold ${enabled?"bg-success text-success-foreground":"bg-muted text-muted-foreground"}`}>{enabled?"ON":"OFF"}</button>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-4 shadow-[var(--shadow-card)]">
          <p className="text-sm font-semibold mb-2">Sensitivity</p>
          <div className="flex gap-2">
            {["Low","Balanced","High"].map((l,i)=>(
              <button key={l} onClick={()=>setSensitivity(i+1)} className={`flex-1 py-2 rounded-full text-xs font-semibold border ${sensitivity===i+1?"bg-primary text-primary-foreground border-primary":"border-border"}`}>{l}</button>
            ))}
          </div>
          <p className="text-[11px] text-muted-foreground mt-2">Higher sensitivity reacts faster but may produce more alerts.</p>
        </div>

        <div className="bg-card rounded-2xl p-4 shadow-[var(--shadow-card)]">
          <p className="text-sm font-semibold mb-3">Live signals</p>
          <div className="grid grid-cols-3 gap-2 text-center">
            {[{l:"Motion",v:"0.42g"},{l:"Tilt",v:"12°"},{l:"Steps/min",v:"58"}].map(s=>(
              <div key={s.l} className="bg-muted rounded-xl p-2">
                <p className="text-sm font-bold text-primary">{s.v}</p>
                <p className="text-[10px] text-muted-foreground uppercase font-semibold">{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-2xl p-4 shadow-[var(--shadow-card)]">
          <p className="text-sm font-semibold mb-2">Simulate event</p>
          <div className="flex flex-wrap gap-2">
            {[{i:Activity,t:"Fall detected"},{i:AlertTriangle,t:"Inactivity 10min"},{i:ShieldAlert,t:"Sudden spin"}].map(({i:I,t})=>(
              <button key={t} onClick={()=>simulate(t)} className="flex items-center gap-1.5 bg-danger/10 text-danger rounded-full px-3 py-2 text-xs font-semibold"><I className="h-3.5 w-3.5"/>{t}</button>
            ))}
          </div>
        </div>

        {countdown !== null && (
          <div className="bg-danger text-danger-foreground rounded-2xl p-5 fade-in">
            <p className="text-xs font-semibold uppercase opacity-90">{event}</p>
            <p className="text-3xl font-bold mt-1">SOS in {countdown}s</p>
            <p className="text-xs opacity-90 mt-1">Move your phone or tap cancel to abort.</p>
            <button onClick={()=>{setCountdown(null);setEvent(null);}} className="mt-3 w-full bg-card text-foreground font-bold py-3 rounded-xl">Cancel</button>
          </div>
        )}
      </div>
    </FeatureShell>
  );
}
