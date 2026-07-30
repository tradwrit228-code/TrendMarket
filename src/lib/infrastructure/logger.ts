import { AuditLog, AuditLogSchema } from '../schemas/comparison';

class StructuredLogger {
  private logs: AuditLog[] = [];
  private maxLogs = 200;

  public logExtraction(
    queryA: string,
    queryB: string,
    mode: string,
    success: boolean,
    durationMs: number,
    sourcesCount: number,
    error?: string
  ): AuditLog {
    const logEntry: AuditLog = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
      queryA,
      queryB,
      mode,
      success,
      durationMs,
      sourcesFetchedCount: sourcesCount,
      error,
    };

    // Validate log schema
    const parsed = AuditLogSchema.safeParse(logEntry);
    if (parsed.success) {
      this.logs.unshift(parsed.data);
      if (this.logs.length > this.maxLogs) {
        this.logs.pop();
      }
    }

    const level = success ? 'INFO' : 'WARN';
    console.log(`[${level}] [${new Date().toISOString()}] Compare Request: "${queryA}" vs "${queryB}" | Mode: ${mode} | ${durationMs}ms | Sources: ${sourcesCount}${error ? ` | Error: ${error}` : ''}`);

    return logEntry;
  }

  public getRecentLogs(): AuditLog[] {
    return [...this.logs];
  }

  public getStats() {
    const total = this.logs.length;
    if (total === 0) return { total: 0, successRate: 100, avgDurationMs: 0 };
    const successCount = this.logs.filter(l => l.success).length;
    const avgDuration = Math.round(this.logs.reduce((acc, l) => acc + l.durationMs, 0) / total);
    return {
      total,
      successRate: Math.round((successCount / total) * 100),
      avgDurationMs: avgDuration,
    };
  }
}

export const logger = new StructuredLogger();
