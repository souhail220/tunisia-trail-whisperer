import { createFileRoute } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";

export const Route = createFileRoute("/_tabs")({
  component: MobileShell,
});
