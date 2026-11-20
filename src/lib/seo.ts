export interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  image?: string;
  noindex?: boolean;
  type?: 'website' | 'article';
}

const defaultSEO = {
  title: 'Je website kost je klanten. Gratis Website Roast',
  description:
    'Plak je URL en krijg een eerlijk rapport over je website, plus een gratis ontwerp van je nieuwe homepage.',
  image: '/images/ai-voor-bedrijven.png',
  canonical: 'https://ai-studio44.com',
  type: 'website' as const,
};

export function getSEOProps(props: SEOProps = {}) {
  const {
    title = defaultSEO.title,
    description = defaultSEO.description,
    canonical = defaultSEO.canonical,
    image = defaultSEO.image,
    noindex = false,
    type = defaultSEO.type,
  } = props;

  const fullTitle = title === defaultSEO.title ? title : `${title} | AI-Studio44`;

  return {
    title: fullTitle,
    description,
    canonical,
    image: image.startsWith('http') ? image : `https://ai-studio44.com${image}`,
    noindex,
    type,
  };
}
