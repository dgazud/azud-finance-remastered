
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
      <div className="absolute top-0 right-0 w-20 h-20 bg-secondary/10 -mr-10 -mt-10 rounded-full transform transition-all duration-500 group-hover:scale-150 group-hover:bg-secondary/20"></div>
      <h3 className="text-xl font-bold text-primary mb-4 relative z-10">{title}</h3>
      <p className="text-gray-700 mb-4 relative z-10">{description}</p>
      {hint && (
        <p className="text-muted italic text-sm mb-5 relative z-10">{hint}</p>
      )}
      <div className="mt-auto pt-5 relative z-10">
        <Link to={href} className="inline-block w-full">
          <button className="w-full bg-primary text-white rounded-full py-3 px-6 font-medium hover:bg-primary/90 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 active:translate-y-0">
            {buttonText}
          </button>
        </Link>
      </div>
    </div>
  );
};
