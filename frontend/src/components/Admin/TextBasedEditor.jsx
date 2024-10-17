import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../api';
import jsep from 'jsep';

const TextBasedEditor = ({ onRuleCreated }) => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [validationError, setValidationError] = useState('');

  const ruleString = watch('ruleString', '');

  // Real-time validation
  const validateRule = (value) => {
    try {
      jsep(value); // Attempt to parse the rule string to check syntax
      setValidationError('');
      return true;
    } catch (err) {
      setValidationError('Invalid rule syntax.');
      return false;
    }
  };

  const onSubmit = async (data) => {
    const { ruleString } = data;
  
    if (!ruleString || ruleString.trim() === '') {
      alert('Rule string cannot be empty.');
      return;
    }
  
    try {
      const response = await api.post('/rules/create', {
        ruleString, // Ensure this is non-empty and valid
      });
      alert('Rule saved successfully!');
      onRuleCreated(response.data.rule);
    } catch (err) {
      console.error('Error saving rule:', err);
      alert('Failed to save rule.');
    }
  };
  

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Enter Rule:</label>
          <textarea
            {...register('ruleString', { required: true, validate: validateRule })}
            className={`w-full p-2 border rounded ${
              validationError ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="e.g., (age > 30 && salary > 20000 && department == 'Finance' && experience > 2)"
            rows={5}
          ></textarea>
          {errors.ruleString && errors.ruleString.type === 'required' && (
            <p className="text-red-500 text-sm mt-1">Rule string is required.</p>
          )}
          {validationError && (
            <p className="text-red-500 text-sm mt-1">{validationError}</p>
          )}
        </div>
        <button
          type="submit"
          className={`px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 ${
            validationError ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={!!validationError}
        >
          Save Rule
        </button>
      </form>
    </div>
  );
};

export default TextBasedEditor;
