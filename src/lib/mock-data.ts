import zaghouan from "@/assets/trail-zaghouan.jpg";
import aindraham from "@/assets/trail-aindraham.jpg";
import ichkeul from "@/assets/trail-ichkeul.jpg";
import chaambi from "@/assets/trail-chaambi.jpg";
import tamerza from "@/assets/trail-tamerza.jpg";
import sidibou from "@/assets/trail-sidibou.jpg";

export type Difficulty = "Easy" | "Moderate" | "Hard" | "Expert";

export type Trail = {
  id: string;
  name: string;
  region: string;
  distanceKm: number;
  elevationM: number;
  durationH: number;
  difficulty: Difficulty;
  weather: "sunny" | "cloudy" | "rainy" | "hot";
  image: string;
  story?: boolean;
  tags: string[];
  description: string;
};

export const trails: Trail[] = [
  { id: "zaghouan", name: "Jebel Zaghouan Summit", region: "Zaghouan", distanceKm: 12.4, elevationM: 980, durationH: 6, difficulty: "Hard", weather: "sunny", image: zaghouan, tags: ["scenic", "summit"], description: "Iconic limestone peak with panoramic views over northern Tunisia." },
  { id: "aindraham", name: "Ain Draham Cork Forest Loop", region: "Jendouba", distanceKm: 8.2, elevationM: 320, durationH: 3, difficulty: "Moderate", weather: "cloudy", image: aindraham, story: true, tags: ["forest", "wildlife"], description: "Cool, misty cork-oak woodland trail with rich biodiversity." },
  { id: "ichkeul", name: "Ichkeul Lake & Wetlands", region: "Bizerte", distanceKm: 6.0, elevationM: 90, durationH: 2, difficulty: "Easy", weather: "sunny", image: ichkeul, tags: ["wildlife", "family"], description: "UNESCO biosphere with flamingos, marshlands and gentle hills." },
  { id: "chaambi", name: "Jebel Chaambi Highest Peak", region: "Kasserine", distanceKm: 18.6, elevationM: 1544, durationH: 9, difficulty: "Expert", weather: "hot", image: chaambi, tags: ["summit", "remote"], description: "Tunisia's tallest mountain. Long, exposed and demanding." },
  { id: "tamerza", name: "Tamerza Canyon & Oasis", region: "Tozeur", distanceKm: 9.5, elevationM: 220, durationH: 4, difficulty: "Moderate", weather: "hot", image: tamerza, story: true, tags: ["desert", "waterfall"], description: "Red sandstone canyon ending at a hidden palm oasis and waterfall." },
  { id: "sidibou", name: "Sidi Bou Said Coastal Path", region: "Tunis", distanceKm: 4.2, elevationM: 110, durationH: 1.5, difficulty: "Easy", weather: "sunny", image: sidibou, tags: ["coast", "historical"], description: "Cliffside walk above the Mediterranean past blue-and-white cafés." },
];

export type Guide = {
  id: string; name: string; region: string; verified: boolean; safety: number;
  reviews: number; languages: string[]; pricePerDay: number; avatar: string;
};

export const guides: Guide[] = [
  { id: "g1", name: "Mehdi Bouzid", region: "Atlas Mountains", verified: true, safety: 9.6, reviews: 124, languages: ["Arabic", "French", "English"], pricePerDay: 80, avatar: "https://i.pravatar.cc/120?img=12" },
  { id: "g2", name: "Salma Trabelsi", region: "Sahara & Tozeur", verified: true, safety: 9.2, reviews: 87, languages: ["Arabic", "French", "Italian"], pricePerDay: 95, avatar: "https://i.pravatar.cc/120?img=47" },
  { id: "g3", name: "Karim Jellali", region: "North Coast", verified: false, safety: 8.4, reviews: 31, languages: ["Arabic", "English"], pricePerDay: 60, avatar: "https://i.pravatar.cc/120?img=33" },
];

export type Post = {
  id: string; user: string; avatar: string; trail: string; trailId: string; region: string;
  date: string; image: string; difficulty: Difficulty; likes: number; comments: number; hazard?: string;
};

export const posts: Post[] = [
  { id: "p1", user: "Amine K.", avatar: "https://i.pravatar.cc/80?img=15", trail: "Jebel Zaghouan Summit", trailId: "zaghouan", region: "Zaghouan", date: "2d ago", image: zaghouan, difficulty: "Hard", likes: 142, comments: 18 },
  { id: "p2", user: "Yasmine B.", avatar: "https://i.pravatar.cc/80?img=23", trail: "Tamerza Oasis Loop", trailId: "tamerza", region: "Tozeur", date: "4d ago", image: tamerza, difficulty: "Moderate", likes: 98, comments: 12, hazard: "Flash flood risk after rain" },
  { id: "p3", user: "Hatem M.", avatar: "https://i.pravatar.cc/80?img=11", trail: "Ain Draham Forest", trailId: "aindraham", region: "Jendouba", date: "1w ago", image: aindraham, difficulty: "Moderate", likes: 64, comments: 7 },
  { id: "p4", user: "Lina S.", avatar: "https://i.pravatar.cc/80?img=45", trail: "Ichkeul Wetlands", trailId: "ichkeul", region: "Bizerte", date: "1w ago", image: ichkeul, difficulty: "Easy", likes: 51, comments: 4 },
  { id: "p5", user: "Walid T.", avatar: "https://i.pravatar.cc/80?img=52", trail: "Chaambi Expedition", trailId: "chaambi", region: "Kasserine", date: "2w ago", image: chaambi, difficulty: "Expert", likes: 211, comments: 34, hazard: "Restricted military zone — guide required" },
];

export const hazards = posts.filter(p => p.hazard);

