import React from 'react';

interface TextInputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  className?: string;
  name?: string;
  error?: string;
  autoComplete?: string;
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  required = false,
  className = '',
  name,
  error,
  autoComplete,
}) => (
  <div>
    <label className="block mb-1 text-gray-700 font-medium" htmlFor={name}>
      {label}
    </label>
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      className={className + (error ? ' border-red-500' : '')}
      required={required}
      aria-invalid={!!error}
      aria-describedby={error ? `${name}-error` : undefined}
      autoComplete={autoComplete}
    />
    {error && (
      <div id={`${name}-error`} className="text-red-500 text-xs mt-1">
        {error}
      </div>
    )}
  </div>
);

export default TextInput;
