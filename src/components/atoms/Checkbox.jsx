import React from "react";
import { cn } from "@/utils/cn";

const Checkbox = React.forwardRef(({ 
  className, 
  label,
  ...props 
}, ref) => {
  const id = props.id || props.name;
  
  return (
    <div className="flex items-center space-x-2">
      <input
        type="checkbox"
        className={cn(
          "h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 transition-all duration-200",
          className
        )}
        ref={ref}
        id={id}
        {...props}
      />
      {label && (
        <label 
          htmlFor={id} 
          className="text-sm font-medium text-gray-700 cursor-pointer"
        >
          {label}
        </label>
      )}
    </div>
  );
});

Checkbox.displayName = "Checkbox";

export default Checkbox;