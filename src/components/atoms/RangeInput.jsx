import React from "react";
import { cn } from "@/utils/cn";

const RangeInput = React.forwardRef(({ 
  className,
  label,
  error,
  value = "",
  onChange,
  min = 0,
  max = 10,
  step = 1,
  ...props 
}, ref) => {
  // Parse range value (e.g., "0-6" -> {min: 0, max: 6})
  const parseRangeValue = (rangeString) => {
    if (!rangeString || typeof rangeString !== 'string') {
      return { min: min, max: max };
    }
    const parts = rangeString.split('-');
    if (parts.length === 2) {
      return {
        min: parseInt(parts[0]) || min,
        max: parseInt(parts[1]) || max
      };
    }
    return { min: min, max: max };
  };

  const currentRange = parseRangeValue(value);

  const handleMinChange = (e) => {
    const newMin = parseInt(e.target.value) || min;
    const newMax = Math.max(newMin, currentRange.max);
    const newValue = `${newMin}-${newMax}`;
    if (onChange) {
      onChange({ target: { name: props.name, value: newValue } });
    }
  };

  const handleMaxChange = (e) => {
    const newMax = parseInt(e.target.value) || max;
    const newMin = Math.min(currentRange.min, newMax);
    const newValue = `${newMin}-${newMax}`;
    if (onChange) {
      onChange({ target: { name: props.name, value: newValue } });
    }
  };

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Min</label>
          <input
            type="number"
            value={currentRange.min}
            onChange={handleMinChange}
            min={min}
            max={max}
            step={step}
            className={cn(
              "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
              error && "border-red-500 focus:ring-red-500",
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Max</label>
          <input
            type="number"
            value={currentRange.max}
            onChange={handleMaxChange}
            min={min}
            max={max}
            step={step}
            className={cn(
              "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
              error && "border-red-500 focus:ring-red-500",
              className
            )}
          />
        </div>
      </div>
      <div className="text-xs text-gray-500">
        Current range: {currentRange.min} - {currentRange.max}
      </div>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

RangeInput.displayName = "RangeInput";

export default RangeInput;