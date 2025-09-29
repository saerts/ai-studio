import { s as sanitizeText, a as sanitizeHTML, b as sanitizeURL } from '../../chunks/security_DM2jXN_m.mjs';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { z } from 'zod';
export { renderers } from '../../renderers.mjs';

const apiRateLimiter = new RateLimiterMemory({
  points: 10,
  // Number of requests
  duration: 60,
  // Per 60 seconds
  blockDuration: 60
  // Block for 60 seconds if limit is reached
});
const refreshRateLimiter = new RateLimiterMemory({
  points: 3,
  // Number of refresh requests
  duration: 300,
  // Per 5 minutes
  blockDuration: 300
  // Block for 5 minutes if limit is reached
});
const mcpRateLimiter = new RateLimiterMemory({
  points: 5,
  // Number of MCP requests
  duration: 600,
  // Per 10 minutes
  blockDuration: 600
  // Block for 10 minutes if limit is reached
});
function getClientId(request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const cfConnectingIp = request.headers.get("cf-connecting-ip");
  if (cfConnectingIp) return cfConnectingIp;
  if (realIp) return realIp;
  if (forwardedFor) {
    const first = forwardedFor.split(",")[0];
    if (first) return first.trim();
  }
  return "unknown";
}
async function checkApiRateLimit(request) {
  const clientId = getClientId(request);
  try {
    await apiRateLimiter.consume(clientId);
    return { allowed: true };
  } catch (rateLimiterRes) {
    const rateLimitResult = rateLimiterRes;
    const resetTime = new Date(
      Date.now() + (rateLimitResult.msBeforeNext || 6e4)
    );
    return { allowed: false, resetTime };
  }
}
async function checkRefreshRateLimit(request) {
  const clientId = getClientId(request);
  try {
    await refreshRateLimiter.consume(clientId);
    return { allowed: true };
  } catch (rateLimiterRes) {
    const rateLimitResult = rateLimiterRes;
    const resetTime = new Date(
      Date.now() + (rateLimitResult.msBeforeNext || 3e5)
    );
    return { allowed: false, resetTime };
  }
}
async function checkMCPRateLimit(request) {
  const clientId = getClientId(request);
  try {
    await mcpRateLimiter.consume(clientId);
    return { allowed: true };
  } catch (rateLimiterRes) {
    const rateLimitResult = rateLimiterRes;
    const resetTime = new Date(
      Date.now() + (rateLimitResult.msBeforeNext || 6e5)
    );
    return { allowed: false, resetTime };
  }
}
function createRateLimitResponse(resetTime) {
  return new Response(
    JSON.stringify({
      error: "Rate limit exceeded",
      message: "Too many requests. Please try again later.",
      resetTime: resetTime.toISOString()
    }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": Math.ceil(
          (resetTime.getTime() - Date.now()) / 1e3
        ).toString(),
        "X-RateLimit-Reset": resetTime.toISOString()
      }
    }
  );
}

const blogQuerySchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(50),
  offset: z.coerce.number().min(0).default(0),
  tag: z.string().optional(),
  refresh: z.enum(["true", "false"]).optional()
});
const blogRefreshSchema = z.object({
  action: z.enum(["refresh", "fetch_and_generate"]),
  sinceDays: z.number().min(1).max(90).optional().default(7),
  limit: z.number().min(1).max(100).optional().default(50),
  generateImages: z.boolean().optional().default(false),
  imageStyle: z.string().optional().default("corporate")
});
const mcpArticleSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string().min(1).max(300),
  description: z.string().max(1e3),
  link: z.string().url(),
  pubDate: z.string().datetime().or(z.date()),
  content: z.string(),
  source: z.string(),
  tags: z.array(z.string()).default([]),
  summary: z.string().max(1e3).default(""),
  guid: z.string().optional(),
  cover: z.string().url().optional(),
  coverAlt: z.string().max(200).optional(),
  coverGenerated: z.boolean().optional(),
  fetchedAt: z.string().datetime().optional()
});
const blogPostDataSchema = z.object({
  title: z.string().min(1).max(300),
  description: z.string().max(1e3),
  pubDate: z.date(),
  updatedDate: z.date(),
  tags: z.array(z.string()).default([]),
  source: z.string().optional(),
  canonicalUrl: z.string().url().optional(),
  cover: z.string().url().optional(),
  coverAlt: z.string().max(200).optional(),
  coverGenerated: z.boolean().optional(),
  draft: z.boolean().default(false)
});
z.object({
  id: z.string(),
  slug: z.string(),
  data: blogPostDataSchema,
  body: z.string()
});
function validateBlogQuery(searchParams) {
  const params = Object.fromEntries(searchParams.entries());
  return blogQuerySchema.safeParse(params);
}
function validateBlogRefresh(body) {
  return blogRefreshSchema.safeParse(body);
}
function validateMCPArticle(article) {
  return mcpArticleSchema.safeParse(article);
}

