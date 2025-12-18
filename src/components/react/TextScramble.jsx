import React, { useEffect, useState, useRef } from 'react';

const chars = "!<>-_\\/[]{}—=+*^?#________";

export default function TextScramble({ text, className }) {
  const [display, setDisplay] = useState(text);
  const elementRef = useRef(null);

  useEffect(() => {
    let iteration = 0;
    let interval = null;

    const startScramble = () => {
      clearInterval(interval);
      interval = setInterval(() => {
        setDisplay(prev => 
          text
            .split("")
            .map((letter, index) => {
              if (index < iteration) {
                return text[index];
              }
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join("")
        );

        if (iteration >= text.length) {
          clearInterval(interval);
        }

        iteration += 1 / 3; // Sebesség
      }, 30);
    };

    // Intersection Observer: Csak akkor indul, ha látszik
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        startScramble();
        observer.disconnect();
      }
    });

    if (elementRef.current) observer.observe(elementRef.current);

    return () => clearInterval(interval);
  }, [text]);

  return <span ref={elementRef} className={className}>{display}</span>;
}