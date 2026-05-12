import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FeatureShell } from "@/components/FeatureShell";
import { LifeBuoy, MapPin, Phone, ChevronRight, Save, ChevronLeft } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/features/offline-emergency")({
  component: OfflineEmergency,
});

type Node = { q: string; options: { label: string; next?: string; advice?: string[] }[] };
const tree: Record<string, Node> = {
  root: { q: "What's happening?", options: [
    { label: "Injury", next: "injury" },
    { label: "I'm lost", next: "lost" },
    { label: "Bad weather", next: "weather" },
    { label: "Wildlife encounter", next: "wild" },
  ]},
  injury: { q: "Type of injury?", options: [
    { label: "Bleeding", advice: ["Apply firm pressure with cloth.","Elevate the wound above heart.","Do not remove embedded objects.","Call 197 once signal is back."] },
    { label: "Sprain / Fracture", advice: ["Immobilize the limb.","Apply cold if available.","Do not walk on injured leg.","Mark your GPS and stay put."] },
    { label: "Heat stroke", advice: ["Move to shade immediately.","Remove extra clothing.","Sip water slowly.","Cool neck/wrists with damp cloth."] },
  ]},
  lost: { q: "Last known landmark?", options: [
    { label: "Trail marker visible", advice: ["Stop. Don't wander.","Backtrack to last marker.","Check cached map.","Whistle 3 short bursts every minute."] },
    { label: "No marker", advice: ["STOP — Sit, Think, Observe, Plan.","Stay where you are if night.","Find shelter from wind.","Conserve phone battery."] },
  ]},
  weather: { q: "Conditions?", options: [
    { label: "Lightning", advice: ["Descend below tree line.","Avoid ridges & lone trees.","Crouch low, feet together.","Wait 30min after last strike."] },
    { label: "Sandstorm", advice: ["Cover mouth and eyes.","Find leeward side of rock.","Mark direction before vision drops.","Stay grouped."] },
  ]},
  wild: { q: "Animal type?", options: [
    { label: "Snake", advice: ["Back away slowly.","Do NOT try to catch.","If bitten: immobilize, no tourniquet.","Note color & pattern for medics."] },
    { label: "Wild boar", advice: ["Stay calm, back away.","Climb if possible.","Do not run directly.","Make yourself look large."] },
  ]},
};

function OfflineEmergency() {
  const [path, setPath] = useState<string[]>(["root"]);
  const [advice, setAdvice] = useState<string[] | null>(null);
  const [savedGps, setSavedGps] = useState<string | null>(null);
  const node = tree[path[path.length-1]];

  const back = () => {
    if (advice) { setAdvice(null); return; }
    if (path.length>1) setPath(p=>p.slice(0,-1));
  };

  return (
    <FeatureShell title="Offline Emergency" accent="Decision-tree guide · cached">
      <div className="px-5 space-y-4">
        <div className="bg-warning/15 rounded-2xl p-4 flex items-center gap-3">
          <LifeBuoy className="h-5 w-5 text-warning-foreground" />
          <div className="flex-1">
            <p className="text-xs font-bold">Offline-ready guide</p>
            <p className="text-[11px] text-muted-foreground">No internet required. Last sync 2h ago.</p>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-4 shadow-[var(--shadow-card)]">
          <div className="flex items-center gap-2 mb-1"><MapPin className="h-4 w-4 text-primary" /><p className="text-sm font-semibold">Last known GPS</p></div>
          <p className="text-xs text-muted-foreground">36.4029° N, 10.1358° E · Zaghouan</p>
          <button onClick={()=>{setSavedGps("36.4029, 10.1358");toast.success("Position saved");}} className="mt-3 w-full bg-primary text-primary-foreground font-semibold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2"><Save className="h-4 w-4" /> Save my position</button>
          {savedGps && <p className="text-[11px] text-success mt-2">Saved: {savedGps}</p>}
        </div>

        <div className="bg-card rounded-2xl p-4 shadow-[var(--shadow-card)]">
          {(path.length>1 || advice) && (
            <button onClick={back} className="text-xs text-primary font-semibold flex items-center gap-1 mb-2"><ChevronLeft className="h-3 w-3" /> Back</button>
          )}
          {!advice ? (
            <>
              <p className="font-bold text-base mb-3">{node.q}</p>
              <div className="space-y-2">
                {node.options.map(o => (
                  <button key={o.label} onClick={()=>{ if (o.next) setPath(p=>[...p,o.next!]); else if (o.advice) setAdvice(o.advice); }}
                    className="w-full bg-muted hover:bg-accent rounded-xl px-4 py-3 text-sm font-medium flex items-center justify-between">
                    {o.label}<ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </>
          ) : (
            <ol className="space-y-2 list-decimal pl-5">
              {advice.map((a,i)=>(<li key={i} className="text-sm leading-relaxed">{a}</li>))}
            </ol>
          )}
        </div>

        <div className="bg-card rounded-2xl p-4 shadow-[var(--shadow-card)]">
          <p className="text-sm font-semibold mb-2">Emergency contacts (cached)</p>
          {[
            { n: "Civil Protection", p: "197" },
            { n: "Garde Nationale", p: "193" },
            { n: "SAMU", p: "190" },
            { n: "Trusted contact — Sami", p: "+216 22 000 000" },
          ].map(c=>(
            <a key={c.n} href={`tel:${c.p}`} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <span className="text-sm">{c.n}</span>
              <span className="text-xs font-bold text-primary flex items-center gap-1"><Phone className="h-3 w-3" />{c.p}</span>
            </a>
          ))}
        </div>
      </div>
    </FeatureShell>
  );
}
