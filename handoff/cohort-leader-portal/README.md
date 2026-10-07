# Cohort Leader portal

Working front-end prototype of the TalentNext Cohort Leader portal, unbundled into ordinary files.
It is the visual and behavioural reference: every screen, state and flow can be clicked
through. It is prototype code with hardcoded sample data and no backend.

## Run it

Browsers block some files when a page is opened straight from disk, so serve the folder:

```bash
python3 -m http.server 8000
```

then open http://localhost:8000 . The frame at the top switches Mobile / Tablet / Desktop.

## What is where

| Folder | Contents |
|---|---|
| `index.html` | the page shell |
| `css/` | the stylesheets (`portal.css` is the full design: tokens, components and every screen; `portal-2.css` is the prototype frame around the device) |
| `js/` | the scripts, loaded in the numbered order: `icons.js` the icon set, `data.js` the sample data, `views.js` the screens, `ai*.js` Tal (the AI assistant), `lead*.js` the cohort-leader screens, `ob.js` onboarding, `orb*.js` Tal's animated mark; `00-generated-assets.js` maps image names to files |
| `images/` | photos, course covers, badges, artwork |
| `logos/` | brand and issuer marks |
| `fonts/` | web fonts (Plus Jakarta Sans and others) |
| `media/` | video and audio (Tal's animated mark, voice) |

This folder opens on the cohort leader's dashboard (`#leader`). The candidate and cohort leader portals are the same application with a different signed-in user, so the code here matches the candidate folder.

Exported 2026-10-07 from the TalentNext prototype repository.
