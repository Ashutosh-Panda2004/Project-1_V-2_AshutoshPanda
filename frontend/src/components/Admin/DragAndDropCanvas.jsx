// frontend/src/components/Admin/DragAndDropCanvas.jsx

import React, { useState, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import { v4 as uuidv4 } from 'uuid';
import api from '../../api';
import { motion } from 'framer-motion';

const DragAndDropCanvas = ({ onRuleCreated }) => {
  const [conditionsContainer1, setConditionsContainer1] = useState([]);
  const [conditionsContainer2, setConditionsContainer2] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // Handle dropping items
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ['ATTRIBUTE', 'OPERATOR'],
    drop: (item, monitor) => {
      if (item.attribute && item.condition) {
        // Determine which container to add to
        if (conditionsContainer1.length <= conditionsContainer2.length) {
          setConditionsContainer1((prev) => [...prev, { ...item.condition, attribute: item.attribute, id: uuidv4() }]);
        } else {
          setConditionsContainer2((prev) => [...prev, { ...item.condition, attribute: item.attribute, id: uuidv4() }]);
        }
      } else if (item.operator) {
        // Handle operators between conditions if needed
        // For simplicity, we're using a fixed AND operator between containers
        // Additional logic can be added here
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  // Listen for 'addCondition' event dispatched from AttributeButton
  useEffect(() => {
    const handleAddCondition = (event) => {
      const { attribute, condition } = event.detail;
      // Determine which container to add to
      if (conditionsContainer1.length <= conditionsContainer2.length) {
        setConditionsContainer1((prev) => [...prev, { ...condition, attribute, id: uuidv4() }]);
      } else {
        setConditionsContainer2((prev) => [...prev, { ...condition, attribute, id: uuidv4() }]);
      }
    };

    const handleClearCanvas = () => {
      setConditionsContainer1([]);
      setConditionsContainer2([]);
    };

    window.addEventListener('addCondition', handleAddCondition);
    window.addEventListener('clearCanvas', handleClearCanvas);

    return () => {
      window.removeEventListener('addCondition', handleAddCondition);
      window.removeEventListener('clearCanvas', handleClearCanvas);
    };
  }, [conditionsContainer1.length, conditionsContainer2.length]);

  const generateRuleString = () => {
    // Generate rule string in the format:
    // (attribute1 operator1 value1 AND attribute2 operator2 value2) AND (attribute3 operator3 value3 AND ...)
    const buildCondition = (conditions) => {
      return conditions.map((cond) => `${cond.attribute} ${cond.operator} ${isNaN(cond.value) ? `'${cond.value}'` : cond.value}`).join(' AND ');
    };

    const conditionSet1 = buildCondition(conditionsContainer1);
    const conditionSet2 = buildCondition(conditionsContainer2);

    let ruleStr = '';
    if (conditionSet1) {
      ruleStr += `(${conditionSet1})`;
    }
    if (conditionSet2) {
      ruleStr += ` AND (${conditionSet2})`;
    }
    return ruleStr.trim();
  };

  const handleSaveRule = async () => {
    const ruleString = generateRuleString();
    if (!ruleString) {
      alert('Rule string is empty. Please build a rule.');
      return;
    }

    setIsSaving(true);
    try {
      const response = await api.post('/rules/create', {
        ruleString,
      });
      alert('Rule saved successfully!');
      // Notify AdminPage to add the new rule to the state
      onRuleCreated(response.data.rule);
      // Clear the canvas after saving
      setConditionsContainer1([]);
      setConditionsContainer2([]);
    } catch (err) {
      console.error('Error saving rule:', err);
      setError('Failed to save rule.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <div
        ref={drop}
        className={`w-full min-h-64 p-4 border-dashed border-2 rounded ${
          isOver ? 'bg-gray-100' : 'bg-white'
        }`}
      >
        {conditionsContainer1.length === 0 && conditionsContainer2.length === 0 ? (
          <p className="text-gray-500">Drag and drop attributes here to build a rule.</p>
        ) : (
          <div className="flex flex-col">
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Condition Set 1</h3>
              <div className="flex flex-wrap">
                {conditionsContainer1.map((cond) => (
                  <motion.div
                    key={cond.id}
                    className="m-1 px-2 py-1 bg-blue-100 rounded"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {`${cond.attribute} ${cond.operator} ${isNaN(cond.value) ? `'${cond.value}'` : cond.value}`}
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="flex items-center mb-4">
              <span className="font-semibold mx-2">AND</span>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Condition Set 2</h3>
              <div className="flex flex-wrap">
                {conditionsContainer2.map((cond) => (
                  <motion.div
                    key={cond.id}
                    className="m-1 px-2 py-1 bg-green-100 rounded"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {`${cond.attribute} ${cond.operator} ${isNaN(cond.value) ? `'${cond.value}'` : cond.value}`}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <button
        onClick={handleSaveRule}
        disabled={isSaving || (conditionsContainer1.length === 0 && conditionsContainer2.length === 0)}
        className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
      >
        {isSaving ? 'Saving...' : 'Save Rule'}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default DragAndDropCanvas;
