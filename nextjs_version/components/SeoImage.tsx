import React from "react";
import Image from "next/image";

interface SeoImageProps {
  src: string;
  alt: string; // Type-safe STRICT Alt text requirement
  width: number;
  height: number;
  caption?: string;
  className?: string;
  priority?: boolean;
}

/**
 * Reusable Image SEO Component for Next.js App Router applications.
 * - Enforces and validates strict accessibility and keyword indexing alt values.
 * - Wraps output in descriptive semantic HTML5 <figure> blocks with custom <figcaption> layouts.
 * - Injects SEO metadata on the page via Google-preferred Schema.org ImageObject structured script blocks.
 */
export default function SeoImage({
  src,
  alt,
  width,
  height,
  caption,
  className = "",
  priority = false,
}: SeoImageProps) {
  // Runtime validation to guarantee developer awareness during continuous builds
  if (!alt || alt.trim().length === 0) {
    throw new Error(
      "SEO Security Check: An explicit, rich 'alt' description is required for image indexing."
    );
  }

  // Google Schema.org ImageObject payload structure
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    "contentUrl": src,
    "url": src,
    "width": width.toString(),
    "height": height.toString(),
    "name": alt,
    "description": caption || alt,
  };

  return (
    <figure className={`my-8 flex flex-col items-center w-full ${className}`}>
      {/* Injects schema data inline so that Google Crawler processes the metadata immediately during SSR cycles */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="relative overflow-hidden rounded-md bg-stone-100 border border-stone-200/60 aspect-video w-full">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          placeholder="blur"
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSI5MiIgdmlld0JveD0iMCAwIDE2IDkyIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjRmM2VlIi8+PC9zdmc+"
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.01]"
        />
      </div>

      {caption && (
        <figcaption className="mt-3 text-center text-xs text-stone-500 font-sans tracking-wide leading-relaxed italic border-t border-stone-200/40 pt-2 w-full max-w-xl mx-auto">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
