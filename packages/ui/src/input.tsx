import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({
  label,
  error,
  className = "",
  id,
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-fuel-dark">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`px-3 py-2 rounded-btn border text-sm text-fuel-dark bg-white placeholder:text-fuel-gray transition-colors outline-none focus:border-fuel-orange focus:ring-1 focus:ring-fuel-orange ${error ? "border-red-500" : "border-gray-300"} ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
