#!/usr/bin/env node

import express from 'express';
import cors from 'cors';
import { spawn, ChildProcess } from 'child_process';
import { EventEmitter } from 'events';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { join } from 'path';
import process from 'process';
import { DataManager, type StoredArticle } from './data-manager.js';

// Setup global error handlers for unhandled promise rejections
process.on('unhandledRejection', (reason: unknown, promise: Promise<any>) => {
  console.error('Unhandled Promise Rejection at:', promise, 'reason:', reason);
  // Don't terminate in production, just log
  if (process.env.NODE_ENV !== 'production') {
    process.exit(1);
  }
});

process.on('uncaughtException', (error: Error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

interface MCPRequest {
  method: string;
  params: {
    name: string;
    arguments?: any;
  };
}

interface MCPResponse {
  content: Array<{
    type: string;
    text: string;
  }>;
}

// StoredArticle interface moved to data-manager.ts

class MCPHttpServer extends EventEmitter {
  private app: express.Application;
  private mcpProcess: ChildProcess | null = null;
  private requestId = 0;
  private pendingRequests = new Map<number, { resolve: Function; reject: Function }>();
  private connected = false;
  private dataManager: DataManager;

  constructor(private port: number = 3001) {
    super();
    this.app = express();
    const articlesStoragePath = join(__dirname, '../../data/articles.json');
    this.dataManager = new DataManager(articlesStoragePath);
    this.initializeDataManager();
    this.setupMiddleware();
    this.setupRoutes();
  }

  // Data manager initialization
  private async initializeDataManager(): Promise<void> {
    try {
      await this.dataManager.initialize();
    } catch (error) {
      console.error('Failed to initialize data manager:', error);
    }
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 100);
  }

  private generateTags(source: string, content: string): string[] {
    const tags: Set<string> = new Set(['ai', 'news']);

    // Add source-based tag
    const sourceTag = source.toLowerCase().replace(/[^\w]/g, '-');
    tags.add(`source-${sourceTag}`);

    // Extract tags from content
    const text = content.toLowerCase();

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

    return Array.from(tags).slice(0, 8);
  }

  private setupMiddleware() {
    this.app.use(cors());
    this.app.use(express.json());

    // Logging middleware
    this.app.use((req, res, next) => {
      console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
      next();
    });
  }

  private setupRoutes() {
    // Health check
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'ok',
        mcp_connected: this.connected,
        timestamp: new Date().toISOString()
      });
    });

    // List available RSS feeds
    this.app.get('/api/feeds', async (req, res) => {
      try {
        const result = await this.callMCPTool('list_feeds', {});
        res.json(result);
      } catch (error) {
        res.status(500).json({
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });

    // Fetch articles from RSS feeds
    this.app.post('/api/articles/fetch', async (req, res) => {
      try {
        const { sinceDays = 7, limit = 50 } = req.body;

        // First, fetch articles from RSS feeds
        const fetchResult = await this.callMCPTool('fetch_articles', { sinceDays, limit });

        // Then get the processed articles in structured format
        const articlesResult = await this.callMCPTool('get_processed_articles', {});

        // Process and store articles
        if (articlesResult.content && articlesResult.content[0]) {
          const contentItem = articlesResult.content[0] as any;
          if (contentItem.data) {
            const rawArticles = contentItem.data;

            // Use DataManager for atomic updates with race condition protection
            const processedArticles = await this.dataManager.updateArticles(rawArticles);
            console.log(`Processed and stored ${processedArticles.length} articles`);
          }
        }

        res.json({
          fetch_result: fetchResult,
          articles_processed: this.dataManager.getStats().totalArticles,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error('Error in fetch articles:', error);
        res.status(500).json({
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });

    // Get processed articles (after fetching)
    this.app.get('/api/articles', async (req, res) => {
      try {
        const { limit = 50, offset = 0, tag } = req.query;

        const limitNum = parseInt(limit as string) || 50;
        const offsetNum = parseInt(offset as string) || 0;

        // Use DataManager for efficient filtering and pagination
        const result = this.dataManager.getArticles({
          limit: limitNum,
          offset: offsetNum,
          tag: tag as string
        });

        if (result.total === 0) {
          res.json({
            articles: [],
            total: 0,
            offset: offsetNum,
            limit: limitNum,
            message: 'No articles found. Use POST /api/articles/fetch first to load articles.'
          });
          return;
        }

        res.json({
          articles: result.articles,
          total: result.total,
          offset: offsetNum,
          limit: limitNum,
          stats: this.dataManager.getStats()
        });
      } catch (error) {
        res.status(500).json({
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });

    // Generate images for articles
    this.app.post('/api/images/generate', async (req, res) => {
      try {
        const { style = 'corporate', regenerate = false, dryRun = false } = req.body;
        const result = await this.callMCPTool('generate_images', { style, regenerate, dryRun });
        res.json(result);
      } catch (error) {
        res.status(500).json({
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });

    // Write articles as markdown files
    this.app.post('/api/articles/write', async (req, res) => {
      try {
        const { outDir, overwrite = false, includeImages = true } = req.body;
        const result = await this.callMCPTool('write_markdown', { outDir, overwrite, includeImages });
        res.json(result);
      } catch (error) {
        res.status(500).json({
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });

    // Get usage statistics
    this.app.get('/api/usage', async (req, res) => {
      try {
        const result = await this.callMCPTool('get_usage_stats', {});
        res.json(result);
      } catch (error) {
        res.status(500).json({
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });
  }

  private async callMCPTool(toolName: string, args: any): Promise<MCPResponse> {
    if (!this.connected || !this.mcpProcess) {
      throw new Error('MCP server not connected');
    }

    const requestId = ++this.requestId;
    const request: MCPRequest = {
      method: 'tools/call',
      params: {
        name: toolName,
        arguments: args,
      },
    };

    const message = JSON.stringify({
      jsonrpc: '2.0',
      id: requestId,
      ...request,
    });

    return new Promise((resolve, reject) => {
      this.pendingRequests.set(requestId, { resolve, reject });

      // Set timeout for request
      setTimeout(() => {
        if (this.pendingRequests.has(requestId)) {
          this.pendingRequests.delete(requestId);
          reject(new Error('Request timeout'));
        }
      }, 30000); // 30 second timeout

      this.mcpProcess?.stdin?.write(message + '\n');
    });
  }

  private startMCPServer() {
    const serverPath = './dist/server.js';

    console.log('Starting MCP server...');
    this.mcpProcess = spawn('node', [serverPath], {
      stdio: ['pipe', 'pipe', 'pipe'],
      cwd: process.cwd(),
    });

    if (!this.mcpProcess.stdout || !this.mcpProcess.stderr || !this.mcpProcess.stdin) {
      throw new Error('Failed to create MCP process streams');
    }

    let buffer = '';
    this.mcpProcess.stdout.on('data', (data: Buffer) => {
      buffer += data.toString();
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.trim()) {
          try {
            const response = JSON.parse(line);
            if (response.id && this.pendingRequests.has(response.id)) {
              const { resolve, reject } = this.pendingRequests.get(response.id)!;
              this.pendingRequests.delete(response.id);

              if (response.error) {
                reject(new Error(response.error.message || 'MCP error'));
              } else {
                resolve(response.result);
              }
            }
          } catch (error) {
            console.error('Failed to parse MCP response:', line, error);
          }
        }
      }
    });

    this.mcpProcess.stderr.on('data', (data: Buffer) => {
      console.error('MCP stderr:', data.toString());
    });

    this.mcpProcess.on('close', (code) => {
      console.log(`MCP server exited with code ${code}`);
      this.connected = false;
      this.mcpProcess = null;

      // Reject all pending requests
      for (const [id, { reject }] of this.pendingRequests) {
        reject(new Error('MCP server disconnected'));
      }
      this.pendingRequests.clear();
    });

    this.mcpProcess.on('error', (error) => {
      console.error('MCP server error:', error);
      this.connected = false;
    });

    // Send initialization message
    setTimeout(() => {
      const initMessage = JSON.stringify({
        jsonrpc: '2.0',
        id: 0,
        method: 'initialize',
        params: {
          protocolVersion: '2024-11-05',
          capabilities: {
            tools: {},
          },
          clientInfo: {
            name: 'ai-studio-http-bridge',
            version: '1.0.0',
          },
        },
      });

      this.mcpProcess?.stdin?.write(initMessage + '\n');

      // Mark as connected after short delay
      setTimeout(() => {
        this.connected = true;
        console.log('MCP server connected and initialized');
      }, 1000);
    }, 500);
  }

  public async start(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.startMCPServer();

        this.app.listen(this.port, () => {
          console.log(`HTTP server running on port ${this.port}`);
          console.log(`Health check: http://localhost:${this.port}/health`);
          resolve();
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  public stop() {
    if (this.mcpProcess) {
      this.mcpProcess.kill();
      this.mcpProcess = null;
    }
    this.connected = false;
  }
}

// Module scope variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Check if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  const port = process.env.PORT ? parseInt(process.env.PORT) : 3001;
  const server = new MCPHttpServer(port);

  server.start().catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });

  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log('\nShutting down gracefully...');
    server.stop();
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    console.log('\nShutting down gracefully...');
    server.stop();
    process.exit(0);
  });
}

export default MCPHttpServer;