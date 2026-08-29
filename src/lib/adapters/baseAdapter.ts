import { RawSnippet } from '../schemas/comparison';

export interface DataAdapter {
  name: string;
  fetch(term: string, category: string, userLang: string): Promise<RawSnippet[]>;
}

export function sanitizeText(text: string): string {
  if (!text || typeof text !== 'string') return '';
  return text
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // remove ASCII control characters
    .replace(/https?:\/\/\S+/g, '') // strip raw URLs from snippet text
    .replace(/\s+/g, ' ') // collapse multi whitespaces
    .replace(/[\r\n]+/g, ' ')
    .trim();
}

export function isValidHttpUrl(urlString: string): boolean {
  if (!urlString || typeof urlString !== 'string') return false;
  try {
    const parsed = new URL(urlString);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}
