import { useRef, useEffect } from 'react';
import { useCursor } from '../hooks/useCursor';
import { distance, clamp, lerp } from '../utils/helpers';
const Scene7 = ({ active }) => {
  const canvasRef = useRef(null);
  const gridRef = useRef([]);
  const { position, isTouching } = useCursor(); // Added isTouching
  const isDragging = useRef(false);
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
    // Initialize grid if empty
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
    // Mouse Events
    const handleMouseDown = () => { isDragging.current = true; };
    const handleMouseUp = () => { isDragging.current = false; };
    // Touch Events (Mobile Support)
    const handleTouchStart = () => { isDragging.current = true; };
    const handleTouchEnd = () => { isDragging.current = false; };
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseUp);
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchend', handleTouchEnd);
    const draw = () => {
      time += 0.02;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const gridSize = 20;
      gridRef.current.forEach(vertex => {
        const dist = distance(vertex.x, vertex.y, position.x, position.y);
        // Updated interaction logic: Works for Mouse Drag OR Touch
        if ((isDragging.current || isTouching) && dist < 200) {
          const force = (200 - dist) / 200;
          vertex.z = lerp(vertex.z, force * 100, 0.1);
        } else {
          vertex.z = lerp(vertex.z, 0, 0.05);
        }
        vertex.x = vertex.baseX + Math.sin(time + vertex.baseX * 0.01) * 5;
        vertex.y = vertex.baseY + Math.cos(time + vertex.baseY * 0.01) * 5;
      });
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.3)';
      ctx.lineWidth = 1;
      // Draw wireframe rows
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
      // Draw wireframe columns
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
      // Draw vertices
      gridRef.current.forEach(vertex => {
        const brightness = 0.3 + vertex.z * 0.005;
        ctx.fillStyle = `rgba(0, 240, 255, ${clamp(brightness, 0, 1)})`;
        const size = 2 + vertex.z * 0.02;
        ctx.beginPath();
        ctx.arc(vertex.x, vertex.y, Math.max(1, size), 0, Math.PI * 2);
        ctx.fill();
      });
      // Draw cursor glow
      if (isDragging.current || isTouching) {
        const gradient = ctx.createRadialGradient(position.x, position.y, 0, position.x, position.y, 100);
        gradient.addColorStop(0, 'rgba(0, 240, 255, 0.3)');
        gradient.addColorStop(1, 'rgba(0, 240, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(position.x, position.y, 100, 0, Math.PI * 2);
        ctx.fill();
      }
      animationId = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseUp);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };
  }, [position, isTouching]);
  return (
    <div className="scene-container" style={{ background: 'var(--bg-primary)' }}>
      <canvas ref={canvasRef} style={{ cursor: 'crosshair' }} />
      <div className="scene-content flex flex-col justify-center items-center min-h-screen px-8 pointer-events-none">
        <div className="text-center">
          <h2 className="font-display text-2xl md:text-4xl text-cyan-400 mb-4">REALITY STRUCTURE UNLOCKED</h2>
          <p className="text-sm md:text-base text-cyan-400 opacity-60 mb-8">PARAMETERS NOW MODIFIABLE</p>
          <p className="text-xs text-gray-500">Click, drag, or touch to reshape the environment</p>
        </div>
      </div>
    </div>
  );
};
export default Scene7;