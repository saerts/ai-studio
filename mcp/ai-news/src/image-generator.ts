import OpenAI from 'openai';
import sharp from 'sharp';
import { mkdir, access } from 'fs/promises';
import { createHash } from 'crypto';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import type { ProcessedArticle } from './types.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

export interface ImageConfig {
  enabled: boolean;
  style: 'corporate' | 'creative' | 'minimal' | 'technical';
  size: '1792x1024' | '1024x1024' | '1024x1792';
  quality: 'standard' | 'hd';
  format: 'webp' | 'png' | 'jpg';
  monthlyBudget: number;
  batchSize: number;
  cacheDuration: number;
}

export interface ImageGenerationResult {
  success: boolean;
  imagePath?: string;
  altText?: string;
  cost: number;
  error?: string;
  cached?: boolean;
}

export interface UsageStats {
  imagesGenerated: number;
  totalCost: number;
  averageCostPerImage: number;
  monthlyUsage: number;
  cacheHitRate: number;
}

export class AIImageGenerator {
  private openai?: OpenAI;
  private config: ImageConfig;
  private cache = new Map<string, string>();
  private usageStats: UsageStats;

  constructor(config: Partial<ImageConfig> = {}) {
    const apiKey = process.env.OPENAI_API_KEY;

    // Initialize OpenAI client only if API key is present
    if (apiKey) {
      this.openai = new OpenAI({
        apiKey,
        organization: process.env.OPENAI_ORG_ID,
      });
    }

    // Build configuration with sensible defaults
    this.config = {
      // Disabled by default; can be enabled via env or config, but requires API key
      enabled: process.env.IMAGE_GENERATION_ENABLED === 'true',
      style: (process.env.DEFAULT_IMAGE_STYLE as ImageConfig['style']) || 'corporate',
      size: '1792x1024',
      quality: 'standard',
      format: 'webp',
      monthlyBudget: parseFloat(process.env.IMAGE_MONTHLY_BUDGET || '50'),
      batchSize: parseInt(process.env.IMAGE_BATCH_SIZE || '3'),
      cacheDuration: parseInt(process.env.IMAGE_CACHE_DURATION || '7776000'), // 90 days
      ...config,
    };

    // If no API key, force-disable image generation regardless of config
    if (!apiKey) {
      this.config.enabled = false;
    }

    this.usageStats = {
      imagesGenerated: 0,
      totalCost: 0,
      averageCostPerImage: 0,
      monthlyUsage: 0,
      cacheHitRate: 0,
    };
  }

