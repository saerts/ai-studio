# translate_blog_post Tool Usage Guide

## Quick Start

The `translate_blog_post` tool translates complete blog posts to Dutch while preserving formatting and translating frontmatter metadata.

### Step 1: Configure Claude Desktop

**Location of config file:**
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

**Add this configuration:**
```json
{
  "mcpServers": {
    "translate-server": {
      "command": "node",
      "args": ["/Users/saerts/Sites/WEBMASTER/sa_LIVE/sa73/AI-Studio/ai-studio/mcp/translate-server/dist/server.js"],
      "env": {
        "OPENAI_API_KEY": "your-openai-api-key-here"
      }
    }
  }
}
```

**Important:**
- Replace `/Users/saerts/Sites/WEBMASTER/sa_LIVE/sa73/AI-Studio/ai-studio/mcp/translate-server/dist/server.js` with your actual absolute path
- Replace `your-openai-api-key-here` with your actual OpenAI API key
- Restart Claude Desktop after making changes

### Step 2: Using the Tool

**Basic Usage in Claude Desktop:**
```
Use the translate_blog_post tool to translate this article to Dutch:

[Paste your complete blog post with frontmatter here]
```

**Example Input:**
```markdown
---
title: The Future of AI in Web Development
description: Exploring how AI is changing web development
pubDate: 2024-09-24T10:30:00Z
author: AI Studio
tags: ["ai", "web-development"]
heroImage: "/blog/ai-future.webp"
---

# The Future of AI in Web Development

Artificial Intelligence is transforming web development in unprecedented ways.

## Key Benefits

1. **Automated Code Generation**: AI can write boilerplate code
2. **Enhanced Testing**: Intelligent test case generation
3. **User Experience**: Personalized content delivery

The future looks bright for AI-powered development workflows.
```

**Expected Output:**
```markdown
---
title: "De Toekomst van AI in Webontwikkeling"
description: "Onderzoeken hoe AI webontwikkeling verandert"
pubDate: 2024-09-24T10:30:00Z
author: AI Studio
tags: ["ai", "web-development"]
heroImage: "/blog/ai-future.webp"
originalLanguage: English
---

# De Toekomst van AI in Webontwikkeling

Kunstmatige Intelligentie transformeert webontwikkeling op ongekende manieren.

## Belangrijkste Voordelen

1. **Geautomatiseerde Codegeneratie**: AI kan boilerplate code schrijven
2. **Verbeterde Testing**: Intelligente testcase generatie
3. **Gebruikerservaring**: Gepersonaliseerde content levering

De toekomst ziet er rooskleurig uit voor AI-aangedreven ontwikkelingsworkflows.
```

## What Gets Translated

✅ **Title**: Frontmatter `title` field
✅ **Description**: Frontmatter `description` field
✅ **Main Content**: All markdown content including headers, lists, links
✅ **Code Comments**: Comments within code blocks
❌ **Code Syntax**: Programming code remains unchanged
❌ **URLs**: Links and image paths stay the same
❌ **Dates**: ISO dates and timestamps preserved
❌ **Tags**: Tag arrays maintained as-is

## Advanced Usage

### Language Detection Only
```
Use the detect_language tool to identify the language of this text:
[Your content here]
```

### Translate Specific Text
```
Use the translate_to_dutch tool to translate this text:
"Your specific text here"
```

### Batch Processing Multiple Posts
For multiple blog posts, repeat the process:

```
Use the translate_blog_post tool for each of these posts:

Post 1:
[First blog post content]

Post 2:
[Second blog post content]
```

## Integration with AI-News Workflow

### Enhanced Content Pipeline

1. **Fetch Articles** (existing workflow):
   ```
   Use the fetch_articles tool to get latest AI news
   ```

2. **Generate Images** (existing workflow):
   ```
   Use the generate_images tool with corporate style
   ```

3. **Translate to Dutch** (new step):
   ```
   Use the translate_blog_post tool to translate each article
   ```

4. **Organize Content**:
   - Save originals in `src/content/blog/en/`
   - Save Dutch versions in `src/content/blog/nl/`

## File Organization Strategy

```
src/content/blog/
├── en/                 # Original English posts
│   ├── ai-trends-2024.md
│   └── web-dev-future.md
└── nl/                 # Dutch translations
    ├── ai-trends-2024.md
    └── web-dev-toekomst.md
```

## Troubleshooting

### Tool Not Available
**Problem**: `translate_blog_post` tool not found
**Solution**:
1. Check Claude Desktop config file syntax
2. Verify absolute path to server.js file
3. Restart Claude Desktop
4. Check MCP server is built: `npm run build` in translate-server directory

### Translation Fails
**Problem**: Tool returns error or no translation
**Solution**:
1. Verify OpenAI API key is valid and has credits
2. Check input has proper frontmatter format (---...---)
3. Ensure content isn't too long (< 8000 characters recommended)

### Frontmatter Not Translated
**Problem**: Title/description remain in original language
**Solution**:
1. Check frontmatter uses proper YAML format
2. Ensure `title:` and `description:` fields are present
3. Try without quotes around field values

### Server Connection Issues
**Problem**: MCP server won't start
**Solution**:
1. Check Node.js is installed (version 18+)
2. Run `npm install` in translate-server directory
3. Verify TypeScript compilation: `npm run build`
4. Check server manually: `node dist/server.js`

## Performance Tips

- **Optimal Length**: Best results with posts under 3000 words
- **Batch Processing**: Process one post at a time for reliability
- **Content Types**: Works best with article content vs. code-heavy posts
- **Language Detection**: Most accurate with 100+ words of content

## Quality Assurance

After translation, review:
- [ ] Technical terms are appropriately translated
- [ ] Dutch grammar and flow sound natural
- [ ] Links and formatting are preserved
- [ ] Code blocks remain functional
- [ ] Frontmatter fields are properly updated

## Cost Considerations

Using OpenAI GPT-4 models:
- **Language Detection**: ~$0.001 per blog post (GPT-4o-mini)
- **Translation**: ~$0.02-0.10 per blog post (GPT-4o)
- **Monthly Budget**: Set reasonable limits in OpenAI dashboard

## Next Steps

1. Test with a simple blog post first
2. Verify translation quality meets your standards
3. Set up batch processing workflow
4. Consider automation for regular content translation
5. Monitor OpenAI API usage and costs

---

**Need Help?** Check the full documentation in `README.md` and `INTEGRATION.md` files.