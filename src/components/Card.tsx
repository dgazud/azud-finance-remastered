
import React from 'react';
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

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
    <div className="card group relative overflow-hidden transform transition-all duration-500 hover:-translate-y-2">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/10 -mr-12 -mt-12 rounded-full transform transition-all duration-500 group-hover:scale-150 group-hover:bg-secondary/20"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-accent/10 -ml-8 -mb-8 rounded-full transform transition-all duration-500 group-hover:scale-150 group-hover:bg-accent/20"></div>
      
      {/* Card content */}
      <div className="relative z-10">
        <h3 className="text-xl font-bold text-primary mb-4 group-hover:text-secondary transition-colors duration-300">{title}</h3>
        <p className="text-gray-700 mb-4">{description}</p>
        {hint && (
          <p className="text-muted italic text-sm mb-5">{hint}</p>
        )}
        <div className="mt-auto pt-5">
          <Link to={href} className="inline-block w-full">
            <button className="azud-btn w-full font-medium rounded-md">
              <span className="relative z-10">{buttonText}</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
