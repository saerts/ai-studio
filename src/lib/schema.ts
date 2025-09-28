export interface OrganizationSchema {
  '@context': 'https://schema.org';
  '@type': 'Organization';
  name: string;
  url: string;
  logo?: string;
  contactPoint?: {
    '@type': 'ContactPoint';
    telephone?: string;
    contactType: string;
    email?: string;
  };
  address?: {
    '@type': 'PostalAddress';
    addressLocality: string;
    addressCountry: string;
  };
}

export interface ArticleSchema {
  '@context': 'https://schema.org';
  '@type': 'Article';
  headline: string;
  description: string;
  author: {
    '@type': 'Organization';
    name: string;
  };
  publisher: {
    '@type': 'Organization';
    name: string;
    logo?: {
      '@type': 'ImageObject';
      url: string;
    };
  };
  datePublished: string;
  dateModified?: string;
  mainEntityOfPage: {
    '@type': 'WebPage';
    '@id': string;
  };
  image?: string;
}

export interface BreadcrumbSchema {
  '@context': 'https://schema.org';
  '@type': 'BreadcrumbList';
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    item: string;
  }>;
}

export function orgSchema(): OrganizationSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'AI Studio',
    url: 'https://ai-studio44.be',
    logo: 'https://ai-studio44.be/favicon.svg',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'info@ai-studio44.be',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Antwerpen',
      addressCountry: 'BE',
    },
  };
}

export function articleSchema(
  title: string,
  description: string,
  url: string,
  publishedDate: string,
  modifiedDate?: string,
  image?: string
): ArticleSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    author: {
      '@type': 'Organization',
      name: 'AI Studio',
    },
    publisher: {
      '@type': 'Organization',
      name: 'AI Studio',
      logo: {
        '@type': 'ImageObject',
        url: 'https://ai-studio44.be/favicon.svg',
      },
    },
    datePublished: publishedDate,
    dateModified: modifiedDate || publishedDate,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    ...(image && { image }),
  };
}

export function breadcrumbsSchema(
  segments: Array<{ name: string; url: string }>
): BreadcrumbSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: segments.map((segment, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: segment.name,
      item: `https://ai-studio44.be${segment.url}`,
    })),
  };
}