class AppError extends Error {
  statusCode;
  code;
  isOperational;
  constructor(message, statusCode = 500, code, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, AppError.prototype);
    if ("captureStackTrace" in Error && typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
function extractErrorDetails(error) {
  const timestamp = (/* @__PURE__ */ new Date()).toISOString();
  if (error instanceof AppError) {
    return {
      message: error.message,
      stack: error.stack,
      code: error.code,
      statusCode: error.statusCode,
      timestamp
    };
  }
  if (error instanceof Error) {
    return {
      message: error.message,
      stack: error.stack,
      timestamp
    };
  }
  if (typeof error === "string") {
    return {
      message: error,
      timestamp
    };
  }
  if (error && typeof error === "object") {
    const errorObj = error;
    return {
      message: errorObj.message || "Unknown error",
      stack: errorObj.stack,
      code: errorObj.code,
      statusCode: errorObj.statusCode,
      timestamp
    };
  }
  return {
    message: "Unknown error occurred",
    timestamp
  };
}
function createErrorResponse(error, defaultStatus = 500) {
  const errorDetails = extractErrorDetails(error);
  const statusCode = errorDetails.statusCode || defaultStatus;
  const response = {
    error: true,
    message: errorDetails.message,
    code: errorDetails.code,
    timestamp: errorDetails.timestamp,
    ...process.env.NODE_ENV === "development" && {
      stack: errorDetails.stack
    }
  };
  return new Response(JSON.stringify(response), {
    status: statusCode,
    headers: {
      "Content-Type": "application/json"
    }
  });
}

const MCP_SERVER_URL = process.env.MCP_SERVER_URL || "http://localhost:3001";
const CANONICAL_DOMAIN = process.env.CANONICAL_DOMAIN || "ai-studio44.com";
const LEGACY_DOMAIN = process.env.LEGACY_DOMAIN || "ai-studio44.be";
const normalizedMCPUrl = LEGACY_DOMAIN !== CANONICAL_DOMAIN ? MCP_SERVER_URL.replace(LEGACY_DOMAIN, CANONICAL_DOMAIN) : MCP_SERVER_URL;
async function fetchWithTimeout(url, options = {}, timeoutMs = 2e3) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const resp = await fetch(url, { ...options, signal: controller.signal });
    return resp;
  } finally {
    clearTimeout(id);
  }
}
let __lastMcpWarn = 0;
class MCPBlogService {
  mcpAvailable = false;
  lastHealthCheck = 0;
  cachedPosts = null;
  lastFetch = 0;
  cacheTimeout = 5 * 60 * 1e3;
  // 5 minutes cache
  getStaticFallbackPosts() {
    console.log("Generating static fallback content for production");
    return [
      {
        id: "welcome-ai-studio",
        slug: "welcome-to-ai-studio",
        data: {
          title: "Welkom bij AI Studio - Uw Partner in AI Innovatie",
          description: "Ontdek hoe AI Studio bedrijven helpt met cutting-edge kunstmatige intelligentie oplossingen en strategisch advies.",
          pubDate: /* @__PURE__ */ new Date("2024-01-15"),
          updatedDate: /* @__PURE__ */ new Date("2024-01-15"),
          tags: ["AI", "Innovatie", "Bedrijfsadvies", "Nederland"],
          source: "AI Studio",
          canonicalUrl: "https://ai-studio44.com/blog/welcome-to-ai-studio",
          draft: false
        },
        body: `
          <h2>AI Studio: Uw strategische partner voor AI-transformatie</h2>
          <p>In een wereld waar kunstmatige intelligentie de manier waarop we werken drastisch verandert, staat AI Studio aan de voorhoede van innovatie. Wij helpen bedrijven om de kracht van AI te benutten voor duurzame groei en concurrentievoordeel.</p>

          <h3>Onze expertise</h3>
          <ul>
            <li><strong>AI Strategie & Consultancy</strong> - Ontwikkeling van op maat gemaakte AI-strategieën</li>
            <li><strong>Machine Learning Oplossingen</strong> - Implementatie van geavanceerde ML-modellen</li>
            <li><strong>Process Automation</strong> - Automatisering van bedrijfsprocessen met AI</li>
            <li><strong>Data Analytics</strong> - Inzichten genereren uit complexe datasets</li>
          </ul>

          <p>Neem contact met ons op om te ontdekken hoe AI uw bedrijf kan transformeren.</p>
        `
      },
      {
        id: "ai-trends-2024",
        slug: "ai-trends-nederland-2024",
        data: {
          title: "AI Trends 2024: De Toekomst van Kunstmatige Intelligentie in Nederland",
          description: "Een overzicht van de belangrijkste AI-trends die de Nederlandse bedrijfswereld in 2024 zullen beïnvloeden.",
          pubDate: /* @__PURE__ */ new Date("2024-02-01"),
          updatedDate: /* @__PURE__ */ new Date("2024-02-01"),
          tags: ["AI Trends", "2024", "Nederland", "Technologie"],
          source: "AI Studio",
          canonicalUrl: "https://ai-studio44.com/blog/ai-trends-nederland-2024",
          draft: false
        },
        body: `
          <h2>De AI-revolutie in Nederland: Trends voor 2024</h2>
          <p>Nederlandse bedrijven omarmen AI in een ongekend tempo. Hier zijn de belangrijkste trends die we in 2024 verwachten:</p>

          <h3>1. Generative AI wordt mainstream</h3>
          <p>Van content creatie tot code generatie, generative AI-tools worden standaard in Nederlandse bedrijven.</p>

          <h3>2. AI-gedreven klantenservice</h3>
          <p>Chatbots en virtuele assistenten worden steeds geavanceerder en menselijker.</p>

          <h3>3. Ethische AI en compliance</h3>
          <p>Met nieuwe EU-regelgeving wordt verantwoorde AI-implementatie cruciaal.</p>

          <h3>4. AI in de zorg en onderwijs</h3>
          <p>Sectoren zoals zorg en onderwijs ontdekken nieuwe mogelijkheden met AI.</p>

          <p>Wilt u weten hoe deze trends uw bedrijf kunnen beïnvloeden? Neem contact op met AI Studio.</p>
        `
      }
    ];
  }
  async checkHealth(force = false) {
    const now = Date.now();
    if (!force && this.lastHealthCheck && now - this.lastHealthCheck < 3e4) {
      return this.mcpAvailable;
    }
    if (normalizedMCPUrl.includes("localhost") && process.env.NODE_ENV !== "development") {
      this.mcpAvailable = false;
      this.lastHealthCheck = now;
      return false;
    }
    try {
      const res = await this.fetchFromMCP("/health");
      const data = await res.json();
      this.mcpAvailable = Boolean(data && data.status === "ok");
      this.lastHealthCheck = now;
      return this.mcpAvailable;
    } catch {
      this.mcpAvailable = false;
      this.lastHealthCheck = now;
      return false;
    }
  }
  getServiceStatus() {
    return {
      mcpAvailable: this.mcpAvailable,
      lastFetch: this.lastFetch,
      lastHealthCheck: this.lastHealthCheck,
      mcpServerUrl: normalizedMCPUrl
    };
  }
  async fetchFromMCP(endpoint, options = {}) {
    const url = `${normalizedMCPUrl}${endpoint}`;
    try {
      const response = await fetchWithTimeout(
        url,
        {
          ...options,
          headers: {
            "Content-Type": "application/json",
            ...options.headers
          }
        },
        2e3
      );
      if (!response.ok) {
        throw new Error(
          `MCP server responded with ${response.status}: ${response.statusText}`
        );
      }
      return response;
    } catch (error) {
      const now = Date.now();
      if (now - __lastMcpWarn > 6e4) {
        __lastMcpWarn = now;
        console.debug(`MCP request failed (suppressed): ${url}`);
      }
      throw error;
    }
  }
  convertMCPToBlogPost(mcpData) {
    const articles = mcpData.articles || [];
    return articles.map((article, index) => {
      const base = typeof article === "object" && article !== null ? article : {};
      const validation = validateMCPArticle({
        ...base,
        id: base.id || base.guid || `${base.slug || "article"}-${index}`
      });
      if (!validation.success) {
        console.warn(
          "Invalid MCP article structure:",
          validation.error.errors
        );
        return null;
      }
      const validatedArticle = validation.data;
      const sanitizedTitle = sanitizeText(validatedArticle.title);
      const sanitizedDescription = sanitizeText(
        validatedArticle.summary || validatedArticle.description
      );
      const sanitizedContent = sanitizeHTML(validatedArticle.content);
      const sanitizedSource = sanitizeText(validatedArticle.source);
      const sanitizedCanonicalUrl = sanitizeURL(validatedArticle.link);
      const sanitizedCover = validatedArticle.cover ? sanitizeURL(validatedArticle.cover) : void 0;
      const sanitizedCoverAlt = validatedArticle.coverAlt ? sanitizeText(validatedArticle.coverAlt) : void 0;
      const sanitizedTags = validatedArticle.tags.map((tag) => sanitizeText(tag)).filter((tag) => tag.length > 0);
      return {
        id: validatedArticle.id,
        slug: validatedArticle.slug,
        data: {
          title: sanitizedTitle,
          description: sanitizedDescription,
          pubDate: new Date(validatedArticle.pubDate),
          updatedDate: new Date(validatedArticle.pubDate),
          tags: sanitizedTags,
          source: sanitizedSource,
          canonicalUrl: sanitizedCanonicalUrl || validatedArticle.link,
          ...sanitizedCover ? { cover: sanitizedCover } : {},
          ...sanitizedCoverAlt ? { coverAlt: sanitizedCoverAlt } : {},
          ...validatedArticle.coverGenerated !== void 0 ? { coverGenerated: validatedArticle.coverGenerated } : {},
          draft: false
        },
        body: sanitizedContent
      };
    }).filter((post) => post !== null);
  }
  async getPosts(forceRefresh = false) {
    const now = Date.now();
    if (!forceRefresh && this.cachedPosts && now - this.lastFetch < this.cacheTimeout) {
      return this.cachedPosts;
    }
    try {
      const healthy = await Promise.race([
        this.checkHealth(true),
        new Promise(
          (_, reject) => setTimeout(() => reject(new Error("Health check timeout")), 5e3)
        )
      ]);
      if (!healthy) {
        console.warn("MCP server not healthy, returning fallback content");
        if (!this.cachedPosts) {
          this.cachedPosts = this.getStaticFallbackPosts();
        }
        return this.cachedPosts;
      }
      let fetchResult;
      try {
        const fetchResponse = await Promise.race([
          this.fetchFromMCP("/api/articles/fetch", {
            method: "POST",
            body: JSON.stringify({
              sinceDays: 30,
              // Get articles from last 30 days
              limit: 50
              // Limit to 50 articles
            })
          }),
          new Promise(
            (_, reject) => setTimeout(() => reject(new Error("Fetch timeout")), 1e4)
          )
        ]);
        fetchResult = await fetchResponse.json();
        console.log("MCP fetch result:", fetchResult);
      } catch (fetchError) {
        console.warn(
          "Failed to fetch new articles, using existing cache:",
          fetchError
        );
      }
      const articlesResponse = await Promise.race([
        this.fetchFromMCP("/api/articles?limit=50"),
        new Promise(
          (_, reject) => setTimeout(() => reject(new Error("Articles fetch timeout")), 5e3)
        )
      ]);
      const articlesData = await articlesResponse.json();
      if (articlesData.articles && articlesData.articles.length > 0) {
        const storedArticles = articlesData.articles.map(
          (article) => {
            const articleData = article;
            return {
              id: articleData.id || articleData.guid,
              title: articleData.title,
              description: articleData.description,
              link: articleData.link,
              pubDate: new Date(articleData.pubDate),
              content: articleData.content,
              source: articleData.source,
              slug: articleData.slug,
              tags: articleData.tags || [],
              summary: articleData.summary || "",
              cover: articleData.cover,
              coverAlt: articleData.coverAlt,
              coverGenerated: articleData.coverGenerated,
              guid: articleData.id
            };
          }
        );
        this.cachedPosts = this.convertMCPToBlogPost({
          articles: storedArticles
        });
      } else {
        this.cachedPosts = [];
      }
      this.lastFetch = now;
      return this.cachedPosts;
    } catch (error) {
      console.error("Failed to fetch from MCP server:", error);
      if (error instanceof Error) {
        console.error("Error details:", {
          message: error.message,
          stack: error.stack,
          name: error.name
        });
      }
      if (!this.cachedPosts) {
        console.warn("No cached posts available, returning empty array");
        return [];
      }
      console.log(
        `Returning ${this.cachedPosts.length} cached posts due to MCP server error`
      );
      return this.cachedPosts;
    }
  }
  async getPost(slug) {
    const posts = await this.getPosts();
    return posts.find((post) => post.slug === slug) || null;
  }
  async getTags() {
    const posts = await this.getPosts();
    const tagSet = /* @__PURE__ */ new Set();
    posts.forEach((post) => {
      post.data.tags.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }
}
const blogService = new MCPBlogService();
const prerender = false;
const GET = async ({ url, request }) => {
  try {
    const rateLimitCheck = await checkApiRateLimit(request);
    if (!rateLimitCheck.allowed && rateLimitCheck.resetTime) {
      return createRateLimitResponse(rateLimitCheck.resetTime);
    }
    const queryValidation = validateBlogQuery(url.searchParams);
    if (!queryValidation.success) {
      return new Response(
        JSON.stringify({
          error: "Invalid query parameters",
          details: queryValidation.error.errors
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
    const { limit, offset, tag, refresh } = queryValidation.data;
    const forceRefresh = refresh === "true";
    let posts = await blogService.getPosts(forceRefresh);
    if (tag && tag !== "all") {
      posts = posts.filter((post) => post.data.tags.includes(tag));
    }
    posts.sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
    const paginatedPosts = posts.slice(offset, offset + limit);
    const allTags = await blogService.getTags();
    const serializedPosts = paginatedPosts.map((post) => ({
      ...post,
      data: {
        ...post.data,
        pubDate: post.data.pubDate.toISOString(),
        updatedDate: post.data.updatedDate.toISOString()
      }
    }));
    return new Response(
      JSON.stringify({
        posts: serializedPosts,
        tags: allTags,
        total: posts.length,
        offset,
        limit,
        serviceStatus: blogService.getServiceStatus()
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=300"
          // 5 minute cache
        }
      }
    );
  } catch (error) {
    console.error("Error in GET /api/blog:", extractErrorDetails(error));
    return createErrorResponse(error, 500);
  }
};
const POST = async ({ request }) => {
  try {
    const rateLimitCheck = await checkRefreshRateLimit(request);
    if (!rateLimitCheck.allowed && rateLimitCheck.resetTime) {
      return createRateLimitResponse(rateLimitCheck.resetTime);
    }
    const body = await request.json().catch(() => ({}));
    const validation = validateBlogRefresh(body);
    if (!validation.success) {
      return new Response(
        JSON.stringify({
          error: "Invalid request body",
          details: validation.error.errors
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
    const {
      action,
      sinceDays,
      limit: requestLimit,
      generateImages,
      imageStyle
    } = validation.data;
    if (action === "refresh") {
      const posts = await blogService.getPosts(true);
      return new Response(
        JSON.stringify({
          message: "News posts refreshed successfully",
          count: posts.length,
          posts
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }
    if (action === "fetch_and_generate") {
      const mcpRateLimitCheck = await checkMCPRateLimit(request);
      if (!mcpRateLimitCheck.allowed && mcpRateLimitCheck.resetTime) {
        return createRateLimitResponse(mcpRateLimitCheck.resetTime);
      }
      try {
        const healthy = await blogService["checkHealth"]?.call(blogService, true) ?? false;
        if (!healthy) {
          return new Response(
            JSON.stringify({
              message: "MCP server unavailable; refresh deferred/ignored",
              detail: `MCP server at ${normalizedMCPUrl} is not reachable. Using cached posts if available.`,
              serviceStatus: blogService.getServiceStatus()
            }),
            {
              status: 202,
              headers: { "Content-Type": "application/json" }
            }
          );
        }
        const mcpResponse = await fetchWithTimeout(
          `${normalizedMCPUrl}/api/articles/fetch`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              sinceDays,
              limit: requestLimit
            })
          },
          3e3
        );
        if (!mcpResponse.ok) {
          throw new Error("Failed to fetch articles from MCP");
        }
        if (generateImages) {
          const imageResponse = await fetchWithTimeout(
            `${normalizedMCPUrl}/api/images/generate`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                style: imageStyle,
                regenerate: false
              })
            },
            3e3
          );
          if (!imageResponse.ok) {
            console.warn("Image generation failed, continuing without images");
          }
        }
        const posts = await blogService.getPosts(true);
        return new Response(
          JSON.stringify({
            message: "Articles fetched and processed successfully",
            count: posts.length
          }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json"
            }
          }
        );
      } catch (error) {
        return new Response(
          JSON.stringify({
            message: "Fetch/generate skipped due to MCP error; using cached posts if available",
            detail: error instanceof Error ? error.message : "Unknown error",
            serviceStatus: blogService.getServiceStatus()
          }),
          {
            status: 202,
            headers: {
              "Content-Type": "application/json"
            }
          }
        );
      }
    }
    return new Response(
      JSON.stringify({
        error: "Invalid action",
        availableActions: ["refresh", "fetch_and_generate"]
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  } catch (error) {
    console.error("Error in POST /api/blog:", extractErrorDetails(error));
    return createErrorResponse(error, 500);
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
