import { BrandState, SlideDefinition, SlideItem, SlideOverride, ThemeConfig } from '../types/brandbook';
import { THEMES } from '../data/brandbookData';
import { vals, isDark, mix, norm, oklch, lab, ctr, tints, shades } from './colorUtils';

export const GX = 13.333;
export const GY = 7.5;

const R = (x: number, y: number, w: number, h: number, fill?: string | null, o?: any): SlideItem =>
  Object.assign({ k: 'r' as const, x, y, w, h, fill: fill || undefined }, o || {});

const T = (t: any, x: number, y: number, w: number, h: number, o?: any): SlideItem =>
  Object.assign({ k: 't' as const, t: String(t == null ? '' : t), x, y, w, h }, o || {});

const I = (x: number, y: number, w: number, h: number, inv?: boolean, key?: string, a?: 'left' | 'center' | 'right'): SlideItem => ({
  k: 'i' as const, x, y, w, h, inv, key, a,
});

const P = (x: number, y: number, w: number, h: number, id: string, label: string, o?: any): SlideItem =>
  Object.assign({ k: 'p' as const, x, y, w, h, id, label }, o || {});

const IC = (x: number, y: number, w: number, h: number, name: string, c?: string): SlideItem => ({
  k: 'ic' as const, x, y, w, h, name, c,
});

const CG = (x: number, y: number, w: number, h: number): SlideItem => ({
  k: 'cg' as const, x, y, w, h,
});

const lines = (t: string) =>
  String(t || '')
    .split('\n')
    .map(x => x.trim())
    .filter(Boolean);

const kv = (l: string) => {
  const i = l.indexOf(':');
  return i < 0 ? [l, ''] : [l.slice(0, i).trim(), l.slice(i + 1).trim()];
};

const pipe = (l: string) => l.split('|').map(x => x.trim());

export function getTokens(S: BrandState): ThemeConfig {
  const t = THEMES[S.theme] || THEMES.swiss;
  return {
    ...t,
    card: S.pc || t.card,
    line: S.lc || t.line,
    acc: S.accent || t.acc,
    rad: S.rad === '' ? t.rad : +S.rad,
    grain: S.grain === '' ? t.grain : +S.grain,
    opener: S.opener || t.opener,
    cardS: S.cardS || t.cardS,
    folio: S.folio || t.folio,
    frame: S.frame || t.frame,
  };
}

