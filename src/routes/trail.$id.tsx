import { createFileRoute, notFound, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { MobileShell } from "@/components/MobileShell";
import { trails, difficultyColor, thermalRiskFor } from "@/lib/mock-data";
import { ChevronLeft, MapPin, Mountain, Clock, Bookmark, Play, Mic, TrendingUp, Share2, Map, Backpack, ThermometerSun } from "lucide-react";
import { toast } from "sonner";
import { ThermalRiskSheet, WildlifeRow, GearChecklistSheet, AROverlaySheet } from "@/components/feature-sheets";


export const Route = createFileRoute("/trail/$id")({
  component: TrailDetail,
});

function TrailDetail() {
  const { id } = Route.useParams();
  const router = useRouter();
  const trail = trails.find(t => t.id === id);
  if (!trail) throw notFound();

  const [saved, setSaved] = useState(false);

  const back = () => {
    if (typeof window !== "undefined" && window.history.length > 1) router.history.back();
    else router.navigate({ to: "/explore" });
  };

  const share = async () => {
    const data = { title: trail.name, text: `Check out ${trail.name} on TrailMate`, url: typeof window !== "undefined" ? window.location.href : "" };
    try {
      if (typeof navigator !== "undefined" && (navigator as any).share) {
        await (navigator as any).share(data);
      } else {
        toast.success("Link copied to clipboard");
      }
    } catch {}
  };

  return (
    <MobileShell>
      <div className="relative">
        <img src={trail.image} alt={trail.name} className="w-full h-72 object-cover" />
        <button onClick={back} className="absolute top-6 left-5 h-10 w-10 rounded-2xl bg-background/90 flex items-center justify-center" aria-label="Back"><ChevronLeft className="h-5 w-5" /></button>
        <div className="absolute top-6 right-5 flex gap-2">
          <button onClick={share} className="h-10 w-10 rounded-2xl bg-background/90 flex items-center justify-center" aria-label="Share"><Share2 className="h-5 w-5 text-primary" /></button>
          <button onClick={()=>{setSaved(s=>!s); toast(saved ? "Removed from saved" : "Saved to your routes");}} className="h-10 w-10 rounded-2xl bg-background/90 flex items-center justify-center" aria-label="Save">
            <Bookmark className={`h-5 w-5 text-primary ${saved ? "fill-primary" : ""}`} />
          </button>
        </div>
      </div>

      <div className="px-5 -mt-8 relative">
        <div className="bg-card rounded-3xl p-5 shadow-[var(--shadow-card)]">
          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${difficultyColor(trail.difficulty)}`}>{trail.difficulty}</span>
          <h1 className="text-xl font-bold mt-2">{trail.name}</h1>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><MapPin className="h-3 w-3" />{trail.region}, Tunisia</p>
          <div className="grid grid-cols-3 gap-2 mt-4 text-center">
            <Stat icon={Mountain} v={`${trail.distanceKm} km`} l="distance" />
            <Stat icon={TrendingUp} v={`${trail.elevationM} m`} l="ascent" />
            <Stat icon={Clock} v={`${trail.durationH}h`} l="time" />
          </div>
          <p className="text-sm text-muted-foreground mt-4 leading-relaxed">{trail.description}</p>
        </div>

        <button onClick={()=>toast("AI Companion ready — open AI Guide tab")} className="w-full text-left bg-primary/5 border border-primary/20 rounded-2xl p-4 mt-4 flex items-start gap-3">
          <div className="h-9 w-9 rounded-xl bg-primary/15 flex items-center justify-center"><Mic className="h-4 w-4 text-primary" /></div>
          <div className="flex-1">
            <p className="font-semibold text-sm">AI Companion ready</p>
            <p className="text-[11px] text-muted-foreground">Pace tracking, behavioral alerts & voice commands</p>
          </div>
        </button>

        <button onClick={()=>{toast.success(`Started: ${trail.name}`); router.navigate({ to: "/hike/$id", params: { id: trail.id } });}} className="mt-6 w-full bg-primary text-primary-foreground font-semibold py-4 rounded-2xl shadow-[var(--shadow-float)] flex items-center justify-center gap-2">
          <Play className="h-4 w-4 fill-current" /> Start hike
        </button>
      </div>
    </MobileShell>
  );
}

function Stat({ icon: I, v, l }: any) {
  return (
    <div className="bg-background rounded-xl py-2">
      <I className="h-4 w-4 text-primary mx-auto mb-1" />
      <p className="text-sm font-bold">{v}</p>
      <p className="text-[10px] text-muted-foreground uppercase">{l}</p>
    </div>
  );
}
