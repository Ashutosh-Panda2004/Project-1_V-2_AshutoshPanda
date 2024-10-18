// // frontend/src/components/Shared/Footer.jsx

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const footerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(footerRef.current, {
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top bottom",
          end: "bottom bottom",
          scrub: 1,
        },
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out',
      });
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="bg-black text-white p-8 mt-16">
      <div className="container mx-auto text-center">
        <div className="mb-4">
          <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Rule Engine Admin
          </span>
        </div>
        <p className="text-gray-400 mb-4">
          Empowering your decision-making process with advanced rule management.
        </p>
        <div className="text-sm text-gray-500">
          © {new Date().getFullYear()} Rule Engine Admin. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
