import { db } from './index.ts';
import { watchlists } from './schema.ts';
import { eq, and, desc } from 'drizzle-orm';

export interface AddWatchlistInput {
  userId: string;
  itemType: string;
  name: string;
  sector?: string;
  region?: string;
  initialMomentum?: number;
  notes?: string;
}

export async function getUserWatchlists(userId: string) {
  try {
    return await db
      .select()
      .from(watchlists)
      .where(eq(watchlists.userId, userId))
      .orderBy(desc(watchlists.createdAt));
  } catch (error) {
    console.error('Error fetching watchlists:', error);
    throw new Error('Database operation failed fetching watchlists.', { cause: error });
  }
}

export async function addToWatchlist(input: AddWatchlistInput) {
  try {
    const result = await db
      .insert(watchlists)
      .values({
        userId: input.userId,
        itemType: input.itemType,
        name: input.name,
        sector: input.sector || null,
        region: input.region || null,
        initialMomentum: input.initialMomentum ?? null,
        notes: input.notes || null,
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    throw new Error('Database operation failed adding to watchlist.', { cause: error });
  }
}

export async function removeFromWatchlist(id: number, userId: string) {
  try {
    const result = await db
      .delete(watchlists)
      .where(and(eq(watchlists.id, id), eq(watchlists.userId, userId)))
      .returning();

    return result[0] || null;
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    throw new Error('Database operation failed removing from watchlist.', { cause: error });
  }
}
