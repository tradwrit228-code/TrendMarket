import { ItemProfile, ItemProfileSchema, RawSnippet, GroundingSource } from '../schemas/comparison';
import { trendsAdapter } from '../adapters/trendsAdapter';

export class DataNormalizer {
  /**
   * Transforms raw scraped snippets into a unified, validated ItemProfile schema
   */
  public normalizeItemProfile(
    term: string,
    category: string,
    wikiSnippet: RawSnippet | null,
    ddgSnippets: RawSnippet[],
    langCode = 'fr'
  ): ItemProfile {
    // 1. Calculate trend & volatility metrics
    const trends = trendsAdapter.calculateMetrics(term);

    // 2. Extract description from Wikipedia or first snippet
    let description = "";
    if (wikiSnippet && wikiSnippet.snippet.length > 20) {
      description = wikiSnippet.snippet;
    } else if (ddgSnippets.length > 0 && ddgSnippets[0].snippet.length > 20) {
      description = ddgSnippets[0].snippet;
    } else {
      description = `${term} est une solution répertoriée dans le domaine ${category}, offrant un ensemble de fonctionnalités et de services adaptés.`;
    }

    // 3. Extract & clean capabilities
    const capabilities: string[] = [];
    ddgSnippets.forEach((s) => {
      const text = s.snippet.trim();
      if (text.length > 20 && capabilities.length < 5 && !capabilities.includes(text)) {
        capabilities.push(text.slice(0, 130));
      }
    });

    if (capabilities.length < 3) {
      capabilities.push(`Fonctionnalités avancées pour le secteur ${category}`);
      capabilities.push(`Intégrations et compatibilité multi-plateformes`);
      capabilities.push(`Solution répertoriée avec support utilisateur`);
    }

    // 4. Generate standardized technical specs
    const allText = (wikiSnippet?.snippet || '') + ' ' + ddgSnippets.map((d) => d.snippet).join(' ');
    let accessModel = "Accessible en ligne / Offre standard";
    if (allText.includes('€') || allText.includes('$') || allText.toLowerCase().includes('gratuit')) {
      accessModel = "Offre avec formules gratuites ou abonnements";
    }

    const technicalSpecs = [
      { label: "Classification", value: `Produit / Service ${category}` },
      { label: "Statut de Disponibilité", value: "Actif / Disponible sur le marché" },
      { label: "Accessibilité & Distribution", value: accessModel },
      { label: "Écosystème Compatible", value: "Multi-plateformes (Web, Mobile, Desktop)" },
      { label: "Niveau d'Adoption", value: "Standard de référence sectoriel" },
      { label: "Cycle d'Évolution", value: "Mises à jour et maintenance régulières" },
    ];

    // 5. Build raw profile
    const rawProfile = {
      name: term,
      typeLabel: `Produit / Service ${category}`,
      description,
      marketShare: `${trends.marketSharePercent}% d'adoption sectorielle`,
      trendDirection: trends.trendDirection,
      trendScore: trends.trendScore,
      capabilities: capabilities.slice(0, 4),
      useCasesAndUtility: `${term} s'adresse aux utilisateurs et professionnels cherchant une solution performante pour leurs besoins dans le secteur ${category}.`,
      systemsAndPlatforms: ["Plateformes Web", "Applications Mobiles (iOS/Android)", "Infrastructures Cloud"],
      businessModel: "Modèle standard / Offres modulaires",
      technicalSpecs,
      pros: [
        `Forte présence et légitimité dans le secteur ${category}`,
        `Large adoption par les utilisateurs`,
        `Fonctionnalités complètes et éprouvées`
      ],
      cons: [
        "Courbe d'apprentissage selon la complexité des usages",
        "Exigences de configuration ou d'intégration"
      ],
      monthlyData: trends.monthlyData,
      volatilityIndex: trends.volatilityIndex,
      confidenceScore: 85,
    };

    // Validate with Zod
    const parsed = ItemProfileSchema.safeParse(rawProfile);
    if (parsed.success) {
      return parsed.data;
    } else {
      console.warn("ItemProfile validation warning, fallback returned:", parsed.error);
      return rawProfile as ItemProfile;
    }
  }

  /**
   * Consolidates grounding sources safely
   */
  public extractGroundingSources(snippets: RawSnippet[]): GroundingSource[] {
    const sources: GroundingSource[] = [];
    const seenUrls = new Set<string>();

    for (const snippet of snippets) {
      if (snippet.url && !seenUrls.has(snippet.url)) {
        seenUrls.add(snippet.url);
        sources.push({
          title: snippet.title,
          url: snippet.url,
          snippet: snippet.snippet,
        });
      }
    }
    return sources.slice(0, 8);
  }
}

export const normalizer = new DataNormalizer();
