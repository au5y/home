# Task 10: Display Typography & Polish

**Goal:** Scale up the page heading to match the mockup's large display treatment, and do a final polish pass on the whole page.

> Complete Task 9 first.

---

## Background reading

| Topic | Link | Relevant to |
|---|---|---|
| `clamp()` for fluid type | [MDN: clamp()](https://developer.mozilla.org/en-US/docs/Web/CSS/clamp) | Step 2 |
| `letter-spacing` | [MDN: letter-spacing](https://developer.mozilla.org/en-US/docs/Web/CSS/letter-spacing) | Step 3 |
| `text-transform` | [MDN: text-transform](https://developer.mozilla.org/en-US/docs/Web/CSS/text-transform) | Step 4 |
| `font-weight` | [MDN: font-weight](https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight) | Step 2 |

---

## What you're building

From the mockup, the `h1` is enormous — a display headline that dominates the header. It scales with the viewport rather than being fixed. The breadcrumb and stats use tight uppercase monospace. Everything feels intentional.

---

## Step-by-step checklist

### Display heading

- [ ] **Step 1** — Change the `h1` font-size to something large. Start with `4rem` and see how it feels.
- [ ] **Step 2** — Replace the fixed size with `clamp()` so it scales between a minimum and maximum:
  `font-size: clamp(2.5rem, 8vw, 6rem)`
  Read the MDN article to understand what the three values mean before you apply it.
- [ ] **Step 3** — Add `line-height: 1` or `0.95` to the `h1` — display headings sit tighter than body text
- [ ] **Step 4** — Add `font-style: italic` to `h1` to match the mockup's italic serif treatment

### Breadcrumb polish

- [ ] **Step 5** — Ensure breadcrumb text is `text-transform: uppercase` and has `letter-spacing`
- [ ] **Step 6** — Verify it's using `--font-mono` and a muted color token

### Final audit

- [ ] **Step 7** — Read through your entire CSS file top to bottom. Ask for each rule:
  - Is there a hardcoded color? → make it a token
  - Is there a magic number spacing value not on the 8pt grid? → fix it
  - Is there a duplicate rule? → consolidate it
  - Is there dead code (unused classes)? → delete it

- [ ] **Step 8** — Read through your HTML. Ask:
  - Is every element semantically correct?
  - Is there any inline style? → move it to CSS
  - Are there any leftover placeholder/test elements?

---

## When you're done

Say **"check my work"**. This is the final graded task — I'll do a full review of both files before signing off.
