# Blog Translation Integration Guide

This guide shows how to integrate the `translate-server` MCP with your AI Studio blog workflow to automatically translate articles to Dutch.

## Setup for Claude Desktop

### 1. Update Claude Desktop Configuration

Add the translate-server to your Claude Desktop configuration file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "translate-server": {
      "command": "node",
      "args": ["/absolute/path/to/ai-studio/mcp/translate-server/dist/server.js"],
      "env": {
        "OPENAI_API_KEY": "your-openai-api-key-here"
      }
    },
    "ai-news": {
      "command": "node",
      "args": ["/absolute/path/to/ai-studio/mcp/ai-news/dist/server.js"],
      "env": {
        "OPENAI_API_KEY": "your-openai-api-key-here"
      }
    }
  }
}
```

### 2. Environment Setup

Make sure you have the OpenAI API key set up:

```bash
export OPENAI_API_KEY="your-openai-api-key"
```

## Blog Translation Workflow

### Method 1: Using Claude Desktop (Recommended)

Once the MCP server is connected, you can use these commands in Claude Desktop:

1. **Detect article language**:
   ```
   Use the detect_language tool to identify the language of this blog post:
   [paste your blog content here]
   ```

2. **Translate complete blog post**:
   ```
   Use the translate_blog_post tool to translate this article to Dutch:
   [paste your complete blog post with frontmatter here]
   ```

3. **Translate specific text**:
   ```
   Use the translate_to_dutch tool to translate this text:
   "Your text here"
   ```

### Method 2: Using the HTTP API

For programmatic access or integration with other tools:

```bash
# Start the HTTP server
cd mcp/translate-server
npm run start:http
```

Then use the REST endpoints:

```bash
# Detect language
curl -X POST http://localhost:3002/detect-language \
  -H "Content-Type: application/json" \
  -d '{"text": "Your blog content here"}'

# Translate blog post
curl -X POST http://localhost:3002/translate-blog \
  -H "Content-Type: application/json" \
  -d '{"content": "Complete blog post with frontmatter"}'
```

## Integration with Existing AI-News Workflow

### Enhanced Content Pipeline

1. **Fetch Articles** (existing ai-news MCP)
   ```
   Use mcp fetch_articles to get latest AI news
   ```

2. **Generate Images** (existing ai-news MCP)
   ```
   Use mcp generate_images for the fetched articles
   ```

3. **Translate to Dutch** (new translate-server MCP)
   ```
   Use translate_blog_post to create Dutch versions
   ```

4. **Organize Content**
   - Save original articles in `src/content/blog/en/`
   - Save Dutch translations in `src/content/blog/nl/`

### Batch Translation Script

Create a batch processing script for multiple articles:

```javascript
// batch-translate.js
import fs from 'fs';
import path from 'path';
import { translateBlogPost } from './example-usage.js';

async function translateBlogDirectory(sourceDir, targetDir) {
  const files = fs.readdirSync(sourceDir);

  for (const file of files) {
    if (file.endsWith('.md')) {
      console.log(`Translating ${file}...`);

      const content = fs.readFileSync(path.join(sourceDir, file), 'utf-8');
      const result = await translateBlogPost(content);

      if (result && !result.alreadyInDutch) {
        const outputPath = path.join(targetDir, file);
        fs.writeFileSync(outputPath, result.translatedContent, 'utf-8');
        console.log(`✅ Translated ${file} -> ${outputPath}`);
      }
    }
  }
}

// Usage: node batch-translate.js
translateBlogDirectory('../../src/content/blog/en', '../../src/content/blog/nl');
```

## Astro Content Collections Setup

Update your Astro content collections to support multiple languages:

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('AI Studio'),
    tags: z.array(z.string()),
    heroImage: z.string().optional(),
    originalLanguage: z.string().optional(), // Added for translated content
    originalUrl: z.string().optional(),       // Link to original article
  }),
});

export const collections = {
  // English blog posts
  'blog-en': blogCollection,
  // Dutch blog posts
  'blog-nl': blogCollection,
};
```

## URL Structure for Multilingual Content

### Option 1: Language Prefixes
- English: `/blog/en/article-title/`
- Dutch: `/blog/nl/artikel-titel/`

