import { z } from 'zod';

// ==========================================
// 1. GEOGRAPHIC & SECTORAL TAXONOMY
// ==========================================

export type GeoRegion = 
  | 'global'
  | 'africa'
  | 'west_africa'
  | 'togo'
  | 'benin'
  | 'cote_ivoire'
  | 'ghana'
  | 'senegal'
  | 'nigeria'
  | 'burkina_faso';

export interface GeoScopeInfo {
  id: GeoRegion;
  label: string;
  flag: string;
  currency: string;
  economicZone: string;
}

export const GEO_SCOPES: Record<GeoRegion, GeoScopeInfo> = {
  global: { id: 'global', label: 'Monde (Global)', flag: '🌐', currency: 'USD', economicZone: 'Global' },
  africa: { id: 'africa', label: 'Afrique (Continent)', flag: '🌍', currency: 'Multi', economicZone: 'ZLECAf' },
  west_africa: { id: 'west_africa', label: 'Afrique de l\'Ouest', flag: '🌍', currency: 'XOF / GHS / NGN', economicZone: 'CEDEAO / UEMOA' },
  togo: { id: 'togo', label: 'Togo', flag: '🇹🇬', currency: 'FCFA (XOF)', economicZone: 'UEMOA / CEDEAO' },
  benin: { id: 'benin', label: 'Bénin', flag: '🇧🇯', currency: 'FCFA (XOF)', economicZone: 'UEMOA / CEDEAO' },
  cote_ivoire: { id: 'cote_ivoire', label: 'Côte d\'Ivoire', flag: '🇨🇮', currency: 'FCFA (XOF)', economicZone: 'UEMOA / CEDEAO' },
  ghana: { id: 'ghana', label: 'Ghana', flag: '🇬🇭', currency: 'GHS', economicZone: 'CEDEAO' },
  senegal: { id: 'senegal', label: 'Sénégal', flag: '🇸🇳', currency: 'FCFA (XOF)', economicZone: 'UEMOA / CEDEAO' },
  nigeria: { id: 'nigeria', label: 'Nigeria', flag: '🇳🇬', currency: 'NGN', economicZone: 'CEDEAO' },
  burkina_faso: { id: 'burkina_faso', label: 'Burkina Faso', flag: '🇧🇫', currency: 'FCFA (XOF)', economicZone: 'UEMOA' },
};

export type SectorId = 
  | 'agriculture'
  | 'agroalimentaire'
  | 'commerce'
  | 'technologie'
  | 'fintech'
  | 'telecommunications'
  | 'education'
  | 'sante'
  | 'transport'
  | 'energie'
  | 'immobilier'
  | 'mode'
  | 'medias'
  | 'tourisme'
  | 'services_numeriques';

export interface SectorDefinition {
  id: SectorId;
  label: string;
  description: string;
  iconName: string;
  marketSizeIndicator: string;
  topTrendKeywords: string[];
}

