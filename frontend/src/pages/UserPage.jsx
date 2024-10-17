// // frontend/src/pages/UserPage.jsx

// import React, { useState } from 'react';
// import InputForm from '../components/User/InputForm';
// import EvaluationResult from '../components/User/EvaluationResult';

// const UserPage = () => {
//   const [evaluationResult, setEvaluationResult] = useState(null);

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">User Portal - Check Eligibility</h1>
//       <InputForm setEvaluationResult={setEvaluationResult} />
//       {evaluationResult !== null && (
//         <EvaluationResult result={evaluationResult} />
//       )}
//     </div>
//   );
// };

// export default UserPage;



















// frontend/src/pages/UserPage.jsx

import React, { useState } from 'react';
import InputForm from '../components/User/InputForm';
import EvaluationResult from '../components/User/EvaluationResult';
import { motion } from 'framer-motion';

const UserPage = () => {
  const [evaluationResult, setEvaluationResult] = useState(null);

  return (
    <motion.div
      className="container mx-auto p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-2xl font-bold mb-4">User Portal - Check Eligibility</h1>
      <InputForm setEvaluationResult={setEvaluationResult} />
      {evaluationResult !== null && (
        <EvaluationResult result={evaluationResult} />
      )}
    </motion.div>
  );
};

export default UserPage;
