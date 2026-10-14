import { db } from './index.ts';
import { categories, countries, dataSources, markets, opportunities } from './schema.ts';
import { eq, desc } from 'drizzle-orm';

export async function getCategories() {
  try {
    return await db.select().from(categories).where(eq(categories.isActive, true));
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function getCountries() {
  try {
    return await db.select().from(countries).where(eq(countries.isActive, true));
  } catch (error) {
    console.error('Error fetching countries:', error);
    return [];
  }
}

export async function getDataSources() {
  try {
    return await db.select().from(dataSources).where(eq(dataSources.isActive, true));
  } catch (error) {
    console.error('Error fetching data sources:', error);
    return [];
  }
}

export async function getActiveOpportunities(limit = 10) {
  try {
    return await db
      .select()
      .from(opportunities)
      .where(eq(opportunities.isActive, true))
      .orderBy(desc(opportunities.detectedAt))
      .limit(limit);
  } catch (error) {
    console.error('Error fetching opportunities:', error);
    return [];
  }
}
