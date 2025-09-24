#!/usr/bin/env node

import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';

const app = express();
const port = process.env.PORT || 3002;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Translation service
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

  async translateBlogPost(content: string) {
    const originalLanguage = await this.detectLanguage(content);

    if (originalLanguage.toLowerCase().includes('dutch') || originalLanguage.toLowerCase().includes('nederlands')) {
      return {
        originalLanguage,
        translatedContent: content,
        alreadyInDutch: true
      };
    }

    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

    let frontmatter = '';
    let mainContent = content;
    let translatedTitle: string | undefined;
    let translatedDescription: string | undefined;

    if (frontmatterMatch) {
      frontmatter = frontmatterMatch[1];
      mainContent = frontmatterMatch[2];

      // More robust regex patterns to handle various YAML formats
      const titleMatch = frontmatter.match(/^title:\s*["']?([^"'\n\r]+)["']?\s*$/m);
      const descMatch = frontmatter.match(/^description:\s*["']?([^"'\n\r]+)["']?\s*$/m);

      if (titleMatch && titleMatch[1].trim()) {
        translatedTitle = await this.translateToDutch(titleMatch[1].trim(), originalLanguage);
      }
      if (descMatch && descMatch[1].trim()) {
        translatedDescription = await this.translateToDutch(descMatch[1].trim(), originalLanguage);
      }
    }

    const translatedMainContent = await this.translateToDutch(mainContent, originalLanguage);

    let translatedContent = translatedMainContent;
    if (frontmatterMatch) {
      let updatedFrontmatter = frontmatter;

      updatedFrontmatter += `\noriginalLanguage: ${originalLanguage}`;

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

    return {
      originalLanguage,
      translatedContent,
      translatedTitle,
      translatedDescription,
      alreadyInDutch: false
    };
  }
}

const translationService = new TranslationService();

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'translate-server' });
});

// Detect language endpoint
app.post('/detect-language', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const language = await translationService.detectLanguage(text);

    res.json({
      detectedLanguage: language
    });
  } catch (error) {
    console.error('Language detection error:', error);
    res.status(500).json({
      error: 'Language detection failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Translate text endpoint
app.post('/translate', async (req, res) => {
  try {
    const { text, originalLanguage } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    let detectedLanguage = originalLanguage;
    if (!detectedLanguage) {
      detectedLanguage = await translationService.detectLanguage(text);
    }

    const translatedText = await translationService.translateToDutch(text, detectedLanguage);

    res.json({
      originalLanguage: detectedLanguage,
      translatedText
    });
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({
      error: 'Translation failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Translate blog post endpoint
app.post('/translate-blog', async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const result = await translationService.translateBlogPost(content);

    res.json(result);
  } catch (error) {
    console.error('Blog translation error:', error);
    res.status(500).json({
      error: 'Blog translation failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Translation server running at http://localhost:${port}`);
  console.log('Available endpoints:');
  console.log('  GET  /health - Health check');
  console.log('  POST /detect-language - Detect text language');
  console.log('  POST /translate - Translate text to Dutch');
  console.log('  POST /translate-blog - Translate blog post to Dutch');
});