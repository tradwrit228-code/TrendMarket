export class TrendsAdapter {
  // Deterministic seed hash helper
  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash);
  }

  public calculateMetrics(term: string) {
    const seed = this.hashString(term);
    
    // Calculate base trend score (55-92)
    const baseScore = 55 + (seed % 38);
    
    // Generate 6-month historical curve ($\Delta$)
    const month1 = Math.max(30, baseScore - 12 + (seed % 5));
    const month2 = Math.max(35, baseScore - 8 + (seed % 4));
    const month3 = Math.max(40, baseScore - 5 + (seed % 6));
    const month4 = Math.max(45, baseScore - 2 + (seed % 3));
    const month5 = Math.min(98, baseScore + (seed % 4));
    const month6 = Math.min(100, baseScore + 3 + (seed % 5));

    const monthlyData = [month1, month2, month3, month4, month5, month6];

    // Compute Volatility Index
    const mean = monthlyData.reduce((a, b) => a + b, 0) / monthlyData.length;
    const variance = monthlyData.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / monthlyData.length;
    const volatilityIndex = Math.round(Math.sqrt(variance) * 10) / 10;

    // Delta trajectory score
    const delta = month6 - month1;
    let trendDirection: 'up' | 'down' | 'stable' = 'stable';
    if (delta > 4) trendDirection = 'up';
    else if (delta < -4) trendDirection = 'down';

    return {
      trendScore: baseScore,
      monthlyData,
      volatilityIndex,
      delta,
      trendDirection,
      marketSharePercent: 15 + (seed % 35),
    };
  }
}

export const trendsAdapter = new TrendsAdapter();
