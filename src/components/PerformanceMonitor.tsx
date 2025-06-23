import { useEffect } from 'react';
import { monitorMemoryUsage } from '@/utils/performanceOptimizations';

export const PerformanceMonitor = () => {
  useEffect(() => {
    // Monitor performance in development
    if (process.env.NODE_ENV === 'development') {
      const interval = setInterval(() => {
        monitorMemoryUsage();
      }, 30000); // Check every 30 seconds

      return () => clearInterval(interval);
    }
  }, []);

  useEffect(() => {
    // Report long tasks (blocking main thread for >50ms)
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.duration > 50) {
            console.warn(`Long task detected: ${entry.duration}ms`);
          }
        });
      });
      
      try {
        observer.observe({ entryTypes: ['longtask'] });
      } catch (e) {
        // longtask not supported in all browsers
      }

      return () => observer.disconnect();
    }
  }, []);

  return null; // This component doesn't render anything
};
