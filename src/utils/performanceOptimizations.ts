import { debounce, throttle } from 'lodash';

// Request throttling to prevent overwhelming the server
export const createThrottledRequest = <T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 300
): T => {
  return throttle(fn, delay, { leading: true, trailing: true }) as T;
};

// Debounced search to reduce API calls
export const createDebouncedSearch = <T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 500
): T => {
  return debounce(fn, delay) as T;
};

// Image lazy loading observer
export const createIntersectionObserver = (callback: (entries: IntersectionObserverEntry[]) => void) => {
  return new IntersectionObserver(callback, {
    rootMargin: '50px',
    threshold: 0.1
  });
};

// Preload critical resources
export const preloadCriticalResources = () => {
  const criticalImages = [
    '/uploads/pic1.png',
    '/uploads/pic2.png',
    '/logo.png'
  ];

  criticalImages.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
};

// Memory usage monitoring
export const monitorMemoryUsage = () => {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    console.log('Memory Usage:', {
      used: Math.round(memory.usedJSHeapSize / 1048576) + ' MB',
      total: Math.round(memory.totalJSHeapSize / 1048576) + ' MB',
      limit: Math.round(memory.jsHeapSizeLimit / 1048576) + ' MB'
    });
  }
};

// Connection type detection for adaptive loading
export const getConnectionSpeed = (): 'slow' | 'fast' => {
  const connection = (navigator as any).connection;
  if (!connection) return 'fast';
  
  const slowConnections = ['slow-2g', '2g', '3g'];
  return slowConnections.includes(connection.effectiveType) ? 'slow' : 'fast';
};

// Adaptive image quality based on connection
export const getOptimalImageQuality = (): number => {
  const connectionSpeed = getConnectionSpeed();
  return connectionSpeed === 'slow' ? 60 : 85;
};
