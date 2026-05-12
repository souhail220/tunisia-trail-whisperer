import { Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";

export function FeatureShell({ title, children, accent }: { title: string; children: React.ReactNode; accent?: string }) {
  return (
    <MobileShell>
      <div className="px-5 pt-6 flex items-center gap-3">
        <Link to="/features" className="h-9 w-9 rounded-xl bg-card flex items-center justify-center" aria-label="Back">
          <ChevronLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="font-bold text-lg leading-tight">{title}</h1>
          {accent && <p className="text-[11px] text-muted-foreground">{accent}</p>}
        </div>
      </div>
      <div className="mt-4">{children}</div>
    </MobileShell>
  );
}
