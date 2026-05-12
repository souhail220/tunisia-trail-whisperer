import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { FeatureShell } from "@/components/FeatureShell";
import { Mic, Users, Radio } from "lucide-react";

export const Route = createFileRoute("/features/radio")({
  component: RadioMode,
});

const channels = [1,2,3,4,5,6,7];
const seedUsers = [
  { id: "Sami", dist: "0.4km", talking: false },
  { id: "Leila", dist: "0.9km", talking: false },
  { id: "Karim", dist: "1.6km", talking: false },
  { id: "Nour", dist: "2.1km", talking: false },
];

function RadioMode() {
  const [channel, setChannel] = useState(3);
  const [holding, setHolding] = useState(false);
  const [users, setUsers] = useState(seedUsers);
  const [log, setLog] = useState<{u:string;t:string}[]>([{u:"Sami",t:"Reaching the ridge in 5"}]);
  const timer = useRef<number | null>(null);

  useEffect(()=>{
    const t = setInterval(()=>{
      setUsers(u => u.map(x => ({...x, talking: Math.random()>0.85})));
    }, 1500);
    return ()=>clearInterval(t);
  },[]);

  const start = () => {
    setHolding(true);
    timer.current = window.setTimeout(()=>{
      setLog(l=>[{u:"You",t:`(voice clip · ch${channel})`}, ...l]);
    }, 600);
  };
  const stop = () => {
    setHolding(false);
    if (timer.current) clearTimeout(timer.current);
  };

  return (
    <FeatureShell title="RadioMode" accent="Walkie-talkie · BT/WiFi Direct">
      <div className="px-5 space-y-4">
        <div className="bg-card rounded-2xl p-4 shadow-[var(--shadow-card)]">
          <p className="text-sm font-semibold mb-2 flex items-center gap-2"><Radio className="h-4 w-4 text-primary" /> Channel</p>
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {channels.map(c => (
              <button key={c} onClick={()=>setChannel(c)} className={`min-w-12 h-12 rounded-xl text-sm font-bold ${channel===c?"bg-primary text-primary-foreground":"bg-muted text-muted-foreground"}`}>{c}</button>
            ))}
          </div>
          <p className="text-[11px] text-muted-foreground mt-2">Range ~1–3km · low-bandwidth voice codec</p>
        </div>

        <div className="bg-card rounded-2xl p-4 shadow-[var(--shadow-card)]">
          <p className="text-sm font-semibold mb-2 flex items-center gap-2"><Users className="h-4 w-4 text-primary" /> Nearby on ch{channel}</p>
          <div className="space-y-2">
            {users.map(u=>(
              <div key={u.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${u.talking?"bg-success text-success-foreground animate-pulse":"bg-muted"}`}>{u.id[0]}</div>
                  <div>
                    <p className="text-sm font-semibold">{u.id}</p>
                    <p className="text-[11px] text-muted-foreground">{u.dist}</p>
                  </div>
                </div>
                {u.talking && <span className="text-[10px] font-bold text-success">TALKING</span>}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-2xl p-4 shadow-[var(--shadow-card)]">
          <p className="text-sm font-semibold mb-2">Recent</p>
          {log.map((l,i)=>(
            <div key={i} className="flex justify-between py-1.5 border-b border-border last:border-0">
              <span className="text-sm font-medium">{l.u}</span>
              <span className="text-xs text-muted-foreground">{l.t}</span>
            </div>
          ))}
        </div>

        <button
          onMouseDown={start} onMouseUp={stop} onMouseLeave={stop}
          onTouchStart={start} onTouchEnd={stop}
          className={`w-full py-6 rounded-3xl font-bold text-base flex items-center justify-center gap-2 select-none ${holding?"bg-danger text-danger-foreground scale-[.98]":"bg-primary text-primary-foreground"} transition-transform shadow-[var(--shadow-float)]`}
        >
          <Mic className={`h-6 w-6 ${holding?"animate-pulse":""}`} /> {holding?"Transmitting…":"Hold to talk"}
        </button>
      </div>
    </FeatureShell>
  );
}
