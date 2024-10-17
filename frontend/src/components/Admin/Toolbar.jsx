import React from 'react';
import { useDrag } from 'react-dnd';

const ToolbarItem = ({ type, label, subtype }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type,
    item: { type, label, subtype },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`p-2 m-2 bg-gray-200 rounded cursor-grab ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
    >
      {label}
    </div>
  );
};

const ToolbarButton = ({ label, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="p-2 m-2 bg-yellow-500 text-white rounded cursor-pointer hover:bg-yellow-600"
    >
      {label}
    </div>
  );
};

const Toolbar = ({ startDrawingContainer }) => {
  return (
    <div className="w-60 p-4 bg-white shadow-md rounded overflow-auto">
      <h3 className="text-lg font-semibold mb-4">Attributes</h3>
      <ToolbarItem type="ATTRIBUTE" label="Age" subtype="number" />
      <ToolbarItem type="ATTRIBUTE" label="Salary" subtype="number" />
      <ToolbarItem type="ATTRIBUTE" label="Department" subtype="string" />
      <ToolbarItem type="ATTRIBUTE" label="Experience" subtype="number" />
      <ToolbarItem type="ATTRIBUTE" label="Location" subtype="string" />
      <ToolbarItem type="ATTRIBUTE" label="Role" subtype="string" />

      <h3 className="text-lg font-semibold mt-6 mb-4">Operators</h3>
      <ToolbarItem type="OPERATOR" label="AND" />
      <ToolbarItem type="OPERATOR" label="OR" />

    </div>
  );
};

export default Toolbar;
