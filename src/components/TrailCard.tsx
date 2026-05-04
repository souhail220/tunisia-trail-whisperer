import { Cloud, CloudRain, Sun, Thermometer, Mountain, Clock, Headphones } from "lucide-react";
import { Trail, difficultyColor } from "@/lib/mock-data";

const weatherIcon = { sunny: Sun, cloudy: Cloud, rainy: CloudRain, hot: Thermometer };

export function TrailCard({ trail, compact }: { trail: Trail; compact?: boolean }) {
  const W = weatherIcon[trail.weather];
  return (
    <div className={`bg-card rounded-2xl overflow-hidden shadow-[var(--shadow-card)] ${compact ? "min-w-[260px]" : "w-full"}`}>
      <div className="relative h-32">
        <img src={trail.image} alt={trail.name} className="w-full h-full object-cover" loading="lazy" />
        <span className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-semibold ${difficultyColor(trail.difficulty)}`}>{trail.difficulty}</span>
        {trail.story && (
          <span className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1.5"><Headphones className="h-3 w-3" /></span>
        )}
        <div className="absolute bottom-2 right-2 bg-background/90 rounded-full p-1.5"><W className="h-3.5 w-3.5 text-warning-foreground" /></div>
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-sm leading-tight">{trail.name}</h3>
        <p className="text-[11px] text-muted-foreground mt-0.5">{trail.region}</p>
        <div className="flex items-center gap-3 mt-2 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1"><Mountain className="h-3 w-3" />{trail.distanceKm} km</span>
          <span className="flex items-center gap-1">↑ {trail.elevationM} m</span>
          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{trail.durationH}h</span>
        </div>
      </div>
    </div>
  );
}
