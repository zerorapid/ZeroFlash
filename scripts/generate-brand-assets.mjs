import fs from 'fs';
import path from 'path';

const mockupsDir = path.resolve('/Users/Jayapalreddy/Downloads/Zeroflash-brand-book/public/mockups');
if (!fs.existsSync(mockupsDir)) {
  fs.mkdirSync(mockupsDir, { recursive: true });
}

const rawLogo = fs.readFileSync('/Users/Jayapalreddy/Downloads/vengo-granites-logo-black.svg', 'utf8');

// Clean inner paths
const groups = rawLogo.match(/<g>[\s\S]*?<\/g>/g) || [];
const bladesGroup = groups[0] || '';
const textRingGroup = groups[1] || '';

// 1. Icon Logo (Inner 3-blade monoliths only)
const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="100 80 370 410" width="100%" height="100%">
  <rect width="100%" height="100%" fill="none"/>
  ${bladesGroup}
</svg>`;
fs.writeFileSync(path.join(mockupsDir, 'logo-version-icon.svg'), iconSvg);

// 2. Primary Logo (Full black seal on light ground)
const primarySvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 567.88 567.99" width="100%" height="100%">
  <rect width="100%" height="100%" fill="none"/>
  ${bladesGroup}
  ${textRingGroup}
</svg>`;
fs.writeFileSync(path.join(mockupsDir, 'logo-version-primary.svg'), primarySvg);

// 3. Secondary Logo (Quarry Brass gold on deep basalt ground)
const secondarySvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 567.88 567.99" width="100%" height="100%">
  <rect width="100%" height="100%" rx="16" fill="#181B1F"/>
  <g fill="#A67C52">
    ${bladesGroup.replace(/<g>/g, '').replace(/<\/g>/g, '')}
    ${textRingGroup.replace(/<g>/g, '').replace(/<\/g>/g, '')}
  </g>
</svg>`;
fs.writeFileSync(path.join(mockupsDir, 'logo-version-secondary.svg'), secondarySvg);

// 4. Reversed Mono Logo (Pure white on dark ground)
const monoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 567.88 567.99" width="100%" height="100%">
  <rect width="100%" height="100%" rx="16" fill="#111315"/>
  <g fill="#FFFFFF">
    ${bladesGroup.replace(/<g>/g, '').replace(/<\/g>/g, '')}
    ${textRingGroup.replace(/<g>/g, '').replace(/<\/g>/g, '')}
  </g>
</svg>`;
fs.writeFileSync(path.join(mockupsDir, 'logo-version-mono.svg'), monoSvg);

// 5. Horizontal Lockup (Seal + Typography)
const lockupHorizontalSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 480" width="100%" height="100%">
  <rect width="100%" height="100%" fill="none"/>
  <g transform="translate(40, 20) scale(0.77)">
    ${bladesGroup}
    ${textRingGroup}
  </g>
  <text x="540" y="240" font-family="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" font-weight="800" font-size="94" letter-spacing="4" fill="#111315">VENGO GRANITES</text>
  <text x="545" y="315" font-family="'Inter', system-ui, -apple-system, sans-serif" font-weight="600" font-size="28" letter-spacing="8" fill="#A67C52">ENGINEERED BY EARTH · MALKANGIRI</text>
  <line x1="545" y1="355" x2="1480" y2="355" stroke="#E4E4E7" stroke-width="2"/>
  <text x="545" y="395" font-family="'Inter', system-ui, -apple-system, sans-serif" font-weight="500" font-size="22" letter-spacing="4" fill="#6B7280">ABSOLUTE BLACK NATURAL STONE QUARRY &amp; FABRICATION</text>
