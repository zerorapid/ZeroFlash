import { norm, isHex } from './colorUtils';

export const NS = 'http://www.w3.org/2000/svg';

export interface CleanSvgResult {
  txt: string;
  w: number;
  h: number;
}

export function cleanSVG(txt: string): CleanSvgResult | null {
  if (typeof DOMParser === 'undefined') {
    return { txt: txt.trim(), w: 512, h: 512 };
  }
  let doc: Document;
  try {
    doc = new DOMParser().parseFromString(txt, 'image/svg+xml');
  } catch {
    return null;
  }
  if (!doc || doc.querySelector('parsererror')) return null;
  const svg = doc.querySelector('svg');
  if (!svg) return null;

  // Remove dangerous tags
  const badTags = doc.querySelectorAll('script, foreignObject, animate, animateTransform, set, handler, iframe');
  badTags.forEach(n => n.parentNode?.removeChild(n));

  // Walk all elements and strip inline scripts or event handlers
  function walk(el: Element) {
    const attrs = Array.from(el.attributes || []);
    attrs.forEach(a => {
      const n = a.name.toLowerCase();
      const v = String(a.value || '');
      if (n.startsWith('on')) el.removeAttribute(a.name);
      else if (/javascript:/i.test(v)) el.removeAttribute(a.name);
      else if ((n === 'href' || n === 'xlink:href') && !v.trim().startsWith('#')) el.removeAttribute(a.name);
      else if (n === 'style' && /url\s*\(\s*['"]?(https?:|\/\/)/i.test(v)) el.removeAttribute(a.name);
    });
    Array.from(el.children).forEach(walk);
  }
  walk(svg);

  svg.setAttribute('xmlns', NS);
  svg.removeAttribute('style');

  const rawVb = (svg.getAttribute('viewBox') || '').trim();
  const vb = rawVb.split(/[\s,]+/).map(Number);
  let w = parseFloat(svg.getAttribute('width') || '0');
  let h = parseFloat(svg.getAttribute('height') || '0');

  if (vb.length === 4 && vb[2] > 0 && vb[3] > 0) {
    if (!(w > 0)) w = vb[2];
    if (!(h > 0)) h = vb[3];
    svg.setAttribute('viewBox', vb.join(' '));
  }
  if (!(w > 0) || !(h > 0)) {
    w = 512;
    h = 512;
  }
  if (!svg.getAttribute('viewBox')) {
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
  }
  svg.setAttribute('width', String(w));
  svg.setAttribute('height', String(h));

  try {
    const out = new XMLSerializer().serializeToString(svg);
    return { txt: out, w, h };
  } catch {
    return null;
  }
}

export const svgURL = (t: string): string =>
  'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(t);

export interface DetectedColor {
  hex: string;
  count: number;
  percentage: number;
}

/**
 * Automatically inspects all fill, stroke, and style attributes in an SVG
 * to extract dominant brand colors with frequency distribution.
 */
export function extractSvgColors(svgText: string): DetectedColor[] {
  let doc: Document;
  try {
    doc = new DOMParser().parseFromString(svgText, 'image/svg+xml');
  } catch {
    return [];
  }
  if (!doc) return [];

  const counts: Record<string, number> = {};
  let totalHits = 0;

  function registerColor(val: string | null) {
    if (!val) return;
    val = val.trim();
    if (!val || val === 'none' || val === 'transparent' || val === 'inherit' || val === 'currentColor') return;
    
    // Check hex
    const hexMatch = val.match(/#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b/);
    if (hexMatch) {
      const h = norm(hexMatch[0]);
      counts[h] = (counts[h] || 0) + 1;
      totalHits++;
      return;
    }
    // Check rgb/rgba
    const rgbMatch = val.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
    if (rgbMatch) {
      const r = parseInt(rgbMatch[1], 10);
      const g = parseInt(rgbMatch[2], 10);
      const b = parseInt(rgbMatch[3], 10);
      const h = norm('#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join(''));
      counts[h] = (counts[h] || 0) + 1;
      totalHits++;
    }
  }

  const elements = doc.querySelectorAll('*');
  elements.forEach(el => {
    registerColor(el.getAttribute('fill'));
    registerColor(el.getAttribute('stroke'));
    const style = el.getAttribute('style');
    if (style) {
      const fillMatch = style.match(/fill\s*:\s*([^;]+)/i);
      if (fillMatch) registerColor(fillMatch[1]);
      const strokeMatch = style.match(/stroke\s*:\s*([^;]+)/i);
      if (strokeMatch) registerColor(strokeMatch[1]);
    }
  });

  const sorted = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([hex, count]) => ({
      hex,
      count,
      percentage: totalHits > 0 ? Math.round((count / totalHits) * 100) : 0,
    }));

  return sorted;
}

/**
 * Programmatically recolors an SVG string by replacing target hexes with new hexes.
 */
export function recolorSvg(svgText: string, colorMap: Record<string, string>): string {
  let doc: Document;
  try {
    doc = new DOMParser().parseFromString(svgText, 'image/svg+xml');
  } catch {
    return svgText;
  }
  if (!doc) return svgText;

  const normalizedMap: Record<string, string> = {};
  Object.entries(colorMap).forEach(([oldH, newH]) => {
    normalizedMap[norm(oldH)] = norm(newH);
  });

  function replaceHex(val: string | null): string | null {
    if (!val) return val;
    let res = val;
    Object.entries(normalizedMap).forEach(([oldH, newH]) => {
      const reg = new RegExp(oldH, 'gi');
      res = res.replace(reg, newH);
    });
    return res;
  }

  doc.querySelectorAll('*').forEach(el => {
    const f = el.getAttribute('fill');
    if (f) el.setAttribute('fill', replaceHex(f) || f);
    const s = el.getAttribute('stroke');
    if (s) el.setAttribute('stroke', replaceHex(s) || s);
    const st = el.getAttribute('style');
    if (st) el.setAttribute('style', replaceHex(st) || st);
  });

  return new XMLSerializer().serializeToString(doc.documentElement);
}
