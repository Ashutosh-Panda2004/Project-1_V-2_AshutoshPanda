// frontend/src/components/Admin/OperatorNode.jsx

import React from 'react';
import { Handle, Position } from 'reactflow';
import { motion } from 'framer-motion';

const OperatorNode = ({ data }) => {
  return (
    <motion.div
      className={`p-2 bg-green-200 border border-green-400 rounded shadow-lg text-center`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      layout
    >
      {data.label}
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </motion.div>
  );
};

export default OperatorNode;
