// frontend/src/components/Admin/RuleValidationModal.jsx

import React from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // For accessibility

const RuleValidationModal = ({ children, onClose, onSave }) => {
  return (
    <Modal
      isOpen={true}
      onRequestClose={onClose}
      contentLabel="Set Condition"
      className="max-w-md mx-auto mt-20 bg-white p-6 rounded shadow-lg outline-none"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
    >
      <div>{children}</div>
      <div className="flex justify-end mt-4">
        <button
          onClick={onClose}
          className="px-4 py-2 mr-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Save
        </button>
      </div>
    </Modal>
  );
};

export default RuleValidationModal;
