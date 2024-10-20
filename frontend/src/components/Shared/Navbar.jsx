import React, { useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';

const Navbar = () => {
  const navRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(navRef.current, {
        y: -50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      });

      gsap.utils.toArray('.nav-link').forEach(link => {
        gsap.to(link, {
          scale: 1.1,
          duration: 0.3,
          paused: true,
          ease: 'power2.out',
        }).pause();
      });
    }, navRef);

    return () => ctx.revert();
  }, []);

  return (
    <nav ref={navRef} className="bg-black text-white p-4 fixed w-full top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          Rule Engine Admin
        </Link>

        <div className="flex space-x-6">
          {['/', '/admin', '/user'].map((path) => (
            <NavLink
              key={path}
              to={path}
              className={`nav-link text-lg ${
                location.pathname === path
                  ? 'text-white font-semibold'
                  : 'text-gray-400 hover:text-white'
              } transition duration-300`}
              onMouseEnter={(e) => gsap.to(e.target, { scale: 1.1, duration: 0.3 })}
              onMouseLeave={(e) => gsap.to(e.target, { scale: 1, duration: 0.3 })}
            >
              {path === '/' ? 'Home' : path.slice(1).charAt(0).toUpperCase() + path.slice(2) + ' Portal'}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;