export const difficultyColor = (d: Difficulty) => ({
  Easy: "bg-success/15 text-success",
  Moderate: "bg-warning/20 text-warning-foreground",
  Hard: "bg-danger/15 text-danger",
  Expert: "bg-primary/15 text-primary",
}[d]);

export const achievements = [
  { id: "a1", name: "First Hike", icon: "🥾", earned: true },
  { id: "a2", name: "10 Trails", icon: "🏆", earned: true },
  { id: "a3", name: "Desert Walker", icon: "🏜️", earned: true },
  { id: "a4", name: "Night Hike", icon: "🌙", earned: false },
  { id: "a5", name: "Guided Hike", icon: "🧭", earned: true },
  { id: "a6", name: "Summit 1000m", icon: "⛰️", earned: false },
  { id: "a7", name: "Story Trail", icon: "🎧", earned: false },
  { id: "a8", name: "Community Hero", icon: "💚", earned: false },
];

export type Species = {
  id: string; name: string; sci: string; kind: "Bird" | "Reptile" | "Plant" | "Insect" | "Mammal";
  danger: "None" | "Low" | "Moderate" | "High"; habitat: string; note: string; emoji: string;
};

export const species: Species[] = [
  { id: "sp1", name: "Barbary partridge", sci: "Alectoris barbara", kind: "Bird", danger: "Low", habitat: "Scrubland, hills", note: "Endemic to North Africa, ground-nesting.", emoji: "🐦" },
  { id: "sp2", name: "Horseshoe whip snake", sci: "Hemorrhois hippocrepis", kind: "Reptile", danger: "Low", habitat: "Rocky areas", note: "Non-venomous, fast-moving. Backs away if approached.", emoji: "🐍" },
  { id: "sp3", name: "Atlas mastic tree", sci: "Pistacia atlantica", kind: "Plant", danger: "None", habitat: "Arid mountains", note: "Drought-tolerant, edible resin.", emoji: "🌳" },
  { id: "sp4", name: "Yellow scorpion", sci: "Buthus occitanus", kind: "Insect", danger: "Moderate", habitat: "Dry stones", note: "Sting painful, rarely dangerous to adults.", emoji: "🦂" },
  { id: "sp5", name: "Flamingo", sci: "Phoenicopterus roseus", kind: "Bird", danger: "None", habitat: "Wetlands", note: "Migratory flocks gather at Ichkeul.", emoji: "🦩" },
  { id: "sp6", name: "Fennec fox", sci: "Vulpes zerda", kind: "Mammal", danger: "Low", habitat: "Desert dunes", note: "Nocturnal, oversized ears for thermoregulation.", emoji: "🦊" },
  { id: "sp7", name: "Cork oak", sci: "Quercus suber", kind: "Plant", danger: "None", habitat: "Mediterranean forest", note: "Harvested sustainably for cork.", emoji: "🌲" },
];

export const speciesByTrail: Record<string, string[]> = {
  zaghouan: ["sp1", "sp2", "sp4"],
  aindraham: ["sp7", "sp1", "sp6"],
  ichkeul: ["sp5", "sp1"],
  chaambi: ["sp3", "sp2", "sp4"],
  tamerza: ["sp6", "sp3", "sp4"],
  sidibou: ["sp1", "sp7"],
};

export const speciesFor = (trailId: string): Species[] =>
  (speciesByTrail[trailId] || []).map(id => species.find(s => s.id === id)!).filter(Boolean);

export type ThermalRisk = { level: "low" | "moderate" | "high"; score: number; uv: number; tempC: number; label: string };

const riskMap: Record<string, ThermalRisk> = {
  Zaghouan:  { level: "moderate", score: 58, uv: 7, tempC: 31, label: "Moderate heat" },
  Jendouba:  { level: "low",      score: 28, uv: 4, tempC: 22, label: "Low heat" },
  Bizerte:   { level: "low",      score: 32, uv: 5, tempC: 24, label: "Low heat" },
  Kasserine: { level: "high",     score: 84, uv: 10, tempC: 38, label: "High heat today" },
  Tozeur:    { level: "high",     score: 91, uv: 11, tempC: 42, label: "High heat today" },
  Tunis:     { level: "moderate", score: 52, uv: 6, tempC: 28, label: "Moderate heat" },
};

export const thermalRiskFor = (region: string): ThermalRisk =>
  riskMap[region] || { level: "moderate", score: 50, uv: 6, tempC: 28, label: "Moderate heat" };

export type BreadcrumbTrail = { id: string; trailId: string; trailName: string; date: string; distanceKm: number; rescueKey: string };
export type JournalEntry = { id: string; speciesId: string; date: string; trailName: string };

export const seedBreadcrumbs: BreadcrumbTrail[] = [
  { id: "bc1", trailId: "zaghouan", trailName: "Jebel Zaghouan Summit", date: "May 12", distanceKm: 12.4, rescueKey: "ZGN-4821-RX9" },
  { id: "bc2", trailId: "tamerza", trailName: "Tamerza Canyon & Oasis", date: "Apr 28", distanceKm: 9.5, rescueKey: "TMZ-1129-K2L" },
  { id: "bc3", trailId: "aindraham", trailName: "Ain Draham Cork Forest", date: "Apr 14", distanceKm: 8.2, rescueKey: "ADR-7720-Q8P" },
];

export const seedJournal: JournalEntry[] = [
  { id: "j1", speciesId: "sp5", date: "May 02", trailName: "Ichkeul Wetlands" },
  { id: "j2", speciesId: "sp1", date: "Apr 18", trailName: "Jebel Zaghouan Summit" },
  { id: "j3", speciesId: "sp6", date: "Mar 30", trailName: "Tamerza Canyon" },
];
