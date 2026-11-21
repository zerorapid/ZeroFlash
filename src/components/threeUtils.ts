// Robust loader for Three.js from window or CDN
export function ensureThree(): Promise<any> {
  if (typeof window === "undefined") return Promise.resolve(null);
  if ((window as any).THREE) return Promise.resolve((window as any).THREE);

  return new Promise((resolve) => {
    const existing = document.querySelector('script[src*="three"]');
    if (existing) {
      if ((window as any).THREE) {
        resolve((window as any).THREE);
        return;
      }
      existing.addEventListener("load", () => resolve((window as any).THREE));
      setTimeout(() => resolve((window as any).THREE), 1500);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
    script.async = true;
    script.onload = () => resolve((window as any).THREE);
    script.onerror = () => resolve(null);
    document.head.appendChild(script);
  });
}
