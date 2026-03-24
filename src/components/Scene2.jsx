import { useRef, useEffect } from 'react';
import { useCursor } from '../hooks/useCursor';
import { Node } from '../utils/NodeClass';
import { distance } from '../utils/helper';

const Scene2 = ({ active }) => {
  const canvasRef = useRef(null);
  const nodesRef = useRef([]);
  const { position } = useCursor();
  
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); let animationId;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize(); window.addEventListener('resize', resize);
    if (nodesRef.current.length === 0) { for (let i = 0; i < 100; i++) nodesRef.current.push(new Node(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 2 + 1)); }
    
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const fogGradient = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 0, canvas.width/2, canvas.height/2, canvas.width * 0.7);
      fogGradient.addColorStop(0, 'rgba(13, 17, 23, 0)'); fogGradient.addColorStop(1, 'rgba(13, 17, 23, 0.5)');
      ctx.fillStyle = fogGradient; ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      nodesRef.current.forEach(node => { node.update(position.x, position.y, 150); node.draw(ctx); });
      ctx.lineWidth = 0.5;
      nodesRef.current.forEach((node, i) => { nodesRef.current.slice(i + 1).forEach(other => { const dist = distance(node.x, node.y, other.x, other.y); if (dist < 80) { ctx.strokeStyle = `rgba(0, 240, 255, ${(80 - dist) / 80 * 0.3})`; ctx.beginPath(); ctx.moveTo(node.x, node.y); ctx.lineTo(other.x, other.y); ctx.stroke(); } }); });
      nodesRef.current.forEach(node => { const dist = distance(node.x, node.y, position.x, position.y); if (dist < 200) { const alpha = (200 - dist) / 200; ctx.strokeStyle = `rgba(0, 240, 255, ${alpha * 0.5})`; ctx.lineWidth = alpha * 2; ctx.beginPath(); ctx.moveTo(node.x, node.y); ctx.lineTo(position.x, position.y); ctx.stroke(); } });
      animationId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animationId); window.removeEventListener('resize', resize); };
  }, [position]);

  const texts = ['Mapping attention vector', 'Reading motion signature', 'Preparing conversion layer'];
  return (
    <div className="scene-container" style={{ background: 'linear-gradient(180deg, #05070A 0%, #0D1117 100%)' }}>
      <canvas ref={canvasRef} />
      <div className="scene-content flex flex-col justify-center items-center min-h-screen px-8">
        <div className="space-y-4 font-display text-center">
          {texts.map((text, i) => (<p key={i} className="text-sm md:text-base text-cyan-400" style={{ animation: active ? `pulse 2s infinite ${i * 0.3}s` : 'none' }}>{text}</p>))}
        </div>
      </div>
    </div>
  );
};
export default Scene2;