### Option 2: Separate Domains/Subdomains
- English: `en.aistudio.com/blog/article-title/`
- Dutch: `nl.aistudio.com/blog/artikel-titel/`

### Option 3: Language Detection
- Auto-detect user language and redirect accordingly
- Use `navigator.language` and server-side detection

## SEO Considerations for Translated Content

### Hreflang Implementation

Add hreflang tags to indicate language relationships:

```html
<!-- In English article -->
<link rel="alternate" hreflang="en" href="https://aistudio.com/blog/en/ai-web-development/" />
<link rel="alternate" hreflang="nl" href="https://aistudio.com/blog/nl/ai-webontwikkeling/" />

<!-- In Dutch article -->
<link rel="alternate" hreflang="nl" href="https://aistudio.com/blog/nl/ai-webontwikkeling/" />
<link rel="alternate" hreflang="en" href="https://aistudio.com/blog/en/ai-web-development/" />
```

### Astro Component Example

```astro
---
// src/components/HreflangLinks.astro
export interface Props {
  originalSlug?: string;
  translatedSlug?: string;
  originalLang?: string;
  currentLang: string;
}

const { originalSlug, translatedSlug, originalLang = 'en', currentLang } = Astro.props;
const baseUrl = 'https://aistudio.com/blog';
---

{originalSlug && (
  <link rel="alternate" hreflang={originalLang} href={`${baseUrl}/${originalLang}/${originalSlug}/`} />
)}

{translatedSlug && (
  <link rel="alternate" hreflang="nl" href={`${baseUrl}/nl/${translatedSlug}/`} />
)}

<link rel="alternate" hreflang="x-default" href={`${baseUrl}/${originalLang}/${originalSlug || translatedSlug}/`} />
```

## Content Management Workflow

### Daily Workflow with Translation

1. **Morning**: Fetch latest AI news
   ```bash
   # In Claude Desktop or via HTTP
   mcp fetch_articles --since-days 1
   ```

2. **Generate images for new articles**
   ```bash
   mcp generate_images --style corporate
   ```

3. **Translate articles to Dutch**
   ```bash
   # For each new article
   translate_blog_post [article content]
   ```

4. **Review and publish**
   - Review translations for accuracy
   - Adjust technical terms if needed
   - Publish both languages simultaneously

### Quality Assurance for Translations

1. **Technical Term Consistency**
   - Maintain a glossary of technical terms
   - Ensure consistent translation of AI/tech terminology

2. **Cultural Adaptation**
   - Adapt examples and references to Dutch context
   - Consider local regulations (GDPR, etc.)

3. **SEO Optimization**
   - Research Dutch keywords
   - Optimize meta descriptions for Dutch search
   - Use appropriate Dutch technical terminology

## Monitoring and Analytics

### Track Translation Performance

```javascript
// analytics.js - Track translation usage
const translationMetrics = {
  articlesTranslated: 0,
  charactersProcessed: 0,
  averageTranslationTime: 0,
  languagesDetected: {},

  logTranslation(originalLength, translatedLength, timeMs, detectedLang) {
    this.articlesTranslated++;
    this.charactersProcessed += originalLength;
    this.averageTranslationTime = (this.averageTranslationTime + timeMs) / 2;
    this.languagesDetected[detectedLang] = (this.languagesDetected[detectedLang] || 0) + 1;
  }
};
```

### Cost Tracking

Monitor OpenAI API usage for translation costs:

```bash
# Add to your environment
export TRANSLATION_BUDGET_MONTHLY=50
export TRANSLATION_ALERT_THRESHOLD=80
```

## Troubleshooting

### Common Issues

1. **Translation server not responding**
   ```bash
   # Check if server is running
   curl http://localhost:3002/health

   # Restart if needed
   npm run start:http
   ```

2. **OpenAI API rate limits**
   - Implement retry logic with exponential backoff
   - Monitor API usage in OpenAI dashboard
   - Consider using smaller batches for large content

3. **Memory issues with large articles**
   - Split very long articles into sections
   - Process translations sequentially rather than in parallel
   - Monitor server memory usage

### Debug Mode

Enable detailed logging:

```bash
export DEBUG=translate-server:*
npm run start:http
```

This integration guide provides everything you need to start translating your AI Studio blog content to Dutch while maintaining SEO optimization and content quality.