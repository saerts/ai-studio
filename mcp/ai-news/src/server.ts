#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import Parser from 'rss-parser';
import TurndownService from 'turndown';
import { createHash } from 'crypto';
import { writeFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

import { getEnabledFeeds, getAllFeeds } from './feeds.js';
import { AIImageGenerator } from './image-generator.js';
import type { ArticleData, ProcessedArticle, FetchOptions, WriteOptions, ImageGenerationOptions } from './types.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

class AINewsServer {
  private server: Server;
  private parser: Parser;
  private turndown: TurndownService;
  private processedArticles: Map<string, ProcessedArticle> = new Map();
  private imageGenerator: AIImageGenerator;

  constructor() {
    this.server = new Server(
      {
        name: 'ai-studio-ai-news',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.parser = new Parser({
      timeout: 10000,
      headers: {
        'User-Agent': 'AI Studio News Fetcher 1.0',
      },
    });

    this.turndown = new TurndownService({
      headingStyle: 'atx',
      hr: '---',
      bulletListMarker: '-',
      codeBlockStyle: 'fenced',
    });

    // Initialize image generator (will be disabled if no API key)
    try {
      this.imageGenerator = new AIImageGenerator();
    } catch (error) {
      console.warn('Image generation disabled:', error instanceof Error ? error.message : 'Unknown error');
      this.imageGenerator = new AIImageGenerator({ enabled: false });
    }

    this.setupTools();
  }

  private setupTools() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'list_feeds',
          description: 'List all available RSS feeds',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
        {
          name: 'fetch_articles',
          description: 'Fetch articles from enabled RSS feeds',
          inputSchema: {
            type: 'object',
            properties: {
              sinceDays: {
                type: 'number',
                description: 'Fetch articles from the last N days (default: 7)',
                default: 7,
              },
              limit: {
                type: 'number',
                description: 'Maximum number of articles to fetch (default: 50)',
                default: 50,
              },
            },
          },
        },
        {
          name: 'write_markdown',
          description: 'Write fetched articles as Markdown files',
          inputSchema: {
            type: 'object',
            properties: {
              outDir: {
                type: 'string',
                description: 'Output directory for Markdown files (default: ../../src/content/blog)',
              },
              overwrite: {
                type: 'boolean',
                description: 'Overwrite existing files (default: false)',
                default: false,
              },
              includeImages: {
                type: 'boolean',
                description: 'Generate images for articles (default: true)',
                default: true,
              },
            },
          },
        },
        {
          name: 'generate_images',
          description: 'Generate AI images for processed articles',
          inputSchema: {
            type: 'object',
            properties: {
              style: {
                type: 'string',
                enum: ['corporate', 'creative', 'minimal', 'technical'],
                description: 'Image style (default: corporate)',
                default: 'corporate',
              },
              regenerate: {
                type: 'boolean',
                description: 'Regenerate existing images (default: false)',
                default: false,
              },
              dryRun: {
                type: 'boolean',
                description: 'Preview prompts without generating (default: false)',
                default: false,
              },
            },
          },
        },
        {
          name: 'get_usage_stats',
          description: 'Get image generation usage and cost statistics',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
        {
          name: 'get_processed_articles',
          description: 'Get all processed articles in structured format',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      switch (request.params.name) {
        case 'list_feeds':
          return this.listFeeds();
        case 'fetch_articles':
          return this.fetchArticles(request.params.arguments as FetchOptions);
        case 'write_markdown':
          return this.writeMarkdown(request.params.arguments as WriteOptions);
        case 'generate_images':
          return this.generateImages(request.params.arguments as ImageGenerationOptions);
        case 'get_usage_stats':
          return this.getUsageStats();
        case 'get_processed_articles':
          return this.getProcessedArticles();
        default:
          throw new Error(`Unknown tool: ${request.params.name}`);
      }
    });
  }

  private async listFeeds() {
    const feeds = getAllFeeds();
    const enabledCount = feeds.filter(f => f.enabled).length;

    return {
      content: [
        {
          type: 'text',
          text: `Available RSS feeds: ${feeds.length} total, ${enabledCount} enabled\n\n` +
            feeds.map(feed =>
              `${feed.enabled ? '✅' : '❌'} **${feed.name}**\n` +
              `   URL: ${feed.url}\n` +
              `   Description: ${feed.description}\n`
            ).join('\n'),
        },
      ],
    };
  }

  private async fetchArticles(options: FetchOptions = {}) {
    const { sinceDays = 7, limit = 50 } = options;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - sinceDays);

    const feeds = getEnabledFeeds();
    const articles: ArticleData[] = [];

    let fetchedCount = 0;
    let errorCount = 0;

    for (const feed of feeds) {
      try {
        console.error(`Fetching from ${feed.name}...`);
        const feedData = await this.parser.parseURL(feed.url);

        for (const item of feedData.items) {
          if (fetchedCount >= limit) break;

          const pubDate = new Date(item.pubDate || item.isoDate || Date.now());
          if (pubDate < cutoffDate) continue;

          const article: ArticleData = {
            title: item.title || 'Untitled',
            description: this.cleanText(item.contentSnippet || item.summary || ''),
            link: item.link || '',
            pubDate,
            content: item.content || item.summary || '',
            source: feed.name,
            guid: item.guid || item.id,
          };

          articles.push(article);
          fetchedCount++;
        }
      } catch (error) {
        console.error(`Error fetching ${feed.name}:`, error);
        errorCount++;
      }
    }

    // Sort by publication date (newest first)
    articles.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

    // Process articles
    this.processedArticles.clear();
    for (const article of articles) {
      const processed = this.processArticle(article);
      const hash = this.getArticleHash(processed);
      this.processedArticles.set(hash, processed);
    }

    return {
      content: [
        {
          type: 'text',
          text: `Fetched ${fetchedCount} articles from ${feeds.length} feeds\n` +
            `Errors: ${errorCount}\n` +
            `Articles processed: ${this.processedArticles.size}\n` +
            `Date range: ${cutoffDate.toISOString().split('T')[0]} to ${new Date().toISOString().split('T')[0]}`,
        },
      ],
    };
  }

  private async writeMarkdown(options: WriteOptions = {}) {
    const { outDir = '../../src/content/blog', overwrite = false, includeImages = true } = options;

    if (this.processedArticles.size === 0) {
      return {
        content: [
          {
            type: 'text',
            text: 'No articles to write. Run fetch_articles first.',
          },
        ],
      };
    }

    const outputDir = join(__dirname, outDir);
    await mkdir(outputDir, { recursive: true });

    let writtenCount = 0;
    let skippedCount = 0;
    let imagesGenerated = 0;
    const errors: string[] = [];

    for (const [_hash, article] of this.processedArticles) {
      try {
        const filename = `${article.slug}.md`;
        const filepath = join(outputDir, filename);

        // Check if file exists and overwrite setting
        if (!overwrite) {
          try {
            await import('fs').then(fs => fs.promises.access(filepath));
            skippedCount++;
            continue; // File exists and overwrite is false
          } catch {
            // File doesn't exist, continue with writing
          }
        }

        // Generate image if enabled and not already present
        if (includeImages && !article.cover) {
          try {
            const result = await this.imageGenerator.generateImageForArticle(article);
            if (result.success) {
              article.cover = result.imagePath ?? '';
              article.coverAlt = result.altText ?? '';
              article.coverGenerated = true;
              article.coverPrompt = `Generated for "${article.title}"`;
              imagesGenerated++;

              // Regenerate markdown with image metadata
              article.markdown = this.regenerateMarkdownWithImage(article);
            }
          } catch (imageError) {
            console.warn(`Image generation failed for ${article.slug}:`, imageError);
          }
        }

        await writeFile(filepath, article.markdown, 'utf-8');
        writtenCount++;
      } catch (error) {
        errors.push(`${article.slug}: ${error}`);
      }
    }

    return {
      content: [
        {
          type: 'text',
          text: `Markdown files written: ${writtenCount}\n` +
            `Images generated: ${imagesGenerated}\n` +
            `Skipped (already exist): ${skippedCount}\n` +
            `Errors: ${errors.length}\n` +
            `Output directory: ${outputDir}\n` +
            (errors.length > 0 ? `\nErrors:\n${errors.join('\n')}` : ''),
        },
      ],
    };
  }

  private regenerateMarkdownWithImage(article: ProcessedArticle): string {
    const frontmatter = this.generateFrontmatter({
      title: article.title,
      description: article.summary,
      pubDate: article.pubDate,
      updatedDate: article.pubDate,
      tags: article.tags,
      source: article.source,
      canonicalUrl: article.link,
      cover: article.cover,
      coverAlt: article.coverAlt,
      coverGenerated: article.coverGenerated,
      coverPrompt: article.coverPrompt,
      draft: false,
    });

    const content = this.turndown.turndown(article.content || article.description);
    return `${frontmatter}\n\n${content}\n\n_Bron: [${article.source}](${article.link})._`;
  }

  private processArticle(article: ArticleData): ProcessedArticle {
    const slug = this.generateSlug(article.title);
    const tags = this.generateTags(article);
    const summary = this.generateSummary(article.description);
    const content = this.turndown.turndown(article.content || article.description);

    const frontmatter = this.generateFrontmatter({
      title: article.title,
      description: summary,
      pubDate: article.pubDate,
      updatedDate: article.pubDate,
      tags,
      source: article.source,
      canonicalUrl: article.link,
      draft: false,
    });

    const markdown = `${frontmatter}\n\n${content}\n\n_Bron: [${article.source}](${article.link})._`;

    return {
      ...article,
      slug,
      tags,
      summary,
      markdown,
    };
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 100);
  }

  private generateTags(article: ArticleData): string[] {
    const tags: Set<string> = new Set(['ai', 'news']);

    // Add source-based tag
    const sourceTag = article.source.toLowerCase().replace(/[^\w]/g, '-');
    tags.add(`source-${sourceTag}`);

    // Extract tags from title and description
    const text = `${article.title} ${article.description}`.toLowerCase();

    const keywordMap = {
      'machine-learning': ['machine learning', 'ml', 'neural network'],
      'deep-learning': ['deep learning', 'neural', 'cnn', 'rnn', 'transformer'],
      'nlp': ['natural language', 'nlp', 'language model', 'text'],
      'computer-vision': ['computer vision', 'image', 'visual', 'cv'],
      'robotics': ['robot', 'robotics', 'autonomous'],
      'research': ['research', 'paper', 'study', 'arxiv'],
      'industry': ['industry', 'business', 'commercial', 'enterprise'],
      'opensource': ['open source', 'github', 'hugging face'],
    };

    for (const [tag, keywords] of Object.entries(keywordMap)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        tags.add(tag);
      }
    }

    return Array.from(tags).slice(0, 8); // Limit to 8 tags
  }

  private generateSummary(description: string): string {
    const cleaned = this.cleanText(description);
    return cleaned.length > 160 ? `${cleaned.substring(0, 157)}...` : cleaned;
  }

  private generateFrontmatter(data: any): string {
    const formatDate = (date: Date) => date.toISOString();

    let frontmatter = `---
title: "${this.escapeYaml(data.title)}"
description: "${this.escapeYaml(data.description)}"
pubDate: ${formatDate(data.pubDate)}
updatedDate: ${formatDate(data.updatedDate)}
tags: [${data.tags.map((tag: string) => `"${tag}"`).join(', ')}]
source: "${this.escapeYaml(data.source)}"
canonicalUrl: "${data.canonicalUrl}"`;

    // Add image fields if present
    if (data.cover) {
      frontmatter += `\ncover: "${data.cover}"`;
    }
    if (data.coverAlt) {
      frontmatter += `\ncoverAlt: "${this.escapeYaml(data.coverAlt)}"`;
    }
    if (data.coverGenerated !== undefined) {
      frontmatter += `\ncoverGenerated: ${data.coverGenerated}`;
    }
    if (data.coverPrompt) {
      frontmatter += `\ncoverPrompt: "${this.escapeYaml(data.coverPrompt)}"`;
    }

    frontmatter += `\ndraft: ${data.draft}
---`;

    return frontmatter;
  }

  private cleanText(text: string): string {
    return text
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
  }

  private escapeYaml(str: string): string {
    return str.replace(/"/g, '\\"').replace(/\n/g, ' ');
  }

  private getArticleHash(article: ProcessedArticle): string {
    const hashString = `${article.link}${article.title}`;
    return createHash('md5').update(hashString).digest('hex');
  }

  private async generateImages(options: ImageGenerationOptions = {}): Promise<any> {
    const { style = 'corporate', regenerate = false, dryRun = false } = options;

    if (this.processedArticles.size === 0) {
      return {
        content: [
          {
            type: 'text',
            text: 'No articles to generate images for. Run fetch_articles first.',
          },
        ],
      };
    }

    // Configure image generator with options
    this.imageGenerator = new AIImageGenerator({ style, enabled: !dryRun });

    const articles = Array.from(this.processedArticles.values());
    let successCount = 0;
    let errorCount = 0;
    let skippedCount = 0;
    let totalCost = 0;
    const errors: string[] = [];

    if (dryRun) {
      // Preview mode - show prompts without generating
      const previews: string[] = [];
      for (const article of articles) {
        const prompt = this.createImagePrompt(article, style);
        previews.push(`**${article.title}**\nPrompt: ${prompt}\n`);
      }

      return {
        content: [
          {
            type: 'text',
            text: `Image Generation Preview (${articles.length} articles):\n\n${previews.join('\n')}`,
          },
        ],
      };
    }

    // Generate images for articles
    for (const article of articles) {
      try {
        // Skip if image exists and not regenerating
        if (!regenerate && article.cover) {
          skippedCount++;
          continue;
        }

        const result = await this.imageGenerator.generateImageForArticle(article);

        if (result.success) {
          // Update article with image information
          article.cover = result.imagePath ?? '';
          article.coverAlt = result.altText ?? '';
          article.coverGenerated = true;
          article.coverPrompt = result.cached ? 'cached' : 'generated';

          // Update processed article
          const hash = this.getArticleHash(article);
          this.processedArticles.set(hash, article);

          successCount++;
          totalCost += result.cost;
        } else {
          errors.push(`${article.slug}: ${result.error}`);
          errorCount++;
        }
      } catch (error) {
        errors.push(`${article.slug}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        errorCount++;
      }
    }

    return {
      content: [
        {
          type: 'text',
          text: `Image generation completed:\n` +
            `✅ Generated: ${successCount}\n` +
            `⏭️ Skipped: ${skippedCount}\n` +
            `❌ Errors: ${errorCount}\n` +
            `💰 Total cost: $${totalCost.toFixed(3)}\n` +
            `🎨 Style: ${style}\n` +
            (errors.length > 0 ? `\nErrors:\n${errors.join('\n')}` : ''),
        },
      ],
    };
  }

  private async getUsageStats(): Promise<any> {
    const stats = this.imageGenerator.getUsageStats();

    return {
      content: [
        {
          type: 'text',
          text: `Image Generation Statistics:\n` +
            `📊 Images generated: ${stats.imagesGenerated}\n` +
            `💰 Total cost: $${stats.totalCost.toFixed(3)}\n` +
            `📈 Average cost per image: $${stats.averageCostPerImage.toFixed(3)}\n` +
            `📅 Monthly usage: $${stats.monthlyUsage.toFixed(3)}\n` +
            `⚡ Cache hit rate: ${(stats.cacheHitRate * 100).toFixed(1)}%`,
        },
      ],
    };
  }

  private async getProcessedArticles(): Promise<any> {
    const articles = Array.from(this.processedArticles.values());

    return {
      content: [
        {
          type: 'json',
          data: articles.map(article => ({
            id: this.getArticleHash(article),
            slug: article.slug,
            title: article.title,
            description: article.summary,
            link: article.link,
            pubDate: article.pubDate.toISOString(),
            content: article.content,
            source: article.source,
            tags: article.tags,
            summary: article.summary,
            guid: article.guid,
            cover: article.cover,
            coverAlt: article.coverAlt,
            coverGenerated: article.coverGenerated,
            fetchedAt: new Date().toISOString()
          }))
        }
      ],
    };
  }

  private createImagePrompt(article: ProcessedArticle, style: string): string {
    const baseStyle = this.getStylePrompt(style);
    const contentContext = this.extractContentContext(article);
    const brandGuidelines = 'Blue color palette matching AI Studio branding (#0ea5e9, #0369a1), minimalist composition, professional appearance';

    return `${contentContext}. ${baseStyle}. ${brandGuidelines}. Professional blog header image, high quality, suitable for AI industry website.`;
  }

  private getStylePrompt(style: string): string {
    const styles = {
      corporate: 'Professional business illustration, clean modern design, corporate aesthetic, high-tech feel',
      creative: 'Creative AI-themed illustration, artistic interpretation, engaging visual metaphor',
      minimal: 'Minimalist abstract illustration, simple geometric shapes, clean composition',
      technical: 'Technical diagram illustration, clean schematic style, precise geometric elements, educational visual',
    };

    return styles[style as keyof typeof styles] || styles.corporate;
  }

  private extractContentContext(article: ProcessedArticle): string {
    const keywords = article.tags.filter(tag => !tag.startsWith('source-')).join(' ');
    const title = article.title;

    const contentMapping = {
      'machine-learning': 'Neural network visualization, interconnected nodes, data flow diagrams',
      'nlp': 'Language processing visualization, text analysis, communication concepts',
      'computer-vision': 'Image recognition concepts, visual AI, camera and analysis imagery',
      'automation': 'Robotic process automation, workflow diagrams, efficiency concepts',
      'research': 'Scientific visualization, data analysis, research methodology imagery',
      'business': 'Corporate AI implementation, business transformation, growth concepts',
      'tutorial': 'Step-by-step visual guide, educational layout, clear progression',
      'news': 'Industry news imagery, technology announcements, innovation concepts',
    };

    for (const [key, context] of Object.entries(contentMapping)) {
      if (keywords.includes(key) || title.toLowerCase().includes(key)) {
        return `${context}, ${title} concept visualization`;
      }
    }

    return `AI technology illustration, business transformation concept, ${title} visualization`;
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
  }
}

const server = new AINewsServer();
server.run().catch(console.error);
