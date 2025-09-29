import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

// Create a mock window for server-side usage
const window = new JSDOM('').window;
const purify = DOMPurify(window);

// Configure DOMPurify for blog content
purify.addHook('beforeSanitizeElements', (node, data) => {
  // Remove any script tags entirely
  if (data.tagName === 'script') {
    node.remove();
    return;
  }
});

/**
 * Sanitizes HTML content from external sources
 * Removes potentially dangerous scripts, inline styles, and event handlers
 * while preserving safe HTML for blog content display
 */
export function sanitizeHTML(content: string): string {
  if (!content || typeof content !== 'string') {
    return '';
  }

  // Configure allowed tags and attributes for blog content
  const cleanContent = purify.sanitize(content, {
    ALLOWED_TAGS: [
      'p',
      'br',
      'strong',
      'b',
      'em',
      'i',
      'u',
      'a',
      'ul',
      'ol',
      'li',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'blockquote',
      'code',
      'pre',
      'img',
      'figure',
      'figcaption',
      'table',
      'thead',
      'tbody',
      'tr',
      'th',
      'td',
    ],
    ALLOWED_ATTR: ['href', 'title', 'alt', 'src', 'width', 'height', 'class'],
    ALLOW_DATA_ATTR: false,
    ALLOW_UNKNOWN_PROTOCOLS: false,
    SANITIZE_DOM: true,
    KEEP_CONTENT: true,
    // Remove any style attributes
    FORBID_ATTR: ['style', 'on*'],
  });

  return cleanContent;
}

/**
 * Sanitizes text content, stripping all HTML
 * Used for titles, descriptions, and other text-only fields
 */
export function sanitizeText(text: string): string {
  if (!text || typeof text !== 'string') {
    return '';
  }

  // Strip all HTML and decode entities
  const cleanText = purify.sanitize(text, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
  });

  return cleanText.trim();
}

/**
 * Validates and sanitizes URLs
 */
export function sanitizeURL(url: string): string | null {
  if (!url || typeof url !== 'string') {
    return null;
  }

  try {
    const parsedUrl = new URL(url);

    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return null;
    }

    return parsedUrl.toString();
  } catch {
    return null;
  }
}
