import { useRef, useEffect } from 'react';
import { useCursor } from '../hooks/useCursor';
import { Node } from '../utils/NodeClass';
import { distance } from '../utils/helper';

const Scene4 = ({ active }) => {
  const canvasRef = useRef(null); const nodesRef = useRef([]); const { position } = useCursor();
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return; const ctx = canvas.getContext('2d'); let animationId;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }; resize(); window.addEventListener('resize', resize);
    if (nodesRef.current.length === 0) { for (let i = 0; i < 200; i++) nodesRef.current.push(new Node(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 2 + 1)); }
    const draw = () => { ctx.fillStyle = 'rgba(5, 7, 10, 0.1)'; ctx.fillRect(0, 0, canvas.width, canvas.height); nodesRef.current.forEach(node => { node.update(position.x, position.y, 180); node.draw(ctx); }); ctx.lineWidth = 0.5; nodesRef.current.forEach((node, i) => { nodesRef.current.slice(i + 1).forEach(other => { const dist = distance(node.x, node.y, other.x, other.y); if (dist < 60) { ctx.strokeStyle = `rgba(0, 240, 255, ${(60 - dist) / 60 * 0.2})`; ctx.beginPath(); ctx.moveTo(node.x, node.y); ctx.lineTo(other.x, other.y); ctx.stroke(); } }); }); nodesRef.current.forEach(node => { const dist = distance(node.x, node.y, position.x, position.y); if (dist < 250) { const alpha = (250 - dist) / 250; ctx.strokeStyle = `rgba(0, 240, 255, ${alpha * 0.4})`; ctx.lineWidth = alpha * 3; ctx.beginPath(); ctx.moveTo(node.x, node.y); ctx.lineTo(position.x, position.y); ctx.stroke(); } }); animationId = requestAnimationFrame(draw); };
    draw(); return () => { cancelAnimationFrame(animationId); window.removeEventListener('resize', resize); };
  }, [position]);
  const texts = ['Connection density increasing', 'External awareness expanding', 'Parallel presence forming'];
  return (<div className="scene-container" style={{ background: 'var(--bg-primary)' }}><canvas ref={canvasRef} /><div className="scene-content flex flex-col justify-center items-center min-h-screen px-8"><div className="text-center mb-16"><h2 className="font-display text-2xl md:text-4xl text-cyan-400 mb-4">NEURAL MESH ACTIVE</h2></div><div className="space-y-6 text-center">{texts.map((text, i) => (<p key={i} className="text-sm md:text-base text-cyan-400" style={{ animation: active ? `fadeIn 0.5s ease-out ${i * 0.4}s forwards` : 'none' }}>{text}</p>))}</div></div></div>);
};
export default Scene4;