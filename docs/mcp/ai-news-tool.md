# MCP AI News Tool Documentation

## 🤖 Overview

The AI News MCP (Model Context Protocol) server automates the collection and processing of AI industry content from RSS feeds, converting it into ready-to-publish blog posts for the AI Studio website.

## 🚀 Quick Start

### Installation
```bash
# Navigate to MCP directory
cd mcp/ai-news

# Install dependencies
npm install

# Build TypeScript
npm run build

# Start server
npm start
```

### Basic Usage
```bash
# List available RSS feeds
mcp list_feeds

# Fetch recent articles (last 7 days)
mcp fetch_articles --sinceDays 7 --limit 20

# Generate blog posts
mcp write_markdown --outDir ../../src/content/blog
```

## 📡 RSS Feed Sources

### Currently Configured Feeds

| Source | URL | Focus Area | Quality |
|--------|-----|------------|---------|
| **Hugging Face Blog** | `https://huggingface.co/blog/feed.xml` | ML Models & Research | ⭐⭐⭐⭐⭐ |
| **Google AI Blog** | `https://blog.research.google/feeds/posts/default` | Research & Applications | ⭐⭐⭐⭐⭐ |
| **OpenAI Blog** | `https://openai.com/blog/rss.xml` | GPT & AI Safety | ⭐⭐⭐⭐⭐ |
| **Meta AI** | `https://ai.meta.com/blog/rss/` | Research & Open Source | ⭐⭐⭐⭐ |
| **MIT News - AI** | `https://news.mit.edu/topic/mitartificial-intelligence2-rss.xml` | Academic Research | ⭐⭐⭐⭐ |
| **Papers with Code** | `https://paperswithcode.com/feed.xml` | Research Papers | ⭐⭐⭐⭐ |
| **The Gradient** | `https://thegradient.pub/rss/` | AI Analysis | ⭐⭐⭐ |
| **Towards Data Science** | `https://towardsdatascience.com/feed` | Tutorials & Insights | ⭐⭐⭐ |

### Adding New Feeds

Edit `src/feeds.ts` to add more sources:

```typescript
export const AI_FEEDS: FeedSource[] = [
  // Existing feeds...
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
  // Add more feeds here
];
```

## 🔧 MCP Commands

### `list_feeds`
Displays all configured RSS feeds with their status.

```bash
mcp list_feeds
```

**Output:**
```
Available RSS feeds: 8 total, 8 enabled

✅ **Hugging Face Blog**
   URL: https://huggingface.co/blog/feed.xml
   Description: Latest AI research and models from Hugging Face

✅ **Google AI Blog**
   URL: https://blog.research.google/feeds/posts/default
   Description: Google AI research and developments
...
```

### `fetch_articles`
Retrieves articles from enabled RSS feeds.

```bash
mcp fetch_articles [OPTIONS]
```

**Options:**
- `--sinceDays <number>`: Fetch articles from last N days (default: 7)
- `--limit <number>`: Maximum articles to process (default: 50)

**Examples:**
```bash
# Last week's articles
mcp fetch_articles --sinceDays 7

# Last month, limited to 30 articles
mcp fetch_articles --sinceDays 30 --limit 30

# Today's articles only
mcp fetch_articles --sinceDays 1
```

**Output:**
```
Fetched 25 articles from 8 feeds
Errors: 0
Articles processed: 23
Date range: 2025-01-14 to 2025-01-21
```

### `write_markdown`
Converts processed articles to Markdown blog posts.

```bash
mcp write_markdown [OPTIONS]
```

**Options:**
- `--outDir <path>`: Output directory (default: `../../src/content/blog`)
- `--overwrite <boolean>`: Overwrite existing files (default: false)

**Examples:**
```bash
# Standard output to blog directory
mcp write_markdown

# Custom output directory
mcp write_markdown --outDir /custom/path

# Force overwrite existing files
mcp write_markdown --overwrite true
```

**Output:**
```
Markdown files written: 23
Skipped (already exist): 2
Errors: 0
Output directory: /path/to/src/content/blog
```

## 📝 Generated Content Format

### Frontmatter Schema
Each generated blog post includes comprehensive metadata:

```yaml
---
title: "Article Title"
description: "SEO-optimized summary (max 160 chars)"
pubDate: 2025-01-21T10:00:00.000Z
updatedDate: 2025-01-21T10:00:00.000Z
tags: ["ai", "machine-learning", "source-hugging-face"]
source: "Hugging Face Blog"
canonicalUrl: "https://huggingface.co/blog/original-article"
draft: false
---
```

### Content Processing
1. **HTML to Markdown**: Clean conversion preserving structure
2. **Link Preservation**: All links maintained with proper formatting
3. **Image Handling**: Images referenced with alt text
4. **Code Blocks**: Syntax highlighting preserved
5. **Source Attribution**: Footer link to original article

### Auto-Generated Tags
The system intelligently generates relevant tags:

- **Source Tags**: `source-hugging-face`, `source-openai`
- **Topic Tags**: `machine-learning`, `nlp`, `computer-vision`
- **Content Type**: `research`, `tutorial`, `industry-news`
- **Base Tags**: `ai`, `news` (always included)

