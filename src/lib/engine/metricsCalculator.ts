import { ItemProfile, RawSnippet } from '../schemas/comparison';

export interface ComparisonMetricsResult {
  deltaScore: number;
  averageIndexationScore: number;
  dataFreshnessTimestamp: number;
  itemAScore: number;
  itemBScore: number;
}

export class MetricsCalculator {
  /**
   * Calculates overall comparison metrics between two items
   */
  public computeComparisonMetrics(
    profileA: ItemProfile,
    profileB: ItemProfile,
    snippetsA: RawSnippet[],
    snippetsB: RawSnippet[]
  ): ComparisonMetricsResult {
    // 1. Indexation Depth Score based on snippet density & length
    const countA = snippetsA.length;
    const countB = snippetsB.length;
    const totalSnippetLen = [...snippetsA, ...snippetsB].reduce((acc, s) => acc + s.snippet.length, 0);
    const avgIndexationScore = Math.min(100, Math.round(((countA + countB) * 8) + (totalSnippetLen / 50)));

    // 2. Relative Delta Score ($\Delta = Score_A - Score_B$)
    const deltaScore = profileA.trendScore - profileB.trendScore;

    // 3. Weighted Confidence Score
    const computeConfidence = (profile: ItemProfile, snippets: RawSnippet[]) => {
      const specWeight = profile.technicalSpecs.length * 10;
      const snippetWeight = snippets.length * 12;
      const capabilityWeight = profile.capabilities.length * 8;
      return Math.min(99, Math.max(65, Math.round(40 + specWeight + snippetWeight + capabilityWeight)));
    };

    profileA.confidenceScore = computeConfidence(profileA, snippetsA);
    profileB.confidenceScore = computeConfidence(profileB, snippetsB);

    return {
      deltaScore,
      averageIndexationScore: avgIndexationScore,
      dataFreshnessTimestamp: Date.now(),
      itemAScore: profileA.trendScore,
      itemBScore: profileB.trendScore,
    };
  }
}

export const metricsCalculator = new MetricsCalculator();
