import { siteConfig } from '@/lib/config';

interface JsonLdProps {
  type?: 'WebSite' | 'SoftwareApplication' | 'Article';
  data?: Record<string, unknown>;
}

export function JsonLd({ type = 'SoftwareApplication', data }: JsonLdProps) {
  const baseData = {
    '@context': 'https://schema.org',
    '@type': type,
  };

  let jsonLd: Record<string, unknown>;

  if (type === 'SoftwareApplication') {
    jsonLd = {
      ...baseData,
      name: siteConfig.name,
      description: siteConfig.description,
      url: siteConfig.url,
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Any',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      ...data,
    };
  } else if (type === 'WebSite') {
    jsonLd = {
      ...baseData,
      name: siteConfig.name,
      description: siteConfig.description,
      url: siteConfig.url,
      ...data,
    };
  } else {
    jsonLd = {
      ...baseData,
      ...data,
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
