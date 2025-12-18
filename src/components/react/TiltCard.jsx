import React from 'react';
import Tilt from 'react-parallax-tilt';

export default function TiltCard({ children, className }) {
  return (
    <Tilt
      tiltMaxAngleX={5}      // Max dőlésszög (ne legyen túl nagy, mert szédítő)
      tiltMaxAngleY={5}
      perspective={1000}     // 3D mélység
      scale={1.02}           // Kicsit nagyítson rá hoverkor
      transitionSpeed={1000} // Milyen gyorsan álljon vissza
      glareEnable={true}     // Fénycsillanás bekapcsolása
      glareMaxOpacity={0.15} // Fénycsillanás erőssége (finom)
      glarePosition="all"    // A fény mindenhol látszódjon
      glareBorderRadius="1rem" // Ha a kártyád széle kerekített
      className={className}  // Hogy kívülről is tudjuk stílusozni (pl. h-full)
    >
      {children}
    </Tilt>
  );
}