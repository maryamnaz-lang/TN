"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Text } from "../primitives";
import { Button } from "../ui/Button";
import { Dropdown } from "../ui/Dropdown";
import { Input } from "../ui/Field";
import { Icon } from "../Icon";
import { Scene } from "../shell/Scene";
import { TalOrb, TnLoader } from "../ui/TalOrb";
import { LOGO_SVG } from "@/lib/icons";
import { useDemo } from "@/lib/demo";
import { obLive, OB_WELCOME, OB_DONE } from "@/data/onboarding";
import { useStore } from "@/lib/store";
import s from "./onboarding.module.css";

/* /onboarding/ — Phase 1 ob.js: welcome → 2s loader → the questions →
   "You're all set" → "Find an Agent" → 2s loader → the dashboard. Tal's
   mark is the LIVE orb on every onboarding screen, as in Phase 1. The questions are the
   ones Super Admin keeps under Onboarding Questions (active, in order), so the count and the
   progress bar follow that list. An answer is keyed by question id; "Other" on a dropdown
   carries its own text. */
const OTHER = "__other";
export function Onboarding() {
  const router = useRouter();
  const { setStage } = useDemo();
  useStore();
  const QS = obLive();
  const [step, setStep] = useState(0);           // 0 welcome, 1..N questions, N+1 done
  const [loading, setLoading] = useState(false);
  const [ans, setAns] = useState<Record<string, string>>({});
  const N = QS.length;

  useEffect(() => {
    if (new URLSearchParams(location.search).get("load")) {
      setLoading(true);
      const t = setTimeout(() => setLoading(false), 2000);
      return () => clearTimeout(t);
    }
  }, []);
  /* `leave` keeps the loader on through a route change: clearing it first repainted "You're all
     set" while /candidate/ was still loading, so the screen jumped back before the dashboard. */
  const load = (then: () => void, leave = false) => { setLoading(true); setTimeout(() => { if (!leave) setLoading(false); then(); }, 2000); };
  useEffect(() => { router.prefetch("/candidate/"); }, [router]);
  const q = step >= 1 && step <= N ? QS[step - 1] : null;
  const k = q?.id ?? "";
  const ready = !q ? true : q.type === "dropdown" ? !!ans[k] && (ans[k] !== OTHER || !!ans[`${k}-other`]?.trim()) : !!ans[k]?.trim();
  const pct = step === 0 ? 0 : step > N ? 100 : ((step - 1) / N) * 100;

  return (
    <Scene>
      <div className={s.ob}>
        {loading ? (
          <div className={s.loader}><TnLoader /></div>
        ) : step === 0 ? (
          <>
            <div className={s.top}><span className={s.logo} dangerouslySetInnerHTML={{ __html: LOGO_SVG }} /></div>
            <div className={s.welcome}>
              <div className={s.col}>
                <TalOrb size={144} live className={s.orb} />
                <p className={s.hello}>{OB_WELCOME.title}</p>
                {OB_WELCOME.lede.map((l) => <p key={l} className={s.lede}>{l}</p>)}
                <button type="button" className={`${s.go} t-h3`} onClick={() => load(() => setStep(1))}>Let’s Get Started</button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className={s.bar}><div className={s.fill} style={{ "--w": `${pct}%` } as React.CSSProperties} /></div>
            <div className={s.top}>
              <span className={s.logo} dangerouslySetInnerHTML={{ __html: LOGO_SVG }} />
              {q && <Text role="desc" as="span">You’re almost there!</Text>}
            </div>
            <div className={s.main}>
              <div className={s.wrap}>
                <TalOrb size={52} live className={s.orb} />
                {q ? (
                  <>
                    <h1 className={s.title}>{q.text}</h1>
                    {q.type === "single" && (
                      <div className={s.opts} role="radiogroup">
                        {q.options.map((o, i) => (
                          <button key={i} role="radio" aria-checked={ans[k] === String(i)} className={`${s.opt} ${ans[k] === String(i) ? s.on : ""}`} onClick={() => setAns((a) => ({ ...a, [k]: String(i) }))}>
                            <span className={s.radio} /><Text role="body" as="span">{o.label}</Text>
                          </button>
                        ))}
                      </div>
                    )}
                    {q.type === "text" && <div className={s.field}><Input value={ans[k] ?? ""} placeholder={q.placeholder} onChange={(e) => setAns((a) => ({ ...a, [k]: e.target.value }))} /></div>}
                    {q.type === "dropdown" && (
                      <div className={s.field}>
                        <Dropdown variant="form" placeholder={q.placeholder || "Select an option"} value={ans[k]} onChange={(v) => setAns((a) => ({ ...a, [k]: v }))}
                          options={[...q.options.map((o, i) => ({ value: String(i), label: o.label })), ...(q.other ? [{ value: OTHER, label: "Other" }] : [])]} />
                        {ans[k] === OTHER && <Input value={ans[`${k}-other`] ?? ""} placeholder="Tell us more" onChange={(e) => setAns((a) => ({ ...a, [`${k}-other`]: e.target.value }))} />}
                      </div>
                    )}
                    <div className={s.foot}>
                      {step > 1 && <span className={s.prev}><Button kind="secondary" icon="arrowLeft" onClick={() => setStep(step - 1)}>Previous</Button></span>}
                      <Button kind="primary" go disabled={!ready} onClick={() => setStep(step + 1)}>Next</Button>
                    </div>
                  </>
                ) : (
                  <>
                    <h1 className={s.title}>{OB_DONE.title}</h1>
                    <Text role="desc" className={s.sub}>{OB_DONE.lede}</Text>
                    <div className={s.plan}>
                      <div className={s.planH}><span className={s.planT}>Your journey</span><span className={s.planN}>Step 2 of 4</span></div>
                      {OB_DONE.steps.map(([t, d, st]) => (
                        <div key={t} className={`${s.row} ${st ? s[st] : ""}`}>
                          <Icon name={st === "done" ? "checkFilled" : st === "on" ? "hourglass" : "circle"} />
                          <span className={s.rowB}><span className={s.rowL}>{t}</span><span className={s.rowD}>{d}</span></span>
                        </div>
                      ))}
                    </div>
                    <div className={s.foot}>
                      <Button kind="primary" go onClick={() => load(() => { setStage("new"); router.push("/candidate/"); }, true)}>Find an Agent</Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </Scene>
  );
}
