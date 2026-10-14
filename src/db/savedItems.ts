import { db } from './index.ts';
import { savedAnalyses, savedComparisons } from './schema.ts';
import { eq, and, desc } from 'drizzle-orm';

export interface SaveAnalysisInput {
  userId: string;
  marketName: string;
  sectorId: string;
  region: string;
  opportunityScore: number;
  executiveSummary: string;
  reportData: string; // JSON string
}

export async function getUserAnalyses(userId: string) {
  try {
    return await db
      .select()
      .from(savedAnalyses)
      .where(eq(savedAnalyses.userId, userId))
      .orderBy(desc(savedAnalyses.createdAt));
  } catch (error) {
    console.error('Error fetching saved analyses:', error);
    throw new Error('Database operation failed fetching saved analyses.', { cause: error });
  }
}

export async function saveAnalysis(input: SaveAnalysisInput) {
  try {
    const result = await db
      .insert(savedAnalyses)
      .values({
        userId: input.userId,
        marketName: input.marketName,
        sectorId: input.sectorId,
        region: input.region,
        opportunityScore: input.opportunityScore,
        executiveSummary: input.executiveSummary,
        reportData: input.reportData,
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Error saving analysis:', error);
    throw new Error('Database operation failed saving analysis.', { cause: error });
  }
}

export async function deleteAnalysis(id: number, userId: string) {
  try {
    const result = await db
      .delete(savedAnalyses)
      .where(and(eq(savedAnalyses.id, id), eq(savedAnalyses.userId, userId)))
      .returning();

    return result[0] || null;
  } catch (error) {
    console.error('Error deleting analysis:', error);
    throw new Error('Database operation failed deleting analysis.', { cause: error });
  }
}

export interface SaveComparisonInput {
  userId: string;
  termA: string;
  termB: string;
  category?: string;
  comparisonData: string; // JSON string
}

export async function getUserComparisons(userId: string) {
  try {
    return await db
      .select()
      .from(savedComparisons)
      .where(eq(savedComparisons.userId, userId))
      .orderBy(desc(savedComparisons.createdAt));
  } catch (error) {
    console.error('Error fetching saved comparisons:', error);
    throw new Error('Database operation failed fetching comparisons.', { cause: error });
  }
}

export async function saveComparison(input: SaveComparisonInput) {
  try {
    const result = await db
      .insert(savedComparisons)
      .values({
        userId: input.userId,
        termA: input.termA,
        termB: input.termB,
        category: input.category || null,
        comparisonData: input.comparisonData,
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Error saving comparison:', error);
    throw new Error('Database operation failed saving comparison.', { cause: error });
  }
}

export async function deleteComparison(id: number, userId: string) {
  try {
    const result = await db
      .delete(savedComparisons)
      .where(and(eq(savedComparisons.id, id), eq(savedComparisons.userId, userId)))
      .returning();

    return result[0] || null;
  } catch (error) {
    console.error('Error deleting comparison:', error);
    throw new Error('Database operation failed deleting comparison.', { cause: error });
  }
}
