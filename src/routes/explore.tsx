import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { MobileShell } from "@/components/MobileShell";
import { TrailCard } from "@/components/TrailCard";
import { trails, guides } from "@/lib/mock-data";
import { Search, SlidersHorizontal, MapPin, BadgeCheck, Star, Sparkles } from "lucide-react";
import mapBg from "@/assets/map-bg.jpg";

export const Route = createFileRoute("/explore")({
  head: () => ({ meta: [{ title: "Explore — TrailMate Tunisia" }, { name: "description", content: "Discover Tunisian trails on an interactive map." }] }),
  component: ExplorePage,
});

const filters = ["All", "Easy", "Moderate", "Hard", "Expert", "< 5km", "Coast", "Desert", "Forest"];

function ExplorePage() {
  const [active, setActive] = useState("All");
  return (
    <MobileShell>
      <div>
        <div className="relative h-[460px]">
          <img src={mapBg} alt="Trail map" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-transparent to-background" />
          <div className="absolute top-0 left-0 right-0 px-5 pt-12">
            <div className="bg-background rounded-2xl shadow-[var(--shadow-card)] flex items-center gap-2 px-4 py-3">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input placeholder="Search trails, regions…" className="flex-1 bg-transparent outline-none text-sm" />
              <button className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center">
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
            <div key={t.id} className="absolute" style={{ top: `${30+i*15}%`, left: `${20+i*18}%` }}>
              <div className="h-3 w-3 rounded-full bg-primary ring-4 ring-primary/20 animate-pulse" />
            </div>
          ))}
        </div>

        <div className="-mt-20 relative z-10">
          <div className="px-5 mb-2 flex items-center justify-between">
            <h2 className="font-bold text-lg">Trails near you</h2>
            <Link to="/routes" className="text-xs font-semibold text-primary">See all</Link>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar px-5 pb-2">
            {trails.map(t => (
              <Link key={t.id} to="/trail/$id" params={{ id: t.id }} className="block">
                <TrailCard trail={t} compact />
              </Link>
            ))}
          </div>
        </div>

        <div className="mx-5 mt-6 rounded-3xl bg-gradient-to-br from-primary to-[oklch(0.38_0.18_290)] p-5 text-primary-foreground shadow-[var(--shadow-float)]">
          <div className="flex items-center gap-2 text-xs font-semibold opacity-90"><Sparkles className="h-4 w-4" /> AI ROUTE GENERATOR</div>
          <h3 className="text-xl font-bold mt-2 leading-tight">Plan a perfect hike in 30 seconds</h3>
          <p className="text-xs opacity-80 mt-1">Tell us your level, time and mood — we'll craft 3 routes.</p>
          <Link to="/generate" className="mt-4 inline-block bg-background text-primary font-semibold text-sm px-4 py-2.5 rounded-xl">Generate my route →</Link>
        </div>

        <div className="px-5 mt-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-lg">Find a verified guide</h2>
            <button className="text-xs font-semibold text-primary">Filters</button>
          </div>
          <div className="space-y-3">
            {guides.map(g => (
              <div key={g.id} className="bg-card rounded-2xl p-4 shadow-[var(--shadow-card)] flex gap-3">
                <img src={g.avatar} alt={g.name} className="h-16 w-16 rounded-2xl object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <p className="font-semibold text-sm">{g.name}</p>
                    {g.verified && <BadgeCheck className="h-4 w-4 text-primary" />}
                  </div>
                  <p className="text-[11px] text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" />{g.region}</p>
                  <div className="flex items-center gap-2 mt-1.5 text-[11px]">
                    <span className="flex items-center gap-1 text-warning-foreground"><Star className="h-3 w-3 fill-current" />{g.safety}</span>
                    <span className="text-muted-foreground">({g.reviews})</span>
                    <span className="text-muted-foreground truncate">• {g.languages.join(", ")}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">${g.pricePerDay}</p>
                  <p className="text-[10px] text-muted-foreground">per day</p>
                  <button className="mt-2 text-[11px] font-semibold bg-primary text-primary-foreground px-3 py-1.5 rounded-full">Book</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MobileShell>
  );
}
