// frontend/src/components/Admin/RuleNode.jsx

import React from 'react';

const RuleNode = ({ data }) => {
  return (
    <div className="p-2 bg-blue-200 rounded border border-blue-400">
      <p>{data.label}</p>
      <button
        onClick={() => data.onDelete(data.id)}
        className="text-red-500 text-sm"
      >
        Delete
      </button>
    </div>
  );
};

export default RuleNode;
