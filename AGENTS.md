# Core Project Intent & Future Agent Plan (State Persistence)

This file contains the persistent blueprint, context, and future autonomous expansion plan for the Single-Column High-Speed Mobile-First Publisher (**ZeroNews**), powered by the Google AI Studio Antigravity coding agents.

---

## 🚀 The Operational Vision
The goal is to evolve **ZeroNews** from a static/semi-manual CMS into a **Human-in-the-Loop Autonomous Publishing Network** that publishes search-engine and answer-engine optimized (SEO, GEO, & AEO) tech journalism.

---

## 🛠️ Step-by-Step Implementation Blueprint

### Phase 1: Custom Domain & Deployment (Web Transition)
- **Action**: Bind the custom domain directly utilizing Cloud Run container routing.
- **Goal**: Maintain the `< 8ms` interaction latency and single-column mobile-optimized delivery metrics.

### Phase 2: Tech Aggregator Engine (Ingestion pipeline)
- **Action**: Configure server-side Cron jobs (e.g., using low-cost Google Cloud Scheduler or local trigger systems) in `/server.ts` to query tech-oriented APIs & RSS feeds (Hacker News, TechCrunch, Git repositories, Google Trends) every 10 minutes.
- **Data storage**: Fetch raw structures directly into temporary staging space ready for agent consumption.

### Phase 3: Gemini-Powered Drafting Agent
- **Action**: Set up background agent workflows with `gemini-2.5-pro` (or the latest workspace models) to process raw news items.
- **Workflow**:
  1. **Topic Selection & Deduplication**: Filter out low-value items and pick the highest-impact tech story of the hour.
  2. **High-Density Drafting**: Write the full article in Markdown format with responsive headings, code tags, and strict information hierarchy.
  3. **Auto-Optimization (Meta Suite)**:
     - Generate optimized **SEO Meta Title** (50-60 characters) and **Meta Description** (110-150 characters).
     - Assign **GEO Location Targeting** tags (such as city/state or "Global").
     - Formulate high-density **AEO (Answer Engine Optimization) summary quotes** perfect for LLM/Gemini snippet citations.
     - Build compliant **Structured FAQ schema** questions and answers (JSON-LD format).
     - Auto-generate structured image prompts or query royalty-free platforms with core focus terms for perfect descriptive image alt tags.

### Phase 4: Human-in-the-Loop Web Copilot (The Approval Interface)
- **Interface**: The Admin Panel acts as the control station.
- **Logic**: 
  - Instead of direct publishing, draft articles appear in a **"Pending Approval" staging tab** inside the Admin interface.
  - The human editor can review the full Markdown, adjust GEO indicators, fine-tune the AEO definitions, swap or attach custom Unsplash/local heroes, and make minor edits.
  - When the editor clicks **"Publish Article"**, the draft pushes dynamically to active storage, updates the index, auto-updates sitemaps, and is instantly served to active readers.

---

## 🛡️ Strategic Benefits: Safe & Dominant SEO Performance
- **Zero Risk of Spam Penalties**: Because the human clicks "Publish" and performs curation, the content matches search guidelines for high-quality, edited, human-originated work.
- **Maximized Indexing Accuracy**: The dynamic JSON-LD metadata and structured HTML FAQ schema directly enable voice assistants, Google Featured Snippets, and AI search engines (like Google Search Generative Experience / SGE) to instantly reference the articles.
- **Maximum Speed**: Serving static-fast React views on a NodeJS gateway yields a pure `0.00 CLS` and exceptionally fast loading speeds, locking in top Core Web Vitals rankings.

---

## 🛰️ Active Technical Indexing Infrastructure
The application contains robust, production-ready search and crawler auto-pings out of the box:
1. **Dynamic Sitemap (`/sitemap.xml`)**: Automatically lists all active live posts configured against the active host.
2. **High-Density RSS Feed (`/rss.xml`)**: Publishes fully detailed post elements with descriptions, titles, links, and correct pubDates for real-time aggregators.
3. **Automated Robots.txt (`/robots.txt`)**: Explicitly targets global crawlers and guides them directly to the auto-updating sitemap schema.
4. **Instant IndexNow Protocol Verification (`/zerotectnewskey2026.txt`)**: Returns the validation key proof to confirm domain ownership dynamically for automated ping validation.
5. **Auto-Push Service Pings**: On Admin Publish or Edit action, the backend issues an asynchronous push alert to the global `api.indexnow.org` cluster to immediately summon search engine web spiders to crawl the resource coordinates.

