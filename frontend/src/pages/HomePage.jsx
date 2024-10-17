// frontend/src/pages/HomePage.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  const goToAdmin = () => {
    navigate('/admin');
  };

  const goToUser = () => {
    navigate('/user');
  };

  return (
    <div className="flex flex-col items-center justify-center h-[80vh]">
      <h1 className="text-4xl font-bold mb-8">Welcome to the Rule Engine Admin Portal</h1>
      <div className="flex space-x-4">
        <button
          onClick={goToAdmin}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Go to Admin Portal
        </button>
        <button
          onClick={goToUser}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
        >
          Go to User Portal
        </button>
      </div>
    </div>
  );
};

export default HomePage;
