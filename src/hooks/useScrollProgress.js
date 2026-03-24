import { useState, useEffect } from 'react';
import { clamp } from '../utils/helpers';
export const useScrollProgress = () => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentProgress = scrollHeight > 0 ? window.scrollY / scrollHeight : 0;
      setProgress(clamp(currentProgress, 0, 1));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return progress;
};