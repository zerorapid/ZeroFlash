import React, { useState, useEffect, createContext, useContext } from "react";
import { Sliders, X, Copy, Check, Sparkles, RefreshCcw } from "lucide-react";

export interface DialValues {
  padding: number;
  borderRadius: number;
  accentColor: string;
  springDuration: number;
  springBounce: number;
}

interface DialContextType {
  values: DialValues;
  updateValue: <K extends keyof DialValues>(key: K, val: DialValues[K]) => void;
  resetDefaults: () => void;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const defaultDialValues: DialValues = {
  padding: 32,
  borderRadius: 24,
  accentColor: "#FF385C",
  springDuration: 0.5,
  springBounce: 0.25,
};

const DialContext = createContext<DialContextType>({
  values: defaultDialValues,
  updateValue: () => {},
  resetDefaults: () => {},
  isOpen: false,
  setIsOpen: () => {},
});

export function DialProvider({ children }: { children: React.ReactNode }) {
  const [values, setValues] = useState<DialValues>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("dialkit_tuning");
      if (saved) {
        try {
          return { ...defaultDialValues, ...JSON.parse(saved) };
        } catch {
          // fallback to defaults
        }
      }
    }
    return defaultDialValues;
  });

  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle DialKit with Option+D or Cmd+D
      if ((e.metaKey || e.altKey) && e.key.toLowerCase() === "d") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const updateValue = <K extends keyof DialValues>(key: K, val: DialValues[K]) => {
    setValues((prev) => {
      const updated = { ...prev, [key]: val };
      localStorage.setItem("dialkit_tuning", JSON.stringify(updated));
      return updated;
    });
  };

  const resetDefaults = () => {
    setValues(defaultDialValues);
    localStorage.removeItem("dialkit_tuning");
  };

  return (
    <DialContext.Provider value={{ values, updateValue, resetDefaults, isOpen, setIsOpen }}>
      {children}
    </DialContext.Provider>
  );
}

export function useDialKit() {
  return useContext(DialContext);
}

/**
 * Floating Client Co-Design Dial Widget
 */
export function DialRoot() {
  const { values, updateValue, resetDefaults, isOpen, setIsOpen } = useDialKit();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(values, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const presetColors = ["#FF385C", "#0071E3", "#5856D6", "#34C759", "#1D1D1F", "#F5A623"];

  return (
    <div className="fixed bottom-6 left-6 z-50 font-sans">
      {/* Minimized Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/95 backdrop-blur-md border border-black/[0.08] shadow-apple-card hover:shadow-apple-hover text-[#1D1D1F] text-xs font-semibold hover:scale-105 active:scale-95 transition-all cursor-pointer group"
          title="Open DialKit Client Co-Design Tool (Alt+D)"
        >
          <div className="w-5 h-5 rounded-full bg-[#FF385C] flex items-center justify-center text-white">
            <Sliders className="w-3 h-3" />
          </div>
          <span>DialKit Co-Design</span>
          <span className="text-[10px] text-[#86868B] bg-neutral-100 px-1.5 py-0.5 rounded-md font-mono">
            Alt+D
          </span>
        </button>
      )}

      {/* Expanded Floating Control Panel */}
      {isOpen && (
        <div className="w-80 rounded-3xl bg-white/95 backdrop-blur-2xl border border-black/[0.08] shadow-apple-floating p-5 text-[#1D1D1F] animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between border-b border-black/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#FF385C] to-[#0071E3] flex items-center justify-center text-white">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-sm tracking-tight">DialKit Co-Design</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={resetDefaults}
                className="p-1.5 rounded-lg hover:bg-neutral-100 text-[#86868B] hover:text-[#1D1D1F] transition-colors cursor-pointer"
                title="Reset to Defaults"
              >
                <RefreshCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-neutral-100 text-[#86868B] hover:text-[#1D1D1F] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            {/* Padding Slider */}
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-[#6E6E73]">Card Padding</span>
                <span className="font-mono text-[#1D1D1F]">{values.padding}px</span>
              </div>
              <input
                type="range"
                min="16"
                max="56"
                step="4"
                value={values.padding}
                onChange={(e) => updateValue("padding", Number(e.target.value))}
                className="w-full accent-[#FF385C] cursor-pointer"
              />
            </div>

            {/* Border Radius Slider */}
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-[#6E6E73]">Corner Radius</span>
                <span className="font-mono text-[#1D1D1F]">{values.borderRadius}px</span>
              </div>
              <input
                type="range"
                min="8"
                max="40"
                step="2"
                value={values.borderRadius}
                onChange={(e) => updateValue("borderRadius", Number(e.target.value))}
                className="w-full accent-[#FF385C] cursor-pointer"
              />
            </div>

            {/* Spring Duration Slider */}
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-[#6E6E73]">Spring Duration</span>
                <span className="font-mono text-[#0071E3]">{values.springDuration}s</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="1.2"
                step="0.05"
                value={values.springDuration}
                onChange={(e) => updateValue("springDuration", Number(e.target.value))}
                className="w-full accent-[#0071E3] cursor-pointer"
              />
            </div>

            {/* Spring Bounce Slider */}
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-[#6E6E73]">Spring Bounce</span>
                <span className="font-mono text-[#0071E3]">{values.springBounce}</span>
              </div>
              <input
                type="range"
                min="0"
                max="0.6"
                step="0.05"
                value={values.springBounce}
                onChange={(e) => updateValue("springBounce", Number(e.target.value))}
                className="w-full accent-[#0071E3] cursor-pointer"
              />
            </div>

            {/* Accent Color Palette */}
            <div>
              <div className="font-semibold text-[#6E6E73] mb-2">Accent Brand Color</div>
              <div className="flex items-center gap-2">
                {presetColors.map((col) => (
                  <button
                    key={col}
                    onClick={() => updateValue("accentColor", col)}
                    className="w-7 h-7 rounded-full transition-transform hover:scale-110 flex items-center justify-center cursor-pointer border"
                    style={{
                      backgroundColor: col,
                      borderColor: values.accentColor === col ? "#1D1D1F" : "transparent",
                      boxShadow: values.accentColor === col ? "0 0 0 2px white, 0 0 0 4px " + col : "none",
                    }}
                  >
                    {values.accentColor === col && <Check className="w-3.5 h-3.5 text-white" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-black/[0.06] flex items-center justify-between">
            <span className="text-[10px] text-[#86868B]">Live Client Co-Design</span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-[#1D1D1F] font-semibold text-[11px] transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-[#34C759]" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-[#86868B]" /> Copy JSON
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
