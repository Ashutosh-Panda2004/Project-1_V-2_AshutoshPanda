// frontend/src/components/Admin/AttributeButton.jsx

import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import { motion } from 'framer-motion';
import RuleValidationModal from './RuleValidationModal';

const AttributeButton = ({ attribute }) => {
  const [showModal, setShowModal] = useState(false);
  const [condition, setCondition] = useState({ operator: '', value: '' });

  // Disable dragging until condition is set
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'ATTRIBUTE',
    item: { attribute, condition },
    canDrag: false, // Disable drag initially
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const openModal = () => setShowModal(true);
  const closeModal = () => {
    setShowModal(false);
    setCondition({ operator: '', value: '' });
  };

  const handleSaveCondition = () => {
    if (!condition.operator || !condition.value) {
      alert('Please specify both operator and value.');
      return;
    }
    setShowModal(false);
    // Dispatch an event to add the condition to the canvas
    window.dispatchEvent(
      new CustomEvent('addCondition', { detail: { attribute, condition } })
    );
    setCondition({ operator: '', value: '' });
  };

  return (
    <>
      <motion.div
        ref={drag}
        className={`p-2 bg-blue-500 text-white rounded cursor-pointer m-1 flex justify-between items-center ${
          isDragging ? 'opacity-50' : 'opacity-100'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={openModal} // Open modal on click
      >
        <span>{attribute}</span>
        <span className="text-xs">↕️</span>
      </motion.div>

      {showModal && (
        <RuleValidationModal onClose={closeModal} onSave={handleSaveCondition}>
          <h2 className="text-lg font-bold mb-4">Set Condition for "{attribute}"</h2>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Operator:</label>
            <select
              value={condition.operator}
              onChange={(e) => setCondition({ ...condition, operator: e.target.value })}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Operator</option>
              <option value=">">Greater Than (&gt;)</option>
              <option value="<">Less Than (&lt;)</option>
              <option value="==">Equal To (==)</option>
              <option value="!=">Not Equal To (!=)</option>
              <option value=">=">Greater Than or Equal To (&gt;=)</option>
              <option value="<=">Less Than or Equal To (&lt;=)</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Value:</label>
            <input
              type="text"
              value={condition.value}
              onChange={(e) => setCondition({ ...condition, value: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="Enter value"
            />
          </div>
        </RuleValidationModal>
      )}
    </>
  );
};

export default AttributeButton;
