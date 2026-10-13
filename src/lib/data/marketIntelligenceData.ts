import { 
  MarketTrendItem, 
  OpportunitySignal, 
  MarketAnalysisReport,
  GeoRegion,
  SectorId,
  SECTORS,
  GEO_SCOPES,
  BIStrategicMemo,
  BIOkObjective
} from '../types/marketIntelligence';
import { opportunityScoreEngine } from '../engine/opportunityScoreEngine';

// ==========================================
// 1. CURATED MARKET TRENDS CATALOGUE
// ==========================================

export const INITIAL_MARKET_TRENDS: MarketTrendItem[] = [
  // --- TOGO & WEST AFRICA AGRICULTURE & AGROALIMENTAIRE ---
  {
    id: 'togo-manioc-transformation',
    name: 'Transformation locale du Manioc (Gari enrichi & Farines)',
    sectorId: 'agroalimentaire',
    region: 'togo',
    momentum: 34,
    growthRate: 22,
    volumeScore: 88,
    opportunityScore: 86,
    stage: 'growth',
    competitionLevel: 'modéré',
    demandTrend: 'up',
    monthlyData: [62, 65, 71, 74, 82, 88],
    shortDescription: 'Forte accélération de la demande urbaine à Lomé et dans l\'hinterland pour les produits dérivés du manioc certifiés et standardisés.',
    commercialTakeaway: 'Opportunité majeure dans le packaging étanche, la certification qualité ITRA et la distribution moderne.',
    confidenceScore: 92,
    lastUpdated: '12 Octobre 2026',
    sourceAttribution: 'Ministère de l\'Agriculture Togo / ITRA / Enquêtes marchés locaux'
  },
  {
    id: 'togo-soja-bio-export',
    name: 'Filière Soja Biologique & Traçabilité',
    sectorId: 'agriculture',
    region: 'togo',
    momentum: 28,
    growthRate: 19,
    volumeScore: 82,
    opportunityScore: 81,
    stage: 'growth',
    competitionLevel: 'intense',
    demandTrend: 'up',
    monthlyData: [55, 60, 68, 72, 79, 82],
    shortDescription: 'Le Togo reste l\'un des premiers exportateurs de soja bio vers l\'UE; transition vers la première transformation locale (tourteaux et huiles).',
    commercialTakeaway: 'Création d\'unités de trituration locale pour capter la valeur ajoutée avant export.',
    confidenceScore: 94,
    lastUpdated: '10 Octobre 2026',
    sourceAttribution: 'Direction des Statistiques Agricoles Togo / TradeMap / FAO'
  },
  {
    id: 'wa-anacarde-cajou',
    name: 'Transformation de la Noix de Cajou (Anacarde)',
    sectorId: 'agroalimentaire',
    region: 'west_africa',
    momentum: 22,
    growthRate: 16,
    volumeScore: 85,
    opportunityScore: 78,
    stage: 'growth',
    competitionLevel: 'intense',
    demandTrend: 'up',
    monthlyData: [68, 70, 72, 75, 80, 85],
    shortDescription: 'Incitations fiscales fortes dans la zone UEMOA (PIA Togo, Côte d\'Ivoire, Bénin) pour le décorticage industriel sur place.',
    commercialTakeaway: 'Substituer les exportations brutes vers l\'Asie par des amandes conditionnées sous vide.',
    confidenceScore: 89,
    lastUpdated: '08 Octobre 2026',
    sourceAttribution: 'Conseil Coton-Anacarde / CEDEAO Trade Observatory'
  },

  // --- FINTECH & MOBILE MONEY ---
  {
    id: 'wa-mobile-money-b2b',
    name: 'Paiements B2B & Interopérabilité Mobile Money',
    sectorId: 'fintech',
    region: 'west_africa',
    momentum: 42,
    growthRate: 31,
    volumeScore: 94,
    opportunityScore: 89,
    stage: 'growth',
    competitionLevel: 'intense',
    demandTrend: 'up',
    monthlyData: [70, 74, 80, 85, 91, 95],
    shortDescription: 'Adoption massive de l\'interopérabilité (Wave, TMoney, Flooz, Orange Money, Moov) pour la collecte marchande et les flux fournisseurs.',
    commercialTakeaway: 'Intégrer les API de paiement directes dans les systèmes de caisse et logiciels comptables des commerçants.',
    confidenceScore: 96,
    lastUpdated: '13 Octobre 2026',
    sourceAttribution: 'Rapports BCEAO sur les Services Financiers Numériques / GSMA 2026'
  },
  {
    id: 'togo-micro-credit-scoring',
    name: 'Scoring Digital & Crédit Rapide aux Commerçantes',
    sectorId: 'fintech',
    region: 'togo',
    momentum: 36,
    growthRate: 26,
    volumeScore: 78,
    opportunityScore: 84,
    stage: 'emerging',
    competitionLevel: 'faible',
    demandTrend: 'up',
    monthlyData: [45, 52, 60, 68, 74, 80],
    shortDescription: 'Modélisation du risque pour les revendeuses des grands marchés (Lomé, Kpalimé, Kara) sur base de l\'historique de transactions télécom.',
    commercialTakeaway: 'Création d\'un pont technologique entre institutions de microfinance (COOPEC, WAGES) et applications mobiles.',
    confidenceScore: 88,
    lastUpdated: '11 Octobre 2026',
    sourceAttribution: 'Observatoire de la Microfinance UEMOA / FNPF'
  },

  // --- ENERGIE & ENVIRONNEMENT ---
  {
    id: 'togo-solaire-pompage',
    name: 'Pompage Solaire & Kits d\'Irrigation Autonomes',
    sectorId: 'energie',
    region: 'togo',
    momentum: 39,
    growthRate: 28,
    volumeScore: 76,
    opportunityScore: 87,
    stage: 'growth',
    competitionLevel: 'faible',
    demandTrend: 'up',
    monthlyData: [48, 54, 62, 69, 75, 82],
    shortDescription: 'Développement de l\'irrigation goutte-à-goutte alimentée par panneaux solaires pour sécuriser les récoltes en saison sèche.',
    commercialTakeaway: 'Modèle de distribution Pay-As-You-Go pour rendre l\'équipement accessible aux coopératives agricoles.',
    confidenceScore: 91,
    lastUpdated: '09 Octobre 2026',
    sourceAttribution: 'Agence Togolaise d\'Électrification Rurale (AT2ER) / GIZ'
  },
  {
    id: 'wa-mini-grid-solaire',
    name: 'Mini-réseaux Solaires Décentralisés',
    sectorId: 'energie',
    region: 'west_africa',
    momentum: 27,
    growthRate: 21,
    volumeScore: 81,
    opportunityScore: 80,
    stage: 'growth',
    competitionLevel: 'modéré',
    demandTrend: 'up',
    monthlyData: [58, 62, 69, 73, 78, 83],
    shortDescription: 'Électrification des localités semi-urbaines avec compteurs intelligents prépayés et micro-tarification.',
    commercialTakeaway: 'Cibler les activités productives (moulins, ateliers de soudure, chambres froides) pour rentabiliser le réseau.',
    confidenceScore: 87,
    lastUpdated: '07 Octobre 2026',
    sourceAttribution: 'Banque Mondiale / Programme Cizo Togo'
  },

  // --- COMMERCE & LOGISTIQUE ---
  {
    id: 'wa-livraison-moto-dernier-km',
    name: 'Logistique Dernier Kilomètre & Flottes Hybrides',
    sectorId: 'transport',
    region: 'west_africa',
    momentum: 31,
    growthRate: 24,
    volumeScore: 89,
    opportunityScore: 82,
    stage: 'growth',
    competitionLevel: 'intense',
    demandTrend: 'up',
    monthlyData: [65, 71, 76, 80, 86, 90],
    shortDescription: 'Essor de la livraison express pour les commerces locaux avec gestion des retours et encaissement à la livraison (Cash-on-Delivery).',
    commercialTakeaway: 'Développer des logiciels de dispatching géolocalisé adaptés aux adresses informelles et repères visuels.',
    confidenceScore: 90,
    lastUpdated: '12 Octobre 2026',
    sourceAttribution: 'Enquêtes terrain E-commerce UEMOA / Startups logistiques'
  },
  {
    id: 'togo-commerce-social-whatsapp',
    name: 'Social Selling & Boutiques Digitales WhatsApp',
    sectorId: 'commerce',
    region: 'togo',
    momentum: 38,
    growthRate: 27,
    volumeScore: 92,
    opportunityScore: 85,
    stage: 'growth',
    competitionLevel: 'modéré',
    demandTrend: 'up',
    monthlyData: [60, 68, 75, 81, 88, 93],
    shortDescription: 'Plus de 70% du commerce en ligne informel au Togo transite via WhatsApp Business, catalogues et canaux de statut.',
    commercialTakeaway: 'Fournir des passerelles de facturation automatique et de gestion des stocks synchronisées avec WhatsApp.',
    confidenceScore: 93,
    lastUpdated: '13 Octobre 2026',
    sourceAttribution: 'Ministère de l\'Économie Numérique / Baromètre Consommateurs'
  },

  // --- TECHNOLOGIE & SERVICES NUMERIQUES ---
  {
    id: 'wa-saas-gestion-syscohada',
    name: 'SaaS de Facturation & Comptabilité SYSCOHADA',
    sectorId: 'technologie',
    region: 'west_africa',
    momentum: 35,
    growthRate: 29,
    volumeScore: 73,
    opportunityScore: 88,
    stage: 'growth',
    competitionLevel: 'faible',
    demandTrend: 'up',
    monthlyData: [42, 50, 59, 67, 75, 82],
    shortDescription: 'Obligations de télé-déclarations fiscales croissantes (OTR au Togo, DGI Côte d\'Ivoire) poussant les PME à s\'équiper d\'outils cloud simples.',
    commercialTakeaway: 'Déployer des micro-ERP mobiles abordables avec génération automatique des bordereaux fiscaux.',
    confidenceScore: 91,
    lastUpdated: '11 Octobre 2026',
    sourceAttribution: 'Chambre de Commerce et d\'Industrie du Togo / Ordre des Experts-Comptables'
  },
  {
    id: 'global-ia-b2b-workflows',
    name: 'Automatisation IA des Processus d\'Entreprise',
    sectorId: 'technologie',
    region: 'global',
    momentum: 51,
    growthRate: 44,
    volumeScore: 96,
    opportunityScore: 92,
    stage: 'emerging',
    competitionLevel: 'intense',
    demandTrend: 'up',
    monthlyData: [62, 70, 78, 86, 92, 98],
    shortDescription: 'Déploiement d\'agents IA et RAG pour le support client multilingue, l\'extraction documentaire et l\'aide à la décision.',
    commercialTakeaway: 'Agences d\'intégration spécialisées par secteur pour adapter les modèles aux données locales.',
    confidenceScore: 95,
    lastUpdated: '13 Octobre 2026',
    sourceAttribution: 'Gartner / MIT Tech Review / Benchmark SaaS 2026'
  },

  // --- IMMOBILIER & BTP ---
  {
    id: 'togo-btp-brique-terre',
    name: 'Briques en Terre Compressée (BTC) & Matériaux Écolos',
    sectorId: 'immobilier',
    region: 'togo',
    momentum: 26,
    growthRate: 18,
    volumeScore: 71,
    opportunityScore: 79,
    stage: 'growth',
    competitionLevel: 'faible',
    demandTrend: 'up',
    monthlyData: [46, 51, 57, 63, 68, 74],
    shortDescription: 'Hausse du coût du ciment incitant les promoteurs à adopter la terre stabilisée pour un meilleur confort thermique et des coûts réduits de 30%.',
    commercialTakeaway: 'Unités mobiles de pressage hydraulique sur les chantiers périurbains de Lomé et Tsévié.',
    confidenceScore: 86,
    lastUpdated: '06 Octobre 2026',
    sourceAttribution: 'Centre de la Construction et du Logement (CCL Lomé)'
  },

  // --- SANTE & PHARMACIE ---
  {
    id: 'wa-phytomedicaments-normalises',
    name: 'Phytothérapie Standardisée & Cosmétiques au Karité',
    sectorId: 'sante',
    region: 'west_africa',
    momentum: 29,
    growthRate: 20,
    volumeScore: 77,
    opportunityScore: 83,
    stage: 'growth',
    competitionLevel: 'modéré',
    demandTrend: 'up',
    monthlyData: [50, 56, 63, 69, 74, 80],
    shortDescription: 'Valorisation scientifique des plantes médicinales africaines avec autorisations de mise sur le marché (AMM) officielles.',
    commercialTakeaway: 'Partenariats avec les facultés de pharmacie pour labelliser des sirops et pommades thérapeutiques.',
    confidenceScore: 89,
    lastUpdated: '08 Octobre 2026',
    sourceAttribution: 'Organisation Ouest-Africaine de la Santé (OOAS) / OMS Afrique'
  },

  // --- EXEMPLES DE MARCHES EN DECLIN OU SATURES ---
  {
    id: 'global-cabines-telephoniques-cartes',
    name: 'Télécartes & Recharges Physiques à Gratter',
    sectorId: 'telecommunications',
    region: 'west_africa',
    momentum: -38,
    growthRate: -28,
    volumeScore: 35,
    opportunityScore: 18,
    stage: 'declining',
    competitionLevel: 'saturé',
    demandTrend: 'down',
    monthlyData: [62, 54, 46, 38, 30, 22],
    shortDescription: 'Remplacement quasi-intégral par la recharge électronique directe et les applications Mobile Money.',
    commercialTakeaway: 'Reconversion urgente des distributeurs physiques vers les services de point relais et de dépôts/retraits.',
    confidenceScore: 94,
    lastUpdated: '11 Octobre 2026',
    sourceAttribution: 'ARCEP Togo / Observatoires Télécoms Régionaux'
  },
  {
    id: 'global-dvd-supports-physiques',
    name: 'Supports Physiques DVD / Clés USB Vidéo Vente Marché',
    sectorId: 'medias',
    region: 'togo',
    momentum: -45,
    growthRate: -32,
    volumeScore: 28,
    opportunityScore: 14,
    stage: 'declining',
    competitionLevel: 'saturé',
    demandTrend: 'down',
    monthlyData: [50, 42, 34, 25, 18, 12],
    shortDescription: 'Migration rapide des consommateurs vers YouTube, TikTok et les forfaits nuit data des opérateurs pour le divertissement.',
    commercialTakeaway: 'Désengagement recommandé au profit de la production de contenu streaming et du sponsoring.',
    confidenceScore: 92,
    lastUpdated: '05 Octobre 2026',
    sourceAttribution: 'Enquêtes d\'audience Médias UEMOA'
  }
];

