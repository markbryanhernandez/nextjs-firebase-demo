import React from 'react';

const Spinner: React.FC<{ size?: number; colorClass?: string }> = ({
  size = 24,
  colorClass = 'text-indigo-500',
}) => (
  <svg
    role="img"
    aria-label="Loading"
    className={`animate-spin ${colorClass}`}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
  </svg>
);

export default Spinner;
