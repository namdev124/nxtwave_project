import React from 'react';

const FailureView = ({ error, onTryAgain }) => (
  <div className="failure-container">
    <img
      src="https://assets.ccbp.in/frontend/content/react-js/list-creation-failure-lg-output.png"
      alt="Failure"
    />
    <p>{error}</p>
    <button onClick={onTryAgain}>Try Again</button>
  </div>
);

export default FailureView;
