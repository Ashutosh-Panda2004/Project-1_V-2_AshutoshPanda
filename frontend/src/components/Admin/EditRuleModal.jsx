// frontend/src/components/Admin/EditRuleModal.jsx

import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { useForm } from 'react-hook-form';
import api from '../../api';
import jsep from 'jsep';

Modal.setAppElement('#root'); // For accessibility

const EditRuleModal = ({ rule, onClose, onRuleUpdated }) => {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      ruleString: rule.ruleString,
    },
  });
  const [validationError, setValidationError] = useState('');

  const ruleString = watch('ruleString', rule.ruleString);

  // Real-time validation
// Generate rule string from nodes and edges
const generateRuleString = () => {
  const buildRule = (nodeId) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return '';

    if (node.type === 'condition') {
      const value = node.data.subtype === 'string' ? `'${node.data.value}'` : node.data.value;
      return `${node.data.label} ${node.data.operator} ${value}`;
    }

    if (node.type === 'operator') {
      return node.data.label;
    }

    if (node.type === 'container') {
      const containerConditions = edges
        .filter((e) => e.source === node.id)
        .map((e) => buildRule(e.target))
        .filter(Boolean)
        .join(' '); // Ensures space between AND/OR and conditions

      return `(${containerConditions})`; // Wrap the conditions in parentheses
    }

    return '';
  };

  // Start building the rule string from root nodes
  const rootNodes = nodes.filter((node) => !node.parentNode);
  const ruleParts = rootNodes.map((node) => buildRule(node.id)).filter(Boolean);
  const ruleString = ruleParts.join(' '); // Join with spaces for AND/OR linking

  return ruleString;
};


  useEffect(() => {
    setValue('ruleString', rule.ruleString);
  }, [rule, setValue]);

  const onSubmit = async (data) => {
    const { ruleString } = data;
    if (validationError) {
      alert('Please fix validation errors before saving.');
      return;
    }

    try {
      const response = await api.patch(`/rules/${rule.rule_id}/update`, {
        ruleString,
      });
      alert('Rule updated successfully!');
      onRuleUpdated(response.data.rule);
    } catch (err) {
      console.error('Error updating rule:', err);
      alert('Failed to update rule.');
    }
  };

  return (
    <Modal
      isOpen={true}
      onRequestClose={onClose}
      contentLabel="Edit Rule"
      className="max-w-lg mx-auto mt-20 bg-white p-6 rounded shadow-lg outline-none"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
    >
      <h2 className="text-xl font-bold mb-4">Edit Rule</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Rule String:</label>
          <textarea
            {...register('ruleString', { required: true, validate: validateRule })}
            className={`w-full p-2 border rounded ${
              validationError ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="e.g., ((age > 30 AND salary > 20000 AND department = 'Finance' AND experience > 2) AND (location = 'New York' AND role = 'Manager'))"
            rows={5}
          ></textarea>
          {errors.ruleString && errors.ruleString.type === 'required' && (
            <p className="text-red-500 text-sm mt-1">Rule string is required.</p>
          )}
          {validationError && (
            <p className="text-red-500 text-sm mt-1">{validationError}</p>
          )}
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 mr-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${
              validationError ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={!!validationError}
          >
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditRuleModal;
