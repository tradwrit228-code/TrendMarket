/**
 * Rate Limiter and Exponential Backoff Queue Manager
 * Protects external services from rate limits and handles retries gracefully.
 */

interface QueueTask<T> {
  fn: () => Promise<T>;
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason?: any) => void;
  retries: number;
}

export class TaskQueueManager {
  private queue: QueueTask<any>[] = [];
  private activeCount = 0;
  private maxConcurrency: number;
  private maxRetries: number;
  private initialDelayMs: number;

  constructor(maxConcurrency = 4, maxRetries = 3, initialDelayMs = 500) {
    this.maxConcurrency = maxConcurrency;
    this.maxRetries = maxRetries;
    this.initialDelayMs = initialDelayMs;
  }

  public enqueue<T>(taskFn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push({
        fn: taskFn,
        resolve,
        reject,
        retries: 0,
      });
      this.processQueue();
    });
  }

  private async processQueue() {
    if (this.activeCount >= this.maxConcurrency || this.queue.length === 0) {
      return;
    }

    const task = this.queue.shift();
    if (!task) return;

    this.activeCount++;

    try {
      const result = await this.executeWithRetry(task);
      task.resolve(result);
    } catch (err) {
      task.reject(err);
    } finally {
      this.activeCount--;
      this.processQueue();
    }
  }

  private async executeWithRetry<T>(task: QueueTask<T>): Promise<T> {
    try {
      return await task.fn();
    } catch (error) {
      if (task.retries < this.maxRetries) {
        task.retries++;
        const backoffMs = this.initialDelayMs * Math.pow(2, task.retries - 1);
        console.warn(`[TaskQueue] Task failed. Retry ${task.retries}/${this.maxRetries} after ${backoffMs}ms backoff...`);
        await new Promise((r) => setTimeout(r, backoffMs));
        return this.executeWithRetry(task);
      }
      throw error;
    }
  }
}

export const externalApiQueue = new TaskQueueManager(5, 2, 400);
