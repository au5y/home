# Task 7: Flexbox — Nav Bar & Stats Row

**Goal:** Build the breadcrumb nav and stats bar from the mockup using flexbox.

> Complete Task 6 first.

---

## Background reading

| Topic | Link | Relevant to |
|---|---|---|
| Flexbox basics | [MDN: Basic concepts of flexbox](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout/Basic_concepts_of_flexbox) | All steps |
| `justify-content` | [MDN: justify-content](https://developer.mozilla.org/en-US/docs/Web/CSS/justify-content) | Steps 2, 6 |
| `align-items` | [MDN: align-items](https://developer.mozilla.org/en-US/docs/Web/CSS/align-items) | Steps 2, 6 |
| `gap` in flex | [MDN: gap](https://developer.mozilla.org/en-US/docs/Web/CSS/gap) | Steps 3, 7 |

---

## What you're building

From the mockup:

**Nav bar** (top of page, inside `<header>`):
```
← BACK TO THE TRAIL · SIDE PROJECTS          [hiker icon]
```
Two things: a text breadcrumb on the left, a logo on the right.

**Stats bar** (below the subtitle):
```
2                ∞                1
SHIPPED PROJECTS  HALF-BAKED IDEAS  MOUNTAIN TO CLIMB
```
Three stat blocks side by side, each with a big number and a small label.

---

## Step-by-step checklist

### Nav bar

- [ ] **Step 1** — Inside `<header>`, add a `<nav class="breadcrumb">` as the first child with this text:
  `← BACK TO THE TRAIL · SIDE PROJECTS`
  For now, these don't need to be real links. A single `<span>` is fine.
- [ ] **Step 2** — Give `.breadcrumb` `display: flex`, `justify-content: space-between`, and `align-items: center`
- [ ] **Step 3** — Add a placeholder for the logo on the right: `<span class="logo-placeholder">[logo]</span>`
  Style it in monospace, small, muted. The real logo comes later.
- [ ] **Step 4** — Style the breadcrumb text: monospace, small (`0.75rem`), uppercase, letter-spacing

### Stats bar

- [ ] **Step 5** — Below the subtitle `<p>`, add a `<div class="stats-bar">` with three `<div class="stat">` children.
  Each stat needs a `<span class="stat-number">` and a `<span class="stat-label">`.
  Values: `2 / SHIPPED PROJECTS`, `∞ / HALF-BAKED IDEAS`, `1 / MOUNTAIN TO CLIMB`
- [ ] **Step 6** — Give `.stats-bar` `display: flex` and `gap` on the 8pt grid
- [ ] **Step 7** — Style `.stat-number`: large (2rem+), serif font, bold
- [ ] **Step 8** — Style `.stat-label`: monospace, small, uppercase, letter-spacing, muted color — use a token

---

## When you're done

The header should have a nav row at the top and a stats bar below the subtitle. Say **"check my work"**.
