# AI Studio Website

Een productieklare website voor AI Studio gebouwd met Astro, TypeScript en Tailwind CSS. Volledig geoptimaliseerd voor toegankelijkheid (WCAG 2.2 AA), SEO en performance.

## ✨ Features

- 🚀 **Astro + TypeScript** - Moderne, statische site generator
- 🎨 **Tailwind CSS** - Utility-first CSS framework met dark mode
- ♿ **WCAG 2.2 AA** - Volledig toegankelijke website
- 🔍 **SEO-geoptimaliseerd** - Open Graph, JSON-LD, sitemap
- 📱 **Responsive design** - Werkt perfect op alle apparaten
- 📊 **Content Collections** - Type-safe content management
- 🤖 **MCP Blog Import** - Automatische AI-nieuws import via RSS
- ⚡ **Performance-first** - Lighthouse score 95+

## 🚀 Quick Start

```bash
# Installeer dependencies
npm install
cd mcp/ai-news && npm install && cd ../..

# Start development
npm run dev

# Start MCP server (nieuwe terminal)
npm run mcp:dev

# Build voor productie
npm run build
```

## 📚 Documentatie

Uitgebreide documentatie is beschikbaar in de [`docs/`](./docs/) folder:

### Core Documentation
- **[Project Overview](./docs/architecture/overview.md)** - Volledige projectbeschrijving en doelstellingen
- **[Development Guide](./docs/development/setup-and-workflow.md)** - Development environment en workflow
- **[Deployment Guide](./docs/deployment/deployment-options.md)** - Productie deployment strategieën

### Specialized Guides
- **[MCP AI News Tool](./docs/mcp/ai-news-tool.md)** - RSS import tool usage en configuratie
- **[Advertising Setup](./docs/guides/advertising-setup.md)** - Revenue optimization en ad management

### Quick Links
- **[Full Documentation Index](./docs/README.md)** - Overzicht van alle documentatie
- **[Troubleshooting](./docs/development/troubleshooting.md)** - Veelvoorkomende problemen en oplossingen

## 🤖 MCP AI News Tool

Automatische import van AI-nieuws uit RSS feeds:

```bash
mcp list_feeds                          # Toon beschikbare feeds
mcp fetch_articles --sinceDays 7        # Haal recente artikelen op
mcp write_markdown                      # Schrijf naar blog directory
```

**Bronnen**: Hugging Face, OpenAI, Google AI, Meta AI, MIT News, Papers with Code, en meer.

## 🛠️ Scripts

```bash
npm run dev           # Development server
npm run build         # Production build met checks
npm run lint          # ESLint + Prettier check
npm run format        # Auto-format code
npm run content:check # Valideer Astro content
```

## 📋 Project Status

### ✅ Completed Features
- Modern Astro + TypeScript setup
- Full accessibility compliance (WCAG 2.2 AA)
- SEO optimization met JSON-LD schemas
- Responsive design met mobile navigation
- MCP tool voor automated content import
- Blog systeem met filtering en zoekfunctionaliteit

### 🔄 Current Development
- AI image generation voor blog posts
- Google AdSense integratie
- Advanced analytics en tracking

### ⏳ Planned Enhancements
- CRM integratie
- Email automation
- Client portal
- AI chatbot integration

## 📞 Support

Voor vragen over de website implementatie:
- 📧 Email: info@ai-studio.be
- 🌐 Website: https://ai-studio.be
- 📖 Documentatie: [docs/README.md](./docs/README.md)
