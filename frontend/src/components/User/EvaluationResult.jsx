import React from 'react';
import { motion } from 'framer-motion';

const EvaluationResult = ({ result }) => {
  return (
    <motion.div
      className={`mt-8 p-6 rounded shadow text-center ${
        result ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {result ? (
        <h2 className="text-2xl font-bold">Congratulations! You are eligible.</h2>
      ) : (
        <h2 className="text-2xl font-bold">Sorry, you are not eligible.</h2>
      )}
    </motion.div>
  );
};

export default EvaluationResult;
