import { CompareData, CompareDataSchema } from './schemas/comparison';
import { wikipediaAdapter } from './adapters/wikipediaAdapter';
import { duckDuckGoAdapter } from './adapters/duckduckgoAdapter';
import { normalizer } from './pipeline/normalizer';
import { metricsCalculator } from './engine/metricsCalculator';
import { cacheManager } from './infrastructure/cacheManager';
import { logger } from './infrastructure/logger';

export async function performDirectWebSearch(
  termA: string,
  termB: string,
  category = "Général",
  userLang = "fr-FR"
): Promise<CompareData> {
  const startTime = Date.now();
  const langCode = userLang.split('-')[0].toLowerCase();
  const cacheKey = `direct_web:${termA.toLowerCase()}:${termB.toLowerCase()}:${category.toLowerCase()}:${langCode}`;

  // 1. Check cache first
  const cachedData = cacheManager.get<CompareData>(cacheKey);
  if (cachedData) {
    logger.logExtraction(termA, termB, 'direct_web_cache', true, Date.now() - startTime, cachedData.groundingSources.length);
    return cachedData;
  }

  try {
    // 2. Prepare localized search queries
    let queryA = `${termA} ${category} avis fiche technique`;
    let queryB = `${termB} ${category} avis fiche technique`;
    let queryVs = `${termA} vs ${termB} ${category} comparatif`;

    if (langCode === 'en') {
      queryA = `${termA} ${category} review specs`;
      queryB = `${termB} ${category} review specs`;
      queryVs = `${termA} vs ${termB} ${category} comparison`;
    } else if (langCode === 'es') {
      queryA = `${termA} ${category} opiniones ficha tecnica`;
      queryB = `${termB} ${category} opiniones ficha tecnica`;
      queryVs = `${termA} vs ${termB} ${category} comparativa`;
    } else if (langCode === 'de') {
      queryA = `${termA} ${category} bewertung technische daten`;
      queryB = `${termB} ${category} bewertung technische daten`;
      queryVs = `${termA} vs ${termB} ${category} vergleich`;
    }

    // 3. Parallel fetch via modularized adapters with rate-limit queue
    const [wikiResA, wikiResB, ddgResA, ddgResB, ddgVs] = await Promise.all([
      wikipediaAdapter.fetch(termA, category, userLang),
      wikipediaAdapter.fetch(termB, category, userLang),
      duckDuckGoAdapter.fetch(queryA, category, userLang),
      duckDuckGoAdapter.fetch(queryB, category, userLang),
      duckDuckGoAdapter.fetch(queryVs, category, userLang),
    ]);

    const wikiA = wikiResA[0] || null;
    const wikiB = wikiResB[0] || null;
    const allSnippetsA = [...wikiResA, ...ddgResA];
    const allSnippetsB = [...wikiResB, ...ddgResB];
    const allSnippets = [...allSnippetsA, ...allSnippetsB, ...ddgVs];

    // 4. Ingestion & Normalization
    const profileA = normalizer.normalizeItemProfile(termA, category, wikiA, ddgResA, langCode);
    const profileB = normalizer.normalizeItemProfile(termB, category, wikiB, ddgResB, langCode);

    // 5. Metrics Engine Calculation
    const metrics = metricsCalculator.computeComparisonMetrics(profileA, profileB, allSnippetsA, allSnippetsB);

    // 6. Grounding sources extraction
    const groundingSources = normalizer.extractGroundingSources(allSnippets);

    // 7. Comparison Summary synthesis
    const comparisonSummary = ddgVs[0]?.snippet
      ? `Analyse comparative entre ${termA} et ${termB} : ${ddgVs[0].snippet}`
      : `La comparaison entre ${termA} et ${termB} met en avant des approches distinctes dans le secteur "${category}". ${termA} se distingue par son ancrage et sa notoriété (Score: ${profileA.trendScore}), tandis que ${termB} propose une alternative très compétitive (Score: ${profileB.trendScore}).`;

    const result: CompareData = {
      isFallback: false,
      isDirectWebSearch: true,
      termA: profileA,
      termB: profileB,
      comparisonSummary,
      keyFactors: [
        "Performances & Capacités principales",
        "Expérience utilisateur & Ergonomie",
        "Facilité d'intégration & Accessibilité"
      ],
      groundingSources,
      metrics,
    };

    // 8. Validate output schema with Zod
    const parsedResult = CompareDataSchema.safeParse(result);
    const finalData = parsedResult.success ? parsedResult.data : result;

    // 9. Store in cache & log audit entry
    cacheManager.set(cacheKey, finalData);
    logger.logExtraction(termA, termB, 'direct_web', true, Date.now() - startTime, groundingSources.length);

    return finalData;
  } catch (error: any) {
    logger.logExtraction(termA, termB, 'direct_web', false, Date.now() - startTime, 0, error?.message || String(error));
    throw error;
  }
}
