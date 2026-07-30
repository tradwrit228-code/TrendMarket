import { DataAdapter, sanitizeText } from './baseAdapter';
import { RawSnippet, RawSnippetSchema } from '../schemas/comparison';
import { externalApiQueue } from '../infrastructure/rateLimiter';

export class WikipediaAdapter implements DataAdapter {
  public name = "WikipediaAdapter";

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
          const r = await fetch(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ComparativeEngine/2.0' }
          });
          if (!r.ok) throw new Error(`HTTP ${r.status}`);
          return r.json();
        });

        if (res && res.query && res.query.pages) {
          const pages = Object.values(res.query.pages) as any[];
          const page = pages[0];
          if (page && page.pageid && page.extract && page.extract.length > 30) {
            const cleanExtract = sanitizeText(page.extract);
            const rawSnippet = {
              source: `Wikipedia (${lang.toUpperCase()})`,
              title: page.title || term,
              url: page.fullurl || `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(term)}`,
              snippet: cleanExtract.slice(0, 350),
              timestamp: Date.now(),
            };

            const parsed = RawSnippetSchema.safeParse(rawSnippet);
            if (parsed.success) {
              snippets.push(parsed.data);
              break; // Got primary language hit
            }
          }
        }
      } catch (err) {
        console.warn(`WikipediaAdapter error (${lang}):`, err);
      }
    }

    return snippets;
  }
}

export const wikipediaAdapter = new WikipediaAdapter();
