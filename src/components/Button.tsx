
import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
}

export const Button = ({
  children,
  variant = 'primary',
  fullWidth = false,
  className,
  ...props
}: ButtonProps) => {
  const baseClasses = "relative overflow-hidden rounded-full font-bold transition-all duration-300 ease-out focus:outline-none px-6 py-3";
  
  const variantClasses = {
    primary: "bg-primary text-white hover:bg-opacity-90",
    secondary: "bg-secondary text-white hover:bg-opacity-90",
    outline: "bg-transparent border-2 border-secondary text-secondary hover:text-white hover:bg-secondary",
  };
  
  const widthClasses = fullWidth ? "w-full" : "";
  
  return (
    <button
      className={cn(baseClasses, variantClasses[variant], widthClasses, className)}
      {...props}
    >
      {children}
    </button>
  );
};
