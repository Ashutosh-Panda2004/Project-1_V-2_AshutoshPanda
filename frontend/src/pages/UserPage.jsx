// frontend/src/pages/UserPage.jsx

import React, { useState, useEffect, useRef } from 'react';
import InputForm from '../components/User/InputForm';
import EvaluationResult from '../components/User/EvaluationResult';
import { gsap } from 'gsap';

const UserPage = () => {
  const [evaluationResult, setEvaluationResult] = useState(null);
  const mainRef = useRef(null);
  const headerRef = useRef(null);
  const formRef = useRef(null);
  const resultRef = useRef(null);
  const footerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header Animation
      gsap.from(headerRef.current, {
        y: -50,
        opacity: 0,
        duration: 1,
        ease: 'bounce.out',
      });

      // Main Content Animation
      gsap.from(formRef.current.children, {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
      });

      // Evaluation Result Animation
      if (evaluationResult) {
        gsap.from(resultRef.current, {
          scale: 0.8,
          opacity: 0,
          duration: 0.5,
          ease: 'power3.out',
        });
      }

      // Footer Animation
      gsap.from(footerRef.current, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      });

      // Button Hover Animations
      gsap.utils.toArray('.btn').forEach((btn) => {
        const tl = gsap.timeline({ paused: true });
        tl.to(btn, { scale: 1.05, duration: 0.3, ease: 'power2.out' });
        btn.addEventListener('mouseenter', () => tl.play());
        btn.addEventListener('mouseleave', () => tl.reverse());
      });
    }, mainRef);

    return () => ctx.revert();
  }, [evaluationResult]);

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* Header */}
      <header ref={headerRef} className="bg-gray-800 shadow">
        <div className="container mt-14 mx-auto px-6 py-4 flex items-center">
          {/* Left Spacer */}
          <div className="flex-1"></div>

          {/* Centered Title */}
          <h1 className="text-3xl font-bold text-center">
            User Portal - Check Eligibility
          </h1>

          {/* Dark Mode Toggle */}
          <div className="flex-1 flex justify-end">
            <DarkModeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main ref={mainRef} className="flex-grow container mx-auto px-6 py-12">
        <div ref={formRef} className="max-w-2xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 text-center">Enter Your Details</h2>
          <InputForm setEvaluationResult={setEvaluationResult} />
        </div>

        {/* Evaluation Result */}
        {evaluationResult !== null && (
          <div ref={resultRef} className="mt-12 max-w-2xl mx-auto">
            <EvaluationResult result={evaluationResult} />
          </div>
        )}
      </main>

    
    </div>
  );
};

// Dark Mode Toggle Component
const DarkModeToggle = () => {
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center bg-gray-700 p-2 rounded-full focus:outline-none hover:bg-gray-600 transition-colors duration-200"
      aria-label="Toggle Dark Mode"
    >
      {isDark ? (
        // Sun Icon for Light Mode
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-yellow-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m8.66-9h-1M4.34 12h-1m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.02 0l-.707-.707M6.343 6.343l-.707-.707M12 5a7 7 0 100 14 7 7 0 000-14z"
          />
        </svg>
      ) : (
        // Moon Icon for Dark Mode
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-gray-200"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z"
          />
        </svg>
      )}
    </button>
  );
};

export default UserPage;
