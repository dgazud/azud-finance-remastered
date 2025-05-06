
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
  const baseClasses = "azud-btn";
  
  const variantClasses = {
    primary: "bg-primary text-white hover:text-primary border-primary",
    secondary: "bg-secondary text-primary border-secondary",
    outline: "bg-transparent border-2 border-secondary text-secondary hover:text-primary",
  };
  
  const widthClasses = fullWidth ? "w-full" : "";
  
  return (
    <button
      className={cn(baseClasses, variantClasses[variant], widthClasses, className)}
      {...props}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );
};