export function generateDeck(S: BrandState, OV: Record<number, SlideOverride>): SlideDefinition[] {
  try {
    const t = getTokens(S);
    const C = S.colors.map(c => {
      const v = vals(c.h);
      return { n: c.n, p: c.p, hex: v.hex, rgb: v.rgb, cmyk: v.cmyk };
    });
    const p = C.length ? C[0].hex : '#111827';
    const a = t.acc;
    const INK = t.ink;
    const MUT = t.mut;
    const LN = t.line;
    const BG = t.card;
    const SB = t.bg;
    const W = '#FFFFFF';
    const OK = '#0D9464';
    const BAD = '#E11D48';
    const WN = '#D98407';
    const onP = isDark(p);
    const tp = onP ? W : INK;

    const out: SlideDefinition[] = [];
    const secs: [string, number][] = [];

    const H = (x: string | number) => (S.upper === 'yes' ? String(x).toUpperCase() : String(x));
    const hc = S.hc === 'primary' ? p : S.hc === 'accent' ? a : INK;
    const CR = (c: string) =>
      S.credit === 'yes'
        ? [T('Designed by ZeroRapid', 9.03, 6.82, 3.5, 0.3, { s: 9.5, c, a: 'right' })]
        : [];

    const sl = (title: string, items: SlideItem[]) =>
      out.push({
        title,
        bg: SB,
        f: 1,
        items: [T(H(title), 0.8, 0.55, 11.7, 0.75, { f: 'h', s: 29, b: 1, c: hc }), ...items],
        oi: out.length,
      });

    const sec = (n: string, title: string, sub: string) => {
      secs.push([title, out.length + 2]);
      const bg = p; // Complete color in background (brand primary color)
      const isDarkP = isDark(p);
      const whiteText = isDarkP ? '#FFFFFF' : '#111827';
      const whiteSub = isDarkP ? 'rgba(255, 255, 255, 0.90)' : '#1F2937';
      const wmColor = isDarkP ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)';

      const it: SlideItem[] = [
        // Subtle giant section number watermark on the right
        T(n, 7.2, 0.9, 5.3, 4.8, { f: 'h', s: 220, b: 1, c: wmColor, a: 'right' }),
        // Section label
        T('SECTION ' + n, 0.8, 1.25, 4, 0.35, { f: 'h', s: 12, b: 1, c: whiteText }),
        // Accent rule
        R(0.8, 1.85, 1.2, 0.08, a),
        // Big Title in White
        T(H(title), 0.8, 2.45, 11.5, 1.6, { f: 'h', s: 64, b: 1, c: whiteText }),
        // Subtitle in White
        T(sub, 0.8, 4.35, 9.5, 1.0, { s: 18, c: whiteSub }),
      ];
      out.push({ title, bg, f: 0, items: it, oi: out.length });
    };

    // 00. Cover Slide with Configurable Logo Placement
    const pos = S.coverLogoPos || 'top-left';
    let coverItems: SlideItem[] = [];

    if (pos === 'center') {
      coverItems = [
        R(0, 0, GX, 0.09 + (t.rule - 1) * 0.04, a, { rd: 0 }),
        I(GX / 2 - 0.7, 1.2, 1.4, 1.25, false, undefined, 'center'),
        T('BRAND GUIDELINES', 0.8, 2.65, 11.73, 0.35, { s: 10, c: MUT, a: 'center', b: 1 }),
        T(H(S.name), 0.8, 3.0, 11.73, 1.25, { f: 'h', s: 58, b: 1, c: p, a: 'center' }),
        T(S.tagline, 0.8, 4.35, 11.73, 0.6, { s: 18, c: MUT, a: 'center' }),
        R(GX / 2 - 0.75, 5.2, 1.5, 0.06, a),
        T(S.version, 0.8, 6.82, 3.5, 0.3, { s: 10, c: MUT }),
        T(S.url, 4.67, 6.82, 4, 0.3, { s: 10, c: MUT, a: 'center' }),
        ...CR(MUT),
      ];
    } else if (pos === 'top-right') {
      coverItems = [
        R(0, 0, GX, 0.09 + (t.rule - 1) * 0.04, a, { rd: 0 }),
        T('BRAND GUIDELINES', 0.8, 1.25, 4.5, 0.3, { s: 10, c: MUT, a: 'left', b: 1 }),
        I(GX - 1.9, 1.15, 1.1, 1.1, false, undefined, 'right'),
        T(H(S.name), 0.8, 2.5, 11.6, 1.25, { f: 'h', s: 62, b: 1, c: p }),
        T(S.tagline, 0.8, 3.85, 10, 0.6, { s: 19, c: MUT }),
        R(0.8, 4.75, 1.1, 0.06, a),
        T(S.version, 0.8, 6.82, 3.5, 0.3, { s: 10, c: MUT }),
        T(S.url, 4.67, 6.82, 4, 0.3, { s: 10, c: MUT, a: 'center' }),
        ...CR(MUT),
      ];
    } else if (pos === 'split') {
      coverItems = [
        R(0, 0, GX, 0.09 + (t.rule - 1) * 0.04, a, { rd: 0 }),
        T('BRAND GUIDELINES', 0.8, 0.92, 4.5, 0.3, { s: 10, c: MUT, a: 'left', b: 1 }),
        T(H(S.name), 0.8, 2.4, 5.8, 1.35, { f: 'h', s: 48, b: 1, c: p }),
        T(S.tagline, 0.8, 3.85, 5.8, 0.6, { s: 16, c: MUT }),
        R(0.8, 4.7, 1.1, 0.06, a),
        R(7.0, 1.2, 5.53, 5.1, BG, { line: LN }),
        I(8.26, 2.25, 3.0, 3.0),
        T(S.version, 0.8, 6.82, 3.5, 0.3, { s: 10, c: MUT }),
        T(S.url, 4.67, 6.82, 4, 0.3, { s: 10, c: MUT, a: 'center' }),
        ...CR(MUT),
      ];
    } else {
      // Default: 'top-left' - Logo aligned to left text margin and gap reduced
      coverItems = [
        R(0, 0, GX, 0.09 + (t.rule - 1) * 0.04, a, { rd: 0 }),
        I(0.8, 1.15, 1.1, 1.1, false, undefined, 'left'),
        T('BRAND GUIDELINES', 9, 1.25, 3.53, 0.3, { s: 10, c: MUT, a: 'right', b: 1 }),
        T(H(S.name), 0.8, 2.5, 11.6, 1.25, { f: 'h', s: 62, b: 1, c: p }),
        T(S.tagline, 0.8, 3.85, 10, 0.6, { s: 19, c: MUT }),
        R(0.8, 4.75, 1.1, 0.06, a),
        T(S.version, 0.8, 6.82, 3.5, 0.3, { s: 10, c: MUT }),
        T(S.url, 4.67, 6.82, 4, 0.3, { s: 10, c: MUT, a: 'center' }),
        ...CR(MUT),
      ];
    }

    out.push({
      title: 'Cover',
      bg: SB,
      f: 0,
      oi: 0,
      items: coverItems,
    });

    // 01. Brand Section
    sec('01', 'Brand', 'Who we are, what we believe and how we speak.');
    {
      const it: SlideItem[] = [
        T(S.name, 0.8, 1.75, 5.2, 0.8, { f: 'h', s: 36, b: 1, c: p }),
        T(S.tagline, 0.8, 2.65, 5.2, 0.7, { s: 16, c: MUT }),
        T(S.desc, 0.8, 3.45, 5.2, 1.6, { s: 14.5, c: INK }),
        R(0.8, 5.15, 5.2, t.rule / 72, LN, { rd: 0 }),
        T('VERSION', 0.8, 5.4, 2.4, 0.25, { s: 9, c: MUT, b: 1 }),
        T(S.version, 0.8, 5.7, 2.4, 0.4, { s: 12, c: INK, b: 1 }),
        T('WEBSITE', 3.4, 5.4, 2.4, 0.25, { s: 9, c: MUT, b: 1 }),
        T(S.url, 3.4, 5.7, 2.4, 0.4, { s: 12, c: INK, b: 1 }),
        // Right side editorial brand hero photography slot!
        P(6.4, 1.75, 6.13, 4.75, 'm_brand_hero', 'Brand hero image / moodboard', { tr: 1 }),
      ];
      sl('Brand overview', it);
    }
    {
      const it: SlideItem[] = [];
      [
        ['Mission', S.mission, 0.8, 'compass'],
        ['Vision', S.vision, 6.93, 'eye'],
      ].forEach(m => {
        const x = m[2] as number;
        const iconName = m[3] as string;
        it.push(
          R(x, 1.7, 5.6, 4.75, BG, { line: LN }),
          R(x, 1.7, 0.09, 4.75, a),
          IC(x + 0.45, 2.05, 0.4, 0.4, iconName, a),
          T((m[0] as string).toUpperCase(), x + 0.98, 2.12, 4.1, 0.35, { s: 11, b: 1, c: a }),
          T(m[1] as string, x + 0.45, 2.7, 4.7, 3.5, { f: 'h', s: 20, c: INK })
        );
      });
      sl('Mission & vision', it);
    }
    {
      const it: SlideItem[] = [];
      const VS = ['target', 'gem', 'wind', 'compass'];
      lines(S.values).slice(0, 4).forEach((l, i) => {
        const q = kv(l);
        const x = 0.8 + i * 3.01;
        it.push(
          R(x, 1.8, 2.72, 4.35, SB, { line: LN }),
          R(x, 1.8, 2.72, 0.08, a),
          IC(x + 0.28, 2.15, 0.55, 0.55, VS[i], p),
          T(q[0], x + 0.28, 3.0, 2.2, 0.6, { f: 'h', s: 19, b: 1, c: INK }),
          T(q[1], x + 0.28, 3.68, 2.2, 2.2, { s: 12.5, c: MUT })
        );
      });
      sl('Brand values', it);
    }
    {
      const it: SlideItem[] = [];
      const P_ICONS = ['sparkles', 'zap', 'shield', 'flame', 'heart', 'smile'];
      lines(S.pers.replace(/,/g, '\n')).slice(0, 6).forEach((w, i) => {
        const x = 0.8 + (i % 3) * 4;
        const y = 1.85 + Math.floor(i / 3) * 2.3;
        it.push(
          R(x, y, 3.73, 1.95, BG, { line: LN }),
          R(x, y, 0.09, 1.95, a),
          IC(x + 0.35, y + 0.26, 0.32, 0.32, P_ICONS[i], a),
          T('0' + (i + 1), x + 2.95, y + 0.22, 0.6, 0.3, { s: 10, c: MUT, a: 'right' }),
          T(w, x + 0.35, y + 0.72, 3.2, 0.7, { f: 'h', s: 21, b: 1, c: INK })
        );
      });
      sl('Brand personality', it);
    }
    {
      const it: SlideItem[] = [T('WE SOUND', 0.8, 1.62, 5, 0.3, { s: 10.5, c: MUT, b: 1 })];
      lines(S.voice).slice(0, 4).forEach((l, i) => {
        const q = kv(l);
        it.push(
          T(q[0], 0.8, 2.1 + i * 1.18, 6, 0.4, { f: 'h', s: 17, b: 1, c: INK }),
          T(q[1], 0.8, 2.52 + i * 1.18, 6, 0.6, { s: 12.5, c: MUT })
        );
      });
      it.push(T('WE AVOID', 7.8, 1.62, 5, 0.3, { s: 10.5, c: MUT, b: 1 }));
      lines(S.avoid).slice(0, 5).forEach((w, i) => {
        it.push(
          T('✕', 7.8, 2.1 + i * 0.82, 0.4, 0.4, { s: 15, b: 1, c: BAD }),
          T(w, 8.3, 2.1 + i * 0.82, 4.2, 0.65, { s: 14, c: INK })
        );
      });
      sl('Brand voice', it);
    }
    {
      const sy = lines(S.say);
      const dn = lines(S.dont);
      const it: SlideItem[] = [
        T('WE SAY', 0.8, 1.6, 5.6, 0.3, { s: 10.5, c: OK, b: 1 }),
        T('WE DON’T SAY', 6.93, 1.6, 5.6, 0.3, { s: 10.5, c: BAD, b: 1 }),
      ];
      for (let i = 0; i < 5; i++) {
        const y = 2.05 + i * 0.93;
        it.push(
          R(0.8, y, 5.6, 0.82, BG, { line: LN }),
          T('✓', 0.98, y + 0.2, 0.35, 0.4, { s: 14, b: 1, c: OK }),
          T(sy[i] || '', 1.42, y + 0.14, 4.8, 0.6, { s: 12.5, c: INK }),
          R(6.93, y, 5.6, 0.82, SB, { line: LN }),
          T('✕', 7.11, y + 0.2, 0.35, 0.4, { s: 14, b: 1, c: BAD }),
          T(dn[i] || '', 7.55, y + 0.14, 4.8, 0.6, { s: 12.5, c: MUT })
        );
      }
      sl('We say / we don’t say', it);
    }
    {
      const it: SlideItem[] = [];
      const TONES_LABELS = [
        ['Formal', 'Casual'],
        ['Serious', 'Playful'],
        ['Reserved', 'Bold'],
        ['Technical', 'Simple'],
      ];
      TONES_LABELS.forEach((tn, i) => {
        const y = 1.95 + i * 1.18;
        const v = S.tone[i] / 100;
        it.push(
          T(tn[0], 0.8, y, 2.4, 0.4, { s: 13.5, c: INK, b: 1 }),
          R(3.4, y + 0.16, 6.5, 0.06, LN, { rd: 0 }),
          R(3.4, y + 0.16, 6.5 * v, 0.06, a, { rd: 0 }),
          R(3.4 + 6.5 * v - 0.14, y + 0.05, 0.28, 0.28, p, { ell: 1 }),
          T(tn[1], 10.1, y, 2.4, 0.4, { s: 13.5, c: INK, a: 'right', b: 1 })
        );
      });
      it.push(T('The marker shows where our voice sits between each pair.', 0.8, 6.45, 9, 0.3, { s: 11, c: MUT }));
      sl('Tone of voice', it);
    }
    {
      const it: SlideItem[] = [];
      [['Capitalization', S.cap], ['Punctuation', S.punc], ['Numbers & dates', S.nums]].forEach((b, i) => {
        const x = 0.8 + i * 4;
        it.push(
          R(x, 1.8, 3.73, 4.55, BG, { line: LN }),
          T(b[0].toUpperCase(), x + 0.3, 2.1, 3.2, 0.35, { s: 10.5, b: 1, c: a }),
          T(b[1], x + 0.3, 2.6, 3.15, 3.5, { s: 12, c: INK })
        );
      });
      sl('Writing rules', it);
    }
    {
      const it: SlideItem[] = [];
      lines(S.glossary).slice(0, 7).forEach((l, i) => {
        const q = kv(l);
        const y = 1.75 + i * 0.68;
        it.push(
          R(0.8, y, 11.73, t.rule / 72, LN, { rd: 0 }),
          T(q[0], 0.8, y + 0.14, 3, 0.45, { f: 'h', s: 14.5, b: 1, c: p }),
          T(q[1], 4.1, y + 0.14, 8.4, 0.5, { s: 12.5, c: INK })
        );
      });
      sl('Glossary', it);
    }

    // 02. Logo Section
    sec('02', 'Logo', 'Mark, construction, lockups, clearspace and correct use.');
    sl('Primary logo', [
      R(0.8, 1.7, 7.2, 4.85, BG, { line: LN }),
      I(2.3, 2.55, 4.2, 3.1),
      T('The full-colour logo', 8.5, 1.75, 4, 0.4, { f: 'h', s: 17, b: 1, c: INK }),
      T(
        'The ' + S.name + ' logo is the core of the identity. Use this full-colour version wherever possible and keep it in its original proportions.',
        8.5, 2.35, 4, 2.3, { s: 13.5, c: MUT }
      ),
      R(8.5, 4.55, 1, 0.06, a),
    ]);
    {
      const it: SlideItem[] = [
        P(0.8, 1.7, 4.3, 4.3, 'lg_concept', 'Logo concept art', { m: 'contain' }),
        T(S.concept, 5.55, 1.75, 7, 1.7, { f: 'h', s: 16.5, c: INK }),
      ];
      lines(S.conceptPts).slice(0, 3).forEach((l, i) => {
        const q = kv(l);
        it.push(
          R(5.55, 3.75 + i * 0.95, 0.08, 0.78, a),
          T(q[0], 5.85, 3.75 + i * 0.95, 6.6, 0.35, { f: 'h', s: 13.5, b: 1, c: INK }),
          T(q[1], 5.85, 4.1 + i * 0.95, 6.6, 0.55, { s: 11.5, c: MUT })
        );
      });
      sl('Logo concept', it);
    }
    {
      const it: SlideItem[] = [R(0.8, 1.7, 6.2, 4.85, BG, { line: LN }), I(2.35, 2.5, 3.1, 3.1)];
      if (S.grid) it.push(CG(2.35, 2.5, 3.1, 3.1));
      it.push(
        T('CONSTRUCTION', 7.55, 1.75, 5, 0.3, { s: 10.5, b: 1, c: a }),
        T(S.ratioNote, 7.55, 2.2, 4.95, 2.7, { s: 13, c: INK }),
        T(
          'Grid ' + (S.grid ? 'shown' : 'hidden') + ' · Golden ratio guides ' + (S.phi ? 'on' : 'off') + ' — toggle in Logo settings.',
          7.55, 5.6, 4.95, 0.7, { s: 10.5, c: MUT }
        )
      );
      sl('Logo construction', it);
    }
    {
      const it: SlideItem[] = [];
      [
        ['lk_h', 'Horizontal', 'Preferred for wide spaces'],
        ['lk_s', 'Stacked', 'Square contexts'],
        ['lk_m', 'Mark', 'Avatars & favicons'],
        ['lk_w', 'Wordmark', 'When the mark already appears'],
      ].forEach((L, i) => {
        const x = 0.8 + i * 3.01;
        it.push(
          P(x, 1.75, 2.72, 3.35, L[0], L[1] + ' lockup', { m: 'contain', fb: L[0] === 'lk_m' }),
          T(L[1], x, 5.35, 2.72, 0.4, { f: 'h', s: 15, b: 1, c: INK }),
          T(L[2], x, 5.78, 2.72, 0.6, { s: 11, c: MUT })
        );
      });
      sl('Logo lockups', it);
    }
    {
      const it: SlideItem[] = [];
      [
        ['lg_primary', 'Primary', 'Full colour, preferred use'],
        ['lg_secondary', 'Secondary', 'Horizontal or stacked lockup'],
        ['lg_icon', 'Icon', 'Compact mark for small spaces'],
        ['lg_mono', 'Reversed', 'One colour, for dark backgrounds'],
      ].forEach((L, i) => {
        const x = 0.8 + i * 3.01;
        const mo = L[0] === 'lg_mono';
        it.push(
          P(x, 1.75, 2.72, 3.35, L[0], L[1] + ' logo', mo ? { m: 'contain', bgc: p, tc: tp, fb: 1 } : { m: 'contain' }),
          T(L[1], x, 5.35, 2.72, 0.4, { f: 'h', s: 15, b: 1, c: INK }),
          T(L[2], x, 5.78, 2.72, 0.6, { s: 11, c: MUT })
        );
      });
      sl('Logo versions', it);
    }
    sl('Clearspace', [
      R(1.2, 1.8, 4.8, 4.4, SB, { line: a, dash: 1 }),
      R(2.4, 2.9, 2.4, 2.2, BG, { line: LN }),
      I(2.5, 3, 2.2, 2),
      T('x', 3.4, 2.2, 0.6, 0.4, { s: 14, b: 1, c: a, a: 'center' }),
      T('x', 3.4, 5.5, 0.6, 0.4, { s: 14, b: 1, c: a, a: 'center' }),
      T('x', 1.5, 3.8, 0.6, 0.4, { s: 14, b: 1, c: a, a: 'center' }),
      T('x', 5.1, 3.8, 0.6, 0.4, { s: 14, b: 1, c: a, a: 'center' }),
      T('Protect the mark', 7.2, 1.85, 5.3, 0.4, { f: 'h', s: 17, b: 1, c: INK }),
      T(S.clear, 7.2, 2.45, 5.3, 2.4, { s: 13.5, c: MUT }),
    ]);
    {
      const it: SlideItem[] = [
        R(0.8, 1.7, 5.8, 4.65, BG, { line: LN }),
        R(1.5, 2.4, 4.4, 3.2, SB, { line: a, dash: 1 }),
        I(2.5, 3, 2.4, 2),
      ];
      [[0.85, 3.75], [5.85, 3.75], [3.2, 1.9], [3.2, 5.7]].forEach(q =>
        it.push(T('2x', q[0], q[1], 0.7, 0.4, { s: 12, b: 1, c: a, a: 'center' }))
      );
      lines(S.spacing).slice(0, 3).forEach((l, i) => {
        const q = kv(l);
        it.push(
          R(7.1, 1.85 + i * 1.5, 0.08, 1.2, a),
          T(q[0], 7.4, 1.85 + i * 1.5, 5.1, 0.4, { f: 'h', s: 15, b: 1, c: INK }),
          T(q[1], 7.4, 2.3 + i * 1.5, 5.1, 0.95, { s: 12, c: MUT })
        );
      });
      sl('Logo spacing & padding', it);
    }
    sl('Minimum size', [
      R(0.8, 1.8, 7, 3.3, BG, { line: LN }),
      I(1.2, 2.4, 2, 2),
      I(4.2, 2.8, 1.2, 1.2),
      I(6.4, 3.1, 0.6, 0.6, false, 'lg_icon'),
      T('Primary', 1.2, 4.5, 2, 0.3, { s: 10.5, c: MUT, a: 'center' }),
      T('Reduced', 4.1, 4.5, 1.4, 0.3, { s: 10.5, c: MUT, a: 'center' }),
      T('Minimum', 6.1, 4.5, 1.2, 0.3, { s: 10.5, c: MUT, a: 'center' }),
      T('Smallest allowed', 8.5, 1.85, 4, 0.4, { f: 'h', s: 17, b: 1, c: INK }),
      T(S.minsize, 8.5, 2.45, 4, 2.3, { s: 13.5, c: MUT }),
    ]);
    {
      const it: SlideItem[] = [];
      [[BG, false, 'On light'], [p, onP, 'On primary'], [a, isDark(a), 'On accent']].forEach((b, i) => {
        const x = 0.8 + i * 3.99;
        const inv = b[1] as boolean;
        it.push(
          R(x, 1.8, 3.75, 3.6, b[0] as string, { line: LN }),
          I(x + 0.7, 2.5, 2.35, 2.2, inv, inv ? 'lg_mono' : undefined),
          T(b[2] as string, x, 5.6, 3.75, 0.4, { s: 11.5, c: MUT, b: 1 })
        );
      });
      sl('Logo on backgrounds', it);
    }
    sl('Logo on photography', [
      P(0.8, 1.7, 7.4, 4.85, 'photo_logo', 'Photography with logo', { m: 'cover', tr: 1 }),
      R(0.8, 4.7, 7.4, 1.85, p, { op: 0.42 }),
      I(1.2, 5.05, 1.15, 1.15, true, 'lg_mono'),
      T('SCRIM 35–50%', 5.9, 6.15, 2.1, 0.3, { s: 9, c: W, a: 'right', b: 1 }),
      T('The rule', 8.7, 1.8, 3.8, 0.4, { f: 'h', s: 17, b: 1, c: INK }),
      T(S.photoRule, 8.7, 2.4, 3.83, 3.6, { s: 12.5, c: MUT }),
    ]);
    {
      const it: SlideItem[] = [];
      S.dos.slice(0, 6).forEach((r, i) => {
        const x = 0.8 + (i % 3) * 4;
        const y = 1.75 + Math.floor(i / 3) * 2.5;
        it.push(
          P(x, y, 3.73, 1.5, r.id, 'Correct example', { m: 'contain' }),
          T('✓', x + 3.1, y + 0.08, 0.5, 0.4, { s: 17, b: 1, c: OK, a: 'right' }),
          T(r.t, x, y + 1.6, 3.73, 0.75, { s: 11.5, c: INK })
        );
      });
      sl('Logo do’s', it);
    }
    {
      const it: SlideItem[] = [];
      S.donts.slice(0, 6).forEach((r, i) => {
        const x = 0.8 + (i % 3) * 4;
        const y = 1.75 + Math.floor(i / 3) * 2.5;
        it.push(
          P(x, y, 3.73, 1.5, r.id, 'Incorrect example', { m: 'contain' }),
          T('✕', x + 3.1, y + 0.08, 0.5, 0.4, { s: 17, b: 1, c: BAD, a: 'right' }),
          T(r.t, x, y + 1.6, 3.73, 0.75, { s: 11.5, c: INK })
        );
      });
      sl('Logo don’ts', it);
    }

    // 03. Color Section
    sec('03', 'Color', 'Palette, values, tints, proportion and accessible pairings.');
    {
      const it: SlideItem[] = [];
      const cs = t.cardS;
      C.slice(0, 3).forEach((c, i) => {
        const x = 0.8 + i * 3.99;
        const tc = isDark(c.hex) ? W : INK;
        if (cs === 'chip') {
          it.push(
            R(x, 1.85, 3.75, 1.5, c.hex, { line: LN }),
            T(c.n, x, 3.6, 3.75, 0.4, { f: 'h', s: 17, b: 1, c: INK }),
            T(c.hex + '  ·  ' + (c.p || '—'), x, 4.05, 3.75, 0.35, { s: 11.5, c: MUT })
          );
        } else if (cs === 'tint') {
          it.push(R(x, 1.85, 3.75, 2.1, c.hex, { line: LN }));
          tints(c.hex).forEach((h2, j) =>
            it.push(R(x + j * (3.75 / 6), 4.0, 3.75 / 6, 0.55, h2, { rd: 0, line: LN }))
          );
          it.push(
            T(c.n, x, 4.75, 3.75, 0.4, { f: 'h', s: 16, b: 1, c: INK }),
            T(c.hex, x, 5.18, 3.75, 0.3, { s: 11, c: MUT })
          );
        } else if (cs === 'minimal') {
          it.push(
            R(x, 2.0, 3.75, 0.32, c.hex, { rd: 0 }),
            T(c.n, x, 2.65, 3.75, 0.5, { f: 'h', s: 21, b: 1, c: INK }),
            T(c.hex, x, 3.25, 3.75, 0.35, { s: 12, c: MUT }),
            T(c.p || 'No spot reference', x, 3.62, 3.75, 0.35, { s: 11, c: MUT })
          );
        } else {
          it.push(
            R(x, 1.8, 3.75, 3.7, c.hex, { line: LN }),
            T(c.n, x + 0.28, 4.42, 3.2, 0.45, { f: 'h', s: 18, b: 1, c: tc }),
            T(c.hex, x + 0.28, 4.95, 3.2, 0.3, { s: 11.5, c: tc })
          );
        }
      });
      it.push(
        T(
          'Lead with ' + (C[0] ? C[0].n : 'the primary') + '. The others support it — never compete with it.',
          0.8, 5.95, 11.7, 0.7, { s: 13.5, c: MUT }
        )
      );
      sl('Primary palette', it);
    }
    {
      const it: SlideItem[] = [];
      C.forEach((c, i) => {
        const x = 0.8 + (i % 3) * 4;
        const y = 1.7 + Math.floor(i / 3) * 2.55;
        const ok = oklch(c.hex);
        const lb = lab(c.hex);
        it.push(
          R(x, y, 3.73, 1.0, c.hex, { line: LN }),
          R(x, y + 1.0, 3.73, 1.42, SB, { line: LN }),
          T(c.n, x + 0.16, y + 1.08, 2.4, 0.3, { b: 1, s: 12, c: INK }),
          T(c.p || '—', x + 2.0, y + 1.08, 1.6, 0.3, { s: 8.5, c: MUT, a: 'right' }),
          T(
            'HEX ' + c.hex + '   RGB ' + c.rgb + '\nCMYK ' + c.cmyk + '\nOKLCH ' + ok[0] + '% ' + ok[1] + ' ' + ok[2] + '   LAB ' + lb.join(' '),
            x + 0.16, y + 1.42, 3.45, 0.95, { s: 8.6, c: MUT }
          )
        );
      });
      sl('Color values', it);
    }
    {
      const it: SlideItem[] = [
        T('Tints are mixed with paper white; shades with black. Use tints for fields, never for text.', 0.8, 1.55, 11.7, 0.4, { s: 12, c: MUT }),
      ];
      C.slice(0, 3).forEach((c, i) => {
        const y = 2.15 + i * 1.5;
        it.push(T(c.n, 0.8, y + 0.28, 1.9, 0.4, { f: 'h', s: 14, b: 1, c: INK }));
        const cells = tints(c.hex).concat(shades(c.hex));
        const lbl = ['100', '80', '60', '40', '20', '10', 'S20', 'S40'];
        cells.forEach((h2, j) => {
          const x = 2.9 + j * 1.22;
          it.push(
            R(x, y, 1.14, 0.85, h2, { rd: 0, line: LN }),
            T(lbl[j], x, y + 0.92, 1.14, 0.25, { s: 8.5, c: MUT, a: 'center' }),
            T(h2, x, y + 1.16, 1.14, 0.22, { s: 6.8, c: MUT, a: 'center' })
          );
        });
      });
      sl('Tint & shade scales', it);
    }
    {
      const WT = [40, 25, 15, 10, 6, 4].slice(0, C.length);
      const tot = WT.reduce((s2, v) => s2 + v, 0) || 1;
      let cx = 0.8;
      const it: SlideItem[] = [T('PROPORTION', 0.8, 1.55, 4, 0.3, { s: 10.5, c: MUT, b: 1 })];
      C.forEach((c, i) => {
        const w = (11.73 * WT[i]) / tot;
        const x = cx;
        cx += w;
        it.push(
          R(x, 1.9, w, 0.85, c.hex, { rd: 0, line: LN }),
          T(Math.round((100 * WT[i]) / tot) + '%', x, 2.82, w, 0.3, { s: 9.5, c: MUT })
        );
      });
      it.push(T('CONTRAST ON WHITE', 0.8, 3.55, 5, 0.3, { s: 10.5, c: MUT, b: 1 }));
      C.forEach((c, i) => {
        const x = 0.8 + (i % 2) * 6;
        const y = 3.95 + Math.floor(i / 2) * 0.82;
        const r2 = ctr(c.hex, W);
        it.push(
          R(x, y, 0.55, 0.55, c.hex, { line: LN }),
          T(c.n, x + 0.75, y, 4.4, 0.3, { s: 12, b: 1, c: INK }),
          T(
            r2.toFixed(1) + ':1  ·  ' + (r2 >= 7 ? 'AAA' : r2 >= 4.5 ? 'AA' : r2 >= 3 ? 'AA large only' : 'Fails for text'),
            x + 0.75, y + 0.3, 4.6, 0.3, { s: 10.5, c: r2 >= 4.5 ? OK : r2 >= 3 ? WN : BAD }
          )
        );
      });
      sl('Proportion & contrast', it);
    }
    {
      const n = Math.min(C.length, 6);
      const cell = 0.86;
      const x0 = 3.3;
      const y0 = 2.0;
      const it: SlideItem[] = [
        T('Text colour ↓ on background →. ✓ passes AA (4.5:1). L = large text only (3:1).', 0.8, 1.5, 11.7, 0.4, { s: 11.5, c: MUT }),
      ];
      C.slice(0, n).forEach((c, j) => it.push(R(x0 + j * cell, y0 - 0.62, cell, 0.5, c.hex, { rd: 0, line: LN })));
      C.slice(0, n).forEach((c, i) => {
        const y = y0 + i * cell;
        it.push(
          R(x0 - 0.62, y, 0.5, cell, c.hex, { rd: 0, line: LN }),
          T(c.n, 0.8, y + 0.24, 1.8, 0.35, { s: 10, b: 1, c: INK, a: 'right' })
        );
        C.slice(0, n).forEach((b, j) => {
          const r2 = ctr(c.hex, b.hex);
          it.push(
            R(x0 + j * cell, y, cell, cell, b.hex, { rd: 0, line: LN }),
            T('Aa', x0 + j * cell, y + 0.1, cell, 0.4, { s: 13, b: 1, c: c.hex, a: 'center' }),
            T(r2 >= 4.5 ? '✓' : r2 >= 3 ? 'L' : '✕', x0 + j * cell, y + 0.5, cell, 0.28, {
              s: 8.5,
              c: r2 >= 4.5 ? OK : r2 >= 3 ? WN : BAD,
              a: 'center',
              b: 1,
            })
          );
        });
      });
      const lx = x0 + n * cell + 0.6;
      it.push(
        T('READING THE GRID', lx, y0 + 0.1, 3.2, 0.3, { s: 10.5, b: 1, c: a }),
        T(
          '✓  Body text allowed\nL  Large text only (18pt+)\n✕  Never pair for text\n\nDecorative pairings are unrestricted; this grid governs legibility only.',
          lx, y0 + 0.5, 3.3, 2.8, { s: 11.5, c: INK }
        )
      );
      sl('Pairing matrix', it);
    }

    // 04. Typography Section
    sec('04', 'Typography', 'Typefaces, hierarchy, character sets and micro-typography.');
    {
      const it: SlideItem[] = [];
      [
        ['h', S.hf, 'Heading typeface', 'Titles, headlines and display text.'],
        ['b', S.bf, 'Body typeface', 'Paragraphs, interface text and captions.'],
      ].forEach((f, i) => {
        const x = 0.8 + i * 6.03;
        it.push(
          R(x, 1.7, 5.7, 4.85, BG, { line: LN }),
          T('Aa', x + 0.4, 1.85, 5, 1.8, { f: f[0], s: 78, b: 1, c: INK }),
          T(f[1], x + 0.4, 4.05, 5, 0.5, { f: f[0], s: 19, b: 1, c: INK }),
          T(f[2].toUpperCase(), x + 0.4, 4.65, 5, 0.3, { s: 10, c: a, b: 1 }),
          T(f[3], x + 0.4, 5.05, 4.9, 0.9, { s: 12.5, c: MUT })
        );
      });
      sl('Typefaces', it);
    }
    {
      const rows = [
        [S.name, 34, 'h', 1, 1.75, 'H1 · 34'],
        ['Section heading', 23, 'h', 1, 2.75, 'H2 · 23'],
        ['Subsection heading', 15.5, 'h', 1, 3.55, 'H3 · 15.5'],
        ['Body copy is set for comfortable reading at small and large sizes.', 12.5, 'b', 0, 4.25, 'Body · 12.5'],
        ['CAPTION TEXT FOR NOTES, CREDITS AND FOOTNOTES.', 9.5, 'b', 0, 5.05, 'Caption · 9.5'],
      ];
      const it: SlideItem[] = [];
      rows.forEach(r => {
        it.push(
          R(0.8, (r[4] as number) - 0.12, 11.73, t.rule / 72, LN, { rd: 0 }),
          T(r[5] as string, 0.8, (r[4] as number) + 0.05, 2.2, 0.3, { s: 9.5, c: MUT, b: 1 }),
          T(r[0] as string, 3.2, r[4] as number, 9.3, (r[1] as number) / 48, {
            f: r[2] as any,
            s: r[1] as number,
            b: r[3] as number,
            c: INK,
          })
        );
      });
      sl('Type hierarchy', it);
    }
    sl('Character sets', [
      T('HEADING — ' + S.hf.toUpperCase(), 0.8, 1.65, 8, 0.3, { s: 10, c: MUT, b: 1 }),
      T('ABCDEFGHIJKLMNOPQRSTUVWXYZ\nabcdefghijklmnopqrstuvwxyz\n0123456789 !?&@#% — – ‘ ’ “ ”', 0.8, 2.05, 11.7, 2.0, { f: 'h', s: 24, c: INK }),
      R(0.8, 4.25, 11.73, t.rule / 72, LN, { rd: 0 }),
      T('BODY — ' + S.bf.toUpperCase(), 0.8, 4.45, 8, 0.3, { s: 10, c: MUT, b: 1 }),
      T('ABCDEFGHIJKLMNOPQRSTUVWXYZ\nabcdefghijklmnopqrstuvwxyz\n0123456789 !?&@#% — – ‘ ’ “ ”', 0.8, 4.85, 11.7, 1.8, { s: 18, c: INK }),
    ]);
    sl('Micro-typography', [
      T('TRACKING & LEADING', 0.8, 1.6, 5.6, 0.3, { s: 10.5, b: 1, c: a }),
      T('Display ≥ 32pt: track −2%.\nHeadings 16–31pt: track −1%.\nBody: default tracking, 150% leading.\nLabels: +6% tracking, all caps.', 0.8, 2.0, 5.6, 2.2, { s: 13, c: INK }),
      T('PUNCTUATION', 6.93, 1.6, 5.6, 0.3, { s: 10.5, b: 1, c: a }),
      T(S.punc, 6.93, 2.0, 5.6, 2.2, { s: 13, c: INK }),
      R(0.8, 4.5, 11.73, 1.9, BG, { line: LN }),
      T('“Good typography is invisible;\ngreat typography is unforgettable.”', 1.2, 4.75, 10.9, 1.1, { f: 'h', s: 24, c: p }),
      T('Set in ' + S.hf + ' · hanging punctuation · optical margins', 1.2, 6.0, 10.9, 0.3, { s: 10, c: MUT }),
    ]);

    // 05. Visual Language
    sec('05', 'Visual language', 'Imagery, a real icon system, patterns and our mascot.');
    {
      const it: SlideItem[] = [];
      lines(S.imgp).slice(0, 3).forEach((l, i) => {
        const q = kv(l);
        it.push(
          R(0.8, 1.85 + i * 1.55, 0.08, 1.2, a),
          T(q[0], 1.1, 1.85 + i * 1.55, 4.6, 0.4, { f: 'h', s: 15, b: 1, c: INK }),
          T(q[1], 1.1, 2.3 + i * 1.55, 4.6, 0.95, { s: 11.5, c: MUT })
        );
      });
      it.push(
        P(6.2, 1.7, 3.05, 4.85, 'm_img1', 'Imagery example', { tr: 1 }),
        P(9.48, 1.7, 3.05, 4.85, 'm_img2', 'Imagery example', { tr: 1 })
      );
      sl('Brand imagery', it);
    }
    sl('Photography', [
      P(0.8, 1.7, 5.7, 4.85, 'm_ph1', 'Hero image', { tr: 1 }),
      P(6.73, 1.7, 2.8, 2.32, 'm_ph2', 'Image 2', { tr: 1 }),
      P(9.73, 1.7, 2.8, 2.32, 'm_ph3', 'Image 3', { tr: 1 }),
      P(6.73, 4.23, 2.8, 2.32, 'm_ph4', 'Image 4', { tr: 1 }),
      P(9.73, 4.23, 2.8, 2.32, 'm_ph5', 'Image 5', { tr: 1 }),
      T(
        (S.photoCredit || '') + '  ·  Treatment: ' + ({ none: 'natural', mono: 'monochrome', duotone: 'duotone', warm: 'warm grade' }[S.treat] || 'natural'),
        0.8, 6.62, 11.7, 0.3, { s: 9, c: MUT }
      ),
    ]);
    {
      const iconNames = S.icons.split(',').map(x => x.trim().toLowerCase()).filter(Boolean).slice(0, 8);
      const icc = S.icc === 'accent' ? a : S.icc === 'ink' ? INK : p;
      const it: SlideItem[] = [
        T(S.iconNote.replace('{SW}', S.isw), 0.8, 1.8, 4.2, 2.6, { s: 13, c: INK }),
        T('LIBRARY', 0.8, 4.6, 4, 0.3, { s: 10, c: MUT, b: 1 }),
        T(S.iconLib.toUpperCase() + ' · MIT/ISC licence', 0.8, 4.92, 4.2, 0.4, { s: 12.5, b: 1, c: p }),
        T('24 px grid · ' + S.isw + ' px stroke · single colour', 0.8, 5.32, 4.2, 0.4, { s: 11, c: MUT }),
      ];
      iconNames.forEach((n, i) => {
        const x = 5.6 + (i % 4) * 1.75;
        const y = 1.8 + Math.floor(i / 4) * 2.4;
        it.push(
          R(x, y, 1.55, 2.1, BG, { line: LN }),
          IC(x + 0.4, y + 0.42, 0.75, 0.75, n, icc),
          T(n, x, y + 1.52, 1.55, 0.3, { s: 9.5, c: MUT, a: 'center' })
        );
      });
      sl('Iconography', it);
    }
    {
      const iconNames = S.icons.split(',').map(x => x.trim().toLowerCase()).filter(Boolean);
      const n0 = iconNames[0] || 'star';
      const icc = S.icc === 'accent' ? a : p;
      const it: SlideItem[] = [
        T('One icon, four sizes. The grid holds; the stroke never scales below 1 px.', 0.8, 1.55, 11.7, 0.4, { s: 12, c: MUT }),
      ];
      [[0.34, '16'], [0.5, '24'], [0.68, '32'], [1.0, '48']].forEach((z, i) => {
        const x = 1.1 + i * 3.0;
        const sz = z[0] as number;
        it.push(
          R(x, 2.3, 2.5, 2.5, BG, { line: LN }),
          IC(x + 1.25 - sz / 2, 3.55 - sz / 2, sz, sz, n0, icc),
          T((z[1] as string) + ' px', x, 4.95, 2.5, 0.35, { s: 11, b: 1, c: INK, a: 'center' })
        );
      });
      it.push(
        T('DO', 0.8, 5.65, 5.6, 0.3, { s: 10, b: 1, c: OK }),
        T('✓ Scale on the pixel grid   ✓ Keep one stroke weight   ✓ One colour per surface', 0.8, 5.98, 11.7, 0.35, { s: 11.5, c: INK }),
        T('DON’T', 0.8, 6.35, 5.6, 0.3, { s: 10, b: 1, c: BAD }),
        T('✕ Mix libraries   ✕ Outline plus fill in one set   ✕ Rotate icons for decoration', 0.8, 6.66, 11.7, 0.35, { s: 11.5, c: INK })
      );
      sl('Icon sizing & stroke', it);
    }
    {
      const it: SlideItem[] = [T(S.patNote, 0.8, 1.8, 3.8, 3.2, { s: 13, c: INK })];
      ['Primary pattern', 'Secondary pattern', 'Tonal variant', 'Reversed variant'].forEach((n, i) =>
        it.push(P(5 + (i % 2) * 3.8, 1.7 + Math.floor(i / 2) * 2.5, 3.6, 2.3, 'pt' + i, n))
      );
      sl('Patterns', it);
    }
    sl('Pattern in use', [
      P(0.8, 1.7, 7.4, 4.85, 'pu_a', 'Pattern on packaging or print'),
      P(8.5, 1.7, 4.03, 2.32, 'pu_b', 'Pattern on social'),
      P(8.5, 4.23, 4.03, 2.32, 'pu_c', 'Pattern as background'),
    ]);
    sl('Meet ' + S.mcName, [
      P(0.8, 1.7, 5.6, 4.85, 'mc_hero', 'Mascot illustration', { m: 'contain' }),
      T(S.mcName, 6.9, 1.8, 5.6, 0.9, { f: 'h', s: 38, b: 1, c: p }),
      T(S.mcStory, 6.9, 2.9, 5.6, 2.6, { s: 14, c: INK }),
      T(S.mcTraits, 6.9, 5.7, 5.6, 0.4, { s: 11.5, c: MUT, b: 1 }),
    ]);
    {
      const it: SlideItem[] = ['Waving', 'Thinking', 'Celebrating', 'Surprised'].map((n, i) =>
        P(0.8 + i * 3.01, 1.7, 2.72, 4.05, 'mc_p' + i, n, { m: 'contain' })
      );
      it.push(T('Use approved poses only. Request new poses from the brand team.', 0.8, 5.95, 11.7, 0.4, { s: 11.5, c: MUT }));
      sl('Poses & expressions', it);
    }
    {
      const it: SlideItem[] = [];
      [
        ['Do', S.mcDo, OK, '✓', 0.8, 'mc_do'],
        ['Don’t', S.mcDont, BAD, '✕', 6.9, 'mc_dt'],
      ].forEach(col => {
        const x = col[4] as number;
        it.push(
          T((col[0] as string).toUpperCase(), x, 1.6, 5, 0.3, { s: 10.5, b: 1, c: col[2] as string }),
          P(x, 2.0, 2.7, 2.5, col[5] + '0', 'Example', { m: 'contain' }),
          P(x + 2.9, 2.0, 2.7, 2.5, col[5] + '1', 'Example', { m: 'contain' })
        );
        lines(col[1] as string).slice(0, 3).forEach((w, i) =>
          it.push(
            T(col[3] as string, x, 4.85 + i * 0.55, 0.4, 0.4, { s: 13, b: 1, c: col[2] as string }),
            T(w, x + 0.5, 4.85 + i * 0.55, 5.1, 0.5, { s: 12, c: INK })
          )
        );
      });
      sl('Mascot do’s & don’ts', it);
    }

    // 06. Applications Section
    sec('06', 'Applications', 'The identity in the world. Click any placeholder to add artwork.');
    sl('Stationery', [
      P(0.8, 1.7, 5.6, 4.85, 'm_letter', 'Letterhead'),
      P(6.73, 1.7, 5.8, 2.32, 'm_card', 'Business card'),
      P(6.73, 4.23, 5.8, 2.32, 'm_env', 'Envelope or folder'),
    ]);
    sl('Digital', [
      P(0.8, 1.7, 7.4, 4.85, 'm_web', 'Website mockup'),
      P(8.5, 1.7, 4.03, 4.85, 'm_app', 'Mobile app mockup'),
    ]);
    sl('Social media', [0, 1, 2].map(i =>
      P(0.8 + i * 4, 1.7, 3.73, 4.65, 'm_soc' + i, ['Profile & avatar', 'Feed post', 'Story or cover'][i])
    ));
    sl('Signage & packaging', [
      P(0.8, 1.7, 7.4, 4.85, 'm_sign', 'Signage'),
      P(8.5, 1.7, 4.03, 2.32, 'm_pack', 'Packaging'),
      P(8.5, 4.23, 4.03, 2.32, 'm_pack2', 'Packaging detail'),
    ]);
    sl('Merchandise', ['Apparel', 'Tote bag', 'Mug', 'Notebook', 'Cap', 'Stickers'].map((n, i) =>
      P(0.8 + (i % 3) * 4, 1.7 + Math.floor(i / 3) * 2.5, 3.73, 2.3, 'm_mer' + i, n)
    ));
    sl('Apparel & wearables', [
      P(0.8, 1.7, 3.73, 4.65, 'm_tshirt', 'T-shirt'),
      P(4.8, 1.7, 3.73, 4.65, 'm_hoodie', 'Hoodie'),
      P(8.8, 1.7, 3.73, 4.65, 'm_cap2', 'Cap / hat'),
    ]);
    sl('Print & publications', [
      P(0.8, 1.7, 5.7, 4.85, 'm_book', 'Book cover'),
      P(6.73, 1.7, 2.8, 2.32, 'm_brochure', 'Brochure'),
      P(9.73, 1.7, 2.8, 2.32, 'm_poster', 'Poster'),
      P(6.73, 4.23, 5.8, 2.32, 'm_magazine', 'Magazine spread'),
    ]);
    sl('Digital ads', [
      P(0.8, 1.7, 3.73, 2.3, 'm_banner1', 'Web banner 728×90'),
      P(4.8, 1.7, 3.73, 2.3, 'm_banner2', 'Social ad 1200×628'),
      P(8.8, 1.7, 3.73, 2.3, 'm_banner3', 'Story ad 1080×1920'),
      P(0.8, 4.23, 3.73, 2.3, 'm_email', 'Email header'),
      P(4.8, 4.23, 3.73, 2.3, 'm_newsletter', 'Newsletter header'),
      P(8.8, 4.23, 3.73, 2.3, 'm_display', 'Display ad'),
    ]);
    sl('Events & signage', [
      P(0.8, 1.7, 7.4, 4.85, 'm_booth', 'Trade show booth'),
      P(8.5, 1.7, 4.03, 2.32, 'm_billboard', 'Billboard'),
      P(8.5, 4.23, 4.03, 2.32, 'm_rollup', 'Roll-up banner'),
    ]);
    sl('Vehicle & outdoor', [
      P(0.8, 1.7, 5.7, 4.85, 'm_van', 'Van wrap'),
      P(6.73, 1.7, 2.8, 2.32, 'm_bus', 'Bus advertisement'),
      P(9.73, 1.7, 2.8, 2.32, 'm_bike', 'Bike / scooter'),
      P(6.73, 4.23, 5.8, 2.32, 'm_storefront', 'Storefront signage'),
    ]);
    sl('Product & packaging', [
      P(0.8, 1.7, 3.73, 4.65, 'm_box', 'Product box'),
      P(4.8, 1.7, 3.73, 4.65, 'm_bottle', 'Bottle / container'),
      P(8.8, 1.7, 3.73, 4.65, 'm_bag', 'Shopping bag'),
    ]);
    sl('Social extended', [
      P(0.8, 1.7, 3.73, 4.65, 'm_yt', 'YouTube thumbnail'),
      P(4.8, 1.7, 3.73, 4.65, 'm_podcast', 'Podcast cover'),
      P(8.8, 1.7, 3.73, 4.65, 'm_carousel', 'Instagram carousel'),
    ]);
    sl('Presentation template', [P(0.8, 1.7, 11.73, 4.85, 'm_ppt', 'Presentation slide template')]);

    // 07. Document Section
    sec('07', 'Document', 'Colophon, revisions and how to reach the brand team.');
    {
      const rows = [
        ['Typefaces', S.hf + ' (display) · ' + S.bf + ' (text) — Google Fonts, OFL'],
        ['Iconography', S.iconLib.toUpperCase() + ' — MIT/ISC licence, served via Iconify/Lucide'],
        ['Colour science', 'OKLCH & CIELAB from sRGB · WCAG 2.1 contrast · CMYK naive, proof before press'],
        ['Imagery', S.photoCredit || 'Photography courtesy of credited contributors.'],
        ['Paper stock', S.paper],
        ['Production', S.prodNote],
        ['Tooling', 'Composed in BrandBook Studio · React + Tailwind · Vector PDF & Canva PPTX'],
      ];
      const it: SlideItem[] = [];
      rows.forEach((r, i) => {
        const y = 1.7 + i * 0.7;
        it.push(
          R(0.8, y, 11.73, t.rule / 72, LN, { rd: 0 }),
          T(r[0].toUpperCase(), 0.8, y + 0.13, 2.6, 0.4, { s: 9.5, b: 1, c: a }),
          T(r[1], 3.6, y + 0.08, 8.9, 0.58, { s: i === 3 ? 9.5 : 11.5, c: INK })
        );
      });
      sl('Colophon', it);
    }
    {
      const it: SlideItem[] = [];
      lines(S.versions).slice(0, 6).forEach((l, i) => {
        const q = pipe(l);
        const y = 1.75 + i * 0.82;
        const cur = i === 0;
        it.push(
          R(0.8, y, 11.73, 0.7, cur ? BG : SB, { line: LN }),
          T(q[0] || '', 1.05, y + 0.16, 1.3, 0.4, { f: 'h', s: 15, b: 1, c: cur ? p : INK }),
          T(q[1] || '', 2.5, y + 0.19, 1.9, 0.35, { s: 11.5, c: MUT }),
          T(q[2] || '', 4.6, y + 0.13, 6.4, 0.5, { s: 12, c: INK })
        );
        if (cur) it.push(T('CURRENT', 11.1, y + 0.2, 1.2, 0.3, { s: 8.5, b: 1, c: a, a: 'right' }));
      });
      sl('Version history', it);
    }

    // Contact Slide
    {
      const it: SlideItem[] = [
        I(0.8, 0.78, 1.7, 0.85),
        T(H(S.name), 0.8, 2.5, 8.3, 1.3, { f: 'h', s: 50, b: 1, c: tp }),
        T(S.tagline, 0.8, 3.85, 8.3, 0.6, { s: 17, c: tp }),
        R(0.8, 4.7, 8.3, t.rule / 72, onP ? mix(W, p, 0.35) : mix(INK, p, 0.3), { rd: 0 }),
      ];
      [
        ['Website', S.url],
        ['Email', S.email],
        ['Phone', S.phone],
        ['Social', S.handle],
        ['Studio', S.address],
      ].forEach((r, i) => {
        const x = 0.8 + (i % 2) * 4.2;
        const y = 4.95 + Math.floor(i / 2) * 0.62;
        it.push(
          T(r[0].toUpperCase(), x, y, 1.4, 0.3, { s: 8.5, c: tp, b: 1 }),
          T(r[1], x + 1.4, y - 0.03, 2.7, 0.35, { s: 11.5, c: tp })
        );
      });
      it.push(
        R(9.55, 1.5, 2.98, 5.0, null, { line: onP ? mix(W, p, 0.4) : mix(INK, p, 0.35) }),
        I(10.29, 2.25, 1.5, 1.5, onP, onP ? 'lg_mono' : undefined),
        T('BRAND ENQUIRIES', 9.85, 4.25, 2.38, 0.3, { s: 8.5, c: tp, a: 'center', b: 1 }),
        T(S.email, 9.85, 4.62, 2.38, 0.6, { s: 10.5, c: tp, a: 'center' }),
        R(10.55, 5.35, 1, 0.05, onP ? W : p),
        T(S.version, 9.85, 5.62, 2.38, 0.3, { s: 9.5, c: tp, a: 'center' }),
        ...CR(tp)
      );
      if (S.copy) it.push(T(S.copy, 0.8, 6.82, 8, 0.3, { s: 9.5, c: tp }));
      out.push({ title: 'Contact', bg: p, f: 0, items: it, oi: out.length });
    }
    secs.push(['Contact', out.length + 1]);

    // Contents Slide (inserted at index 1)
    {
      const rows = secs.map((q, i) => [q[0], q[1], i < secs.length - 1 ? secs[i + 1][1] - 1 : q[1]]);
      const it: SlideItem[] = [T(H('Contents'), 0.8, 0.55, 11.7, 0.75, { f: 'h', s: 29, b: 1, c: hc })];
      rows.forEach((r, i) => {
        const y = 1.55 + i * 0.63;
        it.push(
          R(0.8, y, 11.73, t.rule / 72, LN, { rd: 0 }),
          T('0' + (i + 1), 0.8, y + 0.14, 0.6, 0.4, { s: 11, b: 1, c: a }),
          T(H(r[0]), 1.5, y + 0.1, 7.4, 0.5, { f: 'h', s: 17, b: 1, c: INK }),
          T(r[1] === r[2] ? 'Slide ' + r[1] : 'Slides ' + r[1] + '–' + r[2], 9, y + 0.18, 3.53, 0.4, {
            s: 11.5,
            c: MUT,
            a: 'right',
          })
        );
      });
      out.splice(1, 0, { title: 'Contents', bg: SB, f: 1, items: it, oi: 1 });
    }

    // Cloned Slides
    (S.clones || []).forEach(src => {
      if (out[src]) {
        const cp = JSON.parse(JSON.stringify(out[src]));
        cp.title = cp.title + ' (copy)';
        cp.cloned = true;
        cp.oi = out.length;
        out.push(cp);
      }
    });

    // Re-index & attach footer folios / watermarks
    const N = out.length;
    out.forEach((d, i) => {
      d.oi = i;
      d.items.forEach((it, j) => {
        if (it.k === 't' && !it.id) it.id = 's' + i + '_i' + j;
      });
      if (d.f) {
        const fol = t.folio;
        let fs = '';
        if (S.pn === 'yes') {
          if (fol === 'slash') fs = i + 1 + ' / ' + N;
          else if (fol === 'num') fs = String(i + 1).padStart(2, '0');
          else if (fol === 'page') fs = 'p. ' + String(i + 1).padStart(2, '0');
        }
        d.items.push(T(S.name + ' Brand Guidelines', 0.8, 6.98, 6, 0.3, { s: 8.5, c: MUT }));
        if (S.copy) d.items.push(T(S.copy, 4.2, 6.98, 4.9, 0.3, { s: 8.5, c: MUT, a: 'center' }));
        if (fs) d.items.push(T(fs, 11.5, 6.98, 1.03, 0.3, { s: 8.5, c: MUT, a: 'right' }));
        if (S.dlabel) d.items.push(T(S.dlabel, 9.5, 0.28, 3.03, 0.3, { s: 8.5, c: MUT, a: 'right' }));
      }
      if (S.marks) {
        const m = 0.18, g2 = 0.125;
        [
          [g2, g2, 1, 1],
          [GX - g2, g2, -1, 1],
          [g2, GY - g2, 1, -1],
          [GX - g2, GY - g2, -1, -1],
        ].forEach(q => {
          d.items.push(
            R(q[2] > 0 ? 0 : q[0], q[1] - 0.004, m, 0.008, INK, { rd: 0 }),
            R(q[0] - 0.004, q[3] > 0 ? 0 : q[1], 0.008, m, INK, { rd: 0 })
          );
        });
        d.items.push(R(g2, g2, GX - 2 * g2, GY - 2 * g2, null, { line: a, dash: 1, rd: 0 }));
      }
      if (S.wm) {
        const c = mix(isDark(d.bg) ? W : INK, d.bg, +S.wmo);
        d.items.push(T(S.wm, 1.2, 3.2, 10.9, 1.4, { f: 'h', s: 58, b: 1, c, a: 'center', rot: -30 }));
      }
    });

    // Apply Overrides
    out.forEach((d, i) => {
      const o = OV[i];
      if (!o) return;
      if (o.bg) d.bg = o.bg;
      if (o.deleted) d.hidden = true;
      d.items.forEach(it => {
        if (it.k === 'i') {
          if (o.logoVariant) it.key = o.logoVariant;
          if (o.logoScale) {
            const cx2 = it.x + it.w / 2, cy = it.y + it.h / 2;
            it.w *= o.logoScale;
            it.h *= o.logoScale;
            it.x = cx2 - it.w / 2;
            it.y = cy - it.h / 2;
          }
          if (o.logoInvert === 'yes') it.inv = true;
          else if (o.logoInvert === 'no') it.inv = false;
        }
        if (it.k === 't' && it.id && o.customTexts && o.customTexts[it.id] !== undefined) {
          it.t = o.customTexts[it.id];
        }
      });
      if (o.pos) {
        Object.keys(o.pos).forEach(k => {
          const it = d.items[+k];
          const q = o.pos![+k];
          if (!it || !q) return;
          if (q.x !== undefined) it.x = q.x;
          if (q.y !== undefined) it.y = q.y;
          if (q.w !== undefined) it.w = q.w;
          if (q.h !== undefined) it.h = q.h;
          if (q.s && it.k === 't') it.s = Math.max(5, (it.s || 12) + q.s);
          if (q.a) it.a = q.a;
          if (q.hid) it.hid = true;
        });
      }
    });

    return out;
  } catch (err) {
    console.error('Deck generation error:', err);
    return [];
  }
}
