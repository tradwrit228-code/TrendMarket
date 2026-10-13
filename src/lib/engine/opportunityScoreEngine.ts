import { 
  MarketOpportunityScore, 
  OpportunityScoreWeights, 
  DEFAULT_SCORE_WEIGHTS 
} from '../types/marketIntelligence';

export interface ScoreFactorsInput {
  demandMomentum: number; // Raw 0-100 (e.g. 85 for booming demand)
  growthRate: number;     // Raw 0-100 (e.g. 75 for +25% yearly expansion)
  marketInterest: number; // Raw 0-100 (e.g. 80 for strong public/b2b curiosity)
  competitiveGap: number; // Raw 0-100 (higher means more untapped room/less dominant monopoly)
  searchMomentum: number; // Raw 0-100 (query growth velocity)
  marketSaturation: number; // Raw 0-100 (penalty: 80 means highly crowded)
  riskFactor: number;     // Raw 0-100 (penalty: 70 means volatile regulatory/supply chain)
}

export class OpportunityScoreEngine {
  private weights: OpportunityScoreWeights;

  constructor(customWeights: Partial<OpportunityScoreWeights> = {}) {
    this.weights = { ...DEFAULT_SCORE_WEIGHTS, ...customWeights };
  }

  /**
   * Computes the Market Opportunity Score (0 to 100)
   * Formula:
   * (Demand * w1 + Growth * w2 + Interest * w3 + CompGap * w4 + Search * w5)
   * - (Saturation * w6 + Risk * w7)
   */
  public calculate(factors: ScoreFactorsInput): MarketOpportunityScore {
    const {
      demandMomentum,
      growthRate,
      marketInterest,
      competitiveGap,
      searchMomentum,
      marketSaturation,
      riskFactor
    } = factors;

    // Positive driver score (base 0-100)
    const positiveWeighted = 
      (demandMomentum * this.weights.demandMomentum) +
      (growthRate * this.weights.growthRate) +
      (marketInterest * this.weights.marketInterest) +
      (competitiveGap * this.weights.competitiveGap) +
      (searchMomentum * this.weights.searchMomentum);

    // Negative penalties (0-100 normalized)
    const penaltyWeighted = 
      (marketSaturation * this.weights.saturationPenalty) +
      (riskFactor * this.weights.riskPenalty);

    // Composite Score clamped between 0 and 100
    const rawTotal = Math.round(positiveWeighted - penaltyWeighted);
    const totalScore = Math.max(5, Math.min(99, rawTotal));

    // Qualitative rating & actionable takeaway
    let rating: MarketOpportunityScore['rating'] = 'moderate';
    let ratingLabel = 'Opportunité Modérée';
    let explanation = '';

    if (totalScore >= 80) {
      rating = 'exceptional';
      ratingLabel = 'Opportunité Stratégique Majeure';
      explanation = 'Forte traction de la demande combinée à un espace concurrentiel favorable. Moment opportun pour pénétrer le marché.';
    } else if (totalScore >= 65) {
      rating = 'high';
      ratingLabel = 'Fort Potentiel Commercial';
      explanation = 'Marché en expansion régulière avec une demande saine et des opportunités de différenciation rentables.';
    } else if (totalScore >= 45) {
      rating = 'moderate';
      ratingLabel = 'Potentiel Niche / Validé';
      explanation = 'Croissance présente mais nécessitant une proposition de valeur très ciblée pour contourner les frictions.';
    } else if (totalScore >= 30) {
      rating = 'cautious';
      ratingLabel = 'Vigilance & Risque Élevé';
      explanation = 'Pression concurrentielle forte ou volatilité des marges. Nécessite une prudence rigoureuse avant investissement.';
    } else {
      rating = 'saturated';
      ratingLabel = 'Marché Saturé / Déclinant';
      explanation = 'Barrières à l\'entrée très élevées et saturation de l\'offre. Risque de guerre des prix.';
    }

    return {
      totalScore,
      rating,
      ratingLabel,
      breakdown: {
        demandMomentumScore: Math.round(demandMomentum),
        growthRateScore: Math.round(growthRate),
        marketInterestScore: Math.round(marketInterest),
        competitiveGapScore: Math.round(competitiveGap),
        searchMomentumScore: Math.round(searchMomentum),
        saturationPenalty: Math.round(marketSaturation),
        riskPenalty: Math.round(riskFactor),
      },
      explanation,
    };
  }
}

export const opportunityScoreEngine = new OpportunityScoreEngine();
