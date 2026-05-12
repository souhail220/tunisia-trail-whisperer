import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FeatureShell } from "@/components/FeatureShell";
import { ThermometerSun, Droplets, Sun, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/features/thermal")({
  component: Thermal,
});

function Thermal() {
  const [intensity, setIntensity] = useState(2);
  const [uv, setUv] = useState(8);
  const [temp, setTemp] = useState(34);
  const [hour, setHour] = useState(13);

  const score = Math.min(100, Math.round((uv*4) + (temp-20)*2 + intensity*8 + (hour>=11 && hour<=15 ? 12 : 0)));
  const level = score>80?"extreme":score>60?"high":score>35?"moderate":"low";
  const color = { extreme:"danger", high:"warning", moderate:"warning", low:"success" }[level];
  const tone = { danger:"bg-danger text-danger-foreground", warning:"bg-warning text-warning-foreground", success:"bg-success text-success-foreground" }[color];

  const [alerted, setAlerted] = useState(false);
  useEffect(()=>{ if (score>80 && !alerted) setAlerted(true); }, [score, alerted]);

  return (
    <FeatureShell title="ThermalRisk Scanner" accent="Heatstroke & sunburn risk">
      <div className="px-5 space-y-4">
        <div className={`rounded-3xl p-5 ${tone} shadow-[var(--shadow-float)]`}>
          <div className="flex items-center justify-between">
            <ThermometerSun className="h-8 w-8" />
            <span className="text-xs font-bold uppercase opacity-90">{level} risk</span>
          </div>
          <p className="text-5xl font-bold mt-3">{score}</p>
          <p className="text-xs opacity-90 mt-1">Personalized risk score · updated live</p>
        </div>

        {alerted && score>80 && (
          <div className="bg-danger/10 border border-danger/30 rounded-2xl p-3 flex items-start gap-2 fade-in">
            <AlertTriangle className="h-4 w-4 text-danger mt-0.5" />
            <div>
              <p className="text-xs font-bold text-danger">Extreme heat alert</p>
              <p className="text-[11px] text-muted-foreground">Seek shade now. Reduce pace by 50%. Drink 500ml within 15 min.</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-2">
          <div className="bg-card rounded-2xl p-3 text-center shadow-[var(--shadow-card)]"><Sun className="h-4 w-4 text-warning-foreground mx-auto mb-1" /><p className="text-sm font-bold">{uv}</p><p className="text-[10px] text-muted-foreground uppercase">UV index</p></div>
          <div className="bg-card rounded-2xl p-3 text-center shadow-[var(--shadow-card)]"><ThermometerSun className="h-4 w-4 text-danger mx-auto mb-1" /><p className="text-sm font-bold">{temp}°C</p><p className="text-[10px] text-muted-foreground uppercase">Temp</p></div>
          <div className="bg-card rounded-2xl p-3 text-center shadow-[var(--shadow-card)]"><Droplets className="h-4 w-4 text-primary mx-auto mb-1" /><p className="text-sm font-bold">{hour}:00</p><p className="text-[10px] text-muted-foreground uppercase">Time</p></div>
        </div>

        <div className="bg-card rounded-2xl p-4 shadow-[var(--shadow-card)] space-y-3">
          <Slider label="Hike intensity" val={intensity} min={1} max={5} set={setIntensity} suffix={`/5`} />
          <Slider label="UV index" val={uv} min={0} max={11} set={setUv} />
          <Slider label="Temperature" val={temp} min={10} max={45} set={setTemp} suffix="°C" />
          <Slider label="Hour of day" val={hour} min={5} max={20} set={setHour} suffix="h" />
        </div>

        <div className="bg-card rounded-2xl p-4 shadow-[var(--shadow-card)]">
          <p className="text-sm font-semibold mb-2">Recommended actions</p>
          <ul className="text-xs space-y-1.5 list-disc pl-5">
            {score>80 && <li>Stop and rest in deep shade for 20 minutes.</li>}
            {score>60 && <li>Apply SPF 50+ every hour.</li>}
            {score>35 && <li>Drink 250ml water every 20 minutes.</li>}
            <li>Wear breathable, light-colored layers and a wide hat.</li>
            <li>Next hydration reminder in 8 minutes.</li>
          </ul>
        </div>
      </div>
    </FeatureShell>
  );
}

function Slider({ label, val, min, max, set, suffix }: { label:string; val:number; min:number; max:number; set:(n:number)=>void; suffix?:string }) {
  return (
    <div>
      <div className="flex justify-between text-[11px] font-semibold text-muted-foreground"><span>{label}</span><span>{val}{suffix||""}</span></div>
      <input type="range" min={min} max={max} value={val} onChange={e=>set(+e.target.value)} className="w-full accent-primary" />
    </div>
  );
}
