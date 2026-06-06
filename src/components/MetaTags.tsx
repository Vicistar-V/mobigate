import { Helmet } from "react-helmet-async";

interface MetaTagsProps {
  title?: string;
  description?: string;
  image?: string;
  canonical?: string;
  ogType?: "website" | "article" | "profile";
  noIndex?: boolean;
}

/**
 * Reusable SEO meta tags component using react-helmet-async.
 * Use this in any page component to dynamically set page-specific
 * title, description, OG tags, canonical URL, etc.
 *
 * The favicon (browser tab icon) is handled globally in index.html.
 * This component controls what shows up when the page is *shared*.
 */
export function MetaTags({
  title = "Mobiface - Social Content Platform",
  description = "Connect, share, and discover amazing content with Mobiface - Your premier social content platform",
  image = "https://mobi-gate-com.lovable.app/mobiface-favicon.png",
  canonical,
  ogType = "website",
  noIndex = false,
}: MetaTagsProps) {
  const siteUrl = typeof window !== "undefined"
    ? window.location.origin
    : "https://mobi-gate-com.lovable.app";

  const canonicalUrl = canonical || (typeof window !== "undefined" ? window.location.href : siteUrl);

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* Canonical */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content={`${title} - Mobiface`} />

      {/* Twitter */}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={`${title} - Mobiface`} />
      <meta name="twitter:url" content={canonicalUrl} />

      {/* Robots */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
    </Helmet>
  );
}
