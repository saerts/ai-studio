# Batch Translation Workflow

This document describes how to efficiently translate multiple blog posts using the translate-server MCP.

## Scenario 1: Translating Existing Blog Posts

### Step 1: Organize Your Content

Create a clear file structure:
```
src/content/blog/
├── en/                    # Original English posts
│   ├── ai-trends-2024.md
│   ├── web-dev-future.md
│   └── ml-applications.md
└── nl/                    # Dutch translations
    ├── ai-trends-2024.md
    ├── web-dev-toekomst.md
    └── ml-toepassingen.md
```

### Step 2: Batch Translation Process

**Option A: Via Claude Desktop (Recommended)**

1. **Create a translation session** in Claude Desktop:
```
I need to translate multiple blog posts to Dutch. I'll provide them one by one.

First post:
Use the translate_blog_post tool to translate this article:

[Paste first blog post content with frontmatter]
```

2. **Continue with subsequent posts**:
```
Next post:
Use the translate_blog_post tool to translate this article:

[Paste second blog post content with frontmatter]
```

3. **Save each translated result** to the appropriate `nl/` directory.

**Option B: Via HTTP API (For Automation)**

If you have many posts, you can use the HTTP API with a script:

```javascript
// batch-translate.js
import fs from 'fs';
import path from 'path';

const API_URL = 'http://localhost:3002/translate-blog';

async function translateFile(inputPath, outputPath) {
  const content = fs.readFileSync(inputPath, 'utf-8');

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    });

    const result = await response.json();

    if (result.translatedContent) {
      fs.writeFileSync(outputPath, result.translatedContent);
      console.log(`✅ Translated: ${inputPath} -> ${outputPath}`);
      return true;
    }
  } catch (error) {
    console.error(`❌ Failed to translate ${inputPath}:`, error.message);
  }

  return false;
}

async function batchTranslate() {
  const inputDir = '../../src/content/blog/en';
  const outputDir = '../../src/content/blog/nl';

  const files = fs.readdirSync(inputDir).filter(f => f.endsWith('.md'));

  for (const file of files) {
    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(outputDir, file);

    console.log(`Translating ${file}...`);
    await translateFile(inputPath, outputPath);

    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
}

// Run: npm run start:http (in another terminal)
// Then: node batch-translate.js
batchTranslate();
```

## Scenario 2: Daily AI News Translation Workflow

### Enhanced Daily Process

**Morning Routine (9 AM):**

1. **Fetch Latest AI News**:
```
Use the fetch_articles tool to get articles from the last 24 hours
```

2. **Generate Images** for fetched articles:
```
Use the generate_images tool with corporate style for the new articles
```

3. **Translate Each Article**:
```
Use the translate_blog_post tool for each article:

Article 1: [content]
Article 2: [content]
Article 3: [content]
```

4. **Organize Results**:
   - Save English articles to `src/content/blog/en/YYYY-MM-DD-article-slug.md`
   - Save Dutch translations to `src/content/blog/nl/YYYY-MM-DD-artikel-slug.md`

### File Naming Convention

**English Posts:**
```
2024-09-24-ai-breakthrough-language-models.md
2024-09-24-openai-releases-new-features.md
2024-09-24-google-ai-updates-september.md
```

**Dutch Translations:**
```
2024-09-24-ai-doorbraak-taalmodellen.md
2024-09-24-openai-brengt-nieuwe-functies.md
2024-09-24-google-ai-updates-september.md
```

## Scenario 3: Quality Assurance Workflow

### Post-Translation Review Process

1. **Technical Term Consistency**:
   - Create a glossary of common AI/tech terms
   - Ensure consistent translation (e.g., "AI" vs "KI", "Machine Learning" vs "Machinaal Leren")

2. **Review Checklist**:
   ```
   [ ] Title properly translated and engaging
   [ ] Description accurately reflects content
   [ ] Technical terms consistently translated
   [ ] Links and formatting preserved
   [ ] Code blocks remain functional
   [ ] Dutch grammar and flow sound natural
   [ ] originalLanguage field added
   ```

