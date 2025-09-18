import React from "react";
import { cn } from "@/utils/cn";

const Checkbox = React.forwardRef(({ 
  className, 
  label,
  value,
  checked,
  onChange,
  ...props 
}, ref) => {
  const id = props.id || props.name;
  
  // Handle both single boolean and multi-value array scenarios
  const isChecked = Array.isArray(value) ? 
    value.includes(props.value || props.name) : 
    checked;
  
  const handleChange = (e) => {
    if (Array.isArray(value) && onChange) {
      // Multi-selection scenario (for Tag, Checkbox field types)
      const currentValue = props.value || props.name;
      let newValue;
      if (e.target.checked) {
        newValue = [...value, currentValue];
      } else {
        newValue = value.filter(v => v !== currentValue);
      }
      onChange({ target: { name: props.name, value: newValue } });
    } else if (onChange) {
      // Single checkbox scenario
      onChange(e);
    }
  };
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
        checked={isChecked}
        onChange={handleChange}
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