// frontend/src/components/Admin/ContainerNode.jsx

import React, { useState, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import { motion } from 'framer-motion';

const ContainerNode = ({ id, data }) => {
  const { name, onChangeName, onDelete } = data;
  const [currentName, setCurrentName] = useState(name || 'Container');
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentName.trim() === '') {
      setError('Container name is required.');
    } else {
      setError('');
      onChangeName(id, currentName.trim());
    }
  }, [currentName, id, onChangeName]);

  const handleNameChange = (e) => {
    setCurrentName(e.target.value);
  };

  return (
    <motion.div
      className={`p-4 bg-yellow-200 border border-yellow-400 rounded shadow-lg`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      layout
    >
      <div className="flex justify-between items-center mb-2">
        <input
          type="text"
          className={`p-1 border rounded w-full ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
          value={currentName}
          onChange={handleNameChange}
          placeholder="Container Name"
        />
        <button
          onClick={() => onDelete(id)}
          className="ml-2 text-red-500 text-sm"
        >
          Delete
        </button>
      </div>
      {error && <span className="text-red-500 text-sm">{error}</span>}
      {/* Children Nodes will be rendered here by React Flow */}
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </motion.div>
  );
};

export default ContainerNode;
