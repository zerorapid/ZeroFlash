import React from 'react';
import { Camera, Sparkles, ExternalLink } from 'lucide-react';
import type { BrandState } from '../../types/brandbook';

interface SmartMockupProps {
  id: string;
  label: string;
  brand: BrandState;
  style?: React.CSSProperties;
  className?: string;
  onUploadClick?: () => void;
}

export const SmartMockupRenderer: React.FC<SmartMockupProps> = ({
  id,
  label,
  brand,
  style,
  className = '',
  onUploadClick,
}) => {
  const accent = brand.accent || '#F59E0B';
  const name = brand.name || 'Brand';
  const logo = brand.logo;
  const headlineFont = brand.hf || 'Inter';
  const bodyFont = brand.bf || 'Inter';

  // Render specific mockup based on placeholder ID
  const renderMockupContent = () => {
    switch (id) {
      // -------------------------------------------------------------
      // 1. BUSINESS CARDS STACK (Slide 48 - Stationery)
      // -------------------------------------------------------------
      case 'm_card':
        return (
          <div className="relative w-full h-full bg-[#181A20] overflow-hidden flex items-center justify-center p-4 select-none">
            {/* Subtle background ambient studio lighting */}
            <div
              className="absolute inset-0 opacity-25 pointer-events-none"
              style={{
                background: `radial-gradient(circle at 65% 35%, ${accent}33 0%, transparent 70%)`,
              }}
            />

            {/* Isometric / Layered Cards Stack */}
            <div className="relative w-48 h-28 transform -rotate-6 transition-transform duration-500 hover:rotate-0">
              {/* Bottom Card (Underlying Stack Shadow) */}
              <div
                className="absolute inset-0 rounded-lg bg-zinc-800 shadow-2xl translate-y-3 translate-x-2 border-r-2"
                style={{ borderRightColor: accent }}
              />
              <div
                className="absolute inset-0 rounded-lg bg-zinc-700 shadow-xl translate-y-1.5 translate-x-1 border-r-2"
                style={{ borderRightColor: accent }}
              />

              {/* Main Active Luxury Business Card (600gsm Cotton Stock) */}
              <div
                className="absolute inset-0 rounded-lg bg-zinc-900 border border-white/10 shadow-2xl p-3.5 flex flex-col justify-between overflow-hidden"
                style={{
                  boxShadow: '0 20px 35px -10px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.1)',
                }}
              >
                {/* Accent Painted Edge Indicator */}
                <div
                  className="absolute right-0 top-0 bottom-0 w-1.5"
                  style={{ backgroundColor: accent }}
                />

                {/* Top: Brand Logo / Mark */}
                <div className="flex items-center justify-between">
                  {logo ? (
                    <img src={logo} alt={name} className="h-5 w-auto max-w-[80px] object-contain filter brightness-110" />
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <div
                        className="w-4 h-4 rounded-sm flex items-center justify-center text-[9px] font-bold text-black"
                        style={{ backgroundColor: accent }}
                      >
                        {name.charAt(0)}
                      </div>
                      <span className="text-[11px] font-bold text-white tracking-tight" style={{ fontFamily: headlineFont }}>
                        {name}
                      </span>
                    </div>
                  )}
                  <span className="text-[7.5px] uppercase tracking-widest text-zinc-400 font-mono">EST. 2026</span>
                </div>

                {/* Bottom: Luxury Contact Micro-Typography */}
                <div className="space-y-0.5">
                  <div className="text-[9.5px] font-bold text-white tracking-tight">Jayapal Reddy</div>
                  <div className="text-[7px] text-zinc-400 font-medium" style={{ fontFamily: bodyFont }}>
                    Founder & Principal Director
                  </div>
                  <div className="pt-1 flex items-center gap-2 text-[6.5px] text-zinc-400 font-mono">
                    <span>hello@{name.toLowerCase().replace(/[^a-z0-9]/g, '') || 'studio'}.com</span>
                    <span>•</span>
                    <span>+1 (555) 019-2831</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Badge Indicator */}
            <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-[8px] text-zinc-300 border border-white/10">
              <Sparkles className="w-2.5 h-2.5 text-amber-400" />
              <span>Smart Mockup · 600gsm Painted Edge</span>
            </div>
          </div>
        );

      // -------------------------------------------------------------
      // 2. CORPORATE LETTERHEAD (Slide 48 - Stationery)
      // -------------------------------------------------------------
      case 'm_letter':
        return (
          <div className="relative w-full h-full bg-[#1A1D24] overflow-hidden flex items-center justify-center p-3 select-none">
            {/* Realistic A4 Paper Sheet with Drop Shadow & Grain */}
            <div
              className="relative w-44 h-56 bg-[#FDFCF7] rounded-sm p-4 flex flex-col justify-between shadow-2xl border border-black/5"
              style={{
                boxShadow: '0 25px 40px -15px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,0,0,0.03)',
              }}
            >
              {/* Header Accent Bar */}
              <div
                className="absolute top-0 left-0 right-0 h-1"
                style={{ backgroundColor: accent }}
              />

              {/* Letterhead Header */}
              <div>
                <div className="flex items-center justify-between pb-2.5 border-b border-zinc-200">
                  {logo ? (
                    <img src={logo} alt={name} className="h-4 w-auto max-w-[70px] object-contain" />
                  ) : (
                    <span className="text-[10px] font-black tracking-tight text-zinc-900" style={{ fontFamily: headlineFont }}>
                      {name}
                    </span>
                  )}
                  <div className="text-right text-[6px] text-zinc-400 font-mono leading-tight">
                    <div>100 INNOVATION WAY</div>
                    <div>SUITE 400 · HYDERABAD</div>
                  </div>
                </div>

                {/* Date & Recipient */}
                <div className="pt-3 text-[6.5px] text-zinc-500 font-mono space-y-0.5">
                  <div>DATE: NOVEMBER 20, 2026</div>
                  <div>TO: EXECUTIVE BOARD & PARTNERS</div>
                </div>

                {/* Realistic Body Lines (Swiss Grid Simulation) */}
                <div className="pt-3 space-y-1.5">
                  <div className="h-1.5 w-11/12 bg-zinc-200/90 rounded-xs" />
                  <div className="h-1.5 w-full bg-zinc-200/80 rounded-xs" />
                  <div className="h-1.5 w-4/5 bg-zinc-200/70 rounded-xs" />
                  <div className="h-1.5 w-10/12 bg-zinc-200/80 rounded-xs" />
                  <div className="h-1.5 w-3/4 bg-zinc-200/60 rounded-xs" />
                </div>
              </div>

              {/* Letterhead Footer */}
              <div className="pt-2 border-t border-zinc-200 flex items-center justify-between text-[6px] text-zinc-400 font-mono">
                <span>CONFIDENTIAL & PROPRIETARY</span>
                <span>{brand.url || `WWW.${name.toUpperCase().replace(/[^A-Z0-9]/g, '')}.COM`}</span>
              </div>
            </div>

            {/* Badge Indicator */}
            <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-[8px] text-zinc-300 border border-white/10">
              <Sparkles className="w-2.5 h-2.5 text-amber-400" />
              <span>Smart Mockup · Swiss A4 Letterhead</span>
            </div>
          </div>
        );

      // -------------------------------------------------------------
      // 3. EXECUTIVE ENVELOPE (Slide 48 - Stationery)
      // -------------------------------------------------------------
      case 'm_env':
        return (
          <div className="relative w-full h-full bg-[#181A20] overflow-hidden flex items-center justify-center p-3 select-none">
            {/* C6 Landscape Envelope */}
            <div
              className="relative w-52 h-28 bg-[#252830] rounded-md border border-white/10 p-3 flex flex-col justify-between shadow-2xl overflow-hidden"
              style={{
                boxShadow: '0 20px 35px -10px rgba(0,0,0,0.7)',
              }}
            >
              {/* Flap Simulation Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" preserveAspectRatio="none">
                <line x1="0" y1="0" x2="50%" y2="60%" stroke="#FFFFFF" strokeWidth="1" />
                <line x1="100%" y1="0" x2="50%" y2="60%" stroke="#FFFFFF" strokeWidth="1" />
              </svg>

              {/* Embossed Brand Monogram Seal */}
              <div className="flex items-center justify-between z-10">
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center shadow-lg border border-white/20 text-white font-bold text-[9px]"
                    style={{ backgroundColor: accent }}
                  >
                    {name.charAt(0)}
                  </div>
                  <span className="text-[9px] font-bold text-white tracking-tight">{name}</span>
                </div>
                <span className="text-[6.5px] uppercase font-mono tracking-widest text-zinc-500">AIRMAIL / COURIER</span>
              </div>

              {/* Recipient Window / Stamps */}
              <div className="z-10 flex items-end justify-between">
                <div className="text-[6.5px] text-zinc-400 font-mono space-y-0.5">
                  <div className="w-24 h-1 bg-white/20 rounded-xs" />
                  <div className="w-20 h-1 bg-white/15 rounded-xs" />
                </div>
                <div
                  className="w-5 h-6 rounded-xs border border-dashed flex items-center justify-center text-[6px] font-mono text-zinc-400"
                  style={{ borderColor: `${accent}88` }}
                >
                  STAMP
                </div>
              </div>
            </div>

            {/* Badge Indicator */}
            <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-[8px] text-zinc-300 border border-white/10">
              <Sparkles className="w-2.5 h-2.5 text-amber-400" />
              <span>Smart Mockup · Executive C6 Envelope</span>
            </div>
          </div>
        );

      // -------------------------------------------------------------
      // 4. STUDIO DISPLAY DESKTOP WEB (Slide 49 - Digital)
      // -------------------------------------------------------------
      case 'm_web':
        return (
          <div className="relative w-full h-full bg-[#121316] overflow-hidden flex flex-col items-center justify-center p-3 select-none">
            {/* Studio Display Monitor Chassis */}
            <div
              className="relative w-11/12 max-w-[340px] aspect-[16/10] bg-[#1C1E24] rounded-lg border border-white/15 shadow-2xl flex flex-col overflow-hidden"
              style={{
                boxShadow: '0 30px 60px -15px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.08)',
              }}
            >
              {/* Safari / macOS Chrome Header */}
              <div className="h-5 bg-[#252830] border-b border-black/30 px-2 flex items-center justify-between flex-shrink-0">
                {/* 3 Window Dots */}
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FF5F56]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FFBD2E]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#27C93F]" />
                </div>
                {/* URL Pill */}
                <div className="bg-[#181A20] px-3 py-0.5 rounded text-[7px] text-zinc-400 font-mono flex items-center gap-1 border border-white/5">
                  <span className="text-emerald-400">https://</span>
                  <span>{brand.url ? brand.url.replace(/^https?:\/\//, '') : `${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`}</span>
                </div>
                <div className="w-8" />
              </div>

              {/* Website Landing Screen Content */}
              <div className="flex-1 bg-[#0E1015] p-3 flex flex-col justify-between overflow-hidden relative">
                {/* Subtle Hero Glow */}
                <div
                  className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-20 pointer-events-none filter blur-2xl"
                  style={{ backgroundColor: accent }}
                />

                {/* Nav */}
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-1.5">
                    {logo ? (
                      <img src={logo} alt={name} className="h-3 w-auto max-w-[50px] object-contain" />
                    ) : (
                      <span className="text-[8.5px] font-black text-white" style={{ fontFamily: headlineFont }}>
                        {name}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[6.5px] text-zinc-400 font-medium">
                    <span>Products</span>
                    <span>Solutions</span>
                    <span>Docs</span>
                    <span
                      className="px-1.5 py-0.5 rounded text-black font-bold text-[6px]"
                      style={{ backgroundColor: accent }}
                    >
                      Launch
                    </span>
                  </div>
                </div>

                {/* Hero Pitch */}
                <div className="my-auto py-1 relative z-10">
                  <div
                    className="inline-block text-[6px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded mb-1 border"
                    style={{
                      color: accent,
                      backgroundColor: `${accent}15`,
                      borderColor: `${accent}33`,
                    }}
                  >
                    Enterprise 2.0 Released
                  </div>
                  <h3
                    className="text-[12px] font-extrabold text-white leading-tight tracking-tight max-w-[200px]"
                    style={{ fontFamily: headlineFont }}
                  >
                    {brand.tagline || `Next-generation infrastructure engineered for ${name}.`}
                  </h3>
                  <p className="text-[6.5px] text-zinc-400 mt-1 max-w-[180px] line-clamp-2">
                    {brand.desc || 'High-performance real-time streaming architecture with zero latency.'}
                  </p>
                </div>

                {/* CTA Row */}
                <div className="flex items-center gap-2 relative z-10 pt-1">
                  <button
                    type="button"
                    className="px-2 py-1 rounded text-[7px] font-bold text-black shadow-md flex items-center gap-1"
                    style={{ backgroundColor: accent }}
                  >
                    <span>Start Free Trial</span>
                    <ExternalLink className="w-2 h-2" />
                  </button>
                  <span className="text-[6.5px] text-zinc-500 font-mono">No credit card required</span>
                </div>
              </div>
            </div>

            {/* Aluminum Stand */}
            <div className="w-12 h-2.5 bg-gradient-to-b from-[#2E323B] to-[#1C1E24] rounded-t-xs -mt-0.5 shadow-md" />
            <div className="w-20 h-1 bg-[#3A3F4B] rounded-full shadow-lg" />

            {/* Badge Indicator */}
            <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-[8px] text-zinc-300 border border-white/10">
              <Sparkles className="w-2.5 h-2.5 text-amber-400" />
              <span>Smart Mockup · Studio Display Web Hero</span>
            </div>
          </div>
        );

      // -------------------------------------------------------------
      // 5. IPHONE 16 PRO MOBILE APP (Slide 49 - Digital)
      // -------------------------------------------------------------
      case 'm_app':
        return (
          <div className="relative w-full h-full bg-[#121316] overflow-hidden flex items-center justify-center p-3 select-none">
            {/* iPhone 16 Pro Chassis with Titanium Bezel */}
            <div
              className="relative w-36 aspect-[9/19.5] bg-[#000000] rounded-[24px] border-[3px] border-[#383B42] shadow-2xl flex flex-col overflow-hidden"
              style={{
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.1)',
              }}
            >
              {/* Status Bar & Dynamic Island */}
              <div className="pt-2 px-3 flex items-center justify-between relative z-20">
                <span className="text-[7px] font-bold text-white font-mono">9:41</span>
                {/* Dynamic Island Pill */}
                <div className="w-11 h-2.5 bg-black rounded-full border border-zinc-800 flex items-center justify-end pr-1">
                  <div className="w-1 h-1 rounded-full bg-blue-900/60" />
                </div>
                <div className="flex items-center gap-1 text-[6.5px] text-zinc-300">
                  <span>5G</span>
                  <div className="w-2.5 h-1.5 border border-zinc-400 rounded-xs p-0.5">
                    <div className="w-full h-full bg-white rounded-xs" />
                  </div>
                </div>
              </div>

              {/* In-App Screen Content */}
              <div className="flex-1 p-2.5 flex flex-col justify-between text-white">
                {/* App Header */}
                <div className="pt-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[6.5px] uppercase tracking-wider text-zinc-400 font-mono">WORKSPACE</div>
                      <div className="text-[9.5px] font-black tracking-tight" style={{ fontFamily: headlineFont }}>
                        {name}
                      </div>
                    </div>
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center text-[7.5px] font-bold text-black"
                      style={{ backgroundColor: accent }}
                    >
                      {name.charAt(0)}
                    </div>
                  </div>

                  {/* Stat / Metric Card */}
                  <div
                    className="mt-2 p-2 rounded-xl border border-white/10"
                    style={{
                      background: `linear-gradient(135deg, ${accent}22 0%, #181A20 100%)`,
                    }}
                  >
                    <div className="text-[6px] text-zinc-400 font-mono">ACTIVE BALANCE</div>
                    <div className="text-[12px] font-black text-white tracking-tight mt-0.5">$148,920.00</div>
                    <div className="flex items-center gap-1 text-[6.5px] text-emerald-400 mt-1 font-mono">
                      <span>↑ +18.4%</span>
                      <span className="text-zinc-500">vs last month</span>
                    </div>
                  </div>

                  {/* Quick Activity Rows */}
                  <div className="mt-2 space-y-1">
                    <div className="bg-zinc-900/90 p-1.5 rounded-lg border border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: accent }}
                        />
                        <span className="text-[7px] font-medium text-zinc-200">Production API</span>
                      </div>
                      <span className="text-[6.5px] font-mono text-emerald-400">99.99%</span>
                    </div>
                    <div className="bg-zinc-900/90 p-1.5 rounded-lg border border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-zinc-500" />
                        <span className="text-[7px] font-medium text-zinc-200">Global Sync</span>
                      </div>
                      <span className="text-[6.5px] font-mono text-zinc-400">4ms</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Home Indicator */}
                <div className="pb-1 pt-2 flex flex-col items-center">
                  <div className="w-10 h-1 bg-white/40 rounded-full" />
                </div>
              </div>
            </div>

            {/* Badge Indicator */}
            <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-[8px] text-zinc-300 border border-white/10">
              <Sparkles className="w-2.5 h-2.5 text-amber-400" />
              <span>Smart Mockup · iPhone 16 Pro</span>
            </div>
          </div>
        );

      // -------------------------------------------------------------
      // 6. APPAREL & T-SHIRT (Slide 51 - Apparel)
      // -------------------------------------------------------------
      case 'm_tshirt':
      case 'm_hoodie':
        return (
          <div className="relative w-full h-full bg-[#181A20] overflow-hidden flex items-center justify-center p-3 select-none">
            {/* T-Shirt / Hoodie Garment Vector Silhouette */}
            <div className="relative w-36 h-44 flex items-center justify-center">
              <svg viewBox="0 0 200 240" className="w-full h-full drop-shadow-2xl">
                {/* Heavyweight Cotton Tee Silhouette */}
                <path
                  d="M 60 20 Q 100 45 140 20 L 190 60 L 165 95 L 145 80 L 145 220 Q 100 230 55 220 L 55 80 L 35 95 L 10 60 Z"
                  fill="#1C1E24"
                  stroke="#2D313A"
                  strokeWidth="2"
                />
                {/* Inner Collar Tag */}
                <path
                  d="M 65 24 Q 100 48 135 24"
                  fill="none"
                  stroke="#383D47"
                  strokeWidth="2"
                />
              </svg>

              {/* Chest Brand Emblem */}
              <div className="absolute top-[28%] flex flex-col items-center justify-center">
                {logo ? (
                  <img src={logo} alt={name} className="h-6 w-auto max-w-[60px] object-contain filter drop-shadow-md brightness-110" />
                ) : (
                  <div className="flex flex-col items-center">
                    <div
                      className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black text-black shadow-lg"
                      style={{ backgroundColor: accent }}
                    >
                      {name.charAt(0)}
                    </div>
                    <span className="text-[7px] font-black tracking-widest uppercase text-white mt-1">
                      {name}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Badge Indicator */}
            <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-[8px] text-zinc-300 border border-white/10">
              <Sparkles className="w-2.5 h-2.5 text-amber-400" />
              <span>Smart Mockup · Heavyweight Cotton</span>
            </div>
          </div>
        );

      // -------------------------------------------------------------
      // 7. LUXURY PACKAGING & BOX (Slide 50 - Packaging)
      // -------------------------------------------------------------
      case 'm_pack':
      case 'm_pack2':
        return (
          <div className="relative w-full h-full bg-[#16181E] overflow-hidden flex items-center justify-center p-3 select-none">
            {/* Rigid Box Isometric Perspective */}
            <div className="relative w-36 h-36 flex items-center justify-center">
              <div
                className="w-28 h-28 rounded-lg bg-zinc-900 border border-white/15 shadow-2xl p-3 flex flex-col justify-between transform -rotate-6 transition-transform hover:rotate-0"
                style={{
                  boxShadow: '0 25px 40px -10px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.1)',
                }}
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: accent }}
                />
                <div className="text-center my-auto">
                  {logo ? (
                    <img src={logo} alt={name} className="h-5 w-auto max-w-[65px] mx-auto object-contain filter brightness-110" />
                  ) : (
                    <div className="text-[10px] font-black tracking-wider text-white uppercase" style={{ fontFamily: headlineFont }}>
                      {name}
                    </div>
                  )}
                  <div className="text-[6px] tracking-widest text-zinc-400 font-mono mt-0.5">LIMITED EDITION</div>
                </div>
                <div className="text-[5.5px] text-zinc-400 font-mono text-center">PACKAGING SYSTEM 01</div>
              </div>
            </div>

            {/* Badge Indicator */}
            <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-[8px] text-zinc-300 border border-white/10">
              <Sparkles className="w-2.5 h-2.5 text-amber-400" />
              <span>Smart Mockup · Rigid Gift Packaging</span>
            </div>
          </div>
        );

      // -------------------------------------------------------------
      // 8. ARCHITECTURAL SIGNAGE (Slide 50 - Signage)
      // -------------------------------------------------------------
      case 'm_sign':
        return (
          <div className="relative w-full h-full bg-[#141519] overflow-hidden flex items-center justify-center p-4 select-none">
            {/* Dark Slate Architectural Wall Facade */}
            <div
              className="relative w-full h-full rounded-md border border-white/10 flex items-center justify-center p-6"
              style={{
                background: 'linear-gradient(180deg, #1A1C22 0%, #111215 100%)',
              }}
            >
              {/* Backlit 3D Dimensional Signage */}
              <div className="relative flex items-center gap-3">
                {/* Glow Backdrop */}
                <div
                  className="absolute inset-0 filter blur-xl opacity-40 pointer-events-none"
                  style={{ backgroundColor: accent }}
                />
                {/* Dimensional Icon */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shadow-2xl border border-white/20 text-black font-black text-lg relative z-10"
                  style={{
                    backgroundColor: accent,
                    boxShadow: `0 10px 25px -5px ${accent}88`,
                  }}
                >
                  {name.charAt(0)}
                </div>
                {/* Dimensional Letters */}
                <div className="relative z-10">
                  <div
                    className="text-xl font-black tracking-tight text-white drop-shadow-lg"
                    style={{ fontFamily: headlineFont }}
                  >
                    {name}
                  </div>
                  <div className="text-[7px] uppercase tracking-widest text-zinc-400 font-mono">
                    GLOBAL HEADQUARTERS
                  </div>
                </div>
              </div>
            </div>

            {/* Badge Indicator */}
            <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-[8px] text-zinc-300 border border-white/10">
              <Sparkles className="w-2.5 h-2.5 text-amber-400" />
              <span>Smart Mockup · Backlit Architectural Sign</span>
            </div>
          </div>
        );

      // -------------------------------------------------------------
      // 9. SOCIAL MEDIA - PROFILE & AVATAR (Slide 50)
      // -------------------------------------------------------------
      case 'm_soc0':
        return (
          <div className="relative w-full h-full bg-[#121316] overflow-hidden flex flex-col items-center justify-center p-3 select-none text-white font-sans">
            <div className="w-full max-w-[220px] bg-[#1C1E24] border border-white/10 rounded-xl p-3 shadow-xl">
              <div className="flex items-center gap-2.5 mb-2.5">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-black text-black text-base shadow-md border-2 border-white/20 flex-shrink-0"
                  style={{ backgroundColor: accent }}
                >
                  {name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-bold text-white truncate flex items-center gap-1">
                    <span>{name.toLowerCase()}</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 text-[7px] text-white flex items-center justify-center">✓</span>
                  </div>
                  <div className="text-[8px] text-zinc-400 truncate">Official Verified Brand</div>
                </div>
              </div>
              <div className="flex justify-around py-1.5 border-y border-white/10 text-center text-[8.5px]">
                <div><div className="font-bold text-white">64</div><div className="text-[7px] text-zinc-400">Posts</div></div>
                <div><div className="font-bold text-white">128K</div><div className="text-[7px] text-zinc-400">Followers</div></div>
                <div><div className="font-bold text-white">24</div><div className="text-[7px] text-zinc-400">Following</div></div>
              </div>
              <div className="mt-2 text-[7.5px] text-zinc-300 leading-tight">
                <span className="font-semibold text-white">{name} Studio</span> — Brand systems, vector guidelines & on-device publishing.
              </div>
            </div>
            <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-[8px] text-zinc-300 border border-white/10">
              <Sparkles className="w-2.5 h-2.5 text-amber-400" />
              <span>Smart Mockup · Social Profile</span>
            </div>
          </div>
        );

      // -------------------------------------------------------------
      // 10. SOCIAL MEDIA - FEED POST (Slide 50)
      // -------------------------------------------------------------
      case 'm_soc1':
        return (
          <div className="relative w-full h-full bg-[#121316] overflow-hidden flex flex-col items-center justify-center p-3 select-none text-white">
            <div className="w-full max-w-[210px] bg-[#1C1E24] border border-white/10 rounded-xl overflow-hidden shadow-xl">
              <div className="flex items-center gap-2 p-2 border-b border-white/10">
                <div className="w-5 h-5 rounded-full text-black font-bold text-[9px] flex items-center justify-center" style={{ backgroundColor: accent }}>
                  {name.charAt(0)}
                </div>
                <div className="text-[9px] font-semibold">{name.toLowerCase()}</div>
              </div>
              <div
                className="w-full h-24 flex flex-col items-center justify-center p-3 text-center relative"
                style={{ background: `linear-gradient(135deg, ${accent}22 0%, #15171C 100%)` }}
              >
                <div className="text-xs font-black tracking-tight" style={{ fontFamily: headlineFont }}>
                  {name}
                </div>
                <div className="text-[7px] text-zinc-400 tracking-widest mt-1 uppercase font-mono">
                  Autonomous Studio System
                </div>
              </div>
              <div className="p-2 space-y-1">
                <div className="flex items-center gap-2 text-[10px] text-zinc-300">
                  <span>❤️ 1,420</span>
                  <span>💬 84</span>
                  <span>↗️</span>
                </div>
                <div className="text-[7.5px] text-zinc-300">
                  <span className="font-bold text-white">{name.toLowerCase()}</span> New visual guidelines live.
                </div>
              </div>
            </div>
            <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-[8px] text-zinc-300 border border-white/10">
              <Sparkles className="w-2.5 h-2.5 text-amber-400" />
              <span>Smart Mockup · Feed Post</span>
            </div>
          </div>
        );

      // -------------------------------------------------------------
      // 11. SOCIAL MEDIA - STORY TEMPLATE (Slide 50)
      // -------------------------------------------------------------
      case 'm_soc2':
        return (
          <div className="relative w-full h-full bg-[#121316] overflow-hidden flex items-center justify-center p-3 select-none text-white">
            <div
              className="w-full max-w-[170px] h-[92%] rounded-2xl border-2 border-white/15 overflow-hidden shadow-2xl flex flex-col justify-between p-3.5 relative"
              style={{
                background: `linear-gradient(180deg, #18191E 0%, ${accent}33 60%, #121316 100%)`,
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded-full text-black font-bold text-[8px] flex items-center justify-center" style={{ backgroundColor: accent }}>
                    {name.charAt(0)}
                  </div>
                  <span className="text-[8.5px] font-bold">{name}</span>
                  <span className="text-[7px] text-zinc-400">3h</span>
                </div>
                <span className="text-[9px] text-zinc-400">•••</span>
              </div>
              <div className="text-center my-auto">
                <div className="text-sm font-black tracking-tight" style={{ fontFamily: headlineFont }}>
                  {name}
                </div>
                <div className="text-[8px] text-zinc-300 mt-1 font-medium">Design Systems 2.0</div>
                <div
                  className="mt-3 inline-block px-3 py-1 rounded-full text-[8px] font-bold text-black shadow-md cursor-pointer"
                  style={{ backgroundColor: accent }}
                >
                  Explore Brand
                </div>
              </div>
              <div className="text-center text-[7px] text-zinc-400 font-mono tracking-wider">
                SWIPE UP TO VIEW GUIDELINES
              </div>
            </div>
            <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-[8px] text-zinc-300 border border-white/10">
              <Sparkles className="w-2.5 h-2.5 text-amber-400" />
              <span>Smart Mockup · Story Frame</span>
            </div>
          </div>
        );

      // -------------------------------------------------------------
      // 12. HIGHWAY BILLBOARD (Slide 56 - Events & Signage)
      // -------------------------------------------------------------
      case 'm_billboard':
        return (
          <div className="relative w-full h-full bg-[#111215] overflow-hidden flex flex-col items-center justify-center p-3 select-none text-white">
            <div className="w-full max-w-[280px] bg-[#1A1C22] border-4 border-zinc-700/80 rounded-sm shadow-2xl p-4 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full filter blur-xl pointer-events-none" />
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded flex items-center justify-center font-black text-black text-xs" style={{ backgroundColor: accent }}>
                    {name.charAt(0)}
                  </div>
                  <span className="text-xs font-black tracking-wider uppercase font-mono">{name}</span>
                </div>
                <span className="text-[8px] font-mono text-zinc-400 border border-zinc-600 px-1 py-0.5 rounded">OUTDOOR IMPACT</span>
              </div>
              <div className="text-base font-black tracking-tight my-1 text-white" style={{ fontFamily: headlineFont }}>
                Clear thinking for a moving world.
              </div>
              <div className="text-[8px] text-zinc-400 mt-1 flex items-center justify-between">
                <span>{name.toLowerCase()}.com</span>
                <span className="font-mono text-[7px] text-zinc-500">BILLBOARD 14×48 FT</span>
              </div>
            </div>
            {/* Billboard Pillars */}
            <div className="w-4 h-6 bg-zinc-800 border-x border-zinc-700 shadow-md -mt-1" />
            <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-[8px] text-zinc-300 border border-white/10">
              <Sparkles className="w-2.5 h-2.5 text-amber-400" />
              <span>Smart Mockup · Urban Billboard</span>
            </div>
          </div>
        );

      // -------------------------------------------------------------
      // 13. ROLL-UP EXHIBITION BANNER (Slide 56 - Events)
      // -------------------------------------------------------------
      case 'm_rollup':
        return (
          <div className="relative w-full h-full bg-[#111215] overflow-hidden flex items-center justify-center p-3 select-none text-white">
            <div className="w-24 h-[94%] bg-[#1E2026] border border-white/15 rounded-t shadow-2xl flex flex-col justify-between p-2 text-center relative">
              <div className="w-6 h-6 rounded-md mx-auto flex items-center justify-center text-black font-black text-xs shadow-md mt-1" style={{ backgroundColor: accent }}>
                {name.charAt(0)}
              </div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-tight text-white" style={{ fontFamily: headlineFont }}>
                  {name}
                </div>
                <div className="text-[6px] text-zinc-400 font-mono mt-0.5">EXPO BANNER</div>
              </div>
              <div className="text-[5.5px] text-zinc-400 border-t border-white/10 pt-1 font-mono">
                {name.toLowerCase()}.com
              </div>
            </div>
            <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-[8px] text-zinc-300 border border-white/10">
              <Sparkles className="w-2.5 h-2.5 text-amber-400" />
              <span>Smart Mockup · Roll-up Banner</span>
            </div>
          </div>
        );

      // -------------------------------------------------------------
      // 14. VEHICLE LIVERY - VAN WRAP (Slide 57 - Vehicle & Outdoor)
      // -------------------------------------------------------------
      case 'm_van':
        return (
          <div className="relative w-full h-full bg-[#111215] overflow-hidden flex items-center justify-center p-3 select-none text-white">
            {/* Styled Modern Van Silhouette Body */}
            <div className="relative w-full max-w-[260px] h-28 bg-[#1E2128] border border-white/20 rounded-tr-[32px] rounded-tl-lg shadow-2xl p-3 flex flex-col justify-between overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center text-black font-black text-xs shadow-md" style={{ backgroundColor: accent }}>
                    {name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-xs font-black tracking-tight" style={{ fontFamily: headlineFont }}>{name}</div>
                    <div className="text-[7px] text-zinc-400 font-mono">FLEET SERVICE</div>
                  </div>
                </div>
                {/* Cab Window */}
                <div className="w-12 h-6 bg-blue-900/30 border border-blue-400/30 rounded-tr-xl rounded-tl-sm" />
              </div>
              <div className="flex justify-between items-end">
                <div className="text-[7.5px] font-mono text-zinc-400">RAPID LOGISTICS & DISPATCH</div>
                {/* Wheels */}
                <div className="flex gap-16 mr-2">
                  <div className="w-6 h-6 rounded-full bg-zinc-900 border-2 border-zinc-600 flex items-center justify-center shadow-inner">
                    <div className="w-2 h-2 rounded-full bg-zinc-400" />
                  </div>
                  <div className="w-6 h-6 rounded-full bg-zinc-900 border-2 border-zinc-600 flex items-center justify-center shadow-inner">
                    <div className="w-2 h-2 rounded-full bg-zinc-400" />
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-[8px] text-zinc-300 border border-white/10">
              <Sparkles className="w-2.5 h-2.5 text-amber-400" />
              <span>Smart Mockup · Van Livery Wrap</span>
            </div>
          </div>
        );

      // -------------------------------------------------------------
      // 15. TRANSIT BUS ADVERTISEMENT (Slide 57 - Vehicle)
      // -------------------------------------------------------------
      case 'm_bus':
        return (
          <div className="relative w-full h-full bg-[#111215] overflow-hidden flex items-center justify-center p-3 select-none text-white">
            <div className="w-full max-w-[240px] h-24 bg-[#1A1C22] border-2 border-zinc-700 rounded-lg p-3 flex flex-col justify-between shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded flex items-center justify-center text-black font-black text-xs" style={{ backgroundColor: accent }}>
                    {name.charAt(0)}
                  </div>
                  <span className="text-[11px] font-bold tracking-tight">{name}</span>
                </div>
                <span className="text-[7px] text-zinc-400 font-mono">TRANSIT MEDIA</span>
              </div>
              <div className="text-xs font-black tracking-tight text-white my-auto" style={{ fontFamily: headlineFont }}>
                Design Sovereign. Build Faster.
              </div>
              <div className="text-[7px] text-zinc-400 font-mono flex justify-between">
                <span>{name.toLowerCase()}.com</span>
                <span>BUS AD 30×144</span>
              </div>
            </div>
            <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-[8px] text-zinc-300 border border-white/10">
              <Sparkles className="w-2.5 h-2.5 text-amber-400" />
              <span>Smart Mockup · Bus Transit Banner</span>
            </div>
          </div>
        );

      // -------------------------------------------------------------
      // 16. STOREFRONT SIGNAGE (Slide 57 - Vehicle & Outdoor)
      // -------------------------------------------------------------
      case 'm_storefront':
      case 'm_booth':
        return (
          <div className="relative w-full h-full bg-[#101114] overflow-hidden flex items-center justify-center p-3 select-none text-white">
            <div className="w-full max-w-[260px] h-32 bg-[#1A1D24] border border-white/15 rounded-lg p-4 flex flex-col justify-between shadow-2xl relative">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md flex items-center justify-center text-black font-black text-xs shadow-md" style={{ backgroundColor: accent }}>
                    {name.charAt(0)}
                  </div>
                  <span className="text-sm font-black tracking-wider uppercase" style={{ fontFamily: headlineFont }}>{name}</span>
                </div>
                <span className="text-[7px] font-mono text-zinc-400 bg-black/40 px-1.5 py-0.5 rounded">FLAGSHIP STORE</span>
              </div>
              <div className="flex gap-2 h-12">
                <div className="flex-1 bg-black/30 rounded border border-white/10 flex items-center justify-center text-[8px] text-zinc-400">Glass Display</div>
                <div className="flex-1 bg-black/30 rounded border border-white/10 flex items-center justify-center text-[8px] text-zinc-400">Entrance Portal</div>
              </div>
            </div>
            <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-[8px] text-zinc-300 border border-white/10">
              <Sparkles className="w-2.5 h-2.5 text-amber-400" />
              <span>Smart Mockup · Flagship Storefront</span>
            </div>
          </div>
        );

      // -------------------------------------------------------------
      // 17. PRODUCT BOX PACKAGING (Slide 58 - Packaging System)
      // -------------------------------------------------------------
      case 'm_box':
        return (
          <div className="relative w-full h-full bg-[#121316] overflow-hidden flex items-center justify-center p-3 select-none text-white">
            <div
              className="w-36 h-36 rounded-xl border border-white/20 shadow-2xl flex flex-col justify-between p-3.5 relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, #1E2128 0%, #131418 100%)`,
                boxShadow: `0 20px 40px -10px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)`,
              }}
            >
              <div className="flex justify-between items-start">
                <div className="w-6 h-6 rounded-md flex items-center justify-center text-black font-black text-xs shadow-md" style={{ backgroundColor: accent }}>
                  {name.charAt(0)}
                </div>
                <span className="text-[6.5px] font-mono text-zinc-400 tracking-widest uppercase">PREMIUM HARDWARE</span>
              </div>
              <div className="text-center my-auto">
                <div className="text-sm font-black tracking-tight" style={{ fontFamily: headlineFont }}>{name}</div>
                <div className="text-[7px] text-zinc-400 font-mono mt-0.5">SERIES 01 · 2026</div>
              </div>
              <div className="text-[6px] text-zinc-500 font-mono flex justify-between border-t border-white/10 pt-1">
                <span>MATTE FINISH</span>
                <span>FOIL EMBOSSED</span>
              </div>
            </div>
            <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-[8px] text-zinc-300 border border-white/10">
              <Sparkles className="w-2.5 h-2.5 text-amber-400" />
              <span>Smart Mockup · Rigid Product Box</span>
            </div>
          </div>
        );

      // -------------------------------------------------------------
      // 18. BOTTLE / CONTAINER (Slide 58 - Packaging System)
      // -------------------------------------------------------------
      case 'm_bottle':
        return (
          <div className="relative w-full h-full bg-[#121316] overflow-hidden flex items-center justify-center p-3 select-none text-white">
            <div className="w-20 h-[90%] bg-zinc-900 border border-white/20 rounded-2xl shadow-2xl flex flex-col justify-between p-2 text-center relative overflow-hidden">
              {/* Metallic Cap */}
              <div className="w-10 h-3 bg-zinc-600 rounded-t-md mx-auto -mt-2 border-b border-zinc-700 shadow-md" />
              <div className="my-auto">
                <div className="w-6 h-6 rounded-full mx-auto flex items-center justify-center text-black font-black text-xs shadow-md mb-1.5" style={{ backgroundColor: accent }}>
                  {name.charAt(0)}
                </div>
                <div className="text-[9px] font-black tracking-tight" style={{ fontFamily: headlineFont }}>{name}</div>
                <div className="text-[6px] text-zinc-400 font-mono mt-0.5">ORGANIC EXTRACT</div>
              </div>
              <div className="text-[5.5px] text-zinc-500 font-mono border-t border-white/10 pt-1">
                500 ML / 16.9 FL OZ
              </div>
            </div>
            <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-[8px] text-zinc-300 border border-white/10">
              <Sparkles className="w-2.5 h-2.5 text-amber-400" />
              <span>Smart Mockup · Matte Bottle</span>
            </div>
          </div>
        );

      // -------------------------------------------------------------
      // 19. LUXURY SHOPPING BAG (Slide 58 - Packaging System)
      // -------------------------------------------------------------
      case 'm_bag':
        return (
          <div className="relative w-full h-full bg-[#121316] overflow-hidden flex flex-col items-center justify-center p-3 select-none text-white">
            {/* Cord Handles */}
            <div className="w-12 h-6 border-2 border-zinc-500 rounded-t-full -mb-1 z-10" />
            <div className="w-36 h-28 bg-[#1B1D24] border border-white/15 rounded shadow-2xl flex flex-col justify-between p-3 relative text-center">
              <div className="text-[6.5px] text-zinc-500 font-mono tracking-widest uppercase">FLAGSHIP PACK</div>
              <div className="my-auto">
                <div className="w-7 h-7 rounded-lg mx-auto flex items-center justify-center text-black font-black text-xs shadow-md mb-1" style={{ backgroundColor: accent }}>
                  {name.charAt(0)}
                </div>
                <div className="text-xs font-black tracking-tight" style={{ fontFamily: headlineFont }}>{name}</div>
              </div>
              <div className="text-[6px] text-zinc-400 font-mono border-t border-white/10 pt-1">
                PARIS · LONDON · NEW YORK
              </div>
            </div>
            <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-[8px] text-zinc-300 border border-white/10">
              <Sparkles className="w-2.5 h-2.5 text-amber-400" />
              <span>Smart Mockup · Luxury Retail Bag</span>
            </div>
          </div>
        );

      // -------------------------------------------------------------
      // DEFAULT SMART CANVAS (Generic Applications)
      // -------------------------------------------------------------
      default:
        return (
          <div className="relative w-full h-full bg-[#181A20] overflow-hidden flex flex-col items-center justify-center p-3 select-none">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-black font-bold text-sm shadow-lg mb-1.5"
              style={{ backgroundColor: accent }}
            >
              {name.charAt(0)}
            </div>
            <div className="text-[10px] font-bold text-white tracking-tight">{label}</div>
            <div className="text-[7px] text-zinc-400 font-mono mt-0.5">{name} · Production Asset</div>

            {/* Badge Indicator */}
            <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-[8px] text-zinc-300 border border-white/10">
              <Sparkles className="w-2.5 h-2.5 text-amber-400" />
              <span>Smart Vector Mockup</span>
            </div>
          </div>
        );
    }
  };

  return (
    <div
      style={{
        ...style,
        borderRadius: '0.4cqw',
        overflow: 'hidden',
      }}
      className={`group relative w-full h-full border border-white/10 shadow-sm transition-all duration-200 hover:border-zinc-500/50 ${className}`}
    >
      {/* Dynamic Vector/CSS Mockup */}
      {renderMockupContent()}

      {/* Hover Overlay: 1-Click Replace with Custom Photo */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center p-3 text-center z-30 pointer-events-none group-hover:pointer-events-auto">
        <button
          type="button"
          onClick={e => {
            e.stopPropagation();
            onUploadClick?.();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-zinc-900 text-xs font-semibold shadow-lg hover:bg-zinc-100 active:scale-95 transition-transform"
        >
          <Camera className="w-3.5 h-3.5" />
          <span>Upload Custom Artwork</span>
        </button>
        <span className="text-[9px] text-zinc-400 mt-1.5">
          Or keep this dynamic {label} mockup
        </span>
      </div>
    </div>
  );
};
