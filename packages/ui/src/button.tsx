import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const base =
    "px-4 py-2 rounded-btn font-medium transition-colors cursor-pointer";
  const variants = {
    primary: "bg-fuel-orange text-white hover:bg-fuel-orange-dark",
    secondary: "bg-fuel-light text-fuel-dark hover:bg-gray-200",
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
