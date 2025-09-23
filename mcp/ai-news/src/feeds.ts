import type { FeedSource } from './types.js';

export const AI_FEEDS: FeedSource[] = [
  {
    name: 'Hugging Face Blog',
    url: 'https://huggingface.co/blog/feed.xml',
    description: 'Latest AI research and models from Hugging Face',
    enabled: true,
  },
  {
    name: 'Google AI Blog',
    url: 'https://blog.research.google/feeds/posts/default',
    description: 'Google AI research and developments',
    enabled: true,
  },
  {
    name: 'OpenAI Blog',
    url: 'https://openai.com/blog/rss.xml',
    description: 'OpenAI news and research updates',
    enabled: true,
  },
  {
    name: 'Meta AI',
    url: 'https://ai.meta.com/blog/rss/',
    description: 'Meta AI research and announcements',
    enabled: true,
  },
  {
    name: 'MIT News - AI',
    url: 'https://news.mit.edu/topic/mitartificial-intelligence2-rss.xml',
    description: 'MIT AI research and news',
    enabled: true,
  },
  {
    name: 'Papers with Code',
    url: 'https://paperswithcode.com/feed.xml',
    description: 'Latest machine learning papers with code',
    enabled: true,
  },
  {
    name: 'The Gradient',
    url: 'https://thegradient.pub/rss/',
    description: 'AI research magazine',
    enabled: true,
  },
  {
    name: 'Towards Data Science',
    url: 'https://towardsdatascience.com/feed',
    description: 'AI and data science articles on Medium',
    enabled: true,
  },
  // Add more feeds as needed - clearly marked expansion point
  // TODO: Add more AI feeds:
  // - DeepMind Blog: https://deepmind.com/blog/feed/basic/
  // - Anthropic News: https://www.anthropic.com/feed.xml
  // - AI News: https://artificialintelligence-news.com/feed/
  // - arXiv AI: https://rss.arxiv.org/rss/cs.AI
  // - VentureBeat AI: https://venturebeat.com/ai/feed/
  // - TechCrunch AI: https://techcrunch.com/category/artificial-intelligence/feed/
];

export function getEnabledFeeds(): FeedSource[] {
  return AI_FEEDS.filter(feed => feed.enabled);
}

export function getFeedByName(name: string): FeedSource | undefined {
  return AI_FEEDS.find(feed => feed.name === name);
}

export function getAllFeeds(): FeedSource[] {
  return AI_FEEDS;
}