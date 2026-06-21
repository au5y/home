# Task 3: Game Cards

**Goal:** Three game cards in a CSS Grid layout. Each card has a number label, title, description, and category tag.

---

## Background reading

| Topic | Link | Relevant to |
|---|---|---|
| CSS Grid basics | [MDN: Basic concepts of grid layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Basic_concepts_of_grid_layout) | Steps 1–3 |
| `grid-template-columns` | [MDN: grid-template-columns](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-columns) | Step 2 |
| `repeat()` | [MDN: repeat()](https://developer.mozilla.org/en-US/docs/Web/CSS/repeat) | Step 2 |
| `gap` | [MDN: gap](https://developer.mozilla.org/en-US/docs/Web/CSS/gap) | Step 3 |
| The 8pt grid system | [Article: The 8-Point Grid](https://spec.fm/specifics/8-pt-grid) | Steps 4–5 |

---

## The games

| # | Title | Description | Category |
|---|---|---|---|
| 01 | Mahjong | Match tiles to clear the board before time runs out. | tile game |
| 02 | Spite & Malice | A competitive solitaire card game for two players. | card game |
| 03 | Five Clowns | Get five in a row before your opponent does. | strategy game |

---

## Step-by-step checklist

### HTML structure

- [x] **Step 1** — Create a container element (e.g. `<div class="card-grid">`) to hold all three cards
- [x] **Step 2** — Inside it, create three card elements. Each card needs:
  - A number label (`01`, `02`, `03`) — use a `<span>` or `<p>` with a class like `.card-number`
  - A game title in a heading tag — which level makes semantic sense here? (Hint: `<h1>` is already used)
  - A one-sentence description in a `<p>`
  - A category tag — `<span class="card-tag">tile game</span>` works

### CSS layout

- [x] **Step 3** — Give `.card-grid` a `display: grid` and `grid-template-columns` using `repeat()`
  - Target: 2 columns on wide screens. Don't hardcode pixel widths — use `1fr` units.
- [x] **Step 4** — Add a `gap` between cards. It must be a multiple of 8 (e.g. `16px`, `24px`, `32px`)

### Card styling

- [x] **Step 5** — Give each card internal padding. Use multiples of 8 only.
- [x] **Step 6** — Add a border to each card using a new `--color-border` custom property
- [x] **Step 7** — Set `border-radius` to 0, 2px, or 3px max — sharp corners only
- [x] **Step 8** — No hardcoded colors anywhere. Every color must reference a custom property.

### Typography hierarchy

The visual weight order from least to most prominent should be:
**number < description < title**

- [ ] **Step 9** — Make `.card-number` visually recessive: smaller size, muted color (a new token)
- [ ] **Step 10** — Make the title the most prominent element on the card

---

## When you're done

The page should show three cards in a 2-column grid. Visual hierarchy should be clear at a glance — the title dominates, the number is quiet.

Say **"check my work"**.