export const SECTORS: SectorDefinition[] = [
  {
    id: 'agriculture',
    label: 'Agriculture',
    description: 'Cultures vivrières, rente, intrants durables et agritech',
    iconName: 'Sprout',
    marketSizeIndicator: 'Élevé (Fondation PIB)',
    topTrendKeywords: ['Soja bio', 'Anacarde', 'Engrais organique', 'Irrigation solaire']
  },
  {
    id: 'agroalimentaire',
    label: 'Agroalimentaire',
    description: 'Transformation locale, conditionnement, farines et jus',
    iconName: 'Wheat',
    marketSizeIndicator: 'Forte croissance (+14%/an)',
    topTrendKeywords: ['Transformation manioc', 'Gari enrichi', 'Huile de palme raffinée', 'Jus locaux pasteurisés']
  },
  {
    id: 'commerce',
    label: 'Commerce & Distribution',
    description: 'Réseaux de distribution de proximité, grossistes et e-commerce',
    iconName: 'ShoppingBag',
    marketSizeIndicator: 'Marché de masse',
    topTrendKeywords: ['Commerce social WhatsApp', 'Boutiques relais', 'Import-export régional', 'Marketplaces B2B']
  },
  {
    id: 'technologie',
    label: 'Technologie',
    description: 'Logiciels, cybersécurité, intelligence artificielle et infrastructures',
    iconName: 'Cpu',
    marketSizeIndicator: 'Forte valeur ajoutée',
    topTrendKeywords: ['IA pour PME', 'SaaS de gestion commerciale', 'ERP cloud local', 'Cyberdéfense']
  },
  {
    id: 'fintech',
    label: 'Fintech',
    description: 'Paiements mobiles, micro-assurance, crédit digital et tontines modernes',
    iconName: 'CreditCard',
    marketSizeIndicator: 'Moteur d\'inclusion (+28%/an)',
    topTrendKeywords: ['Mobile Money interopérable', 'Tontine digitalisée', 'Micro-crédit scoring', 'Passerelles de paiement']
  },
  {
    id: 'telecommunications',
    label: 'Télécommunications',
    description: 'Fibre optique, 4G/5G, connectivité rurale et forfaits pros',
    iconName: 'Radio',
    marketSizeIndicator: 'Infrastructures clés',
    topTrendKeywords: ['Fibre à domicile', 'Data packs pros', 'e-SIM', 'Réseaux IoT']
  },
  {
    id: 'education',
    label: 'Éducation & Formation',
    description: 'EdTech, formation professionnelle, compétences numériques et alternance',
    iconName: 'GraduationCap',
    marketSizeIndicator: 'Demande exponentielle',
    topTrendKeywords: ['Bootcamps tech Lomé', 'E-learning mobile', 'Formations agro-business', 'Certifications pros']
  },
  {
    id: 'sante',
    label: 'Santé & Pharmacie',
    description: 'Télémédecine, distribution pharmaceutique, phytomédicaments et cliniques',
    iconName: 'HeartPulse',
    marketSizeIndicator: 'Secteur stratégique',
    topTrendKeywords: ['Télémédecine rurale', 'Laboratoires de phytothérapie', 'Assurance santé PME', 'Supply chain pharmacie']
  },
  {
    id: 'transport',
    label: 'Transport & Logistique',
    description: 'Moto-taxis, fret interurbain, logistique du dernier kilomètre et stockage',
    iconName: 'Truck',
    marketSizeIndicator: 'Essentiel pour l\'intégration',
    topTrendKeywords: ['Livraison dernier km', 'Motos électriques', 'Fret Lomé-Ouaga', 'Entrepôts frigorifiques']
  },
  {
    id: 'energie',
    label: 'Énergie & Environnement',
    description: 'Solaire décentralisé, biomasse, lampadaires autonomes et mini-grids',
    iconName: 'Zap',
    marketSizeIndicator: 'Transition rapide',
    topTrendKeywords: ['Kits solaires pay-as-you-go', 'Pompage solaire agricole', 'Biogaz de déchets', 'Audit énergétique PME']
  },
  {
    id: 'immobilier',
    label: 'Immobilier & BTP',
    description: 'Logements abordables, briques écologiques, co-working et parcs d\'activités',
    iconName: 'Building2',
    marketSizeIndicator: 'Forte urbanisation',
    topTrendKeywords: ['Brique en terre compressée', 'Co-working Lomé', 'Résidences étudiantes', 'Gestion locative digitale']
  },
  {
    id: 'mode',
    label: 'Mode & Artisanat',
    description: 'Textile africain (Pagne, Batiki), maroquinerie, cosmétiques naturels et export',
    iconName: 'Shirt',
    marketSizeIndicator: 'Potentiel export élevé',
    topTrendKeywords: ['Beurre de karité bio', 'Marques prêt-à-porter afro', 'Maroquinerie végétale', 'Cosmétique naturelle']
  },
  {
    id: 'medias',
    label: 'Médias & Création',
    description: 'Créateurs de contenu, podcasts, agences d\'influence et production vidéo',
    iconName: 'Film',
    marketSizeIndicator: 'Croissance de l\'économie des créateurs',
    topTrendKeywords: ['Podcasts business Afrique', 'Marketing d\'influence TikTok', 'Production vidéo locale', 'Médias économiques']
  },
  {
    id: 'tourisme',
    label: 'Tourisme & Hôtellerie',
    description: 'Écotourisme, tourisme d\'affaires, résidences meublées et gastronomie',
    iconName: 'Palmtree',
    marketSizeIndicator: 'Relance post-hub',
    topTrendKeywords: ['Écolodges Kpalimé', 'Résidences d\'affaires Lomé', 'Tours agro-touristiques', 'Gastronomie fusion']
  },
  {
    id: 'services_numeriques',
    label: 'Services Numériques & Conseils',
    description: 'Agences web, comptabilité cloud, juridique d\'entreprise et marketing digital',
    iconName: 'Briefcase',
    marketSizeIndicator: 'Accompagnement PME',
    topTrendKeywords: ['Comptabilité automatisée SYSCOHADA', 'Conseil fiscal PME', 'Community management', 'Design UI/UX']
  }
];

