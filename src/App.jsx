import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import Scene1 from './components/Scene1';
import Scene2 from './components/Scene2';
import Scene3 from './components/Scene3';
import Scene4 from './components/Scene4';
import Scene5 from './components/Scene5';
import Scene6 from './components/Scene6';
import Scene7 from './components/Scene7';
import Scene8 from './components/Scene8';
import Scene9 from './components/Scene9';
import { useAudio } from './hooks/useAudio';
import './index.css';
gsap.registerPlugin(ScrollTrigger);
function App() {
  const containerRef = useRef(null);
  const lenisRef = useRef(null); 
  const [currentScene, setCurrentScene] = useState(0);
  const [showFinal, setShowFinal] = useState(false);
  const { playTransition } = useAudio();
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1, 
      smoothWheel: true,
    });
    lenisRef.current = lenis; 
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
      const scenes = gsap.utils.toArray('.scene-container');
      scenes.forEach((scene, index) => {
        gsap.fromTo(scene, 
          { opacity: 0, scale: 0.98 }, 
          { 
            opacity: 1, 
            scale: 1, 
            duration: 1.5, 
            ease: 'power3.out',
            scrollTrigger: {
              trigger: scene,
              start: 'top 80%',
              end: 'top 20%',
              toggleActions: 'play none none reverse',
            }
          }
        );
        ScrollTrigger.create({
          trigger: scene,
          start: 'top center',
          end: 'bottom center',
          onEnter: () => {
            setCurrentScene(index);
            playTransition(); // Audio Hook
          },
          onEnterBack: () => setCurrentScene(index),
        });
      });
    },
     containerRef);
    return () => {
      ctx.revert();
      lenis.destroy(); 
    };
  }, [playTransition]);
  const handleNavClick = (num) => {
    if (lenisRef.current) lenisRef.current.scrollTo(`#scene-${num}`);
  };
  const handleChoice = useCallback((choice) => {
    if (choice === 'enter') {
      setShowFinal(true);
      setTimeout(() => {
        if (lenisRef.current) lenisRef.current.scrollTo('#scene-9');
      }, 100);
    }
  }, []);
  return (
    <div ref={containerRef} className="relative">
      <div className="scanline" />
      <div id="scene-1"><Scene1 active={currentScene === 0} /></div>
      <div id="scene-2"><Scene2 active={currentScene === 1} /></div>
      <div id="scene-3"><Scene3 active={currentScene === 2} /></div>
      <div id="scene-4"><Scene4 active={currentScene === 3} /></div>
      <div id="scene-5"><Scene5 active={currentScene === 4} /></div>
      <div id="scene-6"><Scene6 active={currentScene === 5} /></div>
      <div id="scene-7"><Scene7 active={currentScene === 6} /></div>
      <div id="scene-8"><Scene8 active={currentScene === 7} onChoice={handleChoice} /></div>
      {showFinal && <div id="scene-9"><Scene9 active={true} /></div>}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
          <button
            key={num}
            onClick={() => handleNavClick(num)}
            className={`w-2 h-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 ${currentScene === num - 1 ? 'bg-cyan-400 scale-150' : 'bg-cyan-400/30 hover:bg-cyan-400/60'}`}
            aria-label={`Go to scene ${num}`}
          />
        ))}
      </div>
      {currentScene === 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 text-center">
          <div className="text-xs text-gray-500 mb-2 tracking-widest">SCROLL TO PROCEED</div>
          <div className="w-6 h-10 border border-cyan-400/30 rounded-full mx-auto flex justify-center" style={{ animation: 'pulse 2s infinite' }}>
            <div className="w-1 h-2 bg-cyan-400 rounded-full mt-2" style={{ animation: 'scrollBounce 1.5s infinite' }} />
          </div>
        </div>
      )}
    </div>
  );
}
export default App;