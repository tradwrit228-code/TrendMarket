import { DataAdapter, sanitizeText, isValidHttpUrl } from './baseAdapter';
import { RawSnippet, RawSnippetSchema } from '../schemas/comparison';
import { externalApiQueue } from '../infrastructure/rateLimiter';

export class WikipediaAdapter implements DataAdapter {
  public name = "WikipediaAdapter";
  private timeoutMs = 8000;

  private getLangCode(userLang: string): string {
    if (!userLang) return 'fr';
    return userLang.split('-')[0].toLowerCase();
  }

  public async fetch(term: string, _category: string, userLang: string): Promise<RawSnippet[]> {
    const langCode = this.getLangCode(userLang);
    const tryLangs = [langCode];
    if (langCode !== 'en') tryLangs.push('en');
    if (langCode !== 'fr' && !tryLangs.includes('fr')) tryLangs.push('fr');

    const snippets: RawSnippet[] = [];

    for (const lang of tryLangs) {
      try {
        const url = `https://${lang}.wikipedia.org/w/api.php?action=query&prop=extracts|info&exintro=1&explaintext=1&titles=${encodeURIComponent(term)}&format=json&inprop=url&origin=*`;
        
        const res = await externalApiQueue.enqueue(async () => {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);
          
          try {
            const r = await fetch(url, {
              headers: { 
                'User-Agent': 'TrendMarket-ComparativeEngine/2.0 (Security & Health Audit Compliant)',
                'Accept': 'application/json'
              },
              signal: controller.signal
            });
            if (!r.ok) throw new Error(`HTTP ${r.status}`);
            return await r.json();
          } finally {
            clearTimeout(timeoutId);
          }
        });

        if (res && res.query && res.query.pages) {
          const pages = Object.values(res.query.pages) as any[];
          const page = pages[0];
          if (page && page.pageid && page.extract && page.extract.length > 30) {
            const cleanExtract = sanitizeText(page.extract);
            const rawUrl = page.fullurl || `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(term)}`;
            
            if (isValidHttpUrl(rawUrl)) {
              const rawSnippet = {
                source: `Wikipedia (${lang.toUpperCase()})`,
                title: page.title || term,
                url: rawUrl,
                snippet: cleanExtract.slice(0, 350),
                timestamp: Date.now(),
              };

              const parsed = RawSnippetSchema.safeParse(rawSnippet);
              if (parsed.success) {
                snippets.push(parsed.data);
                break; // Primary language hit resolved
              }
            }
          }
        }
      } catch (err: any) {
        if (err?.name === 'AbortError') {
          console.warn(`WikipediaAdapter timeout after ${this.timeoutMs}ms for ${lang}`);
        } else {
          console.warn(`WikipediaAdapter error (${lang}):`, err?.message || err);
        }
      }
    }

    return snippets;
  }
}

export const wikipediaAdapter = new WikipediaAdapter();
