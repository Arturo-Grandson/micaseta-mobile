import { forwardRef, InputHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, fullWidth = false, ...props }, ref) => {
    const baseClasses =
      "px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors";
    const stateClasses = error
      ? "border-red-500 text-red-900 focus:ring-red-500 placeholder-red-300"
      : "border-gray-300 focus:border-primary-500";
    const widthClass = fullWidth ? "w-full" : "";

    const inputClasses = twMerge(
      baseClasses,
      stateClasses,
      widthClass,
      className
    );

    return (
      <div className={`${fullWidth ? "w-full" : ""} space-y-1`}>
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <input ref={ref} className={inputClasses} {...props} />
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    );
  }
);
