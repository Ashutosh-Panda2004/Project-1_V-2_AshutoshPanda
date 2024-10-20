<<<<<<< HEAD
=======
// frontend/src/pages/HomePage.jsx

>>>>>>> fb0e3a61e3405c6721c17503976864f77f6e24f3
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';

const HomePage = () => {
  const navigate = useNavigate();
  const mainRef = useRef(null);
  const contentRef = useRef(null);
  const circleRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Stagger animation for all content elements
      gsap.from(contentRef.current.children, {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
      });

      // Continuous animation for the background circle
      gsap.to(circleRef.current, {
        scale: 1.5,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      // Subtle hover animation for buttons
      gsap.utils.toArray('.btn').forEach(btn => {
        gsap.to(btn, {
          scale: 1.05,
          duration: 0.3,
          paused: true,
          ease: 'power2.out',
        }).pause();
      });
    }, mainRef);

    return () => ctx.revert();
  }, []);

  const goToAdmin = () => {
    navigate('/admin');
  };

  const goToUser = () => {
    navigate('/user');
  };

  return (
    <div ref={mainRef} className="bg-black text-white min-h-screen overflow-hidden relative flex items-center justify-center">
      <div ref={contentRef} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        <h1 className="text-5xl sm:text-7xl font-bold mb-6 tracking-tight">
          Rule Engine
          <br />
          Admin Portal
        </h1>
        <p className="text-xl sm:text-2xl mb-12 max-w-2xl mx-auto">
          Empower your decision-making process with our advanced rule engine. Streamline operations and enhance efficiency.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
          <button
            onClick={goToAdmin}
            className="btn px-8 py-4 bg-white text-black rounded-full hover:bg-opacity-90 transition duration-300 text-lg font-semibold"
            onMouseEnter={(e) => gsap.to(e.target, { scale: 1.05, duration: 0.3 })}
            onMouseLeave={(e) => gsap.to(e.target, { scale: 1, duration: 0.3 })}
          >
            Go to Admin Portal
          </button>
          <button
            onClick={goToUser}
            className="btn px-8 py-4 bg-transparent border-2 border-white rounded-full hover:bg-white hover:text-black transition duration-300 text-lg font-semibold"
            onMouseEnter={(e) => gsap.to(e.target, { scale: 1.05, duration: 0.3 })}
            onMouseLeave={(e) => gsap.to(e.target, { scale: 1, duration: 0.3 })}
          >
            Go to User Portal
          </button>
        </div>
      </div>
      <div
        ref={circleRef}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-purple-500 to-pink-500 rounded-full filter blur-3xl opacity-20"
      ></div>
<<<<<<< HEAD
      
=======
>>>>>>> fb0e3a61e3405c6721c17503976864f77f6e24f3
    </div>
  );
};

export default HomePage;












