// frontend/src/components/Admin/OperatorButton.jsx

import React from 'react';
import { useDrag } from 'react-dnd';
import { motion } from 'framer-motion';

const OperatorButton = ({ operator }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'OPERATOR',
    item: { operator },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <motion.div
      ref={drag}
      className={`p-2 bg-green-500 text-white rounded cursor-pointer m-1 ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {operator}
    </motion.div>
  );
};

export default OperatorButton;
