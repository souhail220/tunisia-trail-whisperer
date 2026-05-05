import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { MobileShell } from "@/components/MobileShell";
import { TrailCard } from "@/components/TrailCard";
import { trails } from "@/lib/mock-data";
import { Search, SlidersHorizontal, Sparkles, Mountain, Clock, Star } from "lucide-react";
import { toast } from "sonner";
import mapBg from "@/assets/map-bg.jpg";

export const Route = createFileRoute("/explore")({
  head: () => ({ meta: [{ title: "Explore — TrailMate Tunisia" }, { name: "description", content: "Discover Tunisian trails on an interactive map." }] }),
  component: ExplorePage,
});

const filters = ["All", "Easy", "Moderate", "Hard", "Expert", "< 5km", "Coast", "Desert", "Forest"];

function ExplorePage() {
  const [active, setActive] = useState("All");
  const [query, setQuery] = useState("");

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

  return (
    <MobileShell>
      <div>
        <div className="relative h-[460px]">
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
                <Link key={t.id} to="/trail/$id" params={{ id: t.id }} className="block">
                  <TrailCard trail={t} compact />
                </Link>
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
