"use client";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/shell/AppShell";
import { ErrorState } from "@/components/ui/ErrorState";
import { href, PORTALS, type PortalKey } from "@/lib/portals";

/* THE REAL "PAGE NOT FOUND" (Maryam 5 Nov 2026). Any URL the app does not know lands
   here. The site is a static export, so this is the host's 404 page and cannot be
   rendered inside a portal's layout; it reads the portal off the path itself and draws
   that portal's shell around the message. A path under no portal opens the candidate's. */
export default function NotFound() {
  const [p, setP] = useState<PortalKey | null>(null);
  useEffect(() => {
    const seg = location.pathname.split("/").filter(Boolean)[0];
    setP(seg && seg in PORTALS ? (seg as PortalKey) : "candidate");
  }, []);
  if (!p) return null;
  return (
    <AppShell portal={p}>
      <ErrorState kind="notfound" home={href(p)} />
    </AppShell>
  );
}
