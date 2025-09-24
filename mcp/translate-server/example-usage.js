#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

/**
 * Example usage of the translate-server MCP
 * This demonstrates how to translate blog posts to Dutch using the HTTP API
 *
 * Prerequisites:
 * 1. Set OPENAI_API_KEY environment variable
 * 2. Run: npm run start:http (in another terminal)
 * 3. Run: node example-usage.js
 */

const TRANSLATE_SERVER_URL = 'http://localhost:3002';

async function detectLanguage(text) {
  try {
    const response = await fetch(`${TRANSLATE_SERVER_URL}/detect-language`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.detectedLanguage;
  } catch (error) {
    console.error('Language detection failed:', error.message);
    return null;
  }
}

async function translateBlogPost(content) {
  try {
    const response = await fetch(`${TRANSLATE_SERVER_URL}/translate-blog`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ content })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Blog translation failed:', error.message);
    return null;
  }
}

async function translateText(text, originalLanguage) {
  try {
    const response = await fetch(`${TRANSLATE_SERVER_URL}/translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text, originalLanguage })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Text translation failed:', error.message);
    return null;
  }
}

async function checkServerHealth() {
  try {
    const response = await fetch(`${TRANSLATE_SERVER_URL}/health`);
    const result = await response.json();
    console.log('✅ Server health check:', result);
    return true;
  } catch (error) {
    console.error('❌ Server health check failed:', error.message);
    console.log('Make sure to run: npm run start:http in another terminal');
    return false;
  }
}

async function main() {
  console.log('🚀 Translation Server Example Usage\n');

  // Check if server is running
  const serverHealthy = await checkServerHealth();
  if (!serverHealthy) {
    process.exit(1);
  }

  console.log('\n📝 Example 1: Simple Language Detection');
  console.log('=====================================');

  const sampleText = "Hello, this is a sample text to demonstrate language detection capabilities.";
  console.log('Input text:', sampleText);

  const detectedLanguage = await detectLanguage(sampleText);
  if (detectedLanguage) {
    console.log('Detected language:', detectedLanguage);
  }

  console.log('\n🔄 Example 2: Simple Text Translation');
  console.log('=====================================');

  const textToTranslate = "Artificial Intelligence is transforming the world of web development.";
  console.log('Original text:', textToTranslate);

  const translatedResult = await translateText(textToTranslate, 'English');
  if (translatedResult) {
    console.log('Original language:', translatedResult.originalLanguage);
    console.log('Dutch translation:', translatedResult.translatedText);
  }

  console.log('\n📄 Example 3: Complete Blog Post Translation');
  console.log('============================================');

  // Read the example blog post
  const exampleBlogPath = path.join(process.cwd(), 'example-blog.md');

  if (!fs.existsSync(exampleBlogPath)) {
    console.log('❌ Example blog post not found at:', exampleBlogPath);
    console.log('Please ensure example-blog.md exists in the current directory');
    return;
  }

  const blogContent = fs.readFileSync(exampleBlogPath, 'utf-8');
  console.log('📖 Reading blog post from:', exampleBlogPath);
  console.log('Original content length:', blogContent.length, 'characters');

  // Show first few lines of original content
  const originalPreview = blogContent.split('\n').slice(0, 10).join('\n');
  console.log('\n📋 Original content preview:');
  console.log('---');
  console.log(originalPreview);
  console.log('...(truncated)');
  console.log('---');

  console.log('\n🔄 Translating blog post...');
  console.log('This may take a moment due to the length of the content...\n');

  const blogTranslationResult = await translateBlogPost(blogContent);

  if (blogTranslationResult) {
    console.log('✅ Translation completed!');
    console.log('\n📊 Translation Results:');
    console.log('======================');
    console.log('Original language:', blogTranslationResult.originalLanguage);
    console.log('Already in Dutch:', blogTranslationResult.alreadyInDutch || false);

    if (blogTranslationResult.translatedTitle) {
      console.log('Translated title:', blogTranslationResult.translatedTitle);
    }

    if (blogTranslationResult.translatedDescription) {
      console.log('Translated description:', blogTranslationResult.translatedDescription);
    }

    console.log('Translated content length:', blogTranslationResult.translatedContent.length, 'characters');

    // Show first few lines of translated content
    const translatedPreview = blogTranslationResult.translatedContent.split('\n').slice(0, 15).join('\n');
    console.log('\n📋 Translated content preview:');
    console.log('---');
    console.log(translatedPreview);
    console.log('...(truncated)');
    console.log('---');

    // Save translated content to file
    const outputPath = path.join(process.cwd(), 'example-blog-dutch.md');
    fs.writeFileSync(outputPath, blogTranslationResult.translatedContent, 'utf-8');
    console.log('\n💾 Translated blog post saved to:', outputPath);

  } else {
    console.log('❌ Blog translation failed');
  }

  console.log('\n🎉 Example usage completed!');
  console.log('\n💡 Next steps:');
  console.log('- Check the generated example-blog-dutch.md file');
  console.log('- Test with your own blog content');
  console.log('- Integrate with Claude Desktop using the MCP server');
  console.log('- Use the translation tools in your AI Studio workflow');
}

// Check if this script is run directly
if (process.argv[1] === new URL(import.meta.url).pathname) {
  main().catch(console.error);
}

export { detectLanguage, translateBlogPost, translateText, checkServerHealth };