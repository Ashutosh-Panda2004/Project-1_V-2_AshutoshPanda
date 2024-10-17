// frontend/src/components/Admin/RuleLink.jsx

import React from 'react';
import { Handle } from 'react-flow-renderer';

const RuleLink = () => {
  return (
    <>
      <Handle type="target" position="left" />
      <Handle type="source" position="right" />
    </>
  );
};

export default RuleLink;
