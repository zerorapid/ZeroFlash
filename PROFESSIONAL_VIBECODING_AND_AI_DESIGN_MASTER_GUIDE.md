# 🚀 The Master Reference Manual: AI Engineering, Vibecoding & Modern UI/UX Architecture

> **A Comprehensive Practitioner's Guide & Cheatsheet**  
> Compiled for professional software engineering, client website delivery, and autonomous agent workflows.

---

## 📑 Table of Contents
1. [AI Coding Agent Infrastructure & Optimization (Graft & Colibrì)](#1-ai-coding-agent-infrastructure--optimization)
2. [Autonomous Workflows & DevOps (Goose AI & MCP Market)](#2-autonomous-workflows--devops)
3. [The Anti-AI-Slop Design Stack (TasteSkill, Impeccable, DESIGN.md & img2threejs)](#3-the-anti-ai-slop-design-stack)
4. [Real-Time Client Co-Design & Tuning (DialKit)](#4-real-time-client-co-design--tuning)
5. [The 4 Insane WebGL & 3D Visual Effects Engines](#5-the-4-insane-webgl--3d-visual-effects-engines)
6. [3D Component Registries & Micro-Animations (ThreeUI & Motion Primitives)](#6-3d-component-registries--micro-animations)
7. [The Master 50 UI Libraries & Registries Taxonomy](#7-the-master-50-ui-libraries--registries-taxonomy)
8. [Trending Open-Source AI Engines & Tools](#8-trending-open-source-ai-engines--tools)
9. [Free AI APIs, Tokens & Quantization (GLM, FreeLLMAPI & TurboQuant)](#9-free-ai-apis-tokens--quantization)
10. [The Cindy Zhu Vibecoding & Career Playbook](#10-the-cindy-zhu-vibecoding--career-playbook)
11. [Copy-Paste Cheatsheet & Actionable Agent Prompts](#11-copy-paste-cheatsheet--actionable-agent-prompts)

---

# 1. AI Coding Agent Infrastructure & Optimization

### 🌳 Graft (`trailhq/Graft` / `@nanonets/graft`)
* **What it is**: An open-source codebase knowledge graph and context layer designed to eliminate "cold exploration" overhead in AI coding agents (Claude Code, Cursor, Codex, Antigravity).
* **How it works**:
  * **Tree-Sitter AST & Wiring Graph ($0 cost, deterministic)**: Parses 23 languages into `graft/.graph/wiring.json` without requiring an LLM API key.
  * **Semantic Markdown Graph (`graft/*.md`)**: Generates plain-English summaries and crux logic snippets of each module so the agent grasps the architecture up front.
  * **Zero-Commit Local Cache**: Adds `graft/` to `.gitignore` and performs sub-millisecond fingerprint checks to update the graph on uncommitted edits.
* **Benchmarks**:
  * Tool-call reduction: **+46%**
  * Token savings: **+42%**
  * Latency savings: **+60%**
  * SWE-bench Verified: **+12 pts** (66% vs 54% cold baseline)
* **Quickstart**:
  ```bash
  npm install -g @nanonets/graft
  graft init
  ```

---

### 🐦 Colibrì (`justvugg.github.io/colibri` / `JustVugg/colibri`)
* **What it is**: A pure C, zero-dependency inference engine that runs **massive frontier MoE models (744B to 2.8 Trillion parameters)** on consumer hardware (e.g. 32 GB RAM Macs/PCs).
* **Supported Models**: GLM-5.2/5.3 (744B), Kimi K3 (2.8T), Inkling (975B), DeepSeek V4 Flash (284B), Qwen3.8-Flash-Next (125B).
* **Key Architecture ("A JIT for Weights")**:
  * **Hierarchical Placement**: Attention/dense layers stay resident in RAM (~9.9 GB INT4); 19,456 routed MoE experts live on NVMe SSD (~370 GB).
  * **On-Demand Streaming & Lookahead Prefetch**: Only active experts (~5.4% of total params) are fetched just-in-time per token.
  * **Adaptive Learning Cache (`.coli_usage`)**: Automatically pins the hottest experts used by your specific workloads.
  * **Dual-SSD Striping**: Streams weights in parallel across two NVMe drives to double disk bandwidth.
* **CLI & Visualizations**:
  * Web Dashboard: `./coli web` (live cortex brain & 3D galaxy atlas).
  * Local Cluster: `./coli cluster` (distribute expert FFNs across local machines).
  * API Server: `./coli serve` (OpenAI-compatible endpoint).

---

# 2. Autonomous Workflows & DevOps

### 🪿 Goose AI (`goose-docs.ai` / `block/goose` by Block & AAIF)
* **What it is**: A local-first, open-source autonomous AI agent available as a Desktop GUI, CLI, and API.
* **Core Concepts**:
  * **MCP Extensions**: Connects to databases (Postgres, SQLite), developer tools (GitHub, Git), browser automation, and APIs.
  * **Recipes (`.yaml`)**: Reusable task automation scripts.
  * **Goosehints (`.goosehints`)**: Project-level guidelines and constraints.
  * **Local / Air-Gapped**: Runs with Ollama for zero-cloud data privacy.
* **Fintech & Testing Workflows**:
  * **API Simulation**: Tests payment flows (Stripe/Plaid sandbox) and webhook retries via MCP.
  * **Ledger Reconciliation**: Connects to SQL DBs to audit daily double-entry bookkeeping.
  * **Heuristic UX Audits**: Uses Browser MCP to test accessibility and Nielsen UX heuristics.
  * **GitHub PR Testing**: Clones branches, runs test suites, fixes failing assertions, and comments reports back to GitHub.

---

### 🛒 MCP Market (`mcpmarket.com`)
* **What it is**: The central registry and marketplace for Model Context Protocol (MCP) servers.
* **Categories**: Databases (PostgreSQL, Supabase, Redis), Dev Tools (GitHub, Docker, AWS), Browsing (Playwright, Puppeteer), Productivity (Slack, Notion, Linear).
* **Usage**: Generates copy-paste JSON config blocks for Claude Desktop, Antigravity, Cursor, and Goose.

---

# 3. The Anti-AI-Slop Design Stack

```
        ┌─────────────────────────────────────────────────────────┐
        │                 THE ANTI-SLOP PIPELINE                  │
        ├─────────────────────────────────────────────────────────┤
        │  1. DESIGN.md       →  Brand Tokens, Surfaces & Fonts   │
        │  2. Taste Skill     →  Typography & Spacing Discipline  │
        │  3. Impeccable      →  /polish, /distill, /clarify      │
        │  4. img2threejs     →  Code-only 3D WebGL Hero Scenes   │
        └─────────────────────────────────────────────────────────┘
```

### 1. Taste Skill (`tasteskill.dev` / `Leonxlnx/taste-skill`)
* Open-source `SKILL.md` that stops agents from outputting generic purple-gradient boilerplate. Enforces 4px/8px layout grids, optical alignment, and high-contrast typography.

### 2. Impeccable Style (`impeccable.style` / `pbakaus/impeccable`)
* AI design vocabulary created by Paul Bakaus. Provides 3 critical commands:
  * `/polish`: Removes AI tells (cheesy italic serifs, bad borders, generic kickers).
  * `/distill`: Eliminates card-in-card clutter and establishes clear visual dominance.
  * `/clarify`: Transforms bloated forms into intuitive, progressive user flows.

### 3. Awesome DESIGN.md (`github.com/voltagent/awesome-design-md`)
* Curated markdown design system specifications extracted from top-tier brands (Linear, Vercel, Stripe, Runway, Raycast).
* Drop a `DESIGN.md` in your project root to force coding agents to respect exact hex tokens, surface step levels, and border radii.

### 4. img2threejs (`github.com/img2threejs/img2threejs` / `img2threejs.io`)
* Reconstructs 2D image concepts into **pure procedural Three.js TypeScript code**.
* Zero heavy 3D asset downloads; produces lightweight, interactive 3D WebGL objects ready for orbit and animation in hero sections.

---

# 4. Real-Time Client Co-Design & Tuning

### 🎛️ DialKit (`dialkit.dev` / `joshpuckett/dialkit`)
* **What it is**: Embeds floating visual controls (sliders, color pickers, spring curve editors, timeline scrubbers, 2D pads) directly beside your live React/Next.js interface.
* **Why it wins client deals**:
  * **Live Zoom Co-Design**: Tweak spacing, colors, and font sizes live during client presentations to lock in immediate approvals without revision email loops.
  * **Apple-Grade Spring Curves**: Fine-tune `visualDuration`, `bounce`, `stiffness`, and `damping` visually.
  * **Timeline Scrubber (`DialTimeline`)**: Scrub back and forth to dial in staggered entrance animations.
  * **Production Isolation**: Automatically hidden in production builds; enabled via `productionEnabled`.

```tsx
'use client'
import { DialRoot, useDialKit } from 'dialkit'
import 'dialkit/styles.css'

export default function Hero() {
  const values = useDialKit('HeroSection', {
    padding: [32, 8, 120],
    accentColor: '#3b82f6',
    spring: { type: 'spring', visualDuration: 0.5, bounce: 0.25 }
  })

  return (
    <div style={{ padding: values.padding, background: values.accentColor }}>
      <h1>Client Hero Title</h1>
      <DialRoot />
    </div>
  )
}
```

---

# 5. The 4 Insane WebGL & 3D Visual Effects Engines

| Effect | Repository / Tool | Best Used For |
| :--- | :--- | :--- |
| **1. Soft Moving Gradients** | [`ruucm/shadergradient`](https://github.com/ruucm/shadergradient) | Hero background colour washes with grain and organic light movement. |
| **2. Liquid Metal Chrome** | [`paper-design/liquid-logo`](https://github.com/paper-design/liquid-logo) / `liquid.paper.design` | Turning 2D PNG logos into morphing liquid mercury/chrome loops. |
| **3. Frosted Liquid Glass** | [`dashersw/liquid-glass-js`](https://github.com/dashersw/liquid-glass-js) | VisionOS frosted glass navigation bars, cards, and modals with true light refraction (vanilla JS, zero build step). |
| **4. Interactive 3D Objects** | [`pmndrs/react-three-fiber`](https://github.com/pmndrs/react-three-fiber) | Declarative Three.js 3D canvas components, rotating models, and cursor-reactive meshes. |

> **⚠️ The Golden Rule of WebGL Vibecoding**: Pick **ONE** visual star per page to preserve 60fps performance and mobile battery life. Always prompt your agent to include a `prefers-reduced-motion` fallback and pause WebGL loops when tabs are inactive.

---

# 6. 3D Component Registries & Micro-Animations

### 🌐 ThreeUI (`threeui.com/browse`)
* **Catalog**: 465+ copy-ready Three.js, React Three Fiber, and GLSL shader components.
* **Categories**: Full 3D website templates (MK·78, Noema N1, Vella Bank), 3D luxury credit cards, ASCII matrix backgrounds, CRT displays, procedural elements (Water, Flame, Lightning), and 3D typography vortexes.
* **MCP Integration (`threeui.com/mcp`)**: Coding agents can query and install 3D shaders directly.

### 🎭 Motion Primitives (`motion-primitives.com` / `ibelick/motion-primitives`)
* **Catalog**: 33+ copy-paste spring-animated components built with Motion.dev + Tailwind CSS.
* **Highlights**:
  * *Typography*: `text-effect`, `text-morph`, `text-scramble`, `text-shimmer`, `text-loop`.
  * *Micro-Interactions*: `magnetic` buttons, `tilt` 3D parallax cards, `spotlight`, `border-trail`.
  * *Navigation & Modals*: `morphing-dialog` (fluid card-to-modal expansion), `dock` (macOS bar), `toolbar-dynamic`.

---

# 7. The Master 50 UI Libraries & Registries Taxonomy

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           THE 50 UI LIBRARIES MATRIX                            │
├─────────────────────────────────────────────────────────────────────────────────┤
│ 🏆 Core Standards    : shadcn/ui, Headless UI, HeroUI, Tremor, DaisyUI          │
│ 🌟 Animation / Viral : Aceternity UI, Magic UI, Motion Primitives, React Bits,  │
│                        Kokonut UI, Skiper UI, Eldora UI, Animate UI, Smooth UI  │
│ 📦 Mega Registries   : 21st.dev, MVP Blocks, UI Layouts, Open Source UI         │
│ 💼 SaaS & Marketing  : Flowbite, Preline UI, Hyper UI, Float UI, Meraki UI,    │
│                        TailGrids, Tailark, Flyon UI                             │
│ 🎨 Niche & Themed    : 8bitcn (retro), Cult UI (tactile), Fancy Components,     │
│                        Velora UI (dark glass), Ninna UI (Nordic), Sera (fintech)│
│                        Jolly UI (React Aria a11y), Lex UI (editor), Lightswind  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

1. **8BITCN**: Retro pixelated 8-bit components.
2. **BASE CN**: Stripped-down clean baseline components.
3. **BE UI**: Modern utility-focused React blocks.
4. **COS UI**: Cosmic/desktop OS web interface style.
5. **CULT UI**: Curated tactile micro-interactions.
6. **DAISY UI**: Most popular pure Tailwind CSS class library.
7. **EASY UI**: High-converting template blocks.
8. **ELDORA UI**: Animated hero sections with Framer Motion.
9. **FANCY COMPONENTS**: Experimental canvas & shader components.
10. **HERO UI**: Accessible, fully styled React components (formerly NextUI).
11. **KIBO UI**: Micro-components and status badges.
12. **MAGIC UI**: 50+ animated landing page components.
13. **MOTION PRIMITIVES**: Spring-physics copy-paste components.
14. **MVP BLOCKS**: Pre-built full landing page sections.
15. **SHADCN/UI**: Unstyled Radix + Tailwind primitive standard.
16. **REACT BITS**: Creative interactive canvas & particle text.
17. **SPECTRUM UI**: Adobe Spectrum-inspired Tailwind components.
18. **VELORA UI**: Sleek dark mode glassmorphic SaaS blocks.
19. **WATERMELON UI**: Playful, vibrant Tailwind components.
20. **21ST DEV**: "npm for design engineers" component marketplace.
21. **ACETERNITY UI**: Viral animated SaaS components (Aurora, 3D Pin).
22. **AMICRO**: Minimalist micro-components.
23. **ANIMATE UI**: Curated React animation wrappers.
24. **BEAUTIFUL UI**: Clean aesthetic component collection.
25. **FLYON UI**: Semantic CSS + headless JS library.
26. **HEXTER UI**: Clean SaaS admin dashboard cards.
27. **JOLLY UI**: shadcn/ui built on React Aria for WCAG AAA accessibility.
28. **LIGHTSWIND**: Zero-bloat lightweight Tailwind UI.
29. **LEX UI**: Lexical-powered rich text editing primitives.
30. **REVERSE UI**: Inverted high-contrast minimalist aesthetic.
31. **SKIPER UI**: Sleek tabs, animated cards, and shaders.
32. **SMOOTH UI**: Fluid spring-physics UI primitives.
33. **TAILARK**: Conversion-focused marketing landing page sections.
34. **TAIL GRIDS**: 500+ Tailwind blocks & dashboard kits.
35. **UI LAYOUTS**: Curated responsive layout patterns.
36. **FLOWBITE**: Comprehensive enterprise Tailwind ecosystem.
37. **HYPER UI**: Free marketing, ecommerce, and dashboard blocks.
38. **PRELINE UI**: Massive open-source library with 400+ components.
39. **FLOAT UI**: Modern zero-config Tailwind sections.
40. **MERAKI UI**: Minimalist blocks with RTL & dark mode.
41. **KOKONUT UI**: Modern micro-interactions & AI chat UI.
42. **NEX UI**: Next.js App Router-optimized primitives.
43. **NINNA UI**: Japanese/Scandinavian aesthetic UI blocks.
44. **SERA UI**: Dark-themed fintech & SaaS UI blocks.
45. **RE UI**: Reusable copy-paste responsive cards.
46. **SYNTAX UI**: Curated buttons, hover cards, and loaders.
47. **OPEN SOURCE UI**: Community open-source component directory.
48. **KIMIA UI**: Cleanly marked-up accessible Tailwind kit.
49. **TREMOR**: #1 standard for Tailwind charts & KPI dashboards.
50. **HEADLESS UI**: Official unstyled Tailwind Labs primitives.

---

# 8. Trending Open-Source AI Engines & Tools

1. **OpenClaude**: Open-source alternative to Claude Code CLI that lets you route prompts through any LLM (DeepSeek-V3, Qwen 2.5, GLM, local Ollama) while preserving the terminal coding experience.
2. **Invidious (`iv-org/invidious`)**: Self-hostable, ad-free, tracking-free alternative front-end to YouTube with RSS feeds and audio-only modes.
3. **OpenMAIC (Tsinghua University)**: Multi-Agent AI Classroom generating simulated professors, TAs, and student peer agents for interactive STEM learning.
4. **Academic Research Skills**: ~45k star prompt engineering repository for paper discovery (arXiv/PubMed), automated BibTeX formatting, and logic verification.
5. **MiniMind (`jingyaogong/minimind`)**: Minimalist PyTorch codebase to train your own 26M–100M parameter LLM from scratch (Pre-train, SFT, DPO/RLHF) on a single consumer GPU.
6. **0x Alpha**: Quantitative DeFi on-chain analytics, whale wallet trackers, and autonomous trading bots.

---

# 9. Free AI APIs, Tokens & Quantization

### 🎁 Free GLM Tokens (Zhipu AI BigModel)
* **Model**: `GLM-4-Flash` (Free unlimited tokens on `open.bigmodel.cn`).
* **Format**: OpenAI-compatible (`https://open.bigmodel.cn/api/paas/v4`).
* **Usage**: Can be bridged into local coding workflows via LiteLLM or custom MCP tools.

### 🌐 FreeLLMAPI Aggregators
* Unified proxy gateways that route requests across free tiers (Google AI Studio Gemini, Groq, Cloudflare Workers AI, Hugging Face, Mistral) with auto-failover on rate limits (HTTP 429).

### ⚡ TurboQuant
* **In Graphic Design**: GPU-accelerated color quantization (NeuQuant/Wu's algorithm) providing 80% PNG/GIF file reduction and instant 60-30-10 palette extraction.
* **In Generative AI**: Low-bit (INT4/INT2) quantization enabling real-time client-side UI generation in design tools.

---

# 10. The Cindy Zhu Vibecoding & Career Playbook

### 📚 Core Learnings from `cindyzhu.com.au/guides`
1. **The 80% Token Slash**: Use context pruning, custom agent skills (`SKILL.md`), and cache-aware workflows to prevent AI agents from re-reading the entire repo every turn.
2. **High-Ticket Delivery ($5k–$10k Sites)**: Combine no-code/low-code builders (Emergent, Blink) with custom React Three Fiber and ShaderGradient hero moments to sell premium digital experiences.
3. **Stop Being a Yes-Man**: Prompt AI agents to act as strict senior design critics who actively challenge UX mistakes, form bloat, and weak color contrast.
4. **The FDE (Forward Deployed Engineer) Advantage**: Use autonomous coding agents to build clickable, functional client prototypes in hours rather than presenting static Figma slides.

---

# 11. Copy-Paste Cheatsheet & Actionable Agent Prompts

### 📋 Prompt 1: The Anti-Slop Hero Section
```markdown
Read the DESIGN.md in this project and the ShaderGradient repository (https://github.com/ruucm/shadergradient). 
Build a responsive Hero Section for our client website with:
1. Full-width ShaderGradientCanvas background using brand colors [Hex1] and [Hex2] at 0.3 speed with subtle 8% grain.
2. High-contrast typography following an 8px grid scale.
3. Pause the WebGL render loop when off-screen or tab is hidden.
4. Add a prefers-reduced-motion CSS fallback.
5. Run /polish to eliminate any generic AI design tells.
```

### 📋 Prompt 2: Live Tuning with DialKit
```markdown
Wrap our pricing comparison card component with DialKit (useDialKit from 'dialkit').
Expose live sliders for:
- Card padding (min 16, max 64, default 32)
- Border radius (min 0, max 32, default 16)
- Spring hover physics (visualDuration 0.4, bounce 0.2)
- Accent border color
Mount <DialRoot /> so we can tune it visually on screen with the client.
```

### 📋 Prompt 3: Converting a 2D Product Visual to 3D Three.js
```markdown
Using img2threejs (https://github.com/img2threejs/img2threejs), analyze this 2D product reference image.
Generate a code-only, procedural Three.js TypeScript component (THREE.Group) that reconstructs the object with metallic/roughness material shaders, orbital mouse-tracking controls, and lighting. Do not use external .gltf downloads.
```

### 📋 Prompt 4: Running Heuristic UX & E2E PR Audits with Goose
```yaml
# audit-pr.yaml
name: Heuristic & Automated PR Audit
tasks:
  - prompt: "Checkout the latest PR branch and run the test suite with 'npm test'."
  - prompt: "Using Browser MCP, navigate to localhost:3000 to perform a Nielsen UX heuristic evaluation on the checkout flow."
  - prompt: "Generate a markdown summary report and post it as a comment on the GitHub PR."
```
