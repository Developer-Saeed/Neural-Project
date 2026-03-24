import { useRef, useEffect } from 'react';
import { useCursor } from '../hooks/useCursor';
import { distance } from '../utils/helpers';
import { useAudio } from '../hooks/useAudio';
const Scene8 = ({ active, onChoice }) => {
  const canvasRef = useRef(null); 
  const { position } = useCursor();
  const { playClick } = useAudio();
  useEffect(() => {
    const canvas = canvasRef.current; 
    if (!canvas) return; 
    const ctx = canvas.getContext('2d'); 
    let animationId; let time = 0;
    const resize = () => { 
      canvas.width = window.innerWidth; 
      canvas.height = window.innerHeight; 
    }; 
    resize(); 
    window.addEventListener('resize', resize);
    // Dynamic portals for mobile vs desktop
    const isMobile = window.innerWidth < 768;
    const portals = [
      { x: canvas.width * (isMobile ? 0.5 : 0.35), y: canvas.height * (isMobile ? 0.35 : 0.5), label: 'RETURN', radius: isMobile ? 60 : 80 },
      { x: canvas.width * (isMobile ? 0.5 : 0.65), y: canvas.height * (isMobile ? 0.65 : 0.5), label: 'ENTER', radius: isMobile ? 60 : 80 }
    ];
    const draw = () => { 
      time += 0.02; 
      ctx.clearRect(0, 0, canvas.width, canvas.height); 
      // Background Lines
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.2)'; ctx.lineWidth = 1; 
      ctx.beginPath(); ctx.moveTo(0, canvas.height * 0.7); ctx.lineTo(canvas.width, canvas.height * 0.7); ctx.stroke(); 
      portals.forEach((portal, i) => { 
        const dist = distance(portal.x, portal.y, position.x, position.y); 
        const isHovered = dist < portal.radius; 
        const pulse = Math.sin(time * 2) * 10; 
        // Glow
        const gradient = ctx.createRadialGradient(portal.x, portal.y, 0, portal.x, portal.y, portal.radius + pulse); 
        gradient.addColorStop(0, isHovered ? 'rgba(0, 240, 255, 0.4)' : 'rgba(0, 240, 255, 0.2)'); 
        gradient.addColorStop(0.7, isHovered ? 'rgba(0, 240, 255, 0.2)' : 'rgba(0, 240, 255, 0.1)'); 
        gradient.addColorStop(1, 'rgba(0, 240, 255, 0)'); 
        ctx.fillStyle = gradient; 
        ctx.beginPath(); ctx.arc(portal.x, portal.y, portal.radius + pulse, 0, Math.PI * 2); ctx.fill(); 
        // Ring
        ctx.strokeStyle = isHovered ? 'rgba(0, 240, 255, 0.8)' : 'rgba(0, 240, 255, 0.4)'; 
        ctx.lineWidth = 2; 
        ctx.beginPath(); ctx.arc(portal.x, portal.y, portal.radius, 0, Math.PI * 2); ctx.stroke(); 
        ctx.beginPath(); ctx.arc(portal.x, portal.y, portal.radius * 0.7, 0, Math.PI * 2); ctx.stroke(); 
        // Text
        ctx.font = `${isMobile ? 14 : 16}px "Orbitron"`; 
        ctx.fillStyle = isHovered ? 'rgba(0, 240, 255, 1)' : 'rgba(0, 240, 255, 0.6)'; 
        ctx.textAlign = 'center'; 
        ctx.fillText(portal.label, portal.x, portal.y + 5); 
        ctx.font = '10px "JetBrains Mono"'; 
        ctx.fillStyle = 'rgba(0, 240, 255, 0.4)'; 
        ctx.fillText(i === 0 ? 'STATIC REALITY' : 'EDITABLE LAYER', portal.x, portal.y + 120); 
      }); 
      animationId = requestAnimationFrame(draw); 
    };
    draw(); 
    return () => { cancelAnimationFrame(animationId); window.removeEventListener('resize', resize); };
  }, [position]);
  const handleButtonClick = (choice) => {
    playClick();
    onChoice?.(choice);
  }
  return (
  <div className="scene-container" style={{ background: 'var(--bg-primary)' }}>
    <canvas ref={canvasRef} />
    <div className="scene-content flex flex-col justify-center items-center min-h-screen px-8">
      <div className="text-center mb-16">
        <h2 className="font-display text-2xl md:text-4xl text-cyan-400 mb-4">AUTHORIZATION REQUIRED</h2>
        <p className="text-sm text-gray-500">Choose your path forward</p>
      </div>
      <div className="flex flex-col md:flex-row gap-8 md:gap-16 w-full max-w-2xl justify-center items-center">
        <button 
          onClick={() => handleButtonClick('return')} 
          className="font-display px-8 py-4 w-full md:w-auto border border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
        >
          RETURN TO STATIC REALITY
        </button>
        <button 
          onClick={() => handleButtonClick('enter')} 
          className="font-display px-8 py-4 w-full md:w-auto bg-cyan-400/20 border border-cyan-400 text-cyan-400 hover:bg-cyan-400/30 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
        >
          ENTER EDITABLE LAYER
        </button>
      </div>
    </div>
  </div>
  );
};
export default Scene8;