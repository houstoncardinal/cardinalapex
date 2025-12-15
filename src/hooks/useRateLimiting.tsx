import { useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  warningThreshold?: number;
}

interface RateLimitState {
  isLimited: boolean;
  remainingRequests: number;
  resetTime: number | null;
}

export const useRateLimiting = (config: RateLimitConfig) => {
  const { maxRequests, windowMs, warningThreshold = Math.floor(maxRequests * 0.2) } = config;
  
  const requestTimestamps = useRef<number[]>([]);
  const [state, setState] = useState<RateLimitState>({
    isLimited: false,
    remainingRequests: maxRequests,
    resetTime: null,
  });

  const cleanupOldRequests = useCallback(() => {
    const now = Date.now();
    const cutoff = now - windowMs;
    requestTimestamps.current = requestTimestamps.current.filter(ts => ts > cutoff);
  }, [windowMs]);

  const checkRateLimit = useCallback((): boolean => {
    cleanupOldRequests();
    
    const currentCount = requestTimestamps.current.length;
    const remaining = Math.max(0, maxRequests - currentCount);
    
    if (currentCount >= maxRequests) {
      const oldestRequest = Math.min(...requestTimestamps.current);
      const resetTime = oldestRequest + windowMs;
      
      setState({
        isLimited: true,
        remainingRequests: 0,
        resetTime,
      });
      
      const secondsUntilReset = Math.ceil((resetTime - Date.now()) / 1000);
      toast.error(`Rate limit exceeded. Please wait ${secondsUntilReset} seconds.`);
      return false;
    }
    
    // Warning when approaching limit
    if (remaining <= warningThreshold && remaining > 0) {
      toast.warning(`${remaining} trade${remaining === 1 ? '' : 's'} remaining in this window.`);
    }
    
    setState({
      isLimited: false,
      remainingRequests: remaining,
      resetTime: null,
    });
    
    return true;
  }, [cleanupOldRequests, maxRequests, windowMs, warningThreshold]);

  const recordRequest = useCallback(() => {
    requestTimestamps.current.push(Date.now());
    cleanupOldRequests();
    
    const remaining = Math.max(0, maxRequests - requestTimestamps.current.length);
    setState(prev => ({
      ...prev,
      remainingRequests: remaining,
    }));
  }, [cleanupOldRequests, maxRequests]);

  const executeWithRateLimit = useCallback(async <T,>(
    fn: () => Promise<T>
  ): Promise<T | null> => {
    if (!checkRateLimit()) {
      return null;
    }
    
    recordRequest();
    return await fn();
  }, [checkRateLimit, recordRequest]);

  const getRateLimitInfo = useCallback(() => {
    cleanupOldRequests();
    return {
      currentRequests: requestTimestamps.current.length,
      maxRequests,
      windowMs,
      remainingRequests: Math.max(0, maxRequests - requestTimestamps.current.length),
    };
  }, [cleanupOldRequests, maxRequests, windowMs]);

  return {
    ...state,
    checkRateLimit,
    recordRequest,
    executeWithRateLimit,
    getRateLimitInfo,
  };
};

// Pre-configured rate limiters for different use cases
export const useTradingRateLimit = () => useRateLimiting({
  maxRequests: 5,
  windowMs: 60 * 1000, // 5 trades per minute
  warningThreshold: 2,
});

export const useSwapRateLimit = () => useRateLimiting({
  maxRequests: 10,
  windowMs: 60 * 1000, // 10 swaps per minute
  warningThreshold: 3,
});
