// // frontend/src/components/Shared/Navbar.jsx

// import React from 'react';
// import { Link } from 'react-router-dom';

// const Navbar = () => (
//   <nav className="bg-blue-600 text-white p-4">
//     <div className="container mx-auto flex justify-between items-center">
//       <Link to="/" className="text-lg font-bold">
//         Rule Engine
//       </Link>
//       <div>
//         <Link to="/" className="mx-2 hover:underline">
//           User Portal
//         </Link>
//         <Link to="/admin" className="mx-2 hover:underline">
//           Admin Portal
//         </Link>
//       </div>
//     </div>
//   </nav>
// );

// export default Navbar;













// // frontend/src/components/Shared/Navbar.jsx

// import React from 'react';
// import { Link } from 'react-router-dom';
// import { motion } from 'framer-motion';

// const Navbar = () => (
//   <motion.nav
//     className="bg-blue-600 text-white p-4"
//     initial={{ y: -50 }}
//     animate={{ y: 0 }}
//     transition={{ duration: 0.5 }}
//   >
//     <div className="container mx-auto flex justify-between items-center">
//       <Link to="/" className="text-lg font-bold">
//         Rule Engine
//       </Link>
//       <div>
//         <Link to="/" className="mx-2 hover:underline">
//           User Portal
//         </Link>
//         <Link to="/admin" className="mx-2 hover:underline">
//           Admin Portal
//         </Link>
//       </div>
//     </div>
//   </motion.nav>
// );

// export default Navbar;


// frontend/src/components/Shared/Navbar.jsx

import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo or Brand Name */}
        <Link to="/" className="text-white text-lg font-bold">
          Rule Engine Admin
        </Link>

        {/* Navigation Links */}
        <div className="flex space-x-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? 'text-white font-semibold'
                : 'text-blue-200 hover:text-white'
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              isActive
                ? 'text-white font-semibold'
                : 'text-blue-200 hover:text-white'
            }
          >
            Admin Portal
          </NavLink>
          <NavLink
            to="/user"
            className={({ isActive }) =>
              isActive
                ? 'text-white font-semibold'
                : 'text-blue-200 hover:text-white'
            }
          >
            User Portal
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
