# Development Setup & Workflow

## 🚀 Quick Start

### Prerequisites
- **Node.js**: 18.20.8+ or 20.3.0+ or 22.0.0+
- **Package Manager**: npm or pnpm
- **Git**: For version control
- **Code Editor**: VS Code recommended

### Initial Setup

```bash
# Clone and navigate to project
git clone <repository-url>
cd ai-studio

# Install dependencies
npm install

# Install MCP dependencies
cd mcp/ai-news
npm install
cd ../..

# Start development server
npm run dev
```

The site will be available at `http://localhost:4321`

## 🛠️ Development Scripts

### Core Commands
```bash
# Development
npm run dev          # Start dev server with HMR
npm run build        # Production build with checks
npm run preview      # Preview production build

# Quality Assurance
npm run lint         # ESLint + Prettier check
npm run format       # Auto-format with Prettier
npm run content:check # Validate Astro content

# MCP Tool
npm run mcp:dev      # Start MCP server in watch mode
```

### Advanced Commands
```bash
# Content Management
cd mcp/ai-news
npm run build        # Build MCP TypeScript
npm start           # Run MCP server

# Manual MCP Usage
mcp list_feeds                    # Show RSS sources
mcp fetch_articles --sinceDays 7  # Import recent articles
mcp write_markdown               # Save to blog directory
```

## 📁 Project Structure

```
ai-studio/
├── docs/                    # 📚 Documentation
│   ├── development/         # Dev guides and references
│   ├── deployment/          # Production deployment
│   ├── mcp/                # MCP tool documentation
│   └── guides/             # Feature-specific guides
├── public/                  # 🌐 Static assets
│   ├── favicon.svg         # Site icon
│   ├── robots.txt          # Search engine directives
│   └── icons/              # PWA icons (future)
├── src/
│   ├── components/          # 🧩 Reusable components
│   │   ├── a11y/           # Accessibility components
│   │   ├── layout/         # Page layouts
│   │   ├── nav/            # Navigation components
│   │   └── ui/             # UI building blocks
│   ├── content/            # 📝 Content Collections
│   │   ├── config.ts       # Schema definitions
│   │   └── blog/           # Blog posts (Markdown)
│   ├── lib/                # 🔧 Utilities and helpers
│   │   ├── seo.ts          # SEO utilities
│   │   ├── schema.ts       # JSON-LD schemas
│   │   ├── feeds.ts        # RSS feed config
│   │   └── utils.ts        # General utilities
│   ├── pages/              # 📄 Route pages
│   │   ├── index.astro     # Homepage
│   │   ├── diensten.astro  # Services page
│   │   ├── contact.astro   # Contact form
│   │   ├── blog.astro      # Blog index
│   │   ├── blog/[slug].astro # Dynamic blog pages
│   │   ├── 404.astro       # Error page
│   │   └── rss.xml.ts      # RSS feed
│   └── styles/             # 🎨 Global styles
│       └── globals.css     # Base styles + Tailwind
├── mcp/                    # 🤖 MCP Tool
│   └── ai-news/           # RSS import automation
│       ├── src/           # TypeScript source
│       └── dist/          # Compiled JavaScript
└── config files           # ⚙️ Project configuration
```

## 🧩 Component Architecture

### Layout Components
```typescript
// BaseLayout.astro - Main page wrapper
interface Props extends SEOProps {
  class?: string;
}

// BlogLayout.astro - Blog post wrapper
interface Props {
  post: CollectionEntry<'blog'>;
}
```

### UI Components
```typescript
// Button.astro - Reusable button
interface Props {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
}

// Card.astro - Content card wrapper
interface Props {
  class?: string;
}
```

### Accessibility Components
```typescript
// SkipLink.astro - Keyboard navigation
interface Props {
  href?: string;
  text?: string;
}

// VisuallyHidden.astro - Screen reader content
interface Props {
  as?: keyof HTMLElementTagNameMap;
}
```

## 🎨 Styling Guidelines

