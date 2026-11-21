// ============================================================
// Zap Interpolate — replaces {tokens} with live brand values
// ============================================================

import { BrandState } from '../types/brandbook';

export interface ZapContext {
  brandName: string;
  primaryColor: string;
  headingFont: string;
  slideCount: number;
  currentSlide: number;
  hasLogo: boolean;
  logoIsJpg: boolean;
  colorCount: number;
  slideTag: string;
  elapsedMinutes: number;
}

export function buildZapContext(
  brandState: BrandState,
  currentSlide: number,
  totalSlides: number,
  slideTag: string,
  startTime: number
): ZapContext {
  const primaryColor = brandState.colors?.[0]?.h || brandState.accent || '#111111';
  const logoMeta = brandState.meta?.['logo'];
  const logoIsJpg = logoMeta ? logoMeta.kind === 'raster' : false;

  return {
    brandName: brandState.name || 'your brand',
    primaryColor,
    headingFont: brandState.hf || 'your display font',
    slideCount: totalSlides,
    currentSlide,
    hasLogo: Boolean(brandState.logo),
    logoIsJpg,
    colorCount: brandState.colors?.length || 0,
    slideTag,
    elapsedMinutes: Math.floor((Date.now() - startTime) / 60000),
  };
}

export function interpolate(template: string, ctx: ZapContext): string {
  return template
    .replace(/\{brandName\}/g, ctx.brandName)
    .replace(/\{primaryColor\}/g, ctx.primaryColor)
    .replace(/\{headingFont\}/g, ctx.headingFont)
    .replace(/\{slideCount\}/g, String(ctx.slideCount))
    .replace(/\{currentSlide\}/g, String(ctx.currentSlide));
}

export function pickResponse(responses: string[], ctx: ZapContext): string {
  const raw = responses[Math.floor(Math.random() * responses.length)];
  return interpolate(raw, ctx);
}