</svg>`;
fs.writeFileSync(path.join(mockupsDir, 'logo-lockup-horizontal.svg'), lockupHorizontalSvg);

// 6. Stacked Lockup (Seal centered above Typography)
const lockupStackedSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 950" width="100%" height="100%">
  <rect width="100%" height="100%" fill="none"/>
  <g transform="translate(140, 40) scale(0.92)">
    ${bladesGroup}
    ${textRingGroup}
  </g>
  <text x="400" y="660" text-anchor="middle" font-family="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" font-weight="800" font-size="64" letter-spacing="3" fill="#111315">VENGO GRANITES</text>
  <text x="400" y="725" text-anchor="middle" font-family="'Inter', system-ui, -apple-system, sans-serif" font-weight="600" font-size="22" letter-spacing="6" fill="#A67C52">CHOOSE THE BEST</text>
  <line x1="280" y1="765" x2="520" y2="765" stroke="#A67C52" stroke-width="3"/>
  <text x="400" y="820" text-anchor="middle" font-family="'Inter', system-ui, -apple-system, sans-serif" font-weight="500" font-size="20" letter-spacing="4" fill="#6B7280">MALKANGIRI · ODISHA</text>
</svg>`;
fs.writeFileSync(path.join(mockupsDir, 'logo-lockup-stacked.svg'), lockupStackedSvg);

// 7. Wordmark Lockup
const lockupWordmarkSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400" width="100%" height="100%">
  <rect width="100%" height="100%" fill="none"/>
  <text x="600" y="210" text-anchor="middle" font-family="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" font-weight="900" font-size="108" letter-spacing="6" fill="#111315">VENGO GRANITES</text>
  <line x1="260" y1="260" x2="940" y2="260" stroke="#A67C52" stroke-width="4"/>
  <text x="600" y="320" text-anchor="middle" font-family="'Inter', system-ui, -apple-system, sans-serif" font-weight="700" font-size="26" letter-spacing="10" fill="#6B7280">ABSOLUTE BLACK · INDIA</text>
</svg>`;
fs.writeFileSync(path.join(mockupsDir, 'logo-lockup-wordmark.svg'), lockupWordmarkSvg);

// 8. Logo Concept Blueprint (Architectural Drafting Diagram)
const conceptSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%">
  <defs>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E4E4E7" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" rx="12" fill="#FBFBFC"/>
  <rect width="100%" height="100%" rx="12" fill="url(#grid)" opacity="0.75"/>
  <line x1="400" y1="40" x2="400" y2="760" stroke="#0EA5E9" stroke-width="1.5" stroke-dasharray="6 4" opacity="0.6"/>
  <line x1="40" y1="400" x2="760" y2="400" stroke="#0EA5E9" stroke-width="1.5" stroke-dasharray="6 4" opacity="0.6"/>
  <circle cx="400" cy="400" r="320" fill="none" stroke="#0EA5E9" stroke-width="1.5" stroke-dasharray="8 6" opacity="0.5"/>
  <circle cx="400" cy="400" r="235" fill="none" stroke="#A67C52" stroke-width="1.5" stroke-dasharray="4 4" opacity="0.6"/>
  
  <g transform="translate(142, 142) scale(0.91)">
    ${bladesGroup}
    ${textRingGroup}
  </g>
  
  <!-- Architectural Dimension Markers -->
  <line x1="165" y1="140" x2="635" y2="140" stroke="#111315" stroke-width="2"/>
  <line x1="165" y1="125" x2="165" y2="155" stroke="#111315" stroke-width="2"/>
  <line x1="635" y1="125" x2="635" y2="155" stroke="#111315" stroke-width="2"/>
  <rect x="360" y="125" width="80" height="30" rx="4" fill="#111315"/>
  <text x="400" y="145" text-anchor="middle" font-family="'Inter', sans-serif" font-weight="700" font-size="14" fill="#FFFFFF">Ø 568 mm</text>
  
  <!-- Annotation callouts -->
  <circle cx="400" cy="400" r="5" fill="#EF4444"/>
  <path d="M 400 400 L 520 310 L 680 310" fill="none" stroke="#EF4444" stroke-width="2"/>
  <text x="685" y="306" font-family="'Inter', sans-serif" font-weight="700" font-size="13" fill="#EF4444">01. KINETIC MONOLITHS (GANG-SAW BLADES)</text>
  <text x="685" y="324" font-family="'Inter', sans-serif" font-weight="500" font-size="11" fill="#6B7280">Angled 45° dynamic cutting vectors</text>
  
  <path d="M 235 340 L 140 260 L 40 260" fill="none" stroke="#0EA5E9" stroke-width="2"/>
  <text x="40" y="246" font-family="'Inter', sans-serif" font-weight="700" font-size="13" fill="#0EA5E9">02. ORBITAL RADIUS (SWIRL)</text>
  <text x="40" y="264" font-family="'Inter', sans-serif" font-weight="500" font-size="11" fill="#6B7280">High-velocity circular diamond rotation</text>
  
  <path d="M 400 720 L 400 750 L 540 750" fill="none" stroke="#A67C52" stroke-width="2"/>
  <text x="545" y="746" font-family="'Inter', sans-serif" font-weight="700" font-size="13" fill="#A67C52">03. ARCHITECTURAL SEAL</text>
  <text x="545" y="764" font-family="'Inter', sans-serif" font-weight="500" font-size="11" fill="#6B7280">Single-deposit sovereign lease certification</text>
</svg>`;
fs.writeFileSync(path.join(mockupsDir, 'logo-concept.svg'), conceptSvg);

