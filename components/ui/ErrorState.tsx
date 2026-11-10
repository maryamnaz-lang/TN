"use client";
import s from "./errorstate.module.css";
import { Text } from "../primitives";
import { Icon } from "../Icon";
import { Button } from "./Button";
import type { IconName } from "@/lib/icons";

/* <ErrorState> — the one error screen, every portal (Maryam 5 Nov 2026). The live build
   showed a bare "Something went wrong. Please try again." with a text link inside the
   shell; this replaces it. It sits in the CONTENT area, so the header and side nav stay
   and the person can always leave. Each case is a mark, a title, one line and its way
   out; a technical reference is optional and only where support would ask for it.
   The cases are listed once in ERROR_CASES so the real pages (not-found, the error
   boundary) and the developers' states page draw exactly the same thing. */
export type ErrorKind = "error" | "notfound" | "access" | "offline";

type Case = { icon: IconName; title: string; desc: string; action: "retry" | "home"; second?: "home" | "back" };

export const ERROR_CASES: Record<ErrorKind, Case & { name: string; when: string }> = {
  error: {
    name: "Something went wrong", when: "A page fails to load or an action fails on the server (5xx, an unhandled error).",
    icon: "warning", title: "Something went wrong",
    desc: "We couldn't load this page. Try again, and if it keeps happening, come back in a few minutes.",
    action: "retry", second: "home",
  },
  notfound: {
    name: "Page not found", when: "The link is wrong or the page no longer exists (404).",
    icon: "search", title: "Page not found",
    desc: "The page you are looking for doesn't exist or has moved.",
    action: "home", second: "back",
  },
  access: {
    name: "No access", when: "The signed-in account does not have permission for this page (403).",
    icon: "locked", title: "You don't have access to this page",
    desc: "Your role doesn't include this page. If you need it, ask your administrator.",
    action: "home", second: "back",
  },
  offline: {
    name: "You're offline", when: "The browser has lost its connection.",
    icon: "warningAlt", title: "You're offline",
    desc: "Check your internet connection, then try again.",
    action: "retry",
  },
};

export function ErrorState({
  kind, home = "/", onRetry, reference,
}: { kind: ErrorKind; home?: string; onRetry?: () => void; reference?: string }) {
  const c = ERROR_CASES[kind];
  const retry = onRetry ?? (() => location.reload());
  const back = () => (history.length > 1 ? history.back() : location.assign(home));
  const btn = (a: "retry" | "home" | "back", primary: boolean) => {
    const kindB = primary ? "primary" : "secondary";
    if (a === "retry") return <Button kind={kindB} icon="restart" onClick={retry}>Try Again</Button>;
    if (a === "home") return <Button kind={kindB} href={home}>Go To Dashboard</Button>;
    return <Button kind={kindB} icon="arrowLeft" onClick={back}>Go Back</Button>;
  };
  return (
    <div className={s.wrap} role={kind === "error" || kind === "offline" ? "alert" : undefined}>
      <span className={s.mark}><Icon name={c.icon} /></span>
      <div className={s.text}>
        <Text role="h2">{c.title}</Text>
        <Text role="desc">{c.desc}</Text>
      </div>
      <div className={s.acts}>
        {btn(c.action, true)}
        {c.second && btn(c.second, false)}
      </div>
      {reference && <Text role="caption" ink="secondary" className={s.ref}>Error reference: {reference}</Text>}
    </div>
  );
}