### Tailwind CSS Usage
```css
/* Preferred approach: Utility classes */
<div class="bg-white dark:bg-gray-900 rounded-lg shadow-sm">

/* Component styles in globals.css */
.btn {
  @apply inline-flex items-center justify-center rounded-md px-4 py-2;
}

/* Custom properties for consistency */
:root {
  --color-text: 51 65 85; /* slate-700 */
  --color-bg: 255 255 255; /* white */
}
```

### Design Tokens
```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          500: '#0ea5e9',
          900: '#0c4a6e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
}
```

## 📊 Content Collections

### Blog Schema
```typescript
// src/content/config.ts
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().max(160),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    source: z.string(),
    canonicalUrl: z.string().url(),
    cover: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});
```

### Usage Examples
```typescript
// Get all published posts
const posts = await getCollection('blog', ({ data }) => !data.draft);

// Get posts by tag
const aiPosts = await getCollection('blog', ({ data }) =>
  data.tags.includes('ai')
);

// Render post content
const { post } = Astro.props;
const { Content } = await post.render();
```

## 🔧 Development Workflow

### 1. Feature Development
```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and test
npm run dev
npm run lint

# Commit with conventional format
git commit -m "feat: add new feature description"
```

### 2. Content Updates
```bash
# Update blog content via MCP
cd mcp/ai-news
npm start

# In another terminal (or via Claude MCP)
mcp fetch_articles --sinceDays 7
mcp write_markdown

# Review generated content
git status
git add src/content/blog/
git commit -m "content: add weekly AI news articles"
```

### 3. Quality Checks
```bash
# Before committing
npm run lint                # Code quality
npm run content:check       # Content validation
npm run build              # Production build test

# Accessibility testing (manual)
# - Tab through all interactive elements
# - Test with screen reader
# - Verify color contrast
```

## 🐛 Debugging & Troubleshooting

### Common Issues

#### 1. Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check TypeScript errors
npm run content:check
```

#### 2. HMR Connection Issues
```typescript
// astro.config.ts
export default defineConfig({
  vite: {
    server: {
      hmr: { port: 4322 },
    },
  },
});
```

#### 3. Content Collection Errors
```bash
# Validate frontmatter
npm run content:check

# Check schema in src/content/config.ts
# Ensure all required fields are present
```

### Development Tools

#### VS Code Extensions
- **Astro**: Official Astro language support
- **Tailwind CSS IntelliSense**: Class name completion
- **ESLint**: Real-time linting
- **Prettier**: Auto-formatting
- **TypeScript**: Enhanced TS support

#### Browser DevTools
- **Lighthouse**: Performance and accessibility audits
- **axe DevTools**: Accessibility testing
- **Vue DevTools**: Component inspection (if using Vue)

## 🚀 Performance Optimization

### Development Best Practices
```typescript
// Lazy load images
<Image
  src={imageSrc}
  alt={altText}
  loading="lazy"
  widths={[400, 800, 1200]}
  sizes="(max-width: 768px) 400px, (max-width: 1200px) 800px, 1200px"
/>

// Optimize fonts
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
```

### Build Optimization
```bash
# Analyze bundle size
npm run build
npx astro build --verbose

# Check for unused CSS
npm run build -- --mode=production
```

## 📝 Code Standards

### TypeScript Guidelines
- **Strict mode**: Always enabled
- **Explicit types**: For function parameters and returns
- **Interface over type**: For object shapes
- **Zod schemas**: For runtime validation

### Component Guidelines
- **Single responsibility**: One component, one purpose
- **Props interface**: Always define props types
- **Accessibility**: ARIA labels and semantic HTML
- **Performance**: Minimize client-side JavaScript

### Commit Messages
```bash
# Format: type(scope): description
feat(blog): add image generation for posts
fix(nav): resolve mobile menu focus trap
docs(mcp): update installation instructions
style(ui): improve button hover states
```

This development workflow ensures consistent, high-quality code while maintaining the project's performance and accessibility standards.