// 9. Logo on Dark Granite (for Slide 23)
const photoLogoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="100%" height="100%">
  <defs>
    <radialGradient id="graniteGlow" cx="45%" cy="50%" r="65%">
      <stop offset="0%" stop-color="#24282D"/>
      <stop offset="60%" stop-color="#141619"/>
      <stop offset="100%" stop-color="#0A0B0D"/>
    </radialGradient>
    <pattern id="crystallineSpecks" width="80" height="80" patternUnits="userSpaceOnUse">
      <circle cx="12" cy="18" r="1.5" fill="#4B5563" opacity="0.4"/>
      <circle cx="45" cy="55" r="1" fill="#9CA3AF" opacity="0.3"/>
      <circle cx="68" cy="22" r="1.8" fill="#6B7280" opacity="0.5"/>
      <circle cx="28" cy="70" r="1.2" fill="#D1D5DB" opacity="0.25"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#graniteGlow)"/>
  <rect width="100%" height="100%" fill="url(#crystallineSpecks)"/>
  
  <!-- Subtle natural veining lines -->
  <path d="M -50 200 Q 300 450 700 250 T 1300 600" fill="none" stroke="#374151" stroke-width="2" opacity="0.3"/>
  <path d="M 0 650 Q 500 500 1200 700" fill="none" stroke="#4B5563" stroke-width="1.5" opacity="0.25"/>

  <!-- Scrim overlay -->
  <rect x="0" y="450" width="1200" height="350" fill="black" opacity="0.45"/>

  <!-- Reversed White Logo Mark in center -->
  <g transform="translate(480, 220) scale(0.42)" fill="#FFFFFF">
    ${bladesGroup.replace(/<g>/g, '').replace(/<\/g>/g, '')}
    ${textRingGroup.replace(/<g>/g, '').replace(/<\/g>/g, '')}
  </g>
  <text x="600" y="550" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-weight="700" font-size="28" letter-spacing="4" fill="#FFFFFF">MALKANGIRI ABSOLUTE BLACK</text>
  <text x="600" y="590" text-anchor="middle" font-family="'Inter', sans-serif" font-weight="500" font-size="16" letter-spacing="3" fill="#A67C52">HIGH-DENSITY 3.05 g/cm³ · UNIFORM GRAIN</text>
</svg>`;
fs.writeFileSync(path.join(mockupsDir, 'logo-photo-granite.svg'), photoLogoSvg);

// 10. Logo Do's (r1, r2, r3)
const r1Svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 280" width="100%" height="100%">
  <rect width="100%" height="100%" rx="8" fill="#141618"/>
  <g transform="translate(250, 45) scale(0.33)" fill="#FFFFFF">
    ${bladesGroup.replace(/<g>/g, '').replace(/<\/g>/g, '')}
    ${textRingGroup.replace(/<g>/g, '').replace(/<\/g>/g, '')}
  </g>
</svg>`;
fs.writeFileSync(path.join(mockupsDir, 'logo-do-1.svg'), r1Svg);

