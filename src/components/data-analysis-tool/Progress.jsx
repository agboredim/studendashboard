import React from "react";

const Progress = ({ value = 0, className = "" }) => {
  // Ensure value is between 0 and 100
  const normalizedValue = Math.min(100, Math.max(0, value));

  return (
    <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
      <div
        className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-in-out"
        style={{ width: `${normalizedValue}%` }}
      />
    </div>
  );
};

export { Progress };
