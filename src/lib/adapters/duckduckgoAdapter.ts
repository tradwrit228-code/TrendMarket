import * as cheerio from 'cheerio';
import { DataAdapter, sanitizeText } from './baseAdapter';
import { RawSnippet, RawSnippetSchema } from '../schemas/comparison';
import { externalApiQueue } from '../infrastructure/rateLimiter';

export class DuckDuckGoAdapter implements DataAdapter {
  public name = "DuckDuckGoAdapter";

  private getLangCode(userLang: string): string {
    if (!userLang) return 'fr';
    return userLang.split('-')[0].toLowerCase();
  }

  public async fetch(query: string, _category: string, userLang: string): Promise<RawSnippet[]> {
    const langCode = this.getLangCode(userLang);
    const results: RawSnippet[] = [];

    try {
      const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
      const html = await externalApiQueue.enqueue(async () => {
        const response = await fetch(searchUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept-Language': `${userLang},${langCode};q=0.9,en-US;q=0.8,en;q=0.7`,
          },
        });
        if (!response.ok) throw new Error(`DDG Fetch Error ${response.status}`);
        return response.text();
      });

      const $ = cheerio.load(html);

      $('.result').each((_, el) => {
        if (results.length >= 6) return;
        const titleEl = $(el).find('.result__title a');
        const snippetEl = $(el).find('.result__snippet');
        const title = sanitizeText(titleEl.text());
        let rawUrl = titleEl.attr('href') || '';
        const snippet = sanitizeText(snippetEl.text());

        if (rawUrl.includes('uddg=')) {
          const match = rawUrl.match(/uddg=([^&]+)/);
          if (match && match[1]) {
            rawUrl = decodeURIComponent(match[1]);
          }
        }

        if (title && snippet && rawUrl.startsWith('http')) {
          const item = {
            source: "DuckDuckGo Web Search",
            title,
            url: rawUrl,
            snippet,
            timestamp: Date.now(),
          };

          const parsed = RawSnippetSchema.safeParse(item);
          if (parsed.success) {
            results.push(parsed.data);
          }
        }
      });
    } catch (err) {
      console.warn("DuckDuckGoAdapter fetch error:", err);
    }

    return results;
  }
}

export const duckDuckGoAdapter = new DuckDuckGoAdapter();
