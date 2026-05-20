import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MobileShell } from "@/components/MobileShell";
import { achievements, seedBreadcrumbs, seedJournal, species as allSpecies, type BreadcrumbTrail, type JournalEntry } from "@/lib/mock-data";
import { Settings, Award, Mountain, TrendingUp, Share2, ChevronRight, Backpack, Sparkles, Footprints, Leaf, Key } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { toast } from "sonner";


export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — TrailMate" }, { name: "description", content: "Achievements, gear checklist and settings." }] }),
  component: Profile,
});

function Profile() {
  const earned = achievements.filter(a => a.earned).length;
  const next = Math.round((earned / achievements.length) * 100);
  const [profile, setProfile] = useState({ name: "Amine Khelifi", level: "Intermediate", region: "Tunis region" });
  const [openSheet, setOpenSheet] = useState<string | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbTrail[]>(seedBreadcrumbs);
  const [journal, setJournal] = useState<JournalEntry[]>(seedJournal);


  useEffect(() => {
    try {
      const raw = localStorage.getItem("trailmate.profile");
      if (raw) {
        const p = JSON.parse(raw);
        setProfile({
          name: p.name?.trim() || "Amine Khelifi",
          level: p.level || "Intermediate",
          region: p.region || "Tunis region",
        });
      }
    } catch {}
  }, []);

  const share = async () => {
    const data = { title: "TrailMate Achievements", text: `${earned}/${achievements.length} badges unlocked on TrailMate Tunisia 🏔️` };
    try {
      if (typeof navigator !== "undefined" && (navigator as any).share) {
        await (navigator as any).share(data);
      } else {
        toast.success("Achievements link copied");
      }
    } catch {}
  };

  const menu = [
    { i: TrendingUp, t: "My activity", body: "Your last 30 days: 7 hikes, 84 km, 4.2k m elevation. Longest hike: Jebel Zaghouan (12.4 km)." },
    { i: Mountain, t: "Story trails completed", body: "You've completed 2 audio story trails. Try Tamerza Canyon next for an immersive desert tale." },
    { i: Settings, t: "Settings & privacy", body: "Manage notifications, GPS sharing, offline downloads and account preferences." },
  ];

  return (
    <MobileShell>
      <div className="px-5 pt-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="https://i.pravatar.cc/120?img=14" className="h-14 w-14 rounded-2xl object-cover" alt="You" />
          <div>
            <h1 className="font-bold text-lg">{profile.name}</h1>
            <p className="text-xs text-muted-foreground">{profile.level} · {profile.region}</p>
          </div>
        </div>
        <button onClick={()=>setOpenSheet("Settings & privacy")} className="h-10 w-10 rounded-xl bg-card flex items-center justify-center" aria-label="Settings"><Settings className="h-4 w-4" /></button>
      </div>

      <div className="grid grid-cols-3 gap-2 px-5 mt-6">
        {[
          { l: "km hiked", v: "184" },
          { l: "trails", v: "23" },
          { l: "elevation", v: "8.4k" },
        ].map(s => (
          <div key={s.l} className="bg-card rounded-2xl p-3 text-center shadow-[var(--shadow-card)]">
            <p className="text-lg font-bold text-primary">{s.v}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold">{s.l}</p>
          </div>
        ))}
      </div>

      <div className="px-5 mt-6">
        <div className="bg-card rounded-2xl p-4 shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2"><Award className="h-4 w-4 text-primary" /><span className="font-semibold text-sm">Achievements</span></div>
            <button onClick={share} className="text-[11px] font-semibold text-primary flex items-center gap-1"><Share2 className="h-3 w-3" /> Share</button>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: `${next}%` }} />
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">{earned}/{achievements.length} unlocked · 2 to next badge</p>
          <div className="grid grid-cols-4 gap-3 mt-4">
            {achievements.map(a => (
              <button
                key={a.id}
                onClick={() => toast(a.earned ? `${a.name} — unlocked` : `${a.name} — keep hiking to unlock`)}
                className="text-center"
              >
                <div className={`h-14 w-14 mx-auto rounded-2xl flex items-center justify-center text-2xl ${a.earned ? "bg-primary/10" : "bg-muted opacity-40"}`}>{a.icon}</div>
                <p className="text-[10px] mt-1 leading-tight">{a.name}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      <GearChecklist />

      <div className="px-5 mt-6 space-y-2">
        <Link to="/features" className="w-full bg-primary text-primary-foreground rounded-2xl p-4 flex items-center gap-3 shadow-[var(--shadow-float)]">
          <Sparkles className="h-4 w-4" />
          <div className="flex-1 text-left">
            <p className="text-sm font-bold">Explore 12 advanced features</p>
            <p className="text-[11px] opacity-90">Safety Watch · Mesh SOS · AR · Wildlife ID & more</p>
          </div>
          <ChevronRight className="h-4 w-4" />
        </Link>
        {menu.map(({i: I, t}) => (
          <button key={t} onClick={()=>setOpenSheet(t)} className="w-full bg-card rounded-2xl p-4 flex items-center gap-3 shadow-[var(--shadow-card)]">
            <I className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium flex-1 text-left">{t}</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
        ))}
      </div>

      <Sheet open={openSheet !== null} onOpenChange={o => !o && setOpenSheet(null)}>
        <SheetContent side="bottom" className="rounded-t-3xl">
          <SheetHeader>
            <SheetTitle>{openSheet}</SheetTitle>
          </SheetHeader>
          <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
            {menu.find(m => m.t === openSheet)?.body || "Manage notifications, GPS sharing, offline downloads and account preferences."}
          </p>
        </SheetContent>
      </Sheet>
    </MobileShell>
  );
}

function GearChecklist() {
  const [diff, setDiff] = useState(3);
  const [weather, setWeather] = useState("hot");
  const items: Record<string, string[]> = {
    Navigation: ["Offline GPS", "Paper map", "Compass"],
    Hydration: ["3L water", "Electrolyte tabs"],
    Safety: ["First aid kit", "Headlamp + spare batteries", "Emergency whistle"],
    Clothing: weather === "cold" ? ["Insulated jacket", "Beanie", "Gloves"] : ["Sun hat", "UV sleeves", "Light layers"],
    Food: ["Trail mix", "2 energy bars", "Dates & nuts"],
  };
  if (diff >= 4) items.Safety = [...items.Safety, "Emergency bivvy", "Satellite messenger"];

  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const toggle = (k: string) => setChecked(c => ({ ...c, [k]: !c[k] }));

  return (
    <div className="px-5 mt-6">
      <div className="flex items-center gap-2 mb-3">
        <Backpack className="h-4 w-4 text-primary" />
        <h2 className="font-bold">Smart gear checklist</h2>
      </div>
      <div className="bg-card rounded-2xl p-4 shadow-[var(--shadow-card)]">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground">Difficulty: {diff}</label>
            <input type="range" min={1} max={5} value={diff} onChange={e=>setDiff(+e.target.value)} className="w-full accent-primary" />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground">Weather</label>
            <div className="flex gap-1 mt-1">
              {["sunny","hot","rainy","cold"].map(w => (
                <button key={w} onClick={()=>setWeather(w)} className={`flex-1 text-[10px] py-1 rounded-full font-semibold ${weather===w?"bg-primary text-primary-foreground":"bg-muted text-muted-foreground"}`}>{w}</button>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-3">
          {Object.entries(items).map(([cat, list]) => (
            <div key={cat}>
              <p className="text-[11px] font-bold uppercase tracking-wide text-secondary mb-1">{cat}</p>
              <ul className="space-y-1.5">
                {list.map(item => (
                  <li key={item} className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={!!checked[item]} onChange={()=>toggle(item)} className="h-4 w-4 accent-primary rounded" />
                    <span className={checked[item] ? "line-through text-muted-foreground" : ""}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <button onClick={()=>toast.success("Checklist saved as PDF")} className="w-full mt-4 bg-primary text-primary-foreground font-semibold py-3 rounded-xl text-sm">Save as PDF</button>
      </div>
    </div>
  );
}
