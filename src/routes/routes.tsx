import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { MobileShell } from "@/components/MobileShell";
import { PageHeader } from "@/components/PageHeader";
import { TrailCard } from "@/components/TrailCard";
import { trails } from "@/lib/mock-data";
import { Bookmark, Sparkles, X } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/routes")({
  head: () => ({ meta: [{ title: "Routes — TrailMate" }, { name: "description", content: "Saved and AI-generated hiking routes." }] }),
  component: RoutesPage,
});

function RoutesPage() {
  const [savedIds, setSavedIds] = useState<string[]>(trails.slice(0, 3).map(t => t.id));
  const saved = trails.filter(t => savedIds.includes(t.id));
  const generated = trails.slice(3);

  const remove = (id: string) => {
    setSavedIds(s => s.filter(x => x !== id));
    toast("Removed from saved");
  };

  return (
    <MobileShell>
      <PageHeader title="Your routes" subtitle="Saved & AI-generated trails" />
      <div className="px-5">
        <Link to="/generate" className="flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-2xl p-4 mb-6">
          <div className="h-10 w-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center"><Sparkles className="h-5 w-5" /></div>
          <div className="flex-1">
            <p className="font-semibold text-sm">Generate a new route</p>
            <p className="text-xs text-muted-foreground">Tailored to your level & time</p>
          </div>
          <span className="text-primary font-bold">→</span>
        </Link>

        <div className="flex items-center gap-2 mb-3">
          <Bookmark className="h-4 w-4 text-primary" />
          <h2 className="font-bold">Saved</h2>
        </div>
        {saved.length === 0 ? (
          <div className="bg-card rounded-2xl p-6 text-center">
            <p className="text-3xl">🥾</p>
            <p className="font-semibold mt-2 text-sm">No saved trails yet</p>
            <p className="text-xs text-muted-foreground mt-1">Save trails from Explore to find them here.</p>
            <Link to="/explore" className="inline-block mt-4 bg-primary text-primary-foreground text-sm font-semibold px-4 py-2 rounded-xl">Browse trails</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {saved.map(t => (
              <div key={t.id} className="relative">
                <Link to="/trail/$id" params={{ id: t.id }} className="block">
                  <TrailCard trail={t} />
                </Link>
                <button onClick={() => remove(t.id)} aria-label="Remove" className="absolute top-2 right-2 h-8 w-8 rounded-full bg-background/90 flex items-center justify-center shadow">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 mt-8 mb-3">
          <Sparkles className="h-4 w-4 text-primary" />
          <h2 className="font-bold">Recently generated</h2>
        </div>
        <div className="space-y-3">
          {generated.map(t => (
            <Link key={t.id} to="/trail/$id" params={{ id: t.id }} className="block">
              <TrailCard trail={t} />
            </Link>
          ))}
        </div>
      </div>
    </MobileShell>
  );
}
