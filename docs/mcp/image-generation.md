# AI Image Generation for Blog Posts

## 🖼️ Overview

The AI Studio MCP tool automatically generates relevant, professional images for imported blog posts using OpenAI's DALL-E 3 API. This ensures every article has a high-quality header image that matches the content and maintains brand consistency.

## 🚀 Setup

### 1. Install Dependencies

```bash
cd mcp/ai-news
npm install openai
```

### 2. Environment Configuration

```bash
# Add to .env file
OPENAI_API_KEY=sk-your-openai-api-key
OPENAI_ORG_ID=org-your-organization-id  # Optional

# Image generation settings
IMAGE_GENERATION_ENABLED=true
DEFAULT_IMAGE_STYLE=corporate     # corporate, creative, minimal, technical
IMAGE_MONTHLY_BUDGET=50           # USD budget limit per month
IMAGE_BATCH_SIZE=3                # Max concurrent image generations
IMAGE_CACHE_DURATION=7776000      # Cache duration in seconds (90 days)
```

### 3. Public Directory Setup

```bash
# Create images directory
mkdir -p ../../public/blog/images
mkdir -p ../../public/blog/covers
```

## 🎨 Image Generation Features

### Automatic Style Detection
The system automatically selects appropriate visual styles based on article content:

- **Research Papers**: Abstract data visualizations, neural networks
- **Industry News**: Corporate illustrations, business graphics
- **Tutorials**: Step-by-step visual guides, educational diagrams
- **Opinion Pieces**: Conceptual illustrations, metaphorical imagery
- **Tool Reviews**: Product-focused, comparison visuals

