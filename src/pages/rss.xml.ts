import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getCollection('blog', ({ data }) => {
    return !data.draft;
  });

  const sortedPosts = posts.sort((a, b) => {
    return (
      new Date(b.data.pubDate).getTime() - new Date(a.data.pubDate).getTime()
    );
  });

  return rss({
    title: 'AI Studio Blog',
    description:
      'Blijf op de hoogte van de laatste ontwikkelingen op het gebied van AI en automatisering.',
    site: context.site ?? 'https://ai-studio44.be',
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/blog/${post.slug}/`,
      categories: post.data.tags,
    })),
    customData: `<language>nl-be</language>`,
  });
}