3. **Batch Review Template**:
```
Review the following Dutch translations for accuracy and natural language flow:

Translation 1: [Dutch content]
Original: [English content]

Translation 2: [Dutch content]
Original: [English content]

Please check for:
- Technical term consistency
- Natural Dutch expressions
- Preserved formatting
- Cultural appropriateness
```

## Performance Optimization

### Best Practices

1. **Optimal Batch Size**: Process 5-10 articles at a time to avoid API limits
2. **Time Management**: Allow 2-3 minutes per article for translation
3. **Cost Control**: Monitor OpenAI usage (approximately $0.02-0.10 per article)
4. **Error Handling**: Always save originals before overwriting

### Automation Scripts

**Daily Translation Script** (example):
```bash
#!/bin/bash
# daily-translate.sh

echo "🌅 Starting daily AI news translation workflow"

# Step 1: Fetch articles (assumes ai-news MCP is configured)
echo "📰 Fetching latest articles..."
# This would be done via Claude Desktop with ai-news MCP

# Step 2: Start translation server
echo "🚀 Starting translation server..."
cd mcp/translate-server
npm run start:http &
SERVER_PID=$!

# Step 3: Wait for server to start
sleep 5

# Step 4: Run batch translation
echo "🔄 Running batch translation..."
node batch-translate.js

# Step 5: Clean up
echo "🧹 Cleaning up..."
kill $SERVER_PID

echo "✅ Daily translation workflow completed!"
```

## Monitoring and Analytics

### Track Translation Metrics

Keep a log of:
- Articles translated per day
- Translation quality scores
- Time spent on reviews
- Common translation issues
- Cost per article

**Example Log Entry:**
```
Date: 2024-09-24
Articles Processed: 8
Total Cost: $0.64
Average Time: 3.2 minutes per article
Quality Issues: 2 (technical terms)
Review Required: 1 article
```

## Integration with Astro

### Content Collections Update

Update your Astro content config for multilingual support:

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const blogSchema = z.object({
  title: z.string(),
  description: z.string(),
  pubDate: z.coerce.date(),
  author: z.string().default('AI Studio'),
  tags: z.array(z.string()),
  heroImage: z.string().optional(),
  originalLanguage: z.string().optional(),
  originalUrl: z.string().optional(),
});

export const collections = {
  'blog-en': defineCollection({
    type: 'content',
    schema: blogSchema,
  }),
  'blog-nl': defineCollection({
    type: 'content',
    schema: blogSchema,
  }),
};
```

### URL Structure

Plan your multilingual URL structure:
- English: `/blog/en/ai-breakthrough-september-2024/`
- Dutch: `/blog/nl/ai-doorbraak-september-2024/`

## Troubleshooting Common Issues

### Issue 1: Inconsistent Technical Terms
**Solution**: Create and maintain a translation glossary
```
AI → AI (keep in English)
Machine Learning → Machinaal Leren
Deep Learning → Deep Learning (keep in English)
API → API (keep as-is)
Frontend → Frontend (commonly used in Dutch)
Backend → Backend (commonly used in Dutch)
```

### Issue 2: Long Articles Fail Translation
**Solution**: Split long articles into sections
- Translate frontmatter separately
- Translate content in chunks
- Recombine manually

### Issue 3: Rate Limiting
**Solution**: Implement delays and retry logic
- 2-second delay between translations
- Exponential backoff for failures
- Monitor OpenAI usage dashboard

### Issue 4: Quality Variations
**Solution**: Post-processing review
- Use consistent review checklist
- Maintain translation style guide
- Consider human review for technical content

## Future Enhancements

### Potential Improvements

1. **Automated Quality Scoring**: Compare translations for consistency
2. **Terminology Database**: Build custom AI translation knowledge base
3. **Integration Webhooks**: Automatic translation triggers
4. **Multi-language Support**: Extend beyond Dutch to German, French, etc.
5. **SEO Optimization**: Automatically optimize Dutch keywords and meta descriptions

This workflow ensures efficient, high-quality translation of your AI Studio blog content while maintaining consistency and managing costs.