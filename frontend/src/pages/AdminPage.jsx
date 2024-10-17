import React, { useEffect, useState } from 'react';
import AttributeButton from '../components/Admin/AttributeButton';
import OperatorButton from '../components/Admin/OperatorButton';
import InteractiveCanvas from '../components/Admin/InteractiveCanvas';
import TextBasedEditor from '../components/Admin/TextBasedEditor';
import EditRuleModal from '../components/Admin/EditRuleModal';
import api from '../api';
import { motion } from 'framer-motion';
import ErrorBoundary from '../components/Shared/ErrorBoundary';

const AdminPage = () => {
  const [rules, setRules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingRule, setEditingRule] = useState(null);
  const [activeTab, setActiveTab] = useState('canvas'); // 'canvas' or 'text'

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      const response = await api.get('/rules');
      if (Array.isArray(response.data)) {
        setRules(response.data);
      } else {
        console.error('Rules data is not an array:', response.data);
        setError('Failed to fetch rules. Invalid data format.');
      }
    } catch (err) {
      console.error('Error fetching rules:', err);
      setError('Failed to fetch rules.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleRuleActive = async (rule_id, currentStatus) => {
    // Optimistically update the rule's active status in the state
    setRules((prevRules) =>
      prevRules.map((rule) =>
        rule.rule_id === rule_id ? { ...rule, active: !currentStatus } : rule
      )
    );
  
    try {
      // Send the PATCH request to the backend to persist the change
      await api.patch(`/rules/${rule_id}/toggle`, {
        active: !currentStatus,
      });
    } catch (err) {
      console.error('Error toggling rule status:', err);
      alert('Failed to toggle rule status.');
  
      // Revert the state if the request fails
      setRules((prevRules) =>
        prevRules.map((rule) =>
          rule.rule_id === rule_id ? { ...rule, active: currentStatus } : rule
        )
      );
    }
  };
  
  

  const handleRuleCreated = (newRule) => {
    setRules((prevRules) => [...prevRules, newRule]);
  };

  const handleRuleUpdated = (updatedRule) => {
    setRules((prevRules) =>
      prevRules.map((rule) =>
        rule.rule_id === updatedRule.rule_id ? updatedRule : rule
      )
    );
    setEditingRule(null); // Close the edit modal
  };

  const handleEditRule = (rule) => {
    setEditingRule(rule);
  };

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
  };

  const handleDeleteRule = async (rule_id) => {
    const confirmed = window.confirm('Are you sure you want to delete this rule?');
    if (!confirmed) return;

    try {
      await api.delete(`/rules/${rule_id}`);
      setRules((prevRules) => prevRules.filter((rule) => rule.rule_id !== rule_id));
      alert('Rule deleted successfully!');
    } catch (err) {
      console.error('Error deleting rule:', err);
      alert('Failed to delete rule.');
    }
  };

  return (
    <ErrorBoundary>
      <motion.div
        className="container mx-auto p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h1 className="text-2xl font-bold mb-4">Admin Portal - Rule Management</h1>
        {/* Tab Buttons */}
        <div className="flex mb-4">
          <button
            onClick={() => handleTabSwitch('canvas')}
            className={`flex-1 px-4 py-2 ${
              activeTab === 'canvas'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            } rounded-l`}
          >
            Use Interactive Canvas
          </button>
          <button
            onClick={() => handleTabSwitch('text')}
            className={`flex-1 px-4 py-2 ${
              activeTab === 'text'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            } rounded-r`}
          >
            Use Text-Based Input
          </button>
        </div>

        {activeTab === 'canvas' ? (
          <InteractiveCanvas onRuleCreated={handleRuleCreated} />
        ) : (
          <TextBasedEditor onRuleCreated={handleRuleCreated} />
        )}

        <h2 className="text-xl font-semibold mt-8 mb-4">Existing Rules</h2>

        {isLoading ? (
          <p>Loading rules...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : rules.length === 0 ? (
          <p>No rules found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rules.map((rule) => (
              <motion.div
                key={rule.rule_id}
                className="p-4 bg-white rounded shadow flex flex-col justify-between"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div>
                  <p className="text-gray-700">
                    <span className="font-semibold">Rule:</span> {rule.ruleString}
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    <span className="font-semibold">Created At:</span>{' '}
                    {new Date(rule.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  {/* Toggle Button */}

                 <label className="relative inline-flex items-center cursor-pointer">
  <input
    type="checkbox"
    checked={rule.active}
    onChange={() => toggleRuleActive(rule.rule_id, rule.active)}
    className="sr-only"
  />
  <div
    className={`w-11 h-6 rounded-full transition-all ${rule.active ? 'bg-green-500' : 'bg-gray-200'}`}
  >
    <div
      className={`absolute w-5 h-5 bg-white rounded-full transition-all transform ${rule.active ? 'translate-x-5' : 'translate-x-0'}`}
    />
  </div>
  <span className="ml-3 text-sm font-medium text-gray-700">
    {rule.active ? 'Active' : 'Inactive'}
  </span>
</label>

                  <button
                    onClick={() => handleEditRule(rule)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteRule(rule.rule_id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Edit Rule Modal */}
        {editingRule && (
          <EditRuleModal
            rule={editingRule}
            onClose={() => setEditingRule(null)}
            onRuleUpdated={handleRuleUpdated}
          />
        )}
      </motion.div>
    </ErrorBoundary>
  );
};

export default AdminPage;
