
import React from 'react';
import { Link } from "react-router-dom";

interface CardProps {
  title: string;
  description: string;
  hint?: string;
  href: string;
  buttonText: string;
}

export const Card: React.FC<CardProps> = ({ 
  title, 
  description, 
  hint, 
  href, 
  buttonText 
}) => {
  return (
    <div className="card group">
      <h3 className="text-xl font-bold text-primary mb-3">{title}</h3>
      <p className="text-gray-700 mb-3">{description}</p>
      {hint && (
        <p className="text-gray-500 italic text-sm mb-5">{hint}</p>
      )}
      <div className="mt-auto pt-4">
        <Link to={href} className="btn block text-center w-full">
          {buttonText}
        </Link>
      </div>
    </div>
  );
};
