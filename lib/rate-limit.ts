import { Redis } from '@upstash/redis';

// Initialize Redis from environment variables
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const WHITELIST = ['liudalao2003@gmail.com', 'floydboyd1975@gmail.com'];
const MAX_REQUESTS = 5;

export async function checkRateLimit(identifier: string) {
  // God Mode: Check whitelist
  if (WHITELIST.includes(identifier)) {
    return { success: true, limit: 1000, remaining: 1000, reset: 0 };
  }

  const key = `ratelimit:${identifier}`;
  const count = await redis.incr(key);

  if (count > MAX_REQUESTS) {
    return { success: false, limit: MAX_REQUESTS, remaining: 0, reset: 0 };
  }

  return { success: true, limit: MAX_REQUESTS, remaining: MAX_REQUESTS - count, reset: 0 };
}
