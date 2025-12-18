import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

export default function MagneticButton({ children, href, className = "" }) {
  const buttonRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const button = buttonRef.current;
    const text = textRef.current;

    // GSAP "gyorsítótárazott" mozgatók a jobb teljesítményért
    const xTo = gsap.quickTo(button, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
    const yTo = gsap.quickTo(button, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });
    
    // A szöveg is mozogjon, de kicsit kevésbé (parallax hatás)
    const textXTo = gsap.quickTo(text, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
    const textYTo = gsap.quickTo(text, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { height, width, left, top } = button.getBoundingClientRect();
      
      const x = clientX - (left + width / 2);
      const y = clientY - (top + height / 2);

      // Mozgatjuk a gombot
      xTo(x * 0.3); // A szorzó (0.3) állítja az "erősséget"
      yTo(y * 0.3);
      
      // Mozgatjuk a szöveget is
      textXTo(x * 0.1);
      textYTo(y * 0.1);
    };

    const handleMouseLeave = () => {
      // Visszapattanás középre
      xTo(0);
      yTo(0);
      textXTo(0);
      textYTo(0);
    };

    button.addEventListener("mousemove", handleMouseMove);
    button.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      button.removeEventListener("mousemove", handleMouseMove);
      button.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // Ha van href, akkor linkként viselkedik, ha nincs, gombként
  const Tag = href ? 'a' : 'button';

  return (
    <Tag 
      ref={buttonRef} 
      href={href} 
      className={`relative inline-flex items-center justify-center cursor-pointer ${className}`}
    >
      <span ref={textRef} className="relative z-10 block pointer-events-none">
        {children}
      </span>
    </Tag>
  );
}