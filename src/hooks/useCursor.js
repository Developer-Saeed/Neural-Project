import { useState, useEffect, useRef } from 'react';
export const useCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const lastPos = useRef({ x: 0, y: 0 });
  const lastTime = useRef(Date.now());
  const [isTouching, setIsTouching] = useState(false);
  useEffect(() => {
    const handleMove = (x, y) => {
      const now = Date.now();
      const dt = now - lastTime.current;
      if (dt > 0) {
        setVelocity({
          x: (x - lastPos.current.x) / dt,
          y: (y - lastPos.current.y) / dt
        });
      }
      lastPos.current = { x, y };
      lastTime.current = now;
      setPosition({ x, y });
    };
    const handleMouseMove = (e) => handleMove(e.clientX, e.clientY);
    const handleTouchMove = (e) => {
      if (e.touches.length > 0) handleMove(e.touches[0].clientX, e.touches[0].clientY);
    };
    const handleTouchStart = () => setIsTouching(true);
    const handleTouchEnd = () => setIsTouching(false);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);
  return { position, velocity, isTouching };
};