export const clamp = (v: number, a: number, b: number): number => Math.max(a, Math.min(b, v));

export const norm = (h: string): string => {
  let hex = String(h || '').trim().replace('#', '');
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  if (!/^[0-9a-fA-F]{6}$/.test(hex)) hex = '000000';
  return '#' + hex.toUpperCase();
};

export const isHex = (h: string): boolean => /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.test(String(h || '').trim());

export const rgb = (h: string): [number, number, number] => {
  const n = parseInt(norm(h).slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

export const hex2 = (a: number[]): string =>
  '#' + a.map(v => clamp(Math.round(v), 0, 255).toString(16).padStart(2, '0')).join('').toUpperCase();

export const mix = (a: string, b: string, t: number): string => {
  const ra = rgb(a), rb = rgb(b);
  return hex2([ra[0] * t + rb[0] * (1 - t), ra[1] * t + rb[1] * (1 - t), ra[2] * t + rb[2] * (1 - t)]);
};

export const lum = (h: string): number => {
  const c = rgb(h).map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};

export const ctr = (a: string, b: string): number => {
  const x = lum(a), y = lum(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};

export const isDark = (h: string): boolean => ctr(h, '#FFFFFF') >= 3;

export const cmyk = (a: [number, number, number] | number[]): [number, number, number, number] => {
  const r = a[0] / 255, g = a[1] / 255, b = a[2] / 255;
  const k = 1 - Math.max(r, g, b);
  if (k >= 1) return [0, 0, 0, 100];
  return [
    Math.round(((1 - r - k) / (1 - k)) * 100),
    Math.round(((1 - g - k) / (1 - k)) * 100),
    Math.round(((1 - b - k) / (1 - k)) * 100),
    Math.round(k * 100)
  ];
};

export function oklch(h: string): [string, string, string] {
  const c = rgb(h).map(v => {
    v /= 255;
    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  const r = c[0], g = c[1], b = c[2];
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  const C = Math.sqrt(A * A + B * B);
  let H = (Math.atan2(B, A) * 180) / Math.PI;
  if (H < 0) H += 360;
  return [(L * 100).toFixed(1), C.toFixed(3), C < 0.001 ? '—' : H.toFixed(0) + '°'];
}

export function lab(h: string): [string, string, string] {
  const c = rgb(h).map(v => {
    v /= 255;
    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  let X = (c[0] * 0.4124 + c[1] * 0.3576 + c[2] * 0.1805) / 0.95047;
  let Y = (c[0] * 0.2126 + c[1] * 0.7152 + c[2] * 0.0722);
  let Z = (c[0] * 0.0193 + c[1] * 0.1192 + c[2] * 0.9505) / 1.08883;
  const f = (t: number) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  X = f(X); Y = f(Y); Z = f(Z);
  return [(116 * Y - 16).toFixed(0), (500 * (X - Y)).toFixed(0), (200 * (Y - Z)).toFixed(0)];
}

export function hex2hsv(h: string): [number, number, number] {
  const c = rgb(h).map(v => v / 255);
  const r = c[0], g = c[1], b = c[2];
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
  let hh = 0;
  if (d) {
    if (mx === r) hh = ((g - b) / d) % 6;
    else if (mx === g) hh = (b - r) / d + 2;
    else hh = (r - g) / d + 4;
    hh *= 60;
    if (hh < 0) hh += 360;
  }
  return [hh, mx ? d / mx : 0, mx];
}

export function hsv2hex(h: number, s: number, v: number): string {
  h = ((h % 360) + 360) % 360;
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  let r = 0, g = 0, b = 0;
  if (h < 60) { r = c; g = x; }
  else if (h < 120) { r = x; g = c; }
  else if (h < 180) { g = c; b = x; }
  else if (h < 240) { g = x; b = c; }
  else if (h < 300) { r = x; b = c; }
  else { r = c; b = x; }
  return hex2([(r + m) * 255, (g + m) * 255, (b + m) * 255]);
}

export const tints = (h: string): string[] => [1, 0.8, 0.6, 0.4, 0.2, 0.1].map(t => mix('#FFFFFF', h, t));
export const shades = (h: string): string[] => [mix(h, '#000000', 0.8), mix(h, '#000000', 0.6)];

export const vals = (h: string) => {
  const r = rgb(h);
  return { hex: norm(h), rgb: r.join(', '), cmyk: cmyk(r).join(', ') };
};
