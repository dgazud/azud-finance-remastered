
import React from 'react';

interface FormHeaderProps {
  title: string;
}

export const FormHeader: React.FC<FormHeaderProps> = ({ title }) => {
  return (
    <div className="section-header">
      <h2 className="text-2xl font-bold">{title}</h2>
      <div className="absolute right-5 top-1/2 transform -translate-y-1/2">
        <div className="text-white font-bold text-lg">AZUD</div>
      </div>
    </div>
  );
};
