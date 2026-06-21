# Task 2: Typography

**Goal:** Load two fonts from Google Fonts and apply them correctly with proper font stacks and body defaults.

---

## Background reading

| Topic | Link | Relevant to |
|---|---|---|
| How to use Google Fonts | [Google Fonts — Get Started](https://fonts.google.com/knowledge/using_type/using_web_fonts_from_a_font_service) | Steps 1–2 |
| The `font-family` property | [MDN: font-family](https://developer.mozilla.org/en-US/docs/Web/CSS/font-family) | Steps 3–4 |
| Generic font families | [MDN: Generic font families](https://developer.mozilla.org/en-US/docs/Web/CSS/font-family#generic-name) | Steps 3–4 |
| `line-height` | [MDN: line-height](https://developer.mozilla.org/en-US/docs/Web/CSS/line-height) | Step 5 |
| `font-size` and rem | [MDN: font-size](https://developer.mozilla.org/en-US/docs/Web/CSS/font-size) | Step 6 |

---

## Your choices

You need to pick two fonts from [fonts.google.com](https://fonts.google.com). Browse with the aesthetic in mind: **trailhead pamphlet — newspaper, field guide, ink on paper.**

- **Serif** (for headings): something with character. Not Times New Roman-generic. Think: old-press, editorial.
- **Monospace** (for metadata/labels): something crisp and readable at small sizes.

- **Shadows Into Light**: hand written stuff [here](https://fonts.google.com/specimen/Shadows+Into+Light)

- **Stack Sans Headline**: headings [here](https://fonts.google.com/specimen/Stack+Sans+Headline)


---

## Step-by-step checklist

### Load the fonts

- [ ] **Step 1** — Go to Google Fonts, select your serif and monospace fonts, and get the `<link>` embed code
  - Google Fonts gives you a `<link>` snippet — it goes in `<head>`, *before* your stylesheet link. Why before? Think about it.
- [ ] **Step 2** — Add the Google Fonts `<link>` to `index.html`

### Apply them in CSS

- [ ] **Step 3** — Create a `--font-serif` custom property on `:root` with your serif font name and at least one fallback
  - A fallback is what the browser uses if the web font fails to load. What's the right generic fallback for a serif? Check the MDN generic font families article.
- [ ] **Step 4** — Create a `--font-mono` custom property the same way, with a monospace fallback
- [ ] **Step 5** — Apply `--font-serif` to your `h1`; remove the Arial placeholder
- [ ] **Step 6** — Add a `<p>` element somewhere in `index.html` with a short label (e.g., `"est. 2025"` or `"v1.0"`) and give it a class. Apply `--font-mono` to that class in CSS.
- [ ] **Step 7** — Set `line-height` on `body` to a unitless value between 1.4 and 1.6
  - Why unitless instead of px or rem? The MDN article explains this. It matters.
- [ ] **Step 8** — Set `font-size` on `body` using `rem`, not `px`
  - `1rem` equals the browser default (usually 16px). You can leave it at `1rem` or nudge it slightly.

---

## When you're done

Open the page. You should see:
- The "Games" heading in your chosen serif font
- A small label in your monospace font
- No Arial, no Times New Roman, no browser defaults

Then say **"check my work"**.
