import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  ogImage?: string;
  noindex?: boolean;
  schema?: Record<string, any>;
}

const SITE_URL = "https://austpc.com";

export default function SEO({
  title = "AUST Photography Club | AUSTPC",
  description = "Welcome to AUST Photography Club (AUSTPC). The official photography club of Ahsanullah University of Science and Technology, Dhaka.",
  canonicalUrl,
  ogImage = `${SITE_URL}/og-image.png`, 
  noindex = false,
  schema,
}: SEOProps) {
  const fullCanonicalUrl = canonicalUrl ? `${SITE_URL}${canonicalUrl}` : SITE_URL;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />

      {/* Canonical */}
      <link rel="canonical" href={fullCanonicalUrl} />

      {/* Indexing */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullCanonicalUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={ogImage} />

      {/* Structured Data (JSON-LD) */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
}
