import { useState, useEffect, useRef } from 'react';
export const useCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const lastPos = useRef({ x: 0, y: 0 });
  const lastTime = useRef(Date.now());
  useEffect(() => {
    const handleMouseMove = (e) => {
      const now = Date.now();
      const dt = now - lastTime.current;
      if (dt > 0) {
        setVelocity({
          x: (e.clientX - lastPos.current.x) / dt,
          y: (e.clientY - lastPos.current.y) / dt
        });
      }
      lastPos.current = { x: e.clientX, y: e.clientY };
      lastTime.current = now;
      setPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  return { position, velocity };
};