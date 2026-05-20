import { createFileRoute, Link, Outlet, useMatches } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";
import {
  Map, Headphones, Star, Leaf, ChevronRight, Sparkles,
} from "lucide-react";


export const Route = createFileRoute("/features")({
  head: () => ({ meta: [{ title: "Features — TrailMate" }, { name: "description", content: "Advanced safety, navigation and AI features for hikers." }] }),
  component: FeaturesLayout,
});

const features = [
  { to: "/features/route-ar", t: "AR Route Generator", d: "AI route + AR navigation", i: Map, c: "primary" },
  { to: "/features/radio", t: "RadioMode Walkie-Talkie", d: "Push-to-talk over BT/WiFi", i: Headphones, c: "primary" },
  { to: "/features/starpath", t: "StarPath Night Navigator", d: "Constellation compass", i: Star, c: "primary" },
  { to: "/features/wildlife", t: "WildlifeID Lens", d: "Offline species ID", i: Leaf, c: "secondary" },
] as const;


function FeaturesLayout() {
  const matches = useMatches();
  const isChild = matches.some(m => m.routeId.startsWith("/features/") && m.routeId !== "/features");
  if (isChild) return <Outlet />;

  return (
    <MobileShell>
      <div className="px-5 pt-8">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h1 className="font-bold text-2xl">Features</h1>
        </div>
        <p className="text-xs text-muted-foreground mt-1">4 advanced modules — navigation & discovery.</p>
      </div>
      <div className="px-5 mt-5 grid grid-cols-2 gap-3">
        {features.map(({ to, t, d, i: I, c }) => {
          const tone = {
            danger: "bg-danger/10 text-danger",
            warning: "bg-warning/15 text-warning-foreground",
            primary: "bg-primary/10 text-primary",
            secondary: "bg-secondary/10 text-secondary",
          }[c];
          return (
          <Link key={to} to={to} className="bg-card rounded-2xl p-3 shadow-[var(--shadow-card)] flex flex-col gap-2 active:scale-[.98] transition-transform">
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${tone}`}>
              <I className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold leading-tight">{t}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{d}</p>
            </div>
          </Link>
          );
        })}
      </div>
      <div className="px-5 mt-6">
        <Link to="/profile" className="bg-card rounded-2xl p-4 flex items-center gap-3 shadow-[var(--shadow-card)]">
          <span className="text-sm font-medium flex-1">Back to profile</span>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </Link>
      </div>
    </MobileShell>
  );
}
