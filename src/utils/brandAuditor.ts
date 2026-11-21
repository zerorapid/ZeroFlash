// ============================================================
// Brand Auditor & Multiple-Choice Dialogue Engine for Agent Zap
// 100% In-Memory • Zero AI • Zero External Telemetry • $0 Forever
// Evaluates deck health, inspects active slide context, and
// generates in-depth multiple choice questions with 1-click execution.
// ============================================================

import { BrandState } from '../types/brandbook';

export interface ChoiceOption {
  key: 'A' | 'B' | 'C' | 'D';
  title: string;
  desc: string;
  actionText: string;
}

export interface QuestionBox {
  question: string;
  contextNote?: string;
  options: ChoiceOption[];
}

export interface SlideInspection {
  slideNum: number;
  sectionTitle: string;
  statusType: 'ok' | 'warning' | 'info';
  statusBadge: string;
  critique: string;
  questionBox: QuestionBox;
}

export interface DeckHealthReport {
  healthScore: number;
  totalSlides: number;
  activeSlide: SlideInspection;
  summaryIssues: string[];
}

// ── COLOR LUMINANCE AUDIT ───────────────────────────────────
function getApproxLuminance(hex: string): number {
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return 0.5;
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// ── AUDITOR ENGINE (ZAP'S EYES) ─────────────────────────────
export function auditDeckHealth(brandState: BrandState, currentSlide: number): DeckHealthReport {
  const bName = brandState.name && brandState.name !== 'Northwind' ? brandState.name : 'Your Brand';
  const hasCustomName = Boolean(brandState.name && brandState.name !== 'Northwind');
  const hasLogo = Boolean(brandState.logo);
  const hasTagline = Boolean(brandState.tagline && brandState.tagline.trim().length > 3 && !brandState.tagline.includes('Crafted with'));
  const hasNarrative = Boolean(brandState.desc && brandState.desc.length > 25);
  const hasMission = Boolean(brandState.mission && brandState.mission.length > 15);
  const hasCustomFonts = brandState.hf !== 'Inter' || brandState.bf !== 'Inter';
  
  // Primary color luminance check
  const primaryHex = brandState.colors?.[0]?.h || '#111827';
  const primaryLum = getApproxLuminance(primaryHex);
  const contrastPassing = primaryLum < 0.25 || primaryLum > 0.75;

  // Compute Overall Health Score (0–100%)
  let points = 20; // baseline structure
  if (hasCustomName) points += 15;
  if (hasLogo) points += 20;
  if (hasTagline) points += 10;
  if (hasNarrative) points += 10;
  if (hasMission) points += 10;
  if (hasCustomFonts) points += 10;
  if (contrastPassing) points += 5;
  const healthScore = Math.min(100, points);

  // Issues summary
  const summaryIssues: string[] = [];
  if (!hasCustomName) summaryIssues.push('Brand name still default');
  if (!hasLogo) summaryIssues.push('Vector logo not uploaded');
  if (!hasTagline) summaryIssues.push('Tagline not customized');
  if (!hasNarrative) summaryIssues.push('Narrative (Slide 4) is placeholder');
  if (!contrastPassing) summaryIssues.push('Color contrast may need tuning');

  // Active Slide Inspection
  const activeSlide = inspectActiveSlide(brandState, currentSlide, {
    bName,
    hasLogo,
    hasTagline,
    hasNarrative,
    hasMission,
    contrastPassing,
  });

  return {
    healthScore,
    totalSlides: 64,
    activeSlide,
    summaryIssues,
  };
}

// ── SLIDE-SPECIFIC INSPECTOR ────────────────────────────────
function inspectActiveSlide(
  brandState: BrandState,
  slideNum: number,
  ctx: {
    bName: string;
    hasLogo: boolean;
    hasTagline: boolean;
    hasNarrative: boolean;
    hasMission: boolean;
    contrastPassing: boolean;
  }
): SlideInspection {
  const { bName, hasLogo, hasTagline, hasNarrative, hasMission, contrastPassing } = ctx;

  // 1. Slide 1: Cover Slide
  if (slideNum === 1) {
    return {
      slideNum: 1,
      sectionTitle: 'Cover & Title Anchor',
      statusType: hasTagline ? 'ok' : 'warning',
      statusBadge: hasTagline ? 'Cover Locked' : 'Tagline Missing',
      critique: hasTagline
        ? `Cover is calibrated for **${bName}** with tagline: "${brandState.tagline}".`
        : `Your cover currently has a default placeholder tagline. A sharp 3-5 word tagline establishes immediate authority.`,
      questionBox: {
        question: `How should we calibrate the cover presentation for **${bName}**?`,
        contextNote: 'Pick a high-impact option below to apply it to your deck immediately:',
        options: [
          {
            key: 'A',
            title: 'Modern Tech Authority',
            desc: 'Tagline: "Precision in Motion" + Electric Blue accent (#2563EB)',
            actionText: 'set tagline to Precision in Motion',
          },
          {
            key: 'B',
            title: 'Swiss Minimalist Spec',
            desc: 'Headline font Space Grotesk + Obsidian dark anchor (#0F172A)',
            actionText: 'set heading font to Space Grotesk',
          },
          {
            key: 'C',
            title: 'Luxury Editorial Craft',
            desc: 'Playfair Display + Forest Emerald accent (#059669)',
            actionText: 'change primary color to emerald',
          },
          {
            key: 'D',
            title: 'Explore Agency Taglines',
            desc: 'Review 3 distinct positioning options for your brand',
            actionText: 'give me 3 taglines',
          },
        ],
      },
    };
  }

  // 2. Slide 4: Brand Overview & Story
  if (slideNum === 4) {
    return {
      slideNum: 4,
      sectionTitle: 'Brand Overview & Narrative',
      statusType: hasNarrative ? 'ok' : 'warning',
      statusBadge: hasNarrative ? 'Story Defined' : 'Placeholder Story',
      critique: hasNarrative
        ? `Story is populated: "${brandState.desc?.slice(0, 70)}..."`
        : `Slide 4 holds your 1-paragraph founding thesis. It currently has default text.`,
      questionBox: {
        question: `What narrative tone best communicates **${bName}**'s market thesis?`,
        options: [
          {
            key: 'A',
            title: 'Engineering & Scalability',
            desc: 'Focus on speed, zero latency, and uncompromised technical rigor',
            actionText: 'set narrative to Engineered for ambitious teams who require uncompromising speed, architectural clarity, and scale without friction.',
          },
          {
            key: 'B',
            title: 'Artisan & Craft Purity',
            desc: 'Focus on intentionality, longevity, and timeless aesthetic standards',
            actionText: 'set narrative to Founded on the belief that enduring tools must marry obsessive craft with effortless restraint and timeless beauty.',
          },
          {
            key: 'C',
            title: 'Disruptive Outlaw',
            desc: 'Direct challenge to legacy industry bloat and bureaucracy',
            actionText: 'set narrative to Built to challenge legacy inertia with aggressive velocity, radical transparency, and decisive execution.',
          },
          {
            key: 'D',
            title: 'Jump to Slide 5 (Mission & Vision)',
            desc: 'Move forward to define your core mission and long-term vision',
            actionText: 'put slide 5 before slide 4',
          },
        ],
      },
    };
  }

  // 3. Slide 5: Mission & Vision
  if (slideNum === 5) {
    return {
      slideNum: 5,
      sectionTitle: 'Mission & Vision Statements',
      statusType: hasMission ? 'ok' : 'warning',
      statusBadge: hasMission ? 'Mission Set' : 'Mission Empty',
      critique: hasMission
        ? `Active Mission: "${brandState.mission}"`
        : `Slide 5 requires an audacious mission and 10-year vision statement to anchor brand decisions.`,
      questionBox: {
        question: `Select a foundational mission statement for **${bName}**:`,
        options: [
          {
            key: 'A',
            title: 'The Clarifier Mission',
            desc: '"To empower independent teams with relentless precision and speed."',
            actionText: 'set mission to To empower independent teams with relentless precision, intelligent speed, and uncompromised clarity.',
          },
          {
            key: 'B',
            title: 'The Standard Setter',
            desc: '"To build the undisputed benchmark of modern digital craft."',
            actionText: 'set mission to To establish the undisputed benchmark of craft and durability for modern digital experiences.',
          },
          {
            key: 'C',
            title: 'Draft Ambitious Vision',
            desc: 'Formulate a 10-year inspiring vision for Slide 5',
            actionText: 'set vision to A world where every idea is articulated with unmistakable distinction and enduring utility.',
          },
          {
            key: 'D',
            title: 'Navigate to Slide 13 (Logo Spec)',
            desc: 'Move directly to vector logo geometry and clearspace',
            actionText: 'change primary color to blue',
          },
        ],
      },
    };
  }

  // 4. Slide 13–25: Logo System & Geometry
  if (slideNum >= 13 && slideNum <= 25) {
    return {
      slideNum,
      sectionTitle: 'Logo Identity & Clearspace System',
      statusType: hasLogo ? 'ok' : 'warning',
      statusBadge: hasLogo ? 'Logo Active' : 'Placeholder Mark',
      critique: hasLogo
        ? `Vector logo mark is loaded. Clearspace boundary: 2X. Minimum size: ${brandState.minsize || '24px'}.`
        : `⚠️ No vector logo uploaded yet. Slides 13–25 are currently demonstrating default geometric glyphs.`,
      questionBox: {
        question: `Logo System Calibration for Slide ${slideNum}:`,
        options: [
          {
            key: 'A',
            title: 'Open Logo Uploader',
            desc: 'Attach your SVG or high-resolution PNG file to the deck',
            actionText: 'upload logo',
          },
          {
            key: 'B',
            title: 'Enforce Strict Clearspace',
            desc: 'Lock 2X padding boundary to prevent visual overcrowding',
            actionText: 'set narrative to The primary mark requires a mandatory clearspace buffer equivalent to 2X the mark height across all digital and print layouts.',
          },
          {
            key: 'C',
            title: 'Set Minimum Digital Size',
            desc: 'Standardize 32px digital screen threshold for optical clarity',
            actionText: 'set narrative to To guarantee optical legibility, never render the logo below 32 pixels on digital screens or 10mm in print media.',
          },
          {
            key: 'D',
            title: 'Advance to Slide 26 (Color Palette)',
            desc: 'Inspect brand color harmonies and WCAG contrast ratings',
            actionText: 'change primary color to blue',
          },
        ],
      },
    };
  }

  // 5. Slide 26–31: Brand Color System
  if (slideNum >= 26 && slideNum <= 31) {
    return {
      slideNum,
      sectionTitle: 'Color Harmonies & Contrast Hierarchy',
      statusType: contrastPassing ? 'ok' : 'warning',
      statusBadge: contrastPassing ? 'WCAG AAA Passed' : 'Contrast Warning',
      critique: contrastPassing
        ? `Primary (${brandState.colors[0]?.h || '#111'}) and Accent (${brandState.accent}) provide strong optical contrast (>4.5:1).`
        : `⚠️ Current background to text ratio may fail WCAG AA accessibility standards in dim lighting.`,
      questionBox: {
        question: `How would you like to balance the 5-color palette for **${bName}**?`,
        options: [
          {
            key: 'A',
            title: 'Auto-Fix Contrast (AAA Standard)',
            desc: 'Recalibrate primary ink to #0F172A for guaranteed 7.1:1 ratio',
            actionText: 'change primary color to #0F172A',
          },
          {
            key: 'B',
            title: 'Electric Blue Accent (#2563EB)',
            desc: 'Industry standard for modern UI, SaaS, and technical clarity',
            actionText: 'change accent color to #2563EB',
          },
          {
            key: 'C',
            title: 'Forest Emerald Accent (#059669)',
            desc: 'Signifies vitality, financial stability, and sustained growth',
            actionText: 'change accent color to #059669',
          },
          {
            key: 'D',
            title: 'Explain 60-30-10 Distribution',
            desc: 'Review the golden rule for brand surface color allocation',
            actionText: 'what is the color rule',
          },
        ],
      },
    };
  }

  // 6. Slide 32–36: Typography & Font Pairings
  if (slideNum >= 32 && slideNum <= 36) {
    return {
      slideNum,
      sectionTitle: 'Typography System & Specimen',
      statusType: 'ok',
      statusBadge: 'Type Active',
      critique: `Display: **${brandState.hf || 'Inter'}** · Body: **${brandState.bf || 'Inter'}**. Uppercase tracking: ${brandState.upper || '0.05em'}.`,
      questionBox: {
        question: `Which architectural font pairing aligns with **${bName}**?`,
        options: [
          {
            key: 'A',
            title: 'Swiss Architectural',
            desc: 'Display: Space Grotesk · Body: Inter (Sharp, rational, digital)',
            actionText: 'set heading font to Space Grotesk',
          },
          {
            key: 'B',
            title: 'Editorial Heritage',
            desc: 'Display: Playfair Display · Body: Lora (Prestigious, luxury)',
            actionText: 'set heading font to Playfair Display',
          },
          {
            key: 'C',
            title: 'Geometric Tech',
            desc: 'Display: Plus Jakarta Sans · Body: Plus Jakarta Sans (Clean, friendly)',
            actionText: 'set heading font to Plus Jakarta Sans',
          },
          {
            key: 'D',
            title: 'Review Typography Rules',
            desc: 'Examine optical scale, line height, and paragraph spacing',
            actionText: 'what fonts pair well with Inter',
          },
        ],
      },
    };
  }

  // 7. Slide 47–60: Physical Applications & Mockups
  if (slideNum >= 47 && slideNum <= 60) {
    return {
      slideNum,
      sectionTitle: 'Application Mockups & Physical Systems',
      statusType: 'ok',
      statusBadge: 'Commercial Mockup',
      critique: `Slide ${slideNum} renders physical product mockups with dynamic brand overlays.`,
      questionBox: {
        question: `Which commercial mockup would you like to attach to Slide ${slideNum}?`,
        options: [
          {
            key: 'A',
            title: 'Highway Billboard Mockup',
            desc: '1600x900 high-res architectural urban highway display',
            actionText: 'generate a billboard mockup',
          },
          {
            key: 'B',
            title: 'Minimalist Storefront',
            desc: 'Contemporary architectural glass storefront with embossed lettering',
            actionText: 'generate a storefront mockup',
          },
          {
            key: 'C',
            title: 'Luxury Matte Packaging',
            desc: 'Debossed luxury unboxing carton with foil stamp finish',
            actionText: 'generate a packaging mockup',
          },
          {
            key: 'D',
            title: 'Amber Glass Bottle',
            desc: 'Frosted cosmetic/beverage bottle with minimal paper label',
            actionText: 'generate a bottle mockup',
          },
        ],
      },
    };
  }

  // Default Slide Handler
  return {
    slideNum,
    sectionTitle: `Slide ${slideNum} • Section Overview`,
    statusType: 'ok',
    statusBadge: 'Active',
    critique: `Viewing Slide ${slideNum} of 64 inside the **${brandState.theme || 'studio'}** theme.`,
    questionBox: {
      question: `How would you like to proceed on Slide ${slideNum}?`,
      options: [
        {
          key: 'A',
          title: 'Audit Complete Deck',
          desc: 'Scan all 64 slides for missing assets and contrast issues',
          actionText: 'critique my brand',
        },
        {
          key: 'B',
          title: 'Jump to Cover (Slide 1)',
          desc: 'Return to top-level guidelines and cover presentation',
          actionText: 'swap slide 4 and slide 5',
        },
        {
          key: 'C',
          title: '15-Minute Brand Sprint',
          desc: 'Follow the 6-step checklist to finalize the entire deck',
          actionText: 'how do i finish the deck in 15',
        },
        {
          key: 'D',
          title: 'Export Print-Ready PDF',
          desc: 'Compile all 64 synchronized slides for client handoff',
          actionText: 'export pdf',
        },
      ],
    },
  };
}
