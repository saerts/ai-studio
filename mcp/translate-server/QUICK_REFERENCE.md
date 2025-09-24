# translate_blog_post Tool - Quick Reference

## Setup (One-time)

```bash
# 1. Install and build
cd mcp/translate-server
npm install
npm run build

# 2. Configure Claude Desktop
npm run setup
# Edit the config file to add your OpenAI API key

# 3. Restart Claude Desktop
```

## Daily Usage

### Basic Translation
```
Use the translate_blog_post tool to translate this article to Dutch:

---
title: Your Blog Title
description: Your blog description
pubDate: 2024-09-24T10:30:00Z
author: AI Studio
tags: ["ai", "web-development"]
---

# Your Blog Content

Your markdown content here...
```

### Other Available Tools
```
Use the detect_language tool to identify the language of this text:
[your text here]

Use the translate_to_dutch tool to translate this text:
"Your specific text here"
```

## Expected Results

✅ **Gets Translated:**
- Title and description in frontmatter
- All markdown content (headers, paragraphs, lists)
- Comments in code blocks

❌ **Stays the Same:**
- Code syntax
- URLs and links
- Dates and timestamps
- Tags arrays
- Image paths

✅ **Added Automatically:**
- `originalLanguage: English` (or detected language)

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Tool not available | Check Claude Desktop config, restart Claude |
| Translation fails | Verify OpenAI API key has credits |
| Title not translated | Ensure proper YAML frontmatter format |
| Server issues | Run `npm run build` in translate-server directory |

## File Organization

```
src/content/blog/
├── en/                    # Originals
│   └── ai-trends-2024.md
└── nl/                    # Dutch translations
    └── ai-trends-2024.md
```

## Performance

- **Cost**: ~$0.02-0.10 per blog post
- **Time**: ~2-3 minutes per article
- **Quality**: GPT-4o translation with context awareness

## Quick Commands

```bash
# Setup
npm run setup

# Test server
npm run start:http
npm run test

# Development
npm run dev
```

## Sample Input/Output

**Input:**
```markdown
---
title: The Future of AI
description: AI is changing everything
---

# The Future of AI

Artificial Intelligence is revolutionizing our world.
```

**Output:**
```markdown
---
title: "De Toekomst van AI"
description: "AI verandert alles"
originalLanguage: English
---

# De Toekomst van AI

Kunstmatige Intelligentie revolutioneert onze wereld.
```

## Need Help?

- **Full Guide**: `USAGE_GUIDE.md`
- **Integration**: `INTEGRATION.md`
- **Batch Processing**: `batch-translate-workflow.md`
- **Technical Details**: `README.md`

---
**💡 Pro Tip**: Always review technical terms in translations for accuracy and consistency!