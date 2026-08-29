import { CompareData } from '../schemas/comparison';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  lastAccessed: number;
  ttlMs: number;
  hits: number;
  tag?: string;
}

export class CacheManager {
  private cache = new Map<string, CacheEntry<any>>();
  private defaultTtlMs: number;
  private maxEntries: number;

  constructor(defaultTtlMs = 60 * 60 * 1000, maxEntries = 500) {
    this.defaultTtlMs = defaultTtlMs;
    this.maxEntries = maxEntries;
  }

  public get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > entry.ttlMs) {
      this.cache.delete(key);
      return null;
    }

    entry.hits++;
    entry.lastAccessed = now;
    return entry.data as T;
  }

  public set<T>(key: string, data: T, ttlMs?: number, tag?: string): void {
    const now = Date.now();

    // Enforce capacity bounds with LRU eviction
    if (this.cache.size >= this.maxEntries && !this.cache.has(key)) {
      this.evictOldest();
    }

    this.cache.set(key, {
      data,
      timestamp: now,
      lastAccessed: now,
      ttlMs: ttlMs || this.defaultTtlMs,
      hits: 0,
      tag,
    });
  }

  private evictOldest(): void {
    const now = Date.now();
    let oldestKey: string | null = null;
    let oldestTime = Infinity;

    // First pass: remove any expired items
    for (const [k, v] of this.cache.entries()) {
      if (now - v.timestamp > v.ttlMs) {
        this.cache.delete(k);
        return;
      }
      if (v.lastAccessed < oldestTime) {
        oldestTime = v.lastAccessed;
        oldestKey = k;
      }
    }

    // If none were expired, remove the least recently accessed item
    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  public invalidateTag(tag: string): number {
    let count = 0;
    for (const [key, entry] of this.cache.entries()) {
      if (entry.tag === tag) {
        this.cache.delete(key);
        count++;
      }
    }
    return count;
  }

  public clear(): void {
    this.cache.clear();
  }

  public getStats() {
    let totalHits = 0;
    let validKeys = 0;
    const now = Date.now();

    for (const entry of this.cache.values()) {
      if (now - entry.timestamp <= entry.ttlMs) {
        validKeys++;
        totalHits += entry.hits;
      }
    }

    return {
      activeEntries: validKeys,
      maxCapacity: this.maxEntries,
      totalHits,
      memoryUsageEstimateKb: Math.round(this.cache.size * 2.5),
    };
  }
}

export const cacheManager = new CacheManager(2 * 60 * 60 * 1000, 500); // 2 hours TTL, 500 items max
