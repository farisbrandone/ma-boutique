import React from "react";

interface ErrorMessageProps {
  message?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  if (!message) return null;

  return <p className="mt-1 text-sm text-red-600">{message}</p>;
};

export default ErrorMessage;
