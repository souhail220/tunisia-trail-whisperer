import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FeatureShell } from "@/components/FeatureShell";
import { Star, Compass } from "lucide-react";

export const Route = createFileRoute("/features/starpath")({
  component: StarPath,
});

const constellations = [
  { name:"Ursa Major", x:25, y:30 },
  { name:"Cassiopeia", x:70, y:20 },
  { name:"Orion", x:45, y:65 },
  { name:"Polaris", x:50, y:15 },
];

function StarPath() {
  const [heading, setHeading] = useState(0);
  useEffect(()=>{
    const t = setInterval(()=>setHeading(h=>(h + 2 + Math.random()*3) % 360), 700);
    return ()=>clearInterval(t);
  },[]);
  const cardinal = ["N","NE","E","SE","S","SW","W","NW"][Math.round(heading/45) % 8];

  return (
    <FeatureShell title="StarPath" accent="Night sky compass · offline">
      <div className="px-5 space-y-4">
        <div className="relative h-[420px] rounded-3xl overflow-hidden bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900">
          {/* random stars */}
          {Array.from({length:60}).map((_,i)=>{
            const x = (i*73 % 100), y = ((i*131)%100);
            const s = (i%3)+1;
            return <div key={i} className="absolute rounded-full bg-card" style={{ left:`${x}%`, top:`${y}%`, width:s, height:s, opacity:0.3+(i%5)/10 }} />;
          })}
          {/* constellations */}
          {constellations.map(c=>(
            <div key={c.name} className="absolute" style={{ left:`${c.x}%`, top:`${c.y}%` }}>
              <Star className="h-5 w-5 text-warning fill-warning drop-shadow-[0_0_6px_rgba(255,200,0,0.8)]" />
              <span className="absolute left-6 top-0 text-[10px] font-bold text-card whitespace-nowrap">{c.name}</span>
            </div>
          ))}
          {/* compass overlay */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 h-32 w-32 rounded-full border-2 border-card/40 flex items-center justify-center backdrop-blur-sm">
            <div className="absolute inset-0 flex items-start justify-center pt-1 text-card text-[10px] font-bold">N</div>
            <div className="absolute inset-0 flex items-end justify-center pb-1 text-card/60 text-[10px] font-bold">S</div>
            <div className="absolute inset-0 flex items-center justify-start pl-1 text-card/60 text-[10px] font-bold">W</div>
            <div className="absolute inset-0 flex items-center justify-end pr-1 text-card/60 text-[10px] font-bold">E</div>
            <Compass className="h-12 w-12 text-warning transition-transform" style={{ transform:`rotate(${heading}deg)` }} />
          </div>
          <div className="absolute top-3 left-3 bg-black/40 backdrop-blur px-3 py-1.5 rounded-full text-card text-xs font-bold">{cardinal} · {Math.round(heading)}°</div>
        </div>

        <div className="bg-card rounded-2xl p-4 shadow-[var(--shadow-card)] grid grid-cols-3 gap-2 text-center">
          <div><p className="text-sm font-bold text-primary">36.40° N</p><p className="text-[10px] text-muted-foreground uppercase">Latitude</p></div>
          <div><p className="text-sm font-bold text-primary">10.14° E</p><p className="text-[10px] text-muted-foreground uppercase">Longitude</p></div>
          <div><p className="text-sm font-bold text-primary">{cardinal}</p><p className="text-[10px] text-muted-foreground uppercase">Heading</p></div>
        </div>

        <div className="bg-card rounded-2xl p-4 shadow-[var(--shadow-card)]">
          <p className="text-sm font-semibold mb-1">How it works</p>
          <p className="text-xs text-muted-foreground leading-relaxed">Point your camera at the night sky. We match constellations to the cached star catalog and use your gyroscope + compass to calculate cardinal direction without GPS.</p>
        </div>
      </div>
    </FeatureShell>
  );
}
