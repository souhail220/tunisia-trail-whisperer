import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { MobileShell } from "@/components/MobileShell";
import { TrailCard } from "@/components/TrailCard";
import { trails } from "@/lib/mock-data";
import { Search, SlidersHorizontal, Sparkles, Mountain, Clock, Star, Backpack } from "lucide-react";
import { toast } from "sonner";
import mapBg from "@/assets/map-bg.jpg";
import { ThermalPill, WildlifeChips, GearChecklistSheet } from "@/components/feature-sheets";


export const Route = createFileRoute("/explore")({
  head: () => ({ meta: [{ title: "Explore — TrailMate Tunisia" }, { name: "description", content: "Discover Tunisian trails on an interactive map." }] }),
  component: ExplorePage,
});

const filters = ["All", "Easy", "Moderate", "Hard", "Expert", "< 5km", "Coast", "Desert", "Forest"];

function ExplorePage() {
  const [active, setActive] = useState("All");
  const [query, setQuery] = useState("");
  const [gearOpen, setGearOpen] = useState(false);


  const visible = useMemo(() => {
    return trails.filter(t => {
      if (query && !`${t.name} ${t.region}`.toLowerCase().includes(query.toLowerCase())) return false;
      if (active === "All") return true;
      if (["Easy","Moderate","Hard","Expert"].includes(active)) return t.difficulty === active;
      if (active === "< 5km") return t.distanceKm < 5;
      if (active === "Coast") return t.tags.includes("coast");
      if (active === "Desert") return t.tags.includes("desert");
      if (active === "Forest") return t.tags.includes("forest");
      return true;
    });
  }, [active, query]);

  const featured = trails[0];

  return (
    <MobileShell>
      <div>
        <div className="px-5 pt-10 pb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-[11px] font-semibold text-primary uppercase tracking-wide">
              <Sparkles className="h-3.5 w-3.5" /> Recommended trip
            </div>
            <span className="text-[10px] font-semibold text-danger bg-danger/10 px-2 py-0.5 rounded-full animate-pulse">
              3 of 12 spots left
            </span>
          </div>
          <div className="relative rounded-3xl overflow-hidden shadow-[var(--shadow-float)]">
            <Link to="/trail/$id" params={{ id: featured.id }} className="block">
              <img src={featured.image} alt={featured.name} className="w-full h-56 object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                <Star className="h-3 w-3 fill-current" /> EDITOR'S PICK
              </span>
              <div className="absolute top-3 right-3 bg-background/95 text-foreground text-[10px] font-semibold px-2.5 py-1 rounded-full">
                3 / 12 left
              </div>
              <div className="absolute bottom-16 left-0 right-0 px-4 text-white">
                <h2 className="font-bold text-xl leading-tight">{featured.name}</h2>
                <p className="text-xs opacity-90 mt-0.5">{featured.region} · {featured.difficulty}</p>
                <div className="flex items-center gap-4 mt-2 text-[11px]">
                  <span className="flex items-center gap-1"><Mountain className="h-3 w-3" />{featured.distanceKm} km</span>
                  <span className="flex items-center gap-1">↑ {featured.elevationM} m</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{featured.durationH}h</span>
                </div>
              </div>
            </Link>
            <div className="absolute bottom-0 left-0 right-0 p-3 flex gap-2 bg-gradient-to-t from-black/90 to-transparent pt-8">
              <Link to="/generate" className="flex-1 bg-primary text-primary-foreground text-xs font-semibold py-2.5 rounded-xl text-center">
                Plan trip
              </Link>
              <Link to="/hike/$id" params={{ id: featured.id }} onClick={()=>toast.success(`Reserved your spot on ${featured.name}`)} className="flex-1 bg-background text-foreground text-xs font-semibold py-2.5 rounded-xl text-center">
                Reserve now
              </Link>
            </div>
          </div>
          {/* Wildlife + gear extras */}
          <div className="mt-3 bg-card rounded-2xl p-3 shadow-[var(--shadow-card)] space-y-3">
            <div>
              <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1.5">Wildlife on this trail</p>
              <WildlifeChips trailId={featured.id} />
            </div>
            <button onClick={()=>setGearOpen(true)} className="w-full flex items-center justify-between text-xs font-semibold text-primary">
              <span className="flex items-center gap-2"><Backpack className="h-3.5 w-3.5" />Prepare for this trail</span>
              <span>→</span>
            </button>
          </div>
        </div>


        <div className="relative h-[420px]">
          <img src={mapBg} alt="Trail map" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-transparent to-background" />
          <div className="absolute top-0 left-0 right-0 px-5 pt-12">
            <div className="bg-background rounded-2xl shadow-[var(--shadow-card)] flex items-center gap-2 px-4 py-3">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search trails, regions…" className="flex-1 bg-transparent outline-none text-sm" />
              <button onClick={()=>toast("Advanced filters coming soon")} className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center">
                <SlidersHorizontal className="h-4 w-4 text-primary" />
              </button>
            </div>
            <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar pb-1">
              {filters.map(f => (
                <button key={f} onClick={() => setActive(f)} className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-semibold border transition ${active===f ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border text-foreground"}`}>{f}</button>
              ))}
            </div>
          </div>
          {trails.slice(0,4).map((t,i) => (
            <Link key={t.id} to="/trail/$id" params={{ id: t.id }} className="absolute" style={{ top: `${30+i*15}%`, left: `${20+i*18}%` }}>
              <span className="block h-3 w-3 rounded-full bg-primary ring-4 ring-primary/20 animate-pulse" />
            </Link>
          ))}
        </div>

        <div className="-mt-20 relative z-10">
          <div className="px-5 mb-2 flex items-center justify-between">
            <h2 className="font-bold text-lg">Trails near you</h2>
            <Link to="/routes" className="text-xs font-semibold text-primary">See all</Link>
          </div>
          {visible.length === 0 ? (
            <div className="mx-5 bg-card rounded-2xl p-6 text-center">
              <p className="text-3xl">🔍</p>
              <p className="font-semibold mt-2 text-sm">No trails match</p>
              <button onClick={()=>{setQuery("");setActive("All");}} className="mt-3 text-xs font-semibold text-primary">Clear filters</button>
            </div>
          ) : (
            <div className="flex gap-3 overflow-x-auto no-scrollbar px-5 pb-2">
              {visible.map(t => (
                <div key={t.id} className="relative">
                  <Link to="/trail/$id" params={{ id: t.id }} className="block">
                    <TrailCard trail={t} compact />
                  </Link>
                  <div className="absolute top-2 right-10">
                    <ThermalPill region={t.region} />
                  </div>
                </div>
              ))}
            </div>

          )}
        </div>

        <div className="mx-5 mt-6 rounded-3xl bg-gradient-to-br from-primary to-[oklch(0.38_0.18_290)] p-5 text-primary-foreground shadow-[var(--shadow-float)]">
          <div className="flex items-center gap-2 text-xs font-semibold opacity-90"><Sparkles className="h-4 w-4" /> AI ROUTE GENERATOR</div>
          <h3 className="text-xl font-bold mt-2 leading-tight">Plan a perfect hike in 30 seconds</h3>
          <p className="text-xs opacity-80 mt-1">Tell us your level, time and mood — we'll craft 3 routes.</p>
          <Link to="/generate" className="mt-4 inline-block bg-background text-primary font-semibold text-sm px-4 py-2.5 rounded-xl">Generate my route →</Link>
        </div>

      </div>
    </MobileShell>
  );
}
