import { Link, useLocation } from "@tanstack/react-router";
import { Compass, Route as RouteIcon, Bot, Users, User } from "lucide-react";

const tabs = [
  { to: "/explore", label: "Explore", icon: Compass },
  { to: "/routes", label: "Routes", icon: RouteIcon },
  { to: "/ai-guide", label: "AI Guide", icon: Bot },
  { to: "/community", label: "Community", icon: Users },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function MobileShell({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  return (
    <div className="min-h-screen bg-background flex justify-center">
      <div className="w-full max-w-[430px] min-h-screen relative bg-background border-x border-border/60">
        <div className="pb-24">{children}</div>
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-background/95 backdrop-blur border-t border-border z-50">
          <ul className="grid grid-cols-5">
            {tabs.map(({ to, label, icon: Icon }) => {
              const active = pathname.startsWith(to);
              return (
                <li key={to}>
                  <Link to={to} className="flex flex-col items-center gap-1 py-3 text-[11px] font-medium">
                    <Icon className={`h-5 w-5 ${active ? "text-primary" : "text-muted-foreground"}`} strokeWidth={active ? 2.4 : 1.8} />
                    <span className={active ? "text-primary" : "text-muted-foreground"}>{label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}
