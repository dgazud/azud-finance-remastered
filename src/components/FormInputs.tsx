
import React from 'react';

interface FormInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  maxLength?: number;
  className?: string;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  name,
  value,
  onChange,
  type = 'text',
  required = false,
  readOnly = false,
  placeholder = '',
  min,
  max,
  step,
  maxLength,
  className = '',
}) => {
  return (
    <div className="mb-4">
      <label 
        htmlFor={name} 
        className="block text-primary font-bold text-lg mb-1"
      >
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        readOnly={readOnly}
        placeholder={placeholder}
        min={min}
        max={max}
        maxLength={maxLength}
        step={step}
        className={`form-input ${readOnly ? 'bg-gray-100 cursor-not-allowed' : ''} ${className}`}
      />
    </div>
  );
};

interface SelectOption {
  value: string;
  label: string;
}

interface FormSelectProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: SelectOption[];
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export const FormSelect: React.FC<FormSelectProps> = ({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
  disabled = false,
  placeholder = 'Seleccionar...',
  className = '',
}) => {
  return (
    <div className="mb-4">
      <label 
        htmlFor={name} 
        className="block text-primary font-bold text-lg mb-1"
      >
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`form-select ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''} ${className}`}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
