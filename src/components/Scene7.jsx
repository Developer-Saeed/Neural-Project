import { useRef, useEffect } from 'react';
import { useCursor } from '../hooks/useCursor';
import { distance, clamp, lerp } from '../utils/helpers';
import { useAudio } from '../hooks/useAudio';
const Scene7 = ({ active }) => {
  const canvasRef = useRef(null);
  const gridRef = useRef([]);
  const { position, isTouching } = useCursor();
  const isDragging = useRef(false);
  const ripplesRef = useRef([]); // Hook: Shockwave ripples
  const { playClick } = useAudio();
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let time = 0;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);
    // Initialize grid
    if (gridRef.current.length === 0) {
      const gridSize = 20;
      const spacing = Math.max(canvas.width, canvas.height) / gridSize;
      for (let i = 0; i <= gridSize; i++) {
        for (let j = 0; j <= gridSize; j++) {
          gridRef.current.push({
            baseX: i * spacing,
            baseY: j * spacing,
            x: i * spacing,
            y: j * spacing,
            z: 0
          });
        }
      }
    }
    const handleMouseDown = () => { isDragging.current = true; };
    const handleMouseUp = () => { isDragging.current = false; };
    const handleClick = () => {
      playClick();
      ripplesRef.current.push({ x: position.x, y: position.y, radius: 0, alpha: 1 });
    };
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseUp);
    canvas.addEventListener('click', handleClick); // Hook Interaction
    canvas.addEventListener('touchstart', () => { isDragging.current = true; handleClick(); });
    canvas.addEventListener('touchend', () => { isDragging.current = false; });
    const draw = () => {
      time += 0.02;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const gridSize = 20;
      // Update Ripples
      ripplesRef.current.forEach((ripple, i) => {
        ripple.radius += 10;
        ripple.alpha -= 0.02;
        if (ripple.alpha <= 0) ripplesRef.current.splice(i, 1);
      });
      gridRef.current.forEach(vertex => {
        // Mouse Influence
        const dist = distance(vertex.x, vertex.y, position.x, position.y);
        if ((isDragging.current || isTouching) && dist < 200) {
          const force = (200 - dist) / 200;
          vertex.z = lerp(vertex.z, force * 100, 0.1);
        } else {
          vertex.z = lerp(vertex.z, 0, 0.05);
        }
        // Ripple Influence (The Hook)
        ripplesRef.current.forEach(ripple => {
          const rippleDist = Math.abs(distance(vertex.x, vertex.y, ripple.x, ripple.y) - ripple.radius);
          if (rippleDist < 50) {
            const force = (50 - rippleDist) / 50 * ripple.alpha * 50;
            vertex.z = lerp(vertex.z, force, 0.2);
          }
        });
        vertex.x = vertex.baseX + Math.sin(time + vertex.baseX * 0.01) * 5;
        vertex.y = vertex.baseY + Math.cos(time + vertex.baseY * 0.01) * 5;
      });
      // Drawing Logic (same as before)
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.3)';
      ctx.lineWidth = 1;
      for (let i = 0; i <= gridSize; i++) {
        ctx.beginPath();
        for (let j = 0; j <= gridSize; j++) {
          const idx = i * (gridSize + 1) + j;
          const vertex = gridRef.current[idx];
          if (vertex) {
            if (j === 0) ctx.moveTo(vertex.x, vertex.y);
            else ctx.lineTo(vertex.x, vertex.y);
          }
        }
        ctx.stroke();
      }
      for (let j = 0; j <= gridSize; j++) {
        ctx.beginPath();
        for (let i = 0; i <= gridSize; i++) {
          const idx = i * (gridSize + 1) + j;
          const vertex = gridRef.current[idx];
          if (vertex) {
            if (i === 0) ctx.moveTo(vertex.x, vertex.y);
            else ctx.lineTo(vertex.x, vertex.y);
          }
        }
        ctx.stroke();
      }
      gridRef.current.forEach(vertex => {
        const brightness = 0.3 + vertex.z * 0.005;
        ctx.fillStyle = `rgba(0, 240, 255, ${clamp(brightness, 0, 1)})`;
        const size = 2 + vertex.z * 0.02;
        ctx.beginPath();
        ctx.arc(vertex.x, vertex.y, Math.max(1, size), 0, Math.PI * 2);
        ctx.fill();
      });
      // Draw Ripples Visual
      ripplesRef.current.forEach(ripple => {
        ctx.strokeStyle = `rgba(0, 240, 255, ${ripple.alpha})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
        ctx.stroke();
      });
      animationId = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseUp);
      canvas.removeEventListener('click', handleClick);
    };
  }, [position, isTouching, playClick]);
  return (
    <div className="scene-container" style={{ background: 'var(--bg-primary)' }}>
      <canvas ref={canvasRef} style={{ cursor: 'crosshair' }} />
      <div className="scene-content flex flex-col justify-center items-center min-h-screen px-8 pointer-events-none">
        <div className="text-center">
          <h2 className="font-display text-2xl md:text-4xl text-cyan-400 mb-4">REALITY STRUCTURE UNLOCKED</h2>
          <p className="text-sm md:text-base text-cyan-400 opacity-60 mb-8">PARAMETERS NOW MODIFIABLE</p>
          <p className="text-xs text-gray-500">Click or Tap to send a shockwave</p>
        </div>
      </div>
    </div>
  );
};
export default Scene7;