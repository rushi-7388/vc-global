import { useState, useRef, useEffect } from 'react';
import { createIntersectionObserver, getOptimalImageQuality } from '@/utils/performanceOptimizations';
import { cn } from '@/lib/utils';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export const LazyImage = ({ 
  src, 
  alt, 
  className, 
  placeholder = '/placeholder.svg',
  onLoad,
  onError 
}: LazyImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = createIntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(entry.target);
        }
      });
    });

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  const imageQuality = getOptimalImageQuality();
  const optimizedSrc = src.includes('unsplash.com') 
    ? `${src}&q=${imageQuality}&auto=format&fit=crop`
    : src;

  return (
    <div ref={imgRef} className={cn("relative overflow-hidden", className)}>
      {/* Placeholder while loading */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <span className="text-gray-400 text-sm">Loading...</span>
        </div>
      )}
      
      {/* Actual image */}
      {isInView && (
        <img
          src={hasError ? placeholder : optimizedSrc}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            "transition-opacity duration-300",
            isLoaded ? "opacity-100" : "opacity-0",
            className
          )}
          loading="lazy"
        />
      )}
    </div>
  );
};
