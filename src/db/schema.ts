import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  boolean,
  uuid,
  numeric,
  jsonb,
  date,
  char,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ============================================================
// ENUMS (TrendMarket Supabase / PostgreSQL Schema V1)
// ============================================================

export const subscriptionPlanEnum = pgEnum('subscription_plan', [
  'free',
  'pro',
  'business',
]);

export const subscriptionStatusEnum = pgEnum('subscription_status', [
  'trialing',
  'active',
  'past_due',
  'cancelled',
  'expired',
]);

export const analysisStatusEnum = pgEnum('analysis_status', [
  'pending',
  'processing',
  'completed',
  'failed',
]);

export const opportunityTypeEnum = pgEnum('opportunity_type', [
  'emerging',
  'growth',
  'competitive',
  'declining',
  'saturated',
  'high_risk',
]);

// ============================================================
// 1. USERS & PROFILES
// ============================================================

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase / Supabase Auth UID
  email: text('email').notNull(),
  displayName: text('display_name'),
  photoUrl: text('photo_url'),
  plan: subscriptionPlanEnum('plan').notNull().default('free'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').references(() => users.uid, { onDelete: 'cascade' }),
  fullName: text('full_name'),
  avatarUrl: text('avatar_url'),
  companyName: text('company_name'),
  country: text('country'),
  region: text('region'),
  plan: subscriptionPlanEnum('plan').notNull().default('free'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// ============================================================
// 2. CATEGORIES
// ============================================================

export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull().unique(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  parentId: uuid('parent_id'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// ============================================================
// 3. COUNTRIES
// ============================================================

export const countries = pgTable('countries', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull().unique(),
  code: char('code', { length: 2 }).notNull().unique(),
  region: text('region'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// ============================================================
// 4. MARKETS
// ============================================================

export const markets = pgTable('markets', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  categoryId: uuid('category_id').references(() => categories.id, { onDelete: 'set null' }),
  countryId: uuid('country_id').references(() => countries.id, { onDelete: 'set null' }),
  region: text('region'),
  keywords: text('keywords').array().default([]),
  opportunityScore: numeric('opportunity_score', { precision: 5, scale: 2 }),
  momentumScore: numeric('momentum_score', { precision: 8, scale: 2 }),
  confidenceScore: numeric('confidence_score', { precision: 5, scale: 2 }),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// ============================================================
// 5. TRENDS
// ============================================================

export const trends = pgTable('trends', {
  id: uuid('id').primaryKey().defaultRandom(),
  marketId: uuid('market_id').references(() => markets.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  slug: text('slug').notNull(),
  trendValue: numeric('trend_value'),
  growthRate: numeric('growth_rate'),
  momentumScore: numeric('momentum_score'),
  volatilityScore: numeric('volatility_score'),
  trendDirection: text('trend_direction'), // 'rising' | 'stable' | 'declining'
  confidenceScore: numeric('confidence_score', { precision: 5, scale: 2 }),
  sourceId: uuid('source_id'),
  observedAt: timestamp('observed_at', { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// ============================================================
// 6. DATA SOURCES
// ============================================================

export const dataSources = pgTable('data_sources', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  provider: text('provider'),
  sourceType: text('source_type'),
  baseUrl: text('base_url'),
  description: text('description'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// ============================================================
// 7. DATA SNAPSHOTS
// ============================================================

export const dataSnapshots = pgTable('data_snapshots', {
  id: uuid('id').primaryKey().defaultRandom(),
  sourceId: uuid('source_id').references(() => dataSources.id, { onDelete: 'set null' }),
  marketId: uuid('market_id').references(() => markets.id, { onDelete: 'cascade' }),
  dataType: text('data_type').notNull(),
  rawData: jsonb('raw_data'),
  normalizedData: jsonb('normalized_data'),
  checksum: text('checksum'),
  collectedAt: timestamp('collected_at', { withTimezone: true }).notNull().defaultNow(),
  processedAt: timestamp('processed_at', { withTimezone: true }),
});

// ============================================================
// 8. COMPARISONS
// ============================================================

export const comparisons = pgTable('comparisons', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id'),
  entityA: text('entity_a').notNull(),
  entityB: text('entity_b').notNull(),
  categoryId: uuid('category_id').references(() => categories.id, { onDelete: 'set null' }),
  countryId: uuid('country_id').references(() => countries.id, { onDelete: 'set null' }),
  periodStart: date('period_start'),
  periodEnd: date('period_end'),
  result: jsonb('result'),
  confidenceScore: numeric('confidence_score', { precision: 5, scale: 2 }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// ============================================================
// 9. MARKET ANALYSES
// ============================================================

export const marketAnalyses = pgTable('market_analyses', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id'),
  marketId: uuid('market_id').references(() => markets.id, { onDelete: 'set null' }),
  title: text('title'),
  objective: text('objective'),
  status: analysisStatusEnum('status').notNull().default('pending'),
  summary: text('summary'),
  demandScore: numeric('demand_score', { precision: 5, scale: 2 }),
  competitionScore: numeric('competition_score', { precision: 5, scale: 2 }),
  growthScore: numeric('growth_score', { precision: 5, scale: 2 }),
  opportunityScore: numeric('opportunity_score', { precision: 5, scale: 2 }),
  riskScore: numeric('risk_score', { precision: 5, scale: 2 }),
  aiInterpretation: text('ai_interpretation'),
  rawResult: jsonb('raw_result'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// ============================================================
// 10. OPPORTUNITIES
// ============================================================

export const opportunities = pgTable('opportunities', {
  id: uuid('id').primaryKey().defaultRandom(),
  marketId: uuid('market_id').references(() => markets.id, { onDelete: 'cascade' }),
  type: opportunityTypeEnum('type').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  opportunityScore: numeric('opportunity_score', { precision: 5, scale: 2 }),
  confidenceScore: numeric('confidence_score', { precision: 5, scale: 2 }),
  evidence: jsonb('evidence'),
  detectedAt: timestamp('detected_at', { withTimezone: true }).notNull().defaultNow(),
  expiresAt: timestamp('expires_at', { withTimezone: true }),
  isActive: boolean('is_active').notNull().default(true),
});

// ============================================================
// 11. WATCHLISTS
// ============================================================

export const watchlists = pgTable('watchlists', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.uid, { onDelete: 'cascade' }),
  itemType: text('item_type').notNull().default('market'),
  name: text('name').notNull(),
  sector: text('sector'),
  region: text('region'),
  initialMomentum: integer('initial_momentum'),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const watchlistItems = pgTable('watchlist_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  watchlistId: integer('watchlist_id').references(() => watchlists.id, { onDelete: 'cascade' }),
  marketId: uuid('market_id').references(() => markets.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// ============================================================
// 12. SEARCH HISTORY
// ============================================================

export const searches = pgTable('searches', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id'),
  query: text('query').notNull(),
  searchType: text('search_type'),
  filters: jsonb('filters'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// ============================================================
// 13. REPORTS
// ============================================================

export const reports = pgTable('reports', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id'),
  analysisId: uuid('analysis_id').references(() => marketAnalyses.id, { onDelete: 'set null' }),
  title: text('title').notNull(),
  reportType: text('report_type'),
  fileUrl: text('file_url'),
  content: jsonb('content'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// ============================================================
// 14. COMPATIBILITY TABLES (SAVED ANALYSES & COMPARISONS)
// ============================================================

export const savedAnalyses = pgTable('saved_analyses', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.uid, { onDelete: 'cascade' }),
  marketName: text('market_name').notNull(),
  sectorId: text('sector_id').notNull(),
  region: text('region').notNull(),
  opportunityScore: integer('opportunity_score').notNull(),
  executiveSummary: text('executive_summary').notNull(),
  reportData: text('report_data').notNull(), // JSON string
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const savedComparisons = pgTable('saved_comparisons', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.uid, { onDelete: 'cascade' }),
  termA: text('term_a').notNull(),
  termB: text('term_b').notNull(),
  category: text('category'),
  comparisonData: text('comparison_data').notNull(), // JSON string
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// ============================================================
// RELATIONS
// ============================================================

export const usersRelations = relations(users, ({ many }) => ({
  watchlists: many(watchlists),
  savedAnalyses: many(savedAnalyses),
  savedComparisons: many(savedComparisons),
}));

export const profilesRelations = relations(profiles, ({ one }) => ({
  user: one(users, {
    fields: [profiles.userId],
    references: [users.uid],
  }),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
    relationName: 'subcategories',
  }),
  subcategories: many(categories, { relationName: 'subcategories' }),
  markets: many(markets),
}));

export const countriesRelations = relations(countries, ({ many }) => ({
  markets: many(markets),
}));

export const marketsRelations = relations(markets, ({ one, many }) => ({
  category: one(categories, {
    fields: [markets.categoryId],
    references: [categories.id],
  }),
  country: one(countries, {
    fields: [markets.countryId],
    references: [countries.id],
  }),
  trends: many(trends),
  dataSnapshots: many(dataSnapshots),
  analyses: many(marketAnalyses),
  opportunities: many(opportunities),
}));

export const trendsRelations = relations(trends, ({ one }) => ({
  market: one(markets, {
    fields: [trends.marketId],
    references: [markets.id],
  }),
  source: one(dataSources, {
    fields: [trends.sourceId],
    references: [dataSources.id],
  }),
}));

export const marketAnalysesRelations = relations(marketAnalyses, ({ one, many }) => ({
  market: one(markets, {
    fields: [marketAnalyses.marketId],
    references: [markets.id],
  }),
  reports: many(reports),
}));

export const reportsRelations = relations(reports, ({ one }) => ({
  analysis: one(marketAnalyses, {
    fields: [reports.analysisId],
    references: [marketAnalyses.id],
  }),
}));

export const watchlistsRelations = relations(watchlists, ({ one, many }) => ({
  user: one(users, {
    fields: [watchlists.userId],
    references: [users.uid],
  }),
  items: many(watchlistItems),
}));

export const watchlistItemsRelations = relations(watchlistItems, ({ one }) => ({
  watchlist: one(watchlists, {
    fields: [watchlistItems.watchlistId],
    references: [watchlists.id],
  }),
  market: one(markets, {
    fields: [watchlistItems.marketId],
    references: [markets.id],
  }),
}));