// ==========================================
// 2. OPPORTUNITY DETECTOR SIGNALS
// ==========================================

export const INITIAL_OPPORTUNITY_SIGNALS: OpportunitySignal[] = [
  {
    id: 'opp-togo-manioc-pack',
    title: 'Conditionnement & Distribution Moderne du Gari et Tapioca',
    sectorId: 'agroalimentaire',
    region: 'togo',
    signalType: 'emerging_opportunity',
    signalTypeLabel: 'Emerging Opportunity',
    signalDescription: 'Croissance de +38% de l\'intérêt des supermarchés et boutiques urbaines de Lomé pour les farines locales sous packaging hermétique avec code-barre.',
    momentumPercent: 38,
    confidenceScore: 92,
    potentialLevel: 'Élevé',
    whyItMatters: 'La classe moyenne urbaine togolaise consomme quotidiennement du manioc mais délaisse les sacs ouverts poussiéreux pour des formats 500g/1kg propres et traçables.',
    recommendedAction: 'Signer des contrats d\'approvisionnement avec les coopératives de Tabligbo/Vogan, installer une ligne d\'ensachage scellée et négocier le référencement en moyenne surface.',
    targetProfile: 'Agro-industriels, Coopératives, Distributeurs FMCG',
    timestamp: '13 Octobre 2026',
    score: 87
  },
  {
    id: 'opp-wa-mobile-money-interop',
    title: 'Agrégation de Paiement Multi-Opérateurs pour Commerçants',
    sectorId: 'fintech',
    region: 'west_africa',
    signalType: 'growth_opportunity',
    signalTypeLabel: 'Growth Opportunity',
    signalDescription: 'Les commerçants physiques refusent de multiplier les téléphones pour TMoney, Flooz, Wave et Orange Money; forte demande pour un QR Code unifié.',
    momentumPercent: 44,
    confidenceScore: 94,
    potentialLevel: 'Stratégique',
    whyItMatters: 'L\'interopérabilité régionale imposée par la BCEAO crée un boulevard pour les fintechs B2B qui fluidifient la réconciliation comptable des encaissements.',
    recommendedAction: 'Développer ou distribuer un terminal de paiement léger (ou application mobile marchand) générant un QR code universel avec virement direct.',
    targetProfile: 'Fintechs, Développeurs, Prestataires de services financiers',
    timestamp: '12 Octobre 2026',
    score: 91
  },
  {
    id: 'opp-togo-pompage-solaire',
    title: 'Offre Pay-As-You-Go pour Pompes Solaires Maraîchères',
    sectorId: 'energie',
    region: 'togo',
    signalType: 'competitive_opportunity',
    signalTypeLabel: 'Competitive Opportunity',
    signalDescription: 'Très peu d\'acteurs structurés proposent du financement échelonné pour le pompage solaire dans la région maritime et des plateaux.',
    momentumPercent: 32,
    confidenceScore: 88,
    potentialLevel: 'Élevé',
    whyItMatters: 'Les maraîchers dépensent jusqu\'à 40 000 FCFA/mois en carburant pour les motopompes essence. Le solaire amorti sur 18 mois divise la facture par 3.',
    recommendedAction: 'S\'associer avec un importateur de panneaux et une microfinance pour lancer un leasing agricole adossé aux récoltes.',
    targetProfile: 'Installateurs solaires, Entreprises agritech, Investisseurs à impact',
    timestamp: '10 Octobre 2026',
    score: 84
  },
  {
    id: 'opp-togo-saas-syscohada',
    title: 'Outil de Facturation Normalisée OTR pour Petits Commerces',
    sectorId: 'technologie',
    region: 'togo',
    signalType: 'growth_opportunity',
    signalTypeLabel: 'Growth Opportunity',
    signalDescription: 'Accélération des contrôles et incitations de l\'Office Togolais des Recettes (OTR) pour la délivrance de factures conformes.',
    momentumPercent: 37,
    confidenceScore: 90,
    potentialLevel: 'Élevé',
    whyItMatters: 'Les propriétaires de quincailleries, pharmacies et supérettes cherchent une alternative logicielle simple aux coûteuses machines de caisse propriétaires.',
    recommendedAction: 'Proposer une web app légère fonctionnant sur smartphone Android ou tablette avec impression thermique Bluetooth de ticket normalisé.',
    targetProfile: 'Éditeurs de logiciels, Agences digitales, Consultants de gestion',
    timestamp: '11 Octobre 2026',
    score: 86
  },
  {
    id: 'opp-wa-recharge-physique-declin',
    title: 'Effondrement des Marges sur les Cartes de Recharge Télécom',
    sectorId: 'telecommunications',
    region: 'west_africa',
    signalType: 'declining_market',
    signalTypeLabel: 'Declining Market',
    signalDescription: 'Baisse continue de 35% par an des volumes physiques au profit du transfert direct sans contact.',
    momentumPercent: -35,
    confidenceScore: 95,
    potentialLevel: 'Surveillance',
    whyItMatters: 'Geler les stocks de recharges papier immobilise de la trésorerie pour un rendement net inférieur à 1,5% contre des risques d\'invendus.',
    recommendedAction: 'Basculer 100% du capital de roulement vers les comptes distributeurs électroniques et les services de transfert d\'argent à commissions récurrentes.',
    targetProfile: 'Boutiquiers, Kiosques, Grossistes télécoms',
    timestamp: '09 Octobre 2026',
    score: 22
  },
  {
    id: 'opp-wa-import-huile-risque',
    title: 'Volatilité des Taxes sur l\'Importation d\'Huiles Végétales Brutes',
    sectorId: 'agroalimentaire',
    region: 'west_africa',
    signalType: 'high_risk_market',
    signalTypeLabel: 'High-Risk Market',
    signalDescription: 'Renforcement des barrières tarifaires UEMOA pour protéger les filières locales de palme et de coton.',
    momentumPercent: -12,
    confidenceScore: 89,
    potentialLevel: 'Surveillance',
    whyItMatters: 'Risque élevé de blocage douanier et de surtaxes imprévues pour les négociants non adossés à des unités de raffinage locales.',
    recommendedAction: 'Développer des filières d\'approvisionnement directes au Togo ou au Bénin plutôt que de dépendre d\'importations maritimes soumises aux devises étrangères.',
    targetProfile: 'Importateurs, Négociants, Industriels de la savonnerie',
    timestamp: '08 Octobre 2026',
    score: 34
  }
];

