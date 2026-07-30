import { CompareData } from '../schemas/comparison';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttlMs: number;
  hits: number;
  tag?: string;
}

export class CacheManager {
  private cache = new Map<string, CacheEntry<any>>();
  private defaultTtlMs: number;

  constructor(defaultTtlMs = 60 * 60 * 1000) { // 1 hour default
    this.defaultTtlMs = defaultTtlMs;
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
    return entry.data as T;
  }

  public set<T>(key: string, data: T, ttlMs?: number, tag?: string): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttlMs: ttlMs || this.defaultTtlMs,
      hits: 0,
      tag,
    });
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
      size: validKeys,
      totalEntriesEver: this.cache.size,
      totalHits,
    };
  }
}

export const cacheManager = new CacheManager(2 * 60 * 60 * 1000); // 2 hours