// ==========================================
// 2. MARKET OPPORTUNITY SCORE BREAKDOWN
// ==========================================

export interface OpportunityScoreWeights {
  demandMomentum: number;    // Weight: e.g. 0.25
  growthRate: number;        // Weight: e.g. 0.20
  marketInterest: number;    // Weight: e.g. 0.15
  competitiveGap: number;    // Weight: e.g. 0.15
  searchMomentum: number;    // Weight: e.g. 0.15
  saturationPenalty: number; // Penalty weight: e.g. 0.10
  riskPenalty: number;       // Penalty weight: e.g. 0.10
}

export const DEFAULT_SCORE_WEIGHTS: OpportunityScoreWeights = {
  demandMomentum: 0.25,
  growthRate: 0.20,
  marketInterest: 0.15,
  competitiveGap: 0.15,
  searchMomentum: 0.15,
  saturationPenalty: 0.10,
  riskPenalty: 0.10,
};

export interface MarketOpportunityScore {
  totalScore: number; // 0 to 100
  rating: 'exceptional' | 'high' | 'moderate' | 'cautious' | 'saturated';
  ratingLabel: string;
  breakdown: {
    demandMomentumScore: number; // 0 - 100
    growthRateScore: number;     // 0 - 100
    marketInterestScore: number; // 0 - 100
    competitiveGapScore: number; // 0 - 100
    searchMomentumScore: number; // 0 - 100
    saturationPenalty: number;   // 0 - 100
    riskPenalty: number;         // 0 - 100
  };
  explanation: string;
}

// ==========================================
// 3. MARKET TREND ITEM
// ==========================================

export interface MarketTrendItem {
  id: string;
  name: string;
  sectorId: SectorId;
  region: GeoRegion;
  momentum: number; // e.g. +24% or -6%
  growthRate: number; // yearly growth %
  volumeScore: number; // 0 - 100
  opportunityScore: number; // 0 - 100 calculated
  stage: 'emerging' | 'growth' | 'mature' | 'declining';
  competitionLevel: 'faible' | 'modéré' | 'intense' | 'saturé';
  demandTrend: 'up' | 'stable' | 'down';
  monthlyData: number[]; // 6 to 12 months points
  shortDescription: string;
  commercialTakeaway: string;
  confidenceScore: number;
  lastUpdated: string;
  sourceAttribution: string;
}

// ==========================================
// 4. MARKET ANALYSIS DEEP DIVE REPORT
// ==========================================

export interface CompetitorActor {
  name: string;
  marketShareEstimate: string;
  strength: string;
  weakness: string;
  positioning: string;
}

export interface SeasonalityPoint {
  month: string;
  demandIndex: number; // 0 - 100
  commercialActivity: 'pic' | 'moyen' | 'basse';
  notes: string;
}

export interface MarketAnalysisReport {
  id: string;
  marketName: string;
  sectorId: SectorId;
  region: GeoRegion;
  countryLabel: string;
  createdAt: string;
  executiveSummary: string;
  
  // Market opportunity score details
  opportunityScore: MarketOpportunityScore;
  
