export interface TechnicalSpec {
  label: string;
  value: string;
}

export interface ItemProfile {
  name: string;
  typeLabel: string;
  description: string;
  marketShare: string;
  trendDirection: 'up' | 'down' | 'stable';
  trendScore: number;
  capabilities: string[];
  useCasesAndUtility: string;
  systemsAndPlatforms: string[];
  businessModel: string;
  technicalSpecs?: TechnicalSpec[];
  pros: string[];
  cons: string[];
  monthlyData: number[];
}

export interface CompareData {
  isFallback?: boolean;
  isStandardAIFallback?: boolean;
  isDirectWebSearch?: boolean;
  termA: ItemProfile;
  termB: ItemProfile;
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
      typeLabel: "Produit / Service Majeur",
      description: `Sujet phare de la catégorie ${cat}. Représente une solution incontournable bénéficiant d'un ancrage solide sur le marché.`,
      marketShare: `${20 + (hashA % 30)}% d'adoption sectorielle`,
      trendDirection: dirA,
      trendScore: scoreA,
      capabilities: [
        "Traitement haute performance et réactivité avancée",
        "Interface utilisateur intuitive et personnalisable",
        "Sécurité renforcée et conformité aux standards actuels",
        "Interopérabilité fluide avec les outils tiers"
      ],
      useCasesAndUtility: `Besoins professionnels et grand public recherchant une solution éprouvée pour optimiser les performances dans le secteur ${cat}.`,
      systemsAndPlatforms: [
        "Web (Navigateurs modernes Chrome, Safari, Firefox)",
        "Applications Mobiles (iOS, Android)",
        "Infrastructures Cloud & API Rest/GraphQL"
      ],
      businessModel: "Abonnement Freemium / Accès sur mesure",
      technicalSpecs: [
        { label: "Classification", value: `Solution Standard ${cat}` },
        { label: "Architecture / Moteur", value: "Cloud Distribue / Microservices HA" },
        { label: "Sécurité & Normes", value: "TLS 1.3, Chiffrement AES-256, ISO 27001" },
        { label: "Disponibilité (SLA)", value: "99.9% d'uptime garanti" },
        { label: "Formats & Protocoles", value: "REST API, WebSockets, JSON, OAuth2" },
        { label: "Support & Maintenance", value: "Support 24/7 & Mises a jour mensuelles" }
      ],
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
      typeLabel: "Alternative & Solution Compétitive",
      description: `Alternative dynamique dans la catégorie ${cat}. Très appréciée pour son agilité, ses tarifs attractifs et ses innovations.`,
      marketShare: `${15 + (hashB % 25)}% d'adoption sectorielle`,
      trendDirection: dirB,
      trendScore: scoreB,
      capabilities: [
        "Déploiement rapide et simplicité d'installation",
        "Tarification très compétitive et flexibilité d'usage",
        "Fonctionnalités modulaires adaptables aux besoins",
        "Support client réactif et communauté engagée"
      ],
      useCasesAndUtility: `Utilisateurs, PME et passionnés cherchant une alternative moderne et rentable avec une grande souplesse dans ${cat}.`,
      systemsAndPlatforms: [
        "Plateformes Multi-OS (Windows, macOS, Linux)",
        "Service Cloud natif & Apps dédiées",
        "Connecteurs et webhooks universels"
      ],
      businessModel: "Abonnement modulaire / Licence flexible",
      technicalSpecs: [
        { label: "Classification", value: `Solution Modulaire ${cat}` },
        { label: "Architecture / Moteur", value: "Négat-Cloud / Serverless Edge" },
        { label: "Sécurité & Normes", value: "RGPD Compliant, HTTPS, Auth2.0" },
        { label: "Disponibilité (SLA)", value: "99.5% d'uptime moyen" },
        { label: "Formats & Protocoles", value: "Webhooks, OpenAPI, SDK Multi-langages" },
        { label: "Support & Maintenance", value: "Support Ticket 5j/7 & Communaute active" }
      ],
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
