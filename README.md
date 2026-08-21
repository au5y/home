# Personal Portfolio & Website

Source for my personal site — a static, scroll-driven "mountain climb" homepage.
No build step, no static site generator: plain HTML/CSS/JS served as-is.

## Structure

* `index.html`, `css/site.css`, `js/site.js`, `js/hiker.js` — the homepage.
* `data/adventures.md` — the tracker (states visited, ballparks, national
  parks, NH 4000-footers). This is the single source of truth: `js/site.js`
  fetches and parses this file at page load and renders the counts,
  percentages, and lists on the homepage from it. To update progress, just
  edit the checkboxes in this file and push — nothing else needs to change.
* `projects/index.html`, `css/projects.css` — the "Side & Hobby Projects"
  page, linked from the homepage's Tinker Pile section.

## Local Development

Any static file server works, e.g.:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`. A real HTTP server (not `file://`) is
required since the homepage fetches `data/adventures.md` at runtime.

## Deployment

Static files, deployable anywhere that serves plain HTML (GitHub Pages,
Vercel, etc.) with no build step.
