/**
 * Comprehensive Senior Engineering Test & Verification Suite
 * Tests Schemas, Infrastructure, Pipeline, Security Sanitization, and Engine
 */

import { CompareRequestSchema, RawSnippetSchema, ItemProfileSchema, CompareDataSchema } from '../schemas/comparison';
import { sanitizeText, isValidHttpUrl } from '../adapters/baseAdapter';
import { CacheManager } from '../infrastructure/cacheManager';
import { TaskQueueManager } from '../infrastructure/rateLimiter';
import { StructuredLogger } from '../infrastructure/logger';
import { normalizer } from '../pipeline/normalizer';
import { metricsCalculator } from '../engine/metricsCalculator';
import { trendsAdapter } from '../adapters/trendsAdapter';

let passedCount = 0;
let failedCount = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`  ✅ [PASS] ${message}`);
    passedCount++;
  } else {
    console.error(`  ❌ [FAIL] ${message}`);
    failedCount++;
  }
}

async function runTestSuite() {
  console.log("==================================================");
  console.log("🚀 STARTING AUTOMATED CODE AUDIT & TEST SUITE");
  console.log("==================================================\n");

  // --- 1. SECURITY & SANITIZATION ---
  console.log("🔍 Group 1: Security & Sanitization");
  {
    const dirty = "  Hello \x00\x08World! https://evil.com/leak  Multiple   Spaces\r\nNewline ";
    const cleaned = sanitizeText(dirty);
    assert(cleaned === "Hello World! Multiple Spaces Newline", "sanitizeText strips control chars, URLs, and collapses whitespace");

    assert(isValidHttpUrl("https://wikipedia.org/wiki/Apple"), "isValidHttpUrl allows https://");
    assert(isValidHttpUrl("http://example.com"), "isValidHttpUrl allows http://");
    assert(!isValidHttpUrl("javascript:alert(1)"), "isValidHttpUrl blocks javascript: pseudo-protocol");
    assert(!isValidHttpUrl("data:text/html;base64,PHNjcmlwdD4="), "isValidHttpUrl blocks data: URLs");
    assert(!isValidHttpUrl("not-a-url"), "isValidHttpUrl blocks invalid strings");
  }

  // --- 2. ZOD SCHEMAS VALIDATION ---
  console.log("\n🔍 Group 2: Zod Schema Contracts");
  {
    // Valid Compare Request
    const validReq = CompareRequestSchema.safeParse({
      termA: "iPhone 16",
      termB: "Galaxy S25",
      category: "Smartphones",
      mode: "direct_web",
      userLang: "fr-FR",
    });
    assert(validReq.success === true, "CompareRequestSchema passes for valid input");

    // Invalid Compare Request (empty term)
    const invalidReq = CompareRequestSchema.safeParse({
      termA: "",
      termB: "Galaxy S25",
    });
    assert(invalidReq.success === false, "CompareRequestSchema rejects empty termA");

    // Raw snippet validation
    const validSnippet = RawSnippetSchema.safeParse({
      source: "Wikipedia",
      title: "Test Title",
      url: "https://fr.wikipedia.org/wiki/Test",
      snippet: "This is a clean excerpt.",
      timestamp: Date.now(),
    });
    assert(validSnippet.success === true, "RawSnippetSchema passes for valid snippet");
  }

  // --- 3. CACHE MANAGER WITH LRU CAPACITY ---
  console.log("\n🔍 Group 3: Cache Manager & LRU Eviction");
  {
    const testCache = new CacheManager(100, 3); // 100ms TTL, 3 items max capacity
    testCache.set("k1", "val1");
    testCache.set("k2", "val2");
    testCache.set("k3", "val3");

    assert(testCache.get("k1") === "val1", "Cache retrieves stored item k1");

    // Adding 4th item triggers LRU eviction of oldest
    testCache.set("k4", "val4");
    assert(testCache.get("k4") === "val4", "Cache stores new item k4");

    const stats = testCache.getStats();
    assert(stats.activeEntries <= 3, "Cache never exceeds max capacity limit");

    // Test TTL expiration
    await new Promise((r) => setTimeout(r, 120));
    assert(testCache.get("k4") === null, "Cache expires items after TTL");
  }

  // --- 4. TASK QUEUE & RETRY MECHANISM ---
  console.log("\n🔍 Group 4: Task Queue & Rate Limiter");
  {
    const queue = new TaskQueueManager(2, 2, 20); // 2 concurrency, 2 retries, 20ms backoff
    let attempts = 0;
    
    const flakyTask = async () => {
      attempts++;
      if (attempts < 2) {
        throw new Error("Temporary network glitch");
      }
      return "SUCCESS_DATA";
    };

    const result = await queue.enqueue(flakyTask);
    assert(result === "SUCCESS_DATA", "TaskQueue retries failed task and recovers successfully");
    assert(attempts === 2, "TaskQueue executed exactly 2 attempts before success");
  }

  // --- 5. DATA NORMALIZER & METRICS ENGINE ---
  console.log("\n🔍 Group 5: Pipeline Normalizer & Metrics Engine");
  {
    const profile = normalizer.normalizeItemProfile(
      "Tesla Model 3",
      "Automobile",
      {
        source: "Wikipedia",
        title: "Tesla Model 3",
        url: "https://fr.wikipedia.org/wiki/Tesla_Model_3",
        snippet: "La Tesla Model 3 est une berline électrique compacte produite par Tesla.",
        timestamp: Date.now(),
      },
      [
        {
          source: "DuckDuckGo",
          title: "Tesla Model 3 specs",
          url: "https://automobile-propre.com/tesla",
          snippet: "Autonomie WLTP de plus de 500 km avec recharge rapide Superchargeur.",
          timestamp: Date.now(),
        }
      ],
      'fr'
    );

    assert(profile.name === "Tesla Model 3", "Normalizer preserves item name");
    assert(profile.trendScore >= 0 && profile.trendScore <= 100, "Normalizer outputs valid trend score [0, 100]");
    assert(profile.monthlyData.length === 6, "Normalizer produces 6 months of historical data");
    assert(profile.technicalSpecs.length >= 4, "Normalizer produces complete technical specs array");

    // Trends Adapter Determinism
    const metricsA = trendsAdapter.calculateMetrics("Python");
    const metricsA_again = trendsAdapter.calculateMetrics("Python");
    assert(metricsA.trendScore === metricsA_again.trendScore, "TrendsAdapter generates deterministic trend scores for same query");

    // Metrics Calculator
    const profileB = normalizer.normalizeItemProfile("Rust", "Développement", null, []);
    const compMetrics = metricsCalculator.computeComparisonMetrics(profile, profileB, [], []);
    assert(typeof compMetrics.deltaScore === 'number', "MetricsCalculator computes deltaScore");
    assert(compMetrics.averageIndexationScore >= 0, "MetricsCalculator computes valid averageIndexationScore");
  }

  // --- 6. STRUCTURED LOGGER ---
  console.log("\n🔍 Group 6: Structured Observability Logger");
  {
    const testLogger = new StructuredLogger(10);
    testLogger.logExtraction("TermX", "TermY", "direct_web", true, 45, 4);
    const logs = testLogger.getRecentLogs(5);
    assert(logs.length === 1, "Logger records audit extraction");
    assert(logs[0].queryA === "TermX" && logs[0].queryB === "TermY", "Logger stores correct query pair");
    assert(logs[0].durationMs === 45, "Logger records duration");
  }

  console.log("\n==================================================");
  console.log(`🏁 TEST SUITE COMPLETE: ${passedCount} PASSED, ${failedCount} FAILED`);
  console.log("==================================================");

  if (failedCount > 0) {
    process.exit(1);
  }
}

runTestSuite().catch((err) => {
  console.error("Test Suite crashed:", err);
  process.exit(1);
});