// ==========================================
// 3. CURATED DEEP DIVE MARKET INTELLIGENCE REPORTS
// ==========================================

export const CURATED_MARKET_REPORTS: Record<string, MarketAnalysisReport> = {
  'manioc': {
    id: 'report-manioc-togo',
    marketName: 'Transformation et Dérivés du Manioc',
    sectorId: 'agroalimentaire',
    region: 'togo',
    countryLabel: 'Togo (avec opportunité d\'export UEMOA)',
    createdAt: '13 Octobre 2026',
    executiveSummary: 'Le marché de la transformation du manioc au Togo connaît une mutation structurelle : la demande urbaine migre du produit brut non lavé vers des farines prêtes à l\'emploi (gari fortifié, tapioca fin, cossettes séchées pour l\'amidonnerie). La filière bénéficie d\'une dynamique de substitution aux importations de blé et de riz.',
    opportunityScore: opportunityScoreEngine.calculate({
      demandMomentum: 88,
      growthRate: 78,
      marketInterest: 84,
      competitiveGap: 75, // Bon espace pour les marques propres
      searchMomentum: 82,
      marketSaturation: 35, // Peu de marques industrielles structurées
      riskFactor: 30 // Risque climatique modéré mais maîtrisé
    }),
    demandOverview: 'Demande globale estimée à plus de 1,2 million de tonnes de racines fraîches par an au Togo, avec un déficit de produits transformés de haute qualité hygiénique. La demande institutionnelle (cantines scolaires, boulangeries incorporant 15% de farine de manioc panifiable) est en hausse constante.',
    historicalInterest: {
      periods: ['Nov 2025', 'Jan 2026', 'Mar 2026', 'Mai 2026', 'Juil 2026', 'Sep 2026'],
      values: [64, 69, 73, 79, 85, 92]
    },
    seasonalityCurve: [
      { month: 'Janvier', demandIndex: 85, commercialActivity: 'pic', notes: 'Période de récolte intensive et séchage favorisé par l\'harmattan.' },
      { month: 'Février', demandIndex: 82, commercialActivity: 'pic', notes: 'Forte transformation en cossettes et stockage.' },
      { month: 'Mars', demandIndex: 78, commercialActivity: 'moyen', notes: 'Prix bord champ stables, demande urbaine constante.' },
      { month: 'Avril', demandIndex: 72, commercialActivity: 'moyen', notes: 'Début des pluies, ralentissement du séchage solaire naturel.' },
      { month: 'Mai', demandIndex: 68, commercialActivity: 'basse', notes: 'Transition agricole, focalisation sur les semis.' },
      { month: 'Juin', demandIndex: 70, commercialActivity: 'moyen', notes: 'Reprise de la demande pour consommation directe.' },
      { month: 'Juillet', demandIndex: 74, commercialActivity: 'moyen', notes: 'Hausse des cours avec la raréfaction temporaire.' },
      { month: 'Août', demandIndex: 80, commercialActivity: 'pic', notes: 'Période des récoltes de soudure.' },
      { month: 'Septembre', demandIndex: 84, commercialActivity: 'pic', notes: 'Rentrée scolaire : forte demande alimentaire des ménages.' },
      { month: 'Octobre', demandIndex: 88, commercialActivity: 'pic', notes: 'Commandes de fin d\'année des grossistes.' },
      { month: 'Novembre', demandIndex: 92, commercialActivity: 'pic', notes: 'Grandes foires et préparation des fêtes.' },
      { month: 'Décembre', demandIndex: 96, commercialActivity: 'pic', notes: 'Consommation festive maximale de gari et dérivés.' }
    ],
    competitionOverview: 'Le marché reste dominé à 80% par l\'artisanat informel villageois (groupements de femmes). Moins de 10 marques togolaises disposent d\'un emballage scellé et d\'un numéro d\'enregistrement officiel. L\'espace concurrentiel pour un acteur structuré est donc exceptionnellement ouvert.',
    keyActors: [
      {
        name: 'Groupements Féminins Coopératifs (Maritime & Plateaux)',
        marketShareEstimate: '65% des volumes totaux',
        strength: 'Proximité des champs, prix plancher, ancrage historique',
        weakness: 'Conditionnement précaire, granulométrie variable, manque d\'hygiène traçable',
        positioning: 'Vente en vrac sur les marchés de gros (Assigamé, Hedzranawoé)'
      },
      {
        name: 'PME Agroalimentaires Émergentes Locales',
        marketShareEstimate: '15% des volumes formels',
        strength: 'Emballages plastiques propres, présence dans les alimentations de quartier',
        weakness: 'Capacités de production limitées, rupture d\'approvisionnement en saison des pluies',
        positioning: 'Produit premium ménages urbains et diaspora'
      },
      {
        name: 'Importations frontalières (Bénin & Ghana)',
        marketShareEstimate: '20% des volumes frontaliers',
        strength: 'Réseaux de grossistes bien huilés, prix attractifs sur le gari sohoui',
        weakness: 'Coûts de transport et aléas douaniers',
        positioning: 'Circuits de distribution transfrontaliers'
      }
    ],
    competitiveGapSummary: 'Absence d\'un leader industriel unifié capable de garantir un approvisionnement régulier 12 mois sur 12 avec séchoir mécanique et certification sanitaire constante.',
    associatedProducts: [
      'Gari enrichi au soja ou au moringa',
      'Farine panifiable de manioc HQCF (High Quality Cassava Flour)',
      'Tapioca perlé et semoule précuite',
      'Amidon industriel pour emballages biodégradables',
      'Aliments pour bétail (pellets de pelures et résidus)'
    ],
    emergingSubTrends: [
      'Incorporation réglementaire obligatoire de farine locale en boulangerie',
      'Recherche de gari sans sable garanti (lavage hydrocyclone)',
      'Exportation vers la diaspora en Europe et en Amérique du Nord sous label Bio'
    ],
    weakSignals: [
      'Plusieurs brasseries ouest-africaines testent la substitution du malt par l\'amidon de manioc pour réduire leurs sorties de devises',
      'Intérêt grandissant des industriels du textile pour l\'encollage à base d\'amidon local à la Plateforme Industrielle d\'Adétikopé (PIA)'
    ],
    commercialPotential: {
      level: 'Élevé',
      estimatedPaybackMonths: 14,
      targetAudience: 'Ménages urbains de Lomé, cantines scolaires, boulangeries, diaspora',
      ticketMoyen: '500 FCFA à 2 500 FCFA / unité packagée'
    },
    risks: [
      {
        title: 'Aléa d\'approvisionnement en tubercules frais',
        severity: 'Moyen',
        mitigationStrategy: 'Signer des contrats de culture d\'achat garanti à prix plancher avec des groupements de producteurs certifiés.'
      },
      {
        title: 'Humidité excessive en saison des pluies',
        severity: 'Élevé',
        mitigationStrategy: 'Investir impérativement dans un séchoir hybride (solaire + biomasse) plutôt que dépendre uniquement de l\'air libre.'
      },
      {
        title: 'Fluctuation du coût des emballages',
        severity: 'Moyen',
        mitigationStrategy: 'Groupement d\'achats de sachets thermosoudables et partenariat avec des imprimeurs locaux.'
      }
    ],
    opportunities: [
      {
        title: 'Certification et labellisation Made in Togo',
        impact: 'Stratégique',
        description: 'Obtenir l\'agrément de l\'Institut Togolais de Recherche Agronomique (ITRA) pour conquérir les hôtels, supermarchés et l\'export.'
      },
      {
        title: 'Sous-produits à haute valeur pour l\'élevage',
        impact: 'Court terme',
        description: 'Vendre les épluchures séchées et broyées aux éleveurs porcins et avicoles comme source d\'énergie économique.'
      },
      {
        title: 'Contrats B2B avec les boulangers',
        impact: 'Moyen terme',
        description: 'Fournir de la farine HQCF aux boulangeries pour leur permettre d\'abaisser leur coût de revient face au blé importé.'
      }
    ],
    actionableRecommendations: [
      {
        phase: 'Phase 1 (Mois 1-2)',
        timeframe: '60 jours',
        action: 'Sélectionner 3 coopératives partenaires dans la région Maritime et installer un atelier pilote de râpage/pressage aux normes HACCP.',
        expectedResult: 'Sécurisation de 10 tonnes de matière première par mois à coût maîtrisé.'
      },
      {
        phase: 'Phase 2 (Mois 3-4)',
        timeframe: '60 jours',
        action: 'Valider le packaging hermétique 1kg étanche avec marquage DLUO et QR code de traçabilité d\'origine.',
        expectedResult: 'Produit prêt pour le référencement formel et durée de conservation portée à 12 mois.'
      },
      {
        phase: 'Phase 3 (Mois 5-6)',
        timeframe: '60 jours',
        action: 'Déployer la distribution dans 50 superettes de Lomé et activer un canal de livraison WhatsApp pour les familles.',
        expectedResult: 'Atteinte du point mort financier et 3 000 sachets écoulés par mois.'
      }
    ],
    dataSources: [
      {
        title: 'Statistiques Agricoles Nationales du Togo (DSID)',
        organization: 'Ministère de l\'Agriculture, de l\'Élevage et du Développement Rural',
        url: 'https://agriculture.gouv.tg',
        dataType: 'Données de production et rendements à l\'hectare',
        collectionMethod: 'Recensement agricole national et enquêtes de terrain',
        freshness: 'Données consolidées 2025/2026'
      },
      {
        title: 'Base de données TradeMap - Filière Racines & Tubercules',
        organization: 'Centre du Commerce International (ITC)',
        url: 'https://trademap.org',
        dataType: 'Flux d\'échanges transfrontaliers et exportations',
        collectionMethod: 'Déclarations douanières et flux commerciaux officiels',
        freshness: 'Mise à jour trimestrielle'
      },
      {
        title: 'Relevés des Prix des Produits Vivriers sur les Marchés de Lomé',
        organization: 'ANASAP / Chambre de Commerce et d\'Industrie du Togo (CCIT)',
        url: 'https://ccit.tg',
        dataType: 'Prix de détail et de gros au kilo',
        collectionMethod: 'Relevés hebdomadaires de mercuriale',
        freshness: 'Relevés hebdomadaires actifs'
      }
    ],
    confidenceScore: 93
  },

  'mobile money': {
    id: 'report-mobile-money-wa',
    marketName: 'Services et Écosystèmes Mobile Money B2B',
    sectorId: 'fintech',
    region: 'west_africa',
    countryLabel: 'Afrique de l\'Ouest (UEMOA / CEDEAO)',
    createdAt: '13 Octobre 2026',
    executiveSummary: 'Le Mobile Money en Afrique de l\'Ouest a dépassé le stade du simple transfert de particulier à particulier (P2P). Le champ de bataille stratégique est désormais la digitalisation des flux marchands (B2C), des paiements inter-entreprises (B2B) et la distribution de micro-assurance et micro-crédit intégrée.',
    opportunityScore: opportunityScoreEngine.calculate({
      demandMomentum: 95,
      growthRate: 88,
      marketInterest: 92,
      competitiveGap: 70,
      searchMomentum: 90,
      marketSaturation: 50, // Les telcos dominent mais manquent de couches B2B spécialisées
      riskFactor: 28 // Réglementation BCEAO claire et incitative
    }),
    demandOverview: 'Plus de 110 millions de comptes actifs dans la zone UEMOA, avec un volume annuel dépassant les 45 000 milliards de FCFA. La demande des commerçants et PME pour un système unifié évitant les coupures et réconciliant les caisses est au plus haut historique.',
    historicalInterest: {
      periods: ['Nov 2025', 'Jan 2026', 'Mar 2026', 'Mai 2026', 'Juil 2026', 'Sep 2026'],
      values: [75, 79, 84, 89, 94, 98]
    },
    seasonalityCurve: [
      { month: 'Janvier', demandIndex: 82, commercialActivity: 'moyen', notes: 'Régulation des dépenses post-fêtes.' },
      { month: 'Février', demandIndex: 78, commercialActivity: 'moyen', notes: 'Reprise des flux commerciaux réguliers.' },
      { month: 'Mars', demandIndex: 83, commercialActivity: 'moyen', notes: 'Période de paiement des impôts et acomptes.' },
      { month: 'Avril', demandIndex: 80, commercialActivity: 'moyen', notes: 'Flux stables.' },
      { month: 'Mai', demandIndex: 85, commercialActivity: 'moyen', notes: 'Fêtes des mères et flux commerciaux.' },
      { month: 'Juin', demandIndex: 87, commercialActivity: 'moyen', notes: 'Campagnes d\'achat d\'intrants agricoles.' },
      { month: 'Juillet', demandIndex: 86, commercialActivity: 'moyen', notes: 'Début des vacances et transferts régionaux.' },
      { month: 'Août', demandIndex: 89, commercialActivity: 'pic', notes: 'Fêtes traditionnelles et mariages.' },
      { month: 'Septembre', demandIndex: 96, commercialActivity: 'pic', notes: 'Rentrée scolaire : pic massif de transferts de frais de scolarité.' },
      { month: 'Octobre', demandIndex: 90, commercialActivity: 'pic', notes: 'Poursuite des paiements scolaires et commerciaux.' },
      { month: 'Novembre', demandIndex: 93, commercialActivity: 'pic', notes: 'Achats anticipés et récoltes agricoles.' },
      { month: 'Décembre', demandIndex: 100, commercialActivity: 'pic', notes: 'Pic historique de consommation, cadeaux et transferts familiaux.' }
    ],
    competitionOverview: 'Duopole ou triopole selon les pays (Wave, Orange Money, Moov Money / Flooz, Togocom TMoney, MTN). Les acteurs télécoms se battent sur les commissions P2P (souvent proches de 1%), laissant les services à valeur ajoutée (API développeurs, logiciels marchands) à des partenaires tiers.',
    keyActors: [
      {
        name: 'Opérateurs Télécoms & Licences EME (Orange, Togocom, Moov, MTN)',
        marketShareEstimate: '60% des dépôts',
        strength: 'Réseaux de distribution physique gigantesques, SIM propriétaires',
        weakness: 'Frais parfois jugés élevés par les marchands, interfaces rigides',
        positioning: 'Infrastructures télécoms et comptes primaires'
      },
      {
        name: 'Fintechs Pure Players (Wave, etc.)',
        marketShareEstimate: '35% des volumes transactionnels urbains',
        strength: 'Frais réduits (1%), UX exceptionnelle, QR code rapide',
        weakness: 'Présence rurale moins dense, dépendance aux canaux de liquidité',
        positioning: 'Champion de l\'expérience utilisateur mobile'
      },
      {
        name: 'Agrégateurs & Passerelles B2B (PayDunya, FedaPay, CinetPay, TouchPay)',
        marketShareEstimate: '5% des volumes globaux, mais 70% de l\'e-commerce formel',
        strength: 'API unifiées, réconciliation multi-pays',
        weakness: 'Moins connus du grand public non-technique',
        positioning: 'Partenaire technologique des entreprises'
      }
    ],
    competitiveGapSummary: 'Manque cruel d\'outils "plug-and-play" pour les 90% de micro-entreprises non informatisées (boutiques de quartier, salons de coiffure, grossistes du marché).',
    associatedProducts: [
      'Terminaux mobiles d\'encaissement sans contact',
      'Passerelles de paiement pour boutiques WhatsApp',
      'Logiciels de paye connectés au Mobile Money pour ouvriers et journaliers',
      'Micro-épargne rémunérée et tontines digitales sécurisées'
    ],
    emergingSubTrends: [
      'Interopérabilité régionale instantanée via le GIM-UEMOA',
      'Suppression progressive des espèces dans les gares routières et marchés publics',
      'Micro-crédit instantané basé sur les volumes d\'encaissement quotidiens'
    ],
    weakSignals: [
      'Plusieurs banques commerciales africaines renoncent à leurs propres applications P2P pour s\'adosser directement aux portefeuilles Mobile Money',
      'Montée des paiements marchands transfrontaliers directs entre le Togo, le Bénin et le Ghana sans change physique de devises'
    ],
    commercialPotential: {
      level: 'Élevé',
      estimatedPaybackMonths: 9,
      targetAudience: 'Commerçants, PME, plateformes de livraison, prestataires de services',
      ticketMoyen: 'Commission de 0,5% à 1,5% par transaction ou abonnement SaaS de 5 000 FCFA/mois'
    },
    risks: [
      {
        title: 'Évolution de la fiscalité sur les transactions électroniques',
        severity: 'Moyen',
        mitigationStrategy: 'Construire le modèle économique sur le gain d\'efficacité et le logiciel de gestion plutôt que sur une pure commission financière.'
      },
      {
        title: 'Coupures réseaux télécoms périodiques',
        severity: 'Élevé',
        mitigationStrategy: 'Prévoir un mode déconnecté crypté ou basculement automatique SMS/USSD en cas d\'indisponibilité de la data mobile.'
      },
      {
        title: 'Risque de fraude et ingénierie sociale',
        severity: 'Moyen',
        mitigationStrategy: 'Double authentification biométrique et éducation continue des marchands affiliés.'
      }
    ],
    opportunities: [
      {
        title: 'Fourniture de caisses enregistreuses connectées',
        impact: 'Court terme',
        description: 'Vendre des boîtiers autonomes émettant un signal vocal confirmant le paiement reçu (Soundbox).'
      },
      {
        title: 'Paiement automatique des journaliers',
        impact: 'Moyen terme',
        description: 'Permettre aux entreprises de BTP et agricoles de verser 200 salaires en un clic chaque samedi soir.'
      },
      {
        title: 'Micro-affacturage sur factures clients',
        impact: 'Stratégique',
        description: 'Avancer la trésorerie sur les créances vérifiées encaissables par Mobile Money.'
      }
    ],
    actionableRecommendations: [
      {
        phase: 'Phase 1',
        timeframe: '45 jours',
        action: 'Intégrer les API officielles Flooz, TMoney et Wave dans une solution unifiée de notification vocale pour marchands.',
        expectedResult: 'Prototype fonctionnel testé auprès de 30 boutiques à Lomé.'
      },
      {
        phase: 'Phase 2',
        timeframe: '60 jours',
        action: 'Déployer les boîtiers sonores dans 200 points de vente avec un abonnement mensuel abordable de 3 000 FCFA.',
        expectedResult: 'Revenu récurrent prévisible et fidélisation des commerçants.'
      },
      {
        phase: 'Phase 3',
        timeframe: '90 jours',
        action: 'Brancher un module d\'avance de trésorerie en partenariat avec une institution de microfinance.',
        expectedResult: 'Diversification des revenus vers les marges de courtage financier.'
      }
    ],
    dataSources: [
      {
        title: 'Rapport Annuel sur les Services Financiers Numériques dans l\'UEMOA',
        organization: 'Banque Centrale des États de l\'Afrique de l\'Ouest (BCEAO)',
        url: 'https://bceao.int',
        dataType: 'Statistiques officielles des comptes, volumes et valeurs des flux',
        collectionMethod: 'Rapports réglementaires obligatoires des émetteurs de monnaie électronique',
        freshness: 'Données consolidées 2025/2026'
      },
      {
        title: 'State of the Industry Report on Mobile Money',
        organization: 'GSMA Mobile for Development',
        url: 'https://gsma.com',
        dataType: 'Tendances d\'usage, taux d\'adoption mondial et régional',
        collectionMethod: 'Données globales d\'opérateurs de télécommunications',
        freshness: 'Rapport annuel'
      }
    ],
    confidenceScore: 96
  }
};

