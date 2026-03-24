import { useRef, useEffect } from 'react';
import { useCursor } from '../hooks/useCursor';

const Scene1 = ({ active }) => {
  const canvasRef = useRef(null);
  const nodesRef = useRef([]);
  const cursorTrail = useRef([]);
  const { position } = useCursor();
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);
    
    if (nodesRef.current.length === 0) {
      for (let i = 0; i < 30; i++) nodesRef.current.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, radius: Math.random() * 1.5 + 0.5, alpha: Math.random() * 0.5 + 0.2 });
    }
    
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.1)'; ctx.lineWidth = 0.5;
      const spacing = 80;
      for (let x = 0; x < canvas.width; x += spacing) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke(); }
      for (let y = 0; y < canvas.height; y += spacing) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke(); }
      
      nodesRef.current.forEach(node => { ctx.fillStyle = `rgba(0, 240, 255, ${node.alpha})`; ctx.beginPath(); ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2); ctx.fill(); });
      
      if (active) {
        cursorTrail.current.push({ ...position, time: Date.now() });
        cursorTrail.current = cursorTrail.current.filter(p => Date.now() - p.time < 500);
        if (cursorTrail.current.length > 1) { ctx.beginPath(); ctx.moveTo(cursorTrail.current[0].x, cursorTrail.current[0].y); cursorTrail.current.forEach((point) => { ctx.lineTo(point.x, point.y); }); ctx.strokeStyle = 'rgba(0, 240, 255, 0.6)'; ctx.lineWidth = 2; ctx.stroke(); }
        const gradient = ctx.createRadialGradient(position.x, position.y, 0, position.x, position.y, 30);
        gradient.addColorStop(0, 'rgba(0, 240, 255, 0.8)'); gradient.addColorStop(1, 'rgba(0, 240, 255, 0)');
        ctx.fillStyle = gradient; ctx.beginPath(); ctx.arc(position.x, position.y, 30, 0, Math.PI * 2); ctx.fill();
      }
      animationId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animationId); window.removeEventListener('resize', resize); };
  }, [active, position]);

  return (
    <div className="scene-container" style={{ background: 'var(--bg-primary)' }}>
      <canvas ref={canvasRef} />
      <div className="scene-content flex flex-col justify-center items-center min-h-screen px-8">
        <div className="max-w-2xl">
          <div className="mb-4 text-xs tracking-widest text-cyan-400 opacity-60">NEURAL ACCESS PROTOCOL v2.7.1</div>
          <div className="space-y-3 font-display">
            <p className="text-lg md:text-xl text-cyan-400 animate-pulse">CLASSIFIED NETWORK DETECTED</p>
            <p className="text-lg md:text-xl text-cyan-400 animate-pulse">BIOLOGICAL USER VERIFIED</p>
            <p className="text-lg md:text-xl text-cyan-400 animate-pulse">ACCESS LEVEL: OBSERVER</p>
            <p className="text-lg md:text-xl text-red-400 animate-pulse">UPGRADE REQUIRED</p>
          </div>
          <div className="mt-12 text-sm text-gray-500">Scroll to begin neural synchronization</div>
        </div>
      </div>
    </div>
  );
};
export default Scene1;