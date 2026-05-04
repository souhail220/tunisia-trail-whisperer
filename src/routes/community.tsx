import { createFileRoute } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";
import { PageHeader } from "@/components/PageHeader";
import { posts, hazards, difficultyColor } from "@/lib/mock-data";
import { Heart, MessageCircle, Bookmark, AlertTriangle, Plus, MapPin } from "lucide-react";

export const Route = createFileRoute("/community")({
  head: () => ({ meta: [{ title: "Community — TrailMate" }, { name: "description", content: "Shared GPS trails, photos and hazard warnings from Tunisian hikers." }] }),
  component: Community,
});

function Community() {
  return (
    <MobileShell>
      <PageHeader title="Community" subtitle="Trails, photos & hazards" />

      <div className="px-5 space-y-2 mb-4">
        {hazards.map(h => (
          <div key={h.id} className="bg-danger/8 border border-danger/30 rounded-2xl p-3 flex gap-3 items-start">
            <div className="h-8 w-8 rounded-lg bg-danger/15 flex items-center justify-center shrink-0">
              <AlertTriangle className="h-4 w-4 text-danger" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-danger uppercase tracking-wide">Hazard · {h.region}</p>
              <p className="text-sm font-medium mt-0.5">{h.hazard}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{h.trail} · reported {h.date}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="px-5 space-y-4">
        {posts.map(p => (
          <article key={p.id} className="bg-card rounded-2xl shadow-[var(--shadow-card)] overflow-hidden">
            <div className="flex items-center gap-3 p-4">
              <img src={p.avatar} alt={p.user} className="h-9 w-9 rounded-full object-cover" />
              <div className="flex-1">
                <p className="text-sm font-semibold">{p.user}</p>
                <p className="text-[11px] text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" />{p.region} · {p.date}</p>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${difficultyColor(p.difficulty)}`}>{p.difficulty}</span>
            </div>
            <img src={p.image} alt={p.trail} className="w-full h-56 object-cover" loading="lazy" />
            <div className="p-4">
              <p className="font-semibold text-sm">{p.trail}</p>
              <div className="flex items-center gap-5 mt-3 text-muted-foreground text-xs">
                <button className="flex items-center gap-1"><Heart className="h-4 w-4" />{p.likes}</button>
                <button className="flex items-center gap-1"><MessageCircle className="h-4 w-4" />{p.comments}</button>
                <button className="ml-auto"><Bookmark className="h-4 w-4" /></button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <button className="fixed bottom-24 right-1/2 translate-x-[200px] sm:translate-x-[200px] h-14 w-14 rounded-2xl bg-primary text-primary-foreground shadow-[var(--shadow-float)] flex items-center justify-center z-40">
        <Plus className="h-6 w-6" />
      </button>
    </MobileShell>
  );
}
