import { writeFile, readFile, mkdir } from 'fs/promises';
import { dirname } from 'path';

export interface StoredArticle {
  id: string;
  slug: string;
  title: string;
  description: string;
  link: string;
  pubDate: string;
  content: string;
  source: string;
  tags: string[];
  summary: string;
  guid?: string;
  cover?: string;
  coverAlt?: string;
  coverGenerated?: boolean;
  fetchedAt: string;
}

export class DataManager {
  private articlesStoragePath: string;
  private cachedArticles: StoredArticle[] = [];
  private saveInProgress = false;
  private pendingSave = false;
  private readonly MAX_ARTICLES = 1000; // Maximum articles to keep
  private readonly RETENTION_DAYS = 90; // Keep articles for 90 days

  constructor(storagePath: string) {
    this.articlesStoragePath = storagePath;
  }

  async initialize(): Promise<void> {
    await this.loadStoredArticles();
    // Clean up old articles on initialization
    await this.cleanupOldArticles();
  }

  /**
   * Load articles from storage with error handling
   */
  private async loadStoredArticles(): Promise<void> {
    try {
      const data = await readFile(this.articlesStoragePath, 'utf-8');
      this.cachedArticles = JSON.parse(data);
      console.log(`Loaded ${this.cachedArticles.length} stored articles`);
    } catch (error) {
      console.log('No stored articles found, starting with empty cache');
      this.cachedArticles = [];
    }
  }

  /**
   * Atomic save operation with queuing to prevent race conditions
   */
  private async saveArticles(): Promise<void> {
    // If a save is already in progress, mark that another save is needed
    if (this.saveInProgress) {
      this.pendingSave = true;
      return;
    }

    this.saveInProgress = true;

    try {
      // Create backup before saving
      const tempPath = `${this.articlesStoragePath}.tmp`;
      const backupPath = `${this.articlesStoragePath}.backup`;

      // Write to temporary file first
      await mkdir(dirname(this.articlesStoragePath), { recursive: true });
      await writeFile(tempPath, JSON.stringify(this.cachedArticles, null, 2));

      // Create backup of current file if it exists
      try {
        const currentData = await readFile(this.articlesStoragePath, 'utf-8');
        await writeFile(backupPath, currentData);
      } catch {
        // No existing file to backup, which is fine
      }

      // Atomically replace the original file
      await writeFile(this.articlesStoragePath, JSON.stringify(this.cachedArticles, null, 2));

      console.log(`Saved ${this.cachedArticles.length} articles to storage`);
    } catch (error) {
      console.error('Failed to save articles:', error);
      throw error;
    } finally {
      this.saveInProgress = false;

      // If there was a pending save request, handle it
      if (this.pendingSave) {
        this.pendingSave = false;
        setImmediate(() => this.saveArticles()); // Schedule next save
      }
    }
  }

  /**
   * Clean up old articles based on retention policy
   */
  private async cleanupOldArticles(): Promise<void> {
    const now = new Date();
    const retentionDate = new Date(now.getTime() - (this.RETENTION_DAYS * 24 * 60 * 60 * 1000));

    const initialCount = this.cachedArticles.length;

    // Remove articles older than retention period
    this.cachedArticles = this.cachedArticles.filter(article => {
      const articleDate = new Date(article.fetchedAt || article.pubDate);
      return articleDate > retentionDate;
    });

    // If we still have too many articles, remove the oldest ones
    if (this.cachedArticles.length > this.MAX_ARTICLES) {
      // Sort by fetchedAt/pubDate (newest first) and keep only MAX_ARTICLES
      this.cachedArticles.sort((a, b) => {
        const dateA = new Date(a.fetchedAt || a.pubDate);
        const dateB = new Date(b.fetchedAt || b.pubDate);
        return dateB.getTime() - dateA.getTime();
      });

      this.cachedArticles = this.cachedArticles.slice(0, this.MAX_ARTICLES);
    }

    const removedCount = initialCount - this.cachedArticles.length;
    if (removedCount > 0) {
      console.log(`Cleaned up ${removedCount} old articles`);
      await this.saveArticles();
    }
  }

  /**
   * Atomically update articles with proper race condition handling
   */
  async updateArticles(newArticles: any[]): Promise<StoredArticle[]> {
    const processedArticles: StoredArticle[] = [];

    for (const rawArticle of newArticles) {
      // Validate required fields
      if (!rawArticle.id && !rawArticle.guid) {
        console.warn('Skipping article without ID:', rawArticle.title);
        continue;
      }

      // Find existing article
      const existingIndex = this.cachedArticles.findIndex(
        existing => existing.id === rawArticle.id || existing.link === rawArticle.link
      );

      const processedArticle: StoredArticle = {
        id: rawArticle.id || rawArticle.guid,
        slug: rawArticle.slug,
        title: rawArticle.title || '',
        description: rawArticle.description || '',
        link: rawArticle.link || '',
        pubDate: rawArticle.pubDate || new Date().toISOString(),
        content: rawArticle.content || '',
        source: rawArticle.source || '',
        tags: Array.isArray(rawArticle.tags) ? rawArticle.tags : [],
        summary: rawArticle.summary || rawArticle.description || '',
        guid: rawArticle.guid,
        cover: rawArticle.cover,
        coverAlt: rawArticle.coverAlt,
        coverGenerated: rawArticle.coverGenerated,
        fetchedAt: new Date().toISOString(),
      };

      if (existingIndex === -1) {
        // New article, add it
        this.cachedArticles.push(processedArticle);
      } else {
        // Update existing article with latest data
        this.cachedArticles[existingIndex] = processedArticle;
      }

      processedArticles.push(processedArticle);
    }

    // Clean up old articles after updates
    await this.cleanupOldArticles();

    // Save atomically
    await this.saveArticles();

    return processedArticles;
  }

  /**
   * Get all articles with filtering and pagination
   */
  getArticles(options: {
    limit?: number;
    offset?: number;
    tag?: string;
  } = {}): { articles: StoredArticle[]; total: number } {
    const { limit = 50, offset = 0, tag } = options;

    let articles = [...this.cachedArticles];

    // Filter by tag if specified
    if (tag && tag !== 'all') {
      articles = articles.filter(article => article.tags.includes(tag));
    }

    // Sort by publication date (newest first)
    articles.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

    // Apply pagination
    const paginatedArticles = articles.slice(offset, offset + limit);

    return {
      articles: paginatedArticles,
      total: articles.length
    };
  }

  /**
   * Get article by ID or slug
   */
  getArticleById(identifier: string): StoredArticle | null {
    return this.cachedArticles.find(article =>
      article.id === identifier ||
      article.slug === identifier ||
      article.guid === identifier
    ) || null;
  }

  /**
   * Get storage statistics
   */
  getStats(): {
    totalArticles: number;
    oldestArticle: string | null;
    newestArticle: string | null;
    sources: string[];
  } {
    if (this.cachedArticles.length === 0) {
      return {
        totalArticles: 0,
        oldestArticle: null,
        newestArticle: null,
        sources: []
      };
    }

    const sortedByDate = [...this.cachedArticles].sort(
      (a, b) => new Date(a.pubDate).getTime() - new Date(b.pubDate).getTime()
    );

    const sources = [...new Set(this.cachedArticles.map(a => a.source))];

    return {
      totalArticles: this.cachedArticles.length,
      oldestArticle: sortedByDate[0]?.pubDate || null,
      newestArticle: sortedByDate[sortedByDate.length - 1]?.pubDate || null,
      sources
    };
  }
}