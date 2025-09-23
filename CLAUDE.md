# AI Studio - Claude Code Guidelines

## 🚀 Project Overview

AI Studio is a production-ready consultancy website built with Astro + TypeScript, featuring:
- Full WCAG 2.2 AA accessibility compliance
- MCP tool for automated AI news import with DALL-E 3 image generation
- SEO optimization with JSON-LD structured data
- Responsive design with Tailwind CSS

## 🛠️ Development Commands

### Build & Dev
```bash
npm run dev          # Start development server (port 4321)
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # ESLint check
npm run typecheck    # TypeScript validation
```

### MCP Tool (AI News Import)
```bash
cd mcp/ai-news
npm run build        # Compile TypeScript
npm run dev          # Development mode
npm start           # Run MCP server

# MCP Commands (when connected)
mcp fetch_articles --since-days 7
mcp write_markdown --include-images true
mcp generate_images --style corporate
mcp get_usage_stats
```

## 📁 Project Structure

```
ai-studio/
├── src/
│   ├── components/     # Astro components
│   ├── content/        # Content collections (blog, pages)
│   ├── layouts/        # Page layouts
│   └── pages/          # Route pages
├── mcp/ai-news/        # MCP tool for content automation
├── public/             # Static assets
└── docs/               # Comprehensive documentation
    ├── architecture/   # Technical architecture
    ├── development/    # Development guides
    ├── mcp/           # MCP tool documentation
    └── general/       # General docs (design-review, etc.)
```

## 🎯 Key Technical Decisions

### Accessibility First
- All components implement WCAG 2.2 AA standards
- Screen reader support with proper ARIA attributes
- Keyboard navigation throughout
- Color contrast ratios meet AA requirements

### SEO Optimization
- JSON-LD structured data for all pages
- Open Graph and Twitter Card meta tags
- Semantic HTML5 markup
- RSS feed generation

### Content Strategy
- Automated AI news import via MCP tool
- DALL-E 3 generated images with brand consistency
- High-commercial-intent content focus
- Source attribution and canonical URLs

## 🔧 Configuration Files

### Environment Variables
```bash
# Required for MCP image generation
OPENAI_API_KEY=sk-your-key
OPENAI_ORG_ID=org-your-org  # Optional

# Image generation settings
IMAGE_GENERATION_ENABLED=true
DEFAULT_IMAGE_STYLE=corporate
IMAGE_MONTHLY_BUDGET=50
IMAGE_BATCH_SIZE=3
```

### Key Config Files
- `astro.config.ts` - Astro configuration with integrations
- `tailwind.config.js` - Tailwind CSS customization
- `tsconfig.json` - TypeScript configuration
- `mcp/ai-news/package.json` - MCP tool dependencies

## 🎨 Design System

### Colors (AI Studio Brand)
- Primary Blue: `#0ea5e9` (sky-500)
- Dark Blue: `#0369a1` (sky-700)
- Neutral Gray: `#64748b` (slate-500)
- Success: `#10b981` (emerald-500)

### Typography
- Headings: Inter font family
- Body: System font stack
- Code: JetBrains Mono

### Components
- Responsive navigation with hamburger menu
- Accessible form components
- SEO-optimized blog post layouts
- Ad placement components (in development)

## ⚡ Performance Standards

### Core Web Vitals
- LCP < 2.5s
- FID < 100ms
- CLS < 0.1

### Image Optimization
- WebP format with fallbacks
- Responsive images (400w-1600w)
- Lazy loading
- AI-generated images cached for 90 days

## 🧪 Testing Strategy

### Accessibility Testing
```bash
# Manual testing checklist
- Screen reader navigation (VoiceOver/NVDA)
- Keyboard-only navigation
- Color contrast validation
- Focus management testing
```

### Build Validation
```bash
npm run typecheck  # Must pass before commits
npm run lint       # ESLint validation
npm run build      # Production build test
```

## 📋 Development Workflow

1. **Feature Development**
   - Create feature branch
   - Implement with accessibility first
   - Test across devices/browsers
   - Validate with TypeScript/ESLint

2. **MCP Tool Updates**
   - Update TypeScript types in `src/types.ts`
   - Implement functionality in relevant modules
   - Build and test: `npm run build`
   - Update documentation in `docs/mcp/`

3. **Content Management**
   - Use MCP tool for automated content import
   - AI-generated images maintain brand consistency
   - Manual review for quality and accuracy

## 🎯 Advertising Integration (In Progress)


## 🔍 SEO Strategy

### Technical SEO
- Structured data markup (JSON-LD)
- Canonical URLs for imported content
- XML sitemap generation
- Robot.txt optimization

### Content SEO
- High-commercial-intent keywords
- AI industry focus
- Regular content updates via MCP
- Internal linking strategy

## 📖 Documentation

### For Developers
- `docs/development/` - Setup and workflow guides
- `docs/architecture/` - Technical architecture
- `docs/mcp/` - MCP tool documentation

### For Content Creators
- `docs/content/` - Content guidelines and strategy
- MCP tool usage for automated imports
- Image generation workflows

## 🚨 Important Notes

### Security
- Never commit API keys or secrets
- Use environment variables for configuration
- Validate all user inputs
- Implement proper error boundaries

### Brand Consistency
- AI Studio blue color palette in all generated images
- Professional, corporate tone
- Consistent typography and spacing
- Accessibility-first approach

---

*This file is maintained for Claude Code sessions. Update when adding new features or changing workflows.*
