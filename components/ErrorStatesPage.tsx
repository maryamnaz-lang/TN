"use client";
import { useState } from "react";
import { Page, PageHeader, Section, Text } from "./primitives";
import { Tabs } from "./ui/Tabs";
import { ErrorState, ERROR_CASES, type ErrorKind } from "./ui/ErrorState";
import { href, type PortalKey } from "@/lib/portals";

/* THE DEVELOPERS' STATES PAGE (Maryam 5 Nov 2026). The error screens are never reached in
   the prototype's happy path, so this page shows every case on demand, inside the real
   shell, for handover. It is off the rail and the account menu; the ⋮ prototype menu
   links it. A wrong URL anywhere shows the REAL "Page not found" (app/not-found.tsx);
   a thrown error shows the real "Something went wrong" (app/[portal]/error.tsx). Both
   draw the same <ErrorState> this page previews. */
export function ErrorStatesPage({ portal }: { portal: PortalKey }) {
  const [k, setK] = useState<ErrorKind>("error");
  const c = ERROR_CASES[k];
  return (
    <Page>
      <PageHeader title="Error States" desc="Every error screen the product can show, for the build. Pick a case to see it as the person sees it." />
      <Section kind="tabs">
        <Tabs items={(Object.keys(ERROR_CASES) as ErrorKind[]).map((key) => ({ key, label: ERROR_CASES[key].name }))}
          value={k} onChange={(v) => setK(v as ErrorKind)} />
      </Section>
      <Section noline>
        <Text role="desc">When it shows: {c.when}</Text>
        <ErrorState kind={k} home={href(portal)} onRetry={() => {}} reference={k === "error" ? "ERR-7F3A-2K9D" : undefined} />
      </Section>
    </Page>
  );
}
