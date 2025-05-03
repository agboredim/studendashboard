import React from "react";

const ErrorMessage = ({
  title = "Error",
  message = "Something went wrong.",
  onRetry,
  retryLabel = "Try Again",
  className = "",
}) => (
  <div className={`container mx-auto px-4 py-12 text-center ${className}`}>
    <div className="bg-red-100 border border-red-400 text-red-700 p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <p className="mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          {retryLabel}
        </button>
      )}
    </div>
  </div>
);

export default ErrorMessage;