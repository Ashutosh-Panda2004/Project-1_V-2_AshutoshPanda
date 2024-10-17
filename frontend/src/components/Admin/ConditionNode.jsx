// frontend/src/components/Admin/ConditionNode.jsx

import React, { useState, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import { motion } from 'framer-motion';

const ConditionNode = ({ id, data }) => {
  const { label, operator, value, subtype, onChangeOperator, onChangeValue, onDelete } = data;

  const [currentOperator, setCurrentOperator] = useState(operator || '>');
  const [currentValue, setCurrentValue] = useState(value || '');
  const [error, setError] = useState('');

  useEffect(() => {
    // Validate and update parent component on value change
    if (subtype === 'number') {
      if (currentValue === '') {
        setError('Value is required.');
      } else if (!/^\d+$/.test(currentValue)) {
        setError('Please enter a valid number.');
      } else {
        setError('');
        onChangeValue(id, currentValue);
      }
    } else if (subtype === 'string') {
      if (currentValue.trim() === '') {
        setError('Value is required.');
      } else {
        const lowercased = currentValue.toLowerCase();
        setCurrentValue(lowercased);
        setError('');
        onChangeValue(id, lowercased);
      }
    }
  }, [currentValue, subtype, id, onChangeValue]);

  const handleOperatorChange = (e) => {
    const newOperator = e.target.value;
    setCurrentOperator(newOperator);
    onChangeOperator(id, newOperator);
  };

  const handleValueChange = (e) => {
    setCurrentValue(e.target.value);
  };

  return (
    <motion.div
      className={`p-3 bg-blue-100 border border-blue-300 rounded shadow-lg`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      layout
    >
      <div className="flex flex-col">
        <span className="font-semibold">{label}</span>
        <div className="flex items-center mt-1">
          <select
            className="mr-2 p-1 border rounded"
            value={currentOperator}
            onChange={handleOperatorChange}
          >
            {subtype === 'number' ? (
              <>
                <option value=">">&gt;</option>
                <option value="<">&lt;</option>
                <option value="=">=</option>
                <option value="!=">!=</option>
                <option value="≥">≥</option>
                <option value="≤">≤</option>
              </>
            ) : (
              <>
                <option value="=">=</option>
                <option value="!=">!=</option>
              </>
            )}
          </select>
          <input
            type={subtype === 'number' ? 'number' : 'text'}
            className={`p-1 border rounded ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
            value={currentValue}
            onChange={handleValueChange}
            placeholder="Value"
          />
        </div>
        {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
        <button
          onClick={() => onDelete(id)}
          className="self-end text-red-500 text-sm mt-1"
        >
          Delete
        </button>
      </div>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </motion.div>
  );
};

export default ConditionNode;