### Brand Consistency
All generated images maintain AI Studio's visual identity:
- **Color Palette**: Primary blues (#0ea5e9, #0369a1) with complementary colors
- **Style**: Clean, modern, professional, minimalist
- **Format**: Optimized for blog headers (16:9 aspect ratio)
- **Quality**: High resolution for retina displays

## 🔧 Technical Implementation

### Enhanced MCP Commands

#### `generate_images`
Generate images for processed articles.

```bash
mcp generate_images [OPTIONS]
```

**Options:**
- `--style <string>`: Image style (corporate, creative, minimal, technical)
- `--regenerate <boolean>`: Regenerate existing images (default: false)
- `--dry-run <boolean>`: Preview prompts without generating (default: false)

**Examples:**
```bash
# Generate images for all processed articles
mcp generate_images

# Use creative style for tech tutorials
mcp generate_images --style creative

# Preview prompts without generating
mcp generate_images --dry-run true

# Regenerate all images
mcp generate_images --regenerate true
```

#### `optimize_images`
Compress and optimize generated images.

```bash
mcp optimize_images [OPTIONS]
```

**Options:**
- `--format <string>`: Output format (webp, png, jpg)
- `--quality <number>`: Compression quality 1-100 (default: 85)
- `--responsive <boolean>`: Generate multiple sizes (default: true)

## 🔄 Complete Workflow

### Automated Image Generation
The MCP tool now automatically generates images during the `write_markdown` process:

```bash
# Fetch articles and generate images in one workflow
mcp fetch_articles --since-days 7
mcp write_markdown --include-images true

# Results in markdown files with:
# - Generated cover images
# - Optimized for web (WebP, multiple sizes)
# - SEO-friendly alt text
# - Brand-consistent styling
```

### Image Generation Workflow

```typescript
// Enhanced article processing with image generation
interface ImageConfig {
  enabled: boolean;
  style: 'corporate' | 'creative' | 'minimal' | 'technical';
  size: '1792x1024' | '1024x1024' | '1024x1792';
  quality: 'standard' | 'hd';
  format: 'webp' | 'png' | 'jpg';
}

class AIImageGenerator {
  private openai: OpenAI;
  private config: ImageConfig;

  async generateImageForArticle(article: ArticleData): Promise<string> {
    // 1. Analyze article content
    const imagePrompt = this.createPrompt(article);

    // 2. Generate image via DALL-E 3
    const imageUrl = await this.generateImage(imagePrompt);

    // 3. Download and optimize
    const localPath = await this.downloadAndOptimize(imageUrl, article.slug);

    // 4. Update article metadata
    return localPath;
  }

  private createPrompt(article: ArticleData): string {
    const baseStyle = this.getStylePrompt();
    const contentContext = this.extractContext(article);
    const brandGuidelines = this.getBrandGuidelines();

    return `${contentContext}. ${baseStyle}. ${brandGuidelines}`;
  }
}
```

## 📝 Prompt Engineering

### Base Style Templates

#### Corporate Style
```
Professional business illustration, clean modern design, blue color palette matching AI Studio branding (#0ea5e9, #0369a1), minimalist composition, corporate aesthetic, high-tech feel, suitable for business blog header
```

#### Creative Style
```
Creative AI-themed illustration, vibrant but professional colors with blue accents, artistic interpretation, engaging visual metaphor, suitable for thought leadership content
```

#### Technical Style
```
Technical diagram illustration, clean schematic style, blue and white color scheme, precise geometric elements, educational visual, suitable for tutorial content
```

#### Minimal Style
```
Minimalist abstract illustration, simple geometric shapes, limited color palette with AI Studio blues, clean white background, modern aesthetic
```

### Content-Specific Prompts

```typescript
const PROMPT_TEMPLATES = {
  'machine-learning': 'Neural network visualization, interconnected nodes, data flow diagrams',
  'nlp': 'Language processing visualization, text analysis, communication concepts',
  'computer-vision': 'Image recognition concepts, visual AI, camera and analysis imagery',
  'automation': 'Robotic process automation, workflow diagrams, efficiency concepts',
  'research': 'Scientific visualization, data analysis, research methodology imagery',
  'business': 'Corporate AI implementation, business transformation, growth concepts',
  'tutorial': 'Step-by-step visual guide, educational layout, clear progression',
  'news': 'Industry news imagery, technology announcements, innovation concepts'
};

function generateContextPrompt(article: ArticleData): string {
  const keywords = extractKeywords(article.title, article.description);
  const category = categorizeContent(keywords);
  const template = PROMPT_TEMPLATES[category] || PROMPT_TEMPLATES['business'];

  return `${template}, ${article.title} concept visualization`;
}
```

### Quality Guidelines

```typescript
const QUALITY_PROMPTS = {
  composition: 'well-composed, balanced layout, clear focal point',
  technical: 'high quality, professional grade, crisp details',
  branding: 'consistent with AI consultancy branding, trustworthy appearance',
  accessibility: 'high contrast, clear visual hierarchy, easily readable',
  responsive: 'suitable for various screen sizes, scalable design'
};
```

## 🖼️ Image Processing Pipeline

### 1. Generation
```typescript
async function generateImage(prompt: string): Promise<string> {
  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt: prompt,
    size: "1792x1024",
    quality: "standard",
    style: "natural",  // More realistic, suitable for business content
    response_format: "url"
  });

  return response.data[0].url;
}
```

### 2. Download & Optimization
```typescript
async function downloadAndOptimize(
  imageUrl: string,
  slug: string
): Promise<string> {
  // Download original
  const response = await fetch(imageUrl);
  const buffer = await response.arrayBuffer();

  // Generate filename
  const filename = `${slug}-${Date.now()}`;
  const originalPath = `../../public/blog/images/${filename}.png`;

  // Save original
  await writeFile(originalPath, Buffer.from(buffer));

  // Generate optimized versions
  const optimizedPath = await generateOptimizedVersions(originalPath, filename);

  return optimizedPath;
}
```

### 3. Responsive Image Generation
```typescript
async function generateOptimizedVersions(
  originalPath: string,
  filename: string
): Promise<string> {
  const sizes = [400, 800, 1200, 1600];
  const formats = ['webp', 'jpg'];

  for (const size of sizes) {
    for (const format of formats) {
      const outputPath = `../../public/blog/images/${filename}-${size}w.${format}`;
      await resizeAndCompress(originalPath, outputPath, size, format);
    }
  }

  // Return main WebP version
  return `/blog/images/${filename}-1200w.webp`;
}
```

## 🎯 Alt Text Generation

### Automated Alt Text Creation
```typescript
async function generateAltText(
  imagePrompt: string,
  article: ArticleData
): Promise<string> {
  // Extract key visual elements from prompt
  const visualElements = extractVisualElements(imagePrompt);

  // Create descriptive alt text
  const altText = `Professional illustration showing ${visualElements} related to ${article.title}. Blue and white modern design suitable for AI industry content.`;

  // Ensure accessibility compliance
  return sanitizeAltText(altText);
}

function sanitizeAltText(text: string): string {
  return text
    .replace(/image of|picture of|illustration of/gi, '') // Remove redundant phrases
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim()
    .substring(0, 125); // Keep under recommended length
}
```

## 📊 Performance Optimization

### Caching Strategy
```typescript
class ImageCache {
  private cache = new Map<string, string>();

  async getCachedImage(contentHash: string): Promise<string | null> {
    // Check if we've already generated an image for similar content
    const existing = this.cache.get(contentHash);
    if (existing && await fileExists(existing)) {
      return existing;
    }
    return null;
  }

  setCachedImage(contentHash: string, imagePath: string): void {
    this.cache.set(contentHash, imagePath);
  }
}
```

### Batch Processing
```typescript
async function batchGenerateImages(articles: ArticleData[]): Promise<void> {
  const BATCH_SIZE = 3; // Respect API rate limits
  const DELAY_MS = 2000; // Delay between batches

  for (let i = 0; i < articles.length; i += BATCH_SIZE) {
    const batch = articles.slice(i, i + BATCH_SIZE);

    await Promise.all(
      batch.map(article => generateImageForArticle(article))
    );

    if (i + BATCH_SIZE < articles.length) {
      await new Promise(resolve => setTimeout(resolve, DELAY_MS));
    }
  }
}
```

## 💰 Cost Management

### Usage Tracking
```typescript
interface UsageStats {
  imagesGenerated: number;
  totalCost: number;
  averageCostPerImage: number;
  monthlyUsage: number;
}

class CostTracker {
  private readonly DALLE3_COST_PER_IMAGE = 0.04; // $0.04 for 1024x1024
  private readonly DALLE3_COST_BANNER = 0.08;    // $0.08 for 1792x1024

  async trackGeneration(size: string): Promise<void> {
    const cost = size === '1792x1024' ? this.DALLE3_COST_BANNER : this.DALLE3_COST_PER_IMAGE;
    await this.logUsage(cost);
  }

  async getMonthlyStats(): Promise<UsageStats> {
    // Return usage statistics for cost monitoring
  }
}
```

### Budget Controls
```typescript
class BudgetController {
  private readonly MONTHLY_BUDGET = 50; // $50/month limit

  async checkBudget(): Promise<boolean> {
    const currentUsage = await this.getCurrentMonthUsage();
    return currentUsage < this.MONTHLY_BUDGET;
  }

  async shouldGenerateImage(article: ArticleData): Promise<boolean> {
    // Skip generation if budget exceeded
    if (!await this.checkBudget()) {
      console.warn('Monthly image generation budget exceeded');
      return false;
    }

    // Prioritize high-value content
    return this.isHighValueContent(article);
  }
}
```

## 🔧 Configuration Examples

### Environment Setup
```bash
# .env configuration
OPENAI_API_KEY=sk-your-key-here
IMAGE_GENERATION_ENABLED=true
IMAGE_MONTHLY_BUDGET=50
IMAGE_BATCH_SIZE=3
IMAGE_CACHE_DURATION=7776000  # 90 days

# Style preferences
DEFAULT_IMAGE_STYLE=corporate
FALLBACK_TO_UNSPLASH=true
UNSPLASH_ACCESS_KEY=your-unsplash-key
```

### Content Collections Integration
```typescript
// Update blog schema to include generated images
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    // ... existing fields
    cover: z.string().optional(),
    coverAlt: z.string().optional(),
    coverGenerated: z.boolean().default(false),
    coverPrompt: z.string().optional(), // For debugging/regeneration
  }),
});
```

## 📈 Monitoring & Analytics

### Success Metrics
- **Generation Success Rate**: 95%+ successful generations
- **Cost Efficiency**: Stay within monthly budget
- **Performance Impact**: < 10% increase in import time
- **Quality Score**: Manual review of generated images

### Monitoring Dashboard
```typescript
interface ImageMetrics {
  totalGenerated: number;
  successRate: number;
  averageGenerationTime: number;
  costPerImage: number;
  qualityRating: number;
  cacheHitRate: number;
}

async function getImageMetrics(): Promise<ImageMetrics> {
  // Aggregate metrics for monitoring dashboard
}
```

This image generation system ensures that every AI Studio blog post has a professional, relevant header image that enhances the content while maintaining brand consistency and cost efficiency.