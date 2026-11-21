---
name: anti-slop-design
description: >-
  Enforces the Anti-AI-Slop design system (TasteSkill, Impeccable Style, and DESIGN.md).
  Use this skill to execute /polish, /distill, and /clarify on UI layouts, enforce 4px/8px
  spatial grids, ensure WCAG AAA high-contrast typography, and manage 3D WebGL performance.
---

# Anti-Slop Design & Impeccable Style Skill

This skill enforces strict design discipline across all web interfaces, preventing generic AI aesthetic mistakes ("AI slop") and maintaining high-end Apple + Airbnb design standards.

---

## 🛠️ The 3 Core Impeccable Commands

### 1. `/polish`
- **Strip AI Tells:** Eliminate neon cyan/purple gradients, generic hero kickers ("Empower your journey"), and unprompted italic serifs.
- **Micro-Typography:** Ensure letter-spacing is tight on headlines (`tracking-tight` / `-0.02em`) and line-heights are proportional (`leading-[1.1]` for large titles, `leading-relaxed` for body).
- **Refine Surfaces:** Replace hard 1px solid black borders with soft translucent dividers (`rgba(0, 0, 0, 0.06)` or `rgba(255, 255, 255, 0.1)` in dark mode).
- **Optical Shadows:** Replace muddy CSS box-shadows with multi-layer ambient daylight shadows.

### 2. `/distill`
- **Eliminate Clutter:** Remove unnecessary nested cards inside cards.
- **Establish Hierarchy:** Maximize white space (padding `p-6` to `p-10`) so the eye immediately grasps the single primary call-to-action or data metric.
- **Copy Brevity:** Trim subheadings to under 20 words (Apple Keynote punchiness). Eliminate corporate jargon and marketing buzzwords.

### 3. `/clarify`
- **Progressive Disclosure:** Break multi-step forms or dense configurations into segmented pills, tabs, or interactive sliders.
- **Scannable Tables:** Use alternating subtle row backgrounds (`#F9F9FB`), clear semantic badges (Emerald for positive, Coral for active, Apple Blue for data), and high-contrast bold typography for key metrics.
- **Tactile Feedback:** Add gentle spring hover physics and magnetic cursor reactions to interactive elements.

---

## 📏 Layout & Spacing Discipline
- **8px Grid Constraint:** All margins, paddings, and gaps must be multiples of 4px or 8px (`4px`, `8px`, `12px`, `16px`, `24px`, `32px`, `48px`, `64px`, `96px`).
- **Contrast Check:** Verify that body text contrast against its immediate background meets or exceeds WCAG AA (`4.5:1`) standards.

---

## ⚡ WebGL & 3D Performance
- **Single Visual Star:** Never run multiple unthrottled WebGL canvas loops in the same viewport.
- **Visibility Observer:** Attach `document.hidden` or `IntersectionObserver` handlers to pause WebGL rendering when off-screen.
- **Fallback:** Support `prefers-reduced-motion` with static renders.