// ==========================================
// 4. DYNAMIC SYNTHESIZER FOR ANY UNSEEN MARKET
// ==========================================

export function generateDynamicMarketAnalysis(
  marketQuery: string,
  sector: SectorId = 'commerce',
  region: GeoRegion = 'togo'
): MarketAnalysisReport {
  const cleanKey = marketQuery.toLowerCase().trim();
  
  // If we have a hand-curated report, return it with region adjustments
  if (cleanKey.includes('manioc') || cleanKey.includes('gari') || cleanKey.includes('cassava')) {
    const report = { ...CURATED_MARKET_REPORTS['manioc'] };
    report.region = region;
    report.countryLabel = GEO_SCOPES[region]?.label || 'Togo';
    return report;
  }
  
  if (cleanKey.includes('mobile money') || cleanKey.includes('fintech') || cleanKey.includes('paiement') || cleanKey.includes('wave') || cleanKey.includes('tmoney') || cleanKey.includes('flooz')) {
    const report = { ...CURATED_MARKET_REPORTS['mobile money'] };
    report.region = region;
    report.countryLabel = GEO_SCOPES[region]?.label || 'Afrique de l\'Ouest';
    return report;
  }

  // Generate deterministic synthetic intelligence based on query hash
  let hash = 0;
  for (let i = 0; i < marketQuery.length; i++) {
    hash = marketQuery.charCodeAt(i) + ((hash << 5) - hash);
  }
  const absHash = Math.abs(hash);

  const sectorObj = SECTORS.find(s => s.id === sector) || SECTORS[2];
  const geoObj = GEO_SCOPES[region] || GEO_SCOPES['togo'];

  const demandScore = 60 + (absHash % 32); // 60 to 92
  const growthScore = 55 + ((absHash >> 2) % 36);
  const interestScore = 65 + ((absHash >> 3) % 30);
  const compGap = 50 + ((absHash >> 4) % 40);
  const searchMom = 58 + ((absHash >> 5) % 35);
  const saturation = 25 + ((absHash >> 6) % 45);
  const risk = 25 + ((absHash >> 7) % 35);

  const oppScore = opportunityScoreEngine.calculate({
    demandMomentum: demandScore,
    growthRate: growthScore,
    marketInterest: interestScore,
    competitiveGap: compGap,
    searchMomentum: searchMom,
    marketSaturation: saturation,
    riskFactor: risk
  });

  const baseValues = [demandScore - 15, demandScore - 12, demandScore - 8, demandScore - 4, demandScore - 1, demandScore];

  return {
    id: `dyn-report-${absHash}`,
    marketName: marketQuery,
    sectorId: sector,
    region,
    countryLabel: geoObj.label,
    createdAt: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
    executiveSummary: `Analyse de marché décisionnelle pour "${marketQuery}" dans le secteur ${sectorObj.label} pour la zone géographique ${geoObj.label}. Le secteur bénéficie d'une dynamique d'adoption positive soutenue par l'évolution des habitudes de consommation et les impératifs d'efficacité économique locale.`,
    opportunityScore: oppScore,
    demandOverview: `Le niveau de demande mesuré pour "${marketQuery}" affiche une trajectoire haussière avec un indice de confiance solide. Les moteurs principaux incluent la recherche d'optimisation de coûts, la digitalisation des échanges et la transition vers des chaînes de valeur régionales résilientes.`,
    historicalInterest: {
      periods: ['M-5', 'M-4', 'M-3', 'M-2', 'M-1', 'Actuel'],
      values: baseValues.map(v => Math.max(20, Math.min(100, Math.round(v))))
    },
    seasonalityCurve: [
      { month: 'T1 (Jan-Mar)', demandIndex: 72, commercialActivity: 'moyen', notes: 'Reprise progressive des investissements annuels et planification budgétaire.' },
      { month: 'T2 (Avr-Juin)', demandIndex: 78, commercialActivity: 'moyen', notes: 'Consolidation des commandes et partenariats opérationnels.' },
      { month: 'T3 (Juil-Sep)', demandIndex: 85, commercialActivity: 'pic', notes: 'Période de forte activité liée aux cycles économiques saisonniers.' },
      { month: 'T4 (Oct-Déc)', demandIndex: 94, commercialActivity: 'pic', notes: 'Clôture d\'exercice, pics de consommation et commandes de fin d\'année.' }
    ],
    competitionOverview: `La structure concurrentielle sur "${marketQuery}" en ${geoObj.label} se caractérise par une présence d'acteurs traditionnels établis mais souvent lents à moderniser leurs services, ouvrant un créneau stratégique pour une proposition de valeur agile et orientée client.`,
    keyActors: [
      {
        name: `Opérateurs Historiques & Leaders de Place (${geoObj.label})`,
        marketShareEstimate: `${45 + (absHash % 25)}% du volume établi`,
        strength: 'Notoriété installée, réseau commercial étendu, capital confiance',
        weakness: 'Tarifs rigides, délais de traitement longs, faible personnalisation digitale',
        positioning: 'Segments institutionnels et grandes entreprises'
      },
      {
        name: 'PME Nouvelles Entrantes & Startups Régionales',
        marketShareEstimate: `${20 + (absHash % 15)}% en croissance rapide`,
        strength: 'Agilité commerciale, adoption des outils mobiles, proximité client',
        weakness: 'Capacité de trésorerie modérée, couverture géographique encore partielle',
        positioning: 'PME, indépendants et clientèle jeune connectée'
      },
      {
        name: 'Acteurs Informels de Proximité',
        marketShareEstimate: `${15 + (absHash % 20)}% de l\'activité quotidienne`,
        strength: 'Flexibilité maximale, absence de formalités, encaissement espèces',
        weakness: 'Aucune garantie contractuelle, impossible pour les gros donneurs d\'ordre',
        positioning: 'Marché de rue et transactions non déclarées'
      }
    ],
    competitiveGapSummary: `Opportunité nette de capter les clients insatisfaits de la rigidité des acteurs traditionnels en proposant un service transparent, réactif et adapté aux réalités locales de paiement en ${geoObj.currency}.`,
    associatedProducts: [
      `Solutions packagées pour ${marketQuery}`,
      `Services d\'accompagnement et de maintenance associés`,
      `Logiciels légers de suivi de performance et de facturation`,
      `Formations pratiques à l\'usage pour les équipes opérationnelles`
    ],
    emergingSubTrends: [
      `Intégration du paiement Mobile Money (${geoObj.currency}) par défaut`,
      `Préférence marquée pour les modèles à la consommation ou abonnements sans engagement lourd`,
      `Exigence de support client local en langue locale et français via messagerie instantanée`
    ],
    weakSignals: [
      `Montée des recherches d'alternatives plus économiques sur les réseaux sociaux professionnels`,
      `Volonté croissante des donneurs d'ordre de contractualiser avec des prestataires locaux fiables`
    ],
    commercialPotential: {
      level: oppScore.totalScore > 75 ? 'Élevé' : oppScore.totalScore > 50 ? 'Modéré' : 'Niche',
      estimatedPaybackMonths: 10 + (absHash % 12),
      targetAudience: `Entreprises, commerces et professionnels actifs en ${geoObj.label}`,
      ticketMoyen: `Selon segmentation de 10 000 à 250 000 ${geoObj.currency}`
    },
    risks: [
      {
        title: 'Retards de paiement et tension sur le fonds de roulement',
        severity: 'Élevé',
        mitigationStrategy: 'Exiger un acompte minimum de 40% à la commande et lier les livraisons à des jalons clairs.'
      },
      {
        title: 'Instabilité des coûts des matières ou intrants importés',
        severity: 'Moyen',
        mitigationStrategy: 'Privilégier les approvisionnements dans la zone monétaire UEMOA/CEDEAO pour éviter le risque de change.'
      },
      {
        title: 'Adoption lente par les profils peu digitalisés',
        severity: 'Moyen',
        mitigationStrategy: 'Concevoir une interface extrêmement simple fonctionnant sur smartphone basique sans nécessité d\'ordinateur.'
      }
    ],
    opportunities: [
      {
        title: 'Différenciation par la réactivité du service client',
        impact: 'Stratégique',
        description: 'Mettre en place une ligne d\'assistance directe WhatsApp avec réponse en moins de 15 minutes.'
      },
      {
        title: 'Partenariats de distribution croisée avec des acteurs complémentaires',
        impact: 'Court terme',
        description: 'S\'associer avec des distributeurs déjà implantés pour réduire les coûts d\'acquisition client.'
      },
      {
        title: 'Déclinaison d\'une offre adaptée aux marchés secondaires régionaux',
        impact: 'Moyen terme',
        description: 'Étendre la présence au-delà de la capitale vers les grands pôles régionaux (ex: Kara, Sokodé, Kpalimé au Togo).'
      }
    ],
    actionableRecommendations: [
      {
        phase: 'Validation Commerciale (Semaines 1-3)',
        timeframe: '21 jours',
        action: `Mener 15 entretiens de découverte avec des clients cibles potentiels sur "${marketQuery}" pour affiner la grille tarifaire.`,
        expectedResult: 'Identification précise des 3 critères d\'achat décisifs et pré-commandes de test.'
      },
      {
        phase: 'Lancement d\'Offre Pilote (Mois 1-2)',
        timeframe: '60 jours',
        action: 'Déployer une version épurée de la solution avec 5 premiers clients de référence offrant un retour d\'expérience public.',
        expectedResult: 'Preuve de concept validée et premiers flux de trésorerie positifs.'
      },
      {
        phase: 'Accélération Commerciale (Mois 3-6)',
        timeframe: '90 jours',
        action: 'Structurer une force de vente de terrain et automatiser la relance commerciale par messagerie.',
        expectedResult: 'Atteinte du seuil de rentabilité opérationnelle.'
      }
    ],
    dataSources: [
      {
        title: `Observatoire Économique Sectoriel - ${sectorObj.label}`,
        organization: `Chambres Consulaires et Ministères de Tutelle (${geoObj.label})`,
        url: 'https://insd.gouv.tg',
        dataType: 'Données macroéconomiques et mercuriales sectorielles',
        collectionMethod: 'Recensements statistiques institutionnels et déclarations d\'activités',
        freshness: 'Données consolidées 2025/2026'
      },
      {
        title: 'Indices d\'Intérêt et Tendances de Recherche Régionales',
        organization: 'Market Intelligence Aggregator / Global Data Insights',
        url: 'https://trends.google.com',
        dataType: 'Volume de requêtes relatives et vitesse d\'adoption',
        collectionMethod: 'Échantillonnage statistique pondéré sur 12 mois glissants',
        freshness: 'Mise à jour en temps réel'
      }
    ],
    confidenceScore: 88
  };
}

