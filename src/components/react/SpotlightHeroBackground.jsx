import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function SpotlightHeroBackground() {
  const containerRef = useRef(null);
  const lightRef = useRef(null);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    const light = lightRef.current;

    if (!container || !light) return;

    // Gyorsabb, reszponzívabb követés (0.8 helyett 0.5)
    const xTo = gsap.quickTo(light, "x", { duration: 0.5, ease: "power2.out" });
    const yTo = gsap.quickTo(light, "y", { duration: 0.5, ease: "power2.out" });

    const handleMouseMove = (e) => {
      // 800px-es fénykör fele = 400
      xTo(e.clientX - 400); 
      yTo(e.clientY - 400);
      if (opacity === 0) setOpacity(1);
    };

    const handleMouseLeave = () => {
        setOpacity(0);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [opacity]);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 overflow-hidden pointer-events-none z-10"
      // JAVÍTVA: 'screen' mód, hogy átüssön a sötétségen!
      style={{ mixBlendMode: 'screen' }} 
    >
      <div
        ref={lightRef}
        className="absolute rounded-full transition-opacity duration-300"
        style={{
          top: 0,
          left: 0,
          width: '700px', // Kicsit kisebb, koncentráltabb fény
          height: '700px',
          opacity: opacity,
          // JAVÍTVA: Sokkal erősebb színek (0.8 opacity a közepén)
          background: 'radial-gradient(circle, rgba(14, 165, 233, 0.8) 0%, rgba(56, 189, 248, 0.4) 40%, transparent 70%)',
          // JAVÍTVA: Kisebb blur, hogy ne vesszen el a részlet
          filter: 'blur(60px)', 
        }}
      />
    </div>
  );
}