  // 1. Demand & Trends
  demandOverview: string;
  historicalInterest: {
    periods: string[];
    values: number[];
  };
  seasonalityCurve: SeasonalityPoint[];
  
  // 2. Actors & Competition
  competitionOverview: string;
  keyActors: CompetitorActor[];
  competitiveGapSummary: string;
  
  // 3. Ecosystem & Products
  associatedProducts: string[];
  emergingSubTrends: string[];
  weakSignals: string[]; // Signaux faibles
  
  // 4. Decision Matrix
  commercialPotential: {
    level: 'Élevé' | 'Modéré' | 'Niche' | 'Faible';
    estimatedPaybackMonths: number;
    targetAudience: string;
    ticketMoyen: string;
  };
  
  risks: Array<{
    title: string;
    severity: 'Élevé' | 'Moyen' | 'Faible';
    mitigationStrategy: string;
  }>;
  
  opportunities: Array<{
    title: string;
    impact: 'Stratégique' | 'Court terme' | 'Moyen terme';
    description: string;
  }>;
  
  // 5. Commercial Action Plan
  actionableRecommendations: Array<{
    phase: string;
    timeframe: string;
    action: string;
    expectedResult: string;
  }>;
  
  // Data Provenance & Transparency
  dataSources: Array<{
    title: string;
    organization: string;
    url: string;
    dataType: string;
    collectionMethod: string;
    freshness: string;
  }>;
  confidenceScore: number;
}

// ==========================================
// 5. OPPORTUNITY SIGNAL ITEM
// ==========================================

export type SignalType = 
  | 'emerging_opportunity'
  | 'growth_opportunity'
  | 'competitive_opportunity'
  | 'declining_market'
  | 'saturated_market'
  | 'high_risk_market';

export interface OpportunitySignal {
  id: string;
  title: string;
  sectorId: SectorId;
  region: GeoRegion;
  signalType: SignalType;
  signalTypeLabel: string;
  signalDescription: string;
  momentumPercent: number; // e.g. +38%
  confidenceScore: number;  // e.g. 91%
  potentialLevel: 'Élevé' | 'Stratégique' | 'Modéré' | 'Surveillance';
  whyItMatters: string;
  recommendedAction: string;
  targetProfile: string; // e.g. "Commerçants, Transformateurs, Startups"
  timestamp: string;
  score: number;
}

// ==========================================
// 6. BUSINESS INTELLIGENCE STRATEGIC MEMO
// ==========================================

export type BIOkObjective = 
  | 'high_potential_market'
  | 'new_product_launch'
  | 'demand_decline_hedge'
  | 'competitive_niche';

export interface BIStrategicMemo {
  id: string;
  sectorId: SectorId;
  region: GeoRegion;
  marketName: string;
  objective: BIOkObjective;
  generatedAt: string;
  executiveSummary: string;
  macroEconomicContext: string;
  keyDrivers: string[];
  strategicPositioningAdvice: string;
  suggestedPricingStructure: {
    entryLevel: string;
    standard: string;
    premiumB2B: string;
    distributionMarginRecommendation: string;
  };
  recommendedGoToMarketChannels: string[];
  regulatoryAndLocalConsiderations: string[];
  executionRoadmap: Array<{
    stepNumber: number;
    title: string;
    actions: string[];
  }>;
}

// ==========================================
// 7. WATCHLIST & SAVED ANALYSES
// ==========================================

export type WatchlistType = 'market' | 'company' | 'product' | 'category' | 'keyword';

export interface WatchlistItem {
  id: string;
  type: WatchlistType;
  name: string;
  category: string;
  region: GeoRegion;
  currentMomentum: number;
  currentScore: number;
  addedAt: string;
  lastCheckedAt: string;
  alertThreshold: number; // Alert if delta > X%
  notes?: string;
  status: 'active' | 'warning' | 'stagnant';
}

export interface SavedAnalysis {
  id: string;
  type: 'comparison' | 'market_analysis' | 'bi_memo';
  title: string;
  category: string;
  region: GeoRegion;
  savedAt: string;
  summary: string;
  payload: any;
}
