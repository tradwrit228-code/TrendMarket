import { z } from 'zod';

// Input request schema
export const CompareRequestSchema = z.object({
  termA: z.string().min(1, "Le premier terme est requis").max(100),
  termB: z.string().min(1, "Le deuxième terme est requis").max(100),
  category: z.string().default("Général"),
  mode: z.enum(['direct_web', 'ai']).default('direct_web'),
  useDirectWeb: z.boolean().optional(),
  userLang: z.string().default('fr-FR'),
});

export type CompareRequest = z.infer<typeof CompareRequestSchema>;

// Raw extracted snippet from adapter
export const RawSnippetSchema = z.object({
  source: z.string(),
  title: z.string(),
  url: z.string().url().catch(''),
  snippet: z.string(),
  timestamp: z.number(),
});

export type RawSnippet = z.infer<typeof RawSnippetSchema>;

// Normalized Technical Spec Item
export const TechSpecSchema = z.object({
  label: z.string(),
  value: z.string(),
});

// Normalized Item Profile
export const ItemProfileSchema = z.object({
  name: z.string(),
  typeLabel: z.string(),
  description: z.string(),
  marketShare: z.string(),
  trendDirection: z.enum(['up', 'down', 'stable']),
  trendScore: z.number().min(0).max(100),
  capabilities: z.array(z.string()),
  useCasesAndUtility: z.string(),
  systemsAndPlatforms: z.array(z.string()),
  businessModel: z.string(),
  technicalSpecs: z.array(TechSpecSchema),
  pros: z.array(z.string()),
  cons: z.array(z.string()),
  monthlyData: z.array(z.number()),
  volatilityIndex: z.number().optional(),
  confidenceScore: z.number().min(0).max(100).optional(),
});

export type ItemProfile = z.infer<typeof ItemProfileSchema>;

// Grounding / Web Source Reference
export const GroundingSourceSchema = z.object({
  title: z.string(),
  url: z.string(),
  snippet: z.string().optional(),
});

export type GroundingSource = z.infer<typeof GroundingSourceSchema>;

// Full Comparison Data Schema
export const CompareDataSchema = z.object({
  isFallback: z.boolean().optional(),
  isDirectWebSearch: z.boolean().optional(),
  isStandardAIFallback: z.boolean().optional(),
  termA: ItemProfileSchema,
  termB: ItemProfileSchema,
  comparisonSummary: z.string(),
  keyFactors: z.array(z.string()),
  groundingSources: z.array(GroundingSourceSchema),
  metrics: z.object({
    deltaScore: z.number(),
    averageIndexationScore: z.number(),
    dataFreshnessTimestamp: z.number(),
  }).optional(),
});

export type CompareData = z.infer<typeof CompareDataSchema>;

// Audit Log Entry Schema
export const AuditLogSchema = z.object({
  id: z.string(),
  timestamp: z.number(),
  queryA: z.string(),
  queryB: z.string(),
  mode: z.string(),
  success: z.boolean(),
  durationMs: z.number(),
  sourcesFetchedCount: z.number(),
  error: z.string().optional(),
});

export type AuditLog = z.infer<typeof AuditLogSchema>;
