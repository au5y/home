# Task 1: The Shell

**Goal:** A valid HTML5 page with a linked stylesheet, a background color token, and correct box-sizing.

---

## Background reading

Read these before you start. Each one is short and directly relevant to a step below.

| Topic | Link | Relevant to |
|---|---|---|
| HTML document structure | [MDN: Getting started with HTML](https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML/Getting_started) | Steps 1–3 |
| The `<link>` element | [MDN: `<link>` — the External Resource Link element](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/link) | Step 4 |
| `box-sizing` | [MDN: box-sizing](https://developer.mozilla.org/en-US/docs/Web/CSS/box-sizing) | Step 7 |
| CSS custom properties | [MDN: Using CSS custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) | Steps 6, 8, 9 |
| `:root` pseudo-class | [MDN: :root](https://developer.mozilla.org/en-US/docs/Web/CSS/:root) | Steps 6, 9 |

---

## Step-by-step checklist

Work through these in order. Check each box when done.

### index.html

- [x] **Step 1** — Add the DOCTYPE declaration as the very first line (before `<html>`)
- [x] **Step 2** — Add the `lang` attribute to your `<html>` tag (hint: MDN "HTML element")
- [x] **Step 3** — Add a `<head>` section with a `<meta charset>` tag and a `<title>` tag
- [x] **Step 4** — Add a `<link>` tag inside `<head>` that points to `styles.css`
  - You'll need the `rel` and `href` attributes — look up which values they need
- [x] **Step 5** — In `<body>`, add an `<h1>` with the text "Games"

### styles.css

Create this file from scratch. Then:

- [x] **Step 6** — Declare a custom property `--color-background` on `:root`
  - Choose a dark, muted green. If you're not sure what hex value to use, think:
    forest floor, not neon. Something low-brightness, low-saturation.
- [x] **Step 7** — Apply `box-sizing: border-box` globally
  - There's a specific selector pattern for doing this correctly.
    MDN "box-sizing" shows it. Don't just use `*` — look at why.
- [x] **Step 8** — Set the `background-color` on `body` using your custom property via `var()`
- [x] **Step 9** — Pick a light color for the `<h1>` text so it's visible against the dark background
  - Define it as `--color-text` on `:root`, then apply it

---

## When you're done

Open `index.html` in a browser. You should see:
- A dark green page
- The word "Games" visible in light text
- No errors in the browser console (open DevTools → Console tab)

Then say **"check my work"** and I'll grade it.

---

## Hints available on request

If you get stuck, tell me *specifically* where you're stuck and I'll point you to the right MDN section — but I won't write the code for you.
