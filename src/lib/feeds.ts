export interface FeedSource {
  name: string;
  url: string;
  description: string;
  enabled: boolean;
}

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
    name: 'MIT News - Artificial Intelligence',
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
    name: 'arXiv AI',
    url: 'https://rss.arxiv.org/rss/cs.AI',
    description: 'arXiv Artificial Intelligence papers',
    enabled: true,
  },
  {
    name: 'Towards Data Science',
    url: 'https://towardsdatascience.com/feed',
    description: 'AI and data science articles on Medium',
    enabled: true,
  },
  {
    name: 'The Gradient',
    url: 'https://thegradient.pub/rss/',
    description: 'AI research magazine',
    enabled: true,
  },
  {
    name: 'DeepMind Blog',
    url: 'https://deepmind.com/blog/feed/basic/',
    description: 'DeepMind research and insights',
    enabled: true,
  },
  {
    name: 'Anthropic News',
    url: 'https://www.anthropic.com/feed.xml',
    description: 'Anthropic AI safety research',
    enabled: true,
  },
  {
    name: 'AI News',
    url: 'https://artificialintelligence-news.com/feed/',
    description: 'Latest AI industry news',
    enabled: true,
  },
];

// Utility function to get enabled feeds
export function getEnabledFeeds(): FeedSource[] {
  return AI_FEEDS.filter((feed) => feed.enabled);
}

// Utility function to get feed by name
export function getFeedByName(name: string): FeedSource | undefined {
  return AI_FEEDS.find((feed) => feed.name === name);
}
