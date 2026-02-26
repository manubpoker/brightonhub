import DOMPurify from 'dompurify';

/**
 * Sanitize HTML from external APIs to prevent XSS.
 * Allows basic formatting tags only.
 */
export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'span'],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
  });
}

/**
 * Sanitize HTML from external APIs that may double-encode HTML entities.
 * Unescapes entities (e.g. &lt;p&gt; → <p>) before sanitizing.
 * Use this for Police.uk descriptions, Darwin NRCC messages, etc.
 */
export function sanitizeApiHtml(dirty: string): string {
  let text = dirty;
  let prev = '';
  let i = 0;
  // Iteratively unescape in case of multiple levels of encoding
  while (text !== prev && i < 3) {
    prev = text;
    text = text
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
    i++;
  }
  return sanitizeHtml(text);
}
