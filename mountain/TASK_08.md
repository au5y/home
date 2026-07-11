# Task 8: Card Redesign — Dark Cards with Image Areas

**Goal:** Redesign shipped cards to match the mockup: dark background, image placeholder area, title overlaid at the bottom, category label in the corner.

> Complete Task 7 first.

---

## Background reading

| Topic | Link | Relevant to |
|---|---|---|
| `position: relative` and `absolute` | [MDN: position](https://developer.mozilla.org/en-US/docs/Web/CSS/position) | Steps 4–6 |
| `aspect-ratio` | [MDN: aspect-ratio](https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio) | Step 2 |
| `overflow: hidden` | [MDN: overflow](https://developer.mozilla.org/en-US/docs/Web/CSS/overflow) | Step 3 |
| `inset` shorthand | [MDN: inset](https://developer.mozilla.org/en-US/docs/Web/CSS/inset) | Step 5 |

---

## What you're building

From the mockup, shipped cards are:
- Dark background (close to page background, slightly different)
- A large image area taking up most of the card
- Game title large and italic at the bottom-left
- Category number + label at the top-right
- No visible content box — the title sits *on top of* the image area

This introduces `position: relative/absolute` — one of the most important CSS concepts.

---

## Step-by-step checklist

### Card structure changes

- [ ] **Step 1** — Update each shipped card's HTML to add `<div class="card-image-area">` as a child (keep it empty for now — images come later)
- [ ] **Step 2** — Give `.card-image-area` an `aspect-ratio` of `16/9` or `4/3` and a background color token (`--card-image-bg` — a dark muted tone)
- [ ] **Step 3** — Add `overflow: hidden` to `.card` so nothing bleeds outside the border

### Positioning

This is the key new concept. Read the MDN `position` article before this section.

- [ ] **Step 4** — Give `.card` `position: relative`
  Ask yourself: why does the parent need `position: relative` for the child's `position: absolute` to work?
- [ ] **Step 5** — Move the `.card-number` label to the top-right corner using `position: absolute` and `top`/`right` values on the 8pt grid
- [ ] **Step 6** — Move the `<h2>` title to the bottom of the card using `position: absolute` and `bottom`/`left` values

### Color update

- [ ] **Step 7** — Change `.card` background to a new token `--card-dark-bg` (a dark forest tone, close to but distinct from `--color-background`)
- [ ] **Step 8** — Update text colors inside dark cards — `--color-text` should work, verify it's readable

---

## When you're done

Shipped cards should look like dark panels with a large empty image area and the title sitting at the bottom. Say **"check my work"**.
