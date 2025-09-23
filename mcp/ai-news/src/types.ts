export interface FeedSource {
  name: string;
  url: string;
  description: string;
  enabled: boolean;
}

export interface ArticleData {
  title: string;
  description: string;
  link: string;
  pubDate: Date;
  content?: string;
  source: string;
  guid?: string;
}

export interface ProcessedArticle extends ArticleData {
  slug: string;
  tags: string[];
  summary: string;
  markdown: string;
  cover?: string;
  coverAlt?: string;
  coverGenerated?: boolean;
  coverPrompt?: string;
}

export interface FetchOptions {
  sinceDays?: number;
  limit?: number;
  generateImages?: boolean;
}

export interface WriteOptions {
  outDir?: string;
  overwrite?: boolean;
  includeImages?: boolean;
}

export interface ImageGenerationOptions {
  style?: 'corporate' | 'creative' | 'minimal' | 'technical';
  regenerate?: boolean;
  dryRun?: boolean;
  batchSize?: number;
}