  async generateImageForArticle(article: ProcessedArticle): Promise<ImageGenerationResult> {
    if (!this.config.enabled) {
      return { success: false, cost: 0, error: 'Image generation disabled' };
    }

    try {
      // Check budget
      if (!await this.checkBudget()) {
        return { success: false, cost: 0, error: 'Monthly budget exceeded' };
      }

      // Check cache
      const contentHash = this.getContentHash(article);
      const cachedPath = await this.getCachedImage(contentHash);
      if (cachedPath) {
        return {
          success: true,
          imagePath: cachedPath,
          altText: await this.generateAltText(article),
          cost: 0,
          cached: true,
        };
      }

      // Generate image
      const prompt = this.createPrompt(article);
      const imageUrl = await this.generateImage(prompt);
      const imagePath = await this.downloadAndOptimize(imageUrl, article.slug);
      const altText = await this.generateAltText(article, prompt);

      // Cache result
      this.setCachedImage(contentHash, imagePath);

      // Track usage
      const cost = this.getCostForSize(this.config.size);
      await this.trackUsage(cost);

      return {
        success: true,
        imagePath,
        altText,
        cost,
        cached: false,
      };
    } catch (error) {
      console.error('Image generation failed:', error);
      return {
        success: false,
        cost: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private createPrompt(article: ProcessedArticle): string {
    const baseStyle = this.getStylePrompt(this.config.style);
    const contentContext = this.extractContentContext(article);
    const brandGuidelines = this.getBrandGuidelines();

    return `${contentContext}. ${baseStyle}. ${brandGuidelines}. Professional blog header image, high quality, suitable for AI industry website.`;
  }

  private getStylePrompt(style: ImageConfig['style']): string {
    const styles = {
      corporate: 'Professional business illustration, clean modern design, corporate aesthetic, high-tech feel',
      creative: 'Creative AI-themed illustration, artistic interpretation, engaging visual metaphor',
      minimal: 'Minimalist abstract illustration, simple geometric shapes, clean composition',
      technical: 'Technical diagram illustration, clean schematic style, precise geometric elements, educational visual',
    };

    return styles[style];
  }

  private extractContentContext(article: ProcessedArticle): string {
    // Analyze tags to determine visual context
    const keywords = article.tags.filter(tag => !tag.startsWith('source-')).join(' ');
    const title = article.title;

    // Map content types to visual concepts
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

    // Find best matching context
    for (const [key, context] of Object.entries(contentMapping)) {
      if (keywords.includes(key) || title.toLowerCase().includes(key)) {
        return `${context}, ${title} concept visualization`;
      }
    }

    // Default to business context
    return `AI technology illustration, business transformation concept, ${title} visualization`;
  }

  private getBrandGuidelines(): string {
    return 'Blue color palette matching AI Studio branding (#0ea5e9, #0369a1), minimalist composition, trustworthy professional appearance, white background';
  }

  private async generateImage(prompt: string): Promise<string> {
    if (!this.openai) {
      throw new Error('Image generation disabled: OpenAI API key not configured');
    }

    const response = await this.openai.images.generate({
      model: 'dall-e-3',
      prompt: prompt,
      size: this.config.size,
      quality: this.config.quality,
      style: 'natural', // More realistic for business content
      response_format: 'url',
    });

    if (!response.data || response.data.length === 0) {
      throw new Error('No image data returned from OpenAI');
    }

    const imageUrl = response.data[0]?.url;
    if (!imageUrl) {
      throw new Error('No image URL returned from OpenAI');
    }

    return imageUrl;
  }

  private async downloadAndOptimize(imageUrl: string, slug: string): Promise<string> {
    // Download original image
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.statusText}`);
    }

    const buffer = await response.arrayBuffer();

    // Create directories
    const imageDir = join(__dirname, '../../../public/blog/images');
    await mkdir(imageDir, { recursive: true });

    // Generate filename
    const timestamp = Date.now();
    const filename = `${slug}-${timestamp}`;

    // Optimize and save in multiple formats/sizes
    const optimizedPath = await this.createOptimizedVersions(Buffer.from(buffer), imageDir, filename);

    return optimizedPath;
  }

  private async createOptimizedVersions(
    buffer: Buffer,
    imageDir: string,
    filename: string
  ): Promise<string> {
    const sizes = [400, 800, 1200, 1600];
    const formats = ['webp', 'jpg'];

    let mainImagePath = '';

    for (const size of sizes) {
      for (const format of formats) {
        const outputPath = join(imageDir, `${filename}-${size}w.${format}`);

        await sharp(buffer)
          .resize(size, Math.round(size * 0.5625), { // Maintain 16:9 aspect ratio
            fit: 'cover',
            position: 'center',
          })
          .toFormat(format as keyof sharp.FormatEnum, {
            quality: format === 'webp' ? 85 : 80,
            progressive: true,
          })
          .toFile(outputPath);

        // Set main image (WebP, 1200w)
        if (format === 'webp' && size === 1200) {
          mainImagePath = `/blog/images/${filename}-${size}w.${format}`;
        }
      }
    }

    return mainImagePath;
  }

  private async generateAltText(article: ProcessedArticle, prompt?: string): Promise<string> {
    const visualElements = this.extractVisualElements(article, prompt);
    const altText = `Professional illustration for "${article.title}". ${visualElements} Modern blue and white design for AI industry blog post.`;

    return this.sanitizeAltText(altText);
  }

  private extractVisualElements(article: ProcessedArticle, prompt?: string): string {
    if (prompt) {
      // Extract key visual elements from prompt
      const concepts = prompt.match(/\b(visualization|diagram|network|analysis|automation|concept|illustration)\b/gi);
      return concepts ? concepts.slice(0, 3).join(', ') : 'AI technology concepts';
    }

    // Fallback to tag-based description
    const relevantTags = article.tags.filter(tag => !tag.startsWith('source-') && tag !== 'ai' && tag !== 'news');
    return relevantTags.length > 0 ? relevantTags.slice(0, 3).join(', ') : 'AI technology concepts';
  }

  private sanitizeAltText(text: string): string {
    return text
      .replace(/image of|picture of|illustration of/gi, '')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 125);
  }

  private getContentHash(article: ProcessedArticle): string {
    const hashString = `${article.title}${article.tags.join(',')}${this.config.style}`;
    return createHash('md5').update(hashString).digest('hex');
  }

  private async getCachedImage(contentHash: string): Promise<string | null> {
    const cached = this.cache.get(contentHash);
    if (cached && await this.fileExists(cached)) {
      return cached;
    }
    return null;
  }

  private setCachedImage(contentHash: string, imagePath: string): void {
    this.cache.set(contentHash, imagePath);
  }

  private async fileExists(path: string): Promise<boolean> {
    try {
      const fullPath = join(__dirname, '../../../public', path);
      await access(fullPath);
      return true;
    } catch {
      return false;
    }
  }

  private getCostForSize(size: string): number {
    // DALL-E 3 pricing (as of 2024)
    const costs = {
      '1024x1024': 0.04,
      '1792x1024': 0.08,
      '1024x1792': 0.08,
    };
    return costs[size as keyof typeof costs] || 0.04;
  }

  private async checkBudget(): Promise<boolean> {
    return this.usageStats.monthlyUsage < this.config.monthlyBudget;
  }

  private async trackUsage(cost: number): Promise<void> {
    this.usageStats.imagesGenerated++;
    this.usageStats.totalCost += cost;
    this.usageStats.monthlyUsage += cost;
    this.usageStats.averageCostPerImage = this.usageStats.totalCost / this.usageStats.imagesGenerated;

    // Log usage for monitoring
    console.log(`Image generated. Cost: $${cost.toFixed(3)}, Monthly total: $${this.usageStats.monthlyUsage.toFixed(2)}`);
  }

  async batchGenerateImages(articles: ProcessedArticle[]): Promise<ImageGenerationResult[]> {
    const results: ImageGenerationResult[] = [];
    const batchSize = this.config.batchSize;

    for (let i = 0; i < articles.length; i += batchSize) {
      const batch = articles.slice(i, i + batchSize);

      const batchResults = await Promise.all(
        batch.map(article => this.generateImageForArticle(article))
      );

      results.push(...batchResults);

      // Rate limiting: wait between batches
      if (i + batchSize < articles.length) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay
      }
    }

    return results;
  }

  getUsageStats(): UsageStats {
    return { ...this.usageStats };
  }

  resetMonthlyUsage(): void {
    this.usageStats.monthlyUsage = 0;
  }
}
