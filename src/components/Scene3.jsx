import { useRef, useEffect } from 'react';
import { useCursor } from '../hooks/useCursor';
import { distance } from '../utils/helper';
const layers = ['PHYSICAL', 'SOCIAL', 'DATA', 'SIGNAL', 'EDITABLE'];

const Scene3 = ({ active }) => {
  const canvasRef = useRef(null); const nodesRef = useRef([]); const { position } = useCursor();
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return; const ctx = canvas.getContext('2d'); let animationId; let time = 0;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }; resize(); window.addEventListener('resize', resize);
    if (nodesRef.current.length === 0) { layers.forEach((_, layerIndex) => { const layerNodes = []; for (let i = 0; i < 15; i++) layerNodes.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, layer: layerIndex, radius: Math.random() * 3 + 2, phase: Math.random() * Math.PI * 2 }); nodesRef.current.push(layerNodes); }); }
    const draw = () => { time += 0.02; ctx.clearRect(0, 0, canvas.width, canvas.height); layers.forEach((_, layerIndex) => { const yOffset = Math.sin(time + layerIndex * 0.5) * 10; const layerAlpha = 0.3 + layerIndex * 0.1; ctx.strokeStyle = `rgba(0, 240, 255, ${layerAlpha * 0.2})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, canvas.height * (0.2 + layerIndex * 0.15) + yOffset); ctx.lineTo(canvas.width, canvas.height * (0.2 + layerIndex * 0.15) + yOffset); ctx.stroke(); nodesRef.current[layerIndex]?.forEach(node => { const nodeY = node.y + yOffset + Math.sin(time + node.phase) * 5; const dist = distance(node.x, nodeY, position.x, position.y); const glow = dist < 100 ? (100 - dist) / 100 : 0; if (glow > 0.1) { const gradient = ctx.createRadialGradient(node.x, nodeY, 0, node.x, nodeY, 20); gradient.addColorStop(0, `rgba(0, 240, 255, ${glow * 0.5})`); gradient.addColorStop(1, 'rgba(0, 240, 255, 0)'); ctx.fillStyle = gradient; ctx.beginPath(); ctx.arc(node.x, nodeY, 20, 0, Math.PI * 2); ctx.fill(); } ctx.fillStyle = `rgba(0, 240, 255, ${layerAlpha + glow * 0.5})`; ctx.beginPath(); ctx.arc(node.x, nodeY, node.radius, 0, Math.PI * 2); ctx.fill(); }); }); animationId = requestAnimationFrame(draw); };
    draw(); return () => { cancelAnimationFrame(animationId); window.removeEventListener('resize', resize); };
  }, [position]);

  return (
    <div className="scene-container" style={{ background: 'var(--bg-primary)' }}>
      <canvas ref={canvasRef} />
      <div className="scene-content flex flex-col justify-center items-center min-h-screen px-8">
        <div className="text-center mb-12"><h2 className="font-display text-2xl md:text-4xl text-cyan-400 mb-2">REALITY LAYERS DETECTED</h2><p className="text-sm text-gray-500">Each layer represents a dimension of perception</p></div>
        <div className="space-y-8">{layers.map((layer, i) => (<div key={layer} className="flex items-center gap-6 opacity-0" style={{ animation: active ? `fadeIn 0.5s ease-out ${i * 0.2}s forwards` : 'none' }}><div className="w-3 h-3 rounded-full" style={{ background: `rgba(0, 240, 255, ${0.3 + i * 0.15})`, boxShadow: `0 0 20px rgba(0, 240, 255, ${0.3 + i * 0.15})` }} /><span className="font-display text-lg md:text-xl tracking-widest">{layer}</span></div>))}</div>
      </div>
    </div>
  );
};
export default Scene3;