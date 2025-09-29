import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const window = new JSDOM("").window;
const purify = DOMPurify(window);
purify.addHook("beforeSanitizeElements", (node, data) => {
  if (data && data.tagName === "script") {
    const el = node;
    if (typeof el.remove === "function") {
      el.remove();
    } else if (el.parentNode) {
      el.parentNode.removeChild(el);
    }
    return;
  }
});
function sanitizeHTML(content) {
  if (!content || typeof content !== "string") {
    return "";
  }
  const cleanContent = purify.sanitize(content, {
    ALLOWED_TAGS: [
      "p",
      "br",
      "strong",
      "b",
      "em",
      "i",
      "u",
      "a",
      "ul",
      "ol",
      "li",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "blockquote",
      "code",
      "pre",
      "img",
      "figure",
      "figcaption",
      "table",
      "thead",
      "tbody",
      "tr",
      "th",
      "td"
    ],
    ALLOWED_ATTR: ["href", "title", "alt", "src", "width", "height", "class"],
    ALLOW_DATA_ATTR: false,
    ALLOW_UNKNOWN_PROTOCOLS: false,
    SANITIZE_DOM: true,
    KEEP_CONTENT: true,
    // Remove any style attributes
    FORBID_ATTR: ["style", "on*"]
  });
  return cleanContent;
}
function sanitizeText(text) {
  if (!text || typeof text !== "string") {
    return "";
  }
  const cleanText = purify.sanitize(text, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true
  });
  return cleanText.trim();
}
function sanitizeURL(url) {
  if (!url || typeof url !== "string") {
    return null;
  }
  try {
    const parsedUrl = new URL(url);
    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return null;
    }
    return parsedUrl.toString();
  } catch {
    return null;
  }
}

export { sanitizeHTML as a, sanitizeURL as b, sanitizeText as s };
