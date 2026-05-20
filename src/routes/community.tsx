import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { MobileShell } from "@/components/MobileShell";
import { PageHeader } from "@/components/PageHeader";
import { posts as seedPosts, hazards, difficultyColor, type Post } from "@/lib/mock-data";
import { Heart, MessageCircle, Bookmark, AlertTriangle, Plus, MapPin, Headphones } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { toast } from "sonner";
import { RadioModeSheet, EnhancedShareForm } from "@/components/feature-sheets";


export const Route = createFileRoute("/community")({
  head: () => ({ meta: [{ title: "Community — TrailMate" }, { name: "description", content: "Shared GPS trails, photos and hazard warnings from Tunisian hikers." }] }),
  component: Community,
});

function Community() {
  const [posts, setPosts] = useState<Post[]>(seedPosts);
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [expanded, setExpanded] = useState<string | null>(null);
  const [radioOpen, setRadioOpen] = useState(false);


  const toggleLike = (id: string) => {
    setLiked(l => ({ ...l, [id]: !l[id] }));
    setPosts(ps => ps.map(p => p.id === id ? { ...p, likes: p.likes + (liked[id] ? -1 : 1) } : p));
  };
  const toggleSave = (id: string) => {
    setSaved(s => ({ ...s, [id]: !s[id] }));
    toast(saved[id] ? "Removed from saved" : "Saved to your collection");
  };

  return (
    <MobileShell>
      <PageHeader title="Community" subtitle="Trails, photos & hazards" />

      <div className="px-5 mb-3">
        <button onClick={()=>setRadioOpen(true)} className="w-full bg-primary/10 text-primary rounded-2xl px-4 py-2.5 flex items-center justify-between">
          <span className="flex items-center gap-2 text-xs font-bold"><Headphones className="h-4 w-4" />📡 Open channel · Trailheads</span>
          <span className="text-[10px] font-semibold opacity-80">12 hikers connected</span>
        </button>
      </div>


      <div className="px-5 space-y-2 mb-4">
        {hazards.map(h => {
          const open = expanded === h.id;
          return (
            <button key={h.id} onClick={() => setExpanded(open ? null : h.id)} className="w-full text-left bg-danger/8 border border-danger/30 rounded-2xl p-3 flex gap-3 items-start">
              <div className="h-8 w-8 rounded-lg bg-danger/15 flex items-center justify-center shrink-0">
                <AlertTriangle className="h-4 w-4 text-danger" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-danger uppercase tracking-wide">Hazard · {h.region}</p>
                <p className="text-sm font-medium mt-0.5">{h.hazard}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{h.trail} · reported {h.date}</p>
                {open && (
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                    Reported by {h.user}. Severity: high. Avoid this section until conditions are reconfirmed by the community.
                  </p>
                )}
              </div>
            </button>
          );
        })}
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
            <Link to="/trail/$id" params={{ id: p.trailId }} className="block">
              <img src={p.image} alt={p.trail} className="w-full h-56 object-cover" loading="lazy" />
            </Link>
            <div className="p-4">
              <Link to="/trail/$id" params={{ id: p.trailId }} className="font-semibold text-sm">{p.trail}</Link>
              <div className="flex items-center gap-5 mt-3 text-muted-foreground text-xs">
                <button onClick={() => toggleLike(p.id)} className="flex items-center gap-1">
                  <Heart className={`h-4 w-4 ${liked[p.id] ? "fill-danger text-danger" : ""}`} />{p.likes}
                </button>
                <button onClick={() => toast("Comments coming soon")} className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" />{p.comments}
                </button>
                <button onClick={() => toggleSave(p.id)} className="ml-auto" aria-label="Bookmark">
                  <Bookmark className={`h-4 w-4 ${saved[p.id] ? "fill-primary text-primary" : ""}`} />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <ShareTrailFab onShare={post => setPosts(ps => [post, ...ps])} />
    </MobileShell>
  );
}

function ShareTrailFab({ onShare }: { onShare: (p: Post) => void }) {
  const [open, setOpen] = useState(false);
  const [trail, setTrail] = useState("");
  const [region, setRegion] = useState("");

  const submit = () => {
    if (!trail.trim() || !region.trim()) {
      toast.error("Add a trail name and region");
      return;
    }
    const post: Post = {
      id: `u${Date.now()}`,
      user: "You",
      avatar: "https://i.pravatar.cc/80?img=14",
      trail, trailId: "zaghouan", region,
      date: "just now",
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800",
      difficulty: "Moderate",
      likes: 0, comments: 0,
    };
    onShare(post);
    toast.success("Trail shared with the community");
    setTrail(""); setRegion(""); setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="fixed bottom-24 right-1/2 translate-x-[180px] h-14 w-14 rounded-2xl bg-primary text-primary-foreground shadow-[var(--shadow-float)] flex items-center justify-center z-40">
          <Plus className="h-6 w-6" />
        </button>
      </SheetTrigger>
      <SheetContent side="bottom" className="rounded-t-3xl">
        <SheetHeader>
          <SheetTitle>Share a trail</SheetTitle>
        </SheetHeader>
        <div className="space-y-3 mt-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Trail name</label>
            <input value={trail} onChange={e=>setTrail(e.target.value)} className="w-full mt-1 px-4 py-3 rounded-xl bg-card border border-border outline-none text-sm" placeholder="e.g. Cap Bon Cliff Walk" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Region</label>
            <input value={region} onChange={e=>setRegion(e.target.value)} className="w-full mt-1 px-4 py-3 rounded-xl bg-card border border-border outline-none text-sm" placeholder="e.g. Nabeul" />
          </div>
        </div>
        <SheetFooter className="mt-4">
          <button onClick={submit} className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-xl">Post</button>
          <SheetClose asChild>
            <button className="w-full bg-card border border-border font-semibold py-3 rounded-xl text-sm">Cancel</button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
