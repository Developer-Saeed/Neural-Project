import { useCallback, useRef } from 'react';
export const useAudio = () => {
  const audioContextRef = useRef(null);
  const getContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);
  const playTone = useCallback((frequency = 440, type = 'sine', duration = 0.1, volume = 0.1) => {
    const ctx = getContext();
    if (ctx.state === 'suspended') ctx.resume(); // Browsers block auto-play
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  }, [getContext]);
  const playClick = useCallback(() => playTone(800, 'square', 0.05, 0.05), [playTone]);
  const playHover = useCallback(() => playTone(600, 'sine', 0.08, 0.03), [playTone]);
  const playTransition = useCallback(() => playTone(200, 'triangle', 0.5, 0.1), [playTone]);
  return { playClick, playHover, playTransition };
};