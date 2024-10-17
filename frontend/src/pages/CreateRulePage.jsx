// frontend/src/pages/CreateRulePage.jsx

import React from 'react';
import InteractiveCanvas from '../components/Admin/InteractiveCanvas';
import TextBasedEditor from '../components/Admin/TextBasedEditor';
import { useState } from 'react';
import { motion } from 'framer-motion';

const CreateRulePage = () => {
  const [activeTab, setActiveTab] = useState('canvas'); // 'canvas' or 'text'

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create a New Rule</h1>
      {/* Tab Buttons */}
      <div className="flex mb-4">
        <button
          onClick={() => setActiveTab('canvas')}
          className={`flex-1 px-4 py-2 ${
            activeTab === 'canvas'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700'
          } rounded-l`}
        >
          Use Interactive Canvas
        </button>
        <button
          onClick={() => setActiveTab('text')}
          className={`flex-1 px-4 py-2 ${
            activeTab === 'text'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700'
          } rounded-r`}
        >
          Use Text-Based Input
        </button>
      </div>

      {/* Conditional Rendering Based on Active Tab */}
      {activeTab === 'canvas' ? (
        <InteractiveCanvas />
      ) : (
        <TextBasedEditor />
      )}
    </div>
  );
};

export default CreateRulePage;
