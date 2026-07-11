# Task 9: Mixed Grid — Large Shipped + Small Placeholder Cards

**Goal:** Make shipped cards span 2 columns (large) and placeholder cards span 1 column (small), matching the mockup layout.

> Complete Task 8 first.

---

## Background reading

| Topic | Link | Relevant to |
|---|---|---|
| `grid-column: span` | [MDN: grid-column](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-column) | Step 1 |
| Implicit grid rows | [MDN: Auto-placement in grid layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Auto-placement_in_grid_layout) | Background |
| `grid-template-columns` with more columns | [MDN: grid-template-columns](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-columns) | Step 2 |

---

## What you're building

From the mockup:
- Shipped cards: large, 2-across (each spans 2 of 4 columns)
- Placeholder cards: small, 4-across (each spans 1 of 4 columns)

The trick: switch the grid to **4 columns** and make shipped cards span 2.

---

## Step-by-step checklist

- [ ] **Step 1** — Change `.card-grid` to `repeat(4, 1fr)`
- [ ] **Step 2** — Give `.card` (shipped) `grid-column: span 2` so each takes up half the grid
- [ ] **Step 3** — `.card-tbd` should already span 1 column — verify it looks right at 4-across
- [ ] **Step 4** — Adjust card heights so shipped cards feel substantial and placeholders feel like reserved slots
  - Shipped: let content determine height, or set a `min-height`
  - Placeholders: set a fixed `min-height` that's smaller (on the 8pt grid)
- [ ] **Step 5** — Check that the layout still holds at a narrower browser width. If it breaks below ~600px, that's okay for now — responsive design is a future task.

---

## When you're done

The grid should show shipped cards large and prominent, placeholders small and subordinate — matching the mockup's visual hierarchy. Say **"check my work"**.
