# Tal scenarios — design coverage, one document per portal

Four documents, one per portal, written on 8 Sep 2026 for the Tal response design pass.
Each records every surface Tal speaks on, every page summary by state, every chat scenario
(question, response, whether it carries a visual), the refusals, and the state variation,
with the gaps found in the prototype while reading it.

| Document | Portal | Source read | Scenario cards |
|---|---|---|---|
| `01-candidate-tal-scenarios` | Candidate | `hifi/build/` (data, views, ai to ai11, ob) | 61 |
| `02-cohort-leader-tal-scenarios` | Cohort Leader | `hifi/build/lead*.js` + the shared Tal passes | 28 |
| `03-talent-agent-tal-scenarios` | Talent Agent | `tn-agent-portal.html` | 35 |
| `04-super-admin-tal-scenarios` | Super Admin | `tn-admin-portal.html` | 41 |

Each exists as `.md` (the source, edit this) and `.docx` (generated). To regenerate a `.docx`
after editing the markdown, the converter is a small node script that was written for these
files; the markdown subset it reads is: `##`/`###`/`####` headings, `**bold**`, `- ` bullets,
`> ` blocks (rendered as a "Tal says" box), `:: Key: Value` rows (rendered as a card's field
table), and `| pipe | tables |`.

## How the four fit together

- **Status on every card.** *In prototype* means the copy and behaviour exist in the portal
  today. *Proposed* means a real user will ask it and the response is written for design and
  build. The Cohort Leader document is mostly Proposed because that portal has no leader-side
  chat router yet; its section 4 doubles as the router's specification.
- **Response patterns** are named per portal (C1…C14 candidate, L1…L9 leader, P1…P9 agent
  and admin) because the portals have different widget vocabularies. The shared shapes are
  the Summary by Tal band, the chat opening, the thinking dots, the prose answer, the facts
  widget, the action button, the refusal and the support hand-off.
- **Tal's rules that hold on every portal:** the head-of-page band is labelled "Summary by
  Tal"; Tal never reads the billing ledger; Tal never presses an action for the user; every
  refusal names what Tal can answer and re-offers the page's chips.

## Where the copy came from

Every "In prototype" response is the portal's own string with template variables resolved
against the seed data. Where the prototype's copy contradicted its own data (a hard-coded
count beside a live one, a grammar edge case, a mislabelled subject) the document carries the
corrected sentence and lists the original under "Gaps found while reading the prototype".
