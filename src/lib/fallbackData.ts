export interface CompareData {
  isFallback?: boolean;
  isStandardAIFallback?: boolean;
  termA: {
    name: string;
    description: string;
    marketShare: string;
    trendDirection: 'up' | 'down' | 'stable';
    trendScore: number;
    pros: string[];
    cons: string[];
    monthlyData: number[];
  };
  termB: {
    name: string;
    description: string;
    marketShare: string;
    trendDirection: 'up' | 'down' | 'stable';
    trendScore: number;
    pros: string[];
    cons: string[];
    monthlyData: number[];
  };
  comparisonSummary: string;
  keyFactors: string[];
  groundingSources?: Array<{ title: string; url: string }>;
}

export function generateClientFallbackData(termA: string, termB: string, category?: string): CompareData {
  const cat = category || 'Général';
  
  const getDeterministicHash = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash);
  };

  const hashA = getDeterministicHash(termA);
  const hashB = getDeterministicHash(termB);

  const scoreA = 55 + (hashA % 36); // 55-90
  const scoreB = 50 + (hashB % 36); // 50-85

  const dirA: 'up' | 'down' | 'stable' = hashA % 3 === 0 ? 'up' : hashA % 3 === 1 ? 'stable' : 'down';
  const dirB: 'up' | 'down' | 'stable' = hashB % 3 === 0 ? 'up' : hashB % 3 === 1 ? 'stable' : 'down';

  const monthlyA: number[] = [];
  const monthlyB: number[] = [];

  let valA = scoreA - 15;
  let valB = scoreB - 15;
  for (let i = 0; i < 6; i++) {
    monthlyA.push(Math.min(100, Math.max(10, Math.round(valA + i * (dirA === 'up' ? 3.5 : dirA === 'down' ? -2.5 : 0.5) + (hashA % (i + 2))))));
    monthlyB.push(Math.min(100, Math.max(10, Math.round(valB + i * (dirB === 'up' ? 3.5 : dirB === 'down' ? -2.5 : 0.5) + (hashB % (i + 2))))));
  }

  return {
    isFallback: true,
    termA: {
      name: termA,
      description: `Sujet majeur de la catégorie ${cat}. Représente un choix de référence bénéficiant d'une grande communauté et d'un intérêt soutenu.`,
      marketShare: `${20 + (hashA % 30)}% d'indice relatif`,
      trendDirection: dirA,
      trendScore: scoreA,
      pros: [
        "Positionnement de marché solide et reconnaissance de marque",
        "Écosystème actif et intégrations nombreuses",
        "Constante évolution de l'expérience utilisateur"
      ],
      cons: [
        "Structure tarifaire ou accès parfois exigeant",
        "Concurrence accrue sur les segments spécialisés",
        "Courbe d'apprentissage pour la maîtrise complète"
      ],
      monthlyData: monthlyA
    },
    termB: {
      name: termB,
      description: `Alternative populaire et compétitive dans le domaine ${cat}. Très appréciée pour sa réactivité et sa polyvalence.`,
      marketShare: `${15 + (hashB % 25)}% d'indice relatif`,
      trendDirection: dirB,
      trendScore: scoreB,
      pros: [
        "Rapport qualité-prix ou accessibilité très avantageuse",
        "Fonctionnalités modernes adaptées aux tendances récentes",
        "Forte flexibilité d'utilisation"
      ],
      cons: [
        "Notoriété en cours de consolidation face aux leaders",
        "Moins de recul sur certaines fonctionnalités avancées",
        "Support tiers parfois en développement"
      ],
      monthlyData: monthlyB
    },
    comparisonSummary: `La comparaison entre ${termA} et ${termB} fait ressortir des atouts complémentaires dans le domaine "${cat}". Alors que ${termA} impose son expérience et une notoriété affirmée, ${termB} tire son épingle du jeu grâce à son agilité et son attractivité. L'évolution des tendances montre un intérêt dynamique porté par l'innovation continue.`,
    keyFactors: [
      "Notoriété & Adoption globale",
      "Rapport qualité-prix & Accessibilité",
      "Facilité de prise en main & Support"
    ],
    groundingSources: [
      { title: `Observatoire des tendances - ${cat}`, url: "https://www.lesechos.fr" },
      { title: `Baromètre comparatif sectoriel`, url: "https://www.zdnet.fr" }
    ]
  };
}
