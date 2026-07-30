import { RawSnippet } from '../schemas/comparison';

export interface DataAdapter {
  name: string;
  fetch(term: string, category: string, userLang: string): Promise<RawSnippet[]>;
}

export function sanitizeText(text: string): string {
  if (!text) return '';
  return text
    .replace(/https?:\/\/\S+/g, '') // strip URLs
    .replace(/\s+/g, ' ') // collapse multi whitespaces
    .replace(/[\r\n]+/g, ' ')
    .trim();
}
