// ============================================================
// Zap Dialogue Engine — Natural conversational onboarding & direction
// Talks like a seasoned creative director, asks smooth questions,
// and guides the user through the 64-slide journey.
// ============================================================

import { BrandState } from '../types/brandbook';

export interface DialogueQuestion {
  id: string;
  greeting: string;
  followUp: string;
  chips: Array<{ label: string; actionText: string }>;
}

export function generateInitialGreeting(brandState: BrandState, sessionCount: number): DialogueQuestion {
  const brandName = brandState.name && brandState.name !== 'Northwind' ? brandState.name : null;
  const hasLogo = Boolean(brandState.logo);

  // If brand already has a custom name
  if (brandName) {
    if (!hasLogo) {
      return {
        id: 'q_logo_stage',
        greeting: `Hey! Great to be back in **${brandName}**'s guidelines.`,
        followUp: `We've got 64 synchronized slides ready. Before we polish your mockups, should we drop in your logo or explore your color palette first?`,
        chips: [
          { label: 'Drop in Logo', actionText: 'upload logo' },
          { label: 'Explore Colors', actionText: 'help me with secondary palette' },
          { label: 'Check Mockups', actionText: 'jump to mockups' },
          { label: '15-Min Quick Sprint', actionText: 'how do i finish the deck in 15' },
        ],
      };
    }

    return {
      id: 'q_polish_stage',
      greeting: `Welcome back to **${brandName}**!`,
      followUp: `Your logo and foundation slides are locked. Where do you want to direct our focus today?`,
      chips: [
        { label: 'Review Mockups (Slide 48+)', actionText: 'jump to mockups' },
        { label: 'Audit Contrast & WCAG', actionText: 'fix contrast' },
        { label: 'Tune Typography Pairings', actionText: 'what pairs with heading font' },
        { label: 'Export Print-Ready PDF', actionText: 'export pdf' },
      ],
    };
  }

  // Brand is still new or in initial setup
  if (sessionCount <= 1) {
    return {
      id: 'q_initial_vibe',
      greeting: `Hey there! I'm Zap, your on-device brand director.`,
      followUp: `I'll be co-directing this 64-slide brand book with you. What kind of vibe are we shaping today?`,
      chips: [
        { label: 'Bold & Modern (Studio)', actionText: 'switch to studio' },
        { label: 'Swiss Minimalist (Rational)', actionText: 'switch to swiss' },
        { label: 'Luxury & Editorial (Serif)', actionText: 'switch to luxury' },
        { label: 'Raw & Punchy (Brutalist)', actionText: 'switch to brutalist' },
      ],
    };
  }

  // Returning general session
  return {
    id: 'q_general_return',
    greeting: `Hey! Ready to push the brand book forward.`,
    followUp: `Tell me what you'd like to do, or pick a focus area below:`,
    chips: [
      { label: 'Change Accent Color', actionText: 'change accent color' },
      { label: 'Swap Slide Order', actionText: 'swap slide 4 and slide 5' },
      { label: 'Review Mockups', actionText: 'jump to mockups' },
      { label: '15-Minute Sprint Mode', actionText: 'how do i finish the deck in 15' },
    ],
  };
}