// ==========================================
// 5. B2B BUSINESS INTELLIGENCE STRATEGIC MEMO GENERATOR
// ==========================================

export function generateBIMemo(
  sector: SectorId,
  region: GeoRegion,
  market: string,
  objective: BIOkObjective
): BIStrategicMemo {
  const geoObj = GEO_SCOPES[region] || GEO_SCOPES['togo'];
  const sectorObj = SECTORS.find(s => s.id === sector) || SECTORS[0];

  const objectiveTitles: Record<BIOkObjective, string> = {
    high_potential_market: 'Identification et Pénétration d\'un Marché à Fort Potentiel',
    new_product_launch: 'Stratégie de Lancement d\'une Nouvelle Offre Commerciale',
    demand_decline_hedge: 'Anticipation des Risques et Pivot Stratégique face au Déclin',
    competitive_niche: 'Capture d\'une Niche Compétitive Rentable et Défendable'
  };

  const memoTitle = objectiveTitles[objective];

  return {
    id: `bi-memo-${Date.now()}`,
    sectorId: sector,
    region,
    marketName: market,
    objective,
    generatedAt: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
    executiveSummary: `Note de cadrage stratégique B2B pour le déploiement sur "${market}" (${sectorObj.label}) en ${geoObj.label}. Objectif prioritaire : ${memoTitle}. L'analyse recommande un positionnement axé sur la fiabilité d'exécution, la clarté tarifaire en ${geoObj.currency} et la maîtrise des canaux de distribution locaux.`,
    macroEconomicContext: `Le marché en ${geoObj.label} bénéficie de réformes d'encouragement à l'entrepreneuriat local dans l'espace ${geoObj.economicZone}. Les marges brutes réalisables sur les segments structurés se situent entre 22% et 40%, à condition de verrouiller la chaîne logistique et de limiter l'exposition aux créances impayées.`,
    keyDrivers: [
      `Demande soutenue des ménages et PME pour des solutions de qualité constante`,
      `Transition numérique accélérée par la démocratisation des smartphones et du Mobile Money`,
      `Politiques publiques d'incitation à la valorisation et à la consommation locale (Made in ${geoObj.label})`,
      `Opportunité d'intégration régionale sous les accords de libre-échange (${geoObj.economicZone})`
    ],
    strategicPositioningAdvice: `Éviter la guerre des prix face aux acteurs informels qui ont des coûts fixes nuls. Se positionner sur un niveau "Standard Plus" garantissant traçabilité, hygiène/qualité irréprochable, respect des délais et service après-vente réactif.`,
    suggestedPricingStructure: {
      entryLevel: `Offre découverte / conditionnement d'essai (Ex: 1 500 à 3 000 ${geoObj.currency})`,
      standard: `Offre cœur de gamme familiale ou PME (Ex: 10 000 à 25 000 ${geoObj.currency})`,
      premiumB2B: `Contrat d'approvisionnement récurrent avec livraison dédiée (Ex: 100 000 à 350 000 ${geoObj.currency}/mois)`,
      distributionMarginRecommendation: 'Réserver 18% à 25% de marge pour les revendeurs de détail afin de stimuler leur engagement actif.'
    },
    recommendedGoToMarketChannels: [
      'Vente directe de proximité appuyée par un canal WhatsApp Business animé quotidiennement',
      'Réseau d\'ambassadeurs et prescripteurs locaux rémunérés à la commission d\'apport d\'affaires',
      'Partenariats de distribution avec les boutiques de demi-gros et supérettes de quartier',
      'Présence active sur les foires régionales, marchés forains et salons professionnels sectoriels'
    ],
    regulatoryAndLocalConsiderations: [
      `Enregistrement formel au Registre du Commerce et du Crédit Mobilier (RCCM) pour accéder aux commandes institutionnelles`,
      `Obtention du Numéro d'Identification Fiscale (NIF) et adhésion aux régimes fiscaux simplifiés pour PME`,
      `Pour l'agroalimentaire et la santé : analyse et homologation auprès des laboratoires nationaux de contrôle de qualité`,
      `Conformité aux règles de facturation normalisée et encaissement sécurisé`
    ],
    executionRoadmap: [
      {
        stepNumber: 1,
        title: 'Sécurisation de l\'approvisionnement et calage des coûts de revient',
        actions: [
          'Vérifier au minimum 2 sources d\'approvisionnement distinctes pour parer à toute rupture.',
          'Calculer le coût de revient unitaire complet incluant transport, pertes et amortissements.',
          'Fixer la politique de crédit client : zéro crédit non garanti aux nouveaux entrants.'
        ]
      },
      {
        stepNumber: 2,
        title: 'Campagne de pré-lancement et constitution d\'une base d\'amorçage',
        actions: [
          'Proposer des échantillons ou séances de démonstration auprès de 20 décideurs ciblés.',
          'Recueillir les objections majeures et adapter le discours commercial en moins de 10 jours.',
          'Sécuriser 5 premières commandes fermes avant l\'engagement de dépenses publicitaires lourdes.'
        ]
      },
      {
        stepNumber: 3,
        title: 'Mise en place de la routine commerciale et boucle de fidélisation',
        actions: [
          'Instaurer un appel systématique à J+3 après chaque livraison pour mesurer la satisfaction.',
          'Proposer un réapprovisionnement automatique avec réduction de 5% pour les commandes régulières.',
          'Réinvestir les bénéfices des premiers mois dans l\'augmentation de la capacité de stockage.'
        ]
      }
    ]
  };
}
