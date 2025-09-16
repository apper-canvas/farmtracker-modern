import React from "react";
import { cn } from "@/utils/cn";

const Button = React.forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md", 
  children, 
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary-500 to-primary-700 text-white hover:from-primary-600 hover:to-primary-800 focus:ring-primary-500 shadow-md hover:shadow-lg transform hover:scale-105",
    secondary: "bg-gradient-to-r from-secondary-500 to-secondary-700 text-white hover:from-secondary-600 hover:to-secondary-800 focus:ring-secondary-500 shadow-md hover:shadow-lg transform hover:scale-105",
    accent: "bg-gradient-to-r from-accent-500 to-accent-700 text-white hover:from-accent-600 hover:to-accent-800 focus:ring-accent-500 shadow-md hover:shadow-lg transform hover:scale-105",
    outline: "border-2 border-primary-500 text-primary-500 hover:bg-gradient-to-r hover:from-primary-500 hover:to-primary-700 hover:text-white focus:ring-primary-500",
    ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-500"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };
  
  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;