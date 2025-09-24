# Translation MCP Server

A Model Context Protocol (MCP) server that provides Dutch translation services with language detection capabilities, specifically designed for translating blog content while preserving markdown formatting and frontmatter metadata.

## Features

- **Language Detection**: Automatically detect the original language of any text
- **Dutch Translation**: Translate text from any language to natural, fluent Dutch
- **Blog Post Support**: Handle complete blog posts with frontmatter metadata
- **Markdown Preservation**: Maintain formatting, links, and structure during translation
- **Frontmatter Translation**: Translate title and description fields in frontmatter
- **Original Language Tracking**: Add originalLanguage field to translated content

## Available Tools

### 1. `detect_language`
Detect the primary language of a text.

**Input:**
- `text` (string): The text to analyze

**Output:**
- Detected language name in English

### 2. `translate_to_dutch`
Translate text from any language to Dutch.

**Input:**
- `text` (string): The text to translate
- `originalLanguage` (optional string): Original language (auto-detected if not provided)

**Output:**
- Original language and translated text

### 3. `translate_blog_post`
Translate a complete blog post including frontmatter metadata.

**Input:**
- `content` (string): Complete blog post content with frontmatter

**Output:**
- Original language detection
- Fully translated content with updated frontmatter
- Translated title and description (if present)

## Setup

### Prerequisites
- Node.js 18+
- OpenAI API key

### Installation

1. Install dependencies:
```bash
cd mcp/translate-server
npm install
```

2. Build the TypeScript code:
```bash
npm run build
```

3. Set up environment variables:
```bash
export OPENAI_API_KEY="your-openai-api-key"
```

### Development

Run in development mode with auto-rebuild:
```bash
npm run dev
```

### Running the Server

**MCP Server (for Claude Desktop):**
```bash
npm start
```

**HTTP Server (for testing):**
```bash
npm run start:http
```

The HTTP server runs on port 3002 and provides REST endpoints for testing.

## Usage Examples

### Language Detection
```bash
curl -X POST http://localhost:3002/detect-language \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello, how are you today?"}'
```

### Text Translation
```bash
curl -X POST http://localhost:3002/translate \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello world!", "originalLanguage": "English"}'
```

### Blog Post Translation
```bash
curl -X POST http://localhost:3002/translate-blog \
  -H "Content-Type: application/json" \
  -d '{"content": "---\ntitle: My Blog Post\ndescription: A great post\n---\n\n# Hello World\n\nThis is my blog post content."}'
```

## Claude Desktop Integration

Add to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "translate-server": {
      "command": "node",
      "args": ["/path/to/ai-studio/mcp/translate-server/dist/server.js"],
      "env": {
        "OPENAI_API_KEY": "your-openai-api-key"
      }
    }
  }
}
```

## Translation Quality

The server uses OpenAI's GPT-4 models for high-quality translations:
- **Language Detection**: GPT-4o-mini for fast, accurate language identification
- **Translation**: GPT-4o for nuanced, contextually appropriate Dutch translations

Translation features:
- Preserves technical terminology appropriately
- Maintains natural, fluent Dutch expression
- Keeps original tone and style
- Preserves markdown formatting and HTML tags
- Handles SEO-friendly content translation

## Blog Integration Workflow

For translating blog posts in your AI Studio:

1. **Detect Language**: Identify the source language of blog posts
2. **Translate Content**: Convert to Dutch while preserving structure
3. **Update Metadata**: Translate frontmatter fields (title, description)
4. **Track Origin**: Add originalLanguage field for reference
5. **Preserve SEO**: Maintain search-friendly content structure

## Environment Variables

- `OPENAI_API_KEY` (required): Your OpenAI API key
- `PORT` (optional): HTTP server port (defaults to 3002)

## Error Handling

The server includes comprehensive error handling:
- API key validation
- OpenAI API error handling
- Input validation for all endpoints
- Graceful fallbacks for language detection failures

## Development Notes

- Uses TypeScript for type safety
- Follows MCP protocol specifications
- Includes both MCP and HTTP interfaces for flexibility
- Optimized for blog content translation workflows