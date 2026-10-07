# Talent Agent portal

Working front-end prototype of the TalentNext Talent Agent portal, unbundled into ordinary files.
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
| `css/` | the stylesheets (`design-system.css` is the shared TalentNext design system; `agent-portal.css` holds this portal's own additions) |
| `js/` | the scripts, loaded in the numbered order: `01-design-system.js` shared helpers and components, `02-agent-portal.js` this portal's data and screens |
| `images/` | photos, course covers, badges, artwork |
| `logos/` | brand and issuer marks |
| `fonts/` | web fonts (Plus Jakarta Sans and others) |
| `media/` | video and audio (Tal's animated mark, voice) |


Exported 2026-10-07 from the TalentNext prototype repository.