## 🛠️ Technical Architecture

### Core Components

```
mcp/ai-news/src/
├── server.ts           # Main MCP server
├── types.ts            # TypeScript interfaces
├── feeds.ts            # RSS feed configuration
└── utils/
    ├── parser.ts       # RSS parsing logic
    ├── processor.ts    # Content processing
    └── generator.ts    # Markdown generation
```

### Data Flow

1. **RSS Fetching**: Parallel requests to all enabled feeds
2. **Content Parsing**: Extract title, content, metadata
3. **Deduplication**: Hash-based duplicate detection
4. **Content Processing**: HTML to Markdown conversion
5. **Tag Generation**: AI-powered content classification
6. **File Generation**: Frontmatter + content compilation
7. **Writing**: Save to Astro content directory

### Error Handling

```typescript
// Graceful error handling for RSS feeds
try {
  const feedData = await this.parser.parseURL(feed.url);
  // Process articles...
} catch (error) {
  console.error(`Error fetching ${feed.name}:`, error);
  errorCount++;
  // Continue with other feeds
}
```

## ⚙️ Configuration

### Environment Variables
```bash
# Optional: Custom user agent for RSS requests
RSS_USER_AGENT="AI Studio News Fetcher 1.0"

# Optional: Request timeout (milliseconds)
RSS_TIMEOUT=10000
```

### Feed Configuration
```typescript
// src/feeds.ts
interface FeedSource {
  name: string;           // Display name
  url: string;            // RSS feed URL
  description: string;    // Feed description
  enabled: boolean;       // Enable/disable feed
}
```

### Processing Options
```typescript
// Content processing configuration
const turndownOptions = {
  headingStyle: 'atx',         // # headings
  hr: '---',                   // Horizontal rules
  bulletListMarker: '-',       // List markers
  codeBlockStyle: 'fenced',    // ```code blocks
};
```

## 🚨 Troubleshooting

### Common Issues

#### 1. No Articles Fetched
```bash
# Check feed URLs are accessible
curl -I https://huggingface.co/blog/feed.xml

# Verify date range
mcp fetch_articles --sinceDays 30 --limit 100
```

#### 2. Permission Errors
```bash
# Check output directory permissions
ls -la ../../src/content/blog/

# Create directory if missing
mkdir -p ../../src/content/blog/
```

#### 3. Build Errors
```bash
# Rebuild TypeScript
npm run build

# Clear and reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### 4. Malformed Content
```bash
# Check specific feed
mcp fetch_articles --sinceDays 1
# Review generated content for errors
```

### Debug Mode
```bash
# Enable verbose logging
DEBUG=mcp:* npm start

# Or set environment variable
export DEBUG=mcp:*
mcp fetch_articles
```

## 📊 Performance Optimization

### Caching Strategy
- **Feed Caching**: RSS responses cached for 15 minutes
- **Duplicate Detection**: MD5 hashing for efficient deduplication
- **Incremental Updates**: Only process new articles since last run

### Resource Management
```typescript
// Concurrent feed processing with limits
const MAX_CONCURRENT_FEEDS = 5;
const TIMEOUT_MS = 10000;
const MAX_ARTICLES_PER_FEED = 20;
```

### Memory Efficiency
- **Streaming Processing**: Articles processed individually
- **Garbage Collection**: Automatic cleanup of processed data
- **Connection Pooling**: Reuse HTTP connections where possible

## 🔄 Automation Setup

### Cron Job (Linux/macOS)
```bash
# Edit crontab
crontab -e

# Add weekly import (Mondays at 9 AM)
0 9 * * 1 cd /path/to/ai-studio/mcp/ai-news && npm start && mcp fetch_articles && mcp write_markdown

# Add daily import (6 AM)
0 6 * * * cd /path/to/ai-studio/mcp/ai-news && npm start && mcp fetch_articles --sinceDays 1 && mcp write_markdown
```

### GitHub Actions
```yaml
# .github/workflows/import-content.yml
name: Import AI News
on:
  schedule:
    - cron: '0 6 * * *'  # Daily at 6 AM UTC

jobs:
  import:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd mcp/ai-news && npm install
      - run: cd mcp/ai-news && npm run build
      - run: cd mcp/ai-news && npm start &
      - run: sleep 5 && mcp fetch_articles && mcp write_markdown
      - run: git add . && git commit -m "content: daily AI news import" && git push
```

## 📈 Monitoring & Analytics

### Content Metrics
```bash
# Count imported articles
ls -1 ../../src/content/blog/ | wc -l

# Articles by source
grep -r "source:" ../../src/content/blog/ | sort | uniq -c

# Recent imports
find ../../src/content/blog/ -name "*.md" -mtime -7
```

### Quality Checks
```bash
# Validate frontmatter
npm run content:check

# Check for broken links
grep -r "http" ../../src/content/blog/ | grep -E "\[.*\]\(.*\)"

# Verify tag consistency
grep -r "tags:" ../../src/content/blog/ | sort | uniq
```

This MCP tool provides a robust foundation for automated AI content curation, ensuring your blog stays current with the latest industry developments while maintaining high quality and consistency.