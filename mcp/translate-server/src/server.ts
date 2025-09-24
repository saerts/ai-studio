#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import OpenAI from 'openai';

// Translation service using OpenAI
class TranslationService {
  private client: OpenAI;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }

    this.client = new OpenAI({ apiKey });
  }

  async detectLanguage(text: string): Promise<string> {
    try {
      const response = await this.client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a language detection expert. Identify the primary language of the given text. Respond with only the language name in English (e.g., "English", "Dutch", "French", "German", "Spanish", "Italian", etc.). Be concise and accurate.'
          },
          {
            role: 'user',
            content: `Detect the language of this text:\n\n${text.substring(0, 1000)}`
          }
        ],
        temperature: 0.1,
        max_tokens: 20
      });

      return response.choices[0]?.message?.content?.trim() || 'Unknown';
    } catch (error) {
      console.error('Language detection error:', error);
      return 'Unknown';
    }
  }

  async translateToDutch(text: string, originalLanguage: string): Promise<string> {
    try {
      const response = await this.client.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are a professional translator specializing in translating content to Dutch.

Instructions:
- Translate the given text from ${originalLanguage} to Dutch
- Maintain the original formatting, including markdown syntax if present
- Preserve technical terms and proper nouns appropriately
- Use natural, fluent Dutch that reads well for native speakers
- Keep the same tone and style as the original
- For blog posts, maintain SEO-friendly language
- Preserve any HTML tags or special formatting exactly as they appear`
          },
          {
            role: 'user',
            content: text
          }
        ],
        temperature: 0.3,
        max_tokens: 4000
      });

      return response.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Translation error:', error);
      throw new Error(`Translation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async translateBlogPost(content: string): Promise<{
    originalLanguage: string;
    translatedContent: string;
    translatedTitle?: string;
    translatedDescription?: string;
  }> {
    // Detect language
    const originalLanguage = await this.detectLanguage(content);

    // If already in Dutch, return original
    if (originalLanguage.toLowerCase().includes('dutch') || originalLanguage.toLowerCase().includes('nederlands')) {
      return {
        originalLanguage,
        translatedContent: content
      };
    }

    // Extract frontmatter and content
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

    let frontmatter = '';
    let mainContent = content;
    let translatedTitle: string | undefined;
    let translatedDescription: string | undefined;

    if (frontmatterMatch) {
      frontmatter = frontmatterMatch[1] || '';
      mainContent = frontmatterMatch[2] || content;

      // Extract title and description from frontmatter for translation
      // More robust regex patterns to handle various YAML formats
      const titleMatch = frontmatter.match(/^title:\s*["']?([^"'\n\r]+)["']?\s*$/m);
      const descMatch = frontmatter.match(/^description:\s*["']?([^"'\n\r]+)["']?\s*$/m);

      const titleText = titleMatch?.[1]?.trim();
      const descText = descMatch?.[1]?.trim();
      if (titleText) {
        translatedTitle = await this.translateToDutch(titleText, originalLanguage);
      }
      if (descText) {
        translatedDescription = await this.translateToDutch(descText, originalLanguage);
      }
    }

    // Translate main content
    const translatedMainContent = await this.translateToDutch(mainContent, originalLanguage);

    // Reconstruct content with translated frontmatter
    let translatedContent = translatedMainContent;
    if (frontmatterMatch) {
      let updatedFrontmatter = frontmatter;

      // Add original language indicator
      updatedFrontmatter += `\noriginalLanguage: ${originalLanguage}`;

      // Replace title and description if translated
      if (translatedTitle) {
        updatedFrontmatter = updatedFrontmatter.replace(
          /^title:\s*["']?[^"'\n\r]+["']?\s*$/m,
          `title: "${translatedTitle.replace(/"/g, '\\"')}"`
        );
      }
      if (translatedDescription) {
        updatedFrontmatter = updatedFrontmatter.replace(
          /^description:\s*["']?[^"'\n\r]+["']?\s*$/m,
          `description: "${translatedDescription.replace(/"/g, '\\"')}"`
        );
      }

      translatedContent = `---\n${updatedFrontmatter}\n---\n${translatedMainContent}`;
    }

    const result: {
      originalLanguage: string;
      translatedContent: string;
      translatedTitle?: string;
      translatedDescription?: string;
    } = {
      originalLanguage,
      translatedContent,
    };
    if (translatedTitle) result.translatedTitle = translatedTitle;
    if (translatedDescription) result.translatedDescription = translatedDescription;
    return result;
  }
}

// Initialize translation service
const translationService = new TranslationService();

// Create MCP server
const server = new Server({
  name: 'translate-server',
  version: '1.0.0',
}, {
  capabilities: {
    tools: {},
  },
});

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'detect_language',
        description: 'Detect the primary language of a text',
        inputSchema: {
          type: 'object',
          properties: {
            text: {
              type: 'string',
              description: 'The text to analyze for language detection'
            }
          },
          required: ['text']
        }
      },
      {
        name: 'translate_to_dutch',
        description: 'Translate text from any language to Dutch',
        inputSchema: {
          type: 'object',
          properties: {
            text: {
              type: 'string',
              description: 'The text to translate to Dutch'
            },
            originalLanguage: {
              type: 'string',
              description: 'The original language of the text (optional, will be auto-detected if not provided)'
            }
          },
          required: ['text']
        }
      },
      {
        name: 'translate_blog_post',
        description: 'Translate a complete blog post to Dutch, including frontmatter metadata, and detect original language',
        inputSchema: {
          type: 'object',
          properties: {
            content: {
              type: 'string',
              description: 'The complete blog post content including frontmatter'
            }
          },
          required: ['content']
        }
      }
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case 'detect_language': {
      const { text } = args as { text: string };
      const language = await translationService.detectLanguage(text);

      return {
        content: [{
          type: 'text',
          text: `Detected language: ${language}`
        }]
      };
    }

    case 'translate_to_dutch': {
      const { text, originalLanguage } = args as { text: string; originalLanguage?: string };

      let detectedLanguage = originalLanguage;
      if (!detectedLanguage) {
        detectedLanguage = await translationService.detectLanguage(text);
      }

      const translatedText = await translationService.translateToDutch(text, detectedLanguage);

      return {
        content: [{
          type: 'text',
          text: `Original language: ${detectedLanguage}\n\nTranslated text:\n${translatedText}`
        }]
      };
    }

    case 'translate_blog_post': {
      const { content } = args as { content: string };

      const result = await translationService.translateBlogPost(content);

      const response = [
        `Original Language: ${result.originalLanguage}`,
        '',
        'Translated Content:',
        '```markdown',
        result.translatedContent,
        '```'
      ];

      if (result.translatedTitle) {
        response.splice(1, 0, `Translated Title: ${result.translatedTitle}`);
      }
      if (result.translatedDescription) {
        response.splice(-4, 0, `Translated Description: ${result.translatedDescription}`);
      }

      return {
        content: [{
          type: 'text',
          text: response.join('\n')
        }]
      };
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Translation MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
