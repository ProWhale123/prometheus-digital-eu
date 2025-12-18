import React, { useState, useEffect } from 'react';

const words = ["Weboldalát.", "Webshopját.", "Digitális Jövőjét."];

export default function Typewriter() {
  const [text, setText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Finomhangolható sebességek (ms)
  const typingSpeed = 100;
  const deletingSpeed = 50;
  const pauseTime = 2000; // Mennyi ideig álljon meg, ha kiírta a szót

  useEffect(() => {
    const currentWord = words[wordIndex];
    
    const effect = setTimeout(() => {
      // Ha épp törlünk
      if (isDeleting) {
        setText(currentWord.substring(0, text.length - 1));
        // Ha elfogyott a szó, jöhet a következő
        if (text.length === 0) {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % words.length);
        }
      } 
      // Ha épp írunk
      else {
        setText(currentWord.substring(0, text.length + 1));
        // Ha kész a szó, tartsunk szünetet, majd kezdjük törölni
        if (text.length === currentWord.length) {
          // Itt egy kis trükk: a timeoutot állítjuk át hosszabbra
          setTimeout(() => setIsDeleting(true), pauseTime); 
          return; 
        }
      }
    }, isDeleting ? deletingSpeed : typingSpeed);

    return () => clearTimeout(effect);
  }, [text, isDeleting, wordIndex]);

  return (
    <span className="inline-block min-h-[1.2em]">
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300">
        {text}
      </span>
      <span className="animate-pulse text-sky-400">|</span>
    </span>
  );
}