const r2Svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 280" width="100%" height="100%">
  <rect width="100%" height="100%" rx="8" fill="#F4F4F5"/>
  <rect x="180" y="25" width="240" height="230" rx="4" fill="#E0F2FE" stroke="#0284C7" stroke-width="2" stroke-dasharray="6 4"/>
  <g transform="translate(225, 45) scale(0.33)">
    ${bladesGroup}
    ${textRingGroup}
  </g>
  <text x="195" y="48" font-family="'Inter', sans-serif" font-weight="700" font-size="12" fill="#0284C7">0.25 D</text>
  <text x="365" y="48" font-family="'Inter', sans-serif" font-weight="700" font-size="12" fill="#0284C7">0.25 D</text>
</svg>`;
fs.writeFileSync(path.join(mockupsDir, 'logo-do-2.svg'), r2Svg);

const r3Svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 280" width="100%" height="100%">
  <rect width="100%" height="100%" rx="8" fill="#FFFFFF" stroke="#E4E4E7" stroke-width="2"/>
  <g transform="translate(140, 50) scale(0.32)">
    ${bladesGroup}
    ${textRingGroup}
  </g>
  <rect x="350" y="80" width="180" height="32" rx="4" fill="#111315"/>
  <text x="440" y="101" text-anchor="middle" font-family="'Inter', sans-serif" font-weight="700" font-size="12" fill="#FFFFFF">BLOCK #MKG-0824</text>
  <text x="440" y="135" text-anchor="middle" font-family="'Inter', sans-serif" font-weight="600" font-size="12" fill="#059669">4.5:1 CONTRAST ✓</text>
</svg>`;
fs.writeFileSync(path.join(mockupsDir, 'logo-do-3.svg'), r3Svg);

// 11. Logo Don'ts (r4, r5, r6)
const r4Svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 280" width="100%" height="100%">
  <rect width="100%" height="100%" rx="8" fill="#FEF2F2" stroke="#FECACA" stroke-width="1"/>
  <g transform="translate(180, 50) scale(0.55, 0.28)">
    ${bladesGroup}
    ${textRingGroup}
  </g>
  <line x1="160" y1="40" x2="440" y2="240" stroke="#DC2626" stroke-width="4"/>
  <line x1="440" y1="40" x2="160" y2="240" stroke="#DC2626" stroke-width="4"/>
</svg>`;
fs.writeFileSync(path.join(mockupsDir, 'logo-dont-1.svg'), r4Svg);

const r5Svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 280" width="100%" height="100%">
  <defs>
    <linearGradient id="neonGlow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF007A"/>
      <stop offset="100%" stop-color="#00F0FF"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" rx="8" fill="#FEF2F2" stroke="#FECACA" stroke-width="1"/>
  <g transform="translate(225, 45) scale(0.33)" fill="url(#neonGlow)">
    ${bladesGroup.replace(/<g>/g, '').replace(/<\/g>/g, '')}
    ${textRingGroup.replace(/<g>/g, '').replace(/<\/g>/g, '')}
  </g>
  <line x1="160" y1="40" x2="440" y2="240" stroke="#DC2626" stroke-width="4"/>
  <line x1="440" y1="40" x2="160" y2="240" stroke="#DC2626" stroke-width="4"/>
</svg>`;
fs.writeFileSync(path.join(mockupsDir, 'logo-dont-2.svg'), r5Svg);

