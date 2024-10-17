// // frontend/src/components/Shared/Footer.jsx

// import React from 'react';

// const Footer = () => (
//   <footer className="bg-gray-800 text-white p-4">
//     <div className="container mx-auto text-center">
//       &copy; {new Date().getFullYear()} Rule Engine. All rights reserved.
//     </div>
//   </footer>
// );

// export default Footer;















// // frontend/src/components/Shared/Footer.jsx

// import React from 'react';
// import { motion } from 'framer-motion';

// const Footer = () => (
//   <motion.footer
//     className="bg-gray-800 text-white p-4 mt-8"
//     initial={{ opacity: 0 }}
//     animate={{ opacity: 1 }}
//     transition={{ duration: 0.5 }}
//   >
//     <div className="container mx-auto text-center">
//       &copy; {new Date().getFullYear()} Rule Engine. All rights reserved.
//     </div>
//   </motion.footer>
// );

// export default Footer;








// frontend/src/components/Shared/Footer.jsx

import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 p-4 mt-8">
      <div className="container mx-auto text-center text-gray-400">
        © {new Date().getFullYear()} Rule Engine Admin. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
