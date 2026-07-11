# Task 6: Page Container

**Goal:** Constrain the page width and add consistent page-level padding so the layout doesn't stretch edge-to-edge on wide screens.

---

## Background reading

| Topic | Link | Relevant to |
|---|---|---|
| `max-width` | [MDN: max-width](https://developer.mozilla.org/en-US/docs/Web/CSS/max-width) | Step 1 |
| `margin: auto` centering | [MDN: margin](https://developer.mozilla.org/en-US/docs/Web/CSS/margin) — see "centering" | Step 2 |
| `padding` on block elements | [MDN: padding](https://developer.mozilla.org/en-US/docs/Web/CSS/padding) | Step 3 |

---

## The problem

Right now your content stretches to fill the full browser width. On a wide monitor, lines of text become uncomfortably long and cards get enormous. Real editorial layouts constrain width intentionally.

---

## Step-by-step checklist

- [ ] **Step 1** — Wrap all content inside `<body>` in a `<div class="container">`
- [ ] **Step 2** — In CSS, give `.container` a `max-width` of `960px` or `1024px`
- [ ] **Step 3** — Center it horizontally using `margin-left: auto` and `margin-right: auto`
  (or the shorthand — look up how `margin: 0 auto` works)
- [ ] **Step 4** — Add horizontal padding to `.container` so content doesn't touch the edges on narrow screens. Use a value on the 8pt grid.
- [ ] **Step 5** — Remove the `padding: 8px` from `.card-grid` — that job now belongs to `.container`

---

## When you're done

Resize your browser window narrow and wide. The content should stay centered and never touch the edges. Say **"check my work"**.