const r6Svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 280" width="100%" height="100%">
  <rect width="100%" height="100%" rx="8" fill="#D1D5DB"/>
  <path d="M 0 50 Q 200 120 400 30 T 600 180" fill="none" stroke="#4B5563" stroke-width="12" opacity="0.6"/>
  <path d="M 0 200 Q 300 100 600 260" fill="none" stroke="#1F2937" stroke-width="16" opacity="0.5"/>
  <g transform="translate(225, 45) scale(0.33)" fill="#374151">
    ${bladesGroup.replace(/<g>/g, '').replace(/<\/g>/g, '')}
    ${textRingGroup.replace(/<g>/g, '').replace(/<\/g>/g, '')}
  </g>
  <line x1="160" y1="40" x2="440" y2="240" stroke="#DC2626" stroke-width="4"/>
  <line x1="440" y1="40" x2="160" y2="240" stroke="#DC2626" stroke-width="4"/>
</svg>`;
fs.writeFileSync(path.join(mockupsDir, 'logo-dont-3.svg'), r6Svg);

// 12. Slide 54 Replacement Mockups (Architectural Book, Brochure, Poster, Magazine)
const bookSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 1200" width="100%" height="100%">
  <rect width="100%" height="100%" rx="16" fill="#181A1D"/>
  <line x1="60" y1="0" x2="60" y2="1200" stroke="#2C3035" stroke-width="8"/>
  <g transform="translate(300, 360) scale(0.53)" fill="#A67C52">
    ${bladesGroup.replace(/<g>/g, '').replace(/<\/g>/g, '')}
    ${textRingGroup.replace(/<g>/g, '').replace(/<\/g>/g, '')}
  </g>
  <text x="450" y="720" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="44" letter-spacing="4" fill="#F5F4F0">VENGO GRANITES</text>
  <text x="450" y="780" text-anchor="middle" font-family="'Inter', sans-serif" font-weight="600" font-size="20" letter-spacing="6" fill="#A67C52">ARCHITECTURAL SPECIFICATION MANUAL</text>
  <line x1="330" y1="820" x2="570" y2="820" stroke="#A67C52" stroke-width="2"/>
  <text x="450" y="870" text-anchor="middle" font-family="'Inter', sans-serif" font-weight="500" font-size="16" letter-spacing="3" fill="#6B7280">VOL. I · MALKANGIRI ABSOLUTE BLACK</text>
</svg>`;
fs.writeFileSync(path.join(mockupsDir, 'mockup-book.svg'), bookSvg);

const brochureSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="100%" height="100%">
  <rect width="100%" height="100%" rx="8" fill="#F4F4F5"/>
  <rect x="0" y="0" width="800" height="380" fill="#141619"/>
  <g transform="translate(60, 50) scale(0.35)" fill="#FFFFFF">
    ${bladesGroup.replace(/<g>/g, '').replace(/<\/g>/g, '')}
    ${textRingGroup.replace(/<g>/g, '').replace(/<\/g>/g, '')}
  </g>
  <text x="60" y="300" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="36" fill="#FFFFFF">MALKANGIRI LEASE</text>
  <text x="60" y="340" font-family="'Inter', sans-serif" font-weight="600" font-size="16" letter-spacing="4" fill="#A67C52">19.25 HECTARES SINGLE-DEPOSIT SPEC SHEET</text>
  
  <rect x="60" y="440" width="680" height="90" rx="6" fill="#FFFFFF" stroke="#E4E4E7"/>
  <text x="90" y="480" font-family="'Inter', sans-serif" font-weight="700" font-size="18" fill="#111315">Density &amp; Water Absorption</text>
  <text x="90" y="505" font-family="'Inter', sans-serif" font-weight="500" font-size="14" fill="#6B7280">3.05 g/cm³ · &lt; 0.08% porosity</text>

  <rect x="60" y="560" width="680" height="90" rx="6" fill="#FFFFFF" stroke="#E4E4E7"/>
  <text x="90" y="600" font-family="'Inter', sans-serif" font-weight="700" font-size="18" fill="#111315">Direct Port Logistics</text>
  <text x="90" y="625" font-family="'Inter', sans-serif" font-weight="500" font-size="14" fill="#6B7280">Kakinada &amp; Visakhapatnam export berths</text>
