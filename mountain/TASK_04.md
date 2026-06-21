# Task 4: Spacing & Rhythm

**Goal:** Add a page header section and audit every spacing value on the page against the 8pt grid.

> Complete Task 3 first. Do not start this task until Task 3 passes.

---

## Background reading

| Topic | Link | Relevant to |
|---|---|---|
| `<hr>` element | [MDN: `<hr>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/hr) | Step 2 |
| CSS `border` shorthand | [MDN: border](https://developer.mozilla.org/en-US/docs/Web/CSS/border) | Step 3 |
| `margin` and `padding` | [MDN: Box model](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Box_model) | Step 5 |

---

## Step-by-step checklist

### Build the header

- [ ] **Step 1** — Above your `.card-grid`, add a `<header>` element containing:
  - A site name (your choice — could be "Games", "The Hub", whatever fits)
  - A one-line description of what this page is (e.g. "A collection of browser-based games")
- [ ] **Step 2** — Below the description, add an `<hr>` element to visually separate the header from the cards
- [ ] **Step 3** — Style the `<hr>` in CSS:
  - Remove the default browser border and replace it with a `border-top` using `--color-border`
  - Set its height to `0` (the line comes from the border, not the element height)
  - No default browser styling should be visible

### Spacing audit

Go through every padding, margin, and gap value on the page — in both your HTML and CSS.

- [ ] **Step 4** — List every spacing value you find (write them down somewhere, even just comments)
- [ ] **Step 5** — Replace any value that is not a multiple of 4 or 8 with the nearest one that is
- [ ] **Step 6** — Add spacing between the `<header>` and `.card-grid` — must be on the grid

### Tokens check

- [ ] **Step 7** — Ensure `--color-border` exists on `:root` and is used for both card borders and the `<hr>`
- [ ] **Step 8** — You should be able to state out loud why you chose each spacing value.
  "I used 32px here because it's a section break; I used 16px here because it's internal card spacing."
  If you can't explain it, it's a guess — fix it.

---

## When you're done

Say **"check my work"**. I'll ask you to explain two or three specific spacing values before I pass you.
