import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronRight, Shield, Map, Mountain } from "lucide-react";
import hero from "@/assets/onboarding-hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "TrailMate Tunisia — Hike smarter, safer" }, { name: "description", content: "Discover Tunisia's wild trails with offline AI safety, community routes and verified local guides." }] }),
  component: Onboarding,
});

function Onboarding() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [level, setLevel] = useState("Intermediate");
  const [region, setRegion] = useState("Northern Mountains");
  const navigate = useNavigate();
  const next = () => {
    if (step < 2) return setStep(step + 1);
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("trailmate.profile", JSON.stringify({ name, level, region }));
      }
    } catch {}
    navigate({ to: "/explore" });
  };

  return (
    <div className="min-h-screen bg-background flex justify-center">
      <div className="w-full max-w-[430px] min-h-screen flex flex-col bg-background relative">
        <div className="flex justify-end px-5 pt-5">
          <Link to="/explore" className="text-sm text-muted-foreground font-medium">Skip</Link>
        </div>

        <div className="flex-1 flex flex-col px-6 fade-in" key={step}>
          {step === 0 && (
            <>
              <img src={hero} alt="Tunisian mountains" className="w-full h-72 object-cover rounded-3xl mt-4" />
              <h1 className="text-3xl font-bold mt-8 leading-tight">Explore Tunisia's<br/>wild trails</h1>
              <p className="text-muted-foreground mt-3">From the cork forests of Ain Draham to the Sahara canyons of Tamerza — discover the country on foot.</p>
            </>
          )}
          {step === 1 && (
            <>
              <div className="mt-8">
                <h1 className="text-3xl font-bold leading-tight">Your AI safety<br/>companion, offline</h1>
                <p className="text-muted-foreground mt-3">Cached emergency guidance that works deep in the mountains, far from any signal.</p>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-8">
                {[
                  { i: Shield, t: "Offline SOS" },
                  { i: Map, t: "GPS & maps" },
                  { i: Mountain, t: "AI route planner" },
                  { i: ChevronRight, t: "Story trails" },
                ].map(({ i: I, t }) => (
                  <div key={t} className="bg-card rounded-2xl p-4 shadow-[var(--shadow-card)]">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                      <I className="h-5 w-5 text-primary" />
                    </div>
                    <p className="font-semibold text-sm">{t}</p>
                  </div>
                ))}
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <div className="mt-8">
                <h1 className="text-3xl font-bold leading-tight">Set up your profile</h1>
                <p className="text-muted-foreground mt-3">We'll personalise routes to your level.</p>
              </div>
              <div className="space-y-4 mt-6">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Your name</label>
                  <input value={name} onChange={e=>setName(e.target.value)} className="w-full mt-1 px-4 py-3 rounded-xl bg-card border border-border focus:border-primary outline-none text-sm" placeholder="e.g. Amine" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Experience level</label>
                  <div className="flex gap-2 mt-2">
                    {["Beginner", "Intermediate", "Expert"].map(l => (
                      <button key={l} onClick={()=>setLevel(l)} className={`flex-1 px-3 py-2 rounded-full border text-sm font-medium transition ${level===l ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-accent"}`}>{l}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Preferred region</label>
                  <select value={region} onChange={e=>setRegion(e.target.value)} className="w-full mt-1 px-4 py-3 rounded-xl bg-card border border-border outline-none text-sm">
                    <option>Northern Mountains</option>
                    <option>Cap Bon & Coast</option>
                    <option>Atlas & Kasserine</option>
                    <option>Sahara South</option>
                  </select>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="px-6 pb-10 pt-6">
          <div className="flex gap-1.5 justify-center mb-6">
            {[0,1,2].map(i => (
              <span key={i} className={`h-1.5 rounded-full transition-all ${i===step ? "w-6 bg-primary" : "w-1.5 bg-border"}`} />
            ))}
          </div>
          <button onClick={next} className="w-full bg-primary text-primary-foreground font-semibold py-4 rounded-2xl shadow-[var(--shadow-float)] active:scale-[0.99] transition">
            {step === 2 ? "Start exploring" : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}
