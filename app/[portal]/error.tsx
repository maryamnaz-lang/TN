"use client";
import { useParams } from "next/navigation";
import { ErrorState } from "@/components/ui/ErrorState";
import { href, PORTALS, type PortalKey } from "@/lib/portals";

/* A thrown error inside a portal page shows "Something went wrong" in the content area;
   the shell (bar, rail) stays so the person can leave (Maryam 5 Nov 2026). Try Again
   re-renders the segment. */
export default function PortalError({ reset }: { error: Error; reset: () => void }) {
  const { portal } = useParams<{ portal: string }>();
  const p = (portal in PORTALS ? portal : "candidate") as PortalKey;
  return <ErrorState kind="error" home={href(p)} onRetry={reset} />;
}
