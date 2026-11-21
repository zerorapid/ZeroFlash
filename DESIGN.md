# DESIGN.md — Brand Design Tokens & Anti-AI-Slop Architecture
*Target Aesthetic: Apple Studio Precision + Airbnb Superhost Warmth + Interactive 3D WebGL*

---

## 🎨 1. Core Color System (Hex Tokens)

### Backgrounds & Neutral Surfaces
| Token Name | Hex Code | Purpose |
| :--- | :--- | :--- |
| `surface-canvas` | `#F5F5F7` | Primary page canvas (Apple high-key off-white) |
| `surface-card` | `#FFFFFF` | Primary elevated card surface |
| `surface-subtle` | `#F9F9FB` | Secondary nested surface / table alternating rows |
| `surface-muted` | `#F0F0F3` | Inactive pills, slider tracks, subtle borders |
| `border-subtle` | `rgba(0, 0, 0, 0.04)` | Ultra-soft card divider |
| `border-medium` | `rgba(0, 0, 0, 0.08)` | Interactive container border |
| `border-strong` | `rgba(0, 0, 0, 0.16)` | Selected state / active card highlight |

### Text & Contrast Hierarchy (WCAG AAA Compliant)
| Token Name | Hex Code | Purpose |
| :--- | :--- | :--- |
| `text-primary` | `#1D1D1F` | Headlines, primary copy, active labels (High optical contrast) |
| `text-secondary` | `#6E6E73` | Subheadlines, body copy, descriptions |
| `text-tertiary` | `#86868B` | Metadata, timestamps, captions, table headers |
| `text-disabled` | `#D2D2D7` | Disabled buttons, placeholder text |

### Accent Brand Colors
| Brand / Agent | Hex Code | Application |
| :--- | :--- | :--- |
| **Airbnb Coral** | `#FF385C` | Primary CTA buttons, conversion badges, AURA agent highlight |
| **Apple Blue** | `#0071E3` | Secondary links, data streams, APEX media buyer highlight |
| **Apple Purple** | `#5856D6` | Intelligence tags, ATLAS incrementality highlight |
| **Apple Green** | `#34C759` | Verified badges, security audits, AEGIS compliance highlight |
| **Amber Gold** | `#F5A623` | Star ratings, verified review counters |

---

## 📐 2. Spatial Scale & 4px/8px Layout Grid

Never use arbitrary padding or margins (e.g. `p-[17px]`). All spatial values must snap strictly to the 8px grid scale:

| Unit | Size | Tailwind Token | Usage |
| :--- | :--- | :--- | :--- |
| `space-1` | `4px` | `p-1`, `gap-1` | Micro-badge gaps, tag padding |
| `space-2` | `8px` | `p-2`, `gap-2` | Button inner padding, icon offsets |
| `space-3` | `12px` | `p-3`, `gap-3` | Form inputs, small card paddings |
| `space-4` | `16px` | `p-4`, `gap-4` | Card interior padding, metric grids |
| `space-6` | `24px` | `p-6`, `gap-6` | Standard card containers, bento boxes |
| `space-8` | `32px` | `p-8`, `gap-8` | Hero card interiors, section grids |
| `space-12` | `48px` | `py-12` | Metric strips, divider spacing |
| `space-16` | `64px` | `py-16` | Section headers |
| `space-24` | `96px` | `py-24` | Major section boundaries |

---

## 🏔️ 3. Surface Elevation & Shadows

Avoid muddy, dark drop-shadows. Use subtle, multi-layered diffuse shadows that simulate optical ambient daylight:

```css
/* Apple Precision Shadows */
--shadow-apple-sm: 0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02);
--shadow-apple-card: 0 10px 30px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02);
--shadow-apple-hover: 0 20px 40px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.03);
--shadow-apple-floating: 0 30px 60px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.04);
```

---

## 🔲 4. Border Radius Standards

- **Buttons & Pills:** `rounded-full` (`9999px`) — Airbnb search pills and Apple action buttons.
- **Bento & Major Feature Cards:** `rounded-3xl` (`24px` to `28px`).
- **Inner Controls & Secondary Cards:** `rounded-2xl` (`16px`).
- **Small Chips & Badges:** `rounded-xl` (`12px`).

---

## 🛡️ 5. The Anti-AI-Slop Rules

1. **NO Cheesy AI Gradients:** Never generate generic neon-purple-to-cyan text gradients or glowing neon cards. Stick to high-key `#F5F5F7` surfaces with clean `#1D1D1F` typography.
2. **NO Card-in-Card Clutter:** Eliminate nested card borders within nested cards. Use white space and surface steps (`#FFFFFF` on `#F9F9FB`) instead of extra border outlines.
3. **NO Passive Voice or Fluff:** Headlines must be direct and authoritative (Apple Keynote brevity). Subheads should be under 20 words.
4. **NO Low-Contrast Gray Text:** Body copy must have a minimum contrast ratio of `4.5:1` against the background (`#6E6E73` on `#FFFFFF` / `#F5F5F7` is compliant; `#A1A1AA` on white is strictly forbidden).

---

## 🌐 6. 3D WebGL Performance & Battery Guardrails

1. **The Single Visual Star Rule:** Limit active, continuous WebGL animation loops to **one** primary hero or viewport per screen viewport.
2. **Visibility Pause:** Always pause the `requestAnimationFrame` loop when `document.hidden === true` or when the canvas element scrolls out of the viewport using `IntersectionObserver`.
3. **Prefers-Reduced-Motion Fallback:** Provide a static CSS gradient or non-animated fallback mesh when `window.matchMedia('(prefers-reduced-motion: reduce)').matches` is detected.
4. **Context Cleanup:** Always dispose geometries, materials, and call `renderer.dispose()` on React unmount to prevent WebGL memory leaks during Fast Refresh.

---

## ⚡ 7. Impeccable Design Commands

- **/polish:** Strip generic AI tells (cheesy italic serifs, glowing cards, generic kickers).
- **/distill:** Establish visual hierarchy; cut card-in-card clutter down to essential content.
- **/clarify:** Turn complex workflows or dense data tables into intuitive, progressive disclosure layouts.
