import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";
import { PageHeader } from "@/components/PageHeader";
import { TrailCard } from "@/components/TrailCard";
import { trails } from "@/lib/mock-data";
import { Bookmark, Sparkles } from "lucide-react";

export const Route = createFileRoute("/routes")({
  head: () => ({ meta: [{ title: "Routes — TrailMate" }, { name: "description", content: "Saved and AI-generated hiking routes." }] }),
  component: RoutesPage,
});

function RoutesPage() {
  const saved = trails.slice(0, 3);
  const generated = trails.slice(3);
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
        <div className="space-y-3">
          {saved.map(t => <TrailCard key={t.id} trail={t} />)}
        </div>

        <div className="flex items-center gap-2 mt-8 mb-3">
          <Sparkles className="h-4 w-4 text-primary" />
          <h2 className="font-bold">Recently generated</h2>
        </div>
        <div className="space-y-3">
          {generated.map(t => <TrailCard key={t.id} trail={t} />)}
        </div>
      </div>
    </MobileShell>
  );
}
