import React from "react";
import { cn } from "@/utils/cn";

const RadioGroup = React.forwardRef(({ 
  className,
  name,
  value,
  onChange,
  options = [],
  label,
  error,
  ...props 
}, ref) => {
  const handleChange = (optionValue) => {
    if (onChange) {
      onChange({ target: { name, value: optionValue } });
    }
  };

  return (
    <div className={cn("space-y-1", className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="space-y-2">
        {options.map((option) => (
          <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => handleChange(option.value)}
              className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500 transition-all duration-200"
              ref={ref}
              {...props}
            />
            <span className="text-sm text-gray-700">{option.label}</span>
          </label>
        ))}
      </div>
      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
    </div>
  );
});

RadioGroup.displayName = "RadioGroup";

export default RadioGroup;