export interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  image?: string;
  noindex?: boolean;
  type?: 'website' | 'article';
}

const defaultSEO = {
  title: 'AI Studio — Breng AI in je dagelijkse flow',
  description:
    'AI Studio helpt bedrijven bij het implementeren van AI-oplossingen. Van workflow-automations tot training en coaching.',
  image: '/og-image.jpg',
  canonical: 'https://ai-studio.be',
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

  const fullTitle = title === defaultSEO.title ? title : `${title} — AI Studio`;

  return {
    title: fullTitle,
    description,
    canonical,
    image: image.startsWith('http') ? image : `https://ai-studio.be${image}`,
    noindex,
    type,
  };
}
