# Task 5: Placeholder Cards

**Goal:** Add 2–3 "coming soon" cards to the grid that are visually distinct from shipped games — without relying on color alone.

---

## Background reading

| Topic | Link | Relevant to |
|---|---|---|
| `opacity` | [MDN: opacity](https://developer.mozilla.org/en-US/docs/Web/CSS/opacity) | Step 3 |
| `border-style` values | [MDN: border-style](https://developer.mozilla.org/en-US/docs/Web/CSS/border-style) | Step 3 |
| `font-style` | [MDN: font-style](https://developer.mozilla.org/en-US/docs/Web/CSS/font-style) | Step 3 |
| CSS attribute selectors (bonus) | [MDN: Attribute selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors) | Optional |

---

## The constraint

**You may not use color as the only differentiator.** This is an accessibility rule: roughly 8% of men have some form of color vision deficiency. If "this card is different" is only communicated by a color change, those users can't perceive it.

Before you write any code, answer this question for yourself: *what are at least two non-color visual signals that communicate "not available yet"?*

---

## Step-by-step checklist

### HTML

- [ ] **Step 1** — Add 2–3 placeholder cards to `.card-grid`. You choose the game titles.
  - They need the same internal structure as real cards (number, title, description)
  - The description should communicate they're coming soon
  - Give them a class like `card card-placeholder` (both classes, so shared styles still apply)

### CSS

- [ ] **Step 2** — Add a `.card-placeholder` rule that applies at least **two** of the following signals:
  - Different `border-style` (e.g. `dashed`)
  - Reduced `opacity` on the whole card
  - A "coming soon" label using a different typographic treatment
  - `font-style: italic` on the title
  - A pattern or texture via CSS (advanced — skip if unfamiliar)

- [ ] **Step 3** — Make sure the grid layout doesn't break with 5–6 cards in it.
  Odd numbers in a 2-column grid will leave a gap — that's fine and intentional.

### Accessibility check

- [ ] **Step 4** — Look at your page and ask: if I could not distinguish any colors, would I still know which cards are placeholders?
  If the answer is no, add another signal.

---

## When you're done

Say **"check my work"**. I'll ask you to name the two visual signals you used and explain the accessibility reason behind the constraint.