</svg>`;
fs.writeFileSync(path.join(mockupsDir, 'mockup-brochure.svg'), brochureSvg);

const posterSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1100" width="100%" height="100%">
  <rect width="100%" height="100%" fill="#0E1012"/>
  <rect x="150" y="180" width="500" height="620" fill="#181A1D" stroke="#2C3035" stroke-width="2"/>
  <g transform="translate(320, 360) scale(0.28)" fill="#A67C52">
    ${bladesGroup.replace(/<g>/g, '').replace(/<\/g>/g, '')}
    ${textRingGroup.replace(/<g>/g, '').replace(/<\/g>/g, '')}
  </g>
  <text x="400" y="580" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="28" letter-spacing="3" fill="#FFFFFF">ABSOLUTE PERMANENCE</text>
  <text x="400" y="920" text-anchor="middle" font-family="'Inter', sans-serif" font-weight="700" font-size="20" letter-spacing="6" fill="#A67C52">VENGO GRANITES</text>
  <text x="400" y="960" text-anchor="middle" font-family="'Inter', sans-serif" font-weight="500" font-size="14" letter-spacing="4" fill="#6B7280">ENGINEERED BY EARTH · MASTERED IN MALKANGIRI</text>
</svg>`;
fs.writeFileSync(path.join(mockupsDir, 'mockup-poster.svg'), posterSvg);

const magazineSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 900" width="100%" height="100%">
  <rect width="100%" height="100%" fill="#F5F4F0"/>
  <line x1="700" y1="0" x2="700" y2="900" stroke="#E4E4E7" stroke-width="4"/>
  <text x="100" y="160" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="44" fill="#111315">THE SOVEREIGN MONOLITH</text>
  <text x="100" y="210" font-family="'Inter', sans-serif" font-weight="600" font-size="18" letter-spacing="3" fill="#A67C52">ARCHITECTURAL NATURAL STONE REPORT</text>
  <rect x="100" y="270" width="500" height="360" rx="8" fill="#141619"/>
  <g transform="translate(260, 360) scale(0.32)" fill="#FFFFFF">
    ${bladesGroup.replace(/<g>/g, '').replace(/<\/g>/g, '')}
    ${textRingGroup.replace(/<g>/g, '').replace(/<\/g>/g, '')}
  </g>
  <text x="100" y="700" font-family="'Inter', sans-serif" font-weight="400" font-size="16" fill="#4B5563">"Malkangiri's single-deposit Absolute Black provides zero shade mismatch across monumental facade installations worldwide."</text>

  <rect x="800" y="120" width="500" height="660" rx="8" fill="#181A1D"/>
  <text x="850" y="200" font-family="'Plus Jakarta Sans', sans-serif" font-weight="700" font-size="28" fill="#FFFFFF">Specification Data</text>
  <line x1="850" y1="230" x2="1250" y2="230" stroke="#A67C52" stroke-width="2"/>
  <text x="850" y="290" font-family="'Inter', sans-serif" font-weight="500" font-size="16" fill="#9CA3AF">Density: 3.05 g/cm³</text>
  <text x="850" y="340" font-family="'Inter', sans-serif" font-weight="500" font-size="16" fill="#9CA3AF">Compressive Strength: 240 MPa</text>
  <text x="850" y="390" font-family="'Inter', sans-serif" font-weight="500" font-size="16" fill="#9CA3AF">Flexural Strength: 18.5 MPa</text>
  <text x="850" y="440" font-family="'Inter', sans-serif" font-weight="500" font-size="16" fill="#9CA3AF">Water Absorption: 0.08%</text>
  <text x="850" y="490" font-family="'Inter', sans-serif" font-weight="500" font-size="16" fill="#9CA3AF">Quarry: 19.25 Hectares, Malkangiri</text>
</svg>`;
fs.writeFileSync(path.join(mockupsDir, 'mockup-magazine.svg'), magazineSvg);

console.log("ALL 16 BRAND SVG ASSETS GENERATED SUCCESSFULLY!");
