import React from 'react';

interface SeoImageProps {
  src: string;
  alt: string; // Strict Alt requirement
  width: number;
  height: number;
  caption?: string;
  className?: string;
  priority?: boolean;
}

/**
 * A highly reusable and optimized SEO-oriented Image component.
 * Implements strict alt validation, semantic markup (<figure> / <figcaption>),
 * and dynamic injection of Schema.org ImageObject JSON-LD metadata.
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
  // Strict Alt Validation to guarantee optimal accessibility and SEO indexability
  if (!alt || alt.trim().length === 0) {
    throw new Error(
      "SEO Constraint Violated: The 'alt' property is strictly required for accessibility and crawl validation of search engine bots."
    );
  }

  // Schema.org Structured Data payload for the Google crawler
  const schemaJson = {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    "contentUrl": src,
    "url": src,
    "width": width.toString(),
    "height": height.toString(),
    "description": caption || alt,
    "name": alt,
  };

  return (
    <figure 
      id={`seo-image-${alt.replace(/\s+/g, '-').toLowerCase()}`} 
      className={`my-8 flex flex-col w-full ${className}`}
    >
      {/* Structured data payload injection directly within the figure node for crawl visibility */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
      />
      
      <div className="relative overflow-hidden rounded-md bg-stone-100 border border-stone-200/60 aspect-video w-full">
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className="w-full h-full object-cover transition-all duration-500 hover:scale-[1.01]"
        />
      </div>

      {caption ? (
        <figcaption className="mt-3 text-center text-xs text-stone-500 font-sans tracking-wide leading-relaxed italic border-t border-stone-200/40 pt-2 w-full max-w-xl mx-auto">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
